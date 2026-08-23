/* ============================================================
   English Lab — 应用逻辑
   路由 · 视图渲染 · 全站搜索 · 收藏 · 主题
   零依赖，零构建。直接打开 index.html 即可运行。
   ============================================================ */
(function () {
  "use strict";

  const DB = window.DB || {};
  const words = DB.words || [], roots = DB.roots || [], essays = DB.essays || [];

  /* ---------- 板块配置 ----------
     原来的「关键辨析」已按词拆进 words，「好词好句」已移除，
     所以单词分析就是 words 本身，一个板块一份数据。 */
  const SECTIONS = [
    { id: "home",    label: "概览", en: "OVERVIEW",        icon: "i-home",  count: () => null },
    { id: "words",   label: "单词", full: "单词分析", en: "WORD ANALYSIS", icon: "i-word", group: "学习板块",
      count: () => words.length },
    { id: "roots",   label: "词根", full: "词根词缀",   en: "WORD ROOTS",   icon: "i-roots", count: () => roots.length },
    { id: "essays",  label: "范文", full: "范文解析",   en: "MODEL ESSAYS", icon: "i-essay", count: () => essays.length },
    { id: "starred",  label: "收藏", full: "我的收藏", en: "STARRED",     icon: "i-star", group: "个人",
      count: () => store.stars.size || null },
    { id: "settings", label: "设置", full: "偏好设置", en: "SETTINGS", icon: "i-settings", count: () => null }
  ];
  /* 合并前的旧地址，遇到就折回单词分析 */
  const LEGACY = new Set(["analysis", "contrasts", "phrases"]);

  const sec = id => SECTIONS.find(s => s.id === id) || SECTIONS[0];
  const secName = s => s.full || s.label;

  /* ============================================================
     偏好 —— 一处声明，四处派生：存储、界面、校验、重置

     只放「很少改、且在页面里没有自然归宿」的选项。排序、卡片样式这类
     经常调的，留在各列表页的「视图」面板里，不搬到这儿来
     （Apple HIG: 主界面放常改的，设置里只放极少改的）。

     每条声明包含：id / 分组 / 标题 / 说明 / 类型 / 默认值 / 可选项。
     加一条设置＝往这个数组里加一个对象，存储、界面、校验、重置全部自动跟上。
     ============================================================ */
  const PREF_KEY = "el.prefs";
  const PREF_VERSION = 1;

  /* 题型选项直接从 essays 里数出来，常见的排前面。
     数据里加一种新题型，设置页就自动多一个开关，不用改代码。 */
  const ESSAY_PARTS = (() => {
    const n = {};
    essays.forEach(e => { if (e.part) n[e.part] = (n[e.part] || 0) + 1; });
    return Object.keys(n).sort((a, b) => n[b] - n[a] || a.localeCompare(b, "zh"));
  })();
  const ROOT_KINDS = [["prefix", "前缀"], ["root", "词根"], ["suffix", "后缀"]];

  const PREFS = [
    { id: "theme", group: "外观", label: "主题",
      hint: "跟随系统会随 macOS / Windows 的深浅色自动切换",
      type: "enum", def: "auto",
      options: [["auto", "跟随系统"], ["light", "浅色"], ["dark", "深色"]] },

    { id: "review.order", group: "复习", label: "下一条",
      hint: "顺序＝按库里的排列一条条往下走；随机＝每次随机抽一条",
      type: "enum", def: "random",
      options: [["random", "随机"], ["seq", "顺序"]] },

    { id: "review.avoidRepeat", group: "复习", label: "不连抽同一条",
      hint: "抽到的如果正是当前这条，就重抽一次",
      type: "enum", def: "on",
      options: [["on", "开"], ["off", "关"]],
      when: () => prefs.is("review.order", "random"),
      whenHint: "顺序模式本来就不会连着给同一条，这一条只在随机时有用" },

    { id: "review.scope", group: "复习", label: "复习范围",
      hint: "左下角「随机复习一条」从哪些板块里抽。至少保留一项",
      type: "set", def: ["words", "roots", "essays"],
      options: [["words", "单词分析"], ["roots", "词根词缀"], ["essays", "范文解析"]] },

    /* 子范围：选项从数据里长出来，加了新题型就自动多一个开关。
       when 为假时这条设置不生效，界面上会变淡且点不动。 */
    { id: "review.essayParts", group: "复习", label: "范文题型",
      hint: "只背小作文或只背大作文，在这里勾",
      type: "set", def: ESSAY_PARTS.slice(),
      options: ESSAY_PARTS.map(v => [v, v]),
      when: () => prefs.has("review.scope", "essays"),
      whenHint: "「复习范围」里没有勾选范文解析，这一条暂时不生效" },

    { id: "review.rootKinds", group: "复习", label: "词缀类型",
      hint: "只背前缀、只背后缀，在这里勾",
      type: "set", def: ROOT_KINDS.map(k => k[0]),
      options: ROOT_KINDS,
      when: () => prefs.has("review.scope", "roots"),
      whenHint: "「复习范围」里没有勾选词根词缀，这一条暂时不生效" }
  ];

  const prefDef = id => PREFS.find(p => p.id === id);
  const optionIds = d => d.options.map(o => o[0]);

  const prefs = {
    values: {},

    /* 存进来的东西不可信：可能是旧版本写的，可能被手动改过，
       也可能是另一个标签页写的。一律按注册表校验，坏值退回默认。 */
    clean(d, v) {
      if (d.type === "enum") return optionIds(d).indexOf(v) >= 0 ? v : d.def;
      if (d.type === "set") {
        if (!Array.isArray(v)) return d.def.slice();
        const ok = optionIds(d);
        const out = v.filter(x => ok.indexOf(x) >= 0);
        return out.length ? out : d.def.slice();      // 空集合会让复习池取不到东西
      }
      return d.def;
    },

    load() {
      let raw = null;
      try { raw = JSON.parse(localStorage.getItem(PREF_KEY) || "null"); } catch (e) {}
      const stored = (raw && raw.v === PREF_VERSION && raw.values) ? raw.values : migrate(raw);
      PREFS.forEach(d => { this.values[d.id] = this.clean(d, stored[d.id]); });
      /* 迁移过来的值、以及被校验修掉的坏值，都要写回去。
         否则迁移只在内存里成立，下次打开又丢了。 */
      let same = false;
      try { same = JSON.stringify(stored) === JSON.stringify(this.values); } catch (e) {}
      if (!same) this.save();
    },

    get(id) {
      const v = this.values[id];
      return Array.isArray(v) ? v.slice() : v;
    },
    is(id, v) { return this.get(id) === v; },
    has(id, v) { return (this.values[id] || []).indexOf(v) >= 0; },

    set(id, v) {
      const d = prefDef(id);
      if (!d) return false;
      this.values[id] = this.clean(d, v);
      this.save();
      return true;
    },

    /* 集合型的开关。最后一项不许关掉，否则功能直接失效 */
    toggle(id, v) {
      const d = prefDef(id);
      if (!d || d.type !== "set") return "noop";
      const cur = this.values[id] || [];
      const i = cur.indexOf(v);
      if (i < 0) { this.values[id] = cur.concat([v]); this.save(); return "on"; }
      if (cur.length === 1) return "last";
      this.values[id] = cur.filter(x => x !== v);
      this.save();
      return "off";
    },

    reset() {
      PREFS.forEach(d => { this.values[d.id] = Array.isArray(d.def) ? d.def.slice() : d.def; });
      this.save();
    },

    save() {
      try {
        localStorage.setItem(PREF_KEY, JSON.stringify({ v: PREF_VERSION, values: this.values }));
      } catch (e) { /* 隐私模式下静默降级 */ }
    }
  };

  /* 老版本把主题单独存在 el.theme 里，读一次搬过来再删掉。
     以后改结构就在这里加一段，旧数据永远能升上来。 */
  function migrate(raw) {
    const out = (raw && raw.values) ? raw.values : {};
    try {
      const legacy = localStorage.getItem("el.theme");
      if (legacy && out.theme === undefined) out.theme = legacy;
      localStorage.removeItem("el.theme");
    } catch (e) {}
    return out;
  }

  /* ============================================================
     单词标签

     两类，区别在「词表由谁定」，不在「值由谁填」：
       系统标签  选项列表写死在下面这个注册表里（考纲、掌握度）
       自建标签  词表由你自己攒，用过的词会进入候选，下次直接选

     两种约束：
       exclusive  互斥，同时只能有一个（掌握度：掌握/熟悉/模糊/不认识）
       非 exclusive  可叠加（一个词可以既考雅思又考托福，也可以挂好几个自建标签）

     考纲那一组特意不放「考研」：这个库整体就是考研范围，
     每个词都标一遍等于没标。只标它在别的考试里也考，信息量才在。
     ============================================================ */
  const TAG_KEY = "el.tags";
  const TAG_VERSION = 1;
  const TAG_MAX_LEN = 12;      // 自建标签的字数上限
  const TAG_MAX_PER = 8;       // 一个词最多挂几个自建标签

  const TAG_SETS = [
    { id: "mastery", label: "掌握度", exclusive: true,
      hint: "复习时随手改，只能选一个",
      options: [["known", "掌握"], ["familiar", "熟悉"], ["vague", "模糊"], ["unknown", "不认识"]] },

    { id: "exam", label: "考纲", exclusive: false,
      hint: "考研是本库的基线，标不标都行；重点是标出它在别的考试里也考",
      options: [["kaoyan", "考研"], ["ielts", "雅思"], ["toefl", "托福"],
                ["cet", "四六级"], ["gre", "GRE"], ["pte", "PTE"]] },

    { id: "custom", label: "自建", exclusive: false, free: true,
      hint: "自己定的标签，可以重复用在多个词上" }
  ];

  const tagSet = id => TAG_SETS.find(t => t.id === id);
  const tagLabel = (setId, v) => {
    const d = tagSet(setId);
    if (!d || d.free) return v;
    const o = d.options.find(x => x[0] === v);
    return o ? o[1] : v;
  };

  const tags = {
    items: {},                                  // 单词 id -> { mastery, exam[], custom[] }

    /* 存进来的一律不认：词可能被删了，选项可能改过，字符串可能是手改的 */
    cleanText(t) {
      return String(t == null ? "" : t).replace(/\s+/g, " ").trim().slice(0, TAG_MAX_LEN);
    },
    cleanEntry(raw) {
      if (!raw || typeof raw !== "object") return null;
      const out = {};
      TAG_SETS.forEach(d => {
        const v = raw[d.id];
        if (d.free) {
          if (!Array.isArray(v)) return;
          const seen = [];
          v.forEach(t => {
            const c = this.cleanText(t);
            if (c && seen.indexOf(c) < 0 && seen.length < TAG_MAX_PER) seen.push(c);
          });
          if (seen.length) out[d.id] = seen;
        } else if (d.exclusive) {
          if (d.options.some(o => o[0] === v)) out[d.id] = v;
        } else {
          if (!Array.isArray(v)) return;
          const ok = v.filter(x => d.options.some(o => o[0] === x));
          if (ok.length) out[d.id] = [...new Set(ok)];
        }
      });
      return Object.keys(out).length ? out : null;
    },

    load() {
      let raw = null;
      try { raw = JSON.parse(localStorage.getItem(TAG_KEY) || "null"); } catch (e) {}
      const src = (raw && raw.v === TAG_VERSION && raw.items) ? raw.items : {};
      const live = new Set(words.map(w => w.id));
      const out = {};
      Object.keys(src).forEach(id => {
        if (!live.has(id)) return;               // 词已经删了，标签跟着丢
        const e = this.cleanEntry(src[id]);
        if (e) out[id] = e;
      });
      this.items = out;
      let same = false;
      try { same = JSON.stringify(src) === JSON.stringify(out); } catch (e) {}
      if (!same) this.save();                    // 清理结果写回去，否则每次都要再洗一遍
    },

    save() {
      try {
        localStorage.setItem(TAG_KEY, JSON.stringify({ v: TAG_VERSION, items: this.items }));
      } catch (e) {}
    },

    of(id) { return this.items[id] || {}; },
    val(id, setId) {
      const d = tagSet(setId), raw = this.of(id)[setId];
      if (d && d.exclusive) return raw || "";
      return Array.isArray(raw) ? raw.slice() : [];
    },
    has(id, setId, v) {
      const d = tagSet(setId);
      return d && d.exclusive ? this.val(id, setId) === v : this.val(id, setId).indexOf(v) >= 0;
    },

    write(id, setId, v) {
      const e = Object.assign({}, this.items[id]);
      if (v === null || (Array.isArray(v) && !v.length) || v === "") delete e[setId];
      else e[setId] = v;
      if (Object.keys(e).length) this.items[id] = e; else delete this.items[id];
      this.save();
    },

    /* 互斥组：再点一次当前值＝取消，等于「未标记」 */
    toggle(id, setId, v) {
      const d = tagSet(setId);
      if (!d) return;
      if (d.exclusive) { this.write(id, setId, this.val(id, setId) === v ? null : v); return; }
      const cur = this.val(id, setId);
      const i = cur.indexOf(v);
      this.write(id, setId, i < 0 ? cur.concat([v]) : cur.filter(x => x !== v));
    },

    addCustom(id, text) {
      const t = this.cleanText(text);
      if (!t) return "empty";
      const cur = this.val(id, "custom");
      if (cur.indexOf(t) >= 0) return "dup";
      if (cur.length >= TAG_MAX_PER) return "full";
      this.write(id, "custom", cur.concat([t]));
      return "ok";
    },

    /* 用过的自建标签汇成一份词表，按用得多的排前面 */
    vocabulary() {
      const n = {};
      Object.keys(this.items).forEach(id =>
        (this.items[id].custom || []).forEach(t => { n[t] = (n[t] || 0) + 1; }));
      return Object.keys(n).sort((a, b) => n[b] - n[a] || a.localeCompare(b, "zh"));
    },

    /* 某个值挂在多少个词上，列表页的筛选要用 */
    count(setId, v) {
      return words.reduce((k, w) => k + (this.has(w.id, setId, v) ? 1 : 0), 0);
    },
    untagged(setId) {
      return words.reduce((k, w) => {
        const val = this.val(w.id, setId);
        return k + ((tagSet(setId).exclusive ? !val : !val.length) ? 1 : 0);
      }, 0);
    }
  };

  /* ============================================================
     访问记录 —— 首页「最近看过」用

     和访问栈（trail）是两回事：栈是为了原路退回，会随返回弹出，只活在
     这一次会话里；这里是一份持久的浏览历史，按时间倒序、同一条只留最近一次。
     只记详情页，列表页和搜索不算「看过某个内容」。
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
      const seen = new Set();
      const out = [];
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
        .concat(this.items.filter(x => x.k !== k))
        .slice(0, RECENT_MAX);
      this.save();
    },

    clear() { this.items = []; this.save(); },

    /* 解析成可以直接渲染的行；条目在这期间被删掉就跳过 */
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

  /* ---------- 本地存储 ---------- */
  const store = {
    stars: new Set(),
    sorts: { words: "alpha", roots: "alpha", essays: "year" },
    cards: { words: "min", roots: "min", essays: "std" },   // min | std | full
    folds: {},                                       // 折叠状态：key -> false 表示已折叠，缺省为展开
    /* localStorage 里的数据活得比代码久：板块删掉了，它写的键还在。
       所以读进来的每一项都要对着当前的合法值过一遍，认不出来的直接丢。 */
    load() {
      const kinds = Object.keys(SORTS);
      const pick = (raw, target, valid) => {
        Object.keys(raw || {}).forEach(k => {
          if (kinds.indexOf(k) >= 0 && valid(k, raw[k])) target[k] = raw[k];
        });
      };
      try {
        const stars = JSON.parse(localStorage.getItem("el.stars") || "[]");
        const before = stars.length;
        this.stars = new Set(stars.filter(k => kinds.indexOf(String(k).split(":")[0]) >= 0));
        if (this.stars.size !== before) this.saveStars();   // 顺手把已删板块的孤儿收藏清掉

        pick(JSON.parse(localStorage.getItem("el.sorts") || "{}"), this.sorts,
             (k, v) => SORTS[k].some(m => m.id === v));
        pick(JSON.parse(localStorage.getItem("el.cards") || "{}"), this.cards,
             (k, v) => CARD_STYLES.some(c => c[0] === v));

        const folds = JSON.parse(localStorage.getItem("el.folds") || "{}");
        if (folds && typeof folds === "object") this.folds = folds;
      } catch (e) { /* 隐私模式下静默降级 */ }
    },
    clearFolds() { this.folds = {}; this.saveFolds(); },
    save(k, v) { try { localStorage.setItem("el." + k, JSON.stringify(v)); } catch (e) {} },
    saveStars() { this.save("stars", [...this.stars]); },
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

  const KIND_CN = { root: "词根", prefix: "前缀", suffix: "后缀" };

  /* ---------- 构词成分 → 词根条目 ----------
     词根的 form 写成 "com- / con- / co-" 这种一形多写，任一写法都要能查到。
     先把所有写法摊平成一张表，剥掉前后连字符，这样 "-ible" 能查到 "-able / -ible"。 */
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

  /* 构词成分：三档强弱，不用三种色相。
     成分本身就是跳转入口 —— 有对应词根条目的直接点进去，没有的点了给提示，
     所以详情页不再另起一行「相关词根」把链接重复列一遍。 */
  function morph(parts, opt) {
    opt = opt || {};
    return `<span class="morph">${(parts || []).map((p, i) => {
      const [form, gloss, kind] = p;
      const r = rootFor(form);
      const inner = `<b>${esc(form)}</b><i>${esc(gloss)}</i>`;
      const k = `data-k="${esc(kind)}"`;
      let el;
      if (r && r.id === opt.current) {
        /* 正站在这个词根的页面上，就别再链回自己 */
        el = `<span class="morph__part morph__part--here" ${k} title="当前条目">${inner}</span>`;
      } else if (r) {
        el = `<a class="morph__part morph__part--to" ${k} href="#/roots/${esc(r.id)}"
          title="${esc(KIND_CN[r.kind])}　${esc(r.form)} · ${esc(r.meaning)}">${inner}</a>`;
      } else {
        el = `<button type="button" class="morph__part morph__part--none" ${k}
          data-noroot="${esc(form)}" title="还没有「${esc(form)}」的词根条目">${inner}</button>`;
      }
      return `${i ? '<span class="morph__plus">+</span>' : ""}${el}`;
    }).join("")}</span>`;
  }

  const MORPH_LEGEND = `<div class="legend">
    <span><i data-k="prefix"></i>前缀</span><span><i data-k="root"></i>词根</span><span><i data-k="suffix"></i>后缀</span>
    <span class="legend__hint">点成分跳到词根页，虚线的表示条目还没建</span>
  </div>`;

  /* ---------- 路由 ---------- */
  let route = { section: "home", id: null, q: "" };

  function parseHash() {
    const raw = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    const [head, ...rest] = raw.split("/");
    if (head === "search") return { section: "search", id: null, q: rest.join("/") };
    const known = SECTIONS.some(x => x.id === head) || LEGACY.has(head);
    return { section: known ? head : "home", id: rest.join("/") || null, q: "" };
  }

  const go = hash => { location.hash = hash; };

  function onRoute() {
    const prev = route;
    route = parseHash();

    /* 旧地址（#/analysis、#/contrasts、#/phrases）一律折回单词分析 */
    if (LEGACY.has(route.section)) { location.replace("#/words"); return; }

    updateTrail(prev);
    if (route.id) recent.record(route.section, route.id);
    const s = sec(route.section);
    $("#pageTitle").innerHTML = route.section === "search"
      ? `搜索结果<small>SEARCH</small>`
      : `${esc(secName(s))}<small>${esc(s.en)}</small>`;

    renderNav();
    if (navOpen()) setNav(false);
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
    /* 名称始终写进 DOM：桌面导轨用 CSS 藏起来只留图标（靠 title 提示），
       手机抽屉里展开显示——那里没有 hover，光给图标是猜谜。 */
    $("#nav").innerHTML = SECTIONS.map(s => {
      const n = s.count();
      const name = secName(s);
      return `${s.group ? '<li class="nav-sep" aria-hidden="true"></li>' : ""}
      <li><a class="navitem${s.id === active ? " is-active" : ""}" href="#/${s.id}"
        title="${esc(name)}" aria-label="${esc(name + (n != null ? "，" + n + " 条" : ""))}">
        <span class="navitem__ico">${icon(s.icon, 20)}</span>
        <span class="navitem__label">${esc(name)}</span>
        ${n != null ? `<span class="navitem__count">${n}</span>` : ""}
      </a></li>`;
    }).join("");
  }

  /* ---------- 手机端抽屉 ----------
     手机上没有常驻侧栏，导航收进左侧抽屉。用的还是同一个 .rail 元素，
     只是换一种呈现方式，避免维护两套导航 DOM。 */
  const navOpen = () => document.body.classList.contains("nav-open");
  function setNav(open) {
    document.body.classList.toggle("nav-open", open);
    $("#scrim").hidden = !open;
    $("#menuBtn").setAttribute("aria-expanded", open ? "true" : "false");
    $("#menuBtn").setAttribute("aria-label", open ? "关闭导航" : "打开导航");
    if (open) { const f = $("#rail").querySelector(".navitem"); if (f) f.focus(); }
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
    words: "一个词的图景、义项与边界",
    roots: "拆开构词，理解而非硬背",
    essays: "逐句批注，看清好在哪里"
  };

  VIEWS.home = function () {
    const totalWords = roots.reduce((n, r) => n + rootWords(r).length, 0);
    const tiles = ["words", "roots", "essays"].map(sec).map(s => `
      <a class="tile" href="#/${s.id}">
        <div class="tile__n">${s.count()}</div>
        <div class="tile__t">${esc(secName(s))}</div>
        <div class="tile__d">${esc(TILE_DESC[s.id])}</div>
      </a>`).join("");

    const pick = (arr, seed) => arr.length ? arr[seed % arr.length] : null;
    const seed = Math.floor(Date.now() / 864e5);           // 每天换一组
    const r = pick(roots, seed), w = pick(words, seed + 1), e = pick(essays, seed + 2);

    return `<div class="view wrap">
      <section class="hero">
        <h1>今天想理解点什么？</h1>
        <p>这里存放的不是待背清单，而是已经被拆开、讲透的语言知识。
           共 ${words.length} 个单词分析、${roots.length} 组词根词缀（带出 ${totalWords} 个派生词）、${essays.length} 篇范文解析。</p>
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
          ${w ? `<a class="daily__card" href="#/words/${esc(w.id)}">
            <div class="daily__kind">单词${w.pos ? " · " + esc(w.pos) : ""}</div>
            <div class="en" style="font-size:var(--fs-md);font-weight:700;margin:2px 0 4px">${esc(w.w)}</div>
            <div style="color:var(--ink-2);font-size:var(--fs-sm)">${esc(w.core)}</div>
          </a>` : ""}
          ${e ? `<a class="daily__card" href="#/essays/${esc(e.id)}">
            <div class="daily__kind">范文 · ${esc(e.genre)}</div>
            <div style="font-weight:650;font-size:var(--fs-md);margin:2px 0 4px">${esc(e.title)}</div>
            <div style="color:var(--ink-2);font-size:var(--fs-sm)">${esc(e.prompt)}</div>
          </a>` : ""}
        </div>
      </div>

      <div class="block">
        ${sechead("最近看过", recent.items.length ? recent.items.length + " 条记录" : null)}
        <div id="recentBox">${recentBox()}</div>
      </div>
    </div>`;
  };

  /* ---------- 首页的「最近看过」 ----------
     时间倒序，再按今天 / 昨天 / 最近 7 天 / 更早分档 —— 一长条列表看不出
     时间感，分了档「按时间排」这件事才在页面上成立。 */
  let recentKind = "all";

  function recentBox() {
    if (!recent.items.length) {
      return `<p class="recent__empty">还没有浏览记录。随便点开一个词条，这里就会按时间记下你看过什么。</p>
        ${sechead("最近加入")}${addedList()}`;
    }

    const opts = [["all", "全部"]].concat(
      Object.keys(RECENT_KIND).map(k => [k, RECENT_KIND[k].label]));
    const chips = opts.map(([v, l]) => {
      const n = recent.countOf(v);
      return `<button class="chip${recentKind === v ? " is-on" : ""}" data-recentkind="${esc(v)}"
        ${n ? "" : "disabled"}>${esc(l)} ${n}</button>`;
    }).join("");

    const rows = recent.rows(recentKind);
    if (!rows.length) {
      return `<div class="chips" style="margin-bottom:var(--s3)">${chips}</div>
        <p class="recent__empty">这一类还没有浏览记录。</p>`;
    }

    /* 按档聚合，档内已经是时间倒序 */
    const groups = [];
    rows.forEach(r => {
      const b = timeBucket(r.t);
      let g = groups.find(x => x.name === b);
      if (!g) groups.push(g = { name: b, rows: [] });
      g.rows.push(r);
    });

    const body = groups.map(g => `<div class="timegroup">
      <div class="timegroup__label">${esc(g.name)}<span>${g.rows.length}</span></div>
      ${g.rows.map(r => `<a class="minirow" href="${r.href}">
        <span class="tag tag--line">${esc(r.tag)}</span>
        <span class="minirow__t"${r.en ? "" : ' style="font-family:var(--font-ui)"'}>${esc(r.title)}</span>
        <span class="minirow__d">${esc(r.desc)}</span>
        <time class="minirow__time" datetime="${new Date(r.t).toISOString()}">${esc(agoText(r.t))}</time>
      </a>`).join("")}
    </div>`).join("");

    return `<div class="chips" style="margin-bottom:var(--s3)">${chips}</div>${body}`;
  }

  /* 换分类只重画这一块，首页其余部分不动 */
  function syncRecentBox() {
    const el = $("#recentBox");
    if (el) el.innerHTML = recentBox();
  }

  function addedList() {
    const items = [
      ...roots.slice(-3).map(r => ({ href: `#/roots/${r.id}`, k: KIND_CN[r.kind], t: r.form, d: r.meaning })),
      ...words.slice(-3).map(w => ({ href: `#/words/${w.id}`, k: "单词", t: w.w, d: w.core })),
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
      { id: "mastery", label: "掌握度",
        group: x => { const m = tags.val(x.id, "mastery"); return m ? tagLabel("mastery", m) : "未标记"; },
        order: ["不认识", "模糊", "熟悉", "掌握", "未标记"],
        cmp: (a, b) => byName(a.w, b.w) },
      { id: "exam", label: "考纲",
        /* 没标不等于「只考考研」，只等于「还没标」，别替用户下断言 */
        group: x => { const e = tags.val(x.id, "exam");
          return e.length ? e.map(v => tagLabel("exam", v)).join(" · ") : "未标考纲"; },
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

  /* 列表页顶部：一个「视图」按钮装下筛选 + 排序 + 卡片样式，外加全部折叠
     filters 可以给多组，比如单词分析里「只看哪一类」和「句子的形式」各是一组 */
  function listBar(kind, filters) {
    const curSort = store.sorts[kind], curCard = cardStyle(kind);
    const list = filters ? [].concat(filters) : [];
    const groups = list.map(f => ({ label: f.label, chips: f.chips }));
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
    const state = list.map(f => f.current);
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
      const r = rootFor(p[0]);
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

  let wordMastery = "all";

  VIEWS.words = function (r) {
    if (r.id) {
      const x = words.find(v => v.id === r.id);
      return x ? `<div class="view wrap--read">${detailBar("#/words", "单词分析")}${wordDetail(x)}</div>`
        : notFound("#/words", "单词分析");
    }

    const md = tagSet("mastery");
    const opts = [["all", "全部", words.length]]
      .concat(md.options.map(([v, l]) => [v, l, tags.count("mastery", v)]))
      .concat([["none", "未标记", tags.untagged("mastery")]]);
    const cur = opts.find(o => o[0] === wordMastery) || opts[0];
    const filter = {
      label: "只看掌握度",
      current: cur[1],
      chips: opts.map(([v, l, n]) =>
        `<button class="chip${wordMastery === v ? " is-on" : ""}" data-wordmastery="${esc(v)}">${esc(l)} ${n}</button>`).join("")
    };

    const list = words.filter(x => {
      if (wordMastery === "all") return true;
      const m = tags.val(x.id, "mastery");
      return wordMastery === "none" ? !m : m === wordMastery;
    });

    return `<div class="view wrap">
      ${listBar("words", [filter])}
      ${list.length ? groupedGrid("words", list, wordCard, "cardgrid cardgrid--root")
                    : empty("这一档还没有单词", "去某个单词页把掌握度标上，它就会出现在这里。")}
    </div>`;
  };

  const wordCard = x => {
    const st = cardStyle("words");
    return `<div class="entry entry--${st}">
      ${st === "full" ? `<div class="entry__top"><span class="tag tag--line">${(x.senses || []).length} 个义项</span></div>` : ""}
      <div class="entry__id">${masteryDot(x.id)}<a class="entry__form entry__link" href="#/words/${esc(x.id)}">${esc(x.w)}</a></div>
      ${st === "min" ? "" : `<div class="entry__mean" style="font-weight:550">${esc(x.core)}</div>`}
      ${st === "full" && x.image ? `<p class="entry__desc">${esc(x.image)}</p>` : ""}
      ${starBtn("words:" + x.id, x.w)}
    </div>`;
  };

  /* ---------- 标签条 ----------
     放在标题下面常驻，不塞进折叠区：掌握度是复习时最高频的动作，
     每次还要先展开一层就没人会用了。 */
  function tagBar(x) {
    const row = d => {
      let chips;
      if (d.free) {
        const cur = tags.val(x.id, "custom");
        const vocab = tags.vocabulary().filter(t => cur.indexOf(t) < 0);
        chips = cur.map(t =>
          `<button class="chip chip--tag is-on" data-tag="custom" data-val="${esc(t)}"
            title="点一下移除">${esc(t)}<span class="chip__x" aria-hidden="true">×</span></button>`).join("")
          + `<span class="tagadd">
               <input type="text" list="tagvocab" maxlength="${TAG_MAX_LEN}" data-tagadd
                      placeholder="＋ 标签" aria-label="新增自建标签" autocomplete="off">
             </span>`
          + `<datalist id="tagvocab">${vocab.map(t => `<option value="${esc(t)}"></option>`).join("")}</datalist>`;
      } else {
        chips = d.options.map(([v, l]) =>
          `<button class="chip chip--tag${tags.has(x.id, d.id, v) ? " is-on" : ""}"
            data-tag="${esc(d.id)}" data-val="${esc(v)}" data-kind="${esc(d.id === "mastery" ? v : d.id)}"
            aria-pressed="${tags.has(x.id, d.id, v)}">${esc(l)}</button>`).join("");
      }
      return `<div class="tagrow">
        <span class="tagrow__label" title="${esc(d.hint)}">${esc(d.label)}</span>
        <div class="chips">${chips}</div>
      </div>`;
    };
    return `<div class="tagbar" data-tagbar="${esc(x.id)}">
      ${TAG_SETS.map(row).join("")}
      <p class="tagbar__note">考纲这一组是并列的，可以多选。本库整体就是考研范围，所以「考研」标不标都行，
        真正有信息量的是标出它<b>在别的考试里也考</b>；空着只表示还没标过，不代表它只考考研。</p>
    </div>`;
  }

  /* 改标签只重画这一条，不动整页 —— 和设置页同一个道理 */
  function syncTagBar(id) {
    const el = document.querySelector(`[data-tagbar="${id}"]`);
    if (!el) return;
    const x = words.find(w => w.id === id);
    if (!x) return;
    const focused = document.activeElement && document.activeElement.hasAttribute("data-tagadd");
    el.outerHTML = tagBar(x);
    if (focused) {
      const inp = document.querySelector(`[data-tagbar="${id}"] [data-tagadd]`);
      if (inp) inp.focus();
    }
  }

  /* 卡片上的掌握度：一个小圆点，不占地方也不抢眼 */
  const masteryDot = id => {
    const m = tags.val(id, "mastery");
    return m ? `<span class="mdot" data-kind="${esc(m)}" title="掌握度：${esc(tagLabel("mastery", m))}"></span>` : "";
  };

  /* 指向另一个条目的小链接 */
  const xlink = (href, label, sub) => `<a class="xlink" href="${href}">
    <span class="xlink__ico">${icon("i-link", 13)}</span>
    <span class="xlink__t">${esc(label)}</span>
    ${sub ? `<span class="xlink__d">${esc(sub)}</span>` : ""}
  </a>`;

  /* 有多少个构词成分能点进词根页 */
  const linkedParts = parts => (parts || []).filter(p => rootFor(p[0])).length;

  function wordDetail(x) {
    const back = backlinks().word[x.id] || [];
    /* 正向对比里已经出现过的词，反向就不再重复列一遍 */
    const fwdIds = new Set((x.contrasts || []).map(c => String(c.w).toLowerCase()));
    const backOnly = back.filter(b => !fwdIds.has(b.from.id.toLowerCase()) && !fwdIds.has(b.from.w.toLowerCase()));

    return `<article>
      <header class="page__head page__row">
        <div style="flex:1;min-width:0">
          <div class="page__eyebrow">单词分析${x.pos ? " · " + esc(x.pos) : ""}</div>
          <h1 class="page__form">${esc(x.w)}</h1>
        </div>
        ${starBtn("words:" + x.id, x.w)}
      </header>

      ${tagBar(x)}

      ${fold("d.word.core", "核心图景", null,
        `<div class="callout"><p style="font-size:var(--fs-md)">${md(x.core)}</p></div>
         ${x.image ? `<p class="wordimage">${md(x.image)}</p>` : ""}`)}

      ${(x.origin || (x.parts && x.parts.length)) ? fold("d.word.morph", "构词与词源",
        linkedParts(x.parts) ? linkedParts(x.parts) + " 个成分可点开" : null,
        `${x.origin ? `<p class="wordorigin">${md(x.origin)}</p>` : ""}
         ${x.parts && x.parts.length ? `<div style="margin:var(--s3) 0">${morph(x.parts)}</div>${MORPH_LEGEND}` : ""}`) : ""}

      ${(x.senses || []).length ? fold("d.word.senses", "义项", (x.senses || []).length + " 个",
        (x.senses || []).map((s, i) => `<section class="sense">
          <div class="sense__head">
            <span class="sense__n">${i + 1}</span>
            <h3 class="sense__dim">${esc(s.dim)}</h3>
            ${s.tag ? `<span class="tag">${esc(s.tag)}</span>` : ""}
          </div>
          ${s.zh ? `<div class="sense__zh">${esc(s.zh)}</div>` : ""}
          <p class="sense__scene">${md(s.scene)}</p>
          ${s.feature ? `<p class="sense__feature"><b>状态特征 · </b>${md(s.feature)}</p>` : ""}
          ${(s.ex || []).map(e => `<div class="sense__ex">
            <p class="sense__exen">${esc(e.en)}</p>
            <p class="sense__exzh">${esc(e.zh)}</p>
          </div>`).join("")}
        </section>`).join("")) : ""}

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

      ${x.pitfalls && x.pitfalls.length ? fold("d.word.pitfalls", "易错点", x.pitfalls.length + " 条",
        `<ul class="pitfalls card card--pad">${x.pitfalls.map(v => `<li>${md(v)}</li>`).join("")}</ul>`) : ""}

      ${x.drills && x.drills.length ? fold("d.word.drills", "自测", "点一下看答案",
        x.drills.map((d, i) => `<div class="drill">
          <p class="drill__q">${esc(d.q)}</p>
          <button class="btn" style="margin-top:var(--s2)" data-drill="${i}">显示答案</button>
          <div class="drill__a" hidden>
            <span class="drill__ans">${esc(d.a)}</span> — <span class="drill__why">${esc(d.why)}</span>
          </div>
        </div>`).join("")) : ""}

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
      ${listBar("roots", [filter])}
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
               <div class="wordrow__morph">${morph(w.parts, { current: x.id })}</div>
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
      ${listBar("essays", [filter])}
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
            <div class="metarow">
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

    const g = { words: [], roots: [], essays: [] };
    keys.forEach(k => {
      const [t, id] = k.split(":");
      const src = { words, roots, essays }[t];
      const item = src && src.find(x => x.id === id);
      if (item) g[t].push(item);
    });

    const section = (title, n, html) => n ? `<div class="block">${sechead(title, n + " 条")}${html}</div>` : "";

    return `<div class="view wrap">
      ${section("单词分析", g.words.length, `<div class="${gridCls("words", "cardgrid cardgrid--root")}">${g.words.map(wordCard).join("")}</div>`)}
      ${section("词根词缀", g.roots.length, `<div class="${gridCls("roots", "cardgrid cardgrid--root")}">${g.roots.map(rootCard).join("")}</div>`)}
      ${section("范文解析", g.essays.length, `<div class="${gridCls("essays", "cardgrid cardgrid--cmp")}">${g.essays.map(essayCard).join("")}</div>`)}
    </div>`;
  };

  /* ---------- 偏好设置 ----------
     整页由 PREFS 注册表渲染出来，没有一行是为某个具体设置手写的 */
  VIEWS.settings = function () {
    const groups = [];
    PREFS.forEach(d => {
      let g = groups.find(x => x.name === d.group);
      if (!g) groups.push(g = { name: d.group, items: [] });
      g.items.push(d);
    });

    const control = d => {
      const attr = d.type === "enum" ? "data-pref" : "data-preftoggle";
      const on = v => d.type === "enum" ? prefs.is(d.id, v) : prefs.has(d.id, v);
      const off = prefOff(d) ? " disabled" : "";
      return `<div class="chips">${d.options.map(([v, l]) =>
        `<button class="chip${on(v) ? " is-on" : ""}" ${attr}="${esc(d.id)}" data-val="${esc(v)}"
          aria-pressed="${on(v)}"${off}>${esc(l)}</button>`).join("")}</div>`;
    };

    const row = (id, label, hint, ctl, off) => `<div class="prow${off ? " prow--off" : ""}" data-prow="${esc(id)}">
      <div class="prow__main">
        <div class="prow__label">${esc(label)}</div>
        <div class="prow__hint">${esc(hint || "")}</div>
      </div>
      <div class="prow__ctl">${ctl}</div>
    </div>`;

    const body = groups.map(g => `<div class="block">
      ${sechead(g.name)}
      <div class="card">${g.items.map(d =>
        row(d.id, d.label, prefHint(d), control(d), prefOff(d))).join("")}</div>
    </div>`).join("");

    const n = store.folds ? Object.keys(store.folds).length : 0;
    return `<div class="view wrap--read">
      ${body}
      <div class="block">
        ${sechead("数据")}
        <div class="card">
          ${row("act.reset", "恢复默认设置", "只重置上面这些偏好，收藏和折叠状态不受影响",
                `<button class="btn" data-prefact="reset">恢复默认</button>`)}
          ${row("act.folds", "重置折叠状态", foldHint(),
                `<button class="btn" data-prefact="folds"${n ? "" : " disabled"}>全部展开</button>`)}
          ${row("act.recent", "清除浏览记录", recentHint(),
                `<button class="btn" data-prefact="recent"${recent.items.length ? "" : " disabled"}>清除</button>`)}
        </div>
      </div>
      <p class="settings__note">偏好只存在这台设备的浏览器里（localStorage），换设备不同步。</p>
    </div>`;
  };

  /* ============================================================
     全站搜索
     索引里放两类条目：
       card = true   一张卡片本身（单词/词根/辨析/句子/范文），带它的全部分类信息
       card = false  卡片内部的一个片段（一层义项、一个派生词、一条可迁移表达）
     卡片条目会排在片段之前，所以搜「前缀」先出 8 张前缀卡，而不是正文里碰巧提到的句子。
     ============================================================ */
  /* 搜索结果的分类筛选跟着导航走：三类合并成单词分析，where 里仍写明是哪一类 */
  const SEC_LABEL = { words: "单词分析", roots: "词根词缀", essays: "范文解析" };

  let INDEX = null;
  function buildIndex() {
    if (INDEX) return INDEX;
    INDEX = [];
    const push = e => INDEX.push(e);

    words.forEach(x => {
      push({ sec: "words", card: true, href: `#/words/${x.id}`, where: "单词分析", title: x.w, sub: x.core,
        text: ["单词剖析", x.w, x.pos, x.core, x.image, x.origin, x.summary,
               (x.senses || []).map(v => [v.dim, v.tag, v.zh].join(" ")).join(" "),
               (x.parts || []).map(v => v[0] + " " + v[1]).join(" "),
               (x.contrasts || []).map(v => v.w + " " + v.note).join(" "),
               (x.pitfalls || []).join(" "),
               (x.drills || []).map(d => [d.q, d.a, d.why].join(" ")).join(" ")].join(" ") });
      (x.senses || []).forEach(v => push({ sec: "words", card: false, href: `#/words/${x.id}`,
        where: "义项 · " + x.w, title: v.zh || v.dim, sub: v.zh ? v.dim : "",
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
      const t = String(x.text || "").toLowerCase(), i = t.indexOf(lq);
      if (i < 0) return null;
      const ti = String(x.title || "").toLowerCase().indexOf(lq);
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

    if (t.closest("#menuBtn")) { setNav(!navOpen()); return; }
    if (t.closest("#scrim")) { setNav(false); return; }
    /* 抽屉里点了某个板块就直接关掉，不用再点一次遮罩 */
    if (navOpen() && t.closest("#rail .navitem")) setNav(false);

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

    const rk = t.closest("[data-recentkind]");
    if (rk && !rk.disabled) { recentKind = rk.dataset.recentkind; syncRecentBox(); return; }

    const wm = t.closest("[data-wordmastery]");
    if (wm) { wordMastery = wm.dataset.wordmastery; ctrlOpen = true; onRoute(); return; }

    const tg = t.closest("[data-tag]");
    if (tg) {
      const bar = tg.closest("[data-tagbar]");
      if (bar) { tags.toggle(bar.dataset.tagbar, tg.dataset.tag, tg.dataset.val); syncTagBar(bar.dataset.tagbar); }
      return;
    }

    const pf = t.closest("[data-pref]");
    if (pf && !pf.disabled) { prefs.set(pf.dataset.pref, pf.dataset.val); afterPrefChange(); return; }

    const pft = t.closest("[data-preftoggle]");
    if (pft && !pft.disabled) {
      const r = prefs.toggle(pft.dataset.preftoggle, pft.dataset.val);
      if (r === "last") { toast("至少要保留一项，否则没东西可抽"); return; }
      afterPrefChange();
      return;
    }

    const pa = t.closest("[data-prefact]");
    if (pa) {
      if (pa.dataset.prefact === "reset") { prefs.reset(); toast("已恢复默认设置"); }
      else if (pa.dataset.prefact === "recent") { recent.clear(); recentKind = "all"; toast("浏览记录已清除"); }
      else { store.clearFolds(); toast("折叠状态已重置"); }
      afterPrefChange();
      return;
    }

    /* 构词成分指向的词根还没建 —— 给个提示，而不是一个点不动的死链 */
    const nr = t.closest("[data-noroot]");
    if (nr) {
      e.preventDefault();
      toast(`还没有「${nr.dataset.noroot}」的词根条目，可以在 data/roots.js 里补上`);
      return;
    }

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
  });

  /* 自建标签：回车提交，Esc 放弃 */
  document.addEventListener("keydown", e => {
    const inp = e.target.closest && e.target.closest("[data-tagadd]");
    if (inp) {
      if (e.key === "Escape") { inp.value = ""; inp.blur(); return; }
      if (e.key !== "Enter") return;
      e.preventDefault();
      const bar = inp.closest("[data-tagbar]");
      const r = tags.addCustom(bar.dataset.tagbar, inp.value);
      inp.value = "";
      if (r === "full") toast(`一个词最多挂 ${TAG_MAX_PER} 个自建标签`);
      else if (r === "dup") toast("这个标签已经在了");
      else if (r === "ok") syncTagBar(bar.dataset.tagbar);
      return;
    }
  });

  document.addEventListener("keydown", e => {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList) {
      if (e.target.classList.contains("anno")) { e.preventDefault(); toggleAnno(e.target); return; }
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault(); $("#searchInput").focus(); $("#searchInput").select(); return;
    }
    if (e.key === "Escape") {
      if (navOpen()) { setNav(false); $("#menuBtn").focus(); return; }
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

  /* 轻提示：一条浮起来的胶囊，两秒后自己消失。只用来说明「这里暂时没有」 */
  let toastTimer;
  function toast(msg) {
    let el = $("#toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-on"), 2600);
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

  /* 依赖条件没满足＝这条设置当前不生效。
     渲染和就地同步必须共用同一个判断，否则两条路径迟早会不一致
     （踩过：只在同步里加了禁用，初次渲染没加，离开页面再回来禁用就没了）。 */
  const prefOff = d => !!(d.when && !d.when());
  const prefHint = d => prefOff(d) ? d.whenHint : d.hint;
  const foldHint = () => {
    const n = Object.keys(store.folds || {}).length;
    return n ? `当前记住了 ${n} 处折叠` : "当前没有记住任何折叠";
  };
  const recentHint = () => recent.items.length
    ? `首页「最近看过」里现在有 ${recent.items.length} 条`
    : "还没有浏览记录";

  /* 改完偏好只更新受影响的那几个节点。
     以前这里是 onRoute() 整页重渲染——DOM 全部重建、入场动画重放一遍、
     滚动位置还被拉回顶部，点一下底部的开关屏幕就跳一次。 */
  function afterPrefChange() {
    applyTheme();
    syncShuffleBtn();
    syncPrefUI();
  }

  function syncPrefUI() {
    if (route.section !== "settings") return;

    document.querySelectorAll("#view [data-pref], #view [data-preftoggle]").forEach(el => {
      const id = el.dataset.pref || el.dataset.preftoggle;
      const d = prefDef(id);
      if (!d) return;
      const on = d.type === "enum" ? prefs.is(id, el.dataset.val) : prefs.has(id, el.dataset.val);
      el.classList.toggle("is-on", on);
      el.setAttribute("aria-pressed", on);
      el.disabled = prefOff(d);
    });

    PREFS.forEach(d => {
      const rowEl = document.querySelector(`#view [data-prow="${d.id}"]`);
      if (!rowEl) return;
      rowEl.classList.toggle("prow--off", prefOff(d));
      rowEl.querySelector(".prow__hint").textContent = prefHint(d) || "";
    });

    const fr = document.querySelector('#view [data-prow="act.folds"]');
    if (fr) {
      fr.querySelector(".prow__hint").textContent = foldHint();
      fr.querySelector(".btn").disabled = !Object.keys(store.folds || {}).length;
    }
    const rr = document.querySelector('#view [data-prow="act.recent"]');
    if (rr) {
      rr.querySelector(".prow__hint").textContent = recentHint();
      rr.querySelector(".btn").disabled = !recent.items.length;
    }
  }

  /* 主题。侧栏那个按钮和设置页改的是同一个值，两边永远一致 */
  const THEMES = optionIds(prefDef("theme"));
  function applyTheme() {
    const cur = prefs.get("theme");
    document.documentElement.dataset.theme = cur;
    const dark = cur === "dark" ||
      (cur === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
    $("#themeBtn").innerHTML = icon(dark ? "i-moon" : "i-sun", 18);
    $("#themeBtn").title = "主题：" + prefDef("theme").options
      .find(o => o[0] === cur)[1] + "（点击切换）";
  }
  $("#themeBtn").addEventListener("click", () => {
    const cur = prefs.get("theme");
    prefs.set("theme", THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length]);
    applyTheme();
    syncPrefUI();
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);

  /* ---------- 随机复习 ----------
     抽取范围由 review.scope 决定，只想复习作文就把另外两项关掉 */
  const REVIEW_SOURCE = {
    words: () => words.map(x => `#/words/${x.id}`),
    roots: () => roots.filter(x => prefs.has("review.rootKinds", x.kind))
                      .map(x => `#/roots/${x.id}`),
    essays: () => essays.filter(x => prefs.has("review.essayParts", x.part))
                        .map(x => `#/essays/${x.id}`)
  };
  /* 板块 → 它的子范围设置 */
  const REVIEW_FACET = { roots: "review.rootKinds", essays: "review.essayParts" };

  const reviewPool = () => prefs.get("review.scope")
    .reduce((a, k) => (REVIEW_SOURCE[k] ? a.concat(REVIEW_SOURCE[k]()) : a), []);

  /* 悬停提示要说清抽的到底是什么：板块名，子范围没全选时补一个括号 */
  function reviewScopeText() {
    const d = prefDef("review.scope"), scope = prefs.get("review.scope");
    const parts = scope.map(k => {
      const name = d.options.find(o => o[0] === k)[1];
      const fd = REVIEW_FACET[k] && prefDef(REVIEW_FACET[k]);
      if (!fd) return name;
      const picked = prefs.get(fd.id);
      if (picked.length === fd.options.length) return name;
      return `${name}（${picked.map(v => fd.options.find(o => o[0] === v)[1]).join("、")}）`;
    });
    return (scope.length === d.options.length && parts.every(t => t.indexOf("（") < 0))
      ? "全部板块" : parts.join(" / ");
  }

  function syncShuffleBtn() {
    const seq = prefs.is("review.order", "seq");
    const verb = seq ? "按顺序看下一条" : "随机复习一条";
    const t = `${verb} · ${reviewScopeText()}（${reviewPool().length} 条，在设置里改）`;
    /* 图标也要跟着换：交叉箭头是「随机」的意思，顺序模式下用向右的箭头才不误导 */
    const glyph = seq ? "i-next" : "i-shuffle";
    [["#shuffleBtn", 18], ["#fabShuffle", 22]].forEach(([sel, size]) => {
      const el = $(sel);
      el.title = t;
      el.setAttribute("aria-label", verb);
      el.innerHTML = icon(glyph, size);
    });
  }

  /* 顺序模式的游标。不持久化：只要当前停在池子里的某一条上，
     下面第一步就会把游标对到那一条，手动翻页之后顺序也不会错位。
     初值取 -1 表示「还没落位」，这样从首页第一次点会给到第 1 条而不是第 2 条。 */
  let reviewCursor = -1;

  function reviewNext() {
    const pool = reviewPool();
    if (!pool.length) { toast("当前复习范围是空的，去设置里勾一项"); return; }

    const here = `#/${route.section}${route.id ? "/" + route.id : ""}`;
    const at = pool.indexOf(here);
    if (at >= 0) reviewCursor = at;              // 跟当前页面对齐

    if (prefs.is("review.order", "seq")) {
      reviewCursor = (reviewCursor + 1) % pool.length;
      go(pool[reviewCursor]);
      return;
    }

    let cand = pool;
    if (prefs.is("review.avoidRepeat", "on") && pool.length > 1 && at >= 0) {
      cand = pool.filter(h => h !== here);
    }
    const pick = cand[Math.floor(Math.random() * cand.length)];
    reviewCursor = pool.indexOf(pick);           // 随机跳完也记住位置，切回顺序能接着走
    go(pick);
  }
  /* 桌面在导轨底部，手机在右下角，同一个动作两个入口 */
  $("#shuffleBtn").addEventListener("click", reviewNext);
  $("#fabShuffle").addEventListener("click", reviewNext);

  /* ---------- 启动 ---------- */
  prefs.load();
  tags.load();
  recent.load();
  store.load();
  applyTheme();
  syncShuffleBtn();
  window.addEventListener("hashchange", () => { ctrlOpen = false; onRoute(); });
  if (!location.hash) location.replace("#/home");
  onRoute();
})();
