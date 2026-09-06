# lex · 我的英语学习库

一个零构建的站。单词、词根词缀、范文各一个板块，
数据是三个 `.json` 文件，前台逻辑是一个 `app.js`，样式是一个 `styles.css`，
外加一个只用标准库的 Python 后台用来在线加内容。

线上：<https://lex.chuxin.cloud> ／ 后台：<https://lex.chuxin.cloud/admin/>

## 这一版的取向

实用主义：**内容直接铺开，不套折叠、不套盒子。**

- 详情页没有任何 `<details>`。单词的讲解是一段 markdown 正文，
  范文的正文完整连续，中间不被任何批注框打断。
- 列表是一行一条的密集列表，不是卡片墙。筛选和排序常驻在页面上，不收进浮层。
- 外壳只有一条顶栏。没有侧栏、抽屉、遮罩、悬浮按钮，
  没有玻璃、模糊、阴影、悬停抬起、环境渐变。
- 层次只靠三样东西：字号字重、`.5px` 细线、留白。
  颜色只出现在内容上（英文衬线、`--key` 用于释义与站内链接），外壳永远中性。

跳转只保留在**词根词缀板块内部**（构词成分点进词缀条目、相关词根互跳）。
单词页不做跨条目链接。

## 板块结构

| 板块 | 地址 | 数据 | 内容 |
|---|---|---|---|
| 概览 | `#/home` | — | 三个入口 + 最近看过 |
| 单词 | `#/words` | `data/words.js` | 118 条，每条是若干个「信息来源」 |
| 词根 | `#/roots` | `data/roots.js` | 19 组，每组若干义项与派生词 |
| 范文 | `#/essays` | `data/essays.js` | 16 篇，完整正文 + 编号批注 |
| 设置 | `#/settings` | — | 主题、清除浏览记录 |

旧地址 `#/analysis` `#/contrasts` `#/phrases` 折回 `#/words`，
`#/starred`（收藏板块已删）折回 `#/home`。

## 怎么追加内容

**平常走后台**：<https://lex.chuxin.cloud/admin/>，有表单、有 markdown 预览、
有批注锚点检查，存完前台刷新就能看到。下面这些是数据长什么样 ——
手改 JSON 或者写脚本批量导入时才需要看。

### 1. 一个单词

一个词条 = 一点元数据 + 若干个信息来源，每个来源是一段 markdown。

```json
{
  "id": "convert", "w": "convert", "pos": "v./n.",
  "core": "一句话核心释义 —— 列表行、页头副标题、搜索都用它",
  "sources": { "ai": "……markdown 正文……" }
}
```

`sources.ai` 里的 markdown 长这样：

```markdown
这里是 markdown 正文。第一段通常写脑海图景。

**词源**　拉丁语：com-（彻底地）+ vertere（翻转）
**构词**　**con-** 彻底地 ＋ **vert** 翻转

## 义项

### 1　物理形态与功能的底层重置（工程）

**转换、改造、折算**

描绘场景写在这里。

**状态特征**　可省略。

> *Convert USD into Euros.*
> 将美元兑换成欧元。

## 辨析

**vs. subvert**　差在哪。

## 易错点

- 一条
- 又一条

## 自测

**Our ______ concern is safety.**
→ **principal**　作定语表「主要的」。

---

一句话总结。
```

`sources` 的键对应 `app.js` 里的 `WORD_SOURCES`：

| 键 | tab 名 | 现状 |
|---|---|---|
| `ai` | AI 解析 | 118 条都有 |
| `dict` | 词典释义 | 空着，写了就出现 |
| `corpus` | 例句库 | 空着 |
| `note` | 我的笔记 | 空着 |

某个来源在某个词上没写，那个 tab 会变淡，点进去是一行说明。
进词条时如果你上次选的来源在这个词上是空的，会自动落到有内容的那个，不给一页空白；
但手动点 tab 时不做这个回落 —— 点了哪个就看哪个。

**加第五个来源**：往 `app.js` 的 `WORD_SOURCES` 加一个 `{id, label}`，前台 tab 就自动出现；
要在后台里也能编辑它，再往 `admin/admin.js` 的 `SCHEMAS.words.fields` 加一行
`{ k: "sources.你的键", label: "…", type: "md" }`。

### 支持的 markdown

先 `esc` 再解析，数据里的尖括号永远变不成标签。

| 块级 | 行内 |
|---|---|
| `#` ~ `####` 标题（一律渲染成 h2~h4，页面的 h1 是词条本身） | `**粗体**` |
| 段落（空行分段） | `*斜体*` |
| `- ` 无序列表、`1. ` 有序列表（可跨行续写） | `` `代码` `` |
| `> ` 引用（例句用这个） | `[文字](#/roots/spect)` |
| `---` 分隔线 | 链接只放行 `#/` 和 `http(s)://` |

**块内的单个换行会渲染成 `<br>`**（GFM 风格），所以例句的英文和中文各占一行就是对的。

### 2. 一个词根

