#!/usr/bin/env python3
"""
lex 管理后台 —— 读写 data/*.json

只用标准库：这台机器总共 2G 内存，不值得为一个自用后台拖一套框架进来。
常驻内存约 25MB，systemd 那边还压了 MemoryMax=128M。

前台是纯静态，nginx 直接发文件；这个服务只挂在 /api/ 下面。
管理界面 admin/ 本身也是静态的，由 nginx 发 —— 它只是个壳，
所有数据读写都要过下面的鉴权。

环境变量：
  LEX_DATA_DIR   data/*.json 所在目录（默认 /var/www/lex.chuxin.cloud/public/data）
  LEX_BACKUP_DIR 写入前的备份目录，必须在 web 根之外
  LEX_CONFIG     口令散列等，600 权限
  LEX_PORT       监听端口，默认 8791，只绑 127.0.0.1
  LEX_STATIC_DIR 只用于本地开发：设了就顺带发静态文件，线上留空
"""

import hashlib
import hmac
import json
import mimetypes
import os
import posixpath
import re
import secrets
import threading
import time
import urllib.parse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

DATA_DIR = os.environ.get("LEX_DATA_DIR", "/var/www/lex.chuxin.cloud/public/data")
BACKUP_DIR = os.environ.get("LEX_BACKUP_DIR", "/home/ubuntu/lex-admin/backups")
CONFIG_PATH = os.environ.get("LEX_CONFIG", "/home/ubuntu/lex-admin/config.json")
PORT = int(os.environ.get("LEX_PORT", "8791"))
# 只在本地开发时设：设了就顺带发静态文件，整套能在一个进程里跑起来。
# 线上不设 —— 静态归 nginx，这个进程碰都不碰文件系统的其他地方。
STATIC_DIR = os.environ.get("LEX_STATIC_DIR", "")

KINDS = ("words", "roots", "essays")
ID_RE = re.compile(r"^[a-z0-9][a-z0-9._-]{0,63}$")

SESSION_TTL = 12 * 3600
BACKUP_KEEP = 30
MAX_BODY = 4 * 1024 * 1024          # 一条词条再长也不该有 4M

_lock = threading.Lock()            # 所有写入串行化，避免两个标签页同时保存互相盖掉
_sessions = {}                      # token -> 过期时间
_fails = {}                         # ip -> [失败次数, 最近一次时间]


# ---------- 口令 ----------

def load_config():
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def hash_pw(pw, salt):
    return hashlib.pbkdf2_hmac("sha256", pw.encode("utf-8"), bytes.fromhex(salt), 200_000).hex()


def check_pw(pw):
    try:
        cfg = load_config()
    except Exception:
        return False
    want = cfg.get("pw_hash", "")
    salt = cfg.get("salt", "")
    if not want or not salt:
        return False
    return hmac.compare_digest(hash_pw(pw, salt), want)


# ---------- 会话 ----------

def new_session():
    t = secrets.token_urlsafe(32)
    _sessions[t] = time.time() + SESSION_TTL
    # 顺手清理过期的，省得字典无限长
    now = time.time()
    for k in [k for k, v in _sessions.items() if v < now]:
        _sessions.pop(k, None)
    return t


def valid_session(token):
    if not token:
        return False
    exp = _sessions.get(token)
    if not exp:
        return False
    if exp < time.time():
        _sessions.pop(token, None)
        return False
    return True


def throttled(ip):
    """连续失败 8 次后锁 10 分钟。自用后台，够了。"""
    n, last = _fails.get(ip, (0, 0.0))
    if n >= 8 and time.time() - last < 600:
        return True
    return False


def note_fail(ip):
    n, last = _fails.get(ip, (0, 0.0))
    if time.time() - last > 600:
        n = 0
    _fails[ip] = (n + 1, time.time())


# ---------- 数据读写 ----------

def data_path(kind):
    return os.path.join(DATA_DIR, kind + ".json")


def read_kind(kind):
    with open(data_path(kind), "r", encoding="utf-8") as f:
        v = json.load(f)
    if not isinstance(v, list):
        raise ValueError(kind + ".json 顶层不是数组")
    return v


