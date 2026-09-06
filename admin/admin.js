/* ============================================================
   lex 后台 —— 加 / 改 / 删单词、词根、范文

   三种内容形状差得远，但编辑器只写一个：字段表（SCHEMAS）驱动渲染，
   list 类型可以嵌套（范文的段落里还套着批注）。加字段＝改 SCHEMAS。

   markdown 预览复用前台那一份 assets/js/md.js，不另写。
   ============================================================ */
(function () {
  "use strict";

  const $ = s => document.querySelector(s);
  const esc = window.lexEsc, md = window.lexMd;

  /* ---------- 取值 / 存值：支持 "sources.ai"、"paragraphs.0.notes.1.mark" ---------- */
  const getPath = (o, p) => p.split(".").reduce((a, k) => (a == null ? a : a[k]), o);
  function setPath(o, p, v) {
    const ks = p.split(".");
    let cur = o;
    for (let i = 0; i < ks.length - 1; i++) {
      const k = ks[i];
      if (cur[k] == null) cur[k] = /^\d+$/.test(ks[i + 1]) ? [] : {};
      cur = cur[k];
    }
    cur[ks[ks.length - 1]] = v;
  }

  /* 构词成分在数据里是 [[形式, 含义, 类型], …]，
     在表单里写成一行一个「in- | 向内 | prefix」—— 比三个输入框好使 */
  const partsToText = v => (v || []).map(p => (p || []).join(" | ")).join("\n");
  const partsFromText = t => String(t || "").split("\n").map(l => l.trim()).filter(Boolean)
    .map(l => {
      const a = l.split("|").map(x => x.trim());
      return [a[0] || "", a[1] || "", a[2] || "root"];
    });

  const csvToText = v => (v || []).join(", ");
  const csvFromText = t => String(t || "").split(/[,，\s]+/).map(x => x.trim()).filter(Boolean);

  /* ---------- 字段表 ---------- */
  const SCHEMAS = {
    words: {
      label: "单词",
      title: x => x.w || x.id,
      sub: x => x.core || "",
      blank: () => ({ id: "", w: "", pos: "", core: "", sources: { ai: "" } }),
      fields: [
        { k: "id", label: "ID", type: "text", hint: "小写字母数字，一般就是单词本身。改 ID 等于另存一条新的" },
        { k: "w", label: "单词", type: "text" },
        { k: "pos", label: "词性", type: "text", placeholder: "v./n." },
        { k: "core", label: "一句话核心释义", type: "area", rows: 2,
          hint: "列表行和页头副标题都用它。正文里不要再重复一遍" },
        { k: "sources.ai", label: "AI 解析", type: "md", rows: 18 },
        { k: "sources.dict", label: "词典释义", type: "md", rows: 5 },
        { k: "sources.corpus", label: "例句库", type: "md", rows: 5 },
        { k: "sources.note", label: "我的笔记", type: "md", rows: 5 }
      ]
    },

    roots: {
      label: "词根",
      title: x => x.form || x.id,
      sub: x => x.meaning || "",
      blank: () => ({ id: "", form: "", kind: "root", meaning: "", gloss: "", origin: "",
                      related: [], senses: [] }),
      fields: [
        { k: "id", label: "ID", type: "text", hint: "小写，比如 spect" },
        { k: "form", label: "词形", type: "text", hint: "一形多写用斜杠分开：spect / spic / spec" },
        { k: "kind", label: "类型", type: "select",
          options: [["root", "词根"], ["prefix", "前缀"], ["suffix", "后缀"]] },
        { k: "meaning", label: "含义", type: "text", placeholder: "看" },
        { k: "gloss", label: "英文注解", type: "text", placeholder: "to look, to watch" },
        { k: "origin", label: "词源", type: "text", placeholder: "拉丁语 specere（看）" },
        { k: "related", label: "相关词根", type: "csv", hint: "填其他条目的 ID，逗号分开" },
        { k: "senses", label: "义项", type: "list",
          itemLabel: (it, i) => `义项 ${i + 1}${it.meaning ? " · " + it.meaning : ""}`,
          blank: () => ({ meaning: "", gloss: "", note: "", words: [] }),
          fields: [
            { k: "meaning", label: "这一层的含义", type: "text" },
            { k: "gloss", label: "英文注解", type: "text" },
            { k: "note", label: "说明", type: "md", rows: 4 },
            { k: "words", label: "派生词", type: "list",
              itemLabel: (it, i) => it.w || `派生词 ${i + 1}`,
              blank: () => ({ w: "", def: "", parts: [], ex: "" }),
              fields: [
                { k: "w", label: "单词", type: "text" },
                { k: "def", label: "释义", type: "text" },
                { k: "parts", label: "构词成分", type: "parts", rows: 3,
                  hint: "一行一个：形式 | 含义 | prefix｜root｜suffix" },
                { k: "ex", label: "例句", type: "text" }
              ] }
          ] }
      ]
    },

    essays: {
      label: "范文",
      title: x => x.title || x.id,
      sub: x => [x.exam, x.year ? x.year + " 年" : null, x.part].filter(Boolean).join(" · "),
      blank: () => ({ id: "", title: "", exam: "", year: "", part: "", topic: "", genre: "",
                      level: "", words: "", prompt: "", outline: [], paragraphs: [],
                      highlights: [], takeaway: "" }),
      fields: [
        { k: "id", label: "ID", type: "text", hint: "比如 ky2012-a、e003" },
        { k: "title", label: "标题", type: "text" },
        { k: "exam", label: "考试", type: "text", placeholder: "考研英语一 / 雅思" },
        { k: "year", label: "年份", type: "text", hint: "非真题就留空" },
        { k: "part", label: "题型", type: "text", placeholder: "小作文 / 大作文 / Task 2" },
        { k: "topic", label: "主题", type: "text", placeholder: "教育" },
        { k: "genre", label: "体裁", type: "text", placeholder: "议论文 · 讨论双方观点" },
        { k: "level", label: "档次", type: "text", placeholder: "高分参考 / 7.5 分档" },
        { k: "words", label: "词数", type: "text", hint: "留空就按正文自动数" },
        { k: "prompt", label: "题目", type: "area", rows: 4 },
        { k: "outline", label: "提纲", type: "list",
          itemLabel: (it, i) => it.label || `第 ${i + 1} 条`,
          blank: () => ({ label: "", purpose: "" }),
          fields: [
            { k: "label", label: "标签", type: "text", placeholder: "第 1 段 · 引入" },
            { k: "purpose", label: "这段干什么", type: "text" }
          ] },
        { k: "paragraphs", label: "正文段落", type: "list",
          itemLabel: (it, i) => `第 ${i + 1} 段${it.role ? " · " + it.role : ""}`,
          blank: () => ({ role: "", text: "", notes: [], analysis: "" }),
          fields: [
            { k: "role", label: "段落角色", type: "text", placeholder: "引入段" },
            { k: "text", label: "英文正文", type: "area", rows: 6, en: true },
            { k: "notes", label: "批注", type: "list",
              itemLabel: (it, i) => it.mark || `批注 ${i + 1}`,
              blank: () => ({ mark: "", note: "" }),
              /* 批注靠子串精确匹配锚定，锚不上前台会静默跳过 —— 这里当场报出来 */
              warn: (it, parent) => {
                const m = (it.mark || "").trim();
                if (!m) return null;
                return (parent && String(parent.text || "").indexOf(m) >= 0)
                  ? null : "这段正文里找不到这个短语，前台会跳过这条批注";
              },
              fields: [
                { k: "mark", label: "锚定的短语", type: "text", en: true,
                  hint: "必须和正文里的写法一模一样" },
                { k: "note", label: "批注内容", type: "md", rows: 3 }
              ] },
            { k: "analysis", label: "段落点评", type: "md", rows: 3 }
          ] },
        { k: "highlights", label: "可迁移表达", type: "list",
          itemLabel: (it, i) => it.en || `第 ${i + 1} 条`,
          blank: () => ({ en: "", zh: "", why: "" }),
          fields: [
            { k: "en", label: "英文", type: "text", en: true },
            { k: "zh", label: "中文", type: "text" },
            { k: "why", label: "好在哪", type: "text" }
          ] },
        { k: "takeaway", label: "小结", type: "md", rows: 4 }
      ]
    }
  };

  const KINDS = ["words", "roots", "essays"];

  /* ---------- 接口 ---------- */
  async function api(method, path, body) {
    const opt = { method: method, credentials: "same-origin", headers: {} };
    if (method !== "GET") opt.headers["X-Lex-Admin"] = "1";
    if (body !== undefined) {
      opt.headers["Content-Type"] = "application/json";
      opt.body = JSON.stringify(body);
    }
    const r = await fetch("/api" + path, opt);
    let j;
    try { j = await r.json(); } catch (e) { j = { ok: false, error: "服务器返回的不是 JSON（HTTP " + r.status + "）" }; }
    if (!r.ok || !j.ok) {
      const err = new Error(j.error || "HTTP " + r.status);
      err.status = r.status;
      throw err;
    }
    return j;
  }

  /* ---------- 状态 ---------- */
  let kind = "words";
  let items = [];
  let model = null;         // 正在编辑的那条（表单形态）
  let originalId = null;    // 进入编辑时的 id，用来判断是不是改了 ID
  let filter = "";
  let dirty = false;

  /* ---------- 表单 <-> 数据 ---------- */
  function toForm(entry, fields) {
    const o = JSON.parse(JSON.stringify(entry));
    (function walk(fs, obj) {
      fs.forEach(f => {
        if (f.type === "list") {
          const a = getPath(obj, f.k) || [];
          setPath(obj, f.k, a);
          a.forEach(it => walk(f.fields, it));
        } else if (f.type === "parts") {
          setPath(obj, f.k, partsToText(getPath(obj, f.k)));
        } else if (f.type === "csv") {
          setPath(obj, f.k, csvToText(getPath(obj, f.k)));
        }
      });
    })(fields, o);
    return o;
  }

  function fromForm(form, fields) {
    const o = JSON.parse(JSON.stringify(form));
    (function walk(fs, obj) {
      fs.forEach(f => {
        if (f.type === "list") {
          const a = getPath(obj, f.k) || [];
          a.forEach(it => walk(f.fields, it));
        } else if (f.type === "parts") {
          setPath(obj, f.k, partsFromText(getPath(obj, f.k)));
        } else if (f.type === "csv") {
          setPath(obj, f.k, csvFromText(getPath(obj, f.k)));
        }
      });
    })(fields, o);
    return o;
  }

  /* ---------- 渲染：字段 ---------- */
  function fieldHtml(f, path, val) {
    const id = "f_" + path.replace(/[^\w]/g, "_");
    const hint = f.hint ? `<div class="fhint">${esc(f.hint)}</div>` : "";
    const cls = f.en ? " is-en" : "";
    let ctl;

    if (f.type === "select") {
      ctl = `<select id="${id}" data-path="${esc(path)}">${f.options.map(([v, l]) =>
        `<option value="${esc(v)}"${String(val) === v ? " selected" : ""}>${esc(l)}</option>`).join("")}</select>`;
    } else if (f.type === "area" || f.type === "parts") {
      ctl = `<textarea id="${id}" class="fin${cls}" rows="${f.rows || 3}" data-path="${esc(path)}"
        ${f.placeholder ? `placeholder="${esc(f.placeholder)}"` : ""}>${esc(val == null ? "" : val)}</textarea>`;
    } else if (f.type === "md") {
      ctl = `<div class="mdfield">
          <div class="mdbar">
            <button type="button" class="opt" data-preview="${esc(path)}">预览</button>
            <span class="mdhint">支持 ## 标题、**粗体**、*斜体*、- 列表、&gt; 引用、--- 分隔线</span>
          </div>
          <textarea id="${id}" class="fin fin--md" rows="${f.rows || 6}" data-path="${esc(path)}">${esc(val == null ? "" : val)}</textarea>
          <div class="mdprev md" data-prevfor="${esc(path)}" hidden></div>
        </div>`;
    } else {
      ctl = `<input id="${id}" class="fin${cls}" type="text" data-path="${esc(path)}"
        value="${esc(val == null ? "" : val)}"
        ${f.placeholder ? `placeholder="${esc(f.placeholder)}"` : ""}>`;
    }

    return `<div class="frow"><label class="flabel" for="${id}">${esc(f.label)}</label>${ctl}${hint}</div>`;
  }

  function listHtml(f, path, arrv, parent) {
    const a = arrv || [];
    const body = a.map((it, i) => {
      const ipath = path + "." + i;
      const w = f.warn ? f.warn(it, parent) : null;
      return `<div class="litem" data-litem="${esc(ipath)}">
        <div class="lhead">
          <span class="lname">${esc(f.itemLabel ? f.itemLabel(it, i) : "第 " + (i + 1) + " 项")}</span>
          <span class="lbtns">
            <button type="button" class="opt" data-move="${esc(ipath)}:-1"${i === 0 ? " disabled" : ""}>↑</button>
            <button type="button" class="opt" data-move="${esc(ipath)}:1"${i === a.length - 1 ? " disabled" : ""}>↓</button>
            <button type="button" class="opt opt--del" data-del="${esc(ipath)}">删除</button>
          </span>
        </div>
        ${w ? `<div class="fwarn">${esc(w)}</div>` : ""}
        <div class="lbody">${f.fields.map(sf =>
          sf.type === "list"
            ? listHtml(sf, ipath + "." + sf.k, getPath(it, sf.k), it)
            : fieldHtml(sf, ipath + "." + sf.k, getPath(it, sf.k))).join("")}</div>
      </div>`;
    }).join("");

    return `<section class="flist" data-flist="${esc(path)}">
      <div class="flisthead">
        <h3>${esc(f.label)}<span>${a.length}</span></h3>
        <button type="button" class="opt" data-add="${esc(path)}">＋ 加一条</button>
      </div>
      ${body || `<p class="hint">还没有内容。</p>`}
    </section>`;
  }

  function editorHtml() {
    const sc = SCHEMAS[kind];
    return `<form class="editor" id="editor" autocomplete="off">
      ${sc.fields.map(f => f.type === "list"
        ? listHtml(f, f.k, getPath(model, f.k), model)
        : fieldHtml(f, f.k, getPath(model, f.k))).join("")}
    </form>`;
  }

  /* ---------- 渲染：整页 ---------- */
  function render() {
    $("#nav").innerHTML = KINDS.map(k =>
      `<a class="navitem${k === kind ? " is-active" : ""}" href="#" data-kind="${k}">${esc(SCHEMAS[k].label)}
        <span class="navitem__n">${k === kind ? items.length : ""}</span></a>`).join("");

    const q = filter.trim().toLowerCase();
    const sc = SCHEMAS[kind];
    const list = items.filter(x => !q ||
      (sc.title(x) + " " + sc.sub(x) + " " + x.id).toLowerCase().indexOf(q) >= 0);

    $("#view").innerHTML = `<div class="admin">
      <aside class="apane">
        <div class="asearch">
          <input id="filter" type="search" placeholder="过滤 ${esc(sc.label)}…" value="${esc(filter)}">
          <button class="opt is-on" id="newBtn">＋ 新建</button>
        </div>
        <div class="rows alist">${list.length ? list.map(x => `<a class="row" href="#" data-open="${esc(x.id)}">
            <span class="row__w${kind === "essays" ? " row__w--cn" : " en"}">${esc(sc.title(x))}</span>
            <span class="row__d">${esc(sc.sub(x))}</span>
          </a>`).join("") : `<p class="hint">没有匹配的条目。</p>`}</div>
      </aside>
      <div class="aedit">
        ${model ? `
          <div class="ahead">
            <h1>${originalId ? "编辑" : "新建"}${esc(sc.label)}${originalId ? ` <code>${esc(originalId)}</code>` : ""}</h1>
            <div class="abtns">
              ${originalId ? `<button class="opt opt--del" id="delBtn">删除</button>` : ""}
              <button class="opt" id="cancelBtn">放弃</button>
              <button class="opt is-on" id="saveBtn">保存</button>
            </div>
          </div>
          <div id="msg"></div>
          ${editorHtml()}
        ` : `<div class="empty"><p>从左边选一条来改，或者点「＋ 新建」。</p></div>`}
      </div>
    </div>`;

    const fi = $("#filter");
    if (fi && document.activeElement !== fi) fi.value = filter;
  }

  function msg(text, kindCls) {
    const el = $("#msg");
    if (el) el.innerHTML = `<div class="amsg amsg--${kindCls}">${text}</div>`;
  }

  /* 只重画编辑器（增删列表项之后），列表和头部不动 */
  function reRenderEditor() {
    const f = $("#editor");
    if (f) f.outerHTML = editorHtml();
  }

  /* ---------- 载入 ---------- */
  async function loadKind(k) {
    kind = k;
    model = null;
    originalId = null;
    dirty = false;
    const r = await api("GET", "/data/" + k);
    items = r.items;
    render();
  }

  function openEntry(id) {
    const x = items.find(v => v.id === id);
    if (!x) return;
    model = toForm(x, SCHEMAS[kind].fields);
    originalId = id;
    dirty = false;
    render();
  }

  function newEntry() {
    model = toForm(SCHEMAS[kind].blank(), SCHEMAS[kind].fields);
    originalId = null;
    dirty = false;
    render();
  }

  async function save() {
    const sc = SCHEMAS[kind];
    const entry = fromForm(model, sc.fields);
    const id = String(entry.id || "").trim();
    if (!id) { msg("先填 ID", "bad"); return; }
    if (!originalId && items.some(v => v.id === id)) {
      msg(`已经有一条 ID 是 <code>${esc(id)}</code> 的了，换一个`, "bad");
      return;
    }
    try {
      const r = await api("PUT", "/data/" + kind + "/" + encodeURIComponent(id), entry);
      const warn = (r.warnings || []).length
        ? `<div class="amsg amsg--warn">保存了，但有 ${r.warnings.length} 处要注意：<ul>${
            r.warnings.map(w => `<li>${esc(w)}</li>`).join("")}</ul></div>`
        : "";
      /* 改了 ID 等于另存一条，旧的那条还在，得说清楚 */
      const renamed = originalId && originalId !== id
        ? `<div class="amsg amsg--warn">你把 ID 从 <code>${esc(originalId)}</code> 改成了
           <code>${esc(id)}</code>，这是新存了一条，旧的那条还在。</div>` : "";
      await loadKind(kind);
      openEntry(id);
      msg(`${r.created ? "已新增" : "已保存"}，当前共 ${r.total} 条${renamed || warn ? "" : "。前台刷新即可看到"}`
          , "ok");
      if (renamed || warn) $("#msg").innerHTML += renamed + warn;
    } catch (e) {
      msg(esc(e.message), "bad");
    }
  }

  async function del() {
    if (!originalId) return;
    if (!confirm(`确定删除「${SCHEMAS[kind].title(items.find(v => v.id === originalId) || {})}」？\n删掉之前会自动备份到服务器上。`)) return;
    try {
      await api("DELETE", "/data/" + kind + "/" + encodeURIComponent(originalId));
      await loadKind(kind);
    } catch (e) {
      msg(esc(e.message), "bad");
    }
  }

  /* ---------- 登录 ---------- */
  function loginView(err) {
    $("#nav").innerHTML = "";
    $("#who").textContent = "";
    $("#view").innerHTML = `<div class="view--read login">
      <h1>lex 后台</h1>
      <p class="hint">口令在服务器上 <code>~/lex-admin/password.txt</code>。</p>
      <form id="loginForm">
        <input id="pw" class="fin" type="password" placeholder="口令" autocomplete="current-password">
        <button class="opt is-on" type="submit">进去</button>
      </form>
      ${err ? `<div class="amsg amsg--bad">${esc(err)}</div>` : ""}
    </div>`;
    const p = $("#pw");
    if (p) p.focus();
  }

  async function boot() {
    let authed = false;
    try {
      const r = await api("GET", "/session");
      authed = r.authed;
    } catch (e) { /* 后端没起来也走登录界面 */ }
    if (!authed) { loginView(); return; }
    $("#who").innerHTML = `<button class="opt" id="logoutBtn">退出</button>`;
    await loadKind(kind);
  }

  /* ---------- 交互 ---------- */
  document.addEventListener("submit", async e => {
    if (e.target.id === "loginForm") {
      e.preventDefault();
      try {
        await api("POST", "/login", { password: $("#pw").value });
        await boot();
      } catch (err) {
        loginView(err.message);
      }
      return;
    }
    if (e.target.id === "editor") e.preventDefault();
  });

  document.addEventListener("click", async e => {
    const t = e.target;

    const k = t.closest("[data-kind]");
    if (k) {
      e.preventDefault();
      if (dirty && !confirm("有没保存的改动，确定切换？")) return;
      await loadKind(k.dataset.kind);
      return;
    }

    const op = t.closest("[data-open]");
    if (op) {
      e.preventDefault();
      if (dirty && !confirm("有没保存的改动，确定切换？")) return;
      openEntry(op.dataset.open);
      return;
    }

    if (t.closest("#newBtn")) { if (!dirty || confirm("有没保存的改动，确定新建？")) newEntry(); return; }
    if (t.closest("#saveBtn")) { save(); return; }
    if (t.closest("#cancelBtn")) { model = null; originalId = null; dirty = false; render(); return; }
    if (t.closest("#delBtn")) { del(); return; }
    if (t.closest("#logoutBtn")) { await api("POST", "/logout"); loginView(); return; }

    const add = t.closest("[data-add]");
    if (add) {
      const path = add.dataset.add;
      const f = findField(path);
      const a = getPath(model, path) || [];
      a.push(toForm(f.blank(), f.fields));
      setPath(model, path, a);
      dirty = true;
      reRenderEditor();
      return;
    }

    const del2 = t.closest("[data-del]");
    if (del2) {
      const path = del2.dataset.del;
      const i = +path.split(".").pop();
      const arrPath = path.split(".").slice(0, -1).join(".");
      const a = getPath(model, arrPath) || [];
      a.splice(i, 1);
      dirty = true;
      reRenderEditor();
      return;
    }

    const mv = t.closest("[data-move]");
    if (mv) {
      const [path, d] = mv.dataset.move.split(":");
      const i = +path.split(".").pop(), step = +d;
      const arrPath = path.split(".").slice(0, -1).join(".");
      const a = getPath(model, arrPath) || [];
      const j = i + step;
      if (j < 0 || j >= a.length) return;
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
      dirty = true;
      reRenderEditor();
      return;
    }

    const pv = t.closest("[data-preview]");
    if (pv) {
      const path = pv.dataset.preview;
      const box = document.querySelector(`[data-prevfor="${CSS.escape(path)}"]`);
      if (!box) return;
      if (box.hidden) {
        box.innerHTML = md(getPath(model, path) || "") || `<p class="hint">还是空的。</p>`;
        box.hidden = false;
        pv.classList.add("is-on");
      } else {
        box.hidden = true;
        pv.classList.remove("is-on");
      }
      return;
    }
  });

  /* 输入：只写进 model，不重画（重画会丢焦点）。警告文字就地更新 */
  document.addEventListener("input", e => {
    const el = e.target;
    if (el.id === "filter") { filter = el.value; render(); $("#filter").focus(); return; }
    if (!el.dataset || !el.dataset.path || !model) return;
    setPath(model, el.dataset.path, el.value);
    dirty = true;
    refreshWarnings();
  });

  document.addEventListener("change", e => {
    const el = e.target;
    if (el.tagName === "SELECT" && el.dataset.path && model) {
      setPath(model, el.dataset.path, el.value);
      dirty = true;
    }
  });

  /* 批注锚不上是这份数据最容易坏的地方，边打字边提示 */
  function refreshWarnings() {
    document.querySelectorAll("[data-litem]").forEach(box => {
      const path = box.dataset.litem;
      const f = findField(path.split(".").slice(0, -1).join("."));
      if (!f || !f.warn) return;
      const item = getPath(model, path);
      const parentPath = path.split(".").slice(0, -2).join(".");
      const parent = parentPath ? getPath(model, parentPath) : model;
      const w = f.warn(item, parent);
      let node = box.querySelector(":scope > .fwarn");
      if (w && !node) {
        node = document.createElement("div");
        node.className = "fwarn";
        box.querySelector(".lhead").insertAdjacentElement("afterend", node);
      }
      if (node) {
        node.textContent = w || "";
        node.hidden = !w;
      }
    });
  }

  /* 按路径找到字段定义。路径里的数字段是数组下标，跳过 */
  function findField(path) {
    const ks = path.split(".").filter(k => !/^\d+$/.test(k));
    let fields = SCHEMAS[kind].fields, f = null;
    ks.forEach(k => {
      f = (fields || []).find(x => x.k === k) || null;
      fields = f && f.fields;
    });
    return f;
  }

  window.addEventListener("beforeunload", e => {
    if (dirty) { e.preventDefault(); e.returnValue = ""; }
  });

  boot();
})();
