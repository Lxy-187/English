/* ============================================================
   好词好句 · 好用法  —  data/phrases.js
   type: 句式 | 搭配 | 替换 | 用法 | 金句
   追加方式：往 DB.phrases 数组里再加一个对象即可。
   ============================================================ */
window.DB = window.DB || {};
DB.phrases = [
  /* ---------- 观点与立场 ---------- */
  { id: "p001", cat: "观点与立场", type: "句式", en: "It is widely held that ..., yet the evidence tells a different story.", zh: "人们普遍认为……，但证据讲的是另一个故事。", note: "开头段神句：先立“普遍看法”，再一转推出自己的论点，比 “Some people think... I think...” 高级得多。", tags: ["开头", "转折"] },
  { id: "p002", cat: "观点与立场", type: "句式", en: "Far from being ..., X is in fact ...", zh: "X 非但不是……，实际上是……", note: "强力反驳句式。Far from being a burden, an ageing population can be an economic asset.", tags: ["反驳", "强调"] },
  { id: "p003", cat: "观点与立场", type: "句式", en: "There is a compelling case for ...", zh: "有充分理由支持……", note: "比 I strongly believe 客观。反向用 There is little to be said for ...（几乎没什么可取之处）。", tags: ["论点"] },
  { id: "p004", cat: "观点与立场", type: "用法", en: "arguably", zh: "可以说、大概是", note: "写作利器：既表达强观点又留退路。Arguably the most consequential reform of the decade. 放在最高级前面，避免绝对化失分。", tags: ["语气", "学术"] },

  /* ---------- 因果与论证 ---------- */
  { id: "p010", cat: "因果与论证", type: "句式", en: "This is not merely a matter of ...; it goes to the heart of ...", zh: "这不仅仅是……的问题，它触及……的核心。", note: "把论证从表层推向深层，用于段落升华。", tags: ["升华", "递进"] },
  { id: "p011", cat: "因果与论证", type: "句式", en: "A more plausible explanation lies in ...", zh: "更合理的解释在于……", note: "驳倒对方归因后接自己的归因，逻辑衔接非常自然。", tags: ["因果"] },
  { id: "p012", cat: "因果与论证", type: "搭配", en: "give rise to / stem from / be attributable to / at the root of", zh: "导致 / 源于 / 可归因于 / 根源在于", note: "替换泛滥的 because 和 lead to。注意方向：give rise to 是因→果，stem from 是果→因，别写反。", tags: ["因果", "替换"] },
  { id: "p013", cat: "因果与论证", type: "用法", en: "correlation is not causation", zh: "相关不等于因果", note: "议论文加分意识：写 A rises as B rises 时补一句 though correlation alone does not establish causation，立刻显出思辨性。", tags: ["思辨", "学术"] },

  /* ---------- 让步与转折 ---------- */
  { id: "p020", cat: "让步与转折", type: "句式", en: "While it is true that ..., this concession hardly undermines the broader point that ...", zh: "诚然……，但这一让步并不足以动摇……这一更大的论断。", note: "标准让步结构的高配版。关键是让步之后必须“收回来”，否则自伤论点。", tags: ["让步", "结构"] },
  { id: "p021", cat: "让步与转折", type: "句式", en: "X may work in principle, but in practice it founders on ...", zh: "X 原则上可行，但在实践中会因……而失败。", note: "in principle / in practice 这对搭配是驳论骨架，founder on＝因…而受挫。", tags: ["让步", "驳论"] },
  { id: "p022", cat: "让步与转折", type: "搭配", en: "admittedly / granted / to be fair / that said / even so", zh: "诚然 / 姑且承认 / 平心而论 / 话虽如此 / 即便如此", note: "轻量让步词，插在句首加逗号即可，比每次都写 Although 从句灵活。that said 用来把话锋转回来。", tags: ["连接词"] },

  /* ---------- 数据与趋势 ---------- */
  { id: "p030", cat: "数据与趋势", type: "搭配", en: "surge / soar / climb steadily / edge up / plateau / taper off / plummet", zh: "激增 / 飙升 / 稳步攀升 / 微升 / 趋于平稳 / 逐渐减弱 / 暴跌", note: "图表作文按“幅度＋速度”选词。plateau 和 taper off 是拉开档次的两个词，很多人只会 increase／decrease。", tags: ["图表", "替换"] },
  { id: "p031", cat: "数据与趋势", type: "句式", en: "The figure for X nearly doubled, from A in 2015 to B in 2024.", zh: "X 的数字从 2015 年的 A 增至 2024 年的 B，几乎翻了一倍。", note: "描述数据的黄金骨架：变化幅度 + from A to B + 时间。注意 double／triple 后面不加 times。", tags: ["图表", "句式"] },
  { id: "p032", cat: "数据与趋势", type: "用法", en: "account for / make up / represent", zh: "占（比例）", note: "Renewables account for 30% of output. 别用 occupy 表示占比例——那是“占据空间”。", tags: ["图表", "易错"] },

  /* ---------- 举例与类比 ---------- */
  { id: "p040", cat: "举例与类比", type: "句式", en: "Consider the case of ...", zh: "不妨想想……的例子。", note: "比 For example 更有对话感，适合开启一个具体案例段。", tags: ["举例"] },
  { id: "p041", cat: "举例与类比", type: "句式", en: "The parallel with ... is instructive.", zh: "与……作类比很有启发。", note: "引入类比论证，后面紧跟解释类比在哪里成立。", tags: ["类比"] },
  { id: "p042", cat: "举例与类比", type: "搭配", en: "a case in point / to name but a few / not least", zh: "一个恰当的例子 / 仅举几例 / 尤其是", note: "not least 用于把最重要的例子压轴：..., not least the collapse of local industry.", tags: ["举例", "连接词"] },

  /* ---------- 结尾与升华 ---------- */
  { id: "p050", cat: "结尾与升华", type: "句式", en: "The question, ultimately, is not whether ... but how ...", zh: "归根结底，问题不在于是否……，而在于如何……", note: "把二元争论提升为“路径之争”，结尾极有力量。", tags: ["结尾", "金句"] },
  { id: "p051", cat: "结尾与升华", type: "句式", en: "What is at stake is not ... alone, but ...", zh: "真正攸关的不只是……，而是……", note: "at stake＝利害攸关。结尾拔高时避免空喊口号，用它把话题拉回更大的价值。", tags: ["结尾"] },
  { id: "p052", cat: "结尾与升华", type: "用法", en: "别用 In conclusion 开头", zh: "结尾段的替代写法", note: "改用 The evidence points in one direction: ... 或 If ... is to succeed, ... must ...。阅卷人对模板词免疫，换成实质性总结更好。", tags: ["结尾", "避坑"] },

  /* ---------- 高级替换 ---------- */
  { id: "p060", cat: "高级替换", type: "替换", en: "very important → crucial / pivotal / indispensable", zh: "非常重要 →", note: "pivotal 强调“转折关键”，indispensable 强调“缺了不行”，不是随便互换。", tags: ["替换"] },
  { id: "p061", cat: "高级替换", type: "替换", en: "a lot of problems → a host of challenges / a raft of difficulties", zh: "很多问题 →", note: "a host of 后接可数复数；challenge 比 problem 更中性、更书面。", tags: ["替换"] },
  { id: "p062", cat: "高级替换", type: "替换", en: "solve → tackle / address / mitigate / alleviate", zh: "解决 →", note: "力度递减：solve（彻底解决）＞ tackle（着手处理）＞ mitigate／alleviate（缓解）。写“缓解压力”用 alleviate，写成 solve the pressure 是中式英语。", tags: ["替换", "易错"] },
  { id: "p063", cat: "高级替换", type: "替换", en: "more and more people → a growing number of people / an increasing share of the population", zh: "越来越多的人 →", note: "考场高频俗套词，换掉立刻提分。注意 number 后跟可数复数，amount 才跟不可数。", tags: ["替换", "避坑"] },

  /* ---------- 地道用法 ---------- */
  { id: "p070", cat: "地道用法", type: "用法", en: "the case for / the case against", zh: "支持……的理由 / 反对……的理由", note: "The case for nuclear power rests on three claims. 用名词化结构起段，比 There are three reasons why... 紧凑得多。", tags: ["结构"] },
  { id: "p071", cat: "地道用法", type: "用法", en: "come at the expense of", zh: "以牺牲……为代价", note: "写权衡关系的万能句：Growth should not come at the expense of the environment.", tags: ["权衡"] },
  { id: "p072", cat: "地道用法", type: "用法", en: "strike a balance between A and B", zh: "在 A 与 B 之间取得平衡", note: "注意动词是 strike，不是 make/keep。同族：strike a chord（引起共鸣）、strike a deal（达成协议）。", tags: ["搭配", "易错"] },
  { id: "p073", cat: "地道用法", type: "用法", en: "be no substitute for", zh: "无法替代", note: "Technology is no substitute for good teaching. 注意 no 后直接跟单数名词，不加 a。", tags: ["搭配"] },
  { id: "p074", cat: "地道用法", type: "用法", en: "at the expense of vs. in exchange for", zh: "以…为代价 vs. 以…作交换", note: "前者暗含损失和批评，后者中性描述交易。语气差别很大，别混用。", tags: ["辨析"] },

  /* ---------- 金句 ---------- */
  { id: "p080", cat: "金句", type: "金句", en: "We do not rise to the level of our expectations; we fall to the level of our training.", zh: "人不会升到期望的高度，只会跌到训练的水平。", note: "写“积累／习惯／坚持”类话题的收尾金句。", tags: ["金句", "教育"] },
  { id: "p081", cat: "金句", type: "金句", en: "A society grows great when old men plant trees whose shade they know they shall never sit in.", zh: "当老人栽下自知永远无法乘凉的树，社会才真正伟大。", note: "谚语。适用于可持续发展、代际责任、公共投入类话题。", tags: ["金句", "环保", "社会"] },
  { id: "p082", cat: "金句", type: "金句", en: "The best time to plant a tree was twenty years ago. The second best time is now.", zh: "种树最好的时间是二十年前，其次是现在。", note: "谚语。用于“行动／补救永远不晚”，比 Better late than never 有画面感。", tags: ["金句", "行动"] }
];
