/* ============================================================
   English Lab — 应用逻辑
   路由 · 视图渲染 · 全站搜索 · 收藏 · 主题
   零依赖，零构建。直接打开 index.html 即可运行。
   ============================================================ */
(function () {
  "use strict";

  const DB = window.DB || {};
  const words = DB.words || [], roots = DB.roots || [], contrasts = DB.contrasts || [],
        phrases = DB.phrases || [], essays = DB.essays || [];

  /* ---------- 板块配置 ---------- */
  const SECTIONS = [
    { id: "home",      label: "概览", en: "OVERVIEW",     icon: "i-home",     count: () => null },
    { id: "words",     label: "单词", full: "单词剖析",   en: "WORD ANATOMY", icon: "i-word",     count: () => words.length },
    { id: "roots",     label: "词根", full: "词根词缀",   en: "WORD ROOTS",   icon: "i-roots",    count: () => roots.length },
    { id: "contrasts", label: "辨析", full: "关键辨析",   en: "CONTRASTS",    icon: "i-contrast", count: () => contrasts.length },
    { id: "phrases",   label: "句库", full: "好词好句",   en: "PHRASES",      icon: "i-phrase",   count: () => phrases.length },
    { id: "essays",    label: "范文", full: "范文解析",   en: "MODEL ESSAYS", icon: "i-essay",    count: () => essays.length },
    { id: "starred",   label: "收藏", full: "我的收藏",   en: "STARRED",      icon: "i-star",     count: () => store.stars.size || null }
  ];
  const sec = id => SECTIONS.find(s => s.id === id) || SECTIONS[0];
  const secName = s => s.full || s.label;

  /* ---------- 本地存储 ---------- */
  const store = {
    stars: new Set(),
    theme: "auto",
    sorts: { words: "alpha", roots: "alpha", contrasts: "alpha", phrases: "cat", essays: "year" },
    cards: { words: "min", roots: "min", contrasts: "min", phrases: "min", essays: "std" },  // min | std | full
    folds: {},                                       // 折叠状态：key -> false 表示已折叠，缺省为展开
    load() {
      try {
        this.stars = new Set(JSON.parse(localStorage.getItem("el.stars") || "[]"));
        this.theme = localStorage.getItem("el.theme") || "auto";
        Object.assign(this.sorts, JSON.parse(localStorage.getItem("el.sorts") || "{}"));
        Object.assign(this.cards, JSON.parse(localStorage.getItem("el.cards") || "{}"));
        this.folds = JSON.parse(localStorage.getItem("el.folds") || "{}");
      } catch (e) { /* 隐私模式下静默降级 */ }
    },
    save(k, v) { try { localStorage.setItem("el." + k, JSON.stringify(v)); } catch (e) {} },
    saveStars() { this.save("stars", [...this.stars]); },
    saveTheme() { try { localStorage.setItem("el.theme", this.theme); } catch (e) {} },
    saveSorts() { this.save("sorts", this.sorts); },
    saveCards() { this.save("cards", this.cards); },
    saveFolds() { this.save("folds", this.folds); },
    toggleStar(key) {
      this.stars.has(key) ? this.stars.delete(key) : this.stars.add(key);
      this.saveStars();
      return this.stars.has(key);
    },
    isOpen(key) { return this.folds[key] !== false; },
    setFold(key, open) {
      if (open) delete this.folds[key]; else this.folds[key] = false;
      this.saveFolds();
    }
  };

  /* ---------- 工具 ---------- */
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  /* 数据里允许用 **粗体** 做轻量强调 */
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  const icon = (id, size = 18) => `<svg width="${size}" height="${size}" aria-hidden="true"><use href="#${id}"/></svg>`;
  const starBtn = (key, label) =>
    `<button class="star${store.stars.has(key) ? " is-on" : ""}" data-star="${esc(key)}"
      aria-label="收藏 ${esc(label)}" aria-pressed="${store.stars.has(key)}">${icon("i-star", 17)}</button>`;

  /* 构词成分：三档强弱，不用三种色相 */
  const morph = parts => `<span class="morph">${(parts || []).map((p, i) =>
    `${i ? '<span class="morph__plus">+</span>' : ""}<span class="morph__part" data-k="${esc(p[2])}"><b>${esc(p[0])}</b><i>${esc(p[1])}</i></span>`
  ).join("")}</span>`;

  const MORPH_LEGEND = `<div class="legend">
    <span><i data-k="prefix"></i>前缀</span><span><i data-k="root"></i>词根</span><span><i data-k="suffix"></i>后缀</span>
  </div>`;

  const KIND_CN = { root: "词根", prefix: "前缀", suffix: "后缀" };

  /* ---------- 路由 ---------- */
  let route = { section: "home", id: null, q: "" };

  function parseHash() {
    const raw = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    const [head, ...rest] = raw.split("/");
    if (head === "search") return { section: "search", id: null, q: rest.join("/") };
    const s = SECTIONS.find(x => x.id === head);
    return { section: s ? s.id : "home", id: rest.join("/") || null, q: "" };
  }

  const go = hash => { location.hash = hash; };

  function onRoute() {
    const prev = route;
    route = parseHash();
    updateTrail(prev);
    const s = sec(route.section);
    $("#pageTitle").innerHTML = route.section === "search"
      ? `搜索结果<small>SEARCH</small>`
      : `${esc(secName(s))}<small>${esc(s.en)}</small>`;

    renderNav();
    $("#view").innerHTML = VIEWS[route.section] ? VIEWS[route.section](route) : VIEWS.home();
    syncFoldAllBtn();
    window.scrollTo({ top: 0 });
    if ($("#searchInput") !== document.activeElement) {
      $("#searchInput").value = route.section === "search" ? route.q : "";
      $("#searchBox").classList.toggle("has-value", !!$("#searchInput").value);
    }
  }

  /* ---------- 导航 ---------- */
  function renderNav() {
    const active = route.section;
    $("#nav").innerHTML = SECTIONS.map((s, i) => {
      const n = s.count();
      return `${i === 1 ? '<li class="nav-group">学习板块</li>' : ""}${i === 6 ? '<li class="nav-group">个人</li>' : ""}
      <li><a class="navitem${s.id === active ? " is-active" : ""}" href="#/${s.id}">
        <span class="navitem__ico">${icon(s.icon, 18)}</span>
        <span class="navitem__label">${esc(secName(s))}</span>
        ${n != null ? `<span class="navitem__count">${n}</span>` : ""}
      </a></li>`;
    }).join("");

    $("#tabbar").innerHTML = SECTIONS.map(s =>
      `<a class="tab${s.id === active ? " is-active" : ""}" href="#/${s.id}">
        <span class="tab__ico">${icon(s.icon, 21)}</span><span>${esc(s.label)}</span>
      </a>`).join("");
  }

  /* ============================================================
     访问栈 —— 顺着双向链接跳进去之后，能一层层原路退回来
     只记录详情页；回到任何列表页即清空
     ============================================================ */
  let trail = [];
  try { trail = JSON.parse(sessionStorage.getItem("el.trail") || "[]"); } catch (e) {}
  const saveTrail = () => { try { sessionStorage.setItem("el.trail", JSON.stringify(trail)); } catch (e) {} };

  const routeHash = r => `#/${r.section}${r.id ? "/" + r.id : ""}`;

  /* 一个详情页在栈里显示成什么 */
  function routeLabel(r) {
    const find = (arr, k) => (arr.find(x => x.id === r.id) || {})[k];
    switch (r.section) {
      case "words":     return find(words, "w");
      case "roots":     return find(roots, "form");
      case "contrasts": return find(contrasts, "title");
      case "essays":    return find(essays, "title");
      default:          return null;
    }
  }

  function updateTrail(prev) {
    if (!route.id) { if (trail.length) { trail = []; saveTrail(); } return; }
    const here = routeHash(route);
    const i = trail.findIndex(t => t.hash === here);
    if (i >= 0) {
      trail = trail.slice(0, i);                 // 回到栈里已有的一层：弹出它上面的所有层
    } else if (prev && prev.id) {
      const ph = routeHash(prev), pl = routeLabel(prev);
      if (ph !== here && pl) {
        trail.push({ hash: ph, label: pl });
        if (trail.length > 8) trail = trail.slice(-8);
      }
    }
    saveTrail();
  }

  /* ---------- 通用片段 ---------- */
  const backbar = (href, text) => `<a class="backbar" href="${href}">${icon("i-back", 15)}${esc(text)}</a>`;
  const sechead = (title, meta) =>
    `<div class="sechead"><h2>${esc(title)}</h2>${meta ? `<span class="sechead__meta">${esc(meta)}</span>` : ""}<span class="sechead__rule"></span></div>`;

  /* 折叠区。key 决定记忆粒度：详情页用板块级 key（同类条目共享），分组用 排序模式+组名 */
  function fold(key, title, meta, body, opt) {
    opt = opt || {};
    return `<details class="fold${opt.group ? " fold--group" : ""}${opt.n ? " fold--sense" : ""}" data-fold="${esc(key)}"${store.isOpen(key) ? " open" : ""}>
      <summary class="fold__sum">
        <span class="fold__chev">${icon("i-chev", 14)}</span>
        ${opt.n ? `<span class="fold__n">${opt.n}</span>` : ""}
        ${opt.key ? `<span class="fold__key">${esc(opt.key)}</span>` : ""}
        <span class="fold__title">${esc(title)}</span>
        ${meta ? `<span class="fold__meta">${esc(meta)}</span>` : ""}
        <span class="fold__rule"></span>
      </summary>
      <div class="fold__body">${body}</div>
    </details>`;
  }

  /* 全部折叠 / 全部展开 */
  const foldAllBtn = () => `<button class="btn" id="foldAll" data-foldall>
    <span class="foldall__ico">${icon("i-collapse", 15)}</span><span class="foldall__txt">全部折叠</span></button>`;

  /* 视图控件：筛选和排序都收进这一个可展开的按钮里 */
  let ctrlOpen = false;
  function ctrl(state, groups) {
    return `<details class="ctrl" data-ctrl${ctrlOpen ? " open" : ""}>
      <summary class="ctrl__btn">
        ${icon("i-sort", 14)}
        ${state.map((s, i) => `${i ? '<span class="ctrl__sep">·</span>' : ""}<span class="ctrl__state">${esc(s)}</span>`).join("")}
        <span class="ctrl__chev">${icon("i-chev", 12)}</span>
      </summary>
      <div class="ctrl__panel">
        ${groups.map(g => `<div class="ctrl__group">
          <div class="ctrl__label">${esc(g.label)}</div>
          <div class="chips">${g.chips}</div>
        </div>`).join("")}
      </div>
    </details>`;
  }
  const ctrlbar = (inner, back) => `<div class="ctrlbar">
    ${back || ""}${inner || ""}<span class="ctrlbar__end">${foldAllBtn()}</span>
  </div>`;
  const empty = (t, sub) =>
    `<div class="empty"><div class="empty__icon">◌</div><p>${esc(t)}</p>${sub ? `<p style="font-size:var(--fs-sm);margin-top:6px">${esc(sub)}</p>` : ""}</div>`;
  /* 找不到条目时的兜底 */
  const notFound = (backHref, backText) =>
    `<div class="view wrap--read">${backbar(backHref, backText)}${empty("没有找到这个条目", "它可能已被改名或删除。")}</div>`;

  /* ============================================================
     视图
     ============================================================ */
  const VIEWS = {};

  /* ---------- 首页 ---------- */
  const TILE_DESC = {
    words: "一个词为什么有这么多意思",
    roots: "拆开构词，理解而非硬背",
    contrasts: "近义与形近词的精确边界",
    phrases: "可直接调用的句式与搭配",
    essays: "逐句批注，看清好在哪里"
  };

  VIEWS.home = function () {
    const totalWords = roots.reduce((n, r) => n + rootWords(r).length, 0);
    const tiles = SECTIONS.slice(1, 6).map(s => `
      <a class="tile" href="#/${s.id}">
        <div class="tile__n">${s.count()}</div>
        <div class="tile__t">${esc(secName(s))}</div>
        <div class="tile__d">${esc(TILE_DESC[s.id])}</div>
      </a>`).join("");

    const pick = (arr, seed) => arr.length ? arr[seed % arr.length] : null;
    const seed = Math.floor(Date.now() / 864e5);           // 每天换一组
    const r = pick(roots, seed), c = pick(contrasts, seed + 1), p = pick(phrases, seed + 2);

    return `<div class="view wrap">
      <section class="hero">
        <h1>今天想理解点什么？</h1>
        <p>这里存放的不是待背清单，而是已经被拆开、讲透的语言知识。
           共 ${words.length} 个单词剖析、${roots.length} 组词根词缀（带出 ${totalWords} 个派生词）、${contrasts.length} 组辨析、${phrases.length} 条表达、${essays.length} 篇范文解析。</p>
      </section>

      <div class="tiles block">${tiles}</div>

      <div class="block">
        ${sechead("今日三则", "每天自动轮换")}
        <div class="daily">
          ${r ? `<a class="daily__card" href="#/roots/${esc(r.id)}">
            <div class="daily__kind">${esc(KIND_CN[r.kind])}</div>
            <div class="en" style="font-size:var(--fs-lg);font-weight:700;margin:2px 0 4px">${esc(r.form)}</div>
            <div style="color:var(--ink-2);font-size:var(--fs-sm)">${esc(r.meaning)} · ${(r.senses || []).length} 层含义</div>
          </a>` : ""}
          ${c ? `<a class="daily__card" href="#/contrasts/${esc(c.id)}">
            <div class="daily__kind">辨析 · ${esc(c.tag)}</div>
            <div class="en" style="font-size:var(--fs-md);font-weight:700;margin:2px 0 4px">${esc(c.title)}</div>
            <div style="color:var(--ink-2);font-size:var(--fs-sm)">${esc(c.oneLiner)}</div>
          </a>` : ""}
          ${p ? `<a class="daily__card" href="#/phrases">
            <div class="daily__kind">表达 · ${esc(p.cat)}</div>
            <div class="en" style="font-size:var(--fs-md);font-weight:600;margin:2px 0 4px">${esc(p.en)}</div>
            <div style="color:var(--ink-2);font-size:var(--fs-sm)">${esc(p.zh)}</div>
          </a>` : ""}
        </div>
      </div>

      <div class="block">
        ${sechead("最近加入")}
        ${recentList()}
      </div>
    </div>`;
  };

  function recentList() {
    const items = [
      ...roots.slice(-3).map(r => ({ href: `#/roots/${r.id}`, k: KIND_CN[r.kind], t: r.form, d: r.meaning })),
      ...contrasts.slice(-2).map(c => ({ href: `#/contrasts/${c.id}`, k: "辨析", t: c.title, d: c.tag })),
      ...essays.slice(-2).map(e => ({ href: `#/essays/${e.id}`, k: "范文", t: e.title, d: e.genre, ui: true }))
    ].reverse();
    return items.map(i => `<a class="minirow" href="${i.href}">
      <span class="tag tag--line">${esc(i.k)}</span>
      <span class="minirow__t"${i.ui ? ' style="font-family:var(--font-ui)"' : ""}>${esc(i.t)}</span>
      <span class="minirow__d">${esc(i.d)}</span>
    </a>`).join("");
  }

  /* ============================================================
     排序 —— 排序方式同时决定分组方式，每组可独立折叠
     ============================================================ */
  const byName = (a, b) => a.localeCompare(b, "en");
  /* 后缀写成 "-able / -ible"，取首字母和排序前要剥掉前导连字符 */
  const bare = s => s.replace(/^[-\s]+/, "");
  const byForm = (a, b) => byName(bare(a.form), bare(b.form));

  const SORTS = {
    words: [
      { id: "alpha", label: "字母",
        group: x => x.w[0].toUpperCase(),
        cmp: (a, b) => byName(a.w, b.w) },
      { id: "senses", label: "义项数",
        group: x => { const n = (x.senses || []).length; return n >= 5 ? "5 个以上" : n >= 3 ? "3–4 个" : "1–2 个"; },
        order: ["5 个以上", "3–4 个", "1–2 个"],
        cmp: (a, b) => (b.senses || []).length - (a.senses || []).length || byName(a.w, b.w) },
      { id: "linked", label: "关联",
        group: x => (x.contrasts || []).length || rootsOf(x).length ? "有关联" : "暂无关联",
        order: ["有关联", "暂无关联"],
        cmp: (a, b) => byName(a.w, b.w) },
      { id: "star", label: "收藏",
        group: x => store.stars.has("words:" + x.id) ? "已收藏" : "未收藏",
        order: ["已收藏", "未收藏"],
        cmp: (a, b) => byName(a.w, b.w) }
    ],
    roots: [
      { id: "alpha", label: "字母",
        group: x => bare(x.form)[0].toUpperCase(),
        cmp: byForm },
      { id: "kind", label: "类型",
        group: x => KIND_CN[x.kind], order: ["前缀", "词根", "后缀"],
        cmp: byForm },
      { id: "count", label: "派生词量",
        group: x => { const n = rootWords(x).length; return n >= 8 ? "8 个及以上" : n >= 5 ? "5–7 个" : "1–4 个"; },
        order: ["8 个及以上", "5–7 个", "1–4 个"],
        cmp: (a, b) => rootWords(b).length - rootWords(a).length || byForm(a, b) },
      { id: "senses", label: "义项数",
        group: x => { const n = (x.senses || []).length; return n >= 4 ? "4 层以上" : n === 3 ? "3 层" : "1–2 层"; },
        order: ["4 层以上", "3 层", "1–2 层"],
        cmp: (a, b) => (b.senses || []).length - (a.senses || []).length || byForm(a, b) },
      { id: "star", label: "收藏",
        group: x => store.stars.has("roots:" + x.id) ? "已收藏" : "未收藏",
        order: ["已收藏", "未收藏"],
        cmp: byForm }
    ],
    contrasts: [
      { id: "alpha", label: "字母",
        group: x => x.title[0].toUpperCase(),
        cmp: (a, b) => byName(a.title, b.title) },
      { id: "tag", label: "类别",
        group: x => x.tag, order: [...new Set(contrasts.map(c => c.tag))],   // 按数据文件里出现的顺序
        cmp: (a, b) => byName(a.title, b.title) },
      { id: "level", label: "难度",
        group: x => x.level, order: ["核心", "进阶"],
        cmp: (a, b) => byName(a.title, b.title) },
      { id: "star", label: "收藏",
        group: x => store.stars.has("contrasts:" + x.id) ? "已收藏" : "未收藏",
        order: ["已收藏", "未收藏"],
        cmp: (a, b) => byName(a.title, b.title) }
    ],
    phrases: [
      { id: "cat", label: "主题",
        /* 保留数据文件里的编排顺序：观点→因果→让步→数据→举例→结尾→替换→用法→金句 */
        group: x => x.cat, order: [...new Set(phrases.map(p => p.cat))],
        cmp: (a, b) => a.id.localeCompare(b.id) },
      { id: "type", label: "形式",
        group: x => x.type, order: ["句式", "搭配", "替换", "用法", "金句"],
        cmp: (a, b) => byName(a.en, b.en) },
      { id: "alpha", label: "字母",
        group: x => x.en[0].toUpperCase(),
        cmp: (a, b) => byName(a.en, b.en) },
      { id: "star", label: "收藏",
        group: x => store.stars.has("phrases:" + x.id) ? "已收藏" : "未收藏",
        order: ["已收藏", "未收藏"],
        cmp: (a, b) => byName(a.en, b.en) }
    ],
    essays: [
      /* 真题按年份倒序分组，非真题垫底 */
      { id: "year", label: "年份",
        group: x => x.year ? x.year + " 年" : "非真题",
        order: [...new Set(essays.map(e => e.year))]
          .sort((a, b) => (b || 0) - (a || 0))
          .map(y => y ? y + " 年" : "非真题"),
        cmp: (a, b) => (a.part || "").localeCompare(b.part || "") },
      { id: "exam", label: "考试",
        group: x => x.exam || "其他", order: [...new Set(essays.map(e => e.exam || "其他"))],
        cmp: (a, b) => (b.year || 0) - (a.year || 0) },
      { id: "part", label: "题型",
        group: x => x.part || "未分类", order: [...new Set(essays.map(e => e.part || "未分类"))],
        cmp: (a, b) => (b.year || 0) - (a.year || 0) },
      { id: "topic", label: "主题",
        group: x => x.topic || "未分类", order: [...new Set(essays.map(e => e.topic || "未分类"))],
        cmp: (a, b) => (b.year || 0) - (a.year || 0) },
      { id: "star", label: "收藏",
        group: x => store.stars.has("essays:" + x.id) ? "已收藏" : "未收藏",
        order: ["已收藏", "未收藏"],
        cmp: (a, b) => (b.year || 0) - (a.year || 0) }
    ]
  };

  const sortMode = kind => SORTS[kind].find(s => s.id === store.sorts[kind]) || SORTS[kind][0];

  function groupItems(items, mode) {
    const g = new Map();
    items.forEach(x => {
      const k = mode.group(x);
      if (!g.has(k)) g.set(k, []);
      g.get(k).push(x);
    });
    let keys = [...g.keys()];
    keys.sort(mode.order
      ? (a, b) => mode.order.indexOf(a) - mode.order.indexOf(b)
      : (a, b) => a.localeCompare(b, "zh"));
    if (mode.cmp) keys.forEach(k => g.get(k).sort(mode.cmp));
    return keys.map(k => [k, g.get(k)]);
  }

  /* 卡片样式：默认只显示英文，需要更多信息再往上加 */
  const CARD_STYLES = [["min", "极简"], ["std", "标准"], ["full", "详细"]];
  const cardStyle = kind => store.cards[kind] || "min";
  const gridCls = (kind, base) => `${base} cards-${cardStyle(kind)}`;

  /* 列表页顶部：一个「视图」按钮装下筛选 + 排序 + 卡片样式，外加全部折叠 */
  function listBar(kind, filter) {
    const curSort = store.sorts[kind], curCard = cardStyle(kind);
    const groups = [];
    if (filter) groups.push({ label: filter.label, chips: filter.chips });
    groups.push({
      label: "排序 / 分组",
      chips: SORTS[kind].map(s =>
        `<button class="chip${s.id === curSort ? " is-on" : ""}" data-sort="${kind}:${s.id}">${esc(s.label)}</button>`).join("")
    });
    groups.push({
      label: "卡片",
      chips: CARD_STYLES.map(([id, l]) =>
        `<button class="chip${id === curCard ? " is-on" : ""}" data-cardstyle="${kind}:${id}">${l}</button>`).join("")
    });
    const state = [];
    if (filter) state.push(filter.current);
    state.push(sortMode(kind).label);
    state.push((CARD_STYLES.find(c => c[0] === curCard) || CARD_STYLES[0])[1]);
    return ctrlbar(ctrl(state, groups));
  }

  /* 详情页顶部：返回 + 访问栈 + 全部折叠 */
  const detailBar = (href, text) => ctrlbar("", backbar(href, text) + trailBar());

  function trailBar() {
    if (!trail.length) return "";
    return `<nav class="trail" aria-label="访问路径">
      ${trail.map(t => `<a class="trail__item" href="${esc(t.hash)}">${esc(t.label)}</a>
        <span class="trail__sep" aria-hidden="true">${icon("i-chev", 10)}</span>`).join("")}
    </nav>`;
  }

  /* 渲染分组后的卡片墙 */
  function groupedGrid(kind, items, card, gridClass) {
    const mode = sortMode(kind);
    return groupItems(items, mode).map(([k, arr]) =>
      fold(`g.${kind}.${mode.id}.${k}`, k, arr.length + " 条",
        `<div class="${gridCls(kind, gridClass)}">${arr.map(card).join("")}</div>`,
        { group: true, key: mode.id === "alpha" ? k : null })
    ).join("");
  }

  /* ============================================================
     单词剖析 —— 核心图景 → 多维义项 → 构词与边界，全部带双向链接
     ============================================================ */

  /* 词根的派生词分散在各义项下，取全部时统一走这里 */
  const rootWords = r => (r.senses || []).reduce((a, s) => a.concat(s.words || []), []);

  /* 一个单词关联到哪些词根条目：显式 rootRefs 优先，其次按 parts 的形式匹配 */
  function rootsOf(x) {
    const out = new Map();
    (x.rootRefs || []).forEach(id => { const r = roots.find(v => v.id === id); if (r) out.set(r.id, r); });
    (x.parts || []).forEach(p => {
      const form = String(p[0]).replace(/^-+|-+$/g, "").toLowerCase();
      if (!form) return;
      const r = roots.find(v => v.form.toLowerCase().split(/\s*\/\s*/)
        .some(f => f.replace(/^-+|-+$/g, "").trim() === form));
      if (r) out.set(r.id, r);
    });
    return [...out.values()];
  }

  /* 反向索引：谁指向了我。正向链接只写一次，反向自动生成 */
  let BACKLINKS = null;
  function backlinks() {
    if (BACKLINKS) return BACKLINKS;
    BACKLINKS = { word: {}, root: {} };
    const push = (b, k, v) => { (b[k] = b[k] || []).push(v); };
    words.forEach(x => {
      (x.contrasts || []).forEach(c => {
        const t = words.find(v => v.id === c.w || v.w.toLowerCase() === String(c.w).toLowerCase());
        if (t && t.id !== x.id) push(BACKLINKS.word, t.id, { from: x, note: c.note });
      });
      rootsOf(x).forEach(r => push(BACKLINKS.root, r.id, x));
    });
    return BACKLINKS;
  }

  VIEWS.words = function (r) {
    if (r.id) {
      const x = words.find(v => v.id === r.id);
      return x ? `<div class="view wrap--read">${detailBar("#/words", "单词剖析")}${wordDetail(x)}</div>`
        : notFound("#/words", "单词剖析");
    }
    return `<div class="view wrap">
      ${listBar("words")}
      ${words.length ? groupedGrid("words", words, wordCard, "cardgrid cardgrid--root")
                     : empty("还没有单词", "在 data/words.js 里追加条目即可。")}
    </div>`;
  };

  const wordCard = x => {
    const st = cardStyle("words");
    return `<div class="entry entry--${st}">
      ${st === "full" ? `<div class="entry__top"><span class="tag tag--line">${(x.senses || []).length} 个义项</span></div>` : ""}
      <a class="entry__form entry__link" href="#/words/${esc(x.id)}">${esc(x.w)}</a>
      ${st === "min" ? "" : `<div class="entry__mean" style="font-weight:550">${esc(x.core)}</div>`}
      ${st === "full" && x.image ? `<p class="entry__desc">${esc(x.image)}</p>` : ""}
      ${starBtn("words:" + x.id, x.w)}
    </div>`;
  };

  /* 指向另一个条目的小链接 */
  const xlink = (href, label, sub) => `<a class="xlink" href="${href}">
    <span class="xlink__ico">${icon("i-link", 13)}</span>
    <span class="xlink__t">${esc(label)}</span>
    ${sub ? `<span class="xlink__d">${esc(sub)}</span>` : ""}
  </a>`;

  function wordDetail(x) {
    const rel = rootsOf(x);
    const back = backlinks().word[x.id] || [];
    /* 正向对比里已经出现过的词，反向就不再重复列一遍 */
    const fwdIds = new Set((x.contrasts || []).map(c => String(c.w).toLowerCase()));
    const backOnly = back.filter(b => !fwdIds.has(b.from.id.toLowerCase()) && !fwdIds.has(b.from.w.toLowerCase()));

    return `<article>
      <header class="page__head page__row">
        <div style="flex:1;min-width:0">
          <div class="page__eyebrow">单词剖析${x.pos ? " · " + esc(x.pos) : ""}</div>
          <h1 class="page__form">${esc(x.w)}</h1>
        </div>
        ${starBtn("words:" + x.id, x.w)}
      </header>

      ${fold("d.word.core", "核心图景", null,
        `<div class="callout"><p style="font-size:var(--fs-md)">${md(x.core)}</p></div>
         ${x.image ? `<p class="wordimage">${md(x.image)}</p>` : ""}`)}

      ${(x.origin || (x.parts && x.parts.length) || rel.length) ? fold("d.word.morph", "构词与词源", null,
        `${x.origin ? `<p class="wordorigin">${md(x.origin)}</p>` : ""}
         ${x.parts && x.parts.length ? `<div style="margin:var(--s3) 0">${morph(x.parts)}</div>${MORPH_LEGEND}` : ""}
         ${rel.length ? `<div class="xlinks" style="margin-top:var(--s3)">
            ${rel.map(rt => xlink("#/roots/" + esc(rt.id), rt.form, rt.meaning)).join("")}
          </div>` : ""}`) : ""}

      ${fold("d.word.senses", "义项", (x.senses || []).length + " 个",
        (x.senses || []).map((s, i) => `<section class="sense">
          <div class="sense__head">
            <span class="sense__n">${i + 1}</span>
            <h3 class="sense__dim">${esc(s.dim)}</h3>
            ${s.tag ? `<span class="tag">${esc(s.tag)}</span>` : ""}
          </div>
          <div class="sense__zh">${esc(s.zh)}</div>
          <p class="sense__scene">${md(s.scene)}</p>
          ${s.feature ? `<p class="sense__feature"><b>状态特征 · </b>${md(s.feature)}</p>` : ""}
          ${(s.ex || []).map(e => `<div class="sense__ex">
            <p class="sense__exen">${esc(e.en)}</p>
            <p class="sense__exzh">${esc(e.zh)}</p>
          </div>`).join("")}
        </section>`).join(""))}

      ${(x.contrasts && x.contrasts.length) || backOnly.length ? fold("d.word.links", "边界与关联",
        ((x.contrasts || []).length + backOnly.length) + " 条",
        `${(x.contrasts || []).map(c => {
            const t = words.find(v => v.id === c.w || v.w.toLowerCase() === String(c.w).toLowerCase());
            return `<div class="rel">
              <div class="rel__head">
                <span class="rel__vs">vs.</span>
                ${t ? `<a class="rel__w rel__w--link" href="#/words/${esc(t.id)}">${esc(t.w)}</a>`
                    : `<span class="rel__w">${esc(c.w)}</span>`}
              </div>
              <p class="rel__note">${md(c.note)}</p>
            </div>`;
          }).join("")}
         ${backOnly.map(b => `<div class="rel rel--back">
            <div class="rel__head">
              <span class="rel__vs">${icon("i-link", 12)}被提到</span>
              <a class="rel__w rel__w--link" href="#/words/${esc(b.from.id)}">${esc(b.from.w)}</a>
            </div>
            <p class="rel__note">${md(b.note)}</p>
          </div>`).join("")}`) : ""}

      ${x.summary ? fold("d.word.summary", "一句话带走", null,
        `<div class="callout"><p>${md(x.summary)}</p></div>`) : ""}
    </article>`;
  }

  /* ---------- 词根词缀 ---------- */
  let rootFilter = "all";

  VIEWS.roots = function (r) {
    /* 详情：独立页面 */
    if (r.id) {
      const x = roots.find(v => v.id === r.id);
      return x ? `<div class="view wrap--read">${detailBar("#/roots", "词根词缀")}${rootDetail(x)}</div>`
        : notFound("#/roots", "词根词缀");
    }

    /* 列表：视图控件 + 分组卡片墙 */
    const list = roots.filter(x => rootFilter === "all" || x.kind === rootFilter);
    const opts = [["all", "全部"], ["root", "词根"], ["prefix", "前缀"], ["suffix", "后缀"]];
    const filter = {
      label: "只看",
      current: (opts.find(o => o[0] === rootFilter) || opts[0])[1],
      chips: opts.map(([k, l]) => `<button class="chip${rootFilter === k ? " is-on" : ""}" data-rootfilter="${k}">${l} ${
        k === "all" ? roots.length : roots.filter(x => x.kind === k).length}</button>`).join("")
    };

    return `<div class="view wrap">
      ${listBar("roots", filter)}
      ${list.length ? groupedGrid("roots", list, rootCard, "cardgrid cardgrid--root") : empty("这一类还没有内容")}
    </div>`;
  };

  /* 卡片用「拉伸链接」：整卡可点，但星号按钮不嵌套在 <a> 里面 */
  const rootCard = x => {
    const st = cardStyle("roots");
    const ws = rootWords(x), n = (x.senses || []).length;
    return `<div class="entry entry--${st}">
      ${st === "full" ? `<div class="entry__top"><span class="tag tag--line">${esc(KIND_CN[x.kind])}</span>
        <span class="tag">${n} 层含义</span></div>` : ""}
      <a class="entry__form entry__link" href="#/roots/${esc(x.id)}">${esc(x.form)}</a>
      ${st === "min" ? "" : `<div class="entry__mean">${esc(x.meaning)}</div>`}
      ${st === "full" ? `<div class="entry__gloss">${esc(x.gloss)}</div>
        <div class="entry__foot">
          <span class="entry__peek">${ws.slice(0, 2).map(w => esc(w.w)).join(" · ")}…</span>
          <span class="entry__n">${ws.length} 词</span>
        </div>` : ""}
      ${starBtn("roots:" + x.id, x.form)}
    </div>`;
  };

  function rootDetail(x) {
    const rel = (x.related || []).map(id => roots.find(r => r.id === id)).filter(Boolean);
    const senses = x.senses || [];
    return `<article>
      <header class="page__head page__row">
        <div style="flex:1;min-width:0">
          <div class="page__eyebrow">${esc(KIND_CN[x.kind])} · ${esc(x.origin)}</div>
          <h1 class="page__form">${esc(x.form)}</h1>
          <div class="page__mean">${esc(x.meaning)}</div>
          <div class="page__gloss">${esc(x.gloss)}</div>
        </div>
        ${starBtn("roots:" + x.id, x.form)}
      </header>

      <div class="sensenav">
        <span class="sensenav__label">${senses.length} 层含义</span>
        ${senses.map((s, i) => `<span class="sensenav__item"><b>${i + 1}</b>${esc(s.meaning)}</span>`).join("")}
      </div>

      <div style="margin-bottom:var(--s4)">${MORPH_LEGEND}</div>

      ${senses.map((s, i) => fold(`d.root.${x.id}.s${i}`,
        s.meaning, (s.words || []).length + " 个词",
        `${s.gloss ? `<div class="sensegloss">${esc(s.gloss)}</div>` : ""}
         ${s.note ? `<p class="sensenote">${md(s.note)}</p>` : ""}
         <div class="card card--pad">
           ${(s.words || []).map(w => `
             <div class="wordrow">
               <div class="wordrow__top">
                 <span class="wordrow__w">${esc(w.w)}</span>
                 <span class="wordrow__def">${esc(w.def)}</span>
               </div>
               <div class="wordrow__morph">${morph(w.parts)}</div>
               ${w.ex ? `<p class="wordrow__ex">${esc(w.ex)}</p>` : ""}
             </div>`).join("")}
         </div>`,
        { n: i + 1 })).join("")}

      ${rel.length ? fold("d.roots.related", "相关词根", rel.length + " 组",
        `<div class="chips">${rel.map(r => `<a class="chip" href="#/roots/${esc(r.id)}">${esc(r.form)} · ${esc(r.meaning)}</a>`).join("")}</div>`) : ""}

      ${(backlinks().root[x.id] || []).length ? fold("d.roots.words", "用到它的单词剖析",
        backlinks().root[x.id].length + " 个",
        `<div class="xlinks">${backlinks().root[x.id].map(w =>
          xlink("#/words/" + esc(w.id), w.w, w.core)).join("")}</div>`) : ""}
    </article>`;
  }

  /* ---------- 关键辨析 ---------- */
  VIEWS.contrasts = function (r) {
    if (r.id) {
      const x = contrasts.find(v => v.id === r.id);
      return x ? `<div class="view wrap--read">${detailBar("#/contrasts", "关键辨析")}${contrastDetail(x)}</div>`
        : notFound("#/contrasts", "关键辨析");
    }
    return `<div class="view wrap">
      ${listBar("contrasts")}
      ${contrasts.length ? groupedGrid("contrasts", contrasts, contrastCard, "cardgrid cardgrid--cmp") : empty("还没有辨析条目")}
    </div>`;
  };

  const contrastCard = x => {
    const st = cardStyle("contrasts");
    return `<div class="entry entry--${st}">
      ${st === "min" ? "" : `<div class="entry__top"><span class="tag tag--line">${esc(x.tag)}</span></div>`}
      <a class="entry__title entry__link" href="#/contrasts/${esc(x.id)}">${esc(x.title)}</a>
      ${st === "full" ? `<p class="entry__desc">${esc(x.oneLiner)}</p>
        <div class="entry__foot">
          <span class="tag">${esc(x.level)}</span>
          <span class="entry__n">${x.items.length} 词${x.drills ? " · " + x.drills.length + " 题" : ""}</span>
        </div>` : ""}
      ${starBtn("contrasts:" + x.id, x.title)}
    </div>`;
  };

  function contrastDetail(x) {
    return `<article>
      <header class="page__head page__row">
        <div style="flex:1;min-width:0">
          <div class="page__eyebrow">${esc(x.tag)} · ${esc(x.level)}</div>
          <h1 class="page__title">${esc(x.title)}</h1>
        </div>
        ${starBtn("contrasts:" + x.id, x.title)}
      </header>

      ${fold("d.cmp.oneliner", "一句话区分", null,
        `<div class="callout"><p>${md(x.oneLiner)}</p></div>`)}

      ${fold("d.cmp.items", "逐词拆解", x.items.length + " 个",
        `<div class="cmp" data-n="${x.items.length}">
          ${x.items.map(i => `<div class="cmpcell">
            <div><span class="cmpcell__w">${esc(i.w)}</span><span class="cmpcell__pos">${esc(i.pos)}</span></div>
            <div class="cmpcell__core">${esc(i.core)}</div>
            <p class="cmpcell__nuance">${md(i.nuance)}</p>
            ${i.ex ? `<p class="cmpcell__ex">${esc(i.ex)}</p><p class="cmpcell__exzh">${esc(i.exZh || "")}</p>` : ""}
          </div>`).join("")}
        </div>`)}

      ${x.pitfalls && x.pitfalls.length ? fold("d.cmp.pitfalls", "易错点", x.pitfalls.length + " 条",
        `<ul class="pitfalls card card--pad">${x.pitfalls.map(p => `<li>${md(p)}</li>`).join("")}</ul>`) : ""}

      ${x.drills && x.drills.length ? fold("d.cmp.drills", "自测", "点一下看答案",
        x.drills.map((d, i) => `<div class="drill">
          <p class="drill__q">${esc(d.q)}</p>
          <button class="btn" style="margin-top:var(--s2)" data-drill="${i}">显示答案</button>
          <div class="drill__a" hidden>
            <span class="drill__ans">${esc(d.a)}</span> — <span class="drill__why">${esc(d.why)}</span>
          </div>
        </div>`).join("")) : ""}
    </article>`;
  }

  /* ---------- 好词好句 ---------- */
  let phraseType = "全部";

  VIEWS.phrases = function () {
    const types = ["全部", ...new Set(phrases.map(p => p.type))];
    const list = phrases.filter(p => phraseType === "全部" || p.type === phraseType);
    const filter = {
      label: "只看",
      current: phraseType,
      chips: types.map(t => `<button class="chip${phraseType === t ? " is-on" : ""}" data-phrasetype="${esc(t)}">${esc(t)}${
        t === "全部" ? " " + phrases.length : " " + phrases.filter(p => p.type === t).length}</button>`).join("")
    };

    return `<div class="view wrap">
      ${listBar("phrases", filter)}
      ${list.length ? groupedGrid("phrases", list, phraseCard, "pgrid") : empty("这一类还没有内容")}
    </div>`;
  };

  /* 句库没有详情页，所以极简样式做成「点开揭示」：正面只有英文，点一下出中文和注解 */
  const phraseCard = p => {
    const st = cardStyle("phrases");
    const copyBtn = `<button class="btn btn--ghost btn--icon" data-copy="${esc(p.en)}" title="复制英文" aria-label="复制英文"
      style="margin-left:auto;width:26px;height:26px">${icon("i-copy", 14)}</button>`;
    const foot = `<div class="phrase__foot">
      <span class="tag tag--accent">${esc(p.type)}</span>
      ${st === "min" || st === "full" ? (p.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join("") : ""}
      ${copyBtn}
    </div>`;
    const body = `<p class="phrase__zh">${esc(p.zh)}</p>
      ${st !== "std" && p.note ? `<p class="phrase__note">${md(p.note)}</p>` : ""}
      ${foot}`;

    if (st === "min") return `<article class="phrase phrase--min" data-phrase role="button" tabindex="0" aria-expanded="false">
      <p class="phrase__en">${esc(p.en)}</p>
      <div class="phrase__body">${body}</div>
      ${starBtn("phrases:" + p.id, p.en)}
    </article>`;

    return `<article class="phrase">
      <p class="phrase__en">${esc(p.en)}</p>
      ${body}
      ${starBtn("phrases:" + p.id, p.en)}
    </article>`;
  };

  /* ---------- 范文解析 ---------- */
  let essayExam = "全部";

  VIEWS.essays = function (r) {
    if (r.id) {
      const e = essays.find(v => v.id === r.id);
      return e ? `<div class="view wrap--read">${detailBar("#/essays", "范文解析")}${essayReader(e)}</div>`
        : notFound("#/essays", "范文解析");
    }
    const exams = ["全部", ...new Set(essays.map(e => e.exam || "其他"))];
    const list = essays.filter(e => essayExam === "全部" || (e.exam || "其他") === essayExam);
    const filter = {
      label: "只看",
      current: essayExam,
      chips: exams.map(x => `<button class="chip${essayExam === x ? " is-on" : ""}" data-essayexam="${esc(x)}">${esc(x)} ${
        x === "全部" ? essays.length : essays.filter(e => (e.exam || "其他") === x).length}</button>`).join("")
    };

    return `<div class="view wrap">
      ${listBar("essays", filter)}
      ${list.length ? groupedGrid("essays", list, essayCard, "cardgrid cardgrid--cmp")
                    : empty("这一类还没有范文", "在 data/essays.js 里追加条目即可。")}
    </div>`;
  };

  const essayCard = e => {
    const st = cardStyle("essays");
    const meta = [e.exam, e.part].filter(Boolean).join(" · ");
    return `<div class="entry entry--essay entry--${st}">
      ${st === "min" ? "" : `<div class="entry__top">
        ${e.year ? `<span class="entry__year">${e.year}</span>` : ""}
        <span class="tag tag--line">${esc(meta || e.genre)}</span>
      </div>`}
      <a class="entry__title entry__link" href="#/essays/${esc(e.id)}">${esc(e.title)}</a>
      ${st === "full" ? `<p class="entry__desc entry__desc--en">${esc(e.prompt)}</p>
        <div class="entry__foot">
          <span class="tag tag--accent">${esc(e.level)}</span>
          <span class="tag">${e.words} words</span>
          <span class="entry__n">${e.paragraphs.reduce((n, p) => n + (p.notes ? p.notes.length : 0), 0)} 批注</span>
        </div>` : ""}
      ${starBtn("essays:" + e.id, e.title)}
    </div>`;
  };

  /* 把 notes[].mark 在正文中高亮，并挂上可展开的批注 */
  function annotate(text, notes) {
    const marks = (notes || []).map((n, i) => ({ i, idx: text.indexOf(n.mark), len: n.mark.length }))
      .filter(m => m.idx >= 0).sort((a, b) => a.idx - b.idx);
    let out = "", cur = 0;
    marks.forEach(m => {
      if (m.idx < cur) return;                       // 重叠则跳过后一个
      out += esc(text.slice(cur, m.idx));
      out += `<span class="anno" data-anno="${m.i}" role="button" tabindex="0">${esc(text.substr(m.idx, m.len))}</span>`;
      cur = m.idx + m.len;
    });
    return out + esc(text.slice(cur));
  }

  function essayReader(e) {
    return `<article>
      <header class="page__head">
        <div class="page__row">
          <div style="flex:1;min-width:0">
            <div class="page__eyebrow">${esc([e.exam, e.year ? e.year + " 年" : null, e.part].filter(Boolean).join(" · ") || e.genre)}</div>
            <h1 style="font-size:var(--fs-xl);margin:6px 0 8px">${esc(e.title)}</h1>
            <div class="phrase__foot">
              <span class="tag tag--accent">${esc(e.level)}</span>
              <span class="tag">${esc(e.genre)}</span>
              ${e.topic ? `<span class="tag">${esc(e.topic)}</span>` : ""}
              <span class="tag">${e.words} words</span>
            </div>
          </div>
          ${starBtn("essays:" + e.id, e.title)}
        </div>
      </header>

      ${fold("d.essay.prompt", "题目", null,
        `<div class="promptbox"><p>${esc(e.prompt)}</p></div>`)}

      ${fold("d.essay.outline", "结构提纲", e.outline.length + " 段",
        `<ul class="outline card card--pad">
          ${e.outline.map(o => `<li><span class="outline__label">${esc(o.label)}</span><span class="outline__purpose">${esc(o.purpose)}</span></li>`).join("")}
        </ul>`)}

      ${fold("d.essay.body", "正文与批注", "点击带底色的部分看讲解",
        e.paragraphs.map((p, pi) => `
          <section class="para" data-para="${pi}">
            <span class="para__role">${esc(p.role)}</span>
            <p class="para__text">${annotate(p.text, p.notes)}</p>
            ${(p.notes || []).map((n, ni) => `<div class="anno__note" data-note="${ni}">${md(n.note)}</div>`).join("")}
            ${p.analysis ? `<div class="para__analysis"><b>段落点评 · </b>${md(p.analysis)}</div>` : ""}
          </section>`).join(""))}

      ${e.highlights && e.highlights.length ? fold("d.essay.highlights", "可迁移表达", e.highlights.length + " 条",
        `<div class="card card--pad">
          ${e.highlights.map(h => `<div class="hl">
            <div style="flex:1;min-width:0">
              <div class="hl__en">${esc(h.en)}</div>
              <div class="hl__zh">${esc(h.zh)}</div>
              <div class="hl__why">${esc(h.why)}</div>
            </div>
            <button class="btn btn--ghost btn--icon" data-copy="${esc(h.en)}" title="复制" aria-label="复制">${icon("i-copy", 15)}</button>
          </div>`).join("")}
        </div>`) : ""}

      ${e.takeaway ? fold("d.essay.takeaway", "一句话带走", null,
        `<div class="callout"><p style="font-size:var(--fs-md)">${md(e.takeaway)}</p></div>`) : ""}
    </article>`;
  }

  /* ---------- 收藏 ---------- */
  VIEWS.starred = function () {
    const keys = [...store.stars];
    if (!keys.length) return `<div class="view wrap">${empty("还没有收藏", "在任何条目右上角点星号，就会出现在这里。")}</div>`;

    const g = { words: [], roots: [], contrasts: [], phrases: [], essays: [] };
    keys.forEach(k => {
      const [t, id] = k.split(":");
      const src = { words, roots, contrasts, phrases, essays }[t];
      const item = src && src.find(x => x.id === id);
      if (item) g[t].push(item);
    });

    const section = (title, n, html) => n ? `<div class="block">${sechead(title, n + " 条")}${html}</div>` : "";

    return `<div class="view wrap">
      ${section("单词剖析", g.words.length, `<div class="${gridCls("words", "cardgrid cardgrid--root")}">${g.words.map(wordCard).join("")}</div>`)}
      ${section("词根词缀", g.roots.length, `<div class="${gridCls("roots", "cardgrid cardgrid--root")}">${g.roots.map(rootCard).join("")}</div>`)}
      ${section("关键辨析", g.contrasts.length, `<div class="${gridCls("contrasts", "cardgrid cardgrid--cmp")}">${g.contrasts.map(contrastCard).join("")}</div>`)}
      ${section("好词好句", g.phrases.length, `<div class="${gridCls("phrases", "pgrid")}">${g.phrases.map(phraseCard).join("")}</div>`)}
      ${section("范文解析", g.essays.length, `<div class="${gridCls("essays", "cardgrid cardgrid--cmp")}">${g.essays.map(essayCard).join("")}</div>`)}
    </div>`;
  };

  /* ============================================================
     全站搜索
     索引里放两类条目：
       card = true   一张卡片本身（单词/词根/辨析/句子/范文），带它的全部分类信息
       card = false  卡片内部的一个片段（一层义项、一个派生词、一条可迁移表达）
     卡片条目会排在片段之前，所以搜「前缀」先出 8 张前缀卡，而不是正文里碰巧提到的句子。
     ============================================================ */
  const SEC_LABEL = { words: "单词剖析", roots: "词根词缀", contrasts: "关键辨析", phrases: "好词好句", essays: "范文解析" };

  let INDEX = null;
  function buildIndex() {
    if (INDEX) return INDEX;
    INDEX = [];
    const push = e => INDEX.push(e);

    words.forEach(x => {
      push({ sec: "words", card: true, href: `#/words/${x.id}`, where: "单词剖析", title: x.w, sub: x.core,
        text: ["单词剖析", x.w, x.pos, x.core, x.image, x.origin, x.summary,
               (x.senses || []).map(v => [v.dim, v.tag, v.zh].join(" ")).join(" "),
               (x.parts || []).map(v => v[0] + " " + v[1]).join(" "),
               (x.contrasts || []).map(v => v.w).join(" ")].join(" ") });
      (x.senses || []).forEach(v => push({ sec: "words", card: false, href: `#/words/${x.id}`,
        where: "义项 · " + x.w, title: v.zh, sub: v.dim,
        text: [v.dim, v.tag, v.zh, v.scene, v.feature,
               (v.ex || []).map(e => e.en + " " + e.zh).join(" ")].join(" ") }));
    });

    roots.forEach(r => {
      const k = KIND_CN[r.kind];
      push({ sec: "roots", card: true, href: `#/roots/${r.id}`, where: "词根词缀 · " + k,
        title: r.form, sub: r.meaning + " · " + r.gloss,
        text: ["词根词缀 构词 词缀", k, r.form, r.meaning, r.gloss, r.origin,
               (r.senses || []).map(v => v.meaning + " " + (v.gloss || "")).join(" ")].join(" ") });
      (r.senses || []).forEach(v => {
        push({ sec: "roots", card: false, href: `#/roots/${r.id}`, where: r.form + " 的一层含义",
          title: v.meaning, sub: v.gloss || "",
          text: [v.meaning, v.gloss, v.note].join(" ") });
        (v.words || []).forEach(w => push({ sec: "roots", card: false, href: `#/roots/${r.id}`,
          where: r.form + " · " + v.meaning, title: w.w, sub: w.def,
          text: [w.w, w.def, w.ex].join(" ") }));
      });
    });

    contrasts.forEach(c => push({ sec: "contrasts", card: true, href: `#/contrasts/${c.id}`,
      where: "关键辨析 · " + c.tag, title: c.title, sub: c.oneLiner,
      text: ["关键辨析 辨析", c.tag, c.level, c.title, c.oneLiner,
             c.items.map(i => [i.w, i.pos, i.core, i.nuance, i.ex].join(" ")).join(" "),
             (c.pitfalls || []).join(" ")].join(" ") }));

    phrases.forEach(p => push({ sec: "phrases", card: true, href: "#/phrases",
      where: p.cat + " · " + p.type, title: p.en, sub: p.zh,
      text: ["好词好句 句库", p.cat, p.type, p.en, p.zh, p.note, (p.tags || []).join(" ")].join(" ") }));

    essays.forEach(e => {
      push({ sec: "essays", card: true, href: `#/essays/${e.id}`,
        where: [e.exam, e.year ? e.year + " 年" : null, e.part].filter(Boolean).join(" · ") || "范文解析",
        title: e.title, sub: e.prompt,
        text: ["范文解析 范文 作文", e.exam, e.year, e.part, e.topic, e.genre, e.level,
               e.title, e.prompt, e.takeaway].join(" ") });
      (e.highlights || []).forEach(h => push({ sec: "essays", card: false, href: `#/essays/${e.id}`,
        where: "范文表达 · " + e.title, title: h.en, sub: h.zh,
        text: [h.en, h.zh, h.why].join(" ") }));
    });

    return INDEX;
  }

  let searchSec = "all";

  VIEWS.search = function (r) {
    const q = (r.q || "").trim();
    if (!q) return `<div class="view wrap">${empty("输入关键词开始搜索", "单词、词根、中文释义、句式、批注都能搜；也可以直接搜「前缀」「后缀」「金句」「考研英语一」这类分类。")}</div>`;
    const lq = q.toLowerCase();

    const scored = buildIndex().map(x => {
      const t = x.text.toLowerCase(), i = t.indexOf(lq);
      if (i < 0) return null;
      const ti = x.title.toLowerCase().indexOf(lq);
      const tier = ti === 0 ? 0 : ti > 0 ? 1 : 2;     // 标题命中优先
      return { x, score: tier * 100000 + (x.card ? 0 : 40000) + i };   // 同档内卡片优先
    }).filter(Boolean).sort((a, b) => a.score - b.score).map(h => h.x);

    if (!scored.length) return `<div class="view wrap">${empty(`没有找到「${q}」`, "换个关键词，或去对应板块翻一翻。")}</div>`;

    const counts = {};
    scored.forEach(h => { counts[h.sec] = (counts[h.sec] || 0) + 1; });
    if (searchSec !== "all" && !counts[searchSec]) searchSec = "all";
    const hits = (searchSec === "all" ? scored : scored.filter(h => h.sec === searchSec)).slice(0, 80);

    const chips = [`<button class="chip${searchSec === "all" ? " is-on" : ""}" data-searchsec="all">全部 ${scored.length}</button>`]
      .concat(Object.keys(SEC_LABEL).filter(k => counts[k])
        .map(k => `<button class="chip${searchSec === k ? " is-on" : ""}" data-searchsec="${k}">${esc(SEC_LABEL[k])} ${counts[k]}</button>`))
      .join("");

    const hi = t => esc(t).replace(new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<em>$1</em>");
    const shown = searchSec === "all" ? scored.length : counts[searchSec];
    return `<div class="view wrap">
      ${sechead(`「${q}」的结果`, hits.length < shown ? `${shown} 条 · 显示前 ${hits.length} 条` : `${shown} 条`)}
      <div class="chips" style="margin-bottom:var(--s4)">${chips}</div>
      ${hits.map(h => `<a class="hit${h.card ? " hit--card" : ""}" href="${h.href}">
        <div class="hit__where">${h.card ? `<span class="hit__badge">卡片</span>` : ""}${esc(h.where)}</div>
        <div class="hit__title">${hi(h.title)}</div>
        <div class="hit__sub">${hi(h.sub || "")}</div>
      </a>`).join("")}
    </div>`;
  };

  /* ============================================================
     事件
     ============================================================ */
  document.addEventListener("click", e => {
    const t = e.target;

    // 收藏（卡片上的星号不应触发跳转）
    const st = t.closest("[data-star]");
    if (st) {
      e.preventDefault(); e.stopPropagation();
      const on = store.toggleStar(st.dataset.star);
      st.classList.toggle("is-on", on);
      st.setAttribute("aria-pressed", on);
      renderNav();
      if (route.section === "starred") onRoute();
      return;
    }

    const cp = t.closest("[data-copy]");
    if (cp) { e.preventDefault(); copy(cp.dataset.copy, cp); return; }

    // 面板里的筛选与排序：改完保持面板打开，方便连续调整
    const rf = t.closest("[data-rootfilter]");
    if (rf) { rootFilter = rf.dataset.rootfilter; ctrlOpen = true; onRoute(); return; }

    const pt = t.closest("[data-phrasetype]");
    if (pt) { phraseType = pt.dataset.phrasetype; ctrlOpen = true; onRoute(); return; }

    const ee = t.closest("[data-essayexam]");
    if (ee) { essayExam = ee.dataset.essayexam; ctrlOpen = true; onRoute(); return; }

    const ss = t.closest("[data-searchsec]");
    if (ss) { searchSec = ss.dataset.searchsec; onRoute(); return; }

    const so = t.closest("[data-sort]");
    if (so) {
      const [kind, id] = so.dataset.sort.split(":");
      store.sorts[kind] = id; store.saveSorts();
      ctrlOpen = true; onRoute();
      return;
    }

    const cs = t.closest("[data-cardstyle]");
    if (cs) {
      const [kind, id] = cs.dataset.cardstyle.split(":");
      store.cards[kind] = id; store.saveCards();
      ctrlOpen = true; onRoute();
      return;
    }

    // 全部折叠 / 全部展开
    if (t.closest("[data-foldall]")) { toggleFoldAll(); return; }

    // 点面板外面关掉它
    if (ctrlOpen && !t.closest("[data-ctrl]")) {
      ctrlOpen = false;
      const c = $("[data-ctrl]");
      if (c) c.open = false;
    }

    const dr = t.closest("[data-drill]");
    if (dr) {
      const box = dr.nextElementSibling;
      box.hidden = !box.hidden;
      dr.textContent = box.hidden ? "显示答案" : "收起";
      return;
    }

    const an = t.closest("[data-anno]");
    if (an) { toggleAnno(an); return; }

    const ph = t.closest("[data-phrase]");
    if (ph) { revealPhrase(ph); return; }
  });

  document.addEventListener("keydown", e => {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList) {
      if (e.target.classList.contains("anno")) { e.preventDefault(); toggleAnno(e.target); return; }
      if (e.target.hasAttribute && e.target.hasAttribute("data-phrase")) { e.preventDefault(); revealPhrase(e.target); return; }
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault(); $("#searchInput").focus(); $("#searchInput").select(); return;
    }
    if (e.key === "Escape") {
      if (document.activeElement === $("#searchInput")) $("#searchInput").blur();
      const c = $("[data-ctrl]");
      if (c && c.open) { c.open = false; ctrlOpen = false; }
    }
  });

  /* 折叠状态：details 的 toggle 事件不冒泡，用捕获阶段监听 */
  document.addEventListener("toggle", e => {
    const d = e.target;
    if (!d.classList) return;
    if (d.classList.contains("fold") && d.dataset.fold) {
      store.setFold(d.dataset.fold, d.open);
      syncFoldAllBtn();
    } else if (d.classList.contains("ctrl")) {
      ctrlOpen = d.open;                      // 视图面板只记在内存里，不持久化
    }
  }, true);

  const foldsInView = () => [...document.querySelectorAll("#view .fold[data-fold]")];

  function toggleFoldAll() {
    const list = foldsInView();
    if (!list.length) return;
    const anyOpen = list.some(d => d.open);
    list.forEach(d => { d.open = !anyOpen; store.setFold(d.dataset.fold, !anyOpen); });
    syncFoldAllBtn();
  }

  /* 按钮文案跟随当前状态 */
  function syncFoldAllBtn() {
    const btn = $("#foldAll");
    if (!btn) return;
    const list = foldsInView();
    btn.hidden = list.length === 0;
    const anyOpen = list.some(d => d.open);
    btn.querySelector(".foldall__ico").innerHTML = icon(anyOpen ? "i-collapse" : "i-expand", 15);
    btn.querySelector(".foldall__txt").textContent = anyOpen ? "全部折叠" : "全部展开";
  }

  function revealPhrase(el) {
    const open = el.classList.toggle("is-open");
    el.setAttribute("aria-expanded", open);
  }

  function toggleAnno(el) {
    const para = el.closest(".para");
    const note = para.querySelector(`.anno__note[data-note="${el.dataset.anno}"]`);
    const open = note.classList.contains("is-open");
    para.querySelectorAll(".anno__note.is-open").forEach(n => n.classList.remove("is-open"));
    para.querySelectorAll(".anno.is-open").forEach(n => n.classList.remove("is-open"));
    if (!open) { note.classList.add("is-open"); el.classList.add("is-open"); }
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

  /* 主题 */
  const THEMES = ["auto", "light", "dark"];
  function applyTheme() {
    document.documentElement.dataset.theme = store.theme;
    const dark = store.theme === "dark" ||
      (store.theme === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
    $("#themeBtn").innerHTML = icon(dark ? "i-moon" : "i-sun", 18);
    $("#themeBtn").title = "主题：" + { auto: "跟随系统", light: "浅色", dark: "深色" }[store.theme];
  }
  $("#themeBtn").addEventListener("click", () => {
    store.theme = THEMES[(THEMES.indexOf(store.theme) + 1) % 3];
    store.saveTheme(); applyTheme();
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);

  /* 随机复习 */
  $("#shuffleBtn").addEventListener("click", () => {
    const pool = [
      ...words.map(w => `#/words/${w.id}`),
      ...roots.map(r => `#/roots/${r.id}`),
      ...contrasts.map(c => `#/contrasts/${c.id}`),
      ...essays.map(e => `#/essays/${e.id}`)
    ];
    if (pool.length) go(pool[Math.floor(Math.random() * pool.length)]);
  });

  /* ---------- 启动 ---------- */
  store.load();
  applyTheme();
  window.addEventListener("hashchange", () => { ctrlOpen = false; onRoute(); });
  if (!location.hash) location.replace("#/home");
  onRoute();
})();