def backup(kind, items):
    os.makedirs(BACKUP_DIR, exist_ok=True)
    stamp = time.strftime("%Y%m%d-%H%M%S")
    p = os.path.join(BACKUP_DIR, "%s-%s.json" % (kind, stamp))
    with open(p, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
    old = sorted(x for x in os.listdir(BACKUP_DIR) if x.startswith(kind + "-"))
    for x in old[:-BACKUP_KEEP]:
        try:
            os.remove(os.path.join(BACKUP_DIR, x))
        except OSError:
            pass
    return p


def write_kind(kind, items):
    """先备份旧的，再原子替换 —— 半截文件会让前台整块空掉。"""
    path = data_path(kind)
    try:
        backup(kind, read_kind(kind))
    except Exception:
        pass                        # 首次写入时还没有旧文件，正常
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
        f.write("\n")
        f.flush()
        os.fsync(f.fileno())
    os.replace(tmp, path)


# ---------- 校验 ----------

class Bad(Exception):
    pass


def s(obj, key, required=False, label=None):
    v = obj.get(key)
    if v is None or v == "":
        if required:
            raise Bad("缺少「%s」" % (label or key))
        return ""
    if not isinstance(v, str):
        raise Bad("「%s」必须是文字" % (label or key))
    return v.strip()


def arr(obj, key, label=None):
    v = obj.get(key)
    if v is None:
        return []
    if not isinstance(v, list):
        raise Bad("「%s」必须是列表" % (label or key))
    return v


def clean_words(x):
    out = {"id": s(x, "id", True, "ID"), "w": s(x, "w", True, "单词"),
           "core": s(x, "core", True, "一句话核心释义")}
    pos = s(x, "pos")
    if pos:
        out["pos"] = pos
    src = x.get("sources") or {}
    if not isinstance(src, dict):
        raise Bad("「来源」格式不对")
    keep = {}
    for k, v in src.items():
        if not isinstance(v, str):
            raise Bad("来源「%s」必须是文字" % k)
        if v.strip():
            keep[k] = v.strip("\n")
    out["sources"] = keep
    if not keep:
        raise Bad("至少要写一个信息来源的正文")
    return out, []


def clean_roots(x):
    kind = s(x, "kind", True, "类型")
    if kind not in ("root", "prefix", "suffix"):
        raise Bad("「类型」只能是 root / prefix / suffix")
    out = {"id": s(x, "id", True, "ID"), "kind": kind,
           "form": s(x, "form", True, "词形"), "meaning": s(x, "meaning", True, "含义"),
           "gloss": s(x, "gloss"), "origin": s(x, "origin")}
    rel = [str(v).strip() for v in arr(x, "related", "相关词根") if str(v).strip()]
    if rel:
        out["related"] = rel
    senses = []
    for i, sn in enumerate(arr(x, "senses", "义项"), 1):
        if not isinstance(sn, dict):
            raise Bad("第 %d 个义项格式不对" % i)
        one = {"meaning": s(sn, "meaning", True, "第 %d 个义项的含义" % i),
               "gloss": s(sn, "gloss"), "note": s(sn, "note")}
        ws = []
        for j, w in enumerate(arr(sn, "words", "派生词"), 1):
            if not isinstance(w, dict):
                raise Bad("第 %d 个义项的第 %d 个派生词格式不对" % (i, j))
            item = {"w": s(w, "w", True, "第 %d.%d 个派生词" % (i, j)),
                    "def": s(w, "def", True, "第 %d.%d 个派生词的释义" % (i, j))}
            parts = []
            for p in arr(w, "parts", "构词成分"):
                if isinstance(p, list) and len(p) >= 3:
                    parts.append([str(p[0]).strip(), str(p[1]).strip(), str(p[2]).strip()])
            if parts:
                item["parts"] = parts
            ex = s(w, "ex")
            if ex:
                item["ex"] = ex
            ws.append(item)
        one["words"] = ws
        senses.append(one)
    if not senses:
        raise Bad("至少要有一个义项")
    out["senses"] = senses
    return out, []


def clean_essays(x):
    out = {"id": s(x, "id", True, "ID"), "title": s(x, "title", True, "标题"),
           "prompt": s(x, "prompt", True, "题目"),
           "exam": s(x, "exam"), "part": s(x, "part"), "topic": s(x, "topic"),
           "genre": s(x, "genre"), "level": s(x, "level"),
           "takeaway": s(x, "takeaway")}

    y = x.get("year")
    if y in (None, "", "null"):
        out["year"] = None
    else:
        try:
            out["year"] = int(y)
        except (TypeError, ValueError):
            raise Bad("「年份」要么留空，要么是数字")

    outline = []
    for i, o in enumerate(arr(x, "outline", "提纲"), 1):
        if not isinstance(o, dict):
            raise Bad("第 %d 条提纲格式不对" % i)
        outline.append({"label": s(o, "label", True, "第 %d 条提纲的标签" % i),
                        "purpose": s(o, "purpose", True, "第 %d 条提纲的说明" % i)})
    out["outline"] = outline

    warnings = []
    paragraphs = []
    for i, p in enumerate(arr(x, "paragraphs", "段落"), 1):
        if not isinstance(p, dict):
            raise Bad("第 %d 段格式不对" % i)
        text = s(p, "text", True, "第 %d 段正文" % i)
        one = {"role": s(p, "role"), "text": text}
        notes = []
        for j, n in enumerate(arr(p, "notes", "批注"), 1):
            if not isinstance(n, dict):
                raise Bad("第 %d 段第 %d 条批注格式不对" % (i, j))
            mark = s(n, "mark", True, "第 %d 段第 %d 条批注锚定的短语" % (i, j))
            # 锚不上不算错误 —— 前台会静默跳过。但必须让人看见，
            # 否则改了正文之后批注会无声消失（这是这份数据最容易坏的地方）。
            if mark not in text:
                warnings.append("第 %d 段第 %d 条批注：「%s」在正文里找不到，前台会跳过它" % (i, j, mark))
            notes.append({"mark": mark, "note": s(n, "note", True, "第 %d 段第 %d 条批注内容" % (i, j))})
        if notes:
            one["notes"] = notes
        an = s(p, "analysis")
        if an:
            one["analysis"] = an
        paragraphs.append(one)
    if not paragraphs:
        raise Bad("至少要有一段正文")
    out["paragraphs"] = paragraphs

    hls = []
    for i, h in enumerate(arr(x, "highlights", "可迁移表达"), 1):
        if not isinstance(h, dict):
            raise Bad("第 %d 条可迁移表达格式不对" % i)
        hls.append({"en": s(h, "en", True, "第 %d 条表达的英文" % i),
                    "zh": s(h, "zh", True, "第 %d 条表达的中文" % i),
                    "why": s(h, "why")})
    out["highlights"] = hls

    # 字数没填就按正文数，省得手动算
    try:
        n = int(x.get("words") or 0)
    except (TypeError, ValueError):
        n = 0
    if n <= 0:
        n = sum(len(p["text"].split()) for p in paragraphs)
    out["words"] = n
    return out, warnings


CLEANERS = {"words": clean_words, "roots": clean_roots, "essays": clean_essays}


# ---------- HTTP ----------

class Handler(BaseHTTPRequestHandler):
    server_version = "lex-admin"
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt, *args):
        pass                        # journald 里不需要每条请求

    # -- 基础工具 --

    def client_ip(self):
        return self.headers.get("CF-Connecting-IP") or self.client_address[0]

    def send_json(self, code, obj, cookie=None):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        if cookie:
            self.send_header("Set-Cookie", cookie)
        self.end_headers()
        self.wfile.write(body)

    def fail(self, code, msg, **extra):
        d = {"ok": False, "error": msg}
        d.update(extra)
        self.send_json(code, d)

    def read_body(self):
        n = int(self.headers.get("Content-Length") or 0)
        if n <= 0:
            return {}
        if n > MAX_BODY:
            raise Bad("内容太大了")
        try:
            return json.loads(self.rfile.read(n).decode("utf-8"))
        except Exception:
            raise Bad("请求体不是合法 JSON")

    def session_cookie(self, token, ttl):
        """
        Secure 跟着实际协议走：线上 nginx 会带 X-Forwarded-Proto: https，
        本地 http 上要是硬加 Secure，浏览器直接不存这个 cookie。
        """
        https = self.headers.get("X-Forwarded-Proto") == "https"
        return "lexsid=%s; Path=/; HttpOnly;%s SameSite=Lax; Max-Age=%d" % (
            token, " Secure;" if https else "", ttl)

    def token(self):
        raw = self.headers.get("Cookie") or ""
        for part in raw.split(";"):
            k, _, v = part.strip().partition("=")
            if k == "lexsid":
                return v
        return ""

    def require_auth(self):
        if valid_session(self.token()):
            return True
        self.fail(401, "没有登录或登录已过期")
        return False

    def require_write_header(self):
        """
        写操作必须带这个自定义头。跨站表单发不出自定义头，
        配合 SameSite=Lax 的 cookie，CSRF 就没有着力点了。
        """
        if self.headers.get("X-Lex-Admin") == "1":
            return True
        self.fail(400, "缺少 X-Lex-Admin 头")
        return False

    # -- 路由 --

    def do_GET(self):
        path = self.path.split("?")[0]
        if path == "/api/health":
            return self.send_json(200, {"ok": True})
        if path == "/api/session":
            return self.send_json(200, {"ok": True, "authed": valid_session(self.token())})
        if path.startswith("/api/data/"):
            if not self.require_auth():
                return
            kind = path[len("/api/data/"):].strip("/")
            if kind not in KINDS:
                return self.fail(404, "没有这个板块")
            try:
                return self.send_json(200, {"ok": True, "items": read_kind(kind)})
            except Exception as e:
                return self.fail(500, "读取失败：%s" % e)
        if STATIC_DIR and not path.startswith("/api/"):
            return self.serve_static(path)
        return self.fail(404, "没有这个接口")

    def serve_static(self, path):
        """只在本地开发时启用。逐段规范化并确认没跑出根目录。"""
        root = os.path.realpath(STATIC_DIR)
        rel = urllib.parse.unquote(path)
        rel = posixpath.normpath(rel).lstrip("/")
        full = os.path.realpath(os.path.join(root, rel))
        if full != root and not full.startswith(root + os.sep):
            return self.fail(403, "越界")
        if os.path.isdir(full):
            full = os.path.join(full, "index.html")
        if not os.path.isfile(full):
            return self.fail(404, "没有这个文件")
        ctype = mimetypes.guess_type(full)[0] or "application/octet-stream"
        if ctype.startswith("text/") or ctype in ("application/javascript", "application/json"):
            ctype += "; charset=utf-8"
        with open(full, "rb") as f:
            body = f.read()
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        path = self.path.split("?")[0]
        try:
            body = self.read_body()
        except Bad as e:
            return self.fail(400, str(e))

        if path == "/api/login":
            ip = self.client_ip()
            if throttled(ip):
                return self.fail(429, "失败次数过多，等 10 分钟再试")
            pw = body.get("password") or ""
            if not isinstance(pw, str) or not check_pw(pw):
                note_fail(ip)
                return self.fail(401, "口令不对")
            _fails.pop(ip, None)
            t = new_session()
            return self.send_json(200, {"ok": True}, cookie=self.session_cookie(t, SESSION_TTL))

        if path == "/api/logout":
            _sessions.pop(self.token(), None)
            return self.send_json(200, {"ok": True}, cookie=self.session_cookie("", 0))

        return self.fail(404, "没有这个接口")

    def do_PUT(self):
        path = self.path.split("?")[0]
        if not path.startswith("/api/data/"):
            return self.fail(404, "没有这个接口")
        if not self.require_auth() or not self.require_write_header():
            return
        rest = path[len("/api/data/"):].strip("/").split("/")
        if len(rest) != 2 or rest[0] not in KINDS:
            return self.fail(404, "路径不对")
        kind, ent_id = rest[0], rest[1]
        if not ID_RE.match(ent_id):
            return self.fail(400, "ID 只能用小写字母、数字、点、横线、下划线，且以字母或数字开头")

        try:
            body = self.read_body()
            if not isinstance(body, dict):
                raise Bad("请求体要是一个对象")
            body["id"] = ent_id
            entry, warnings = CLEANERS[kind](body)
        except Bad as e:
            return self.fail(400, str(e))
        except Exception as e:
            return self.fail(400, "校验失败：%s" % e)

        with _lock:
            try:
                items = read_kind(kind)
            except Exception as e:
                return self.fail(500, "读取失败：%s" % e)
            at = next((i for i, v in enumerate(items) if v.get("id") == ent_id), -1)
            created = at < 0
            if created:
                items.append(entry)
            else:
                items[at] = entry
            try:
                write_kind(kind, items)
            except Exception as e:
                return self.fail(500, "写入失败：%s" % e)
        return self.send_json(200, {"ok": True, "created": created,
                                    "total": len(items), "warnings": warnings})

    def do_DELETE(self):
        path = self.path.split("?")[0]
        if not path.startswith("/api/data/"):
            return self.fail(404, "没有这个接口")
        if not self.require_auth() or not self.require_write_header():
            return
        rest = path[len("/api/data/"):].strip("/").split("/")
        if len(rest) != 2 or rest[0] not in KINDS:
            return self.fail(404, "路径不对")
        kind, ent_id = rest[0], rest[1]

        with _lock:
            try:
                items = read_kind(kind)
            except Exception as e:
                return self.fail(500, "读取失败：%s" % e)
            keep = [v for v in items if v.get("id") != ent_id]
            if len(keep) == len(items):
                return self.fail(404, "没有这个条目")
            try:
                write_kind(kind, keep)
            except Exception as e:
                return self.fail(500, "写入失败：%s" % e)
        return self.send_json(200, {"ok": True, "total": len(keep)})


def main():
    os.makedirs(BACKUP_DIR, exist_ok=True)
    srv = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    srv.daemon_threads = True
    print("lex-admin 监听 127.0.0.1:%d，数据目录 %s" % (PORT, DATA_DIR), flush=True)
    srv.serve_forever()


if __name__ == "__main__":
    main()
