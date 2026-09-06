/* ============================================================
   lex — 应用逻辑
   路由 · markdown 渲染 · 三个板块的列表与正文 · 全站搜索
   零依赖，零构建。

   这一版的取向是实用主义：内容直接铺开，不套折叠、不套盒子。
   单词的讲解是一段 markdown 正文；范文正文完整连续，批注走编号脚注。

   数据是 data/*.json，开机 fetch 进来。管理后台写的就是这三个文件，
   所以这里不能缓存（nginx 对 /data/ 发的是 no-store）。
   ============================================================ */

/* 某一份数据坏了或没拿到，只让那一个板块空着并在页面上说明，
   不要整站白屏 —— 后台随时在写这三个文件。 */
async function lexLoadDB() {
  const kinds = ["words", "roots", "essays"];
  const db = {}, bad = [];
  await Promise.all(kinds.map(async k => {
    try {
      const r = await fetch(`data/${k}.json`, { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const v = await r.json();
      if (!Array.isArray(v)) throw new Error("顶层不是数组");
      db[k] = v;
    } catch (e) {
      db[k] = [];
      bad.push(`${k}.json（${e.message || e}）`);
    }
  }));
  return { db, bad };
}

(async function () {
  "use strict";

  const loaded = await lexLoadDB();
  const DB = loaded.db;
  const words = DB.words || [], roots = DB.roots || [], essays = DB.essays || [];

  /* ---------- 板块 ----------
     导航是文字不是图标，所以不再需要 icon 字段 */
  const SECTIONS = [
    { id: "home",     label: "概览", full: "概览",     count: () => null },
    { id: "words",    label: "单词", full: "单词",     count: () => words.length },
    { id: "roots",    label: "词根", full: "词根词缀", count: () => roots.length },
    { id: "essays",   label: "范文", full: "范文",     count: () => essays.length },
    { id: "settings", label: "设置", full: "设置",     count: () => null }
  ];
  const sec = id => SECTIONS.find(s => s.id === id) || SECTIONS[0];

  /* 重构前的旧地址。收藏板块已经删掉，老书签落到这里不该白屏 */
  const LEGACY = {
    analysis: "#/words", contrasts: "#/words", phrases: "#/words", starred: "#/home"
  };

  const KIND_CN = { root: "词根", prefix: "前缀", suffix: "后缀" };

  /* ---------- 工具 ---------- */
  const $ = s => document.querySelector(s);
  const $$ = s => [].slice.call(document.querySelectorAll(s));
  /* markdown 渲染器在 assets/js/md.js，前台与后台共用 */
  const esc = window.lexEsc, md = window.lexMd;
  const icon = (id, size) =>
    `<svg width="${size || 18}" height="${size || 18}" aria-hidden="true"><use href="#${id}"/></svg>`;
  /* 纯文本转段落：数据里的普通字段（题目之类）用这个，不走 markdown */
  const plain = t => esc(t).split(/\n{2,}/)
    .map(s => `<p>${s.replace(/\n/g, "<br>")}</p>`).join("");


  /* ============================================================
     偏好 —— 一处声明，四处派生：存储、界面、校验、重置
     这一版只剩主题一项（复习范围那一整组随随机复习功能一起删了）
     ============================================================ */
  const PREF_KEY = "el.prefs";
  const PREF_VERSION = 1;

  const PREFS = [
    { id: "theme", group: "外观", label: "主题",
      hint: "跟随系统会随 macOS / Windows 的深浅色自动切换",
      def: "auto",
      options: [["auto", "跟随系统"], ["light", "浅色"], ["dark", "深色"]] }
  ];

  const prefDef = id => PREFS.find(p => p.id === id);
  const optionIds = d => d.options.map(o => o[0]);

  const prefs = {
    values: {},
    /* 存进来的东西不可信：可能是旧版本写的，也可能被手动改过。一律按注册表校验 */
    clean(d, v) { return optionIds(d).indexOf(v) >= 0 ? v : d.def; },

    load() {
      let raw = null;
      try { raw = JSON.parse(localStorage.getItem(PREF_KEY) || "null"); } catch (e) {}
      const stored = (raw && raw.values) ? raw.values : {};
      PREFS.forEach(d => { this.values[d.id] = this.clean(d, stored[d.id]); });
      let same = false;
      try { same = JSON.stringify(stored) === JSON.stringify(this.values); } catch (e) {}
      if (!same) this.save();
    },
    get(id) { return this.values[id]; },
    is(id, v) { return this.values[id] === v; },
    set(id, v) {
      const d = prefDef(id);
      if (!d) return;
      this.values[id] = this.clean(d, v);
      this.save();
    },
    save() {
      try {
        localStorage.setItem(PREF_KEY, JSON.stringify({ v: PREF_VERSION, values: this.values }));
      } catch (e) { /* 隐私模式下静默降级 */ }
    }
  };

  /* ============================================================
     访问记录 —— 首页「最近看过」用
     按时间倒序，同一条只留最近一次。只记详情页。
     ============================================================ */
  const RECENT_KEY = "el.recent";
  const RECENT_VERSION = 1;
  const RECENT_MAX = 60;

  /* 每一类怎么解析成一行。加板块就往这里加一项 */
  const RECENT_KIND = {
    words: { label: "单词", en: true,
      find: id => words.find(x => x.id === id),
      tag: () => "单词", title: x => x.w, desc: x => x.core },
    roots: { label: "词根", en: true,
      find: id => roots.find(x => x.id === id),
      tag: x => KIND_CN[x.kind], title: x => x.form, desc: x => x.meaning },
    essays: { label: "范文", en: false,
      find: id => essays.find(x => x.id === id),
      tag: () => "范文", title: x => x.title,
      desc: x => [x.exam, x.year ? x.year + " 年" : null, x.part].filter(Boolean).join(" · ") || x.genre }
  };

  const recent = {
    items: [],                                   // [{ k: "words:commit", t: 时间戳 }]

    load() {
      let raw = null;
      try { raw = JSON.parse(localStorage.getItem(RECENT_KEY) || "null"); } catch (e) {}
      const src = (raw && raw.v === RECENT_VERSION && Array.isArray(raw.items)) ? raw.items : [];
      const seen = new Set(), out = [];
      src.forEach(it => {
        if (!it || typeof it.k !== "string" || typeof it.t !== "number") return;
        if (seen.has(it.k)) return;                        // 同一条只留最近的那次
        const [kind, id] = it.k.split(":");
        const d = RECENT_KIND[kind];
        if (!d || !id || !d.find(id)) return;              // 板块删了、条目删了，记录跟着丢
        seen.add(it.k);
        out.push({ k: it.k, t: it.t });
      });
      out.sort((a, b) => b.t - a.t);
      this.items = out.slice(0, RECENT_MAX);
      let same = false;
      try { same = JSON.stringify(src) === JSON.stringify(this.items); } catch (e) {}
      if (!same) this.save();
    },
    save() {
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify({ v: RECENT_VERSION, items: this.items }));
      } catch (e) {}
    },
    record(kind, id) {
      const d = RECENT_KIND[kind];
      if (!d || !id || !d.find(id)) return;
      const k = kind + ":" + id;
      this.items = [{ k: k, t: Date.now() }]
        .concat(this.items.filter(x => x.k !== k)).slice(0, RECENT_MAX);
      this.save();
    },
    clear() { this.items = []; this.save(); },
    rows(kind) {
      return this.items.reduce((a, it) => {
        const [k, id] = it.k.split(":");
        if (kind && kind !== "all" && k !== kind) return a;
        const d = RECENT_KIND[k];
        const x = d && d.find(id);
        if (x) a.push({ kind: k, href: `#/${k}/${id}`, t: it.t,
                        tag: d.tag(x), title: d.title(x), desc: d.desc(x), en: d.en });
        return a;
      }, []);
    },
    countOf(kind) { return this.rows(kind).length; }
  };

  /* 相对时间。一天以内说得越细越有用，越久越粗 */
  function agoText(t) {
    const d = Date.now() - t;
    if (d < 6e4) return "刚刚";
    if (d < 36e5) return Math.floor(d / 6e4) + " 分钟前";
    if (d < 864e5) return Math.floor(d / 36e5) + " 小时前";
    const n = Math.floor(d / 864e5);
    return n < 30 ? n + " 天前" : new Date(t).toLocaleDateString("zh-CN");
  }

  /* 时间分档：让「按时间排」在页面上看得见，而不是一长条 */
  function timeBucket(t) {
    const sameDay = (a, b) =>
      a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    const now = new Date(), then = new Date(t);
    if (sameDay(now, then)) return "今天";
    const y = new Date(now); y.setDate(y.getDate() - 1);
    if (sameDay(y, then)) return "昨天";
    return (Date.now() - t < 7 * 864e5) ? "最近 7 天" : "更早";
  }

  /* ============================================================
     排序 —— 排序方式同时决定分组方式
     ============================================================ */
  const byName = (a, b) => a.localeCompare(b, "en");
  /* 后缀写成 "-able / -ible"，取首字母和排序前要剥掉前导连字符 */
  const bare = s => s.replace(/^[-\s]+/, "");
  const byForm = (a, b) => byName(bare(a.form), bare(b.form));
  const byYear = (a, b) => (b.year || 0) - (a.year || 0);

  const SORTS = {
    words: [
      { id: "alpha", label: "字母", group: x => x.w[0].toUpperCase(), cmp: (a, b) => byName(a.w, b.w) }
    ],
    roots: [
      { id: "alpha", label: "字母", group: x => bare(x.form)[0].toUpperCase(), cmp: byForm },
      { id: "kind",  label: "类型", group: x => KIND_CN[x.kind], order: ["前缀", "词根", "后缀"], cmp: byForm }
    ],
    essays: [
      /* 真题按年份倒序分组，非真题垫底 */
      { id: "year", label: "年份",
        group: x => x.year ? x.year + " 年" : "非真题",
        order: [...new Set(essays.map(e => e.year))].sort((a, b) => (b || 0) - (a || 0))
          .map(y => y ? y + " 年" : "非真题"),
        cmp: (a, b) => (a.part || "").localeCompare(b.part || "") },
      { id: "part",  label: "题型", group: x => x.part || "未分类",
        order: [...new Set(essays.map(e => e.part || "未分类"))], cmp: byYear },
      { id: "topic", label: "主题", group: x => x.topic || "未分类", cmp: byYear }
    ]
  };

  const store = {
    sorts: { words: "alpha", roots: "alpha", essays: "year" },
    /* localStorage 里的数据活得比代码久：排序方式删掉了，它写的键还在。
       所以读进来的每一项都要对着当前的合法值过一遍，认不出来的直接丢。 */
    load() {
      try {
        const raw = JSON.parse(localStorage.getItem("el.sorts") || "{}");
        Object.keys(raw || {}).forEach(k => {
          if (SORTS[k] && SORTS[k].some(m => m.id === raw[k])) this.sorts[k] = raw[k];
        });
      } catch (e) { /* 隐私模式下静默降级 */ }
    },
    saveSorts() { try { localStorage.setItem("el.sorts", JSON.stringify(this.sorts)); } catch (e) {} }
  };

  const sortMode = kind => SORTS[kind].find(s => s.id === store.sorts[kind]) || SORTS[kind][0];

  function groupItems(items, mode) {
    const g = new Map();
    items.forEach(x => {
      const k = mode.group(x);
      if (!g.has(k)) g.set(k, []);
      g.get(k).push(x);
    });
    const keys = [...g.keys()];
    keys.sort(mode.order
      ? (a, b) => mode.order.indexOf(a) - mode.order.indexOf(b)
      : (a, b) => a.localeCompare(b, "zh"));
    if (mode.cmp) keys.forEach(k => g.get(k).sort(mode.cmp));
    return keys.map(k => [k, g.get(k)]);
  }

  /* ---------- 词根成分查表 ----------
     词根的 form 写成 "com- / con- / co-" 这种一形多写，任一写法都要能查到。
     只由 roots.js 构建，不依赖单词数据。 */
  const bareForm = x => String(x == null ? "" : x).replace(/^-+|-+$/g, "").trim().toLowerCase();
  const ROOT_BY_FORM = (() => {
    const m = new Map();
    roots.forEach(r => String(r.form).split(/\s*\/\s*/).forEach(f => {
      const k = bareForm(f);
      if (k && !m.has(k)) m.set(k, r);
    }));
    return m;
  })();
  const rootFor = form => ROOT_BY_FORM.get(bareForm(form)) || null;
  const rootWords = r => (r.senses || []).reduce((a, s) => a.concat(s.words || []), []);

  /* 构词成分。跳转只保留在词根板块内部：查得到就是链接，查不到就是普通文字 */
  function morph(parts, current) {
    return `<span class="morph">${(parts || []).map((p, i) => {
      const [form, gloss, kind] = p;
      const r = rootFor(form);
      const inner = `<b class="en">${esc(form)}</b><i>${esc(gloss)}</i>`;
      const el = (r && r.id !== current)
        ? `<a class="part" data-k="${esc(kind)}" href="#/roots/${esc(r.id)}"
             title="${esc(KIND_CN[r.kind] + "　" + r.form + " · " + r.meaning)}">${inner}</a>`
        : `<span class="part" data-k="${esc(kind)}">${inner}</span>`;
      return (i ? `<span class="morph__p">+</span>` : "") + el;
    }).join("")}</span>`;
  }

  /* ============================================================
     路由
     ============================================================ */
  let route = { section: "home", id: null, q: "" };
  const go = hash => { location.hash = hash; };

  function parseHash() {
    const raw = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    const [head, ...rest] = raw.split("/");
    if (head === "search") return { section: "search", id: null, q: rest.join("/") };
    const known = SECTIONS.some(x => x.id === head) || LEGACY[head];
    return { section: known ? head : "home", id: rest.join("/") || null, q: "" };
  }

  function docTitle() {
    if (route.section === "search") return `搜索 ${route.q} · lex`;
    if (route.id) {
      const d = RECENT_KIND[route.section];
      const x = d && d.find(route.id);
      if (x) return `${d.title(x)} · lex`;
    }
    return `${sec(route.section).full} · lex`;
  }

  function onRoute(keepScroll) {
    const y = window.scrollY;
    route = parseHash();

    const to = LEGACY[route.section];
    if (to) { location.replace(to); return; }

    if (route.id) recent.record(route.section, route.id);
    document.body.dataset.section = route.section;
    renderNav();
    $("#view").innerHTML = VIEWS[route.section] ? VIEWS[route.section](route) : VIEWS.home();
    document.title = docTitle();
    window.scrollTo({ top: keepScroll ? y : 0 });

    if ($("#searchInput") !== document.activeElement) {
      $("#searchInput").value = route.section === "search" ? route.q : "";
      $("#searchBox").classList.toggle("has-value", !!$("#searchInput").value);
    }
  }

  function renderNav() {
    $("#nav").innerHTML = SECTIONS.map(s => {
      const n = s.count();
      return `<a class="navitem${s.id === route.section ? " is-active" : ""}" href="#/${s.id}">
        ${esc(s.label)}${n != null ? `<span class="navitem__n">${n}</span>` : ""}</a>`;
    }).join("");
  }

  /* 桌面和手机对「批注放哪」的答案不一样，见 essayReader */
  const WIDE = matchMedia("(min-width: 760px)");

  /* ---------- 通用片段 ---------- */
  const back = (href, text) => `<a class="back" href="${href}">${icon("i-back", 14)}${esc(text)}</a>`;
  const pagehead = (title, meta) => `<div class="pagehead">
    <h1>${esc(title)}</h1>${meta ? `<span class="pagehead__meta">${esc(meta)}</span>` : ""}</div>`;
  const empty = (t, sub) => `<div class="empty"><p>${esc(t)}</p>${
    sub ? `<p class="empty__sub">${esc(sub)}</p>` : ""}</div>`;
  const notFound = (href, text) =>
    `<div class="view view--read">${back(href, text)}${empty("没有找到这个条目", "它可能已被改名或删除。")}</div>`;

  /* 常驻的一行开关：筛选和排序都摆在外面，不收进浮层 */
  function bar(groups) {
    const gs = groups.filter(g => g && g.opts.length > 1);
    if (!gs.length) return "";
    return `<div class="bar">${gs.map(g => `<span class="bar__g">
      <span class="bar__l">${esc(g.label)}</span>
      ${g.opts.map(o => `<button class="opt${o.on ? " is-on" : ""}" ${o.attr}>${esc(o.label)}${
        o.n != null ? `<span class="opt__n">${o.n}</span>` : ""}</button>`).join("")}
    </span>`).join("")}</div>`;
  }

  const sortGroup = kind => ({
    label: "排序", opts: SORTS[kind].map(s => ({
      label: s.label, on: s.id === store.sorts[kind], attr: `data-sort="${kind}:${s.id}"`
    }))
  });

  /* 密集列表：一行一条，分组标题贴在组前面，不是折叠 */
  function groupedList(kind, items, row) {
    return groupItems(items, sortMode(kind)).map(([k, arr]) => `<section class="grp">
      <h2 class="grp__h">${esc(k)}<span>${arr.length}</span></h2>
      <div class="rows">${arr.map(row).join("")}</div>
    </section>`).join("");
  }

  const VIEWS = {};

  /* ============================================================
     首页 —— 索引
     ============================================================ */
  const HOME_DESC = {
    words: "一个词的图景、义项与边界",
    roots: "拆开构词，理解而非硬背",
    essays: "完整正文，逐句批注"
  };

  VIEWS.home = function () {
    const idx = ["words", "roots", "essays"].map(sec).map(s => `<a class="idx" href="#/${s.id}">
      <span class="idx__n">${s.count()}</span>
      <span class="idx__t">${esc(s.full)}</span>
      <span class="idx__d">${esc(HOME_DESC[s.id])}</span>
    </a>`).join("");

    return `<div class="view">
      ${pagehead("概览", `${words.length} 个单词 · ${roots.length} 组词根词缀 · ${essays.length} 篇范文`)}
      <div class="idxs">${idx}</div>
      <h2 class="sec">最近看过${recent.items.length ? `<span>${recent.items.length}</span>` : ""}</h2>
      <div id="recentBox">${recentBox()}</div>
    </div>`;
  };

  /* 时间倒序，再按今天 / 昨天 / 最近 7 天 / 更早分档 ——
     一长条列表看不出时间感，分了档「按时间排」这件事才在页面上成立。 */
  let recentKind = "all";

  function recentBox() {
    if (!recent.items.length) {
      return `<p class="hint">还没有浏览记录。随便点开一个词条，这里就会按时间记下你看过什么。</p>`;
    }
    const opts = [["all", "全部"]].concat(Object.keys(RECENT_KIND).map(k => [k, RECENT_KIND[k].label]));
    const chips = bar([{ label: "只看", opts: opts.map(([v, l]) => ({
      label: l, n: recent.countOf(v), on: recentKind === v, attr: `data-recentkind="${esc(v)}"`
    })) }]);

    const rows = recent.rows(recentKind);
    if (!rows.length) return chips + `<p class="hint">这一类还没有浏览记录。</p>`;

    const groups = [];
    rows.forEach(r => {
      const b = timeBucket(r.t);
      let g = groups.find(x => x.name === b);
      if (!g) groups.push(g = { name: b, rows: [] });
      g.rows.push(r);
    });

    return chips + groups.map(g => `<section class="grp">
      <h2 class="grp__h">${esc(g.name)}<span>${g.rows.length}</span></h2>
      <div class="rows">${g.rows.map(r => `<a class="row" href="${r.href}">
        <span class="row__w${r.en ? " en" : " row__w--cn"}">${esc(r.title)}</span>
        <span class="row__pos">${esc(r.tag)}</span>
        <span class="row__d">${esc(r.desc)}</span>
        <time class="row__t" datetime="${new Date(r.t).toISOString()}">${esc(agoText(r.t))}</time>
      </a>`).join("")}</div>
    </section>`).join("");
  }

  /* 换分类只重画这一块，首页其余部分不动 */
  function syncRecentBox() {
    const el = $("#recentBox");
    if (el) el.innerHTML = recentBox();
  }

  /* ============================================================
     单词 —— 多信息来源 + markdown 正文
     ============================================================ */
  const SOURCE_KEY = "el.source";
  const WORD_SOURCES = [
    { id: "ai",     label: "AI 解析" },
    { id: "dict",   label: "词典释义" },
    { id: "corpus", label: "例句库" },
    { id: "note",   label: "我的笔记" }
  ];
  const sourceLabel = id => (WORD_SOURCES.find(s => s.id === id) || {}).label || id;
  const sourceText = (x, id) => ((x && x.sources) || {})[id] || "";

  let curSource = "ai";        // 用户选的，跨词条保持
  let shownSource = "ai";      // 这一页实际显示的
  try {
    const v = localStorage.getItem(SOURCE_KEY);
    if (WORD_SOURCES.some(s => s.id === v)) curSource = v;
  } catch (e) {}

  /* 进入词条时：选中的来源在这个词上是空的，就落到有内容的那个，不给一页空白。
     手动点 tab 时不做这个回落 —— 点了哪个就看哪个，哪怕它是空的。 */
  function pickSource(x) {
    if (sourceText(x, curSource)) return curSource;
    const alt = WORD_SOURCES.find(s => sourceText(x, s.id));
    return alt ? alt.id : curSource;
  }

  const sourceBody = (x, id) => {
    const t = sourceText(x, id);
    return t ? `<div class="md">${md(t)}</div>`
      : `<p class="hint">「${esc(sourceLabel(id))}」这个来源还没接入。在 data/words.js 里给这个词写一段
         <code>sources.${esc(id)}</code> markdown，就会出现在这里。</p>`;
  };

  VIEWS.words = function (r) {
    if (r.id) {
      const x = words.find(v => v.id === r.id);
      return x ? `<div class="view view--read">${back("#/words", "单词")}${wordDetail(x)}</div>`
               : notFound("#/words", "单词");
    }
    return `<div class="view">
      ${pagehead("单词", words.length + " 条")}
      ${bar([sortGroup("words")])}
      ${groupedList("words", words, wordRow)}
    </div>`;
  };

  const wordRow = x => `<a class="row" href="#/words/${esc(x.id)}">
    <span class="row__w en">${esc(x.w)}</span>
    <span class="row__pos">${esc(x.pos || "")}</span>
    <span class="row__d">${esc(x.core)}</span>
  </a>`;

  function wordDetail(x) {
    shownSource = pickSource(x);
    return `<article class="doc" data-word="${esc(x.id)}">
      <header class="dochead">
        <div class="dochead__k">单词${x.pos ? " · " + esc(x.pos) : ""}</div>
        <h1 class="dochead__w en">${esc(x.w)}</h1>
        ${x.core ? `<p class="dochead__core">${esc(x.core)}</p>` : ""}
      </header>
      <nav class="tabs" id="sourceTabs" aria-label="信息来源">${tabsHtml(x)}</nav>
      <div id="sourceBody">${sourceBody(x, shownSource)}</div>
    </article>`;
  }

  const tabsHtml = x => WORD_SOURCES.map(s =>
    `<button class="tab${s.id === shownSource ? " is-on" : ""}${sourceText(x, s.id) ? "" : " is-empty"}"
       data-source="${s.id}" aria-pressed="${s.id === shownSource}">${esc(s.label)}</button>`).join("");

  /* 切来源只换正文和 tab 状态，不重走路由 —— 否则滚动位置被拉回顶部。
     渲染和就地切换共用 tabsHtml / sourceBody，两条路径不会长歪。 */
  function syncSource() {
    const art = $("[data-word]");
    if (!art) return;
    const x = words.find(v => v.id === art.dataset.word);
    if (!x) return;
    $("#sourceTabs").innerHTML = tabsHtml(x);
    $("#sourceBody").innerHTML = sourceBody(x, shownSource);
  }

  /* ============================================================
     词根词缀 —— 全站唯一保留跳转的地方
     ============================================================ */
  let rootFilter = "all";

  VIEWS.roots = function (r) {
    if (r.id) {
      const x = roots.find(v => v.id === r.id);
      return x ? `<div class="view view--read">${back("#/roots", "词根词缀")}${rootDetail(x)}</div>`
               : notFound("#/roots", "词根词缀");
    }
    const opts = [["all", "全部"], ["root", "词根"], ["prefix", "前缀"], ["suffix", "后缀"]];
    const list = roots.filter(x => rootFilter === "all" || x.kind === rootFilter);
    return `<div class="view">
      ${pagehead("词根词缀", roots.length + " 组")}
      ${bar([
        { label: "只看", opts: opts.map(([k, l]) => ({
            label: l, on: rootFilter === k, attr: `data-rootfilter="${k}"`,
            n: k === "all" ? roots.length : roots.filter(x => x.kind === k).length })) },
        sortGroup("roots")
      ])}
      ${list.length ? groupedList("roots", list, rootRow) : empty("这一类还没有内容")}
    </div>`;
  };

  const rootRow = x => `<a class="row" href="#/roots/${esc(x.id)}">
    <span class="row__w en">${esc(x.form)}</span>
    <span class="row__pos">${esc(KIND_CN[x.kind])}</span>
    <span class="row__d">${esc(x.meaning)}　${rootWords(x).length} 个派生词</span>
  </a>`;

  function rootDetail(x) {
    const rel = (x.related || []).map(id => roots.find(r => r.id === id)).filter(Boolean);
    return `<article class="doc">
      <header class="dochead">
        <div class="dochead__k">${esc(KIND_CN[x.kind])} · ${esc(x.origin)}</div>
        <h1 class="dochead__w en">${esc(x.form)}</h1>
        <p class="dochead__core">${esc(x.meaning)}<i class="gloss en">${esc(x.gloss)}</i></p>
      </header>

      ${(x.senses || []).map((s, i) => `<section class="rsense">
        <h2>${i + 1}　${esc(s.meaning)}${s.gloss ? `<i class="gloss en">${esc(s.gloss)}</i>` : ""}</h2>
        ${s.note ? `<div class="md">${md(s.note)}</div>` : ""}
        ${(s.words || []).map(w => `<div class="drow">
          <div class="drow__top">
            <span class="drow__w en">${esc(w.w)}</span>
            <span class="drow__def">${esc(w.def)}</span>
          </div>
          <div class="drow__morph">${morph(w.parts, x.id)}</div>
          ${w.ex ? `<p class="drow__ex en">${esc(w.ex)}</p>` : ""}
        </div>`).join("")}
      </section>`).join("")}

      ${rel.length ? `<section class="rsense"><h2>相关词根</h2>
        <div class="rels">${rel.map(r => `<a class="relk" href="#/roots/${esc(r.id)}">
          <b class="en">${esc(r.form)}</b>${esc(r.meaning)}</a>`).join("")}</div>
      </section>` : ""}
    </article>`;
  }

  /* ============================================================
     范文 —— 正文完整连续，批注走编号脚注

     一篇文章一套连续编号。被批注的短语在正文里只留一个上标序号，
     正文本身永远不被撑开、不被切断。注放哪由屏幕宽度决定：
       桌面   全文读完，注按段分组列在文末（点序号来回跳）
       窄屏   注紧跟在它所属的那一段之后，常驻显示不用点
     ============================================================ */
  let essayExam = "全部";

  VIEWS.essays = function (r) {
    if (r.id) {
      const e = essays.find(v => v.id === r.id);
      return e ? `<div class="view view--read">${back("#/essays", "范文")}${essayReader(e)}</div>`
               : notFound("#/essays", "范文");
    }
    const exams = ["全部", ...new Set(essays.map(e => e.exam || "其他"))];
    const list = essays.filter(e => essayExam === "全部" || (e.exam || "其他") === essayExam);
    return `<div class="view">
      ${pagehead("范文", essays.length + " 篇")}
      ${bar([
        { label: "只看", opts: exams.map(x => ({
            label: x, on: essayExam === x, attr: `data-essayexam="${esc(x)}"`,
            n: x === "全部" ? essays.length : essays.filter(e => (e.exam || "其他") === x).length })) },
        sortGroup("essays")
      ])}
      ${list.length ? groupedList("essays", list, essayRow) : empty("这一类还没有范文")}
    </div>`;
  };

  const essayRow = e => `<a class="row" href="#/essays/${esc(e.id)}">
    <span class="row__y">${e.year || "—"}</span>
    <span class="row__w row__w--cn">${esc(e.title)}</span>
    <span class="row__d">${esc([e.exam, e.part, e.topic].filter(Boolean).join(" · "))}　${e.words} words</span>
  </a>`;

  /* 一遍扫完：给匹配上的批注编号，同时产出正文 HTML。
     mark 在正文里找不到、或与前一个重叠的，跳过且不占号（和旧版一致）。 */
  function essayModel(e) {
    let n = 0;
    return (e.paragraphs || []).map((p, pi) => {
      const text = p.text || "";
      const marks = (p.notes || [])
        .map((nt, i) => ({ i, idx: text.indexOf(nt.mark), len: nt.mark.length, mark: nt.mark, note: nt.note }))
        .filter(m => m.idx >= 0)
        .sort((a, b) => a.idx - b.idx);

      const kept = [];
      let cur = 0, html = "";
      marks.forEach(m => {
        if (m.idx < cur) return;
        m.n = ++n;
        html += esc(text.slice(cur, m.idx))
          + `<span class="anno" id="anno-${m.n}" role="button" tabindex="0" data-jump="note-${m.n}"`
          + ` aria-label="批注 ${m.n}">${esc(text.substr(m.idx, m.len))}<sup>${m.n}</sup></span>`;
        cur = m.idx + m.len;
        kept.push(m);
      });
      html += esc(text.slice(cur));
      return { pi, role: p.role, analysis: p.analysis, html, marks: kept };
    });
  }

  function noteGroup(m) {
    if (!m.marks.length && !m.analysis) return "";
    return `<section class="notes">
      <h3 class="notes__h">第 ${m.pi + 1} 段${m.role ? " · " + esc(m.role) : ""}</h3>
      ${m.marks.map(k => `<div class="note" id="note-${k.n}">
        <span class="note__n" role="button" tabindex="0" data-jump="anno-${k.n}"
              aria-label="回到正文第 ${k.n} 处">${k.n}</span>
        <div class="note__b"><span class="note__m en">${esc(k.mark)}</span>${md(k.note)}</div>
      </div>`).join("")}
      ${m.analysis ? `<div class="note note--para">
        <span class="note__n note__n--flat">段</span>
        <div class="note__b">${md(m.analysis)}</div>
      </div>` : ""}
    </section>`;
  }

  function essayReader(e) {
    const model = essayModel(e);
    const paras = model.map(m => `<p class="para" id="para-${m.pi}">${m.html}</p>`);
    const groups = model.map(noteGroup);
    const wide = WIDE.matches;

    const body = wide ? paras.join("")
                      : model.map((m, i) => paras[i] + groups[i]).join("");
    const notes = (wide && groups.some(Boolean))
      ? `<h2 class="sec">注<span>${model.reduce((n, m) => n + m.marks.length, 0)}</span></h2>
         ${groups.join("")}` : "";

    const meta = [e.genre, e.level, e.words + " words"].filter(Boolean).join("　·　");

    return `<article class="doc doc--essay">
      <header class="dochead">
        <div class="dochead__k">${esc([e.exam, e.year ? e.year + " 年" : null, e.part]
          .filter(Boolean).join(" · ") || e.genre)}</div>
        <h1 class="dochead__t">${esc(e.title)}</h1>
        <p class="dochead__core">${esc(meta)}</p>
      </header>

      <h2 class="sec">题目</h2>
      <div class="prompt en">${plain(e.prompt)}</div>

      ${(e.outline || []).length ? `<h2 class="sec">提纲</h2>
        <ol class="outline">${e.outline.map(o =>
          `<li><b>${esc(o.label)}</b>${esc(o.purpose)}</li>`).join("")}</ol>` : ""}

      <h2 class="sec">正文</h2>
      <div class="essaybody">${body}</div>

      ${notes}

      ${(e.highlights || []).length ? `<h2 class="sec">可迁移表达<span>${e.highlights.length}</span></h2>
        <div class="hls">${e.highlights.map(h => `<div class="hl">
          <div class="hl__b">
            <div class="hl__en en">${esc(h.en)}</div>
            <div class="hl__zh">${esc(h.zh)}</div>
            <div class="hl__why">${esc(h.why)}</div>
          </div>
          <button class="iconbtn" data-copy="${esc(h.en)}" title="复制" aria-label="复制">${icon("i-copy", 15)}</button>
        </div>`).join("")}</div>` : ""}

      ${e.takeaway ? `<h2 class="sec">小结</h2><div class="md">${md(e.takeaway)}</div>` : ""}
    </article>`;
  }

  /* ============================================================
     设置 —— 整页由 PREFS 注册表渲染，没有一行是为某个具体设置手写的
     ============================================================ */
  const recentHint = () => recent.items.length
    ? `首页「最近看过」里现在有 ${recent.items.length} 条`
    : "还没有浏览记录";

  const prow = (id, label, hint, ctl) => `<div class="prow" data-prow="${esc(id)}">
    <div class="prow__m"><div class="prow__l">${esc(label)}</div><div class="prow__h">${esc(hint || "")}</div></div>
    <div class="prow__c">${ctl}</div>
  </div>`;

  VIEWS.settings = function () {
    const ctl = d => `<div class="opts">${d.options.map(([v, l]) =>
      `<button class="opt${prefs.is(d.id, v) ? " is-on" : ""}" data-pref="${esc(d.id)}"
        data-val="${esc(v)}" aria-pressed="${prefs.is(d.id, v)}">${esc(l)}</button>`).join("")}</div>`;

    return `<div class="view view--read">
      ${pagehead("设置")}
      <div class="prows">
        ${PREFS.map(d => prow(d.id, d.label, d.hint, ctl(d))).join("")}
        ${prow("act.recent", "清除浏览记录", recentHint(),
          `<button class="opt" data-prefact="recent"${recent.items.length ? "" : " disabled"}>清除</button>`)}
      </div>
      <p class="hint">偏好只存在这台设备的浏览器里（localStorage），换设备不同步。</p>
    </div>`;
  };

  /* ============================================================
     全站搜索
     每个条目两份干草堆：head 是标题类字段，body 是正文。
     head 命中排在 body 命中前面，所以搜「前缀」先出前缀条目本身，
     而不是正文里碰巧提到「前缀」两个字的段落。
     ============================================================ */
  const SEC_LABEL = { words: "单词", roots: "词根词缀", essays: "范文" };
  let searchSec = "all";
  let INDEX = null;

  function buildIndex() {
    if (INDEX) return INDEX;
    const join = a => a.filter(Boolean).join("\n");
    INDEX = [];

    words.forEach(x => INDEX.push({
      sec: "words", href: `#/words/${x.id}`, title: x.w, sub: x.core, en: true,
      head: join([x.w, x.pos, x.core]),
      body: join(Object.keys(x.sources || {}).map(k => x.sources[k]))
    }));

    roots.forEach(x => INDEX.push({
      sec: "roots", href: `#/roots/${x.id}`, title: x.form, sub: x.meaning, en: true,
      head: join([x.form, x.meaning, x.gloss, KIND_CN[x.kind], x.origin]),
      body: join((x.senses || []).map(s => join([s.meaning, s.gloss, s.note]
        .concat((s.words || []).map(w => join([w.w, w.def, w.ex]))))))
    }));

    essays.forEach(e => INDEX.push({
      sec: "essays", href: `#/essays/${e.id}`, title: e.title, en: false,
      sub: [e.exam, e.year ? e.year + " 年" : null, e.part].filter(Boolean).join(" · "),
      head: join([e.title, e.exam, e.part, e.topic, e.genre, e.level, e.year]),
      body: join([e.prompt, e.takeaway]
        .concat((e.outline || []).map(o => join([o.label, o.purpose])))
        .concat((e.paragraphs || []).map(p => join([p.text, p.analysis]
          .concat((p.notes || []).map(n => join([n.mark, n.note]))))))
        .concat((e.highlights || []).map(h => join([h.en, h.zh, h.why]))))
    }));

    INDEX.forEach(it => { it.headLow = it.head.toLowerCase(); it.bodyLow = it.body.toLowerCase(); });
    return INDEX;
  }

  /* 命中处前后各截一段，把命中的词标出来 */
  function snippet(body, at, len) {
    const from = Math.max(0, at - 30), to = Math.min(body.length, at + len + 50);
    return (from ? "…" : "") + esc(body.slice(from, at))
      + "<em>" + esc(body.slice(at, at + len)) + "</em>"
      + esc(body.slice(at + len, to)) + (to < body.length ? "…" : "");
  }

  VIEWS.search = function (r) {
    const q = (r.q || "").trim();
    if (!q) return `<div class="view">${pagehead("搜索")}${empty("输入点什么")}</div>`;
    const lq = q.toLowerCase();

    const all = buildIndex().reduce((a, it) => {
      const inHead = it.headLow.indexOf(lq) >= 0;
      const at = it.bodyLow.indexOf(lq);
      if (!inHead && at < 0) return a;
      /* 换行会让摘要看起来断掉，压成一行再截 */
      a.push({ it, rank: inHead ? 0 : 1,
               snip: inHead ? null : snippet(it.body.replace(/\n+/g, "　"), at, q.length) });
      return a;
    }, []).sort((a, b) => a.rank - b.rank);

    const hits = all.filter(h => searchSec === "all" || h.it.sec === searchSec);
    const secs = [["all", "全部", all.length]].concat(
      Object.keys(SEC_LABEL).map(k => [k, SEC_LABEL[k], all.filter(h => h.it.sec === k).length]));

    return `<div class="view">
      ${pagehead("搜索", `“${q}” · ${all.length} 条结果`)}
      ${all.length ? bar([{ label: "只看", opts: secs.map(([v, l, n]) => ({
          label: l, n: n, on: searchSec === v, attr: `data-searchsec="${esc(v)}"` })) }]) : ""}
      ${hits.length ? `<div class="rows">${hits.map(h => `<a class="row row--hit" href="${h.it.href}">
        <span class="row__w${h.it.en ? " en" : " row__w--cn"}">${esc(h.it.title)}</span>
        <span class="row__pos">${esc(SEC_LABEL[h.it.sec])}</span>
        <span class="row__d">${h.snip || esc(h.it.sub || "")}</span>
      </a>`).join("")}</div>`
        : empty("没有找到", "换个说法，或者只搜其中一个词。")}
    </div>`;
  };

  /* ============================================================
     交互
     ============================================================ */
  document.addEventListener("click", e => {
    const t = e.target;

    const cp = t.closest("[data-copy]");
    if (cp) { e.preventDefault(); copy(cp.dataset.copy, cp); return; }

    /* 正文上标 ↔ 文末注，两边互跳。用 JS 滚动而不是 #锚点 —— 站点是 hash 路由的 */
    const jp = t.closest("[data-jump]");
    if (jp) { e.preventDefault(); jumpTo(jp.dataset.jump); return; }

    const sb = t.closest("[data-source]");
    if (sb) {
      curSource = shownSource = sb.dataset.source;
      try { localStorage.setItem(SOURCE_KEY, curSource); } catch (err) {}
      syncSource();
      return;
    }

    const rk = t.closest("[data-recentkind]");
    if (rk && !rk.disabled) { recentKind = rk.dataset.recentkind; syncRecentBox(); return; }

    const rf = t.closest("[data-rootfilter]");
    if (rf) { rootFilter = rf.dataset.rootfilter; onRoute(); return; }

    const ee = t.closest("[data-essayexam]");
    if (ee) { essayExam = ee.dataset.essayexam; onRoute(); return; }

    const ss = t.closest("[data-searchsec]");
    if (ss) { searchSec = ss.dataset.searchsec; onRoute(); return; }

    const so = t.closest("[data-sort]");
    if (so) {
      const [kind, id] = so.dataset.sort.split(":");
      store.sorts[kind] = id; store.saveSorts();
      onRoute();
      return;
    }

    const pf = t.closest("[data-pref]");
    if (pf && !pf.disabled) { prefs.set(pf.dataset.pref, pf.dataset.val); applyTheme(); syncPrefUI(); return; }

    const pa = t.closest("[data-prefact]");
    if (pa && !pa.disabled) {
      recent.clear(); recentKind = "all";
      toast("浏览记录已清除");
      syncPrefUI();
      return;
    }
  });

  document.addEventListener("keydown", e => {
    if ((e.key === "Enter" || e.key === " ") && e.target.dataset && e.target.dataset.jump) {
      e.preventDefault(); jumpTo(e.target.dataset.jump); return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault(); $("#searchInput").focus(); $("#searchInput").select(); return;
    }
    if (e.key === "Escape" && document.activeElement === $("#searchInput")) $("#searchInput").blur();
  });

  /* 跳过去之后闪一下，否则落地了也不知道落在哪一行 */
  function jumpTo(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    el.classList.remove("is-hit");
    void el.offsetWidth;                       // 强制重排，让动画能重放
    el.classList.add("is-hit");
  }

  function copy(text, btn) {
    const done = () => {
      const old = btn.innerHTML;
      btn.innerHTML = "✓";
      setTimeout(() => { btn.innerHTML = old; }, 1100);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, () => fallback(text, done));
    } else fallback(text, done);
  }
  function fallback(text, done) {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); done(); } catch (err) {}
    ta.remove();
  }

  /* 轻提示：两秒后自己消失 */
  let toastTimer;
  function toast(msg) {
    let el = $("#toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast"; el.className = "toast"; el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-on"), 2400);
  }

  /* 改完设置只更新受影响的那几个节点，不整页重渲染 */
  function syncPrefUI() {
    if (route.section !== "settings") return;
    $$("#view [data-pref]").forEach(el => {
      const on = prefs.is(el.dataset.pref, el.dataset.val);
      el.classList.toggle("is-on", on);
      el.setAttribute("aria-pressed", on);
    });
    const rr = $('#view [data-prow="act.recent"]');
    if (rr) {
      rr.querySelector(".prow__h").textContent = recentHint();
      rr.querySelector(".opt").disabled = !recent.items.length;
    }
  }

  /* 搜索 */
  let searchTimer;
  $("#searchInput").addEventListener("input", e => {
    const v = e.target.value;
    $("#searchBox").classList.toggle("has-value", !!v);
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      if (v.trim()) { searchSec = "all"; go("#/search/" + encodeURIComponent(v.trim())); }
      else if (route.section === "search") go("#/home");
    }, 220);
  });
  $("#searchClear").addEventListener("click", () => {
    $("#searchInput").value = "";
    $("#searchBox").classList.remove("has-value");
    $("#searchInput").focus();
    if (route.section === "search") go("#/home");
  });

  /* 主题。顶栏那个按钮和设置页改的是同一个值，两边永远一致 */
  const THEMES = optionIds(prefDef("theme"));
  function applyTheme() {
    const cur = prefs.get("theme");
    document.documentElement.dataset.theme = cur;
    const dark = cur === "dark" ||
      (cur === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
    $("#themeBtn").innerHTML = icon(dark ? "i-moon" : "i-sun", 17);
    $("#themeBtn").title = "主题：" + prefDef("theme").options.find(o => o[0] === cur)[1] + "（点击切换）";
  }
  $("#themeBtn").addEventListener("click", () => {
    const cur = prefs.get("theme");
    prefs.set("theme", THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length]);
    applyTheme();
    syncPrefUI();
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);

  /* 跨过断点时范文的批注要换位置（文末 <-> 段后），重渲染一次，滚动位置尽量留住。
     这里比对 resize 而不是听 matchMedia 的 change —— 后者在某些环境里
     （设备模拟、部分内嵌 WebView）matches 已经变了却不发事件，只认一个信号会漏。 */
  let lastWide = WIDE.matches, resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (WIDE.matches === lastWide) return;
      lastWide = WIDE.matches;
      if (route.section === "essays" && route.id) onRoute(true);
    }, 150);
  });

  /* ---------- 启动 ---------- */
  if (loaded.bad.length) {
    const b = document.createElement("div");
    b.className = "loaderr";
    b.setAttribute("role", "alert");
    b.textContent = "这些数据没能加载：" + loaded.bad.join("、") + "。对应板块暂时是空的。";
    document.querySelector(".topbar").insertAdjacentElement("afterend", b);
  }

  prefs.load();
  recent.load();
  store.load();
  applyTheme();
  window.addEventListener("hashchange", () => onRoute());
  if (!location.hash) location.replace("#/home");
  onRoute();
})();