`{id, form, kind, meaning, gloss, origin, related[], senses[]}`，
每个义项是 `{meaning, gloss, note, words[]}`，每个派生词是 `{w, def, parts[], ex}`。
`parts` 是 `[[形式, 含义, "prefix"|"root"|"suffix"], …]`；后台里写成一行一个
「`in- | 向内 | prefix`」，存的时候自动转。

`form` 可以写成 `"com- / con- / co-"` 一形多写，任一写法都能被构词成分查到。

### 3. 一篇范文

`{id, title, exam, year, part, topic, genre, level, words, prompt,
outline[], paragraphs[], highlights[], takeaway}`。要点：

- `paragraphs[].notes[].mark` 靠**子串精确匹配**锚定到正文。
  找不到就静默跳过，和前一个重叠也跳过 —— 两种情况都不占编号。
  改了 `text` 记得回头看 `mark` 还对不对。
- `paragraphs[].analysis` 是段落级点评，在注里以「段」开头单列一条，不占编号。
- 编号在**全文范围内连续**，从第 1 段第 1 处一直数到最后。

## 范文的批注怎么摆

正文永远完整、连续、不被撑开。被批注的短语只留一条极轻的下划线加一个上标序号。
注放哪由屏幕宽度决定：

| | 注的位置 | 为什么 |
|---|---|---|
| 桌面（≥760px） | 全文之后，「注」一节里按段分组 | 先一口气读完整篇，再回头看讲解 |
| 窄屏（<760px） | 紧跟在它所属的那一段之后，常驻显示 | 手机上翻到文末再翻回来成本太高 |

上标和注里的序号互相可点，跳过去之后目标会闪一下。
用 JS 滚动而不是 `#锚点` —— 站点是 hash 路由的，锚点会把路由带跑。

跨断点时会重渲染一次。这里比对 `resize` 而不是听 `matchMedia` 的 `change`，
因为后者在某些环境里（设备模拟、部分内嵌 WebView）`matches` 已经变了却不发事件。

## 后台

<https://lex.chuxin.cloud/admin/> —— 加 / 改 / 删单词、词根、范文。
口令在服务器上 `~/lex-admin/password.txt`（600 权限）。

界面由 `admin/admin.js` 里的 `SCHEMAS` 驱动：一份字段表，三种内容形状共用一个渲染器。
`list` 类型可以嵌套（范文的段落里套着批注）。**加字段就改 SCHEMAS，别去写新表单。**
后端 `server/server.py` 里有一份对应的校验，两边都要改。

几件它替你挡住的事：

- **批注锚不上会当场提示。** `notes[].mark` 靠子串精确匹配定位，锚不上前台会静默跳过 ——
  这是这份数据最容易坏的地方。编辑器里边打字边比对，保存时后端再报一次。
- **每次写入前自动备份**到 `~/lex-admin/backups/`，保留最近 30 份。
- **写入是原子的**（临时文件 + `os.replace`），不会留下半截 JSON 让前台整块空掉。
- **范文词数留空就按正文自动数。**
- **改 ID 等于另存一条新的**，旧的不会消失 —— 保存后会明确告诉你这件事。

鉴权：口令 → 会话 cookie（HttpOnly / SameSite=Lax / 线上带 Secure），12 小时过期，
连错 8 次锁 10 分钟。写操作还要求带 `X-Lex-Admin: 1` 头 —— 跨站表单发不出自定义头，
CSRF 就没有着力点。会话存在内存里，服务重启即失效。

`~/lex-admin/config.json`（600）长这样，口令只存 pbkdf2 散列：

```json
{ "salt": "…hex…", "pw_hash": "…hex…" }
```

要换口令，在服务器上重新生成这个文件再 `sudo systemctl restart lex-admin`。

服务本身：`lex-admin.service`，`User=ubuntu`，只绑 `127.0.0.1:8791`，
`MemoryMax=128M`（实测常驻约 10MB），`ProtectSystem=strict` 且只放开
数据目录和自己的备份目录可写。

```bash
ssh tencent-vps 'systemctl status lex-admin --no-pager'
ssh tencent-vps 'journalctl -u lex-admin -n 30 --no-pager'
```

## 数据

三个 `data/*.json`，顶层都是数组。后台写的就是这三个文件，
所以 nginx 对 `/data/` 发 `no-store`，前台每次 `fetch` 都拿最新的。

**某一份坏了不会白屏** —— `lexLoadDB()` 逐个 `fetch`，坏掉的那个板块空着，
顶栏下面挂一条横幅说明是哪个文件出了问题。

## 排序与筛选

`SORTS` 注册表决定排序方式，**排序方式同时决定分组方式**。

| 板块 | 排序 |
|---|---|
| 单词 | 字母 |
| 词根 | 字母、类型 |
| 范文 | 年份、题型、主题 |

只有一种排序时（单词），那一栏开关不渲染 —— 单选的控件没有存在意义。
筛选（词根类型、范文考试）是内存状态，刷新回默认；排序存 `el.sorts`。

