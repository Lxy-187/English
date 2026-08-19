/* ============================================================
   词根词缀库  —  data/roots.js

   结构原则：**含义决定框架**。
   一个词缀有几层意思，就有几节；每个派生词挂在它真正所属的那层意思下面。
   没有固定节数 —— spect 有 3 层，per- 有 5 层，port 有 3 层，各不相同。

   字段：
     id / kind(root|prefix|suffix) / form / gloss / origin
     meaning   总括释义，用于卡片和搜索
     senses    [{ meaning, gloss, note, words:[{w, parts, def, ex}] }]
                 meaning 这一层的中文含义（＝这一节的标题）
                 note    这一层怎么理解（只讲这一层，不讲别的）
                 words   属于这一层的派生词
     related   相关词根 id
   ============================================================ */
window.DB = window.DB || {};
DB.roots = [

  {
    id: "spect", kind: "root", form: "spect / spic / spec",
    meaning: "看", gloss: "to look, to watch",
    origin: "拉丁语 specere（看）",
    related: ["vis", "dict"],
    senses: [
      {
        meaning: "主动去看、观察",
        gloss: "to look at",
        note: "眼睛朝某个方向发出视线。差别全在前缀指定的**方向**：往里看、往回看、往前看、四下看。",
        words: [
          { w: "inspect", parts: [["in-", "向内", "prefix"], ["spect", "看", "root"]], def: "检查、视察（往里面看）", ex: "Officials will inspect the site before approval." },
          { w: "respect", parts: [["re-", "回、向后", "prefix"], ["spect", "看", "root"]], def: "尊敬（值得回头再看一眼）", ex: "She earned the respect of her colleagues." },
          { w: "prospect", parts: [["pro-", "向前", "prefix"], ["spect", "看", "root"]], def: "前景、前途（向前看到的东西）", ex: "The prospect of promotion kept him motivated." },
          { w: "retrospect", parts: [["retro-", "向后", "prefix"], ["spect", "看", "root"]], def: "回顾（向后看）", ex: "In retrospect, the decision was premature." },
          { w: "circumspect", parts: [["circum-", "环绕", "prefix"], ["spect", "看", "root"]], def: "谨慎的（四下张望后才行动）", ex: "Be circumspect when signing contracts." }
        ]
      },
      {
        meaning: "呈现给人看的景象",
        gloss: "something seen, a sight",
        note: "视角从「看的人」翻转到「被看的东西」。凡是这一层的词，主语都是那个吸引目光的对象。",
        words: [
          { w: "spectacle", parts: [["spect", "看", "root"], ["-acle", "名词", "suffix"]], def: "壮观场面、奇观（被众人观看的东西）", ex: "The parade was quite a spectacle." },
          { w: "spectator", parts: [["spect", "看", "root"], ["-ator", "…的人", "suffix"]], def: "观众（在场看的人）", ex: "Thousands of spectators filled the stadium." },
          { w: "conspicuous", parts: [["con-", "加强语气", "prefix"], ["spic", "看", "root"], ["-uous", "形容词", "suffix"]], def: "显眼的（谁都看得见）", ex: "His absence was conspicuous." }
        ]
      },
      {
        meaning: "看清之后区分出的种类",
        gloss: "kind, sort（spec- 分支）",
        note: "这一层最容易被忽略：先要「看清」，才能把事物分门别类。所以 spec- 从「看」长出了「种类、具体」这一支。",
        words: [
          { w: "species", parts: [["spec", "看/区分", "root"], ["-ies", "名词", "suffix"]], def: "物种（能被辨认出来的一类）", ex: "This species is native to Australia." },
          { w: "specific", parts: [["spec", "看/区分", "root"], ["-ific", "形容词", "suffix"]], def: "具体的、特定的（能被指认出来的那一个）", ex: "Be specific about what you need." },
          { w: "specimen", parts: [["spec", "看", "root"], ["-imen", "名词", "suffix"]], def: "样本、标本（拿来给人看的那一份）", ex: "a blood specimen" }
        ]
      }
    ]
  },

  {
    id: "vis", kind: "root", form: "vis / vid",
    meaning: "看见", gloss: "to see",
    origin: "拉丁语 videre（看见）",
    related: ["spect"],
    senses: [
      {
        meaning: "视觉、看得见",
        gloss: "sight",
        note: "spect 强调「看的动作」，vis/vid 强调「看见的结果」。video 字面就是「我看见」。",
        words: [
          { w: "visible", parts: [["vis", "看见", "root"], ["-ible", "能够…的", "suffix"]], def: "可见的", ex: "The stars are barely visible in the city." },
          { w: "vision", parts: [["vis", "看见", "root"], ["-ion", "名词", "suffix"]], def: "视力；愿景（看见的能力／看见的图像）", ex: "a leader with vision" },
          { w: "evident", parts: [["e-", "向外", "prefix"], ["vid", "看见", "root"], ["-ent", "形容词", "suffix"]], def: "明显的（露在外面能看见）", ex: "It is evident that costs have risen." }
        ]
      },
      {
        meaning: "审视、监督",
        gloss: "to look over",
        note: "把视线当成一种权力：从上往下看＝监督，反复看＝检查修订。",
        words: [
          { w: "supervise", parts: [["super-", "在上方", "prefix"], ["vis", "看", "root"]], def: "监督（在上面看着）", ex: "A senior nurse supervises the ward." },
          { w: "revise", parts: [["re-", "再", "prefix"], ["vis", "看", "root"]], def: "修订（再看一遍）", ex: "I revised the draft three times." },
          { w: "survey", parts: [["sur-", "在上方", "prefix"], ["vey", "看（vid）", "root"]], def: "勘察、调查（从高处扫视全局）", ex: "They surveyed the damage." }
        ]
      },
      {
        meaning: "预先看到 → 提供、预备",
        gloss: "to foresee",
        note: "这一层是隐喻投射：先「看到」将来的需求，才谈得上「备好」。provide 的字面意思就是 pro-（预先）+ vid（看）。",
        words: [
          { w: "provide", parts: [["pro-", "预先", "prefix"], ["vid", "看", "root"]], def: "提供（预先看到需求并备好）", ex: "The fund provides for emergencies." },
          { w: "provision", parts: [["pro-", "预先", "prefix"], ["vis", "看", "root"], ["-ion", "名词", "suffix"]], def: "供给；（合同）条款", ex: "the provision of public services" },
          { w: "prudent", parts: [["pru-", "预先（pro- 缩合）", "prefix"], ["dent", "看（vid）", "root"]], def: "审慎的（能预见后果的）", ex: "a prudent investor" }
        ]
      }
    ]
  },

  {
    id: "dict", kind: "root", form: "dict / dic",
    meaning: "说", gloss: "to say, to speak",
    origin: "拉丁语 dicere（说）",
    related: ["spect"],
    senses: [
      {
        meaning: "开口说、下断言",
        gloss: "to speak",
        note: "最基础的一层：把话说出去。方向由前缀决定——事先说、说反话、反复说。",
        words: [
          { w: "predict", parts: [["pre-", "事先", "prefix"], ["dict", "说", "root"]], def: "预测（事先说）", ex: "Economists predict a mild recession." },
          { w: "contradict", parts: [["contra-", "相反", "prefix"], ["dict", "说", "root"]], def: "反驳、自相矛盾（说反话）", ex: "The witness contradicted himself twice." },
          { w: "dictate", parts: [["dict", "说", "root"], ["-ate", "动词", "suffix"]], def: "口述（把话一句句说出来让人记）", ex: "He dictated the letter to his assistant." }
        ]
      },
      {
        meaning: "带权威的宣告",
        gloss: "authoritative pronouncement",
        note: "当「说」的主体握有权力时，说出来的话就成了具有约束力的裁断。这一层的词几乎都出现在法律和统治语境里。",
        words: [
          { w: "verdict", parts: [["ver-", "真实", "root"], ["dict", "说", "root"]], def: "裁决（说出真相）", ex: "The jury reached a verdict in two hours." },
          { w: "dictator", parts: [["dict", "说", "root"], ["-ator", "…的人", "suffix"]], def: "独裁者（他说了算）", ex: "The country was ruled by a dictator." },
          { w: "jurisdiction", parts: [["juris", "法", "root"], ["dict", "说", "root"], ["-ion", "名词", "suffix"]], def: "司法管辖权（在这个范围内由法律说了算）", ex: "The case falls outside our jurisdiction." }
        ]
      },
      {
        meaning: "指出、显示",
        gloss: "to point out",
        note: "从「用嘴说」弱化为「用手指、用数据指出」。这一层不再有声音，但仍然是在「传达信息」。",
        words: [
          { w: "indicate", parts: [["in-", "朝向", "prefix"], ["dic", "说", "root"], ["-ate", "动词", "suffix"]], def: "表明、指出", ex: "The data indicate a clear upward trend." },
          { w: "index", parts: [["in-", "朝向", "prefix"], ["dex", "说/指", "root"]], def: "索引；指数（指向内容的东西）", ex: "Check the index at the back." },
          { w: "dedicate", parts: [["de-", "郑重地", "prefix"], ["dic", "说", "root"], ["-ate", "动词", "suffix"]], def: "奉献、题献（郑重宣告归属于谁）", ex: "She dedicated her life to research." }
        ]
      }
    ]
  },

  {
    id: "port", kind: "root", form: "port",
    meaning: "搬运、携带", gloss: "to carry",
    origin: "拉丁语 portare（搬运）",
    related: ["ject", "tain", "sub"],
    senses: [
      {
        meaning: "搬运、运输",
        gloss: "to carry from A to B",
        note: "最字面的一层：把东西从一个地方挪到另一个地方。porter 就是搬运工。方向由前缀给：搬出去、搬进来、搬过去。",
        words: [
          { w: "export", parts: [["ex-", "向外", "prefix"], ["port", "搬", "root"]], def: "出口（搬出去）", ex: "The country exports mainly agricultural goods." },
          { w: "import", parts: [["im-", "向内（in-）", "prefix"], ["port", "搬", "root"]], def: "进口（搬进来）", ex: "We import most of our oil." },
          { w: "transport", parts: [["trans-", "跨越", "prefix"], ["port", "搬", "root"]], def: "运输（搬过去）", ex: "Goods are transported by rail." },
          { w: "deport", parts: [["de-", "离开", "prefix"], ["port", "搬", "root"]], def: "驱逐出境（把人搬走）", ex: "He was deported for visa fraud." },
          { w: "portable", parts: [["port", "搬", "root"], ["-able", "可…的", "suffix"]], def: "便携的（搬得动的）", ex: "a portable charger" }
        ]
      },
      {
        meaning: "承载、支撑",
        gloss: "to bear weight",
        note: "「搬」需要先「扛得住」。这一层把重点从「移动」挪到了「承重」——东西不动，但重量压在你身上。",
        words: [
          { w: "support", parts: [["sup-", "在下面（sub-）", "prefix"], ["port", "承载", "root"]], def: "支撑、支持（从下面托着）", ex: "The evidence supports this conclusion." },
          { w: "supportive", parts: [["sup-", "在下面", "prefix"], ["port", "承载", "root"], ["-ive", "形容词", "suffix"]], def: "给予支持的（充当底座）", ex: "a supportive environment" },
          { w: "important", parts: [["im-", "向内", "prefix"], ["port", "承载", "root"], ["-ant", "形容词", "suffix"]], def: "重要的（分量重、压得住）", ex: "an important decision" }
        ]
      },
      {
        meaning: "举止、风度",
        gloss: "how one carries oneself",
        note: "把「搬运」的对象换成自己：一个人怎么「搬动自己的身体」，就是他的举止和仪态。中文说「有派头」是同一个比喻。",
        words: [
          { w: "deportment", parts: [["de-", "彻底", "prefix"], ["port", "搬运（自己）", "root"], ["-ment", "名词", "suffix"]], def: "举止、仪态", ex: "She was taught poise and deportment." },
          { w: "comport", parts: [["com-", "一起", "prefix"], ["port", "搬运（自己）", "root"]], def: "举止、表现（使自己的行为与场合相称）", ex: "He comported himself with dignity." }
        ]
      }
    ]
  },

  {
    id: "ject", kind: "root", form: "ject",
    meaning: "投、扔", gloss: "to throw",
    origin: "拉丁语 jacere（投掷）",
    related: ["port", "sub"],
    senses: [
      {
        meaning: "物理投掷的方向",
        gloss: "to throw (a direction)",
        note: "把每个词都还原成一个投掷动作，然后只问一句：**往哪个方向扔**。",
        words: [
          { w: "reject", parts: [["re-", "往回", "prefix"], ["ject", "扔", "root"]], def: "拒绝（扔回去）", ex: "The journal rejected the paper." },
          { w: "inject", parts: [["in-", "往里", "prefix"], ["ject", "扔", "root"]], def: "注射、注入（扔进去）", ex: "The reform injected new energy into the market." },
          { w: "eject", parts: [["e-", "向外", "prefix"], ["ject", "扔", "root"]], def: "弹出、驱逐（扔出来）", ex: "The pilot ejected safely." },
          { w: "project", parts: [["pro-", "向前", "prefix"], ["ject", "扔", "root"]], def: "投射；预计；项目（把想法扔向未来）", ex: "Sales are projected to double." }
        ]
      },
      {
        meaning: "被扔到某个位置 → 主客体关系",
        gloss: "thrown into a position",
        note: "这一层是哲学化的投射：**扔到下面**的是受支配者（subject），**扔在对面**的是独立于我的东西（object）。英语的主语/宾语、主观/客观全部来自这个物理图景。",
        words: [
          { w: "subject", parts: [["sub-", "在下面", "prefix"], ["ject", "扔", "root"]], def: "主题；臣民；使服从（被扔在下面）", ex: "The plan is subject to approval." },
          { w: "object", parts: [["ob-", "对面", "prefix"], ["ject", "扔", "root"]], def: "物体；反对（扔在对面的东西）", ex: "She objected to the proposal." },
          { w: "objective", parts: [["ob-", "对面", "prefix"], ["ject", "扔", "root"], ["-ive", "形容词", "suffix"]], def: "客观的（摆在对面、独立于我）", ex: "We need an objective assessment." }
        ]
      }
    ]
  },

  {
    id: "cred", kind: "root", form: "cred",
    meaning: "相信", gloss: "to believe, to trust",
    origin: "拉丁语 credere（相信）",
    related: ["tain", "per"],
    senses: [
      {
        meaning: "信不信得过",
        gloss: "believable",
        note: "这一层在判断**可信度**。注意区分方向：credible 说的是「东西本身可信」，credulous 说的是「人容易轻信」——一个夸对象，一个损主体。",
        words: [
          { w: "credible", parts: [["cred", "相信", "root"], ["-ible", "可…的", "suffix"]], def: "可信的（来源或说法值得信）", ex: "a credible witness" },
          { w: "credulous", parts: [["cred", "相信", "root"], ["-ulous", "易于…的", "suffix"]], def: "轻信的（人容易被骗）", ex: "Credulous investors lost everything." },
          { w: "incredible", parts: [["in-", "否定", "prefix"], ["cred", "相信", "root"], ["-ible", "可…的", "suffix"]], def: "难以置信的", ex: "an incredible coincidence" }
        ]
      },
      {
        meaning: "把信任兑换成凭证",
        gloss: "credit, credentials",
        note: "信任一旦被制度化，就变成了可以出示、可以透支的东西。credit card 就是「相信你会还钱的卡」。",
        words: [
          { w: "credit", parts: [["cred", "相信", "root"], ["-it", "名词", "suffix"]], def: "信贷；功劳（别人对你的信任额度）", ex: "They bought the car on credit." },
          { w: "credentials", parts: [["cred", "相信", "root"], ["-ential", "名词", "suffix"]], def: "资历、凭证（证明你可信的文件）", ex: "She has impeccable academic credentials." },
          { w: "accredit", parts: [["ac-", "朝向（ad-）", "prefix"], ["cred", "相信", "root"]], def: "认证、授权（官方盖章说它可信）", ex: "an accredited institution" }
        ]
      },
      {
        meaning: "信条、教义",
        gloss: "creed",
        note: "当「相信」凝固成一套不再追问的命题，就成了信条。这一层带有宗教和意识形态色彩。",
        words: [
          { w: "creed", parts: [["creed", "相信（credere）", "root"]], def: "信条、教义", ex: "people of every creed and colour" },
          { w: "credo", parts: [["credo", "我相信（拉丁语第一人称）", "root"]], def: "信条、宗旨", ex: "Simplicity is his design credo." }
        ]
      }
    ]
  },

  {
    id: "tain", kind: "root", form: "tain / ten / tin",
    meaning: "握住、保持", gloss: "to hold, to keep",
    origin: "拉丁语 tenere（握住）",
    related: ["port", "cred"],
    senses: [
      {
        meaning: "抓住不放、维持",
        gloss: "to keep holding",
        note: "手一直没松开。这一层的关键是**对抗流失**——不抓就会掉、就会走、就会散。",
        words: [
          { w: "maintain", parts: [["main-", "手（manus）", "prefix"], ["tain", "握住", "root"]], def: "维持（用手一直握着）", ex: "Maintaining momentum is harder than starting." },
          { w: "retain", parts: [["re-", "往回", "prefix"], ["tain", "握住", "root"]], def: "保留、留住（不让它走）", ex: "The company struggles to retain talent." },
          { w: "sustain", parts: [["sus-", "从下面（sub-）", "prefix"], ["tain", "握住", "root"]], def: "支撑、维持（从底下托住不让塌）", ex: "The economy sustained steady growth." }
        ]
      },
      {
        meaning: "容纳、包含",
        gloss: "to hold inside",
        note: "把「握在手里」放大成「装在里面」。container 就是「把东西一起握住的东西」。",
        words: [
          { w: "contain", parts: [["con-", "一起", "prefix"], ["tain", "握住", "root"]], def: "容纳、包含（一起握在里面）", ex: "The box contains old letters." },
          { w: "content", parts: [["con-", "一起", "prefix"], ["tent", "握住", "root"]], def: "内容（被装在里面的东西）", ex: "the content of the report" },
          { w: "detain", parts: [["de-", "离开/扣下", "prefix"], ["tain", "握住", "root"]], def: "拘留、耽搁（把人扣住不放走）", ex: "He was detained at the border." }
        ]
      },
      {
        meaning: "首尾相握 → 连续不断",
        gloss: "unbroken",
        note: "多个环节手拉手，中间没有断口。这一层解释了为什么 continuous 表示「没有缝隙」。",
        words: [
          { w: "continue", parts: [["con-", "一起", "prefix"], ["tin", "握住", "root"], ["-ue", "动词", "suffix"]], def: "继续（接着握下去）", ex: "The trial continues tomorrow." },
          { w: "continuous", parts: [["con-", "一起", "prefix"], ["tin", "握住", "root"], ["-uous", "形容词", "suffix"]], def: "连续的（首尾相握，无缝隙）", ex: "continuous improvement" }
        ]
      },
      {
        meaning: "抓得极紧 → 坚韧、固守",
        gloss: "tenacious",
        note: "把「握住」推到极致就成了性格：死抓不放。这一层从物理动作变成了对人的评价。",
        words: [
          { w: "tenacious", parts: [["ten", "握住", "root"], ["-acious", "充满…的", "suffix"]], def: "坚韧的（死抓不放）", ex: "her tenacious pursuit of the truth" },
          { w: "tenet", parts: [["tenet", "他握住（拉丁语）", "root"]], def: "信条（被牢牢握住的原则）", ex: "a central tenet of the theory" },
          { w: "pertinent", parts: [["per-", "完全", "prefix"], ["tin", "握住", "root"], ["-ent", "形容词", "suffix"]], def: "切题的（死死扣住主题）", ex: "a pertinent question" }
        ]
      }
    ]
  },

  {
    id: "sist", kind: "root", form: "sist / sta / stit",
    meaning: "站立、使立定", gloss: "to stand",
    origin: "拉丁语 sistere / stare（站立）",
    related: ["per", "re"],
    senses: [
      {
        meaning: "站在什么方位",
        gloss: "to stand (a position)",
        note: "两只脚钉在地上，区别只在**站在哪个方位**。这是这个词根最核心的一层，四个词只差一个前缀。",
        words: [
          { w: "resist", parts: [["re-", "对抗", "prefix"], ["sist", "站立", "root"]], def: "抵抗（对着站，制造阻力）", ex: "I couldn't resist the cake." },
          { w: "insist", parts: [["in-", "在…之上", "prefix"], ["sist", "站立", "root"]], def: "坚持、咬定（站定在上面不退）", ex: "He insisted that he was innocent." },
          { w: "assist", parts: [["as-", "朝向（ad-）", "prefix"], ["sist", "站立", "root"]], def: "协助（站到旁边去）", ex: "She assisted him with the report." },
          { w: "consist", parts: [["con-", "一起", "prefix"], ["sist", "站立", "root"]], def: "由……组成（一起站着）", ex: "The team consists of six members." },
          { w: "persist", parts: [["per-", "贯穿", "prefix"], ["sist", "站立", "root"]], def: "持续、固执（一直站着不走）", ex: "The cold weather persists." }
        ]
      },
      {
        meaning: "使之立起来 → 建立、设立",
        gloss: "to set up",
        note: "从「自己站」变成「把东西立起来」。制度、机构、法条都是被「立」出来的。",
        words: [
          { w: "establish", parts: [["e-", "加强", "prefix"], ["stabl", "站稳", "root"], ["-ish", "动词", "suffix"]], def: "建立（使之站稳）", ex: "The firm was established in 1920." },
          { w: "institute", parts: [["in-", "在…之上", "prefix"], ["stitute", "立", "root"]], def: "设立；机构（立起来的东西）", ex: "They instituted new safety rules." },
          { w: "constitute", parts: [["con-", "一起", "prefix"], ["stitute", "立", "root"]], def: "构成（一起立成一个整体）", ex: "Women constitute 40% of the workforce." }
        ]
      },
      {
        meaning: "站着不动 → 静止、稳定",
        gloss: "still, stable",
        note: "「站」的另一面是「不走」。这一层强调状态而非动作。",
        words: [
          { w: "static", parts: [["sta", "站", "root"], ["-tic", "形容词", "suffix"]], def: "静止的、不变的", ex: "Sales have remained static." },
          { w: "stable", parts: [["sta", "站", "root"], ["-ble", "能够…的", "suffix"]], def: "稳定的（站得住的）", ex: "a stable relationship" },
          { w: "stationary", parts: [["sta", "站", "root"], ["-tionary", "形容词", "suffix"]], def: "固定不动的", ex: "The car was stationary at the lights." }
        ]
      }
    ]
  },

  {
    id: "vert", kind: "root", form: "vert / vers",
    meaning: "转、翻转", gloss: "to turn",
    origin: "拉丁语 vertere（转动）",
    related: ["per", "sub", "re"],
    senses: [
      {
        meaning: "转向某个方向",
        gloss: "to turn toward/away",
        note: "最基础的一层：改变朝向。往哪儿转由前缀决定——转开、转回、转到对面。",
        words: [
          { w: "avert", parts: [["a-", "离开（ab-）", "prefix"], ["vert", "转", "root"]], def: "转移（目光）、避免（把它转开）", ex: "She averted her eyes." },
          { w: "divert", parts: [["di-", "分开", "prefix"], ["vert", "转", "root"]], def: "转移、改道（转到别处去）", ex: "Traffic was diverted around the accident." },
          { w: "revert", parts: [["re-", "往回", "prefix"], ["vert", "转", "root"]], def: "恢复、回复（转回原状）", ex: "The land reverted to forest." }
        ]
      },
      {
        meaning: "彻底翻转 → 改变本质",
        gloss: "to turn over completely",
        note: "不是调个方向，而是整个翻过来。这一层的三个词力度递增：convert（换轨）→ pervert（掰弯）→ subvert（掀翻）。",
        words: [
          { w: "convert", parts: [["con-", "彻底地", "prefix"], ["vert", "转", "root"]], def: "转换、皈依（彻底转到另一套系统）", ex: "Convert USD into Euros." },
          { w: "pervert", parts: [["per-", "偏离", "prefix"], ["vert", "转", "root"]], def: "曲解、败坏（转到歪路上）", ex: "He perverted the course of justice." },
          { w: "subvert", parts: [["sub-", "从底部", "prefix"], ["vert", "转", "root"]], def: "颠覆（从底下掀翻）", ex: "a plot to subvert the government" }
        ]
      },
      {
        meaning: "转出来的不同样子 → 版本、多样",
        gloss: "version, variety",
        note: "同一个东西转个角度，就成了另一个版本。这一层解释了 version 和 diverse 为什么同源。",
        words: [
          { w: "version", parts: [["vers", "转", "root"], ["-ion", "名词", "suffix"]], def: "版本（转出来的一种样子）", ex: "the latest version of the app" },
          { w: "diverse", parts: [["di-", "分开", "prefix"], ["vers", "转", "root"]], def: "多样的（各自转向不同方向）", ex: "a diverse workforce" },
          { w: "versatile", parts: [["vers", "转", "root"], ["-atile", "形容词", "suffix"]], def: "多才多艺的、多功能的（能转成多种用途）", ex: "a versatile ingredient" }
        ]
      },
      {
        meaning: "注意力朝向内还是外 → 性格",
        gloss: "personality orientation",
        note: "把「转」用在心理能量的朝向上，就得到了内向和外向。这一层是心理学术语的来源。",
        words: [
          { w: "introvert", parts: [["intro-", "向内", "prefix"], ["vert", "转", "root"]], def: "内向的人（注意力转向内部）", ex: "He is a natural introvert." },
          { w: "extrovert", parts: [["extro-", "向外", "prefix"], ["vert", "转", "root"]], def: "外向的人（注意力转向外部）", ex: "Extroverts recharge around people." }
        ]
      }
    ]
  },

  {
    id: "per", kind: "prefix", form: "per-",
    meaning: "穿过、贯穿；彻底；偏离变坏；每、凭借；（化学）最高价",
    gloss: "through, thoroughly",
    origin: "拉丁语介词 per（穿过）",
    related: ["spect", "tain", "sist"],
    senses: [
      {
        meaning: "穿过、贯穿",
        gloss: "through, throughout",
        note: "物理原义：一根针从一头扎到另一头。空间上是穿透，时间上是贯穿始终。",
        words: [
          { w: "perspective", parts: [["per-", "穿过", "prefix"], ["spect", "看", "root"], ["-ive", "名词", "suffix"]], def: "视角、透视（穿过表象去看）", ex: "Try to see it from her perspective." },
          { w: "permeate", parts: [["per-", "穿过", "prefix"], ["meat", "穿行", "root"], ["-e", "动词", "suffix"]], def: "渗透、弥漫（穿行过去并充满）", ex: "The smell permeated the whole house." },
          { w: "pervade", parts: [["per-", "贯穿", "prefix"], ["vad", "走", "root"], ["-e", "动词", "suffix"]], def: "遍及（走遍每个角落）", ex: "A sense of dread pervaded the room." },
          { w: "permanent", parts: [["per-", "贯穿始终", "prefix"], ["man", "停留", "root"], ["-ent", "形容词", "suffix"]], def: "永久的（始终停留）", ex: "a permanent solution" },
          { w: "persist", parts: [["per-", "贯穿", "prefix"], ["sist", "站立", "root"]], def: "持续（一直站着不走）", ex: "The cold weather persists." }
        ]
      },
      {
        meaning: "彻底、完全",
        gloss: "thoroughly, completely",
        note: "把「穿透」用在动作上：不是做了，而是做到头了。这一层纯粹起强调作用，表示动作达到极点。",
        words: [
          { w: "perfect", parts: [["per-", "完全", "prefix"], ["fect", "做", "root"]], def: "完美的（彻底做完，无一遗漏）", ex: "Practice makes perfect." },
          { w: "persuade", parts: [["per-", "彻底", "prefix"], ["suad", "劝导", "root"], ["-e", "动词", "suffix"]], def: "说服（彻底劝导成功）", ex: "She persuaded him to stay." },
          { w: "perceive", parts: [["per-", "完全", "prefix"], ["ceive", "抓取", "root"]], def: "察觉、理解（彻底抓住信号）", ex: "I perceived a change in his tone." },
          { w: "pertinent", parts: [["per-", "完全", "prefix"], ["tin", "抓住", "root"], ["-ent", "形容词", "suffix"]], def: "切题的（死死扣住主题）", ex: "a pertinent question" },
          { w: "persevere", parts: [["per-", "贯穿", "prefix"], ["sever", "严酷", "root"]], def: "锲而不舍（彻底贯穿严酷环境）", ex: "She persevered in her research." }
        ]
      },
      {
        meaning: "偏离、走坏",
        gloss: "to destruction, astray",
        note: "较少见的贬义用法，源自「越过界限」的变体：穿过了头就是出界。这一层的词都指向毁灭或背离正道。",
        words: [
          { w: "perish", parts: [["per-", "偏离/毁坏", "prefix"], ["ish", "走（ire）", "root"]], def: "丧生、腐烂（走向毁灭）", ex: "Hundreds perished in the flood." },
          { w: "pervert", parts: [["per-", "偏离", "prefix"], ["vert", "转", "root"]], def: "曲解、败坏（转到歪路上）", ex: "He perverted the course of justice." },
          { w: "perfidious", parts: [["per-", "背离", "prefix"], ["fid", "信任", "root"], ["-ious", "形容词", "suffix"]], def: "背信弃义的（击穿信任）", ex: "a perfidious ally" }
        ]
      },
      {
        meaning: "每、凭借",
        gloss: "for each, by means of",
        note: "保留拉丁语介词的原始用法，没有发生隐喻投射，多见于固定搭配。",
        words: [
          { w: "percent", parts: [["per", "每", "prefix"], ["cent", "百", "root"]], def: "百分比（每一百份中的多少）", ex: "Only 3 percent responded." },
          { w: "perhaps", parts: [["per", "凭借", "prefix"], ["hap", "运气", "root"]], def: "也许（交由运气决定）", ex: "Perhaps he forgot." },
          { w: "per capita", parts: [["per", "每", "prefix"], ["capit", "头", "root"]], def: "人均（按人头分摊）", ex: "per capita income" }
        ]
      },
      {
        meaning: "（化学）最高价、过量",
        gloss: "highest oxidation state",
        note: "在化学命名法里，per- 表示某元素被推到可达的最高化合价，或含氧量超出常规——「穿过」在这里抽象成了「越过上限」。",
        words: [
          { w: "peroxide", parts: [["per-", "过量", "prefix"], ["oxide", "氧化物", "root"]], def: "过氧化物（氧原子多于常规）", ex: "hydrogen peroxide" },
          { w: "permanganate", parts: [["per-", "最高", "prefix"], ["manganate", "锰酸盐", "root"]], def: "高锰酸盐（锰为 +7 价）", ex: "potassium permanganate" }
        ]
      }
    ]
  },

  {
    id: "ex", kind: "prefix", form: "ex- / e- / ef-",
    meaning: "向外、出来；彻底；前任",
    gloss: "out of, from",
    origin: "拉丁语介词 ex（从……出来）",
    related: ["sub", "port", "vis"],
    senses: [
      {
        meaning: "从里面出来",
        gloss: "out of",
        note: "最字面的一层：exit 就是「出口」。看到 ex- 先想「从里面往外拿」——把根拔出来、把土掏出来、把人推到门外。",
        words: [
          { w: "eradicate", parts: [["e-", "向外", "prefix"], ["radic", "根", "root"], ["-ate", "动词", "suffix"]], def: "根除（把根拔出来）", ex: "Smallpox has been eradicated." },
          { w: "excavation", parts: [["ex-", "向外", "prefix"], ["cav", "挖空", "root"], ["-ation", "名词", "suffix"]], def: "挖掘、发掘（把土掏出来）", ex: "the excavation of a Roman villa" },
          { w: "exclusionary", parts: [["ex-", "向外", "prefix"], ["clus", "关闭", "root"], ["-ionary", "形容词", "suffix"]], def: "排斥性的（关在门外）", ex: "exclusionary zoning laws" },
          { w: "export", parts: [["ex-", "向外", "prefix"], ["port", "搬", "root"]], def: "出口（搬出去）", ex: "The country exports mainly grain." },
          { w: "eliminate", parts: [["e-", "向外", "prefix"], ["limin", "门槛", "root"], ["-ate", "动词", "suffix"]], def: "淘汰、排除（请到门槛之外）", ex: "The team was eliminated in the first round." }
        ]
      },
      {
        meaning: "露出来 → 明显、表达",
        gloss: "to bring out into view",
        note: "从「拿出来」引申为「显露出来」。藏在里面看不见，拿到外面就一目了然。",
        words: [
          { w: "evident", parts: [["e-", "向外", "prefix"], ["vid", "看见", "root"], ["-ent", "形容词", "suffix"]], def: "明显的（露在外面能看见）", ex: "It is evident that costs have risen." },
          { w: "express", parts: [["ex-", "向外", "prefix"], ["press", "压", "root"]], def: "表达（把内心的东西压出来）", ex: "He struggled to express his feelings." },
          { w: "exhibit", parts: [["ex-", "向外", "prefix"], ["hibit", "拿住", "root"]], def: "展出、显示（拿出来给人看）", ex: "The museum exhibits rare manuscripts." }
        ]
      },
      {
        meaning: "彻底、耗尽",
        gloss: "thoroughly, utterly",
        note: "把「掏出来」推到极限：里面的东西全被拿光了。这一层起强调作用。",
        words: [
          { w: "exhaust", parts: [["ex-", "彻底", "prefix"], ["haust", "汲取", "root"]], def: "耗尽、使精疲力竭（抽干为止）", ex: "We have exhausted every option." },
          { w: "exert", parts: [["ex-", "向外/彻底", "prefix"], ["ert", "推出", "root"]], def: "施加、发力（把能量全推出去）", ex: "The moon exerts a pull on the earth." }
        ]
      },
      {
        meaning: "前任、卸任",
        gloss: "former",
        note: "现代英语里独立出来的一层：已经「从这个身份里出来了」。通常带连字符。",
        words: [
          { w: "ex-president", parts: [["ex-", "前任", "prefix"], ["president", "总统", "root"]], def: "前总统", ex: "the ex-president's memoir" },
          { w: "ex-wife", parts: [["ex-", "前任", "prefix"], ["wife", "妻子", "root"]], def: "前妻", ex: "He still speaks to his ex-wife." }
        ]
      }
    ]
  },

  {
    id: "sub", kind: "prefix", form: "sub- / sup- / sus- / suc-",
    meaning: "在下面；从底部；次一级；稍微",
    gloss: "under, below",
    origin: "拉丁语 sub（在……之下）",
    related: ["ex", "port", "ject", "vert"],
    senses: [
      {
        meaning: "在下面托着",
        gloss: "underneath, supporting",
        note: "submarine 是「在海面之下」。这一层的下方是**支撑方**——在底下托着，让上面的不塌。",
        words: [
          { w: "support", parts: [["sup-", "在下面", "prefix"], ["port", "承载", "root"]], def: "支撑、支持（从下面托着）", ex: "The evidence supports this conclusion." },
          { w: "sustain", parts: [["sus-", "从下面", "prefix"], ["tain", "握住", "root"]], def: "维持、支撑（托住不让塌）", ex: "The economy sustained steady growth." },
          { w: "substance", parts: [["sub-", "在下面", "prefix"], ["stance", "站立", "root"]], def: "实质、物质（站在底下的东西）", ex: "an argument with real substance" }
        ]
      },
      {
        meaning: "被压在下面 → 服从",
        gloss: "subordinate to",
        note: "同样是「在下面」，这一层的下方是**受支配方**——被压着、被管着、要低头。",
        words: [
          { w: "subject", parts: [["sub-", "在下面", "prefix"], ["ject", "投掷", "root"]], def: "使服从；臣民（被扔在下面）", ex: "The plan is subject to approval." },
          { w: "submit", parts: [["sub-", "在下面", "prefix"], ["mit", "投递", "root"]], def: "提交、屈服（由下向上呈递）", ex: "Please submit your application." },
          { w: "subordinate", parts: [["sub-", "在下面", "prefix"], ["ordin", "次序", "root"], ["-ate", "形容词", "suffix"]], def: "下级的、从属的", ex: "a subordinate clause" }
        ]
      },
      {
        meaning: "从底部动手 → 暗中",
        gloss: "from below, secretly",
        note: "在地面之下做的事看不见。这一层带有隐秘和破坏的意味。",
        words: [
          { w: "subvert", parts: [["sub-", "从底部", "prefix"], ["vert", "翻转", "root"]], def: "颠覆（掏空地基再掀翻）", ex: "a plot to subvert the government" },
          { w: "subterfuge", parts: [["sub-", "在下面", "prefix"], ["terfuge", "逃避", "root"]], def: "诡计、托词（暗地里绕过去）", ex: "They obtained the data by subterfuge." }
        ]
      },
      {
        meaning: "次一级、亚",
        gloss: "sub-, secondary",
        note: "现代英语里最能产的一层：直接加在名词前，表示「大类下面的小类」，或「达不到标准」。",
        words: [
          { w: "subset", parts: [["sub-", "次一级", "prefix"], ["set", "集合", "root"]], def: "子集", ex: "a subset of the population" },
          { w: "subtitle", parts: [["sub-", "在下面", "prefix"], ["title", "标题", "root"]], def: "字幕、副标题", ex: "Turn on the subtitles." },
          { w: "substandard", parts: [["sub-", "低于", "prefix"], ["standard", "标准", "root"]], def: "不合标准的", ex: "substandard housing" }
        ]
      }
    ]
  },

  {
    id: "re", kind: "prefix", form: "re-",
    meaning: "回、向后；再一次；反向对抗；加强",
    gloss: "back, again, against",
    origin: "拉丁语 re-",
    related: ["sist", "vert", "spect"],
    senses: [
      {
        meaning: "往回、向后",
        gloss: "back",
        note: "动作的方向掉头。判断依据：词根本身是不是一个「移动」动作——是，就往回走。",
        words: [
          { w: "reject", parts: [["re-", "往回", "prefix"], ["ject", "扔", "root"]], def: "拒绝（扔回去）", ex: "The journal rejected the paper." },
          { w: "retain", parts: [["re-", "往回", "prefix"], ["tain", "握住", "root"]], def: "保留（往回拉住不让走）", ex: "The company struggles to retain talent." },
          { w: "retrospect", parts: [["retro-", "向后", "prefix"], ["spect", "看", "root"]], def: "回顾（向后看）", ex: "In retrospect, it was premature." },
          { w: "revert", parts: [["re-", "往回", "prefix"], ["vert", "转", "root"]], def: "恢复原状（转回去）", ex: "The land reverted to forest." }
        ]
      },
      {
        meaning: "再一次",
        gloss: "again",
        note: "同一个动作重做一遍。这一层在现代英语里极其能产，几乎可以加在任何动词前面。",
        words: [
          { w: "revise", parts: [["re-", "再", "prefix"], ["vis", "看", "root"]], def: "修订（再看一遍）", ex: "I revised the draft three times." },
          { w: "re-enact", parts: [["re-", "再", "prefix"], ["enact", "上演", "root"]], def: "重演", ex: "They will re-enact the battle." },
          { w: "renew", parts: [["re-", "再", "prefix"], ["new", "新", "root"]], def: "续期、更新（再变新一次）", ex: "I need to renew my passport." }
        ]
      },
      {
        meaning: "反向、对抗",
        gloss: "against",
        note: "不是回到原处，而是**顶着来的那股力**。这一层的词根多半是「站」「推」「滚」这类有受力方向的动作。",
        words: [
          { w: "resist", parts: [["re-", "对抗", "prefix"], ["sist", "站立", "root"]], def: "抵抗（对着站，制造阻力）", ex: "He resisted arrest." },
          { w: "revolt", parts: [["re-", "反向", "prefix"], ["volt", "滚动", "root"]], def: "起义（反向翻滚上来）", ex: "The slaves revolted against their masters." },
          { w: "repel", parts: [["re-", "反向", "prefix"], ["pel", "推", "root"]], def: "击退、排斥（推回去）", ex: "The coating repels water." }
        ]
      },
      {
        meaning: "加强语气",
        gloss: "intensifier",
        note: "既不表示回也不表示再，只是把动作说得更重。这一层最不好辨认，通常要靠词源才能确认。",
        words: [
          { w: "reside", parts: [["re-", "加强", "prefix"], ["sid", "坐", "root"], ["-e", "动词", "suffix"]], def: "定居、存在于（稳稳坐定）", ex: "Executive power resides in the President." },
          { w: "regard", parts: [["re-", "持续地", "prefix"], ["gard", "注视", "root"]], def: "注视、看作、尊重", ex: "I regard him as my best friend." },
          { w: "research", parts: [["re-", "加强", "prefix"], ["search", "搜寻", "root"]], def: "研究（反复深入地搜寻）", ex: "She researches climate policy." }
        ]
      }
    ]
  },

  {
    id: "dis", kind: "prefix", form: "dis- / di- / dif-",
    meaning: "否定、相反；分开；去除",
    gloss: "apart, away, not",
    origin: "拉丁语 dis-（分开）",
    related: ["re", "ex"],
    senses: [
      {
        meaning: "取消已有的动作",
        gloss: "to undo",
        note: "它是一个**取消键**：不是简单加个「不」，而是把那个动作反着做一遍。cover（遮盖）取消掉＝把盖子扯下来。",
        words: [
          { w: "discover", parts: [["dis-", "去除", "prefix"], ["cover", "遮盖", "root"]], def: "发现（把遮盖物扯掉）", ex: "They discovered his secret." },
          { w: "disregard", parts: [["dis-", "剥离", "prefix"], ["regard", "注视/重视", "root"]], def: "漠视（主动把目光和重量撤走）", ex: "Please disregard my last email." },
          { w: "disarm", parts: [["dis-", "去除", "prefix"], ["arm", "武装", "root"]], def: "解除武装", ex: "The rebels agreed to disarm." }
        ]
      },
      {
        meaning: "分开、散开",
        gloss: "apart",
        note: "原始的空间义：把聚在一起的东西拆散、推开、撒出去。",
        words: [
          { w: "distract", parts: [["dis-", "分开", "prefix"], ["tract", "拉", "root"]], def: "分心（把注意力拉走）", ex: "Don't distract me while I'm driving." },
          { w: "disperse", parts: [["di-", "分开", "prefix"], ["sperse", "撒", "root"]], def: "驱散、散开", ex: "Police dispersed the crowd." },
          { w: "distribute", parts: [["dis-", "分开", "prefix"], ["tribute", "分配", "root"]], def: "分发（分开送到各处）", ex: "They distributed food to the villages." },
          { w: "diverse", parts: [["di-", "分开", "prefix"], ["vers", "转", "root"]], def: "多样的（各自转向不同方向）", ex: "a diverse workforce" }
        ]
      },
      {
        meaning: "单纯的否定",
        gloss: "not",
        note: "接在形容词或名词前，只表示「不是、缺乏」，不含「拆开」的动作感。",
        words: [
          { w: "dishonest", parts: [["dis-", "否定", "prefix"], ["honest", "诚实", "root"]], def: "不诚实的", ex: "a dishonest answer" },
          { w: "disadvantage", parts: [["dis-", "否定", "prefix"], ["advantage", "优势", "root"]], def: "劣势", ex: "at a competitive disadvantage" }
        ]
      }
    ]
  },

  {
    id: "en", kind: "prefix", form: "en- / em- / in-",
    meaning: "使成为；使进入；赋予",
    gloss: "to put into, to cause to be",
    origin: "拉丁语 in-，经古法语进入英语",
    related: ["able", "tion"],
    senses: [
      {
        meaning: "使成为、使具备",
        gloss: "to cause to be",
        note: "一个**动词化开关**：给名词或形容词装上它，就变成「使之成为」。title（头衔）→ entitle（赋予权利）。",
        words: [
          { w: "enact", parts: [["en-", "使成为", "prefix"], ["act", "法令/行动", "root"]], def: "颁布、上演（给文本注入效力）", ex: "The government enacted a new tax law." },
          { w: "entitle", parts: [["en-", "赋予", "prefix"], ["title", "头衔/法定权利", "root"]], def: "赋予权利、题名", ex: "This ticket entitles you to a free meal." },
          { w: "empower", parts: [["em-", "赋予", "prefix"], ["power", "力量", "root"]], def: "赋能、授权（注入力量）", ex: "Education empowers people." },
          { w: "enable", parts: [["en-", "使具备", "prefix"], ["able", "能够", "root"]], def: "使能够", ex: "The grant enabled her to finish the study." }
        ]
      },
      {
        meaning: "使进入、围起来",
        gloss: "to put into, to surround",
        note: "保留了 in-「在里面」的空间义：把某物装进去，或用某物把它围住。",
        words: [
          { w: "enclose", parts: [["en-", "使进入", "prefix"], ["close", "关闭", "root"]], def: "围住；随信附上（装进去）", ex: "Please find the receipt enclosed." },
          { w: "embrace", parts: [["em-", "使进入", "prefix"], ["brace", "手臂", "root"]], def: "拥抱；欣然接受（用手臂围住）", ex: "She embraced the new approach." },
          { w: "encircle", parts: [["en-", "使进入", "prefix"], ["circle", "圆圈", "root"]], def: "环绕", ex: "Mountains encircle the valley." }
        ]
      }
    ]
  },

  {
    id: "pre", kind: "prefix", form: "pre-",
    meaning: "在……之前（时间、位置、预备）",
    gloss: "before",
    origin: "拉丁语 prae-",
    related: ["com", "per"],
    senses: [
      {
        meaning: "时间上更早",
        gloss: "earlier in time",
        note: "最常见的一层：事情还没到那个点。易混提醒：pre- 是「之前」，pro- 是「向前／代表」。",
        words: [
          { w: "premature", parts: [["pre-", "提前", "prefix"], ["mature", "成熟", "root"]], def: "过早的、时机未到的", ex: "It is premature to draw conclusions." },
          { w: "precedent", parts: [["pre-", "之前", "prefix"], ["ced", "走", "root"], ["-ent", "名词", "suffix"]], def: "先例（走在前面的事）", ex: "The ruling set an important precedent." },
          { w: "preconception", parts: [["pre-", "之前", "prefix"], ["concept", "观念", "root"], ["-ion", "名词", "suffix"]], def: "先入之见", ex: "Set aside your preconceptions." }
        ]
      },
      {
        meaning: "次序或位置在前",
        gloss: "in front, first in order",
        note: "不是时间早，而是**排在前面**——书的前言、句子的前缀、队伍的前头。",
        words: [
          { w: "preface", parts: [["pre-", "在前", "prefix"], ["face", "说（fari）", "root"]], def: "序言（正文之前说的话）", ex: "He explains his method in the preface." },
          { w: "prefix", parts: [["pre-", "在前", "prefix"], ["fix", "固定", "root"]], def: "前缀（固定在前面的部分）", ex: "The prefix 'un-' means 'not'." },
          { w: "precede", parts: [["pre-", "在前", "prefix"], ["cede", "走", "root"]], def: "先于、走在前面", ex: "A short film preceded the feature." }
        ]
      },
      {
        meaning: "预先做好",
        gloss: "beforehand, in advance",
        note: "这一层带有「为将来做准备」的目的性：不只是发生得早，而是**为了后面而先做**。",
        words: [
          { w: "prerequisite", parts: [["pre-", "预先", "prefix"], ["requisite", "必需之物", "root"]], def: "先决条件", ex: "Calculus is a prerequisite for this course." },
          { w: "prepare", parts: [["pre-", "预先", "prefix"], ["pare", "备好", "root"]], def: "准备", ex: "Prepare the ingredients first." },
          { w: "prevent", parts: [["pre-", "预先", "prefix"], ["vent", "来", "root"]], def: "预防（抢在它来之前挡住）", ex: "Regular checks prevent failures." }
        ]
      }
    ]
  },

  {
    id: "com", kind: "prefix", form: "com- / con- / co- / col- / cor-",
    meaning: "共同、一起；相互；完全（加强）",
    gloss: "together, with",
    origin: "拉丁语 cum（与）",
    related: ["pre", "sub"],
    senses: [
      {
        meaning: "共同、一起",
        gloss: "together",
        note: "本义。拼写会随后一个字母同化：con+labor→collaborate，con+respond→correspond。看到 co 开头先想「一起」。",
        words: [
          { w: "collaborate", parts: [["col-", "一起", "prefix"], ["labor", "劳动", "root"], ["-ate", "动词", "suffix"]], def: "协作（一起劳动）", ex: "The two labs collaborated on the study." },
          { w: "consensus", parts: [["con-", "一起", "prefix"], ["sens", "感觉", "root"]], def: "共识（一起感受）", ex: "There is broad consensus on this point." },
          { w: "consist", parts: [["con-", "一起", "prefix"], ["sist", "站立", "root"]], def: "由……组成（一起站着）", ex: "The team consists of six members." },
          { w: "contain", parts: [["con-", "一起", "prefix"], ["tain", "握住", "root"]], def: "容纳（一起握在里面）", ex: "The box contains old letters." }
        ]
      },
      {
        meaning: "相互、彼此",
        gloss: "mutually",
        note: "「一起」的一个分支：不只是同时做，而是**两边对着做**。这一层常出现在比较和往来的语境里。",
        words: [
          { w: "correspond", parts: [["cor-", "相互", "prefix"], ["respond", "回应", "root"]], def: "通信；相符（互相回应）", ex: "The two accounts do not correspond." },
          { w: "compare", parts: [["com-", "相互", "prefix"], ["pare", "同等", "root"]], def: "比较（把两者放在一起看）", ex: "Compare the two versions." },
          { w: "compatible", parts: [["com-", "一起", "prefix"], ["pat", "忍受", "root"], ["-ible", "可…的", "suffix"]], def: "兼容的（能一起相处）", ex: "The app is compatible with older phones." }
        ]
      },
      {
        meaning: "完全、彻底（加强语气）",
        gloss: "completely",
        note: "这一层里 com- 已经不表示「一起」了，只是把动作说满。convert 不是「一起转」，而是「彻底转过去」。",
        words: [
          { w: "convert", parts: [["con-", "彻底地", "prefix"], ["vert", "转", "root"]], def: "转换、皈依（彻底转过去）", ex: "Convert USD into Euros." },
          { w: "commit", parts: [["com-", "彻底", "prefix"], ["mit", "投递", "root"]], def: "提交、投入（不可逆地交出去）", ex: "He is fully committed to his studies." },
          { w: "consider", parts: [["con-", "彻底", "prefix"], ["sider", "星辰", "root"]], def: "深思、认定（把星象看透）", ex: "I will consider your offer." },
          { w: "conspicuous", parts: [["con-", "加强语气", "prefix"], ["spic", "看", "root"], ["-uous", "形容词", "suffix"]], def: "显眼的（谁都看得见）", ex: "His absence was conspicuous." }
        ]
      }
    ]
  },

  {
    id: "able", kind: "suffix", form: "-able / -ible",
    meaning: "能够…的；值得…的；有…性质的",
    gloss: "capable of, worthy of",
    origin: "拉丁语 -abilis / -ibilis",
    related: ["tion", "en"],
    senses: [
      {
        meaning: "能够被……的（被动）",
        gloss: "can be …-ed",
        note: "最主流的一层，隐含被动：readable＝能被读的。拼写规律：接完整英语单词多用 **-able**（acceptable），接拉丁词根残片多用 **-ible**（visible、credible、audible）。不确定时先试 -able。",
        words: [
          { w: "visible", parts: [["vis", "看见", "root"], ["-ible", "能被…的", "suffix"]], def: "可见的（能被看见）", ex: "The stars are barely visible." },
          { w: "portable", parts: [["port", "搬", "root"], ["-able", "能被…的", "suffix"]], def: "便携的（能被搬动）", ex: "a portable charger" },
          { w: "negligible", parts: [["neglig", "忽视", "root"], ["-ible", "能被…的", "suffix"]], def: "微不足道的（可被忽略）", ex: "The difference is negligible." },
          { w: "accessible", parts: [["access", "接近", "root"], ["-ible", "能被…的", "suffix"]], def: "可及的、易懂的", ex: "She makes complex ideas accessible." }
        ]
      },
      {
        meaning: "值得……的",
        gloss: "worthy of",
        note: "不是「能不能」，而是「配不配」。这一层带有评价色彩。",
        words: [
          { w: "respectable", parts: [["respect", "尊敬", "root"], ["-able", "值得…的", "suffix"]], def: "值得尊敬的、体面的", ex: "a respectable income" },
          { w: "admirable", parts: [["admir", "钦佩", "root"], ["-able", "值得…的", "suffix"]], def: "令人钦佩的", ex: "an admirable effort" }
        ]
      },
      {
        meaning: "具有……性质的",
        gloss: "characterised by",
        note: "既非被动也非「值得」，只是描述属性。这一层里的词往往已经词汇化，看不出原来的动词。",
        words: [
          { w: "sustainable", parts: [["sustain", "维持", "root"], ["-able", "有…性质的", "suffix"]], def: "可持续的", ex: "sustainable development" },
          { w: "inevitable", parts: [["in-", "否定", "prefix"], ["evit", "避免", "root"], ["-able", "有…性质的", "suffix"]], def: "不可避免的", ex: "Conflict was inevitable." },
          { w: "reasonable", parts: [["reason", "道理", "root"], ["-able", "有…性质的", "suffix"]], def: "合情合理的", ex: "The price is quite reasonable." }
        ]
      }
    ]
  },

  {
    id: "tion", kind: "suffix", form: "-tion / -sion / -ment",
    meaning: "把动作变成名词：行为、结果或状态",
    gloss: "act, result, or state of",
    origin: "拉丁语 -tio",
    related: ["able", "en"],
    senses: [
      {
        meaning: "动作本身（行为、过程）",
        gloss: "the act of …",
        note: "写作提示：中文爱用动词，英文书面语爱用名词化。「政府实施了改革」升级成 the government's implementation of the reform，语域立刻提高——但别堆砌，一句一个足够。",
        words: [
          { w: "implementation", parts: [["implement", "实施", "root"], ["-ation", "名词", "suffix"]], def: "实施（这个动作）", ex: "the implementation of the policy" },
          { w: "excavation", parts: [["ex-", "向外", "prefix"], ["cav", "挖空", "root"], ["-ation", "名词", "suffix"]], def: "挖掘（这项工程）", ex: "The excavation took two years." },
          { w: "acquisition", parts: [["acquis", "获得", "root"], ["-ition", "名词", "suffix"]], def: "获得；（语言）习得", ex: "second language acquisition" }
        ]
      },
      {
        meaning: "动作的产物（结果、成品）",
        gloss: "the thing produced",
        note: "同一个后缀，重心从「做」挪到「做出来的东西」。很多词两义兼有，靠语境区分：construction 既是「施工」也是「建筑物」。",
        words: [
          { w: "invention", parts: [["invent", "发明", "root"], ["-ion", "名词", "suffix"]], def: "发明物（发明出来的东西）", ex: "The telephone was a revolutionary invention." },
          { w: "construction", parts: [["construct", "建造", "root"], ["-ion", "名词", "suffix"]], def: "施工；建筑物", ex: "a steel-frame construction" },
          { w: "provision", parts: [["provis", "提供", "root"], ["-ion", "名词", "suffix"]], def: "供给；（合同）条款", ex: "the provision of public services" }
        ]
      },
      {
        meaning: "状态或性质",
        gloss: "the state of being",
        note: "不指动作也不指产物，而是**处在什么状态里**。-ment 尤其常落在这一层。",
        words: [
          { w: "commitment", parts: [["commit", "承诺", "root"], ["-ment", "名词", "suffix"]], def: "承诺、投入（一种持续状态）", ex: "a long-term commitment to reform" },
          { w: "satisfaction", parts: [["satisfact", "满足", "root"], ["-ion", "名词", "suffix"]], def: "满意（一种状态）", ex: "customer satisfaction" }
        ]
      }
    ]
  }

];
