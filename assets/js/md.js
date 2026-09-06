/* ============================================================
   lex — markdown 渲染器
   前台正文和管理后台的预览共用这一份，不要各写一份。

   块级：# ~ #### 标题、段落、- 列表、1. 列表、> 引用、--- 分隔线
   行内：**粗体**、*斜体*、`代码`、[文字](#/roots/spect)
   块内的单个换行渲染成 <br>（GFM 风格），空行分段。
   一律先 esc 再解析 —— 数据里的尖括号永远变不成标签。
   ============================================================ */
(function (root) {
  "use strict";

  const esc = s => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  /* ============================================================
     markdown —— 只实现数据里用得到的那部分，不引外部库

     块级：# ~ #### 标题、段落、- 列表、1. 列表、> 引用、--- 分隔线
     行内：**粗体**、*斜体*、`代码`、[文字](#/roots/spect)
     块内的单个换行渲染成 <br>（GFM 风格），空行分段。
     一律先 esc 再解析 —— 数据里的尖括号永远变不成标签。
     ============================================================ */

  /* 行内解析。代码段先抠出来占位，免得它里面的 * 被当成强调 */
  function inline(t) {
    const code = [];
    let s = esc(t).replace(/`([^`]+)`/g, (m, c) => "\u0001" + (code.push(c) - 1) + "\u0001");
    /* 链接只放行站内 hash 路由和 http(s)，其余原样留着当普通文字 */
    s = s.replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g,
      (m, txt, href) => /^(#\/|https?:\/\/)/.test(href) ? `<a href="${href}">${txt}</a>` : m);
    s = s.replace(/\*\*([^*\n]+)\*\*/g, "<b>$1</b>");
    s = s.replace(/\*([^*\n]+)\*/g, "<i>$1</i>");
    return s.replace(/\u0001(\d+)\u0001/g, (m, i) => "<code>" + code[i] + "</code>");
  }

  const RE_H = /^(#{1,4})\s+(.*)$/;
  const RE_HR = /^(-{3,}|\*{3,}|_{3,})\s*$/;
  const RE_Q = /^>\s?/;
  const RE_UL = /^[-*+]\s+/;
  const RE_OL = /^\d+[.)]\s+/;
  const isBlank = s => !s.trim();
  const isBlock = s => RE_H.test(s) || RE_HR.test(s) || RE_Q.test(s) || RE_UL.test(s) || RE_OL.test(s);

  function md(src) {
    const lines = String(src == null ? "" : src).replace(/\r\n?/g, "\n").trim().split("\n");
    const out = [];
    let i = 0;

    /* 一段连续的普通行，块内换行渲染成 <br> */
    const runInto = buf => {
      /* 续行的缩进是给源码看的，渲染时去掉 */
      while (i < lines.length && !isBlank(lines[i]) && !isBlock(lines[i])) buf.push(lines[i++].replace(/^\s+/, ""));
      return buf.map(inline).join("<br>");
    };

    const list = (mark, tag) => {
      const items = [];
      while (i < lines.length && mark.test(lines[i])) {
        /* 列表项可以跨行续写，续行并进同一个 <li> */
        items.push("<li>" + runInto([lines[i++].replace(mark, "")]) + "</li>");
      }
      return `<${tag}>${items.join("")}</${tag}>`;
    };

    while (i < lines.length) {
      const ln = lines[i];
      if (isBlank(ln)) { i++; continue; }

      const h = RE_H.exec(ln);
      if (h) {
        /* 页面的 h1 是词条本身，正文里的标题一律从 h2 起 */
        const lvl = Math.min(Math.max(h[1].length, 2), 4);
        out.push(`<h${lvl}>${inline(h[2])}</h${lvl}>`);
        i++; continue;
      }
      if (RE_HR.test(ln)) { out.push("<hr>"); i++; continue; }
      if (RE_Q.test(ln)) {
        const buf = [];
        while (i < lines.length && RE_Q.test(lines[i])) {
          const t = lines[i++].replace(RE_Q, "");
          if (!isBlank(t)) buf.push(t);
        }
        out.push(`<blockquote><p>${buf.map(inline).join("<br>")}</p></blockquote>`);
        continue;
      }
      if (RE_UL.test(ln)) { out.push(list(RE_UL, "ul")); continue; }
      if (RE_OL.test(ln)) { out.push(list(RE_OL, "ol")); continue; }

      out.push(`<p>${runInto([])}</p>`);
    }
    return out.join("");
  }

  root.lexEsc = esc;
  root.lexMd = md;
})(window);