## 偏好设置

`PREFS` 是个注册表，一处声明，四处派生：存储、界面、校验、重置。
加一条设置＝往数组里加一个对象。目前只有「主题」一项。

**渲染和就地更新必须共用同一份判断。** 设置页改完只更新受影响的那几个节点
（`syncPrefUI`），不整页重渲染；单词页切换来源同理（`syncSource` 和首次渲染
共用 `tabsHtml` / `sourceBody`）。两条路径各写一份状态判断，迟早会长歪。

## 存储键

| 键 | 存什么 | 谁清 |
|---|---|---|
| `el.prefs` | 主题 | — |
| `el.recent` | 浏览记录（最多 60 条） | 设置页 |
| `el.sorts` | 每个板块的排序方式 | — |
| `el.source` | 单词页上次选的信息来源 | — |

读进来的值一律对着当前的合法值校验一遍，认不出来的丢掉 ——
localStorage 里的数据活得比代码久。

`el.stars` / `el.tags` / `el.folds` / `el.cards` 是上一版收藏、标签、折叠、卡片档位
留下的键。这一版不读也不写，**但故意不删** ——
那些功能日后可能回来，你手动标过的数据还在里面。

## 设计规范

内容层是平的：填充 + 圆角，没有描边、没有模糊、没有阴影。改动时守住四条：

1. 不要引入 `backdrop-filter`、`box-shadow`（toast 除外）、悬停抬起。
2. 不要为了「分区」再把内容装进带底色的盒子。要分区就用标题 + 一条细线。
3. 分隔线一律 `.5px`，配 `--line` 或 `--line-2`。
4. 颜色只落在内容上。外壳（顶栏、导航、开关）永远是三档灰。

**深浅色令牌写了两份**：`@media (prefers-color-scheme: dark)` 一份给「跟随系统」，
`:root[data-theme="dark"]` 一份给手动选深色。两块内容逐字相同，**改令牌要同时改两处**。
断点只有一个：**760px**。

## 部署

站在腾讯云那台 VPS 上，走 Cloudflare 隧道，没有对公网开端口。
拓扑和运维细节见 `tencent-vps` 技能手册。

```
Cloudflare 边缘 → cloudflared 隧道 → nginx :443
                                      ├─ /            静态文件
                                      ├─ /data/       json，no-store
                                      ├─ /admin/      后台界面（静态）
                                      └─ /api/        → 127.0.0.1:8791  lex-admin.service
```

推代码：

```bash
tar -czf - --exclude '.git' --exclude '.claude' --exclude '.gitignore' --exclude 'server' . | ssh tencent-vps "tar -xzf - -C /var/www/lex.chuxin.cloud/public"
```

这条只覆盖不删除 —— 本地删掉的文件，服务器上那份还在，要手动清。
后端单独推，它不在 web 根里：

```bash
cat server/server.py | ssh tencent-vps 'cat > ~/lex-admin/server.py' && ssh tencent-vps 'sudo systemctl restart lex-admin'
```

**改了 CSS 或 JS 就把 `index.html` 里的 `?v=` 戳一起改**，nginx 给静态资源发的是
`expires 7d`，不换戳会拿到旧文件：

```bash
sed -i -E "s/\?v=[0-9]+/?v=$(date +%Y%m%d%H%M)/g" index.html admin/index.html
```

`data/*.json` 不需要戳 —— nginx 对 `/data/` 发的是 `no-store`，后台一存前台刷新就能看到。


## 本地预览

前台本身是静态的，随便起个服务就行；要连后台一起跑，用 server.py 的本地模式
（`LEX_STATIC_DIR` 一设，它就顺带发静态文件，整套在一个进程里）：

```bash
LEX_STATIC_DIR=. LEX_DATA_DIR=./data LEX_BACKUP_DIR=/tmp/lexbak LEX_CONFIG=/tmp/lexcfg.json LEX_PORT=8799 python server/server.py
```

`LEX_CONFIG` 指向的文件要先造一个（格式见「后台」一节）。
线上不设 `LEX_STATIC_DIR` —— 静态归 nginx，那个进程碰都不碰别的文件。

## 文件结构

```
index.html                前台外壳：顶栏 + SVG sprite + 挂载点
manifest.webmanifest      PWA
assets/css/styles.css     前台样式
assets/js/md.js           markdown 渲染器（前台与后台共用）
assets/js/app.js          前台逻辑
assets/icon/              图标
data/words.json           118 条单词
data/roots.json           19 组词根词缀
data/essays.json          16 篇范文
admin/index.html          后台界面（静态，由 nginx 发）
admin/admin.js            后台逻辑：字段表驱动的编辑器
admin/admin.css           后台样式
server/server.py          后台接口（只用标准库，不进 web 根）
```

`app.js` 的分段：工具与 markdown 渲染器 → 偏好 → 访问记录 → 排序 → 构词 →
路由与通用片段 → 首页 → 单词 → 词根 → 范文 → 设置 → 搜索 → 交互 → 启动。
