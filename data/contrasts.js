/* ============================================================
   关键词辨析  —  data/contrasts.js
   追加方式：往 DB.contrasts 数组里再加一个对象即可。
   ============================================================ */
window.DB = window.DB || {};
DB.contrasts = [
  {
    id: "affect-effect",
    title: "affect / effect / impact / influence",
    tag: "高频易错",
    level: "核心",
    oneLiner: "affect 是动词“影响”，effect 是名词“影响/结果”；impact 冲击力更强，influence 强调潜移默化。",
    items: [
      { w: "affect", pos: "v.", core: "影响（及物动词）", nuance: "最中性的“对…产生作用”。作名词时是心理学术语“情感表现”，日常写作用不到。", ex: "Rising rates directly affect consumer spending.", exZh: "利率上升直接影响消费支出。" },
      { w: "effect", pos: "n.", core: "影响、效果、结果", nuance: "名词首选。做动词时意思是“实现、促成”（effect change＝促成变革），与 affect 完全不同。", ex: "The policy had little effect on emissions.", exZh: "该政策对排放几乎没有效果。" },
      { w: "impact", pos: "n./v.", core: "冲击、重大影响", nuance: "力度更大、更突然，常搭配 significant / profound / devastating。学术写作中动词用法有人反感，名词更稳妥。", ex: "The drought had a devastating impact on harvests.", exZh: "干旱对收成造成了毁灭性冲击。" },
      { w: "influence", pos: "n./v.", core: "潜移默化的影响力", nuance: "强调长期、间接、往往涉及人或思想的塑造，而非一次性作用。", ex: "Her mentor's influence shaped his entire career.", exZh: "导师的影响塑造了他的整个职业生涯。" }
    ],
    pitfalls: [
      "口诀：**a**ffect 是 **a**ction（动作／动词），**e**ffect 是 **e**nd result（结果／名词）。",
      "写 “have an effect on”，不要写 “have an affect on”。",
      "“影响很大”别一律写 big influence，程度强用 profound impact，中性用 considerable effect。"
    ],
    drills: [
      { q: "The new law will ______ millions of workers.", a: "affect", why: "需要及物动词，选 affect。" },
      { q: "Scientists are still measuring the ______ of the spill.", a: "effect / impact", why: "冠词 the 后面要名词；污染事故力度大，impact 更贴切。" }
    ]
  },
  {
    id: "economic-economical",
    title: "economic / economical",
    tag: "形近异义",
    level: "核心",
    oneLiner: "economic＝与经济有关的（领域）；economical＝省钱省资源的（评价）。",
    items: [
      { w: "economic", pos: "adj.", core: "经济（学）的", nuance: "描述领域，不含褒贬。economic growth / policy / crisis。", ex: "The report analyses economic growth in Southeast Asia.", exZh: "报告分析了东南亚的经济增长。" },
      { w: "economical", pos: "adj.", core: "节省的、划算的", nuance: "是一种评价，等于 not wasteful。也可引申为“简省的”：economical with words＝惜字如金。", ex: "A smaller engine is far more economical.", exZh: "小排量发动机省油得多。" }
    ],
    pitfalls: [
      "同类陷阱一串：historic（有历史意义的）vs historical（历史上的）；classic（经典的）vs classical（古典的）；electric（用电的）vs electrical（与电有关的）。",
      "记忆法：带 -al 的那个往往更“描述性、更外围”，economical 的重点落在“会不会花冤枉钱”。"
    ],
    drills: [
      { q: "The country is facing a severe ______ downturn.", a: "economic", why: "指经济领域，不是“省钱”。" },
      { q: "Buying in bulk is more ______.", a: "economical", why: "在评价划不划算。" }
    ]
  },
  {
    id: "continual-continuous",
    title: "continual / continuous / constant / persistent",
    tag: "近义细分",
    level: "进阶",
    oneLiner: "continuous 中间不断，continual 断断续续但反复，constant 强调恒定不变，persistent 强调顽固不肯停。",
    items: [
      { w: "continuous", pos: "adj.", core: "不间断的（一条直线）", nuance: "时间或空间上没有缝隙。continuous monitoring／a continuous line。", ex: "The machine requires continuous power.", exZh: "这台机器需要不间断供电。" },
      { w: "continual", pos: "adj.", core: "反复发生的（一串点）", nuance: "中间有停顿但一再重来，常带轻微不耐烦的语气。", ex: "Continual interruptions ruined my afternoon.", exZh: "一再被打断，毁了我一下午。" },
      { w: "constant", pos: "adj.", core: "恒定不变的／持续不停的", nuance: "既可指数值恒定（constant temperature），也可口语化地指“一直有”。", ex: "She lives in constant fear of relapse.", exZh: "她一直生活在复发的恐惧中。" },
      { w: "persistent", pos: "adj.", core: "顽固持续的", nuance: "带“想摆脱却摆脱不掉”的意味，多用于问题、症状、传言。", ex: "a persistent cough that lasted six weeks", exZh: "持续了六周、怎么都好不了的咳嗽" }
    ],
    pitfalls: [
      "只有 continuous 能形容真正“零间隙”的东西：a continuous line of trees（一排连成片的树），换成 continual 就错了。",
      "抱怨别人反复打扰，用 continual 或 constant，不用 continuous。"
    ],
    drills: [
      { q: "The patient is under ______ observation in the ICU.", a: "continuous", why: "ICU 监护是不间断的。" },
      { q: "I'm tired of his ______ complaints.", a: "continual / constant", why: "抱怨一阵一阵地反复来。" }
    ]
  },
  {
    id: "imply-infer",
    title: "imply / infer / suggest / indicate",
    tag: "方向易反",
    level: "进阶",
    oneLiner: "说话人 imply（暗示，往外送），听话人 infer（推断，往回收）——方向正好相反。",
    items: [
      { w: "imply", pos: "v.", core: "（说话方）暗示", nuance: "主语通常是人、话语或事实。信息从发出者流向接收者。", ex: "He never said no, but his tone implied refusal.", exZh: "他没说不，但语气暗示了拒绝。" },
      { w: "infer", pos: "v.", core: "（接收方）推断出", nuance: "主语是读者、听者、研究者。常搭配 infer X from Y。", ex: "From the data we can infer a causal link.", exZh: "从数据中我们可以推断出因果联系。" },
      { w: "suggest", pos: "v.", core: "表明、暗示（语气最弱）", nuance: "学术写作最安全的措辞：证据只是“提示”，没有下定论。", ex: "The findings suggest, but do not prove, a connection.", exZh: "研究结果提示但未证明存在联系。" },
      { w: "indicate", pos: "v.", core: "表明（比 suggest 确定）", nuance: "证据指向性更明确，但仍弱于 prove / demonstrate。", ex: "The results clearly indicate a seasonal pattern.", exZh: "结果清楚表明存在季节性规律。" }
    ],
    pitfalls: [
      "❌ Are you inferring that I lied? ✅ Are you implying that I lied?（对方在暗示，不是在推断）",
      "论证强度阶梯：suggest ＜ indicate ＜ demonstrate ＜ prove。写议论文时慎用 prove，容易失分于“过度断言”。"
    ],
    drills: [
      { q: "The author ______ that reform is overdue without ever saying so.", a: "implies", why: "作者是信息发出方。" },
      { q: "Readers may ______ from the ending that she survived.", a: "infer", why: "读者是接收方。" }
    ]
  },
  {
    id: "adapt-adopt",
    title: "adapt / adopt / adept",
    tag: "形近易错",
    level: "核心",
    oneLiner: "adapt 改造以适应，adopt 原样采纳，adept 是形容词“擅长的”。",
    items: [
      { w: "adapt", pos: "v.", core: "使适应、改编", nuance: "含“做出改动”之意。adapt to（自己去适应）／adapt sth. for（把某物改造给…用）。", ex: "The novel was adapted for the screen.", exZh: "这部小说被改编成了电影。" },
      { w: "adopt", pos: "v.", core: "采纳、收养", nuance: "原封不动地接受过来：adopt a policy／adopt a child／adopt an approach。", ex: "The board adopted the proposal unanimously.", exZh: "董事会一致通过了该提案。" },
      { w: "adept", pos: "adj.", core: "熟练的、擅长的", nuance: "adept at doing sth.，语气比 good at 正式。", ex: "She is adept at defusing conflict.", exZh: "她很擅长化解冲突。" }
    ],
    pitfalls: [
      "记忆：ad-**apt**（apt＝合适）→ 调整到合适；ad-**opt**（opt＝选择）→ 选来就用。",
      "“适应新环境”是 adapt to a new environment，写成 adopt 就变成“收养环境”了。"
    ],
    drills: [
      { q: "Species that fail to ______ to climate change will die out.", a: "adapt", why: "需要自身改变以适应。" },
      { q: "Many firms have ______ a four-day week.", a: "adopted", why: "把制度原样采纳。" }
    ]
  },
  {
    id: "principle-principal",
    title: "principle / principal",
    tag: "拼写陷阱",
    level: "核心",
    oneLiner: "principle 只能是名词“原则”；principal 是形容词“主要的”或名词“校长／本金”。",
    items: [
      { w: "principle", pos: "n.", core: "原则、原理", nuance: "抽象准则。on principle＝出于原则；in principle＝原则上（但实际未必）。", ex: "He resigned on principle.", exZh: "他出于原则辞职。" },
      { w: "principal", pos: "adj./n.", core: "主要的；校长；本金", nuance: "形容词只作定语：the principal reason。金融语境指未计利息的本金。", ex: "The principal cause of failure was poor planning.", exZh: "失败的主要原因是规划不当。" }
    ],
    pitfalls: [
      "记忆：princip**al** 里的 **a** 想成 “**a** person / the m**a**in one”（校长是人、主要的）；princip**le** 里的 **le** 想成 ru**le**（规则＝原则）。",
      "in principle（原则上可行）≠ in practice（实际操作中），这一对常用于让步论证。"
    ],
    drills: [
      { q: "Our ______ concern is student safety.", a: "principal", why: "作定语表“主要的”。" },
      { q: "It goes against my ______.", a: "principles", why: "指做人的原则，名词。" }
    ]
  }
];
