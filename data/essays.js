/* ============================================================
   范文解析  —  data/essays.js

   分类字段（决定它在页面上怎么被筛选和分组）：
     exam  考试：考研英语一 / 考研英语二 / 雅思 / 四六级 / 其他
     year  真题年份，数字；不是真题就写 null
     part  题型：大作文 / 小作文 / Task 1 / Task 2 …
     topic 主题：社会 / 教育 / 环境 / 文化 / 科技 …

   notes[].mark 必须是 text 里【一字不差】出现的片段，页面会自动高亮并挂上批注。
   追加方式：往 DB.essays 数组里再加一个对象即可。
   ============================================================ */
window.DB = window.DB || {};
DB.essays = [
  {
    id: "e001",
    title: "大学的功能：就业技能还是知识本身",
    exam: "雅思",
    year: null,
    part: "Task 2",
    topic: "教育",
    genre: "议论文 · 讨论双方观点",
    level: "7.5 分档",
    words: 292,
    prompt: "Some people believe that universities should provide graduates with the knowledge and skills needed in the workplace. Others think that the true function of a university should be to give access to knowledge for its own sake. Discuss both views and give your own opinion.",
    outline: [
      { label: "第 1 段 · 引入", purpose: "改写题目 + 亮出自己立场（不要拖到结尾才表态）" },
      { label: "第 2 段 · 观点 A", purpose: "承认就业导向的合理性，给出经济与个人两层理由" },
      { label: "第 3 段 · 观点 B", purpose: "论证纯粹求知的价值，用“不可预测性”这一角度而非空谈情怀" },
      { label: "第 4 段 · 我的立场", purpose: "不和稀泥：提出二者并非对立，给出可操作的整合方式" },
      { label: "第 5 段 · 结尾", purpose: "把问题从“选哪个”升格为“如何配比”" }
    ],
    paragraphs: [
      {
        role: "引入段",
        text: "Universities have long been pulled in two directions: one camp insists that they equip students for the labour market, while another maintains that knowledge deserves to be pursued for its own sake. Although vocational relevance is a legitimate demand in an era of costly tuition, I would argue that a university which abandons disinterested inquiry ultimately fails even at job preparation.",
        notes: [
          { mark: "have long been pulled in two directions", note: "不要用 There is a debate about... 这类空话开头。这里用一个有画面感的比喻（被两股力量拉扯）直接建立张力。" },
          { mark: "one camp insists that", note: "one camp ... another maintains 是改写“有人认为／另一些人认为”的高级替换，避免 Some people think 的模板腔。" },
          { mark: "Although vocational relevance is a legitimate demand", note: "先让步、承认对方合理，再转折立论。让步必须给得真诚，否则后面的反驳显得轻飘。" },
          { mark: "ultimately fails even at job preparation", note: "全文最聪明的一句：不否定就业目标，而是论证“纯粹求知恰恰更能实现就业目标”。把对立转成了包含关系，立意立刻高一档。" }
        ],
        analysis: "四句话完成三件事：重述题目、给出让步、亮明立场。注意立场句用 I would argue that 而非 I think，语气更审慎也更学术。"
      },
      {
        role: "观点 A · 就业导向",
        text: "The case for employability is not difficult to make. Higher education now represents a substantial financial burden for most families, and it is entirely reasonable for students to expect a measurable return on that investment. Degrees in nursing, engineering and accountancy owe their value precisely to the specific competencies they certify. A graduate who cannot translate three years of study into any marketable capability has, in a very practical sense, been let down by the institution.",
        notes: [
          { mark: "The case for employability is not difficult to make.", note: "the case for X 起段，比 Firstly, there are many advantages 紧凑得多。这一句同时充当主题句和过渡句。" },
          { mark: "a measurable return on that investment", note: "把抽象的“值不值”具体成经济学词汇 return on investment，用词精准是拿高分的关键。" },
          { mark: "owe their value precisely to", note: "owe A to B＝A 归功于 B。加 precisely 使因果更锋利。" },
          { mark: "has, in a very practical sense, been let down by the institution", note: "插入语 in a very practical sense 限定了断言的范围，避免绝对化；同时句式变化打破了单调的主谓宾节奏。" }
        ],
        analysis: "论证走的是“成本—回报”这条最硬的线，并落到 nursing / engineering / accountancy 三个具体专业。抽象论点必须落到具体名词上，否则说服力为零。"
      },
      {
        role: "观点 B · 求知本身",
        text: "Yet an exclusively utilitarian curriculum rests on a shaky assumption: that we can foresee which skills will matter. History suggests otherwise. Many of the competencies most prized today—data interpretation, cross-cultural communication, ethical reasoning about technology—were nowhere on any syllabus a generation ago. What survives such churn is not any particular technique but the trained capacity to read closely, weigh evidence and reason under uncertainty, and these are cultivated most reliably by subjects that answer to no immediate employer.",
        notes: [
          { mark: "rests on a shaky assumption", note: "驳论的标准打法：不正面否定结论，而是拆掉对方的隐含前提。rest on＝建立在……之上。" },
          { mark: "History suggests otherwise.", note: "三个词的短句，夹在两个长句之间。长短交错是英文节奏感的来源，中国学生的作文往往全是等长句。" },
          { mark: "were nowhere on any syllabus a generation ago", note: "用具体的时间对照（一代人之前）把抽象论断落地，比写 in the past 有力得多。" },
          { mark: "answer to no immediate employer", note: "answer to sb.＝对某人负责。这个说法比 not related to jobs 优雅，也更准确地表达了“学术自由”的含义。" }
        ],
        analysis: "这段的价值在于换了角度：不谈情怀，谈“未来不可预测”。凡是能把价值论证转成风险论证的，说服力都会上一个台阶。"
      },
      {
        role: "我的立场",
        text: "The opposition, in my view, is largely false. The most employable graduates I have encountered are not those who memorised the software of the moment, but those who learned how to learn and could therefore pick up the next tool in a fortnight. A sensible university therefore does both: it teaches transferable habits of mind through demanding academic work, and it attaches to that core a thin, deliberately updatable layer of professional training—internships, industry projects, technical certification.",
        notes: [
          { mark: "The opposition, in my view, is largely false.", note: "整合型立场的关键句。加 largely 而非 completely，保留分寸，符合学术写作的审慎语气。" },
          { mark: "not those who memorised the software of the moment, but those who learned how to learn", note: "not A but B 平行结构，形式对称让对比一目了然。the software of the moment（当下流行的软件）用词讥诮而不失体面。" },
          { mark: "a thin, deliberately updatable layer", note: "形容词选得极准：thin（薄）+ updatable（可更新），把“职业培训应当轻量且随时可换”这层意思压进了三个词里。" },
          { mark: "internships, industry projects, technical certification", note: "破折号后三项并列收尾，给抽象方案一个具体着陆点。这是把 7 分作文推到 7.5 的细节。" }
        ],
        analysis: "很多考生在这一段和稀泥（both are important），失分点就在没给出“怎么结合”。这里给了明确的结构：厚的通识内核 + 薄的可替换外层。"
      },
      {
        role: "结尾段",
        text: "The question, then, is not whether universities should serve the economy or the intellect, but in what proportion and in what order. Get the sequence right—rigorous thinking first, marketable technique second—and the two purposes cease to compete.",
        notes: [
          { mark: "The question, then, is not whether", note: "呼应开头的张力，把二选一改写成“配比与次序”问题。这是结尾升华最稳的一种写法。" },
          { mark: "Get the sequence right", note: "祈使句开头 + 破折号插入，节奏明快，避免了结尾段常见的疲软。" },
          { mark: "cease to compete", note: "cease to do 比 stop doing 正式。收尾干净利落，不再堆砌新信息。" }
        ],
        analysis: "两句话结尾，不复述全文。好的结尾是给出一个新的看问题的角度，而不是把前面的话再说一遍。"
      }
    ],
    highlights: [
      { en: "rests on a shaky assumption", zh: "建立在一个站不住脚的前提上", why: "驳论万能句，攻击前提而非结论。" },
      { en: "a measurable return on that investment", zh: "可衡量的投资回报", why: "教育、医疗、公共政策类话题通用。" },
      { en: "the trained capacity to read closely, weigh evidence and reason under uncertainty", zh: "细读文本、权衡证据、在不确定中推理的受训能力", why: "三项并列定义“素养”，可直接迁移到任何教育类题目。" },
      { en: "answer to no immediate employer", zh: "不必对任何直接雇主负责", why: "描述基础研究、纯艺术、人文学科的价值时好用。" },
      { en: "not whether ... but in what proportion and in what order", zh: "不在于是否……，而在于以何种比例、何种次序", why: "结尾升华模板，适用于一切“两难取舍”题。" }
    ],
    takeaway: "这篇的核心技巧只有一个：把“二选一”重构成“包含关系或配比关系”。凡是 Discuss both views 的题，谁能证明双方的对立是假的，谁的立意就最高。"
  },

  {
    id: "e002",
    title: "图表描述：某国四种能源发电占比的变化",
    exam: "雅思",
    year: null,
    part: "Task 1",
    topic: "环境",
    genre: "图表作文 · 趋势描述",
    level: "7 分档",
    words: 176,
    prompt: "The chart below shows the percentage of electricity generated from four sources in one country between 2000 and 2024. Summarise the information by selecting and reporting the main features.",
    outline: [
      { label: "第 1 段 · 改写题目", purpose: "换词改写，绝不照抄原题" },
      { label: "第 2 段 · 总体概述", purpose: "两句话点出最大趋势和格局反转——这是评分的关键项" },
      { label: "第 3–4 段 · 分组细节", purpose: "上升的一组、下降的一组，分开写，配具体数据" }
    ],
    paragraphs: [
      {
        role: "改写题目",
        text: "The chart illustrates how four sources contributed to national electricity generation over a twenty-four-year period from 2000 to 2024.",
        notes: [
          { mark: "illustrates how four sources contributed to", note: "shows→illustrates，the percentage of electricity generated from→how sources contributed to。改写要换结构，不能只换同义词。" },
          { mark: "over a twenty-four-year period", note: "把 between 2000 and 2024 换算成时间跨度，是最省力的改写手法。" }
        ],
        analysis: "一句话足够。Task 1 的开头段写长了是浪费字数。"
      },
      {
        role: "总体概述",
        text: "Overall, the period saw a decisive shift away from coal towards renewables, with the two exchanging positions around 2016. Nuclear power, by contrast, remained broadly stable throughout, while natural gas rose sharply before tapering off in the final years.",
        notes: [
          { mark: "Overall,", note: "概述段必须有 Overall 或 In general 领起——没有独立的概述段，分数很难上 6。" },
          { mark: "a decisive shift away from coal towards renewables", note: "一句话概括全局趋势。shift away from A towards B 是趋势类图表的万能骨架。" },
          { mark: "with the two exchanging positions around 2016", note: "with 独立结构补充交叉点。识别并写出“反超时刻”是拉分点。" },
          { mark: "remained broadly stable", note: "broadly 是模糊限定词，比写 remained stable 更贴合真实数据的小幅波动。" },
          { mark: "before tapering off", note: "taper off＝逐渐减弱。比 then decreased 精确，描述“先升后缓降”极好用。" }
        ],
        analysis: "概述段不写任何具体数字，只写趋势和格局——这是 Task 1 最容易被忽略的规则。"
      },
      {
        role: "细节 · 上升组",
        text: "Renewables accounted for a mere 6% of output in 2000 but climbed steadily thereafter, overtaking gas in 2016 and reaching 41% by 2024—a nearly sevenfold increase. Gas followed a less dramatic path, rising from 18% to a peak of 33% in 2018 before settling at around 28%.",
        notes: [
          { mark: "accounted for a mere 6%", note: "account for＝占比，Task 1 核心搭配。a mere 6% 里的 mere 带出“少得可怜”的评价，比干巴巴的 only 生动。" },
          { mark: "climbed steadily thereafter", note: "动词 + 副词的搭配（幅度＋速度）是选词的核心。climbed steadily／rose sharply／edged up 要分清。" },
          { mark: "a nearly sevenfold increase", note: "倍数表达：sevenfold 作形容词，不要写成 seven times increase。这类表达在考场上极为亮眼。" },
          { mark: "before settling at around 28%", note: "settle at＝稳定在某水平。三个动词 rising / peak / settling 串起一条完整曲线。" }
        ],
        analysis: "每个数据点都绑定了年份，且用破折号补充倍数关系。数据不是罗列，而是服务于趋势描述。"
      },
      {
        role: "细节 · 下降与持平组",
        text: "Coal moved in precisely the opposite direction, shrinking from a dominant 52% to just 15%. Nuclear, meanwhile, was the only source to show no meaningful change, hovering between 15% and 18% across the entire period.",
        notes: [
          { mark: "moved in precisely the opposite direction", note: "对比衔接句，避免了机械的 On the other hand。" },
          { mark: "shrinking from a dominant 52% to just 15%", note: "dominant 一词点出 2000 年煤炭的统治地位，用形容词承载评价而不额外加句子。" },
          { mark: "hovering between 15% and 18%", note: "hover between＝在区间内小幅波动，是描述“基本持平”的最佳动词。" }
        ],
        analysis: "把下降组和持平组合并成一段，结构更紧凑。Task 1 的段落划分应按“数据行为”分组，而不是按数据条数分。"
      }
    ],
    highlights: [
      { en: "a decisive shift away from A towards B", zh: "从 A 向 B 的决定性转变", why: "趋势类图表的概述句骨架。" },
      { en: "account for / make up X% of", zh: "占 X%", why: "占比表达的第一选择，不要用 occupy。" },
      { en: "climb steadily / rise sharply / edge up / taper off / hover between", zh: "稳步攀升／急剧上升／微升／逐渐减弱／小幅波动", why: "五个动词覆盖绝大多数曲线形态。" },
      { en: "a nearly sevenfold increase", zh: "近七倍的增长", why: "倍数表达，注意 -fold 是形容词。" }
    ],
    takeaway: "Task 1 拿分的顺序是：独立概述段 ＞ 数据准确 ＞ 词汇花哨。先保证有 Overall 段并写对整体格局，再考虑用词升级。"
  }
];
