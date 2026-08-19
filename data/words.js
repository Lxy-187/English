/* ============================================================
   单词剖析  —  data/words.js

   这个板块回答的不是「这个词翻译成什么」，而是：
     它描绘的是什么场景/动作/状态？为什么同一个词能长出这么多中文释义？

   字段：
     id        唯一 id，一般就是单词本身（小写）
     w         单词
     pos       词性，可省略
     core      核心图景：一句话说清它描绘的本质状态
     image     脑海图景：一个具体的比喻/画面，让核心可记
     origin    词源，可省略
     parts     构词拆解 [[形式, 含义, prefix|root|suffix], …]，可省略
     rootRefs  关联到 data/roots.js 的条目 id 数组 —— 页面会自动生成双向链接
     senses    义项数组，每项：
                 dim      这一维度叫什么
                 tag      维度标签（物理/心理/社会…）
                 scene    描绘场景
                 feature  状态特征，可省略
                 zh       对应中文释义
                 ex       例证 [{en, zh}]
     contrasts 边界对比 [{w: 对比词, note: 差在哪}] —— 若 w 也是本库条目，自动双向链接
     summary   一句话总结，可省略

   追加方式：往 DB.words 数组里再加一个对象即可。
   ============================================================ */
window.DB = window.DB || {};
DB.words = [

  {
    id: "above", w: "above", pos: "prep./adv.",
    core: "在某一参考物的相对更高处",
    image: "本质是一种非接触性的垂直位置优越或层级超越。所有中文释义都是这个核心图景在物理、数学、社会、道德四个维度上的投射。",
    senses: [
      { dim: "物理空间的相对高位", tag: "物理",
        scene: "两个物体在空间中存在上下关系，但两者没有直接接触——吊灯悬在餐桌上方，云层漂在山顶之上。",
        feature: "强调垂直方向上的高度差异与分离状态（与强调接触的 on 形成对比）。",
        zh: "在……上方、高于",
        ex: [{ en: "The bird is flying above the clouds.", zh: "鸟在云层上方飞行。" }] },
      { dim: "刻度、数量或标准的跨越", tag: "数学/标准",
        scene: "把参考物视为一条水平基准线（零度线、海平面、及格线），当前状态处于这条线之上。",
        feature: "突破了既定的阈值或平均水平。",
        zh: "超过、多于、大于",
        ex: [{ en: "The temperature is above zero.", zh: "温度在零度以上。" },
             { en: "His work is above average.", zh: "他的工作表现高于平均水平。" }] },
      { dim: "等级、地位或权力的压制", tag: "社会",
        scene: "在组织架构、价值体系或优先级列表中，某人或某物处于比参考物更靠近顶端的位置。",
        feature: "具有更高的决策权、重要性或优先级。",
        zh: "地位高于、优于、凌驾于",
        ex: [{ en: "A captain is above a lieutenant.", zh: "上尉的级别高于中尉。" },
             { en: "Health is above wealth.", zh: "健康重于财富。" }] },
      { dim: "道德、能力或性质的脱离", tag: "抽象/心理",
        scene: "一个人的特质处于极高的位置，以至于底层的负面事物（怀疑、诱惑、卑劣行为）无法触及他。",
        feature: "处于一种免疫、不受约束或不屑一顾的状态。",
        zh: "不屑于、超乎……之外、不受……影响",
        ex: [{ en: "He is above lying.", zh: "他不屑于说谎／他的品格高于说谎这种行为。" },
             { en: "The plan is above suspicion.", zh: "该计划无懈可击／超出了会被怀疑的范畴。" }] }
    ],
    summary: "英文的多义性通常是因为语言在演变中，把一个具象的物理空间关系隐喻到了抽象的逻辑关系中。抓住核心图景，就能推演出它在任何语境下的准确含义。"
  },

  {
    id: "get", w: "get", pos: "v.",
    core: "「从无到有」的动态获取，或「从状态 A 到状态 B」的转变",
    image: "与强调静态拥有的 have 或 be 不同，get 的本质是动作的结果达成与状态切换。",
    senses: [
      { dim: "物理实体的占有或转移", tag: "物质",
        scene: "主体通过接收、购买、拿取、赢得等手段，使一个具体物体进入自己的控制范围。",
        feature: "从「未拥有」到「拥有」的动作结果。",
        zh: "得到、获得、买到、收到、拿到",
        ex: [{ en: "I got a package today.", zh: "我今天收到了一个包裹。" },
             { en: "Go get your coat.", zh: "去把你的外套拿来／把外套纳入你的控制中。" }] },
      { dim: "抽象概念的捕获与吸收", tag: "认知",
        scene: "一个信息、观点或笑话成功进入意识并被解析，如同大脑在思维空间中「抓住了」这个抽象概念。",
        feature: "从困惑／未知到清晰／掌握的认知跨越。",
        zh: "懂了、明白、领会",
        ex: [{ en: "I don't get the joke.", zh: "我不明白这个笑话／我的大脑没有捕获到它的笑点。" },
             { en: "I get your point.", zh: "我领会你的意思了。" }] },
      { dim: "性质与处境的演变", tag: "状态",
        scene: "人、事物或环境的客观属性发生变化，通常暗示这种变化是自然发生的、渐进的，或受外界影响导致的。",
        feature: "跨越原有的状态边界，进入新的属性区间（常接形容词或过去分词）。",
        zh: "变得、逐渐成为、患上",
        ex: [{ en: "It is getting dark.", zh: "天正在变黑／天色向黑暗状态过渡。" },
             { en: "He got sick.", zh: "他生病了／身体从健康状态转变为疾病状态。" }] },
      { dim: "空间位置的抵达", tag: "位移",
        scene: "经过一段移动过程，主体成功触及目标地点。不强调移动方式，只强调「到达」这一结果。",
        feature: "空间坐标从起点／中途切换为终点。",
        zh: "到达、抵达",
        ex: [{ en: "When will we get to the station?", zh: "我们什么时候能抵达车站？" }] },
      { dim: "外部动作的促成与驱使", tag: "使役",
        scene: "主体施加影响（说服、命令、支付），导致另一个客体完成某个动作或进入某种被动状态。",
        feature: "使某种未发生的事件转化为已发生的既定结果。",
        zh: "使得、让、促使",
        ex: [{ en: "I couldn't get the engine to start.", zh: "我没法让引擎发动起来。" },
             { en: "We need to get the work done.", zh: "我们需要把这项工作完成。" }] }
    ],
    contrasts: [{ w: "take", note: "get 强调结果达成，可以是被动或自然发生；take 强调主体主动出击去抓取。" }],
    summary: "无论 get 后面接名词、形容词、介词还是动词，底层逻辑高度统一：促成某种转变并获取最终结果。"
  },

  {
    id: "take", w: "take", pos: "v.",
    core: "主体主动发起的抓取、剥离与控制转移",
    image: "一只有形或无形的手伸出去，将某人或某物从原有的状态、位置或所属关系中剥离出来，纳入自己的控制、伴随或消耗范围。",
    senses: [
      { dim: "物理实体的移位与携行", tag: "空间",
        scene: "主体伸手抓住某物使其脱离原处；或在移动时把某人／某物置于自己的控制下一同位移。",
        feature: "物理位置的改变及伴随状态的确立。",
        zh: "拿走、取、携带、带领",
        ex: [{ en: "Someone took my umbrella.", zh: "有人拿走了我的伞／伞被主动剥离了原位。" },
             { en: "I will take you to the hospital.", zh: "我会带你去医院／将你纳入我的引导和伴随中。" }] },
      { dim: "资源的切分与消耗", tag: "资源",
        scene: "一项任务像一个有主动性的实体，从你的生命总量、资源储备中「抓取」走了一部分。",
        feature: "客观资源被不可逆地占用或消耗。",
        zh: "花费、需要、占用",
        ex: [{ en: "The project took three months.", zh: "这个项目花费了三个月／从时间线上切走了三个月。" },
             { en: "This sofa takes up too much space.", zh: "这沙发占据了太多空间。" }] },
      { dim: "生理与心理的内化与接纳", tag: "身心",
        scene: "主体主动将外界的物质（药物）或非物质（建议、责任、侮辱）抓取过来，吞入体内或纳入自己的职责范围。",
        feature: "从外部环境向主体内部的转移与消化。",
        zh: "服用、接受、承担、忍受",
        ex: [{ en: "Take this pill twice a day.", zh: "每天服用两次这种药。" },
             { en: "I will take the responsibility.", zh: "我将承担责任／将责任抓取并背负在自己身上。" },
             { en: "I can't take it anymore.", zh: "我无法再忍受了／心理承受容器无法再吞下更多压力。" }] },
      { dim: "信息的抽取与定格", tag: "信息",
        scene: "面对流动的现实世界，主动「截取」其中一个片段、画面或样本，并将其固化保存。",
        feature: "从整体中抽取局部特征，形成静态记录。",
        zh: "拍摄、记录、量取",
        ex: [{ en: "Take a photo of this building.", zh: "拍下这栋建筑／从现实视觉中抽取并定格一个画面。" },
             { en: "Take someone's temperature.", zh: "量某人的体温／从身体状态中抽取温度数据。" }] },
      { dim: "工具与交通方式的利用", tag: "驾驭",
        scene: "主动踏入某种交通工具或选择某条路线，将其作为实现位移目标的手段，占据其使用权。",
        feature: "驾驭和利用外部工具以达成目的。",
        zh: "搭乘、乘坐、走（某条路）",
        ex: [{ en: "Let's take a taxi.", zh: "我们打车吧／征用并控制一辆出租车来服务我们。" },
             { en: "Take the next left.", zh: "下一个路口左转／选择并驶入左侧那条路。" }] }
    ],
    contrasts: [{ w: "get", note: "take 强调主体能动性（主动出击去抓）；get 强调结果达成，可被动或自然发生。" }],
    summary: "无论 take 翻译成什么，底层图景始终一致：主体主动出击，将客体抓取过来，使其脱离原先状态，转而为我所用、被我消耗或受我控制。"
  },

  {
    id: "for", w: "for", pos: "prep.",
    core: "能量、注意力或资源朝着一个特定的标的物投射并绑定",
    image: "一个具有极强指向性的箭头（→）。箭头从动作的起点发出，牢牢锁定在末端的那个「标的物」上。",
    senses: [
      { dim: "资源分配与归属锁定", tag: "受体",
        scene: "主体产出了某种资源，箭头明确指向某个人或群体，将这部分资源的归属权与之绑定。",
        feature: "确定动作的受益者或资源接收方。",
        zh: "给、为了（某人的利益）、供……使用",
        ex: [{ en: "I bought a gift for you.", zh: "我给你买了一份礼物／购买动作的受体箭头指向了「你」。" },
             { en: "This room is for guests.", zh: "这个房间是给客人用的。" }] },
      { dim: "目的驱动与动机牵引", tag: "动机",
        scene: "动作并非漫无目的，箭头指向前方的一个预期结果。这个标的物是牵引动作发生的核心引擎。",
        feature: "揭示行为背后的驱动力或追求的终点。",
        zh: "为了（获得某物）、旨在",
        ex: [{ en: "He works hard for money.", zh: "他为了钱而努力工作／动机箭头死死锁定了金钱。" },
             { en: "Run for your life!", zh: "为了你的命快跑！" }] },
      { dim: "空间与时间的延伸覆盖", tag: "跨度",
        scene: "箭头不再是点对点的射线，而是一根拉长的标尺，平行于一段物理距离或时间段，从起点划到终点。",
        feature: "覆盖并充满一个连续的区间。",
        zh: "长达（时间）、计有（距离）",
        ex: [{ en: "I have lived here for ten years.", zh: "我在这里住了十年／居住状态这根标尺覆盖了「十年」。" },
             { en: "The road continues for miles.", zh: "这条路绵延数英里。" }] },
      { dim: "等价交换与替代关系", tag: "交易",
        scene: "箭头变成双向的交换符号。一方交出 A，箭头指向 B，要求 B 作为对等物被替换过来。",
        feature: "建立两个事物之间的对价、交换或代理属性。",
        zh: "换取、代替、作为",
        ex: [{ en: "I bought this book for ten dollars.", zh: "我花十美元买了这本书／两者发生了等价交换。" },
             { en: "I will speak for him.", zh: "我将代替他发言／形成了代理关系。" }] },
      { dim: "情感倾向与立场站位", tag: "倾向",
        scene: "存在选择或冲突时，主体的立场箭头坚定指向其中一方，形成背书或支持的绑定关系。",
        feature: "表明赞成、支持的绝对倾向性（与反向的 against 形成对比）。",
        zh: "赞成、支持",
        ex: [{ en: "Are you for or against the plan?", zh: "你是赞成还是反对这个计划？" }] }
    ],
    summary: "不要死记 for 后面接什么翻译成什么。只需在脑海中画出「从动作主体射向标的物并产生绑定关联的箭头」，所有用法都是这个图景的变体。"
  },

  {
    id: "as", w: "as",
    core: "一个绝对的等号（=），或两条严丝合缝、完全平行的轨道",
    image: "两张完美重叠的图纸，或天平两端绝对持平的指针。它代表实体、时间、状态或逻辑上的绝对映射与同步。",
    senses: [
      { dim: "身份与功能的绝对重合", tag: "定义",
        scene: "把一个人或物体完全塞进一个特定的模具或标签中，两者此时此刻严丝合缝、完全等价（A = B）。",
        feature: "不带比喻色彩，强调真实的客观身份或实际发挥的功能。",
        zh: "作为、以……的身份",
        ex: [{ en: "I work here as a teacher.", zh: "我作为一名教师在这里工作／我的身份绝对等同于教师。" },
             { en: "We used the box as a table.", zh: "我们把这个盒子当作桌子用。" }] },
      { dim: "时间轨迹的平行推进", tag: "时间",
        scene: "两条时间轴完全平行地向前滚动。动作 A 发生的那一刻，动作 B 正在旁边的轨道上同步发生。",
        feature: "强调两个动作的同步性、伴随性或渐进的对应关系。",
        zh: "当……时、随着",
        ex: [{ en: "As he was leaving, the phone rang.", zh: "当他正要离开时，电话响了。" },
             { en: "As time goes by, you will understand.", zh: "随着时间的推移，你会明白的。" }] },
      { dim: "刻度与程度的精准对齐", tag: "比较",
        scene: "把两个事物放在刻度尺两侧，发现它们对应的数值在同一条绝对水平线上，没有高低落差。",
        feature: "数量、程度或状态的绝对等值（常用于 as...as 结构）。",
        zh: "和……一样",
        ex: [{ en: "He is as tall as me.", zh: "他和我一样高／我们俩的身高在刻度线上完美持平。" }] },
      { dim: "方式与状态的镜像复刻", tag: "方式",
        scene: "按照一张已经画好的蓝图去执行动作，你的行为轨迹必须与那张蓝图严丝合缝地对齐。",
        feature: "动作方式或状态的完美复制与吻合。",
        zh: "照……的方式、正如",
        ex: [{ en: "Do as I say.", zh: "照我说的做／你的行动轨迹 = 我的言语指令轨迹。" },
             { en: "As you know, the company is broke.", zh: "正如你所知，公司破产了／两张认知图纸是重合的。" }] },
      { dim: "逻辑因果的顺理成章", tag: "逻辑",
        scene: "原因和结果被放在天平两端。因为背景 A 如此，所以自然映射出结果 B。",
        feature: "显而易见、轻微的因果对应，不像 because 那样具有强烈的逻辑穿透力。",
        zh: "因为、由于",
        ex: [{ en: "As it was getting late, we decided to go home.", zh: "因为天色已晚，我们决定回家。" }] }
    ],
    contrasts: [{ w: "like", note: "like 是「相似但不重合（≈）」——A 只是在模仿 B，A 绝对不是 B；as 是「严丝合缝的等号（=）」——A 此刻就是 B。He works like a slave（他是打工人，拼命的姿态类似奴隶）vs. He works as a slave（他在身份上就是奴隶）。" }],
    summary: "as 表面用法繁杂，底层永远只有一个等号。判断用 as 还是 like，只问一句：这里是「就是」还是「像」。"
  },

  {
    id: "in", w: "in", pos: "prep./adv.",
    core: "绝对的包容、沉浸与边界跨越——主体被一个容器彻底吞噬或包裹",
    image: "潜入一片深水区，或跨过门槛走进一间密室。in 强制要求客体具备三维的体积、二维的闭环边界，或一个有包裹感的抽象力场。",
    senses: [
      { dim: "物理空间的绝对包裹", tag: "三维",
        scene: "跨越了某种物理边界（门、墙壁、水面、森林边缘），主体不再暴露于开阔地带，四周被客体的内部空间环绕。",
        feature: "强调「处于边界之内」，具有封闭感或安全感的物理沉浸。",
        zh: "在……里面、在……内",
        ex: [{ en: "The key is in the box.", zh: "钥匙在盒子里／盒子构成三维容器，钥匙被其内部空间完全包裹。" },
             { en: "Swimming in the river.", zh: "在河里游泳／水作为流体容器包裹了人的躯体。" }] },
      { dim: "时间跨度的闭环容器", tag: "时间",
        scene: "年、月、季节或一段特定时长不是一个「点」，而是一个有起点和终点的时间容器，事件发生在容器内部。",
        feature: "事件被装载于一段延展的时间段之内。",
        zh: "在（某年/月/季节）、在……期间、在……之后",
        ex: [{ en: "I was born in 2003.", zh: "我出生在 2003 年／2003 年是一个长达 365 天的容器。" },
             { en: "I will finish it in 5 minutes.", zh: "我会在 5 分钟内完成。" }] },
      { dim: "抽象状态的流体沉浸", tag: "心理",
        scene: "把情感、处境或生理状态具象化为一种看不见的液体。你像掉进水里一样被全方位包裹，无法轻易抽离。",
        feature: "深度陷入某种不可抗拒的处境或情绪中。",
        zh: "处于……状态中、陷入",
        ex: [{ en: "They are deeply in love.", zh: "他们深陷爱河／「爱」是一个力场容器。" },
             { en: "His life is in danger.", zh: "他的生命处于危险之中。" },
             { en: "She left in tears.", zh: "她流着泪离开了。" }] },
      { dim: "系统与媒介的载体嵌入", tag: "介质",
        scene: "成为某个组织的一部分，或用某种语言、材质表达时，这个组织或材质就成了装载你的容器。",
        feature: "成为大系统内的嵌入物，或受限于某种表达载体。",
        zh: "用（语言/材料）、在（团队/组织）里",
        ex: [{ en: "Please pay in cash.", zh: "请用现金支付／现金是承载这次交易的物理容器。" },
             { en: "Written in English.", zh: "用英文书写／英文构成了思想表达的语言容器。" },
             { en: "He is in the army.", zh: "他在军中服役／军队是一个庞大的系统容器。" }] }
    ],
    contrasts: [
      { w: "at", note: "at 是零维的「点」——没有长度没有体积，只是坐标原点。Someone is at the door（门只是参考坐标，你不在门上也不在门里）；At 3 PM（时间轴上的一个绝对截面）。" },
      { w: "on", note: "on 是二维的「面」——强调物理接触与支撑，没有陷进去。The book is on the table；On Monday（一天被视为一个平面时间格）。对比：apples on the tree（挂在表面）vs. the bird is in the tree（被立体树冠包裹）。" }
    ],
    summary: "at 是点，on 是面，in 是体。理解这三者的维度差异，空间与时间介词的语感会产生质的飞跃。"
  },

  {
    id: "by", w: "by", pos: "prep.",
    core: "在一个参照物旁边建立紧密的物理临近、因果连接或手段通道",
    image: "一条紧贴着参照物擦肩而过的轨迹线，或站在幕布旁边那只真正按下按钮的「看不见的手」。它永远在建立「A 依傍着 B」或「A 借助 B 完成」的相邻关系。",
    senses: [
      { dim: "动作溯源与施动者标记", tag: "因果",
        scene: "面对一个已发生的结果，视线顺着因果链条向回找，最终停靠在真正发出动作的源头或创作者身上。这是被动语态的底层基石。",
        feature: "标记物理力量的来源或创造权的绝对归属。",
        zh: "被、由（……创作/执行）",
        ex: [{ en: "The window was broken by a stone.", zh: "窗户被石头打破了／因果链条向回追溯，紧紧链接在「石头」这个源头上。" },
             { en: "A novel by George Orwell.", zh: "乔治·奥威尔的小说／创作者的无形签名死死贴在作品旁边。" }] },
      { dim: "途径、手段与运行通道", tag: "媒介",
        scene: "为达成目的，顺着一条特定的通道（交通网络、通信系统、行为模式）滑行过去。这个通道就是主体依傍的工具。",
        feature: "强调行为得以实现的宏观媒介或抽象系统（其后直接跟名词不加冠词，或接动名词）。",
        zh: "乘/通过（交通工具）、用/靠（某种方式）",
        ex: [{ en: "Traveling by train.", zh: "乘火车旅行／火车是完成空间位移所接入的交通网络通道。" },
             { en: "You can solve this by reducing the variables.", zh: "你可以通过减少变量来解决这个问题。" }] },
      { dim: "时间轴的强制截止线", tag: "时间",
        scene: "在时间轴上画下一道极清晰的红线。动作可以发生在红线之前的任何一点，但绝不能越过这条线。",
        feature: "具有极强强制性的时间容忍度边界。",
        zh: "在……之前、不迟于",
        ex: [{ en: "Submit the report by Friday.", zh: "周五前提交报告／周五是最后一道闸门，绝不能拖到周六。" }] },
      { dim: "物理空间的紧密傍接", tag: "空间",
        scene: "主体与客体在三维空间中处于极度靠近的状态，中间没有明显的距离断层。",
        feature: "静态的物理相邻。",
        zh: "在……旁边、靠近",
        ex: [{ en: "A house by the river.", zh: "河边的房子／房子紧紧依傍着河流这个参照物。" }] },
      { dim: "刻度的差值与计量标准", tag: "度量",
        scene: "把两个事物放在刻度尺上比对，提取它们之间相差的那个精确间隙；或按某个固定单位网格进行切割计算。",
        feature: "强调数学意义上的精确差值或计量单位的基准。",
        zh: "相差……、以……计、乘以",
        ex: [{ en: "We won the game by two points.", zh: "我们以两分之差赢得比赛。" },
             { en: "Multiply three by four.", zh: "三乘以四。" }] }
    ],
    contrasts: [{ w: "with", note: "with 是「手部延伸的实体工具」——必须是被握在手里的具体物品：I opened the door with a key。by 是「接入的运行系统或动作逻辑」——接宏观网络或抽象过程：I opened the door by kicking it（「踹」是动作通道，绝不能用 with）。I contacted him by phone（电信系统）vs. I hit him with a phone（把电话机当凶器）。" }],
    summary: "by 引出的永远是「施动者、媒介或截止边界」这三类基准点。"
  },

  {
    id: "rigorous", w: "rigorous", pos: "adj.",
    core: "毫无缝隙、毫不妥协的极度收紧与硬性约束",
    image: "一个精密咬合的齿轮组，或一张孔径极小的过滤网——不允许任何微小误差穿透，拒绝任何主观的弹性变通，容不得半点逻辑跳跃或懈怠。",
    origin: "与 rigid（坚硬的、僵硬的）同源",
    senses: [
      { dim: "逻辑与思维的无缝构建", tag: "学术",
        scene: "在推导结论或建立系统时，每一个步骤都被放在极限压力下检验，环环相扣，剔除了所有猜测、假设和思维跳跃。",
        feature: "知识结构或论证过程无懈可击、没有漏洞。",
        zh: "严密的、严谨的",
        ex: [{ en: "A rigorous mathematical proof.", zh: "一个严密的数学证明／每一步推导都完全符合公理，无缝隙。" },
             { en: "A rigorous analysis of the algorithm.", zh: "对该算法严谨的分析／穷尽了所有边界条件，不留死角。" }] },
      { dim: "标准与流程的极限施压", tag: "执行",
        scene: "用最高规格的门槛或最极端的条件去筛查一个对象，如同对零件进行破坏性拉伸，看它是否断裂。",
        feature: "执行过程一丝不苟，对误差零容忍。",
        zh: "严格的、缜密的、细致入微的",
        ex: [{ en: "Rigorous testing of the software.", zh: "对软件进行严格的测试／施加各种极端用例。" },
             { en: "A rigorous inspection.", zh: "一次缜密的检查／过滤网的孔径极小。" }] },
      { dim: "环境与外部条件的压迫", tag: "生存",
        scene: "外部环境（气候、训练计划）像一副沉重且毫无弹性的枷锁施加在人身上，剥夺了舒适感。",
        feature: "极其苛刻，具有很强的消耗性或破坏性。",
        zh: "严酷的、严厉的",
        ex: [{ en: "A rigorous climate.", zh: "严酷的气候／生存条件极其苛刻，没有温和的缓冲。" },
             { en: "Rigorous military training.", zh: "严酷的军事训练。" }] }
    ],
    contrasts: [{ w: "plausible", note: "plausible 只是表面顺滑、挑不出毛病；rigorous 是经得起极限施压的检验。plausible 的东西往往经不起 rigorous 的检验。" }],
    summary: "无论 rigorous 修饰的是数学公式、测试流程还是自然气候，底层图景都是「去除一切弹性与余地，实施最高强度的约束与检验」。"
  },

  {
    id: "virtual", w: "virtual", pos: "adj.",
    core: "在功能、效果或本质上等同于真实，但缺乏具体的物理形态或正式的名义",
    image: "一面镜子中的完美倒影，或一个由代码写成的替身——你无法在物理层面触摸它，但它产生的力量、作用和结果与真实事物毫无二致。",
    senses: [
      { dim: "效果达成与形式缺席", tag: "实质",
        scene: "一件事在法律、名义或绝对物理界限上还没完全越过终点线，但在实际运作和最终效果上，已经和越过终点线没有区别。",
        feature: "具备 99% 的核心属性，仅差 1% 的名义或微小距离。",
        zh: "实质上的、事实上的、几乎的",
        ex: [{ en: "He is the virtual leader of the company.", zh: "他是公司实质上的领导者／哪怕名义上只是副手，他的指令拥有等同效力。" },
             { en: "The disease wiped out the virtual entirety of the population.", zh: "这种疾病几乎消灭了全部人口。" }] },
      { dim: "逻辑构建与实体剥离", tag: "科技",
        scene: "把原本需要物理硬件的系统，通过软件逻辑在另一个维度中复刻出来。功能完全相同，但硬件实体被抽离了。",
        feature: "物理载体缺席，由数字信息构建出完整的交互功能。",
        zh: "虚拟的、模拟的",
        ex: [{ en: "Virtual Reality (VR).", zh: "虚拟现实／效果等同于身处真实世界，但物理上并不存在那个世界。" },
             { en: "A virtual machine.", zh: "虚拟机／逻辑上拥有 CPU、内存和硬盘的替身，但并非真实的物理铁盒子。" }] },
      { dim: "光学视错觉与能量投射", tag: "物理",
        scene: "光线折射或反射，导致眼睛在某一点「看」到了物体，但光线并没有真正在那个点汇聚，也无法用屏幕接收到影像。",
        feature: "具备视觉可观测性，但不具备物理空间上的能量交汇。",
        zh: "虚的（像）、虚设的",
        ex: [{ en: "A virtual image.", zh: "虚像／镜子里的画面，你能看到效果，但镜子背后没有真正的光线实体。" }] }
    ],
    summary: "很多人只记住了科技语境里的「虚拟的」，于是把 He is a virtual dictator 误解为「假的独裁者」。抓住底层图景——物理/名义缺席，但效果/功能完全拉满——就能瞬间贯通。"
  },

  {
    id: "deliver", w: "deliver", pos: "v.",
    core: "将承载、积蓄或孕育已久的事物，完整且成功地释放并移交到预定的终点或接收者手中",
    image: "「送货、演讲、兑现承诺、接生婴儿」这些看似毫不相干的中文，全都源自同一个「释放并移交」的底层动作。",
    senses: [
      { dim: "物理物流的移交", tag: "物流",
        scene: "将包裹从仓库成功移交给客户。",
        zh: "递送、投递",
        ex: [{ en: "Deliver a package.", zh: "递送包裹。" }] },
      { dim: "信息与能量的释放", tag: "表达",
        scene: "把大脑中构思已久的思想或情绪，完整地释放并投射给听众。",
        zh: "发表（演讲）、给出（一击）",
        ex: [{ en: "Deliver a speech.", zh: "发表演讲。" },
             { en: "Deliver a blow.", zh: "打出一拳／将积蓄的物理能量移交给对手。" }] },
      { dim: "责任与预期的兑现", tag: "承诺",
        scene: "将别人期待的结果或你承诺过的东西，变现并交出来。",
        zh: "兑现、交付成果",
        ex: [{ en: "Deliver on a promise.", zh: "兑现承诺／把承诺的结果移交出来。" }] },
      { dim: "生命的释放", tag: "生物",
        scene: "母亲将腹中孕育成熟的生命，成功释放并移交给外部世界。",
        zh: "接生、分娩",
        ex: [{ en: "The doctor delivered a baby.", zh: "医生接生了一个婴儿。" }] }
    ]
  },

  {
    id: "compromise", w: "compromise", pos: "n./v.",
    core: "原有坚固的界线、标准或防御外壳被向下拉低、打破或产生裂隙",
    image: "中国学生通常只记住中性的「妥协、折中」，于是看到 The system was compromised 就困惑。抓住「防线被拉低」这个图景，两个意思立刻统一。",
    senses: [
      { dim: "人际与谈判的让步", tag: "谈判",
        scene: "双方都主动拉低了自己的心理底线，放弃一部分原本坚持的原则，以达成一致。",
        zh: "妥协、让步、折中方案",
        ex: [{ en: "We reached a compromise.", zh: "我们达成妥协／双方都降低了防线。" }] },
      { dim: "物理与系统的被攻破", tag: "安全",
        scene: "系统的安全防线、密码保护或物理外壳未能守住，被外部力量打破了完整性。",
        zh: "被攻破、被渗透",
        ex: [{ en: "The network security was compromised.", zh: "网络安全被攻破／安全防线被拉低或撕裂，不再完整。" }] },
      { dim: "道德与质量的损害", tag: "道德",
        scene: "为了眼前的利益，放弃了原有的高标准或道德准则。",
        zh: "损害、违背",
        ex: [{ en: "Don't compromise your principles.", zh: "不要违背你的原则／不要让你的道德底线下降。" }] }
    ],
    contrasts: [{ w: "diplomacy", note: "compromise 是单方面或双方降低底线；diplomacy 是在不降低核心底线的前提下，用精确的语言导航避开冲突。" }]
  },

  {
    id: "integrity", w: "integrity", pos: "n.",
    core: "一个未被切割、未受污染、没有裂缝的浑然一体状态",
    image: "词典给的「正直/诚实」和「完整性」在中文里完全不搭界，但在英文里是同一个概念——都是「一块整石，没有裂痕」。",
    senses: [
      { dim: "物理或逻辑结构的完好", tag: "结构",
        scene: "一栋建筑、一串数据或一个系统，保持着原始的、未被破坏的闭环状态。",
        zh: "完整性、完好无损",
        ex: [{ en: "Structural integrity.", zh: "结构完整性／建筑物没有裂缝或损伤。" },
             { en: "Data integrity.", zh: "数据完整性／数据在传输中未被篡改或丢失碎片。" }] },
      { dim: "道德与品格的表里如一", tag: "品格",
        scene: "一个人的内在道德和外在行为严丝合缝、表里如一。他的品格是一块整石，没有因为利益诱惑而产生裂痕或两面派的切割。",
        zh: "正直、高尚操守",
        ex: [{ en: "A man of absolute integrity.", zh: "一个极其正直的人／道德结构浑然一体，毫无瑕疵与分裂。" }] }
    ],
    contrasts: [{ w: "compromise", note: "compromise 正是 integrity 的反面动作——在那块「整石」上压出裂缝。" }]
  },

{
    id: "subject", w: "subject", pos: "n./adj./v.",
    core: "被放置在下方，受制于一种更高维度的力量、焦点或规则的笼罩与统辖",
    image: "作为名词是「主题/臣民」，作为形容词是「受支配的」，作为动词是「使屈服」——三个意思看似割裂，其实全在「被扔到下面」这一个动作里。",
    origin: "拉丁语：sub-（在下方）+ jacere（投掷）＝扔在下面",
    parts: [["sub-", "在下方", "prefix"], ["ject", "投掷", "root"]],
    rootRefs: ["ject"],
    senses: [
      { dim: "认知与焦点的笼罩", tag: "认知",
        scene: "被放在聚光灯「下方」，受制于人们注意力或研究动作笼罩的对象。",
        zh: "主题、科目、实验对象",
        ex: [{ en: "The subject of the meeting.", zh: "会议的主题／被讨论动作统辖的焦点。" },
             { en: "The test subject.", zh: "测试对象／受制于实验人员控制和观察的人或物。" }] },
      { dim: "权力与社会的层级", tag: "社会",
        scene: "在阶级结构中，被放置在君主或统治阶级权力笼罩「下方」的人。",
        zh: "臣民、国民",
        ex: [{ en: "British subjects.", zh: "英国臣民。" }] },
      { dim: "状态与概率的支配", tag: "状态",
        scene: "被置于某种不确定因素的统辖之下，没有自主免疫力。",
        zh: "易受……影响的、取决于",
        ex: [{ en: "Flights are subject to delay.", zh: "航班容易受延误影响／准点率被「延误因素」踩在脚下。" }] }
    ]
  },

  {
    id: "address", w: "address", pos: "n./v.",
    core: "将注意力、动作或信息，精确地瞄准并投射到一个特定的坐标上",
    image: "名词是「地址」，动词却有「发表演讲」和「解决问题」——共同点是「精确对准某个坐标」，只是坐标可以是物理点、人，或一个麻烦。",
    senses: [
      { dim: "物理空间的坐标锁定", tag: "空间",
        scene: "能够在庞大的空间中，精确锁定你所在位置的物理坐标。",
        zh: "地址",
        ex: [{ en: "Mailing address.", zh: "邮寄地址。" }] },
      { dim: "信息传递的对准", tag: "表达",
        scene: "说话者将自己的语言和目光，精确地投射并锁定在对面的听众群或特定人物身上。",
        zh: "向……发表演讲、称呼",
        ex: [{ en: "Address the audience.", zh: "向观众发表演讲／把信息箭头精确对准观众。" },
             { en: "How should I address you?", zh: "我该如何称呼您？／用什么专属词汇把信息对准您？" }] },
      { dim: "行动与资源的对准", tag: "行动",
        scene: "将注意力、精力和解决方案，精确地对准并锁定一个麻烦或问题。",
        zh: "着手解决、处理",
        ex: [{ en: "We must address this problem.", zh: "我们必须处理这个问题／把解决动作的枪口对准它。" }] }
    ]
  },

  {
    id: "bribery", w: "bribery", pos: "n.",
    core: "跨越正当程序的暗中利益交换，旨在扭曲决策、破坏原有的中立性与职责",
    image: "本质是对规则或流程的非法「短路」。一个本应依据事实与法律输出结果的决策黑盒，被强行注入外部变量（金钱、特权），导致评判标准失效、输出带偏见的结果。",
    senses: [
      { dim: "规则的破坏与利益输送", tag: "主动侧",
        scene: "主体为了获取本不该属于自己的优势（赢得竞标、逃避处罚），在桌面之下向掌握权力的人递交筹码。",
        feature: "试图用利益冲破客观的规则壁垒，建立一条非法捷径。",
        zh: "行贿、收买",
        ex: [{ en: "He was charged with bribery.", zh: "他被指控行贿。" }] },
      { dim: "职责的背叛与权力变现", tag: "被动侧",
        scene: "掌握公权力或裁判权的人，将手中的决策权作为商品与外部利益兑换。天平本应中立，但接收者在托盘底下暗中吸附了一块磁铁。",
        feature: "职业操守与中立性被瓦解，权力被私有化和商品化。",
        zh: "受贿、纳贿",
        ex: [{ en: "The judge was dismissed for taking a bribe.", zh: "该法官因受贿被免职。" }] },
      { dim: "系统的腐化与信用丧失", tag: "宏观",
        scene: "当这种交换在某个行业或社会中成为常态，它不再是单一动作，而是一种环境状态。整个系统的运转动力不再是效率，而是暗箱操作。",
        zh: "贿赂行为（统称）、权钱交易",
        ex: [{ en: "Bribery is deeply rooted in this system.", zh: "贿赂在这个系统中根深蒂固。" }] }
    ],
    contrasts: [{ w: "ethical", note: "bribery 正是击穿 ethical 那套「正当性护栏」的典型动作。" }]
  },

  {
    id: "vanity", w: "vanity", pos: "n.",
    core: "外表华丽或看似存在，但内部空洞、无实质内容、且最终不可长久",
    image: "一个巨大的彩色肥皂泡，或一具没有灵魂的精致空壳——外部引人注目，内部毫无支撑，经不起推敲，注定破灭或归于虚无。",
    origin: "拉丁语 vanus（空的）",
    senses: [
      { dim: "心理与自我认知的空洞", tag: "心理",
        scene: "极度沉迷于自己的外貌、成就或社会吸引力这些「外在且终将消逝」的特质，站在镜前自我陶醉，却缺乏内在恒久的品格作为支撑。",
        zh: "虚荣心、自负、浮华",
        ex: [{ en: "He did it out of pure vanity.", zh: "他纯粹是出于虚荣才这么做／动机是为了满足那层空洞的华丽外壳。" }] },
      { dim: "行动与结果的落空", tag: "存在",
        scene: "付出巨大努力去追逐某物，最终发现它本身毫无价值；或如同在风中抓取空气，抓不到任何能留存的结果。",
        zh: "徒劳、无意义、虚妄",
        ex: [{ en: "The vanity of human wishes.", zh: "人类愿望的徒劳／愿望如泡泡般破灭，没有沉淀下任何实质。" }] },
      { dim: "制造假象的物理载体", tag: "物理",
        scene: "卧室或更衣室里，一张专门用来修饰外表、营造美丽幻象的操作台。",
        zh: "梳妆台、化妆台",
        ex: [{ en: "A bedroom vanity.", zh: "卧室梳妆台。" }] }
    ],
    contrasts: [{ w: "vicinity", note: "形近词。vicinity 的核心图景是「以某点为中心向外辐射、但没有清晰边界的模糊包围圈」，如石子入水泛起的水波。There is no hospital in the immediate vicinity.（这附近没有医院）" },
                { w: "divinity", note: "形近词。divinity 的核心图景是「从世俗凡人的低维世界中抽离，凌驾于物理法则之上的至高、纯粹与发光属性」。The divinity of nature.（自然的神性）" }]
  },

  {
    id: "eradicate", w: "eradicate", pos: "v.",
    core: "连根拔起，彻底剥离并摧毁某事物的再生基础",
    image: "面对一株杂草，不是用镰刀割掉地表可见的茎叶（那样春风吹又生），而是把双手深深插入泥土，握住最底层的根须整个拽出并销毁，确保它绝对丧失再生的可能。",
    origin: "拉丁语：e-（向外、拔出）+ radix（根部，与 radish 萝卜同源）",
    parts: [["e-", "向外", "prefix"], ["radic", "根", "root"], ["-ate", "动词", "suffix"]],
    senses: [
      { dim: "生物与病理的绝对清零", tag: "医学",
        scene: "将某种病毒、寄生虫或有害物种从一个地理区域乃至整个生态系统中彻底剥离，使传染源降至绝对的零。",
        feature: "斩断了繁衍与传播链条，达到不再复发的终极状态。",
        zh: "根除、扑灭、使绝迹",
        ex: [{ en: "Smallpox has been eradicated globally.", zh: "天花已被全球根除／病毒的根系被彻底拔除。" },
             { en: "Eradicate pests from the field.", zh: "彻底扑灭田里的害虫。" }] },
      { dim: "社会顽疾的结构性摧毁", tag: "社会",
        scene: "面对贫困、腐败、文盲，不做表面修补，而是深入底层制度，推翻并摧毁产生这些现象的机制基础。",
        feature: "强调对负面体系底座的毁灭。",
        zh: "铲除、彻底消除",
        ex: [{ en: "The government's goal is to eradicate extreme poverty.", zh: "政府的目标是消除极端贫困／拔除贫困的社会与经济根源。" },
             { en: "Eradicate corruption.", zh: "铲除腐败／不仅抓贪官，而是捣毁滋生腐败的权力结构网。" }] },
      { dim: "思想与错误的抹杀", tag: "认知",
        scene: "将错误观念、不良影响或数据痕迹从大脑、文化体系或记录载体中完全剔除，不留遗迹。",
        zh: "肃清、抹除",
        ex: [{ en: "We must eradicate this misconception.", zh: "我们必须肃清这种错误观念。" }] }
    ],
    contrasts: [
      { w: "destroy", note: "destroy 强调「物理结构的粉碎」——大楼倒塌后废墟还在原地。" },
      { w: "eliminate", note: "eliminate 强调「从一个系统或名单中踢出去」，是「移出边界」的动作，比如淘汰一名选手。" }
    ],
    summary: "eradicate 的施法对象必须是「具有深层根系、会蔓延扩散的负面事物」（疾病、杂草、偏见、贫困）。它不接受妥协、不接受残留，最终结果必须指向绝对的零。"
  },

  {
    id: "essentially", w: "essentially", pos: "adv.",
    core: "剥离所有表面伪装、次要特征与复杂细节，直击决定事物属性的绝对底座",
    image: "一台 X 光机或一个化学蒸馏器。无论外表覆盖多少层包装和分支，经过它的透视后，所有水分和杂质都被剔除，只留下决定该事物究竟是什么的那一小块纯质。",
    origin: "来自 essence（本质、精粹）",
    senses: [
      { dim: "属性与身份的绝对基底", tag: "定义",
        scene: "评价真实属性时，跨过偶尔的行为偏差、复杂的外界评价或暂时的状态，直接触碰不可改变的内在核心。",
        feature: "揭示绝对的、底层的真实属性。",
        zh: "本质上、骨子里、根本上",
        ex: [{ en: "He is essentially a good man.", zh: "他本质上是个好人／剥开粗鲁的言辞和偶尔的错，其人格底座是善良。" },
             { en: "It is essentially a problem of resource allocation.", zh: "这根本上是一个资源分配问题。" }] },
      { dim: "繁杂信息的极致浓缩", tag: "概括",
        scene: "面对百页报告或混乱局面，用最简短的方式砍掉所有修饰语，只端出那个最终影响决策的底线事实。",
        zh: "基本上、归根结底",
        ex: [{ en: "Essentially, we are bankrupt.", zh: "归根结底，我们破产了／无论报表多复杂，提纯后的事实就是没钱了。" }] },
      { dim: "表面差异的实效对齐", tag: "对比",
        scene: "两个事物在外观或实现路径上有差异，但穿透这些差异对比底层机制后，发现它们的核心是重合的。",
        zh: "实质上、其实",
        ex: [{ en: "The two software tools are essentially the same.", zh: "这两款工具实质上是一样的／UI 和品牌不同，但底层算法逻辑完全重合。" }] }
    ],
    contrasts: [{ w: "apparently", note: "两者是一对认知反方向的词。apparently 是「外→内」，基于感官和初步证据在表层建立印象，隐含「如果我没看错的话」；essentially 是「内→外」，是手术刀穿透外壳后的内核，隐含「拨开迷雾，事实是」。经典结构：Apparently X, but essentially Y。Apparently he is rich（穿名牌开豪车）／ Essentially he is broke（负债远大于资产）。" }],
    summary: "essentially 不是在做简单总结，而是在执行「剔除多余变量」的动作，强迫读者的视线穿过迷雾，锁定那个最硬、最纯、最无可辩驳的逻辑内核。"
  },

  {
    id: "ethical", w: "ethical", pos: "adj.",
    core: "行为被嵌入并受制于一套无形的「正当性护栏」，主动放弃绝对功利或技术上可行的越界操作",
    image: "系统底层的一套约束代码。如果单纯追求效率的算法只计算最短路径，那么附加了 ethical 属性的算法会在最短路径上设置不可触碰的红线——即使跨越红线能带来巨大收益，该行为也会被拦截。",
    senses: [
      { dim: "利益与底线的博弈", tag: "行为",
        scene: "面对利益诱惑或效率捷径时，决策轨迹没有溢出社会公认的「公平、诚实、无害」边界。强调在「我能做」和「我该做」之间选择了后者。",
        zh: "合乎道德的、正当的",
        ex: [{ en: "Ethical investing.", zh: "道德投资／资本流向不仅看回报率，还受制于环保、人权等护栏。" },
             { en: "Is it ethical to test cosmetics on animals?", zh: "在动物身上测试化妆品合乎道德吗？" }] },
      { dim: "规范框架的研究与应用", tag: "学术",
        scene: "不特指某个动作是否善良，而是指代「构建、探讨和维护这套规则护栏」的系统性工作本身。",
        zh: "伦理的、伦理学的",
        ex: [{ en: "An ethical dilemma.", zh: "伦理困境／规则护栏出现系统性冲突，无论怎么选都会触碰某条红线。" },
             { en: "Ethical hacking.", zh: "白帽黑客／技术动作本身是入侵，但目的是修复漏洞，行为受授权护栏约束。" }] },
      { dim: "特权与克制的绑定", tag: "职业",
        scene: "掌握极高信息差或专业权力的人（医生、律师、工程师），面对绝对弱势的客户时，用严格行规将自己的特权锁死。",
        zh: "职业道德的",
        ex: [{ en: "Ethical standards for medical professionals.", zh: "医疗人员的职业道德标准。" }] }
    ],
    contrasts: [{ w: "moral", note: "moral 更偏向个体内心的良知（Inner voice），是主观的善恶感；ethical 更偏向外部群体、社会或职业公认的客观规则框架（External rules）。律师为已知有罪的杀人犯辩护，在很多人的良知（moral）上难以接受，但因为程序正义，这在法律界是完全合乎职业操守的（ethical）。" }]
  },

  {
    id: "resourceful", w: "resourceful", pos: "adj.",
    core: "在限制与资源匮乏的条件下，打破常规、迅速调动并转化周边一切可用元素来解决问题的变通能力",
    image: "绝境中的马盖先：被困密室，手头只有一根回形针、一条橡皮筋和半瓶水。普通人看到的是没有标准工具的绝望，resourceful 的人看到的是一个开放的工具箱，能把毫无关联的废料跨界组合造出逃生装置。",
    senses: [
      { dim: "既定路线封死时的突围", tag: "危机",
        scene: "标准流程走不通、标准工具缺失时，不陷入抱怨或停滞，大脑立刻切换到备用方案，用非标准甚至略显草莽的方式破局。",
        feature: "极强的目标导向，抗挫折力与临场应变能力满格。",
        zh: "足智多谋的、随机应变的",
        ex: [{ en: "She is a very resourceful manager.", zh: "她是一位办法非常多的经理／无论预算被砍还是核心人员离职，总能东拼西凑按时交付。" }] },
      { dim: "元素的跨界重组与价值压榨", tag: "资源",
        scene: "面对一堆看似无用的破铜烂铁、残缺的信息或边缘的人脉，能剥离物体的原始标签，发现它们隐藏的物理或逻辑属性并加以利用。",
        feature: "认知框架不被事物的原有用途所局限。",
        zh: "善于就地取材的",
        ex: [{ en: "To survive in the wild, you must be resourceful.", zh: "要在野外生存，你必须极其善于就地取材。" }] },
      { dim: "内部数据库的极速检索", tag: "心智",
        scene: "这里的「资源」不是外界实物，而是大脑中的知识库、经验模型和逻辑框架。面对未知挑战时能迅速跨区段调用内部储备，瞬间拼接出应对策略。",
        zh: "机智的、灵敏的",
        ex: [{ en: "A resourceful mind.", zh: "一颗机智灵活的头脑。" }] }
    ],
    contrasts: [{ w: "utilize", note: "同源思路：resourceful 是「人」的属性，utilize 是这种人做出的「动作」——发掘闲置资源的效用价值。" }],
    summary: "别被词根 resource 误导成「资源丰富的（有钱有人脉）」。一个首富如果只会花钱砸问题，他只是 rich；一个穷学生能用两台报废电脑拼出一台能跑代码的服务器，他才是 resourceful。"
  },

  {
    id: "supportive", w: "supportive", pos: "adj.",
    core: "从底部向上托举，或在侧方构筑承重墙，防止主体在重力或外界打击下坠落、变形或崩溃",
    image: "建筑物底部的巨大基石，或人疲惫后仰时接住他的一张安全网。它不一定是在前方冲锋的主导力量，而是在后方或下方提供源源不断的维持力。",
    origin: "拉丁语：sub-（在下方）+ portare（携带/承重）",
    parts: [["sup-", "在下方（sub-）", "prefix"], ["port", "承载", "root"], ["-ive", "形容词", "suffix"]],
    rootRefs: ["port"],
    senses: [
      { dim: "情感与心理的托底", tag: "心理",
        scene: "当一个人面临自我怀疑或处于低谷（被负面情绪的重力向下拉扯），另一个人充当心理缓冲垫，源源不断提供信任与鼓励，使其精神结构保持稳定。",
        zh: "给予支持的、鼓励的、体贴的",
        ex: [{ en: "A supportive environment.", zh: "一个给予支持的环境／在这里犯错时有安全网托住你，不会直接摔碎。" },
             { en: "He was very supportive of my decision.", zh: "他非常支持我的决定／他分担了该决定带来的心理压力。" }] },
      { dim: "物理与架构的承重", tag: "力学",
        scene: "一个物理实体被专门设计出来抵抗重力或外力牵引，维持另一个实体的稳定形态。",
        zh: "支撑的、承托重量的",
        ex: [{ en: "Supportive shoes.", zh: "提供支撑的鞋子／鞋底向上托举足弓，防止骨骼力学结构塌陷。" },
             { en: "A supportive chair.", zh: "承托力好的椅子。" }] },
      { dim: "生理机能的旁侧辅佐", tag: "医疗",
        scene: "介入手段不直接攻击病灶，而是为主体机能加固或输送能量，让它依靠自身力量撑过危机。",
        zh: "辅助性的、维持生命的",
        ex: [{ en: "Supportive care.", zh: "支持性治疗／如输送营养液或氧气，不治本，而是托住不断下坠的生命体征。" }] }
    ],
    contrasts: [{ w: "backbone", note: "supportive 提供的是「底层的托举与缓冲」，从不喧宾夺主；backbone 强调的是「绝对的硬度与结构上的中心地位」，是不可或缺的核心主轴。" }]
  },

  {
    id: "backbone", w: "backbone", pos: "n.",
    core: "整个结构中最坚硬、贯穿始终、牵一发而动全身的核心承重与连接中枢",
    image: "一把伞的主干伞柄，或一栋摩天大楼的中心钢筋混凝土轴心。它不仅独自承受了系统最大的重量，还是所有向外辐射的分支的连接锚点。断了，整个系统瞬间瘫痪。",
    senses: [
      { dim: "物理架构的中枢核心", tag: "系统",
        scene: "庞大网络中存在一条承载主流量、连接各大独立区域的超级主干线，所有边缘节点最终都要汇聚到它上面传输。",
        zh: "骨干网、主干线、核心架构",
        ex: [{ en: "The Internet backbone.", zh: "互联网骨干网／承载全球核心数据流量的高速光纤通道，一旦受损大面积断网。" }] },
      { dim: "组织或团体的绝对主力", tag: "群体",
        scene: "团队中承担了最沉重、最核心工作的那部分人。他们可能不是最顶层的决策者，但构成了维持组织运转不可或缺的基础底座。",
        zh: "骨干力量、中坚分子",
        ex: [{ en: "Small businesses are the backbone of the economy.", zh: "小企业是经济的骨干／跨国巨头最耀眼，但吸纳就业、维持底层运转的是无数小企业。" }] },
      { dim: "意志与立场的强硬支撑", tag: "心理",
        scene: "人的精神状态被具象化为一根脊椎。面临压力、威胁或诱惑时，这条「精神脊椎」保持笔直、拒绝弯曲。",
        zh: "骨气、毅力、坚定性",
        ex: [{ en: "He showed no backbone during the negotiation.", zh: "他在谈判中毫无骨气／面对压力，他的精神脊椎立刻弯曲了。" },
             { en: "You need more backbone to stand up to a bully.", zh: "要对抗欺凌者，你需要更多骨气。" }] }
    ]
  },

  {
    id: "possess", w: "possess", pos: "v.",
    core: "一种绝对的、排他性的深度控制与占据",
    image: "像一位君王稳稳盘踞在某物之上，拥有绝对支配权；或反过来，一种无形的强大力量完全接管并占据了一个人的躯壳和大脑。它比 have 或 own 沉重得多。",
    origin: "拉丁语：potis（强大的、有控制权的）+ sedere（坐）",
    parts: [["pos-", "有控制权（potis）", "prefix"], ["sess", "坐（sedere）", "root"]],
    senses: [
      { dim: "实体与资源的绝对掌控", tag: "法律",
        scene: "将某项高价值或具有法律约束力的实体（土地、财富、武器、违禁品）纳入自己的绝对控制范围，别人无法轻易染指。",
        feature: "具有排他性的实际占有权，常带法律或权力的严肃色彩。",
        zh: "占有、拥有、持有",
        ex: [{ en: "He possesses a large fortune.", zh: "他拥有一大笔财富。" },
             { en: "He was arrested for possessing an illegal weapon.", zh: "他因持有非法武器被捕。" }] },
      { dim: "内在特质与能力的深度嵌合", tag: "认知",
        scene: "一种抽象品质不是像衣服一样穿在表面，而是深深盘踞在主体内部，成为不可分割的底层架构。",
        zh: "具备、具有",
        ex: [{ en: "She possesses a rare talent for music.", zh: "她具有罕见的音乐天赋／这种天赋深深植根于她体内。" },
             { en: "The drug possesses healing properties.", zh: "这种药物具备治愈特性。" }] },
      { dim: "精神与意志的全面劫持", tag: "心理",
        scene: "主客体反转：主语不再是人，而是一种强烈情绪或超自然实体。这种无形力量侵入大脑，把理智挤出驾驶舱，彻底接管了躯体。",
        zh: "控制、支配、附身、迷住",
        ex: [{ en: "He fought like a man possessed.", zh: "他像被附身了一样战斗／理智已被狂热完全占据。" },
             { en: "What possessed you to do such a stupid thing?", zh: "究竟是什么鬼迷心窍让你做出这种蠢事？" }] }
    ],
    summary: "当你 possess 一个物品，你对它有绝对生杀大权；当一个品质被你 possess，它与你骨肉相连；当一种情绪 possess 你，你便沦为它的傀儡。"
  },

  {
    id: "tangle", w: "tangle", pos: "n./v.",
    core: "多条原本独立的线状物失去清晰轨迹，无序地扭曲穿插、死死咬合，形成难以理清的混乱团块",
    image: "装在口袋里很久的有线耳机，或一团被猫玩过的毛线球。两个本质特征：一是秩序的丧失（从平行变混乱），二是阻力的产生（越用力拉扯，结越紧）。",
    origin: "古诺斯语 þöngull（海藻）——北欧人航海时看到水下海藻总是无序交织、死死缠绕",
    senses: [
      { dim: "物理形态的无序绞合", tag: "物理",
        scene: "头发、电线、绳索等柔性细长物体在翻滚摩擦中互相穿过对方的回路，打成死结，形成坚固的物理障碍。",
        zh: "缠绕、纠结、乱作一团",
        ex: [{ en: "My hair is all tangled.", zh: "我的头发全缠结在一起了／梳子无法顺畅穿过。" },
             { en: "A tangle of wires under the desk.", zh: "桌子底下一团乱糟糟的电线。" }] },
      { dim: "逻辑与事实的错综复杂", tag: "信息",
        scene: "把线索、人际关系、谎言视作一根根线。当它们被刻意隐瞒、叠加或冲突时，真相就被包裹在一个「逻辑毛线球」的中心，外人找不到抽丝剥茧的线头。",
        zh: "混乱的局面、错综复杂的情况",
        ex: [{ en: "A tangle of lies.", zh: "错综复杂的谎言／谎言 A 掩盖谎言 B，谎言 C 又与 A 矛盾，咬合成一团乱麻。" },
             { en: "The legal case is a hopeless tangle.", zh: "这起案件是一团毫无头绪的乱麻。" }] },
      { dim: "人际关系的摩擦与锁定", tag: "冲突",
        scene: "两个人的利益轨迹或肢体动作发生交叉，像两根带刺的藤蔓绞在一起，产生剧烈摩擦，双方都难以抽身。",
        zh: "发生纠纷、与之纠缠、打斗（常与 with 连用）",
        ex: [{ en: "You don't want to tangle with him.", zh: "你不会想和他发生纠缠的／不要让轨迹和他交叉，否则会被死死咬住。" }] }
    ],
    contrasts: [
      { w: "weave", note: "weave 是有规律、带美感地交错；tangle 永远带一种令人沮丧的失控感。" },
      { w: "tangible", note: "⚠️ 完全没有关系，只是碰巧都以 tang 开头。tangle 源自古诺斯语「海藻」，tangible 源自拉丁语 tangere「触摸」，两条毫无交集的平行线。tangle 的形容词形式是 tangled，不是 tangible。" }
    ]
  },

  {
    id: "tangible", w: "tangible", pos: "adj.",
    core: "具有坚实的物理轮廓或绝对的逻辑重量，手（或大脑）伸过去时能切实感受到阻力、质感与明确边界",
    image: "伸出一只手去拍打一面坚固的墙壁。它不是虚无缥缈的幻影，而是实实在在能被「抓死」的锚点。反义词 intangible 则像空气或磁场——客观存在甚至影响巨大，但手指会直接穿透过去。",
    origin: "拉丁语 tangere（触摸），同族词还有 contact（接触）、tangent（切线，刚好「触碰」圆的那条线）",
    parts: [["tang", "触摸", "root"], ["-ible", "可…的", "suffix"]],
    rootRefs: ["able"],
    senses: [
      { dim: "物理与商业的形态虚实", tag: "商业",
        scene: "评估价值时区分：哪些是看得见摸得着能称重的实体（机器、黄金），哪些是看不见但极具价值的代码、品牌声誉或文化属性。",
        zh: "有形的、实体的（反：无形的、非物质的）",
        ex: [{ en: "Tangible assets.", zh: "有形资产／厂房、车辆等能被物理触摸的财产。" },
             { en: "Intangible cultural heritage.", zh: "非物质文化遗产／剪纸技艺或京剧唱腔，无法在物理上触摸这种抽象技艺本身。" }] },
      { dim: "认知与证据的握持感", tag: "论证",
        scene: "有些证据像一把带血的刀或厚厚的现金，你的逻辑能死死握住它；有些只是模糊的氛围、直觉或画出的大饼，逻辑抓不住。",
        zh: "确凿的、切实的（反：难以捉摸的、难以量化的）",
        ex: [{ en: "We need tangible proof.", zh: "我们需要确凿的证据／拒绝捕风捉影，必须拿出能摆上桌面的铁证。" },
             { en: "Tangible benefits.", zh: "切实的利益／能直接看到数字增长的好处，拒绝空头支票。" },
             { en: "An intangible feeling of sadness.", zh: "一种难以名状的悲伤／能感受到磁场，但无法指出它在哪、有多重。" }] }
    ],
    contrasts: [{ w: "tangle", note: "⚠️ 只是拼写相似，词源毫无关系。看到 tangle 想「一堆互相打死结的海藻」，看到 tangible 想「伸手拍打一面墙」。" }],
    summary: "在英语的底层思维里，「触摸（tang-）」常等价于「确认、理解或掌控」——就像中文说「我摸清了情况」。抓得住、有阻力的是 tangible；穿指而过、弥漫在周围的是 intangible。"
  },

  {
    id: "plausible", w: "plausible", pos: "adj.",
    core: "逻辑表面严丝合缝、乍一听顺理成章足以让人点头，但内部真实性尚未被刺穿或验证",
    image: "一种「大脑的视觉欺骗」：故事在逻辑表面打磨得极其光滑，没有明显漏洞（不像胡言乱语那样一眼假），以至于理智会暂时「鼓掌通过」。它是一件逻辑隐身衣——可以披在真理身上，也可以披在谎言身上。",
    origin: "拉丁语 plaudere（鼓掌），原意「值得鼓掌的、被认可的」",
    senses: [
      { dim: "客观推理与现象解释", tag: "中性",
        scene: "面对未知谜团，有人提出一种假设，完美契合目前已知的所有线索，是目前最像真相的候选者。",
        feature: "逻辑自洽性和现实可行性极高，但尚未得到最终的排他性证明。",
        zh: "貌似合理的、似乎可信的",
        ex: [{ en: "A plausible explanation for the plane crash.", zh: "对坠机事件一个似乎合理的解释／逻辑链条完整，挑不出毛病。" },
             { en: "It is a plausible scenario.", zh: "这是一个极可能发生的情景。" }] },
      { dim: "话术包装与恶意欺骗", tag: "负面",
        scene: "骗子精心编造一个极其圆滑的借口，在逻辑上滴水不漏——哪怕你心里怀疑他在说谎，表面上也无法立刻抓到破绽来反驳。",
        zh: "冠冕堂皇的、巧言令色的",
        ex: [{ en: "A plausible liar.", zh: "一个说话滴水不漏的骗子／他说谎时极其顺滑。" },
             { en: "A plausible excuse.", zh: "一个冠冕堂皇的借口。" }] },
      { dim: "政治与规则的完美免责", tag: "制度",
        scene: "在政治或高管操作中故意不留书面记录，使得下属做脏活被抓时，高层可以抛出一个听起来完全合乎逻辑的理由证明自己不知情。",
        zh: "合理的推诿（Plausible deniability）",
        ex: [{ en: "Plausible deniability.", zh: "合理推诿／哪怕大家都猜到是他干的，他否认时的说辞在逻辑上依然完美，法律拿他没办法。" }] }
    ],
    contrasts: [
      { w: "valid", note: "plausible 侧重「表面看过去的顺滑感」，是一件没有破绽的外衣，能骗过眼睛；valid 侧重「内核结构的坚硬度与授权」，是打入地下的钢筋混凝土。一个骗子的借口可以非常 plausible，但经警方核实证人是假的之后，它在法庭上就不是 valid。" },
      { w: "rigorous", note: "概率阶梯：possible（概率大于 0，不需逻辑支撑）＜ plausible（逻辑外壳严丝合缝，但经不起极限施压）＜ true（经过 rigorous 检验，确认为客观事实）。" }
    ]
  },

  {
    id: "valid", w: "valid", pos: "adj.",
    core: "因内部结构坚实（逻辑严密）或外部手续完备（规则授权），在特定系统中站得住脚、被正式接纳并产生实际效力",
    image: "一份盖着最高权力机关钢印的通行证，或一栋地基打得极深、怎么推都推不倒的建筑。强调一种不容置疑的合法性与硬度。",
    origin: "拉丁语 valere（强壮的、有力的）",
    senses: [
      { dim: "规则与行政系统的授权", tag: "法律",
        scene: "向系统提交一份凭证（护照、车票、密码），因为格式、日期、印章完全符合底层规则要求，系统立刻亮起绿灯予以放行。",
        feature: "具备官方或系统认可的法定效力，未过期、未被篡改。",
        zh: "有效的、具有法律效力的",
        ex: [{ en: "A valid passport.", zh: "有效的护照／盖着权威机构的钢印且在保质期内。" },
             { en: "Please enter a valid password.", zh: "请输入有效的密码／字符串结构符合服务器的准入规则。" }] },
      { dim: "逻辑与辩论系统的支撑", tag: "论证",
        scene: "有人抛出一个观点，它不是用纸糊的，底部有坚实的事实数据或严密的逻辑链条作支撑。对手试图反驳时发现它像承重墙一样推不倒。",
        zh: "站得住脚的、正当的、合理的",
        ex: [{ en: "You make a valid point.", zh: "你提出了一个站得住脚的观点／底层逻辑坚实，我无法推翻。" },
             { en: "A valid excuse for being late.", zh: "迟到的正当理由／比如发生车祸，具有绝对的客观阻力。" }] },
      { dim: "数据与科学测量的合规", tag: "科学",
        scene: "要求输入的数据或测试方法必须精准对齐某种结构化标准。完全符合模具形状就是「合规」；成功测出了它本该测量的东西就是「具效度」。",
        zh: "合规的、具效度的",
        ex: [{ en: "Valid JSON data.", zh: "合规的 JSON 数据／括号和逗号完全符合计算机解析的刚性结构要求。" },
             { en: "The test is scientifically valid.", zh: "这项测试在科学上是具效度的／指针切实测出了它号称要测的变量。" }] }
    ],
    contrasts: [{ w: "plausible", note: "plausible 是能骗过眼睛的外衣；valid 是系统直接承认的底层代码。" }]
  },

{
    id: "rational", w: "rational", pos: "adj.",
    core: "一切交由逻辑、客观事实或精确的比例进行计算与校准，完全剥离情感冲动、直觉与无序的随机性",
    image: "一台没有感情的 CPU，或一架高精度天平。面对任何输入，它绝不依靠感觉来晃动指针，而是严格按照因果关系或数学公式称量，输出最优解。",
    origin: "拉丁语 ratio（计算、比例）",
    senses: [
      { dim: "人类认知与决策的情绪剥离", tag: "心理",
        scene: "面对危机、诱惑或选择时，大脑中的情感模块被强制关闭，逻辑计算模块接管控制权，像机器一样评估利弊与客观概率。",
        feature: "行为与思想由逻辑驱动，免疫情绪干扰。",
        zh: "理性的、理智的、头脑清醒的",
        ex: [{ en: "A rational decision.", zh: "一个理性的决定／经过利弊计算和事实考量得出的最优解，而非冲动拍脑门。" },
             { en: "Man is a rational animal.", zh: "人是理性的动物。" }] },
      { dim: "论证与系统的因果闭环", tag: "逻辑",
        scene: "一个解释或一套制度，内部每个环节都能用「因为 A 所以 B」的链条死死扣住，不存在神秘主义的跳跃，也不存在自相矛盾的断层。",
        feature: "内部结构严密，符合客观规律，没有逻辑缝隙。",
        zh: "合乎逻辑的、有理有据的",
        ex: [{ en: "A rational explanation.", zh: "一个合乎逻辑的解释／各节点基于事实，推理过程严丝合缝。" },
             { en: "A rational design.", zh: "一种合理的设计／每个结构的存在都有明确可推导的功能目的。" }] },
      { dim: "数量的精确切分与比例化", tag: "数学",
        scene: "该词最原始的图景。一个数如果能被完美切分为两个整数的比例（1/2、3/4），它就处于秩序井然、可被精确计算的状态；无理数 π 则是无限不循环的混乱。",
        zh: "有理的（数学专用）",
        ex: [{ en: "A rational number.", zh: "有理数／可表示为两个整数之比，代表一种数学上的规则与比例美感。" }] }
    ],
    contrasts: [{ w: "reasonable", note: "reasonable 带有「人情味」与社会属性，意味着不过分、公平、大家都能接受（这个价格很 reasonable＝公道）；rational 带有「机器般冷酷」的属性，只关心 A 能否推导出 B。「他的裁员计划在商业上绝对 rational，但在情感上令人难以接受」。" },
                { w: "rigorous", note: "rational 关心「逻辑是否成立」，rigorous 关心「检验是否够狠」。" }]
  },

  {
    id: "even", w: "even", pos: "adj./adv.",
    core: "绝对的平齐，以及所有落差、凸起或差异的彻底消除",
    image: "一台重型压路机，或一架两端绝对静止平衡的天平。它的使命就是把一切高低不平的地表、不均等的资源、或突兀的特例，强行碾压成一条没有任何波动的水平线。",
    senses: [
      { dim: "物理表面的凸起消除", tag: "形态",
        scene: "原本崎岖不平的路面，经过打磨或铺设，所有最高点和最低点都被削平或填满，形成一条绝对的直线。",
        zh: "平的、平坦的",
        ex: [{ en: "Find an even surface to work on.", zh: "找一个平坦的表面工作／视线扫过去没有任何物理凸起。" }] },
      { dim: "数量与利益的绝对平衡", tag: "分配",
        scene: "把一堆资源分配给多个人，或两支球队比赛。压路机驶过，抹平了「多与少」「强与弱」的差异，天平两端完全等高。",
        zh: "平均的、相等的、平局的",
        ex: [{ en: "An even distribution of wealth.", zh: "财富的平均分配／每个人拿到的份额被削成了同样的高度。" },
             { en: "The score is even.", zh: "比分平局／双方的得分柱状图一样高。" }] },
      { dim: "数学秩序的完美对折", tag: "数学",
        scene: "一个数字被 2 劈成两半后两边一样大，没有多出来一个孤零零凸出来的尾巴（余数）。",
        zh: "偶数的",
        ex: [{ en: "2, 4, 6 are even numbers.", zh: "2、4、6 是偶数／切开后完美平齐。" }] },
      { dim: "情绪与节奏的波澜不惊", tag: "心理",
        scene: "人的心电图、呼吸频率或脾气不再有剧烈的波峰（狂怒）和波谷（抑郁），而是在一条稳定的基准线上匀速前行。",
        zh: "均匀的、心平气和的",
        ex: [{ en: "An even temper.", zh: "平和的脾气／情绪的压路机把所有冲动的尖刺都压平了。" },
             { en: "Even breathing.", zh: "均匀的呼吸。" }] },
      { dim: "心理预期的强制抹平", tag: "副词",
        scene: "这是最让初学者困惑的用法。想象你的心理预期有一道门槛——你觉得某件事只有特定的人能做到。此时 even 像压路机驶来，把这道门槛碾平，把最不可能的极端特例也拉到了和普通事物完全平齐的位置。",
        feature: "彻底消除例外，打破预期的边界，强调极端的包容性。",
        zh: "甚至、连……都",
        ex: [{ en: "Even a child knows that.", zh: "连小孩都知道／大人和小孩在知识储备上的落差被强行抹平了。" },
             { en: "He didn't even look at me.", zh: "他甚至都没看我一眼／「打招呼」的最低动作门槛被抹平到了绝对的零。" }] }
    ],
    contrasts: [{ w: "odd", note: "一对逻辑上极度完美的镜像：even 是抹平一切落差，odd 是那个无法被抹平的孤立凸起。" }],
    summary: "中国学生常把 even 割裂成两个毫无关系的词：形容词「平的/偶数的」和副词「甚至」。掌握「重型压路机把一切落差与例外强行碾平」这个图景，所有释义瞬间贯通：压平物理落差＝平坦，压平数字落差＝平局/偶数，压平情绪落差＝平和，压平预期落差＝甚至。"
  },

  {
    id: "odd", w: "odd", pos: "adj./n.",
    core: "在原本应该对称、平齐或完美的秩序中，多出来的一个无法被配对、显得极其突兀的「孤立凸起物」",
    image: "一双鞋子里丢了一只的那个剩下的单只，或在平滑路面上突然凸起的一块石头。本质就是「打破对称、无法融入既定模式的剩余物」。",
    origin: "古诺斯语 oddi（三角形的第三个尖角）——正方形切两半是完美的，三角形切开后总有一个尖角落单",
    senses: [
      { dim: "数学秩序的无法对折", tag: "数学",
        scene: "把一个数字试图平均分成两份，每次切分后天平上总有一个单位多出来，孤零零站在一旁，导致两边无法绝对平齐。",
        zh: "奇数的、单数的",
        ex: [{ en: "1, 3, 5 are odd numbers.", zh: "1、3、5 是奇数／永远会有一个单位落单。" }] },
      { dim: "物理成对关系的残缺", tag: "配套",
        scene: "原本应该成双成对存在的物品，因为遗失或错位，剩下的那一个没有了伴侣，显得极度不协调且无法发挥正常功能。",
        zh: "单只的、不成对的、不配套的",
        ex: [{ en: "An odd sock.", zh: "一只单只的袜子。" },
             { en: "They are wearing odd shoes.", zh: "他们穿着不配套的鞋。" }] },
      { dim: "常规预期与逻辑的偏离", tag: "认知",
        scene: "社会运转通常有一条平滑可预测的常规轨迹。但某个人或某件事像那块凸出路面的石头，完全不符合这个模式，「刺」了出来，引起警觉和不解。",
        zh: "奇怪的、反常的、古怪的",
        ex: [{ en: "He has some odd habits.", zh: "他有一些古怪的习惯／行为偏离了大众平齐的常态。" },
             { en: "It's odd that she didn't call.", zh: "她没打电话来，这很奇怪／逻辑轨迹上的一个异常凸起。" }] },
      { dim: "结构与时间的碎片化", tag: "时间",
        scene: "像一整块布料裁完大件衣服后剩下的边角料。在时间和工作中，指那些无法塞进正常连续主轴计划里、只能见缝插针的零碎片段。",
        zh: "零散的、临时的、不固定的",
        ex: [{ en: "He does odd jobs to make a living.", zh: "他靠打零工谋生／干的不是朝九晚五的稳定长工。" },
             { en: "I read it in my odd moments.", zh: "我在零星时间读它。" }] },
      { dim: "天平的倾斜与较量", tag: "复数 odds",
        scene: "变成复数 odds 时图景回到天平。两边平齐（even）概率就是 50/50；出现落单多出来的一块（odd），天平就会倾斜。倾斜的程度成了「概率」，无法平齐的抗衡成了「冲突」。",
        zh: "可能性、几率；（处于）不和",
        ex: [{ en: "The odds are in our favor.", zh: "几率对我们有利／概率的天平向我们这边倾斜了。" },
             { en: "He is at odds with his boss.", zh: "他与老板意见不合／两人处于无法平齐、相互碰撞的错位状态。" }] }
    ],
    contrasts: [{ w: "even", note: "even 是压路机抹平一切；odd 是那个抹不平的孤立凸起。" }],
    summary: "不要单独去背「奇数」「古怪」「零工」。脑海里建立一个画面——一条原本平滑的直线上突然出现一个无法抹平的孤立凸出点。在数学里它叫奇数，在物品中叫单只，在常理中叫奇怪，在时间中叫零碎。"
  },

  {
    id: "consider", w: "consider", pos: "v.",
    core: "将某人、某物或某个变量拉入视线的绝对中心，进行长时间、多角度的深层审视与称量，拒绝草率定论",
    image: "古代航海家或占星师在夜间停下脚步，长时间凝视、研究星象以决定下一步航向。因此 consider 的基因里带有一种「凝重感」和时间上的延展性——它绝不是眼神的随便一扫，而是把事物放上了大脑中的精密天平。",
    origin: "拉丁语 considerare：com-（一起）+ sidus/sider-（星辰）",
    parts: [["con-", "一起", "prefix"], ["sider", "星辰", "root"]],
    rootRefs: ["com"],
    senses: [
      { dim: "观测的过程：悬而未决的权衡", tag: "决策",
        scene: "结论尚未得出，注意力死死锁定在一个提议或问题上，大脑正在对其进行 360 度扫描，计算各种利弊和可能性。",
        feature: "动态的、持续的运算过程，排除了冲动和轻率。",
        zh: "考虑、细想、权衡",
        ex: [{ en: "I will consider your offer.", zh: "我会考虑你的提议／不会立刻答应或拒绝，会放上天平仔细称量。" },
             { en: "We are considering moving to Japan.", zh: "我们正在考虑搬到日本。" }] },
      { dim: "观测的终局：盖棺定论的标签", tag: "评判",
        scene: "漫长严谨的「星象观测」结束了，天平停止晃动。主体基于刚才的审视得出坚固的结论，把一个最终标签贴在该事物上。",
        feature: "静态的结果，代表一种深思熟虑后的认定。",
        zh: "认为、把……看作",
        ex: [{ en: "We consider him a genius.", zh: "我们认为他是个天才／不是第一眼的直觉，而是长期观察后赋予的终局定性。" },
             { en: "This painting is considered a masterpiece.", zh: "这幅画被奉为杰作。" }] },
      { dim: "变量的纳入：对客观存在的尊重", tag: "全局",
        scene: "推进行动时，没有像戴着眼罩的马一样只盯着终点，而是主动把旁人的感受、客观的限制条件一并拉入观测视野，承认它们的重量。",
        zh: "考虑到、顾及、体谅",
        ex: [{ en: "You must consider her feelings.", zh: "你必须顾及她的感受／要把她的情绪作为一个有重量的星体纳入你的星盘运算。" },
             { en: "Considering his age, he did a great job.", zh: "考虑到他的年龄，他做得很棒。" }] }
    ],
    contrasts: [
      { w: "regard", note: "consider 的工具是「天平」——强调客观理性的运算过程，称量了能力和数据后得出结论；regard 的工具是「目光/滤镜」——强调主观的视角和态度，不一定做过严密称量，但在立场上就是用那种眼光看他。一个是机器般地「得出结论」，一个是带有温度地「看待事物」。" },
      { w: "guess", note: "guess 是在黑暗中盲目射出一箭，没有数据支撑；think 门槛极低，随时可以冒出一个念头；consider 带有极高的庄重感，潜台词是「我经过严谨打磨、排除干扰、认真评估之后才得出这个结论」。" }
    ]
  },

  {
    id: "regard", w: "regard", pos: "v./n.",
    core: "带有特定态度、情感或价值评判的持续目光注视与聚焦",
    image: "将视线死死锁定在一个目标上，不是一扫而过，而是带着某种强烈的关注去端详它。",
    origin: "re-（持续地、回溯地）+ gard/guard（看守、警觉、注视，与 guard 保镖同源）",
    parts: [["re-", "持续地", "prefix"], ["gard", "注视", "root"]],
    senses: [
      { dim: "物理层面的视觉聚焦", tag: "视觉",
        scene: "最原始的物理动作。眼睛像探照灯一样打在客体身上上下打量，目光中通常包裹着某种特定情绪（怀疑、冷漠、爱慕）。",
        zh: "注视、端详、凝视",
        ex: [{ en: "He regarded her with suspicion.", zh: "他用怀疑的目光注视着她。" }] },
      { dim: "认知层面的滤镜叠加", tag: "评价",
        scene: "「目光」从物理的眼睛变成心眼。当你注视一个人时，你在视线上加了一层滤镜，透过这层滤镜他在你眼里就成了特定的人。",
        zh: "把……看作、认为（regard A as B）",
        ex: [{ en: "I regard him as my best friend.", zh: "我把他看作最好的朋友／我是透过「挚友」的滤镜去端详他的。" },
             { en: "Capital punishment is regarded as inhuman in some countries.", zh: "在一些国家死刑被视为不人道的。" }] },
      { dim: "价值层面的目光重量", tag: "态度",
        scene: "如果你愿意长久注视某物而不是无视它，意味着它在你的世界里占据了重量。目光向上仰视就成了尊敬；目光直接移开就成了漠视。",
        zh: "尊重、重视、关注",
        ex: [{ en: "I hold him in high regard.", zh: "我非常尊重他／我用极高的、仰视的目光注视着他。" },
             { en: "He has no regard for the law.", zh: "他完全无视法律／目光直接略过，不赋予其任何重量。" }] },
      { dim: "社交层面的视线传递", tag: "礼仪",
        scene: "在书信结尾或托人带话时，你无法亲自用善意的目光注视对方，于是把这种目光打包，通过信件或第三人传递过去。",
        zh: "问候、致意（复数 regards）",
        ex: [{ en: "Give my regards to your family.", zh: "代我向你的家人致意。" },
             { en: "Best regards.", zh: "最诚挚的问候／邮件结尾语：投去我最美好的注视。" }] },
      { dim: "逻辑层面的视线指引", tag: "话题",
        scene: "讨论复杂问题时，主讲人像拿着激光笔，指挥所有人的目光：「现在请把视线转向这个方向。」",
        zh: "关于、至于（regarding, with regard to）",
        ex: [{ en: "Regarding your request, we have made a decision.", zh: "关于你的请求，我们已做出决定。" }] }
    ],
    contrasts: [{ w: "disregard", note: "disregard 是 regard 的精确反面：主动把目光移开，在心理天平上把它的重量清零。" }]
  },

  {
    id: "disregard", w: "disregard", pos: "v./n.",
    core: "在完全知情的情况下，主动将目光移开，强行剥夺客体的存在感与重量，将其降级为「空气」",
    image: "你明明看到了那个红灯、听到了那句警告、收到了那封邮件，但你刻意转过头去，在心理天平上直接把它的重量清零。注意：它不是因为粗心没看见（那是 overlook），而是主动、刻意的「视而不见」。",
    origin: "dis-（相反、剥离）+ regard（注视/重视）",
    parts: [["dis-", "剥离", "prefix"], ["regard", "注视", "root"]],
    senses: [
      { dim: "信息与指令的阻断", tag: "执行",
        scene: "接收到一段信息或指令，但在大脑处理的下一秒直接将其扔进废纸篓，不让它影响后续任何动作。",
        zh: "不理会、忽略、作废",
        ex: [{ en: "Please disregard my last email.", zh: "请忽略我的上一封邮件／请把它在你脑海中的重量清零，当它没存在过。" },
             { en: "The jury was told to disregard the witness's statement.", zh: "陪审团被告知不予理会证人的陈述／必须将该证词剥离出逻辑天平。" }] },
      { dim: "规则与权威的践踏", tag: "法律",
        scene: "法律或安全警告像立在路中间的石碑。主体看到了石碑，但拒绝用敬畏的目光注视它，直接踩着油门碾压过去。",
        zh: "漠视、无视、不顾",
        ex: [{ en: "He drove with total disregard for the speed limit.", zh: "他完全无视限速驾驶／限速牌在他眼里没有任何约束的重量。" },
             { en: "A reckless disregard for safety.", zh: "对安全极其鲁莽的漠视。" }] },
      { dim: "生命与情感的冷血对待", tag: "道德",
        scene: "他人的痛苦或生命权本应获得沉甸甸的尊重，但主体抽走了这种共情的目光，把对方降维成没有痛觉的数字。",
        zh: "怠慢、冷漠对待、不尊重",
        ex: [{ en: "The dictator showed a cruel disregard for human life.", zh: "独裁者表现出对人命的残酷漠视／在他的注视下，人命轻如鸿毛。" }] }
    ],
    contrasts: [
      { w: "regard", note: "正是 regard 的反向动作。" },
      { w: "ignore", note: "手机响了：neglect 是你在厨房忙碌漏接了（被动、责任缺失）；ignore 是你看到来电但把手机扣在桌上假装没听见（主动的感官屏蔽）；disregard 是你拿起手机看到是诈骗电话，判定它毫无价值并按下拒接（观察评估后主动剥夺其效力）。法官说 disregard 证词，绝不能用 ignore 代替。" }
    ]
  },

  {
    id: "ignore", w: "ignore", pos: "v.",
    core: "主动关闭感官或注意力的接收通道，对试图进入意识的外部刺激进行硬性屏蔽，假装其完全不存在",
    image: "戴上一副强力降噪耳机，或在眼前重重拉下一道铁闸。本质是一种「刻意制造的认知盲区」——它不涉及深层的价值评判，单纯就是最基础的「拒收」。",
    origin: "拉丁语 ignorare（不知道、处于无知状态），与 ignorant 同源",
    senses: [
      { dim: "社交与感官的硬性隔离", tag: "社交",
        scene: "面对刺耳的噪音、他人的呼喊或令人不适的目光，主体收回所有反馈机制：不给眼神交汇，不给言语回应，仿佛在自己周围建起一道隐形的真空玻璃罩。",
        zh: "不理睬、不顾、无视",
        ex: [{ en: "She ignored him completely.", zh: "她完全不理睬他／无论他怎么搭话，注意力闸门始终紧闭。" },
             { en: "Try to ignore the noise outside.", zh: "尽量屏蔽外面的噪音。" }] },
      { dim: "事实与警告的掩耳盗铃", tag: "决策",
        scene: "危险信号已经出现并在疯狂敲门，但主体为了维持现状或出于逃避心理，拒绝睁开眼睛去看，假装天下太平。",
        feature: "面对客观事实时的刻意盲目，通常导致负面后果。",
        zh: "对……置之不理、忽视",
        ex: [{ en: "You cannot ignore the facts.", zh: "你不能无视事实。" },
             { en: "He ignored the doctor's advice.", zh: "他把医生的建议当耳旁风／建议传到了耳朵里，但被大脑的防火墙直接拦截。" }] }
    ],
    contrasts: [{ w: "disregard", note: "ignore 的核心是「注意力的屏蔽」（消极的隔断）；disregard 的核心是「权重的绝对清零」（主动、甚至带攻击性或权威性的判决）；neglect 的核心是「责任的失位」（被动的、因精力分散造成的失职）。" }]
  },

  {
    id: "intrigue", w: "intrigue", pos: "v./n.",
    core: "一张半遮半掩、错综复杂的迷宫之网——要么散发磁力引诱你走进去解谜，要么是几个人躲在暗处编织这张算计他人的网",
    image: "它与 intricate（错综复杂的）同源，底层基因里带有「缠结、复杂、隐秘」的意味。所以它绝不是普通的 attract（吸引）或 interest（兴趣），而是与「未知、悬念、复杂逻辑」深度绑定。",
    senses: [
      { dim: "认知与心理的深度勾引", tag: "吸引",
        scene: "某个事物向你展示了冰山一角，剩下的隐藏在迷雾中。这种「信息缺口」和复杂的内部构造像钩子一样死死勾住你的注意力，激活了强烈的解谜欲。",
        zh: "激起……的强烈好奇心、迷住",
        ex: [{ en: "The strange phenomenon intrigued the scientists.", zh: "这种奇异现象激起了科学家们的极大好奇／背后错综复杂的未知逻辑勾住了他们。" },
             { en: "I am intrigued by your plan.", zh: "我对你的计划非常感兴趣／里面有某种精妙或神秘的设定。" }] },
      { dim: "利益与权谋的暗中交织", tag: "政治",
        scene: "镜头从「被网吸引的人」切换到「织网的人」。在权力幕后，几股势力正把谎言、利益和手段像线一样精密地缠结在一起，编织成一个陷阱。",
        zh: "阴谋、诡计、密谋",
        ex: [{ en: "Political intrigue.", zh: "政治阴谋／政客们在桌面下互相算计、利益线索错综复杂的网。" },
             { en: "A tale of mystery and intrigue.", zh: "一个充满神秘与阴谋的故事。" }] }
    ],
    contrasts: [
      { w: "tangle", note: "同源思路：intrigue 与 intricate 同源，底层都是「线的复杂交织」。tangle 是令人沮丧的失控缠结，intrigue 是引人入胜或暗藏杀机的精密缠结。" }
    ],
    summary: "吸引力的词阶：attract 最物理（像磁铁吸铁屑）；interest 侧重理性（符合你的爱好）；fascinate 侧重惊叹沉醉（像被美杜莎看了一眼）；intrigue 永远带「脑力激荡」——你被 intrigue 是因为对方抛出了悬念或反常现象，让你觉得「这事没那么简单，我要一探究竟」。"
  },

  {
    id: "ever", w: "ever", pos: "adv.",
    core: "对时间轴的极限拉伸与全量扫描，彻底消除任何时间点上的盲区",
    image: "一部全景时间雷达。它强行打破「昨天、上周、明年」这种局部刻度，将观测范围直接扩展到系统的绝对起点与绝对终点。本质是不放过时间长河中的哪怕一秒钟。",
    senses: [
      { dim: "过去时间轴的无死角检索", tag: "疑问/否定",
        scene: "将雷达波向过去发射，检索从生命起点到此时此刻的整个区间，确认某事件是否在其中任何一个微小坐标点上发生过。",
        feature: "强调时间跨度的绝对完整性，只看有或无，不关心具体时间。",
        zh: "曾经、在任何时候",
        ex: [{ en: "Have you ever been to Japan?", zh: "你去过日本吗／雷达扫描你的整个前半生，是否存在哪怕一秒钟你在日本的记录？" },
             { en: "Nothing ever happens here.", zh: "这里从来没发生过任何事／与否定词连用，构成了 never 的逻辑。" }] },
      { dim: "样本库的终极极值比对", tag: "最高级",
        scene: "评估某事物的等级时，将其与时间轴上诞生过的所有同类样本进行比对，把参照物扩大到历史的极限。",
        zh: "有史以来、空前",
        ex: [{ en: "It was the best movie ever made.", zh: "这是有史以来拍得最好的电影／比较对象是电影诞生以来的整条时间轴。" },
             { en: "As popular as ever.", zh: "和以前任何时候一样受欢迎。" }] },
      { dim: "未来时间轴的全域布控", tag: "条件",
        scene: "在未来的时间轴上撒下一张没有有效期的传感网。不限定事件发生在明天还是十年后，只要在未来无限延伸线上触碰到触发器，条件即刻成立。",
        zh: "如果有朝一日、不管在什么时间",
        ex: [{ en: "If you ever change your mind, let me know.", zh: "如果你有朝一日改变主意，告诉我／这个条件捕捉器永远开机。" }] },
      { dim: "状态向未来的无限延展", tag: "持续",
        scene: "雷达波指向未来且信号永不衰减，代表某种动作或状态在时间长河中无视阻力地持续向前，没有断点。",
        zh: "永远、不断地、始终",
        ex: [{ en: "They lived happily ever after.", zh: "他们从此永远幸福地生活在一起。" },
             { en: "An ever-increasing demand.", zh: "不断增长的需求／增长动作处于永不停歇的连续状态。" }] }
    ],
    summary: "不要把 ever 简单等同于 once。once 是在时间轴上用针扎了一个具体的孔；ever 是用荧光笔把整条时间轴从头到尾全部涂满。"
  },

  {
    id: "diplomacy", w: "diplomacy", pos: "n.",
    core: "在各方利益产生剧烈摩擦的边界上，通过精密的沟通、妥协与制衡机制充当「高阶润滑剂」，避免系统发生直接碰撞或彻底撕裂",
    image: "包裹在天鹅绒手套里的铁拳，或注入两块即将剧烈相撞的地壳板块之间的润滑油。它的本质绝不是单纯的「友善」，而是对力量与冲突的高度精确管理——承认利益冲突客观存在，但拒绝使用破坏性的暴力来解决。",
    origin: "希腊语 diplōma（折叠的公文）——最初指古代君主之间由使节携带的官方文书",
    senses: [
      { dim: "国家机器的利益博弈", tag: "政治",
        scene: "拥有独立主权和庞大武力的实体在领土、资源或意识形态上产生交锋。为避免付出「战争」这种最具破坏性的成本，双方派代表在规则框架内试探、施压、交换与缔约。",
        feature: "不流血的利益争夺与权力制衡。",
        zh: "外交、外交政策",
        ex: [{ en: "The crisis was resolved through diplomacy rather than war.", zh: "危机通过外交手段而非战争得以解决。" },
             { en: "Gunboat diplomacy.", zh: "炮舰外交／表面上是文书谈判，实际上背后停着战舰。" }] },
      { dim: "人际摩擦的降温与操控", tag: "社交",
        scene: "遇到极具争议的话题或难缠的对手时，不选择直来直去的硬刚（那会导致关系破裂），而是像外交官一样精准计算每一句话的用词、时机和对方的心理底线。",
        feature: "极高的人际敏感度与言辞掌控力，避免激化矛盾。",
        zh: "交际手腕、圆滑、处事之道",
        ex: [{ en: "It takes a lot of diplomacy to handle an angry customer.", zh: "处理愤怒的客户需要高超的交际手腕／客户的怒火是即将爆炸的地雷，你需要精确拆解引信。" },
             { en: "He answered the question with great diplomacy.", zh: "他极有策略地回答了这个问题／用完美的说辞绕开了雷区，没留下把柄。" }] }
    ],
    contrasts: [
      { w: "hypocrisy", note: "hypocrisy 是纯粹的欺骗、表里不一；diplomacy 是一门生存与博弈的艺术——不是在说谎，而是在进行「受限的真相表达」，知道哪些真话现在不能说、哪些底线必须用委婉的方式守住。丘吉尔的调侃：外交就是在告诉别人「去死吧」的时候，能让对方满心欢喜地期待这趟旅程。" },
      { w: "compromise", note: "compromise 是把自己的底线向下拉；diplomacy 是在不降低核心底线的前提下精确导航避开冲突。" }
    ],
    summary: "diplomacy 就是「在不翻脸的前提下，实现利益最大化的精确导航」。"
  },

  {
    id: "excavation", w: "excavation", pos: "n.",
    core: "使用外力打破坚实的物理表层，由外向内掏出物质，从而制造出一个空洞结构，或让深埋底层的目标物重新暴露在视线中",
    image: "一台重型挖掘机在平地上生生掏出一个巨大的地基深坑，或一位考古学家拿着刷子小心翼翼剥离千年的泥土封层。它绝不是随手刨个坑，而是一项系统性、有明确目的且通常规模宏大的「向深处索取」工程。",
    origin: "拉丁语：ex-（向外）+ cavare（挖空，与 cave 洞穴同源）",
    parts: [["ex-", "向外", "prefix"], ["cav", "挖空", "root"], ["-ation", "名词", "suffix"]],
    rootRefs: ["tion"],
    senses: [
      { dim: "物理空间的向内褫夺", tag: "工程",
        scene: "为建造地基、铺设隧道或开采矿石，动用重型机械将地表原有的土石方大面积深层移除。核心目的是「腾出空间」。",
        zh: "挖掘、开凿、土方工程",
        ex: [{ en: "The deep excavation for the new subway line.", zh: "新地铁线的深层开凿工程。" },
             { en: "Blasting techniques are used in rock excavation.", zh: "岩石挖掘中使用了爆破技术。" }] },
      { dim: "岁月掩埋物的重新唤醒", tag: "考古",
        scene: "人类的历史、文物或遗骸被泥土和时间封存。专业人员通过系统的「向外排土」，让这些被屏蔽的价值物重新跨越时间，暴露在现代人的目光下。",
        feature: "极其严谨、带有科研目的的深层搜索与剥离。",
        zh: "发掘、出土",
        ex: [{ en: "The excavation of a Roman villa.", zh: "一座罗马别墅遗址的发掘。" },
             { en: "Artifacts found during the excavation.", zh: "发掘过程中出土的文物。" }] },
      { dim: "隐秘信息的深层打捞", tag: "调查",
        scene: "把「泥土」替换为庞杂的数据、被掩盖的真相或深藏的记忆。主体像考古学家一样拨开表面的谎言，把沉在最底层的核心事实挖出来。",
        zh: "深入挖掘、探究",
        ex: [{ en: "An excavation of the company's financial history.", zh: "对该公司财务历史的深度挖掘／穿透表面财报，把真实资金流向掏出来。" }] }
    ],
    contrasts: [{ w: "dig", note: "dig 门槛极低、动作随意——狗刨土、用勺子挖冰淇淋都是 dig。excavation 带有「工业级」或「学术级」的严肃滤镜，它是一项「工程」。后院种树挖个坑叫 dig；后院挖地窖动用了挖掘机，或挖出恐龙化石并拉起警戒线，这就是 excavation。" }]
  },

  {
    id: "aristocratic", w: "aristocratic", pos: "adj.",
    core: "一座四周环绕着无形护城河的孤高堡垒——其特权、品味与地位并非通过后天竞争获取，而是源于血统的先天固化与绝对排他性",
    image: "一条将极少数人与普罗大众严格隔离的红色天鹅绒警戒线。它不仅仅代表「有钱」或「有权」，底色是继承性与排他性。",
    origin: "希腊语 aristos（最好的、最优秀的）+ kratos（统治、权力），原意「由最优秀的人统治」",
    parts: [["arist", "最优秀的", "root"], ["crat", "统治", "root"], ["-ic", "形容词", "suffix"]],
    senses: [
      { dim: "权力与血统的物理封存", tag: "社会",
        scene: "社会金字塔尖存在一个极小的圈子，掌握大量土地或世袭头衔。外人无论多努力或富有，只要没有那滴「蓝血」，就永远无法跨越护城河。",
        zh: "贵族的、贵族阶级的",
        ex: [{ en: "An aristocratic family.", zh: "一个贵族世家／权力与财富在这个家族的基因池里封闭传承。" },
             { en: "The country's aristocratic government.", zh: "该国的贵族政府。" }] },
      { dim: "审美的极致雕琢与从容", tag: "气质",
        scene: "几代人无需为生存拼搏，这种环境「蒸馏」出一种特定的行为模式：极度的优雅、对细节的苛求，以及一种毫不费力的优越感。它不需要用大金链子证明自己。",
        zh: "贵族气派的、雍容华贵的、高雅的",
        ex: [{ en: "He has an aristocratic bearing.", zh: "他有一种贵族般的举止／举手投足间有天然的从容，不受世俗急躁的侵扰。" },
             { en: "Aristocratic tastes.", zh: "贵族般的品味／不追求大众流行，而追求有历史沉淀和极高门槛的审美。" }] },
      { dim: "心理的绝对俯视与脱离", tag: "贬义",
        scene: "站在堡垒上俯视下方。长期的阶级隔离使主体对平民的疾苦产生深度共情障碍，认为自己的优秀理所当然，散发出冷漠的傲慢。",
        zh: "傲慢的、带有优越感的、脱离大众的",
        ex: [{ en: "An aristocratic disdain for manual labor.", zh: "对体力劳动那种贵族式的蔑视。" },
             { en: "Her attitude was a bit too aristocratic for this startup.", zh: "她的态度对这家初创公司来说过于「贵族化」了。" }] }
    ],
    contrasts: [{ w: "exclusionary", note: "aristocratic 的护城河是「先天传承」形成的；exclusionary 的铁闸是「刻意制定规则」拦下来的。" },
                { w: "elite", note: "rich 门槛最低，只看账户余额，中彩票的穷人今天就可以是 rich；elite 的核心是「后天筛选与能力」，靠脑力或技术在竞争中杀到塔尖；aristocratic 的核心是「先天的传承与毫不费力」——它看不起 purely rich（认为那是暴发户），也未必像 elite 那样需要亲自去卷。" }]
  },

  {
    id: "exclusionary", w: "exclusionary", pos: "adj.",
    core: "主动且刻意地降下一道坚固的铁闸，将特定的人、群体或事物强行挡在系统之外，剥夺其进入、参与或共享资源的资格",
    image: "一个站在俱乐部大门口、按照黑名单冷酷地把人往外推并重重关上大门的守卫。它代表一种具有破坏性、攻击性或高度防御性的隔离机制。",
    origin: "ex-（向外）+ claudere（关闭）",
    parts: [["ex-", "向外", "prefix"], ["clus", "关闭", "root"], ["-ionary", "形容词", "suffix"]],
    senses: [
      { dim: "社会与政策的群体隔离", tag: "社会",
        scene: "一个社区或政府制定一套规则（极高的会员费、特定的种族限制、严苛的分区法律），根本目的不是提升自身质量，而是精准拦截某些弱势群体，防止他们分享资源。",
        feature: "具有歧视性或不公平的群体排斥。",
        zh: "排他的、排斥性的",
        ex: [{ en: "Exclusionary zoning laws.", zh: "排他性的区划法律／规定某片区域只能建大户型别墅，从而把低收入群体拒之门外。" },
             { en: "An exclusionary immigration policy.", zh: "排斥性的移民政策。" }] },
      { dim: "商业与市场的垄断封锁", tag: "经济",
        scene: "处于统治地位的巨头利用体量逼迫供应商签「二选一」协议，或切断对手的销售渠道，把竞争对手关在市场大门外使其窒息。",
        zh: "排他性的（商业手段）",
        ex: [{ en: "Exclusionary business practices.", zh: "排他性商业行为／旨在堵死竞争对手生存空间的恶性手段。" }] },
      { dim: "法律与逻辑的硬性过滤", tag: "法律",
        scene: "法官像一台过滤器。如果警察搜查证据时没有搜查令（程序违法），无论这个证据多重要，法庭的大门都会对它死死关上。",
        zh: "排除的（法律术语）",
        ex: [{ en: "The exclusionary rule.", zh: "非法证据排除规则／强行将违规获取的证据踢出法庭。" }] }
    ],
    contrasts: [{ w: "exclusive", note: "同源但情感色彩截然相反，这是中国学生最容易用错的地方。exclusive 的视角在「门内」——强调门槛高导致的稀缺感与特权感，通常是令人向往的褒义（An exclusive interview 独家专访）；exclusionary 的视角在「门外」——强调规则制定者的恶意拦截与不公平剥夺，带强烈贬义。想炫耀某物难得、高级用 exclusive；想控诉系统不公平、搞歧视用 exclusionary。" }]
  },

  {
    id: "enact", w: "enact", pos: "v.",
    core: "将停留在纸面上的抽象文字，强制注入现实的力量或生命力，使其转化为具有绝对约束力的规则或真实发生的物理动作",
    image: "最高权力机关在一份静静躺在桌上的草案上重重盖下一枚钢印——在那一瞬间，纸上的文字「活」了过来，变成一张笼罩社会的激光网。或想象演员拿着死板的剧本走上舞台，用肉体和声音让文字变成真实的呼吸和动作。",
    origin: "en-（进入……状态、使之成为）+ act（行动、法令）",
    parts: [["en-", "使成为", "prefix"], ["act", "行动/法令", "root"]],
    senses: [
      { dim: "文本向规则的强制转化", tag: "法律",
        scene: "议会经过漫长辩论最终对一项法案投下赞成票并签字。在生效的瞬间，这份原本毫无杀伤力的建议书被注入了国家机器的强制力，成为铁律。",
        feature: "赋予文本以法定效力，使其对现实世界产生强制性干预。",
        zh: "颁布、制定（法律）、通过（法案）",
        ex: [{ en: "The government enacted a new tax law.", zh: "政府颁布了一项新税法。" },
             { en: "Congress failed to enact the legislation.", zh: "国会未能通过该项立法／没能给草案注入生命力，它依然只是一堆废纸。" }] },
      { dim: "文本向动作的物理重构", tag: "戏剧",
        scene: "导演喊下 Action，演员将白纸黑字的台词用肢体语言在现实空间中呈现出来；或人们穿上古代衣服重新打了一仗。",
        zh: "上演、表演、展现",
        ex: [{ en: "The children enacted a fairy tale.", zh: "孩子们表演了一出童话。" },
             { en: "They will re-enact the famous battle this weekend.", zh: "他们这个周末将重演那场著名的战役。" }] },
      { dim: "事件在现实中的展开", tag: "状态",
        scene: "某个事件像一场已经写好剧本的大戏，在现实生活的舞台上不由自主地上演了。",
        zh: "发生、上演",
        ex: [{ en: "The drama was enacted on the streets of Paris.", zh: "这场戏剧性事件在巴黎街头上演了。" }] }
    ],
    contrasts: [{ w: "pass", note: "法律生命周期的流水线：pass 强调「跨越门槛」（投票达到法定比例，走通流程，偏程序性）→ enact 强调「注入灵魂与效力」（最终签字盖章的那一刻，草案完成身份蜕变正式成为法律）→ enforce/execute 强调「物理落地」（警察拿着这把尚方宝剑去抓人或罚款）。" }]
  },

  {
    id: "entitle", w: "entitle", pos: "v.",
    core: "由系统、法律或权威机构向主体正式颁发一枚不可驳回的「特权铭牌」，使其能够理直气壮地索取某种资源或待遇",
    image: "国王将一张写着特权的羊皮纸卷轴塞进你手里。一旦握住这个卷轴，你就不再需要乞讨或竞争——你向系统索取某物时，系统有绝对的义务必须给你。",
    origin: "en-（赋予、置于……状态）+ title（头衔、法定权利、地契）",
    parts: [["en-", "赋予", "prefix"], ["title", "头衔/法定权利", "root"]],
    senses: [
      { dim: "资源与资格的硬性授权", tag: "契约",
        scene: "一份合同、一张门票或一条法律构成了那个「国王」，它向你颁发了资格证。当你拿着这个证件走到闸机前，闸机必须无条件为你打开。",
        zh: "赋予……权利、使……有资格",
        ex: [{ en: "This ticket entitles you to a free meal.", zh: "这张票使你有权享用一顿免费餐／拿着它去要，餐厅不能拒绝。" },
             { en: "Everyone is entitled to a fair trial.", zh: "每个人都有权获得公平审判。" }] },
      { dim: "文本与作品的官方冠名", tag: "出版",
        scene: "最字面的原始动作——给一本书或一幅画「赋予一个名字」，就像给刚出生的婴儿登记户口，确立它在世界上的官方标识。",
        zh: "给……题名、命名为",
        ex: [{ en: "He published a book entitled The End of History.", zh: "他出版了一本题为《历史的终结》的书。" }] },
      { dim: "心理预期的极度膨胀", tag: "贬义",
        scene: "现代英语中极高频、极具杀伤力的用法。当权利卷轴不再由法律颁发，而是主体在心里自己颁发给自己时，就形成了心理错位——头戴一顶隐形王冠，认为世界「欠」他的。",
        zh: "有特权感的、认为自己理应得到优待的（entitled）",
        ex: [{ en: "An entitled customer.", zh: "一个充满特权感的顾客／在餐厅等两分钟就大吵大闹，认为整个宇宙都该围着他转。" },
             { en: "The new generation is often accused of being entitled.", zh: "新一代人常被指责具有「特权病」。" }] }
    ],
    contrasts: [{ w: "qualify", note: "qualify 强调「门槛的跨越」——你通过了考试，硬件指标达标；empower 强调「力量的注入」——系统给了你一把剑，让你有能力劈开障碍；entitle 强调「地位的拔高与索取权」——它不关心你有没有能力，就是系统直接发给你的一张欠条，只要出示它，系统必须兑现。" }],
    summary: "entitle 的底层逻辑永远是「权利的索取」。正向使用时它是维护公平的法律基石；负向使用时它是人际交往中最令人厌恶的毒瘤。"
  },

{
    id: "especially", w: "especially", pos: "adv.",
    core: "在原本平坦的群体或常态中猛然打下一道高强度聚光灯，将某个特定个体极致放大，使其在全场形成绝对的「最高峰」",
    image: "雷达扫描图上突然跳出的那个最刺眼的红点，或一段文字中用最亮的荧光笔重重画出的底线。本质是打破平均，宣告「极值」与「焦点」的所在。",
    senses: [
      { dim: "范围的终极聚焦", tag: "归属",
        scene: "视线先扫过一个庞大平齐的整体，然后聚光灯光束瞬间收缩，精准砸在其中最具代表性或最偏爱的某一个子集上。",
        feature: "从普遍走向特殊，确立「高于其他一切」的绝对地位。",
        zh: "尤其、特别是",
        ex: [{ en: "I love all sports, especially basketball.", zh: "我热爱所有运动，尤其是篮球／聚光灯扫过所有项目，最终以最高亮度锁定篮球。" },
             { en: "The car is quite small, especially in the back.", zh: "这车挺小，尤其是后排。" }] },
      { dim: "程度的破局拉升", tag: "修饰",
        scene: "某种物理状态或心理情绪突破了日常的平均基准线，像一根刺一样突兀地扎了出来，达到非同寻常的峰值。",
        zh: "格外、特别（极其）",
        ex: [{ en: "It is especially cold today.", zh: "今天格外冷／气温跌破冬日的常规基准，冷得异乎寻常。" },
             { en: "An especially difficult problem.", zh: "一个极其困难的问题。" }] },
      { dim: "因果与条件的致命锚定", tag: "逻辑",
        scene: "在复杂的变量中，把那个最具破坏力或最具决定性的触发条件单独拎出来，置于聚光灯下。",
        zh: "尤其是当……、特别是如果……",
        ex: [{ en: "The traffic is terrible, especially when it rains.", zh: "交通糟透了，尤其是下雨的时候／下雨是触发路况瘫痪的最极端变量。" }] }
    ],
    contrasts: [{ w: "specially", note: "英语中最危险的陷阱之一。especially 的核心是「程度与聚焦」——从已有的东西里挑出最扎眼的，图景是聚光灯（I love music, especially jazz）；specially 的核心是「目的与定制」——为了某个人从零打造一个原本不存在的东西，图景是专属模具（I baked this cake specially for you，绝不能用 especially，因为不是从一堆人里把蛋糕「尤其」给他，而是特意为他制作的）。对照：This coat was designed specially for cold weather（目的定制）vs. This coat is useful, especially in cold weather（聚焦极端场景）。" }]
  },

  {
    id: "cunning", w: "cunning", pos: "adj.",
    core: "为了达成利己目的，刻意绕开正面规则，利用隐秘的技巧、欺骗或漏洞来实现降维打击的「弯曲智力」",
    image: "一只面对钢铁捕兽夹的狐狸：它不会用蛮力破坏夹子，也不会按规则走进去，而是利用极其敏锐、阴暗且灵动的智力，找到夹子旁边的隐秘地洞，不仅偷走诱饵，还让猎人一无所获。",
    origin: "古英语 cunnan（知道、懂得，与 can 同源）。它最初是绝对的褒义词，指「工匠般精湛的技艺与智慧」，后来发生了道德的黑化。",
    senses: [
      { dim: "智力与策略的阴暗弯曲", tag: "核心",
        scene: "面对障碍或对手，主体拒绝诚实直接的正面交锋。他们的算力极高，但专门用来编织谎言、设计圈套或寻找规则的盲区，兵不血刃地达成私利。",
        feature: "智商极高，但带有强烈的欺骗性、隐秘性和利己倾向。",
        zh: "狡猾的、诡诈的、老谋深算的",
        ex: [{ en: "A cunning fox.", zh: "一只狡猾的狐狸／自然界中智力与欺骗的完美结合。" },
             { en: "He used a cunning strategy to win the election.", zh: "他用了一种极其诡诈的策略赢得选举／利用了人性的弱点或规则的漏洞。" }] },
      { dim: "构造与技艺的隐秘精巧", tag: "古用法",
        scene: "词源（工匠技艺）的遗留。形容一个机械装置设计得极其巧妙，内部构造仿佛有「自己的心机」，精巧到能欺骗人的眼睛（带暗格的盒子、精密的自鸣钟）。",
        zh: "巧妙的、精巧的（褒义）",
        ex: [{ en: "A cunning mechanism.", zh: "精巧的机械装置／齿轮与杠杆的咬合如狐狸的头脑一样精密且充满玄机。" }] },
      { dim: "审美的灵动与讨喜", tag: "口语",
        scene: "当这种「小聪明」不带严重破坏力，而是出现在小孩、小动物或小物件上时，它就变成了一种让人无法生气的机灵。",
        zh: "惹人喜爱的、乖巧的、小巧玲珑的",
        ex: [{ en: "She has a cunning little smile.", zh: "她有一种狡黠可爱的微笑／透着一股「我知道你在想什么」的机灵劲儿。" },
             { en: "A cunning little cottage.", zh: "一栋别致精巧的小木屋。" }] }
    ],
    contrasts: [{ w: "clever", note: "智力坐标系：smart 的图景是「CPU 算力强」，侧重学习能力和知识储备，中性偏正面；clever 的图景是「RAM 反应快」，侧重敏捷度，遇到突发问题能立刻想出绝妙方案；cunning 的图景是「智力的黑客行为」，只在乎如何不择手段地赢。面对一个迷宫，smart 的人推导路线，clever 的人迅速试错，cunning 的人直接炸开墙壁或骗别人替他走。" }]
  },

  {
    id: "reside", w: "reside", pos: "v.",
    core: "在一个特定的物理空间或抽象系统中稳稳地「坐」下来，深深扎根并确立长期、正式的归属或存在状态",
    image: "一块沉入水底并死死锚定的巨石，或在官方档案上重重盖下的一枚常住公章。它带有一种不可轻易移动的重量感和官方感。",
    origin: "拉丁语 residere：re-（向后/强调）+ sedere（坐）",
    parts: [["re-", "强调", "prefix"], ["sid", "坐（sedere）", "root"], ["-e", "动词", "suffix"]],
    senses: [
      { dim: "物理空间的正式定居", tag: "行政",
        scene: "在某个地理位置建立长期的家。这绝不是旅游临时落脚，而是彻底安顿下来，通常意味着户籍、纳税记录或法定联系方式都锚定在这个坐标上。",
        feature: "具有持久性、合法性和行政意义上的常住状态。",
        zh: "居住、定居",
        ex: [{ en: "He resides in Singapore.", zh: "他定居在新加坡／强调这是他在法律或行政系统上的常住地。" },
             { en: "A resident alien.", zh: "外籍常住居民。" }] },
      { dim: "抽象特质的深层蛰伏", tag: "本质",
        scene: "视角从「人」切换到「特质」。某种美感、力量或意义像灵魂一样深深驻扎在客体内部，不是从外面临时贴上去的标签，而是长在骨血里的价值核心。",
        zh: "存在于、在于（常与 in 连用）",
        ex: [{ en: "The true beauty of the poem resides in its simplicity.", zh: "这首诗真正的美在于它的简洁／「美」这个特质稳稳扎根在「简洁」这片土壤中。" },
             { en: "The problem resides in the software architecture.", zh: "问题存在于软件架构中／导致崩溃的根源死死坐在底层架构里。" }] },
      { dim: "权力与责任的法定归属", tag: "系统",
        scene: "在法律或公司治理框架下，某种裁决权、控制力或责任被系统正式且排他性地「安放」在某个人或机构的肩膀上。",
        zh: "（权力、责任）归于、属于",
        ex: [{ en: "Executive power resides in the President.", zh: "行政权归属于总统／宪法将这股权力牢牢安放在总统这个职位上。" },
             { en: "The ultimate decision resides with the board of directors.", zh: "最终决定权在董事会手中。" }] }
    ],
    contrasts: [{ w: "possess", note: "同一个拉丁词根 sedere（坐）：possess 是「强大地坐在某物之上」＝占有；reside 是「稳稳地坐进某处」＝定居。" },
                { w: "live", note: "停留时间与法律色彩的三档：stay 是「一片浮萍」，极其短暂的过渡性落脚（I am staying at a hotel）；live 是「一缕炊烟」，最通用最有烟火气，涵盖吃饭睡觉（I live in London）；reside 是「一枚钢印」，极度正式冰冷，直接指向法律行政系统中的长期锚定（The suspect is known to reside at this address）。" }]
  },

  {
    id: "exert", w: "exert", pos: "v.",
    core: "将主体内部蓄积的无形能量（物理力量、权力、影响力）有意识地、重重地向外推出，并强加于外部客体之上",
    image: "一根被压缩到极致的重型弹簧突然向外释放其恐怖的张力，或一个人双脚死死抠住地面、肌肉贲张，将全部体重压在一块巨石上试图将其推动。它永远伴随着「沉重感」和「消耗感」。",
    origin: "拉丁语：ex-（向外）+ serere（连接），最初有「推出、拔出（如拔剑）」的意味",
    parts: [["ex-", "向外", "prefix"], ["ert", "推出（serere）", "root"]],
    senses: [
      { dim: "权力、压力与影响力的无形下压", tag: "核心",
        scene: "手握权力或资本的主体虽然没有直接物理接触，但通过政策、话语或制裁，将一种巨大的无形重量「压」在受体身上，迫使其屈服或改变轨迹。",
        feature: "抽象权力的实体化运作，带有强烈的向下压迫感。",
        zh: "施加（压力/影响）、行使（权力）",
        ex: [{ en: "The US government exerted heavy pressure on the company.", zh: "美国政府对该企业施加了重压。" },
             { en: "He likes to exert his authority.", zh: "他喜欢行使／耍他的威风。" },
             { en: "The moon exerts a gravitational pull on the earth.", zh: "月球对地球施加引力。" }] },
      { dim: "物理力量与脑力的剧烈倾泻", tag: "生理",
        scene: "面对沉重的物理障碍或极耗脑力的难题，主体将骨骼肌或大脑中储备的能量全部调动起来，向外进行高强度输出。",
        feature: "伴随极大的能量消耗，绝非轻松随意的动作。",
        zh: "运用、发（力）",
        ex: [{ en: "He exerted all his strength to open the heavy door.", zh: "他用尽全身力气去开那扇沉重的门。" }] },
      { dim: "自我潜能的极限压榨", tag: "反身",
        scene: "当宾语变成自己（oneself）时，图景变成「把自己当成那块巨石，强迫自己突破舒适区，把体内最后一丝潜能挤出来」。",
        zh: "尽力、努力、勉强自己",
        ex: [{ en: "You'll have to exert yourself more if you want to pass the exam.", zh: "如果想通过考试，你必须更加逼迫自己发力。" },
             { en: "Don't exert yourself too much after the surgery.", zh: "手术后不要太劳累。" }] }
    ],
    contrasts: [{ w: "apply", note: "力度分级：use 是门槛最低的「工具调用」，只陈述你借助了某物；apply 的核心图景是「表面贴合与对准」（贴膏药、把公式套用在题目上），apply pressure 可能只是把手轻轻按在伤口上止血，重在精确接触；exert 的核心图景是「能量的爆发与下压」，exert pressure 绝不是轻轻按上去，而是带着庞大重量死死压上去。" }]
  },

  {
    id: "commit", w: "commit", pos: "v.",
    core: "将某物（行动、承诺、状态或代码）彻底且不可逆地交出，并将其死死锁定在一个系统或契约之中，越过「不可折返点」",
    image: "将一份机密文件塞进一个只能进不能出的单向投递口，或在底层数据库上重重盖下「永久封卷」的钢印。一旦动作发生，主体必须承担所有后续责任或历史记录，无法轻易抹除。",
    origin: "拉丁语 committere：com-（共同）+ mittere（投递、发送），原意「交托、结合」",
    parts: [["com-", "共同", "prefix"], ["mit", "投递", "root"]],
    rootRefs: ["com"],
    senses: [
      { dim: "计算机系统的底层状态封存", tag: "IT",
        scene: "在 Git 或数据库事务中，数据修改最初只停留在暂存区，随时可撤销。执行该动作时，系统生成一个带唯一哈希值的不可变对象，将当前快照永久封存进时间线。",
        feature: "数据状态从「临时可变」转化为「永久的系统历史记录」。",
        zh: "提交（代码/事务）",
        ex: [{ en: "Commit the changes to the local repository.", zh: "将修改提交到本地仓库／给代码快照打上不可逆的钢印。" },
             { en: "A two-phase commit protocol.", zh: "两阶段提交协议／确保所有节点同时锁定事务结果，不可回滚。" }] },
      { dim: "个人未来与资源的强制绑定", tag: "意愿",
        scene: "面对长期目标或艰巨任务，主体将未来的时间、精力或资金全部投递进去，如同签下一份没有退路的契约，强行把自己绑定在这条轨道上。",
        feature: "消除其他选项，将资源和意愿单向锁定在特定目标上。",
        zh: "承诺、全身心投入、致力于（接 to）",
        ex: [{ en: "He is fully committed to his studies.", zh: "他全身心地投入到学习中／时间和精力已被死死锁定在学业上。" },
             { en: "The company has committed millions of dollars to the project.", zh: "公司已向该项目投入了数百万美元，不可撤回。" }] },
      { dim: "负面行为向现实世界的越界", tag: "法律",
        scene: "一个犯罪念头原本只停留在脑海中，但主体最终把这个念头投递到了现实世界。一旦跨过现实的边界，这个行为就永远刻在了卷宗上。",
        zh: "犯（罪、错）",
        ex: [{ en: "To commit a crime.", zh: "犯罪／将破坏法律的行为彻底落地。" }] },
      { dim: "实体向机构的强制移交", tag: "行政",
        scene: "将一个人强制移交给一个封闭性系统（精神病院、监狱），把人身自由锁定在系统的管辖边界内。",
        zh: "关进、送交、交付",
        ex: [{ en: "He was committed to a psychiatric hospital.", zh: "他被收容进精神病院。" },
             { en: "Commit the poem to memory.", zh: "把这首诗背下来／将信息强制移交并锁定在大脑的长期记忆库中。" }] }
    ],
    contrasts: [{ w: "promise", note: "promise 是「嘴上的契约」，门槛极低重量极轻，随时可能因主观意愿改变而被打破；submit 是「由下向上的呈递」（前缀 sub- 在下面），把作业或自己交给上位权威审查，核心是让渡话语权；commit 是「不可逆的系统固化」，不需要上位权威审查你，是你自己把状态强行砸进底层系统，一旦 commit 就成为系统历史不可分割的一部分。" }]
  },

  {
    id: "utilize", w: "utilize", pos: "v.",
    core: "将处于闲置状态、尚未发挥潜能的资源，或原本并非为此目的存在的客体，经过战略性调度与功能转换，强行压榨并提取出其效用价值",
    image: "一位系统架构师盯着一块尚未被分配的内存碎片，通过修改底层逻辑，将其强行转化为能承载高并发数据流的核心通道。本质绝不是单纯的「拿来操作」，而是「对资源剩余价值的发掘与效能最大化」。",
    origin: "util-（有用的，与 utility 效用同源）+ -ize（使……化）",
    parts: [["util", "有用的", "root"], ["-ize", "使…化", "suffix"]],
    senses: [
      { dim: "闲置资源的效能最大化", tag: "工程",
        scene: "面对时间、算力、资金或能源，主体没有让它们白白流失，而是设计一套机制将其 100% 投入生产流水线，转化为实际产出。",
        feature: "带有强烈的「优化」和「榨取价值」的工程学色彩。",
        zh: "利用、运用、发挥……的效用",
        ex: [{ en: "The kernel utilizes the DMA controller to offload memory copying from the CPU.", zh: "内核利用 DMA 控制器卸载 CPU 的内存拷贝负担／DMA 本就在那里，系统通过调度榨取了它的硬件效能。" },
             { en: "We must fully utilize our available resources.", zh: "我们必须充分利用现有资源。" }] },
      { dim: "客体功能的非常规转化", tag: "破局",
        scene: "常规工具缺失时，主体抓起一个原本不是干这个用的东西（或一个规则漏洞），强行赋予它新的功能属性来解决危机。",
        zh: "加以利用",
        ex: [{ en: "He utilized a coin to turn the screw.", zh: "他利用一枚硬币来拧螺丝／硬币的设计初衷是交易，但他发掘了它边缘厚度的物理效用。" }] },
      { dim: "学术与官僚系统的话术包装", tag: "语体",
        scene: "在论文或公文中，作者为了让动作显得更具专业性和战略高度，刻意避开日常词汇，换上这个带工业冷感的多音节词。",
        feature: "词汇的过度升格——在许多现代英文写作规范中，这被视为应被精简的冗余修辞。",
        zh: "使用（纯粹作为 use 的高级替换词）",
        ex: [{ en: "The methodology utilizes a sliding window algorithm.", zh: "该方法利用了滑动窗口算法／此处本质上等同于 uses。" }] }
    ],
    contrasts: [{ w: "use", note: "科技论文中最常被滥用的一对词。use 的核心图景是「顺理成章的常规操作」——事物正在执行它被设计出来时就该执行的任务（I use a knife to cut the apple）；utilize 的核心图景是「提取效用价值」，必须包含「资源的重新分配」或「功能的非预设转化」（I utilize a knife as a mirror to check the corner）。工程师法则：仅仅陈述调用了一个功能对口的工具，用 use；只有强调「让闲置资源发挥了价值」或「巧妙地把 A 挪作 B 用」时，才亮出 utilize。在没有转化意味的句子里强用 utilize，在母语者眼中就像用高射炮打蚊子。" },
                { w: "resourceful", note: "utilize 是动作，resourceful 是能持续做出这种动作的人的属性。" }]
  },

  {
    id: "subvert", w: "subvert", pos: "v.",
    core: "自下而上地掏空一座庞大建筑的地基并将其彻底掀翻、倒转，导致现有的权力系统、规则秩序或认知框架发生根本性的崩塌与反转",
    image: "不是从正门发起强攻，而是像白蚁一样在地下把承重墙的根基蛀空，然后在关键时刻猛然发力，将整座大厦底朝天地掀翻。它带有隐秘性、底层破坏性以及最终的彻底颠倒性。",
    origin: "拉丁语：sub-（在……之下/从底部）+ vertere（翻转），字面意思「从底部向上翻转」",
    parts: [["sub-", "从底部", "prefix"], ["vert", "翻转", "root"]],
    senses: [
      { dim: "权力与秩序的底层倾覆", tag: "政治",
        scene: "反对势力不去正面挑战军队，而是腐蚀官员、散布谣言、破坏基础设施，从系统最底层抽走支撑政府运作的「合法性」与「信任」，最终导致政权从内部坍塌。",
        zh: "颠覆（政权/制度）、暗中破坏",
        ex: [{ en: "A secret plot to subvert the government.", zh: "一个颠覆政府的密谋。" },
             { en: "They attempted to subvert the judicial process.", zh: "他们企图破坏司法程序／把公正客观的司法系统的底层逻辑彻底掀翻。" }] },
      { dim: "认知与预期的绝对反转", tag: "文化",
        scene: "现代影评文评中最常用的语境。观众脑海中有一座由「套路」和「常理」构成的坚固大厦（英雄一定战胜恶龙、公主一定需要拯救），创作者顺着地基往下走，然后在最后一刻猛然倒转。",
        feature: "对传统观念、刻板印象或大众预期的故意打破与彻底翻转。",
        zh: "颠覆（认知/传统）、打破（预期）",
        ex: [{ en: "The movie completely subverts traditional gender roles.", zh: "这部电影彻底颠覆了传统的性别角色。" },
             { en: "To subvert audience expectations.", zh: "颠覆观众的预期。" }] },
      { dim: "道德与价值观的暗中腐蚀", tag: "道德",
        scene: "一种不良思潮潜入思想深处，不进行正面说教辩论，而是从底部慢慢瓦解原本坚守的道德底线，将价值观翻转为堕落的形态。",
        zh: "败坏、腐蚀（思想/道德）",
        ex: [{ en: "Literature that is accused of subverting the youth.", zh: "被指责为败坏青年的文学作品。" }] }
    ],
    contrasts: [
      { w: "convert", note: "同一个词根 vertere（翻转）：subvert 是「从底部掀翻」（破坏性），convert 是「彻底转过去」（切换协议，不带破坏性）。" },
      { w: "undermine", note: "力的方向三分：overthrow 是「正面强攻，从上往下推」，暴力公开（叛军开坦克冲进总统府拉倒雕像）；undermine 也是「从底下挖」（under + mine 挖矿），但结果是「削弱、动摇」——地基受损、大楼岌岌可危，但不一定立刻倒塌；subvert 是「从底下挖空并强制翻转」，不仅包含隐秘破坏，更强调最终那个「倒错与崩塌的质变」。你可以 undermine 别人的信心，但不能 subvert 别人的信心；你可以 subvert 一个刻板印象，但不能 overthrow 一个刻板印象。" }
    ]
  },

  {
    id: "convert", w: "convert", pos: "v./n.",
    core: "将客体置入一个转换机制使其发生彻底的「转身」，让它的底层协议、功能用途或价值体系完全切换，无缝接入一个全新的系统",
    image: "火车的变轨器。列车还是那列列车，乘客还是那些乘客，但在通过道岔的瞬间，行驶方向和所遵循的轨道系统发生了根本性切换。它强调的是功能、协议或身份的重置。",
    origin: "拉丁语：com-（彻底地）+ vertere（翻转、转向），字面意思「彻底转过去」",
    parts: [["con-", "彻底地", "prefix"], ["vert", "翻转", "root"]],
    rootRefs: ["com"],
    senses: [
      { dim: "物理形态与功能的底层重置", tag: "工程",
        scene: "客体原本为执行 A 任务而设计，主体通过重新编排其内部结构，强行剥离旧有用途，将其翻转为执行 B 任务的工具。",
        feature: "物理用途或数据协议的根本性切换，使其能被新系统识别。",
        zh: "转换、改造、折算",
        ex: [{ en: "Convert USD into Euros.", zh: "将美元兑换成欧元／价值不变，但结算协议从美国金融系统切换到了欧洲。" },
             { en: "Convert a PDF to a Word document.", zh: "把 PDF 转换为 Word／文本内容不变，但底层文件编码协议切换了。" },
             { en: "They converted the old barn into a house.", zh: "他们把旧谷仓改造成了住宅／核心功能从「存储系统」切换为「居住系统」。" }] },
      { dim: "精神系统与价值观的彻底倒戈", tag: "宗教/心理",
        scene: "把「火车变轨」应用在人的大脑上。一个人的底层信仰、政治立场或生活方式在经历某种启示后发生 180 度大转弯，彻底切断与旧信仰的联系，接入新的精神系统。",
        zh: "（使）改变信仰、（使）皈依；改变信仰者",
        ex: [{ en: "He converted to Catholicism.", zh: "他皈依了天主教／精神操作系统进行了彻底的重装与切换。" },
             { en: "A convert to vegetarianism.", zh: "一个转变成素食主义的人。" }] },
      { dim: "潜在机会向实际成果的变现", tag: "商业",
        scene: "在商业漏斗或体育赛场上你获得了一个「机会」。机会本身是虚的，你必须完成临门一脚，把这种悬而未决的潜能翻转为计分板上实打实的分数或利润。",
        zh: "转化、兑现（得分）",
        ex: [{ en: "We need to convert more website visitors into buyers.", zh: "我们需要把更多网站访客转化为买家／让虚无的流量转身变成账户里的真金白银。" },
             { en: "He successfully converted the penalty.", zh: "他成功罚进了点球。" }] }
    ],
    contrasts: [{ w: "subvert", note: "同根 vertere。subvert 是从底部掀翻（破坏）；convert 是原地变轨（切换）。" },
                { w: "transform", note: "「改变」的三档：alter 是「局部修补」（裁缝改衣服），核心身份、外观和功能都没变；transform 是「外在形态的彻底粉碎与重塑」（毛毛虫变蝴蝶、变形金刚），强调视觉上惊天动地的变化；convert 是「内部协议或用途的切换」，被 convert 的东西外表可能毫无变化。把无神论者变成基督徒，肉体外观没有任何改变（不能用 transform），但大脑里运行的底层代码全换了——这就是 convert。" }]
  },

  {
    id: "resist", w: "resist", pos: "v.",
    core: "面对外部压迫过来的一股力量，把双脚死死钉在地上顶住压力，拒绝被推动、被同化或被改变现状",
    image: "在狂风中把伞死死往身前顶的动作，或一颗无论风化水流怎么冲刷都死死咬住土壤的顽石。它的本质是防御性的、制造阻力的。",
    origin: "拉丁语 resistere：re-（反向/对抗）+ sistere（站立、停住），字面意思「对着站立」",
    parts: [["re-", "对抗", "prefix"], ["sist", "站立", "root"]],
    senses: [
      { dim: "政治与暴力的防守", tag: "对抗",
        scene: "当系统试图逮捕你、压迫你时，你不配合，制造物理或政治上的摩擦力，让对方难以得逞。",
        zh: "抵抗、拒绝",
        ex: [{ en: "He resisted arrest.", zh: "他拒捕／警察试图把他塞进警车，他死死扒住车门不进去，但他没有主动拿刀去砍警察。" }] },
      { dim: "心理诱惑的硬性阻挡", tag: "诱惑",
        scene: "面对甜食、美色或贪念的冲击，在心理上竖起一道防火墙，拒绝让它们侵入你的决定。",
        zh: "抗拒、忍住",
        ex: [{ en: "I couldn't resist the cake.", zh: "我无法抗拒那块蛋糕／蛋糕的诱惑力冲破了我的心理护盾。" }] },
      { dim: "物理与生理的抗性", tag: "物理",
        scene: "物质对电流、疾病或高温表现出的「不可穿透性」。",
        zh: "抵抗、耐（……）",
        ex: [{ en: "Water-resistant watch.", zh: "防水手表／水试图侵入，被手表的材料挡在外面。" },
             { en: "Antibiotic resistance.", zh: "抗生素耐药性／细菌对药物产生了阻力屏蔽。" }] }
    ],
    contrasts: [{ w: "revolt", note: "一堵墙 vs. 一把火。监狱场景：狱警命令囚犯穿侮辱性制服，囚犯们手挽手坐在操场上不动，狱警来拉他们全身僵硬死死黏在地上——这是 resist，力学特征是「我不动，你也别想动我」，目标是保持现状（防御力）。囚犯们抢夺警棍、砸碎玻璃、点燃床单、绑了狱长要求接管监狱——这是 revolt，力学特征是「我冲上去把你掀翻」，目标是摧毁系统（破坏力）。" },
                { w: "insist", note: "同根 sistere（站立）：resist 是「对着站」（抵抗外力），insist 是「站在上面」（咬定不放）。" }]
  },

  {
    id: "revolt", w: "revolt", pos: "v./n.",
    core: "底层的力量不再满足于防守，而是剧烈沸腾翻滚，以暴力姿态向上喷发，将压在头顶的旧系统彻底掀翻、撕碎",
    image: "一锅烧开的水，底部的沸水以极其剧烈的姿态翻滚到水面；或一群原本跪着的奴隶突然拿起干草叉，掉头冲向了国王的城堡。它的本质是攻击性的、破坏性的、颠覆结构的。",
    origin: "拉丁语 revolvere：re-（向后/反向）+ volvere（滚动、翻转，与 revolution 革命同源），字面意思「反向翻滚」",
    parts: [["re-", "反向", "prefix"], ["volt", "滚动", "root"]],
    senses: [
      { dim: "权力结构的暴力倾覆", tag: "政治",
        scene: "最高级别的反抗。它不仅是不配合，而是要杀掉主人、砸烂现有的秩序。",
        zh: "起义、反抗、暴动",
        ex: [{ en: "The slaves revolted against their masters.", zh: "奴隶们起来反抗主人／发生流血冲突，底层暴动要把阶级结构倒转过来。" }] },
      { dim: "生理与心理的极度反胃", tag: "生理",
        scene: "当胃部或心理遇到极其恶心、突破底线的事物时，内脏发生一种「生理性的翻滚与抗议」。",
        zh: "使厌恶、使作呕",
        ex: [{ en: "The smell revolted me.", zh: "那气味让我恶心透顶／臭味让我的胃在抽搐翻滚。" },
             { en: "We were revolted by the violence.", zh: "我们对这种暴力感到极其反感。" }] }
    ],
    contrasts: [{ w: "resist", note: "面对洪流，你像一根柱子死死定在原地不被冲走，这叫 resist；你化身为一股反向的泥石流咆哮着逆流而上把大坝冲塌，这叫 revolt。" },
                { w: "subvert", note: "revolt 是公开的暴力喷发；subvert 是隐秘的地基掏空。" }]
  },

  {
    id: "insist", w: "insist", pos: "v.",
    core: "双脚死死踩在一个特定的坐标或逻辑支点上，任凭外界如何质疑、劝阻或施压，绝不挪动半步、不妥协分毫",
    image: "一个人在谈判桌上重重拍下底牌、双臂交叉拒绝任何讨价还价；或面对千夫所指，死死抱住一根柱子大喊「我没错！」。它的本质是一种静态的、言辞与态度上的绝对强硬。",
    origin: "拉丁语 insistere：in-（在……之上）+ sistere（站立），字面意思「站定在上面」",
    parts: [["in-", "在…之上", "prefix"], ["sist", "站立", "root"]],
    senses: [
      { dim: "事实与立场的绝对捍卫", tag: "陈述",
        scene: "面对外界的怀疑或反驳，主体拒绝修改自己的认知或口供，死死踩在自己认定的那个事实上一口咬定，绝不改口。",
        feature: "言辞上的寸步不让，通常带有证明自己正确的强烈主观意愿。",
        zh: "坚持说、咬定、固执己见（insist that...）",
        ex: [{ en: "He insisted that he was innocent.", zh: "他一口咬定自己是无罪的／哪怕所有证据都对他不利，他依然死死踩在「无罪」这个立场上。" },
             { en: "She insisted that she had seen a UFO.", zh: "她坚持说自己看到了 UFO。" }] },
      { dim: "意愿与诉求的强制输出", tag: "要求",
        scene: "主体提出一个要求，面对他人的客套、推脱或拒绝，不接受任何折中方案，强行要求事情必须按自己的意志推进。",
        zh: "坚决要求、执意要（insist on...）",
        ex: [{ en: "She insisted on paying the bill.", zh: "她执意要买单／别人试图抢着付钱，但她绝不把买单的权利让出去。" },
             { en: "The workers insisted on better working conditions.", zh: "工人们坚决要求改善工作条件／把诉求像钉子一样钉在谈判桌上。" }] }
    ],
    contrasts: [{ w: "persevere", note: "「坚持」三分：insist 的物理图景是「一个点上的态度锚定」，静态的，强调嘴上的硬度和意志的不可商量，不需要长期体力（老板敲桌子：我坚决要求明天交稿）；persist 的图景是「时间轴上的履带推进」，动态的，强调动作在时间上的延续，常带贬义（他固执地不断打断我）；persevere 的图景是「暴风雪中的负重前行」，强调外部环境严酷而主体展现出高贵的韧性，纯褒义。每天五点起床长跑雷打不动是 persist（行为的持续），绝不能用 insist；下大雨所有人劝他别跑了他大喊「不，我今天必须跑」，那一刻的强硬态度才是 insist。" },
                { w: "resist", note: "同根 sistere：insist 是「站在上面」，resist 是「对着站」。" }]
  },

  {
    id: "persevere", w: "persevere", pos: "v.",
    core: "在漫长且极其恶劣的逆境中，顶着几乎要将人压垮的重压，依然咬紧牙关、艰难且不屈地迈出下一步",
    image: "一个在极地暴风雪中孤身跋涉的探险者：狂风暴雪疯狂拍打，体温不断流失，每走一步都要耗尽绝大部分力气。但他没有停下，也没有回头，而是低下头，在没过膝盖的深雪里踩下下一个脚印。",
    origin: "拉丁语 perseverare：per-（贯穿、彻底）+ severus（严酷的，与 severe 同源），字面意思「彻底贯穿严酷的环境」",
    parts: [["per-", "贯穿", "prefix"], ["sever", "严酷（severus）", "root"]],
    senses: [
      { dim: "逆境与挫折中的精神推进", tag: "心理",
        scene: "面对常人早就放弃的巨大困难——连续的考试失利、创业破产、长期不被认可的孤独研究。主体在心理防线濒临崩溃的边缘，依然用意志力维持着向目标的爬行。",
        feature: "面对挫折、诱惑或巨大阻力时的精神韧性，自带令人敬佩的悲壮感。",
        zh: "坚持不懈、锲而不舍、不屈不挠",
        ex: [{ en: "Despite numerous failures, she persevered in her scientific research.", zh: "尽管经历了无数次失败，她依然在科研道路上锲而不舍。" },
             { en: "If you want to master a difficult subject, you must persevere.", zh: "如果想掌握一门艰难的学科，你必须坚持到底。" }] },
      { dim: "物理与生存极限的熬战", tag: "生存",
        scene: "面对饥饿、疾病或极端自然环境，生命体燃烧最后的能量，死死扛住物理层面的摧残，直到熬过那段最严酷的时期。",
        zh: "熬过、坚持下去",
        ex: [{ en: "The trapped miners persevered in the dark for a week.", zh: "被困矿工在黑暗中苦苦支撑了一个星期。" }] }
    ],
    contrasts: [{ w: "insist", note: "见 insist 词条里的三词切割。终极测试：你绝对不能说 He perseveres in smoking（锲而不舍地抽烟），因为抽烟不涉及对抗严酷的逆境，只能说 He persists in smoking（死性不改地抽烟）；而赞美一个人历经磨难考上顶尖大学时，必须用 persevere。" }]
  },

  {
    id: "discover", w: "discover", pos: "v.",
    core: "捏住幕布的一角用力向外扯下，让原本就存在于黑暗中的真实事物瞬间暴露在刺眼的光芒之下",
    image: "考古学家拂去化石上最后一层泥土；探险家拨开密林看到一座失落的古城。动作方向是由内向外，追求真实与光明。",
    origin: "dis-（去除、相反动作）+ cover（遮盖），字面意思就是「去-遮盖」",
    parts: [["dis-", "去除", "prefix"], ["cover", "遮盖", "root"]],
    senses: [
      { dim: "地理与科学的发现", tag: "科学",
        scene: "撕开宇宙深空或自然界的视觉盲区，让早已客观存在的事物进入人类认知。",
        feature: "强调事物「早已客观存在」，主体只是移除了阻挡认知的盲区——这也是它与 invent（发明）的根本区别：你不能 discover 电话，只能 invent 它；你不能 invent 引力，只能 discover 它。",
        zh: "发现",
        ex: [{ en: "To discover a new planet.", zh: "发现一颗新行星。" }] },
      { dim: "真相的败露", tag: "真相",
        scene: "扯下别人用来掩盖谎言的那块布。",
        zh: "察觉、识破",
        ex: [{ en: "They discovered his secret.", zh: "他们发现了他的秘密。" }] }
    ],
    contrasts: [{ w: "undercover", note: "两者共用核心 cover（遮盖物），但动作方向绝对相反：discover 是「暴力掀开」，undercover 是「借壳潜伏」。discover 是 undercover 的绝对天敌——卧底系统的全部算力都用于维持那层 cover，而外部力量的全部目的就是用 discover 击穿它。The cartel discovered that he was an undercover agent（贩毒集团发现他是一名卧底特工）：特工一直在执行 undercover（钻在假身份的幕布下），贩毒集团执行了 discover（暴力撕碎这层幕布），结果 cover 碎裂，真实身份曝光于强光之下。" }]
  },

  {
    id: "undercover", w: "undercover", pos: "adj./adv.",
    core: "主动钻进那块幕布的下方，穿上它、与它融为一体，利用这层虚假的身份外壳作为护盾，在敌对系统中悄无声息地运作",
    image: "警察脱下警服、纹上纹身，以「毒贩」的假身份潜入黑帮内部；变色龙根据树叶颜色改变皮肤，在表象的掩护下向猎物逼近。动作方向是由外向内，追求隐蔽与黑暗。",
    origin: "under-（在……之下）+ cover（遮蔽物），字面意思「在遮蔽物之下运作」",
    parts: [["under-", "在…之下", "prefix"], ["cover", "遮盖", "root"]],
    senses: [
      { dim: "身份潜入与间谍活动", tag: "身份",
        scene: "真实身份被死死压在一层虚假身份之下。主体不仅不揭开幕布，反而必须时刻修补这块幕布，绝对不能让光线照进来。",
        feature: "强调对「虚假表象」的极致利用与维持。",
        zh: "卧底的、秘密的",
        ex: [{ en: "An undercover cop.", zh: "卧底警察／警察的真实身份被死死压在「黑帮分子」这层 cover 之下。" }] },
      { dim: "隐秘的调查行动", tag: "行动",
        scene: "在隐秘身份的掩护下进行操作。",
        zh: "秘密地、暗中地",
        ex: [{ en: "To work undercover.", zh: "做卧底工作。" }] }
    ],
    contrasts: [{ w: "discover", note: "同一块幕布，相反的动作方向：一个撕开，一个钻进去。" }]
  },

{
    id: "perspective", w: "perspective", pos: "n.",
    core: "视线穿透距离、遮挡物或表象，自一个特定位置去看",
    image: "本质是一种带有方向性、距离感和主体位置的观察状态。关键不在「看到了什么」，而在「你站在哪里看」。",
    origin: "拉丁语：per-（穿过）+ specere（看）",
    parts: [["per-", "穿过", "prefix"], ["spect", "看", "root"], ["-ive", "名词", "suffix"]],
    rootRefs: ["per", "spect"],
    senses: [
      { dim: "视觉空间的纵深构建", tag: "物理",
        scene: "观察者注视现实世界；或在二维画布上通过线条向远处收敛，引导视线穿透纸面产生三维纵深感。",
        zh: "透视法、透视图",
        ex: [{ en: "The painting uses linear perspective.", zh: "这幅画运用了线性透视法。" }] },
      { dim: "立场与认知的站位", tag: "认知",
        scene: "把物理的「站位」引申为心理和立场的站位。观察者穿透复杂的表象，依据自身经验和位置去审视某件事——换一个站位，看到的形状就完全不同。",
        zh: "视角、观点、看待事物的方法",
        ex: [{ en: "Try to see it from her perspective.", zh: "试着从她的视角来看这件事。" },
             { en: "It puts the problem in perspective.", zh: "这让人对该问题有了恰当的比例感／退到足够远的位置，才看得清它的真实大小。" }] }
    ],
    contrasts: [{ w: "regard", note: "perspective 是「你站在哪个位置看」（位置决定形状）；regard 是「你带着什么滤镜看」（态度决定色彩）。" }]
  },

  {
    id: "permeate", w: "permeate", pos: "v.",
    core: "某种物质穿过物体的缝隙或孔洞，均匀地布满整个内部空间",
    image: "重点在「穿过孔隙」这个动作过程——水分子挤进土壤的每一条缝，气味分子钻进房间的每一寸空气。",
    origin: "拉丁语：per-（穿过）+ meare（穿行）",
    parts: [["per-", "穿过", "prefix"], ["meat", "穿行", "root"], ["-e", "动词", "suffix"]],
    rootRefs: ["per"],
    senses: [
      { dim: "物质的扩散与浸透", tag: "物理",
        scene: "雨水穿过干燥的土壤缝隙向下渗；香水味从瓶口逸出，扩散到房间的每一处空气中。",
        zh: "渗透、浸透",
        ex: [{ en: "Water permeated the soil.", zh: "水渗进了土壤。" },
             { en: "The smell of coffee permeated the house.", zh: "咖啡的香味弥漫了整幢房子。" }] },
      { dim: "思想与氛围的扩散", tag: "抽象",
        scene: "某种思想、情绪或氛围如同无形的气体，穿透人群的心理防御，充满整个社会或组织。",
        zh: "弥漫、充斥",
        ex: [{ en: "A sense of unease permeated the meeting.", zh: "一种不安的情绪弥漫了整场会议。" }] }
    ],
    contrasts: [{ w: "pervade", note: "两者极近，差在镜头焦点：permeate 强调「穿过孔隙」这个动作过程（有介质、有缝隙）；pervade 强调「无处不在」这个结果状态（走遍了每个角落）。" }]
  },

  {
    id: "permanent", w: "permanent", pos: "adj.",
    core: "在时间轴上持续不断地穿行，始终停留在原本的状态，不发生中断或消退",
    image: "per-（贯穿始终）+ manere（停留）＝「一直待在那儿」。它描述的不是「很久」，而是「没有预设的终止点」。",
    origin: "拉丁语：per-（贯穿）+ manere（停留）",
    parts: [["per-", "贯穿始终", "prefix"], ["man", "停留", "root"], ["-ent", "形容词", "suffix"]],
    rootRefs: ["per"],
    senses: [
      { dim: "存在跨度的不受侵蚀", tag: "时间",
        scene: "某种事物在时间的长河中不受侵蚀，始终存在，不因时间推移而消退。",
        zh: "永久的、永恒的",
        ex: [{ en: "The damage is permanent.", zh: "这种损伤是永久性的。" },
             { en: "a permanent solution", zh: "一劳永逸的解决方案" }] },
      { dim: "编制与结构的固定设定", tag: "状态",
        scene: "在组织架构或物理结构中，某职位或某个部件被设定为一直保留，不随短期变动而撤销。",
        zh: "常设的、固定的、正式编制的",
        ex: [{ en: "a permanent member of the Security Council", zh: "安理会常任理事国" },
             { en: "She got a permanent contract.", zh: "她拿到了正式编制的合同／不再是临时工。" }] }
    ],
    contrasts: [{ w: "reside", note: "permanent 是「一直停留在某状态」，reside 是「稳稳坐进某个位置」——都带有「不轻易移动」的重量感。" }]
  },

  {
    id: "pervade", w: "pervade", pos: "v.",
    core: "一种力量、气息或特征走遍并贯穿了给定边界范围内的每一个角落",
    image: "per-（贯穿）+ vadere（走）＝「走遍」。它强调的是「无处不在」的结果状态，而不是「怎么钻进去」的过程。",
    origin: "拉丁语：per-（贯穿）+ vadere（走）",
    parts: [["per-", "贯穿", "prefix"], ["vad", "走", "root"], ["-e", "动词", "suffix"]],
    rootRefs: ["per"],
    senses: [
      { dim: "空间与心理的全面占有", tag: "抽象",
        scene: "恐惧感走遍了一个人的全身；绝望的气氛走遍了整条街道。没有任何一个角落被漏掉。",
        feature: "强调覆盖的完整性与不可回避性。",
        zh: "遍及、弥漫、贯穿",
        ex: [{ en: "A sense of dread pervaded the room.", zh: "一种恐惧感弥漫了整个房间。" },
             { en: "Corruption pervades every level of the system.", zh: "腐败贯穿了这个体系的每一个层级。" }] }
    ],
    contrasts: [{ w: "permeate", note: "permeate 看的是「穿过孔隙」的动作，pervade 看的是「走遍全境」的结果。液体和气体多用 permeate，抽象氛围两者皆可但 pervade 更书面。" }]
  },

  {
    id: "perfect", w: "perfect", pos: "adj./v.",
    core: "一个制作或执行的过程被彻底、完全地做完",
    image: "进度条走到 100%，没有遗漏任何细节。注意：它的本义是「完成度」，而不是「好」——「完美」是完成度拉满之后的副产品。",
    origin: "拉丁语：per-（完全）+ facere（做）",
    parts: [["per-", "完全", "prefix"], ["fect", "做", "root"]],
    rootRefs: ["per"],
    senses: [
      { dim: "结果评估：无一遗漏", tag: "状态",
        scene: "一件物品或一个计划的所有环节都被彻底打磨完毕，不存在任何未完成或有瑕疵的部分。",
        zh: "完美的、完备的",
        ex: [{ en: "Nobody is perfect.", zh: "人无完人。" },
             { en: "a perfect fit", zh: "严丝合缝、分毫不差" }] },
      { dim: "过程执行：推向完成", tag: "动作",
        scene: "把一个有瑕疵的半成品，通过不断修改推向彻底完成的状态（动词，重音在后：perFECT）。",
        zh: "改善、使完美",
        ex: [{ en: "She spent years perfecting her technique.", zh: "她花了多年时间打磨自己的技艺。" }] },
      { dim: "语法：动作的完成体", tag: "语法",
        scene: "英语时态里的「完成时」用的正是这个词——它标记的不是时间早晚，而是「这个动作已经走完了」。",
        zh: "完成（时）",
        ex: [{ en: "the present perfect tense", zh: "现在完成时" }] }
    ]
  },

  {
    id: "persuade", w: "persuade", pos: "v.",
    core: "话语或逻辑的力量彻底穿透了对方的心理防线，成功输送了建议与观念",
    image: "per-（彻底）+ suadere（劝导）。它标记的是沟通的**终点**而非过程——你可以劝（advise）很久，但只有对方的信念真的被击穿并重塑，才叫 persuade。",
    origin: "拉丁语：per-（彻底）+ suadere（建议、劝导）",
    parts: [["per-", "彻底", "prefix"], ["suad", "劝导", "root"], ["-e", "动词", "suffix"]],
    rootRefs: ["per"],
    senses: [
      { dim: "意志的转移与重塑", tag: "心理",
        scene: "原本抗拒或犹豫的人，其内部信念被外部的劝导力量完全击穿，转而接受了新的立场。",
        feature: "强调结果达成——没说动就不能用这个词。",
        zh: "说服、使相信",
        ex: [{ en: "She persuaded him to stay.", zh: "她说服他留了下来。" },
             { en: "I'm not persuaded by that argument.", zh: "那个论点没能说服我／它没能穿透我的判断。" }] }
    ],
    contrasts: [{ w: "insist", note: "persuade 是「击穿对方的防线」（作用于对方）；insist 是「守住自己的立场」（作用于自己）。一个向外推，一个向内守。" }]
  },

  {
    id: "perceive", w: "perceive", pos: "v.",
    core: "大脑或感官彻底地抓住、捕获了外部世界的信号",
    image: "per-（完全）+ capere（抓）。信号在那里是一回事，被完整抓住是另一回事——perceive 标记的是「抓住了」。",
    origin: "拉丁语：per-（完全）+ capere（抓、拿）",
    parts: [["per-", "完全", "prefix"], ["ceive", "抓取", "root"]],
    rootRefs: ["per"],
    senses: [
      { dim: "生理接收：信号的捕获", tag: "感官",
        scene: "环境中存在微弱的光线、声音或气味变化，个体的感官系统完整地捕捉到了这个信号。",
        zh: "察觉、感觉到",
        ex: [{ en: "I perceived a faint smell of gas.", zh: "我察觉到一丝煤气味。" },
             { en: "Dogs can perceive sounds we cannot.", zh: "狗能感知到我们听不到的声音。" }] },
      { dim: "心理加工：意义的把握", tag: "认知",
        scene: "大脑不仅捕获了物理信号，还彻底抓住了它背后的逻辑，把它纳入自己的理解体系并给出定性。",
        zh: "理解、认为、视为",
        ex: [{ en: "How do you perceive your role in the team?", zh: "你如何理解自己在团队中的角色？" },
             { en: "The policy is widely perceived as unfair.", zh: "这项政策被普遍认为不公平。" }] }
    ],
    contrasts: [{ w: "regard", note: "perceive 强调「信号被抓住并解析」（认知过程）；regard 强调「带着态度去看」（立场投射）。perceived as unfair 是「被感知/理解为」，regarded as unfair 是「被看待为」，前者更中性。" }]
  },

  {
    id: "pertinent", w: "pertinent", pos: "adj.",
    core: "某种观点或事物与当前的核心焦点完全、紧紧地抓在一起、保持连接",
    image: "per-（完全）+ tenere（抓住）。在一场讨论中，抛出的论点像钩子一样死死扣住议题的主干，没有发生任何游离或脱落。",
    origin: "拉丁语：per-（完全）+ tenere（抓住、保持）",
    parts: [["per-", "完全", "prefix"], ["tin", "抓住/保持", "root"], ["-ent", "形容词", "suffix"]],
    rootRefs: ["per", "tain"],
    senses: [
      { dim: "信息与语境的紧密关联", tag: "逻辑",
        scene: "面对一个议题，某条信息不是泛泛地「有点关系」，而是精准咬合在问题的关键处，直接影响判断。",
        feature: "比 relevant 更强调「切中要害」，常带有「说得中肯」的褒义。",
        zh: "相关的、切题的、中肯的",
        ex: [{ en: "That is a pertinent question.", zh: "这是一个切中要害的问题。" },
             { en: "Please keep your remarks pertinent to the topic.", zh: "请让你的发言紧扣主题。" }] }
    ],
    contrasts: [{ w: "valid", note: "pertinent 问的是「跟这事有没有关系」（相关性）；valid 问的是「本身站不站得住」（成立性）。一个论点可以 valid 但不 pertinent——说得对，但跑题了。" }]
  },

  {
    id: "perish", w: "perish", pos: "v.",
    core: "事物彻底偏离了生命或存在的正常轨道，走向不可逆的终点",
    image: "per-（这里取「越过界限、走向毁坏」的引申义）+ ire（走）＝「走上不归路」。它带有一种非正常、非自然的悲剧色彩。",
    origin: "拉丁语 perire：per-（毁坏、偏离）+ ire（走）",
    parts: [["per-", "偏离/毁坏", "prefix"], ["ish", "走（ire）", "root"]],
    rootRefs: ["per"],
    senses: [
      { dim: "生命的非正常终结", tag: "生物",
        scene: "遭遇灾难、战争或意外，生命状态彻底偏离轨道被强行中止。它极少用于寿终正寝——那种情况用 die 或 pass away。",
        zh: "丧生、罹难",
        ex: [{ en: "Hundreds perished in the flood.", zh: "数百人在洪水中丧生。" },
             { en: "Many species perished during the ice age.", zh: "许多物种在冰期灭绝了。" }] },
      { dim: "物质结构的降解", tag: "物理",
        scene: "食物、橡胶或织物的分子结构彻底崩坏，失去原有形态和功能。",
        zh: "腐烂、老化、变质",
        ex: [{ en: "Rubber perishes in strong sunlight.", zh: "橡胶在强光下会老化。" }] }
    ],
    contrasts: [{ w: "eradicate", note: "perish 是「自己走向毁灭」（不及物，主体自身消亡）；eradicate 是「被人连根拔除」（及物，有施动者）。" }]
  },

  {
    id: "pervert", w: "pervert", pos: "v./n.",
    core: "将原本笔直、正常的事物或观念强行扭转，使其偏离正确的方向",
    image: "per-（偏离）+ vertere（转）。一条本该笔直通向真相或正道的轨道，被硬生生掰弯了。",
    origin: "拉丁语：per-（偏离）+ vertere（转）",
    parts: [["per-", "偏离", "prefix"], ["vert", "转", "root"]],
    rootRefs: ["per", "vert"],
    senses: [
      { dim: "信息与制度的扭曲", tag: "逻辑",
        scene: "将法律的本意、数据的含义或他人的原话，强行朝着偏离真相的方向扭转，以服务于自己的目的。",
        zh: "曲解、败坏、滥用",
        ex: [{ en: "He was charged with perverting the course of justice.", zh: "他被控妨碍司法公正／把司法的轨道掰弯了。" },
             { en: "They perverted the original meaning of the text.", zh: "他们曲解了原文的本意。" }] },
      { dim: "行为模式的伦理偏离", tag: "社会",
        scene: "个人的欲望或行为模式脱离了社会常规的伦理轨道（作名词时是强烈的贬义指称）。",
        zh: "变态者、行为反常者",
        ex: [{ en: "The tabloid branded him a pervert.", zh: "小报给他扣上了变态的帽子。" }] }
    ],
    contrasts: [{ w: "subvert", note: "同根 vertere，方向不同：pervert 是「把它掰弯」（保留原物但方向错了）；subvert 是「从底下把它掀翻」（结构整个倒转）；convert 是「让它彻底转到另一条轨道」（中性，无褒贬）。" }]
  },

  {
    id: "perfidious", w: "perfidious", pos: "adj.",
    core: "彻底穿破、打破了原本存在的信任纽带",
    image: "per-（穿破、背离）+ fides（信任）。它形容的不是普通的失约，而是「先建立了牢固的信任契约，再由内部把它击碎」——所以杀伤力比 dishonest 大得多。",
    origin: "拉丁语：per-（背离）+ fides（信任）",
    parts: [["per-", "背离", "prefix"], ["fid", "信任", "root"], ["-ious", "形容词", "suffix"]],
    rootRefs: ["per", "cred"],
    senses: [
      { dim: "契约与忠诚的主动摧毁", tag: "道德",
        scene: "双方原本建立了牢固的信任关系（盟约、婚姻、雇佣），其中一方主动击碎这种信任走向背叛。带有很强的文学与谴责色彩。",
        zh: "背信弃义的、不忠的、奸诈的",
        ex: [{ en: "a perfidious ally", zh: "背信弃义的盟友" },
             { en: "his perfidious betrayal of the cause", zh: "他对这项事业的无耻背叛" }] }
    ],
    contrasts: [{ w: "cunning", note: "cunning 是「用弯曲的智力绕开规则」，未必涉及背叛；perfidious 必须以「先有信任」为前提，核心是把已建立的纽带击碎。" }]
  },

  {
    id: "percent", w: "percent", pos: "n./adv.",
    core: "把一个整体切成一百份，取其中的若干份",
    image: "这一类词没有发生复杂的隐喻投射，只保留了拉丁介词 per 最基础的「每」的运算含义：per（每）+ cent（百）。",
    origin: "拉丁语 per centum（每一百）",
    parts: [["per", "每", "prefix"], ["cent", "百", "root"]],
    rootRefs: ["per"],
    senses: [
      { dim: "比例的标准化表达", tag: "数学",
        scene: "把大小各异的整体统一切成一百份，从而让不同规模的量可以直接比较。",
        zh: "百分之……、百分比",
        ex: [{ en: "Only 3 percent responded.", zh: "只有 3% 的人作出了回应。" },
             { en: "a ten percent increase", zh: "百分之十的增长" }] }
    ],
    contrasts: [{ w: "by", note: "描述数据时注意区别：increased by 10 percent（增长了 10%，差值）vs. increased to 10 percent（增长到 10%，终值）。" }]
  },

  {
    id: "perhaps", w: "perhaps", pos: "adv.",
    core: "一件事的发生不由必然的逻辑推动，而是交由概率和运气来决定",
    image: "per（凭借、由）+ hap（偶然、运气，与 happen、happy 同源）＝「全看运气」。它的不确定感是写进词源里的。",
    origin: "per（凭借）+ hap（古诺斯语 happ，运气、偶然）",
    parts: [["per", "凭借", "prefix"], ["hap", "运气/偶然", "root"]],
    rootRefs: ["per"],
    senses: [
      { dim: "可能性的中性标记", tag: "推测",
        scene: "说话者手上没有足够的证据下判断，于是把结论交给概率，同时给自己留出退路。",
        zh: "也许、可能",
        ex: [{ en: "Perhaps he forgot.", zh: "也许他忘了。" }] },
      { dim: "语气的礼貌软化", tag: "语用",
        scene: "英式表达中常用来把命令或异议包装得柔和一些——不是真的在表达不确定，而是在给对方台阶。",
        zh: "（委婉地）或许……吧",
        ex: [{ en: "Perhaps you'd like to reconsider.", zh: "或许您愿意再考虑一下／实为一种客气的施压。" }] }
    ],
    contrasts: [{ w: "plausible", note: "perhaps 只是承认「有可能」，不需要逻辑支撑；plausible 则要求「逻辑外壳严丝合缝」，是有理由的可能。" }]
  },

  {
    id: "per-capita", w: "per capita", pos: "adj./adv.",
    core: "把宏观的总量均匀地分发到每一个「人头」上",
    image: "per（每）+ capita（头，caput 的复数形式）。它的画面就是把一整个盘子的资源，按人头一份份摊开。",
    origin: "拉丁语 per capita（按人头）",
    parts: [["per", "每", "prefix"], ["capit", "头", "root"]],
    rootRefs: ["per"],
    senses: [
      { dim: "总量的人均摊分", tag: "统计",
        scene: "把 GDP、收入、碳排放等宏观数据除以人口总数，从而消除国家或群体规模的差异，使横向比较成为可能。",
        feature: "它揭示的是「平均」而非「分布」——人均很高不代表每个人都高。",
        zh: "人均的、按人头计算的",
        ex: [{ en: "per capita income", zh: "人均收入" },
             { en: "The country ranks high in per capita emissions.", zh: "该国的人均排放量排名很高。" }] }
    ],
    contrasts: [{ w: "percent", note: "同为 per 的介词用法：percent 是「按一百份切」，per capita 是「按人头切」。" }]
  },

  {
    id: "peroxide", w: "peroxide", pos: "n.",
    core: "化学命名法中的 per-：某元素被推到最高价，或化合物中的氧原子多于常规",
    image: "在分子的结构搭建中，氧原子的数量越过了常规氧化物的基准线。这里的 per- 已经从「穿过」抽象成了「越过上限」。",
    origin: "per-（过量）+ oxide（氧化物）",
    parts: [["per-", "过量", "prefix"], ["oxide", "氧化物", "root"]],
    rootRefs: ["per"],
    senses: [
      { dim: "含氧量超出常规的化合物", tag: "化学",
        scene: "普通氧化物里氧以 −2 价存在；过氧化物里氧原子两两相连形成过氧键（−O−O−），含氧量因此高于常规。",
        zh: "过氧化物",
        ex: [{ en: "hydrogen peroxide", zh: "过氧化氢／双氧水" },
             { en: "She bleached her hair with peroxide.", zh: "她用双氧水把头发漂白了。" }] }
    ],
    contrasts: [{ w: "permanganate", note: "同属化学 per- 的「极值」用法：peroxide 是氧原子过量，permanganate 是锰被推到最高价（+7）。" }]
  },

  {
    id: "permanganate", w: "permanganate", pos: "n.",
    core: "化学 per- 的另一个典型：中心元素的化合价被推到该元素可达的最高状态",
    image: "manganate（锰酸盐）里锰是 +6 价，加上 per- 之后推到 +7 价的顶格，成为 permanganate（高锰酸盐）。",
    origin: "per-（最高）+ manganate（锰酸盐）",
    parts: [["per-", "最高", "prefix"], ["manganate", "锰酸盐", "root"]],
    rootRefs: ["per"],
    senses: [
      { dim: "中心元素达到最高价的盐类", tag: "化学",
        scene: "高锰酸根离子（MnO₄⁻）中锰为 +7 价，是锰的最高氧化态，因此具有极强的氧化性，溶液呈标志性的紫色。",
        zh: "高锰酸盐",
        ex: [{ en: "potassium permanganate", zh: "高锰酸钾" }] }
    ],
    contrasts: [{ w: "peroxide", note: "两者共同构成 per- 在化学中的「极值」语义：一个是数量过量，一个是价态顶格。" }]
  },

{
    id: "at", w: "at", pos: "prep.",
    core: "零维的「点」——雷达屏幕上的一个坐标原点，没有长度、没有体积",
    image: "把手指戳在地图上的一个位置。它不关心你在里面还是上面，只回答「在哪一点」。",
    senses: [
      { dim: "空间坐标的锁定", tag: "空间",
        scene: "把一个地方压缩成一个参照点，不考虑它的内部结构或表面。",
        zh: "在（某处）",
        ex: [{ en: "Someone is at the door.", zh: "有人在门口／门只是一个参考坐标，你不在门上，也不在门里。" },
             { en: "I'll meet you at the station.", zh: "我们在车站见／车站被当作地图上的一个点。" }] },
      { dim: "时间轴的截面点", tag: "时间",
        scene: "时间轴上一个没有宽度的瞬间。",
        zh: "在（某时刻）",
        ex: [{ en: "At 3 PM.", zh: "在下午 3 点整。" }] },
      { dim: "状态或活动的定位", tag: "抽象",
        scene: "把一种状态或活动当作坐标点，说明主体此刻「位于」其中。",
        zh: "处于、从事于",
        ex: [{ en: "The country is at war.", zh: "该国处于战争状态。" },
             { en: "He is good at maths.", zh: "他数学很好／能力被定位在「数学」这个坐标上。" }] }
    ],
    contrasts: [{ w: "in", note: "at 是点（零维），on 是面（二维），in 是体（三维）。这三者的维度差异是英语空间与时间逻辑的最核心基石。" }]
  },

  {
    id: "on", w: "on", pos: "prep./adv.",
    core: "二维的「面」——两者发生物理接触，下方托举着上方，没有陷进去",
    image: "书放在桌上：接触、被托起、可以随时拿走。它强调的是「贴着」，不是「在里面」。",
    senses: [
      { dim: "表面的接触与支撑", tag: "空间",
        scene: "物体与支撑面直接贴合，重量由下方承担。",
        zh: "在……上面",
        ex: [{ en: "The book is on the table.", zh: "书在桌子上。" },
             { en: "apples on the tree", zh: "树上的苹果／苹果挂在树的表面（对比 the bird is in the tree，鸟被立体树冠包裹）。" }] },
      { dim: "时间的平面格子", tag: "时间",
        scene: "英语把「一天」视为一个特定的平面时间格，事件贴在这一格上。",
        zh: "在（某日）",
        ex: [{ en: "On Monday.", zh: "在星期一。" }] },
      { dim: "依附与运转的持续", tag: "状态",
        scene: "从「贴着不脱离」引申为「持续接通、正在进行」。",
        zh: "开着的、进行中的；依靠",
        ex: [{ en: "The light is on.", zh: "灯开着／电路持续贴合接通。" },
             { en: "He lives on a small pension.", zh: "他靠一小笔养老金生活／生活贴附在这份收入之上。" }] }
    ],
    contrasts: [{ w: "in", note: "同为空间介词，on 是贴着表面（二维接触），in 是陷进内部（三维包裹）。" }]
  },

  {
    id: "with", w: "with", pos: "prep.",
    core: "伴随、共处，或手里握着的那件实体工具",
    image: "两样东西并排出现在同一个画面里；或者，你的手正握着某物在操作。",
    senses: [
      { dim: "伴随与共处", tag: "关系",
        scene: "两个主体同时出现在同一场景中，构成一种同在关系。",
        zh: "和……一起、带着",
        ex: [{ en: "She came with her sister.", zh: "她和妹妹一起来的。" },
             { en: "a man with a beard", zh: "一个留着胡子的男人／胡子伴随着他。" }] },
      { dim: "工具的物理握持", tag: "手段",
        scene: "手部延伸出的实体工具——必须是被主体在三维空间中握着或物理操控的具体物品。",
        zh: "用（某工具）",
        ex: [{ en: "I opened the door with a key.", zh: "我用钥匙开门／钥匙是被你物理握持的实体。" }] },
      { dim: "对抗关系中的对面方", tag: "冲突",
        scene: "打架、争论、比赛也需要两个人「一起」——所以对抗也用 with。",
        zh: "与……（争斗）",
        ex: [{ en: "He argued with his boss.", zh: "他和老板吵了一架。" }] }
    ],
    contrasts: [{ w: "by", note: "表示「用」时的分水岭：with 接被握在手里的实体（open the door with a key）；by 接宏观系统或抽象动作过程（open the door by kicking it、contact him by phone）。I hit him with a phone 是把电话机当凶器砸人。" }]
  },

  {
    id: "like", w: "like", pos: "prep./v.",
    core: "相似但不重合（≈）——A 在模仿 B 的某个特征，但 A 绝不是 B",
    image: "一层比喻滤镜。它建立的是「像」的关系，而不是「是」的关系。",
    senses: [
      { dim: "特征的类比", tag: "比喻",
        scene: "借用另一个事物的形态或姿态来描述当前对象，但两者身份并不相同。",
        zh: "像……一样",
        ex: [{ en: "He works like a slave.", zh: "他像奴隶一样工作／核心事实：他是个打工人，只是拼命的姿态类似奴隶。" },
             { en: "Let me speak to you like a father.", zh: "让我像父亲一样跟你说话／说话者可能是老板，借用了父亲的语气。" }] },
      { dim: "偏好的倾向", tag: "情感",
        scene: "作动词时表示心理上的趋近——你和某物之间产生了正向的吸引。",
        zh: "喜欢",
        ex: [{ en: "I like this design.", zh: "我喜欢这个设计。" }] }
    ],
    contrasts: [{ w: "as", note: "英语中最经典的语感陷阱。like 是「相似但不重合（≈）」，as 是「严丝合缝的等号（=）」。He works as a slave 意味着他在身份上就是奴隶；Let me speak to you as a father 意味着说话者就是你的亲生父亲。" }]
  },

  {
    id: "vicinity", w: "vicinity", pos: "n.",
    core: "以某一点为中心向外辐射、但不具备清晰物理边界的模糊包围圈",
    image: "石子投入水中，在落点周围泛起的一圈水波。它强调「靠近」与「相邻」，但不划定绝对的地理红线。",
    origin: "拉丁语 vicinus（邻近的），源自 vicus（村落）",
    senses: [
      { dim: "空间上的邻近范围", tag: "空间",
        scene: "以某个坐标为圆心的一片区域，范围随语境伸缩——可能是两百米，也可能是两公里。",
        zh: "附近、邻近地区",
        ex: [{ en: "There is no hospital in the immediate vicinity.", zh: "这附近没有医院／在这个辐射圈内不存在目标物。" }] },
      { dim: "数值上的大致区间", tag: "抽象",
        scene: "把「附近」用在数字上，表示一个不精确但可接受的估值范围。",
        zh: "大约、……上下",
        ex: [{ en: "The cost is in the vicinity of ten million.", zh: "成本大约在一千万上下。" }] }
    ],
    contrasts: [{ w: "vanity", note: "形近易混：vanity 源自 vanus（空的），核心是「华丽外壳下的空洞」；vicinity 源自 vicus（村落），核心是「以某点为中心的模糊邻近圈」。两者毫无关系。" }]
  },

  {
    id: "divinity", w: "divinity", pos: "n.",
    core: "从世俗凡人的低维世界中抽离，具备凌驾于物理法则之上的至高、纯粹与发光属性",
    image: "绝对的层级超越性与超自然能量的具象化——它不是「很厉害」，而是「不在同一个层面上」。",
    origin: "拉丁语 divinus（神的）",
    senses: [
      { dim: "超越凡俗的本质属性", tag: "本体",
        scene: "某个存在或事物展现出无法用世俗尺度衡量的至高属性。",
        zh: "神性、神圣性",
        ex: [{ en: "The divinity of nature.", zh: "自然的神性／自然界展现出的超脱凡俗的至高属性。" }] },
      { dim: "神祇本身与相关学科", tag: "指称",
        scene: "指代神本身，或研究神学的学科门类。",
        zh: "神、神祇；神学",
        ex: [{ en: "He studied divinity at Oxford.", zh: "他在牛津读神学。" }] }
    ],
    contrasts: [{ w: "vanity", note: "形近但语义相反：vanity 是「外表华丽、内部空洞」（向下的虚无），divinity 是「层级超越、纯粹发光」（向上的至高）。" },
                { w: "above", note: "divinity 正是 above 第四个维度（道德/性质的脱离）推到极致的状态——高到底层的一切都无法触及。" }]
  },

  {
    id: "destroy", w: "destroy", pos: "v.",
    core: "把一个结构从「成形」打回「不成形」——物理形态的粉碎",
    image: "大楼被炸倒，废墟（rubble）依然停留在原地。它摧毁的是「结构」，不是「存在」。",
    origin: "拉丁语 destruere：de-（向下、去除）+ struere（建造）＝「反建造」",
    parts: [["de-", "反向/去除", "prefix"], ["stroy", "建造（struere）", "root"]],
    senses: [
      { dim: "物理结构的粉碎", tag: "物理",
        scene: "建筑、车辆、器物在外力作用下丧失完整形态，无法再履行原有功能。",
        zh: "摧毁、破坏",
        ex: [{ en: "The earthquake destroyed the whole village.", zh: "地震摧毁了整个村庄。" }] },
      { dim: "抽象事物的瓦解", tag: "抽象",
        scene: "信心、名誉、关系这类靠结构维系的东西被打散。",
        zh: "毁掉、葬送",
        ex: [{ en: "The scandal destroyed his career.", zh: "这桩丑闻葬送了他的职业生涯。" }] }
    ],
    contrasts: [{ w: "eradicate", note: "destroy 强调「结构粉碎」，废墟还在；eliminate 强调「从系统或名单中踢出去」，是移出边界；eradicate 强调「连根拔起、不留后患」，施法对象必须是有深层根系、会蔓延的负面事物。你可以 destroy 一栋大楼，但不能 eradicate 一栋大楼。" }]
  },

  {
    id: "eliminate", w: "eliminate", pos: "v.",
    core: "把某个成员从一个界定好的集合或流程中踢出边界",
    image: "e-（向外）+ limen（门槛）＝「请出门槛之外」。它关心的是「谁还留在里面」，而不是被踢出去的那个后来怎么样了。",
    origin: "拉丁语 eliminare：ex-（向外）+ limen（门槛）",
    parts: [["e-", "向外", "prefix"], ["limin", "门槛", "root"], ["-ate", "动词", "suffix"]],
    rootRefs: ["ex"],
    senses: [
      { dim: "集合成员的剔除", tag: "系统",
        scene: "从候选名单、选项集合或比赛队列中移除某一项，使剩下的范围收窄。",
        zh: "淘汰、排除、剔除",
        ex: [{ en: "The team was eliminated in the first round.", zh: "该队在首轮被淘汰。" },
             { en: "We can eliminate option B.", zh: "我们可以排除选项 B。" }] },
      { dim: "负面因素的清除", tag: "抽象",
        scene: "把一个不想要的变量、成本或风险从系统中移走。",
        zh: "消除、去掉",
        ex: [{ en: "This design eliminates the need for cables.", zh: "这种设计免去了对线缆的需求。" }] }
    ],
    contrasts: [{ w: "destroy", note: "见 destroy 词条里的三词切割：destroy 粉碎结构，eliminate 移出边界，eradicate 连根拔除。" }]
  },

  {
    id: "apparently", w: "apparently", pos: "adv.",
    core: "基于视觉、听觉或初步证据，在事物表层建立起来的印象",
    image: "一双眼睛在看事物的「壳」。它隐含着一句潜台词：「如果我没看错的话」「根据我目前掌握的碎片信息」。",
    origin: "拉丁语 apparere（显现），与 appear 同源",
    senses: [
      { dim: "表象层面的判断", tag: "认知",
        scene: "说话者只接触到了事物的外部信号，据此作出推断，同时为可能的翻转留出余地。",
        feature: "容易被误导，带有明确的不确定性。",
        zh: "看起来、似乎、显然（据表象）",
        ex: [{ en: "Apparently he is rich.", zh: "看他穿名牌开豪车，似乎他很有钱。" },
             { en: "Apparently they agreed.", zh: "会议上他们都点头了，表面上看是达成了一致。" }] },
      { dim: "转述他人信息", tag: "语用",
        scene: "口语中常用来标记「这是我听说的，不是我亲眼所见」，把责任推给信息源。",
        zh: "据说、听说",
        ex: [{ en: "Apparently they're getting divorced.", zh: "听说他们要离婚了。" }] }
    ],
    contrasts: [{ w: "essentially", note: "两者是一对认知反方向的词。apparently 是「外→内」，是幻象的入口，强调「所见（Seems）」；essentially 是「内→外」，是真相的底座，强调「所是（Is）」。经典结构：Apparently X, but essentially Y——用逻辑手术刀把人从初步观察拉进事物深处。" }]
  },

  {
    id: "moral", w: "moral", pos: "adj./n.",
    core: "个体内心那把关于善恶的尺子——一种主观的、内生的良知判断",
    image: "内心的声音（Inner voice）。它不需要外部条文授权，也不因为职业或场合而改变。",
    origin: "拉丁语 mos/mores（风俗、品行）",
    senses: [
      { dim: "善恶的内在判断", tag: "道德",
        scene: "面对一个选择时，内心自发涌起的「这样做对不对」的感受，不依赖法律或行规。",
        zh: "道德的、有道德的",
        ex: [{ en: "It is a moral question, not a legal one.", zh: "这是个道德问题，不是法律问题。" },
             { en: "He had no moral qualms about it.", zh: "他对此毫无道德上的不安。" }] },
      { dim: "故事的训诫", tag: "文本",
        scene: "作名词时指一则故事、寓言最后要传递的那条行为准则。",
        zh: "寓意、教训",
        ex: [{ en: "The moral of the story is patience.", zh: "这个故事的寓意是耐心。" }] }
    ],
    contrasts: [{ w: "ethical", note: "moral 偏向个体内心的良知（主观的善恶感）；ethical 偏向外部群体、社会或职业公认的客观规则框架。律师为已知有罪的杀人犯辩护，在很多人的良知（moral）上难以接受，但由于必须保障程序正义，这在法律界是完全合乎职业操守的（ethical）。" }]
  },

  {
    id: "weave", w: "weave", pos: "v./n.",
    core: "让多条线按既定规律交错穿插，形成一块结构稳定、可预期的整体",
    image: "织布机上的经线与纬线——每一次交叉都是设计好的。它和 tangle 的物理动作相同（线的交错），但差别在于「有没有规律」。",
    senses: [
      { dim: "纤维的规律交错", tag: "物理",
        scene: "经纬两组线按固定的上下顺序穿插，形成布匹、篮子或地毯。",
        zh: "编织、纺织",
        ex: [{ en: "She wove a basket from reeds.", zh: "她用芦苇编了个篮子。" }] },
      { dim: "叙事与元素的编排", tag: "抽象",
        scene: "把多条线索、主题或旋律有意识地交织在一起，形成一个有机的整体。",
        zh: "编排、穿插、糅合",
        ex: [{ en: "The novel weaves three storylines together.", zh: "这部小说把三条故事线交织在一起。" }] },
      { dim: "在障碍间的迂回穿行", tag: "运动",
        scene: "身体像穿线一样在人群或车流的缝隙中左右穿插前进。",
        zh: "迂回前进、穿行",
        ex: [{ en: "He wove through the crowd.", zh: "他在人群中穿行而过。" }] }
    ],
    contrasts: [{ w: "tangle", note: "同样是线的交错：weave 是有规律、带美感、结果可控的（编织）；tangle 是无序、失控、越挣越紧的（缠结）。这一对词把「秩序」和「混乱」放在了同一个物理动作上。" }]
  },

  {
    id: "reasonable", w: "reasonable", pos: "adj.",
    core: "落在「常人可以接受」的区间之内——带有人情味与社会共识的合理",
    image: "它衡量的不是逻辑严不严密，而是「过不过分」。因此它天然带有社会属性和温度。",
    senses: [
      { dim: "价格与条件的公道", tag: "社会",
        scene: "一个报价、要求或安排没有超出人们普遍认可的尺度。",
        zh: "公道的、合情合理的",
        ex: [{ en: "The price is quite reasonable.", zh: "这个价格挺公道的。" },
             { en: "a reasonable request", zh: "一个不过分的要求" }] },
      { dim: "判断的通情达理", tag: "人际",
        scene: "形容人时，指他愿意听取意见、不走极端、能被讲道理说动。",
        zh: "讲道理的、明事理的",
        ex: [{ en: "Be reasonable — we can't finish it tonight.", zh: "讲点道理吧，今晚我们不可能做完。" }] },
      { dim: "数量或质量的尚可", tag: "程度",
        scene: "表示「还不错但谈不上出色」的中等水平。",
        zh: "还可以的、相当的",
        ex: [{ en: "a reasonable chance of success", zh: "相当的成功机会" }] }
    ],
    contrasts: [{ w: "rational", note: "reasonable 带「人情味」，意味着不过分、公平、大家都能接受；rational 带「机器般冷酷」，只关心 A 是否能推导出 B。「他的裁员计划在商业上是绝对 rational 的，但在情感上令人难以接受（not reasonable）」。" }]
  },

  {
    id: "guess", w: "guess", pos: "v./n.",
    core: "在信息不足的情况下向答案射出一箭，没有数据支撑",
    image: "在黑暗中盲目地射箭。它承认自己缺乏依据——这正是它与 consider、estimate 的分界线。",
    senses: [
      { dim: "无依据的判断", tag: "认知",
        scene: "手上没有足够线索，凭直觉或随意选一个答案。",
        zh: "猜、猜测",
        ex: [{ en: "Guess how old I am.", zh: "猜猜我多大。" },
             { en: "Your guess is as good as mine.", zh: "我跟你一样不知道。" }] },
      { dim: "口语中的软化断言", tag: "语用",
        scene: "美式口语里 I guess 常用来把一个其实相当确定的判断说得随意一点。",
        zh: "我想、大概吧",
        ex: [{ en: "I guess you're right.", zh: "我想你是对的。" }] }
    ],
    contrasts: [{ w: "consider", note: "认知强度阶梯：guess 是黑暗中盲目射箭（无数据）；think 门槛极低，随时冒出一个念头；consider 带极高庄重感，潜台词是「我经过严谨打磨、排除干扰、认真评估之后才得出这个结论」。" }]
  },

  {
    id: "hypocrisy", w: "hypocrisy", pos: "n.",
    core: "表里不一——公开宣称的标准与私下实际的行为之间存在刻意的裂口",
    image: "希腊语原意是「戏剧表演」：演员戴着面具在台上说一套，卸妆后是另一个人。它的本质是「明知故犯地演」。",
    origin: "希腊语 hypokrisis（舞台表演、假装）",
    senses: [
      { dim: "标准与行为的背离", tag: "道德",
        scene: "一个人公开谴责某种行为，私下却在做同样的事；或对别人用一把尺子，对自己用另一把。",
        zh: "虚伪、伪善",
        ex: [{ en: "It is sheer hypocrisy to preach thrift while wasting millions.", zh: "一边鼓吹节俭一边挥霍百万，纯属虚伪。" }] }
    ],
    contrasts: [{ w: "diplomacy", note: "hypocrisy 是纯粹的欺骗、表里不一；diplomacy 是一门生存与博弈的艺术——不是在说谎，而是在进行「受限的真相表达」，知道哪些真话现在不能说、哪些底线必须用委婉方式守住。" }]
  },

  {
    id: "dig", w: "dig", pos: "v.",
    core: "用工具或肢体把表层物质拨开、掏走，最基础的挖掘动作",
    image: "门槛极低、动作随意——狗在花园里刨土，你用勺子挖冰淇淋，都算 dig。它不承诺规模，也不承诺目的。",
    senses: [
      { dim: "土石的翻动与掏取", tag: "物理",
        scene: "把泥土、沙子或雪从原位移走，形成凹陷。",
        zh: "挖、掘",
        ex: [{ en: "The dog is digging in the garden.", zh: "狗在花园里刨土。" },
             { en: "They dug a hole for the tree.", zh: "他们为这棵树挖了个坑。" }] },
      { dim: "信息的翻找", tag: "抽象",
        scene: "在资料堆里翻来翻去找线索，常搭配 dig up / dig into。",
        zh: "挖掘（信息）、深究",
        ex: [{ en: "Reporters dug up evidence of fraud.", zh: "记者挖出了欺诈的证据。" }] }
    ],
    contrasts: [{ w: "excavation", note: "体量感的分水岭：dig 随意、无门槛；excavation 带「工业级」或「学术级」的严肃滤镜，它是一项「工程」。后院种树挖坑叫 dig；动用挖掘机挖地窖，或挖出恐龙化石并拉起警戒线，那是 excavation。" }]
  },

  {
    id: "elite", w: "elite", pos: "n./adj.",
    core: "在残酷的后天筛选中被挑拣出来的顶尖少数",
    image: "词源就是「被选出的」。关键在于筛选机制是「能力（Merit）」——藤校学霸、顶尖外科医生、特种部队，都是靠硬实力杀到塔尖的。",
    origin: "法语 élite（被选中的），源自拉丁语 eligere（选出）",
    senses: [
      { dim: "能力筛选出的顶层", tag: "社会",
        scene: "在一个有明确评价标准的领域里，处于金字塔尖的那一小撮人或机构。",
        zh: "精英、精锐；一流的",
        ex: [{ en: "an elite university", zh: "一流大学" },
             { en: "elite athletes", zh: "顶尖运动员" }] },
      { dim: "对特权阶层的批评性指称", tag: "政治",
        scene: "在政治语境中常带贬义，指脱离普通人生活、垄断话语权的那个圈子。",
        zh: "精英阶层（常含贬义）",
        ex: [{ en: "distrust of the political elite", zh: "对政治精英阶层的不信任" }] }
    ],
    contrasts: [{ w: "aristocratic", note: "三档切割：rich 门槛最低，只看账户余额；elite 的核心是「后天筛选与能力」，靠脑力或技术竞争到塔尖；aristocratic 的核心是「先天的传承与毫不费力」——它看不起 purely rich（暴发户），也未必像 elite 那样需要亲自去卷。" }]
  },

  {
    id: "exclusive", w: "exclusive", pos: "adj./n.",
    core: "视角在「门内」——门槛极高带来的稀缺感与特权感",
    image: "只有顶级会员才能进入的 VIP 休息室。同样是把人挡在外面，但镜头对准的是里面的人有多特别。",
    origin: "拉丁语：ex-（向外）+ claudere（关闭）",
    parts: [["ex-", "向外", "prefix"], ["clus", "关闭", "root"], ["-ive", "形容词", "suffix"]],
    rootRefs: ["ex"],
    senses: [
      { dim: "准入门槛带来的稀缺", tag: "褒义",
        scene: "俱乐部、社区或品牌通过高门槛筛选客户，从而制造身份象征。",
        zh: "高级的、专属的",
        ex: [{ en: "an exclusive club", zh: "高级会员制俱乐部" },
             { en: "an exclusive neighbourhood", zh: "高档社区" }] },
      { dim: "独家占有的权利", tag: "商业",
        scene: "某项资源或信息只对唯一一方开放，其他人无权取得。",
        zh: "独家的、专有的",
        ex: [{ en: "an exclusive interview", zh: "独家专访" },
             { en: "exclusive rights to the film", zh: "该影片的独家版权" }] },
      { dim: "互斥关系", tag: "逻辑",
        scene: "两个选项无法同时成立（mutually exclusive）。",
        zh: "互相排斥的",
        ex: [{ en: "The two goals are not mutually exclusive.", zh: "这两个目标并不互相排斥。" }] }
    ],
    contrasts: [{ w: "exclusionary", note: "同源但情感色彩截然相反，这是最容易用错的一对。exclusive 的视角在门内，强调稀缺与特权，通常褒义；exclusionary 的视角在门外，强调规则制定者的恶意拦截与不公平剥夺，带强烈贬义。想炫耀某物高级用 exclusive，想控诉系统搞歧视用 exclusionary。" }]
  },

  {
    id: "pass", w: "pass", pos: "v./n.",
    core: "从一个点移动越过另一个点——跨越、经过、传递",
    image: "所有含义都是同一个动作在不同对象上的落点：越过门槛（通过考试）、经过某处（路过）、把东西递过去（传球）、时间流过（过去）。",
    senses: [
      { dim: "空间的经过与超越", tag: "空间",
        scene: "主体沿路径前进，越过一个参照物。",
        zh: "经过、通过、超过",
        ex: [{ en: "We passed the church on the left.", zh: "我们从教堂左边经过。" },
             { en: "He passed the car in front.", zh: "他超过了前面那辆车。" }] },
      { dim: "标准门槛的跨越", tag: "评判",
        scene: "达到了某条及格线，被允许进入下一阶段。",
        zh: "通过（考试/审批）",
        ex: [{ en: "She passed the exam.", zh: "她通过了考试。" },
             { en: "The bill passed by a narrow margin.", zh: "该法案以微弱优势获得通过／投票人数跨过了法定门槛。" }] },
      { dim: "物体或权利的传递", tag: "转移",
        scene: "把某物从自己手中移交到另一方手中。",
        zh: "传递、递给",
        ex: [{ en: "Pass me the salt, please.", zh: "请把盐递给我。" }] },
      { dim: "时间的流逝", tag: "时间",
        scene: "时间像流水一样越过当下这个坐标点。",
        zh: "（时间）过去、消逝",
        ex: [{ en: "Three years passed.", zh: "三年过去了。" }] }
    ],
    contrasts: [{ w: "enact", note: "立法流水线上的分工：pass 强调「跨越门槛」（投票达到法定比例，走通程序）；enact 强调「注入灵魂与效力」（签字盖章那一刻，草案正式成为法律）；enforce 强调「物理落地」（执法者拿着它去抓人罚款）。" }]
  },

  {
    id: "qualify", w: "qualify", pos: "v.",
    core: "达到某个既定标准，从而获得进入下一阶段的资格",
    image: "qual-（性质）+ -ify（使……成为）＝「使自己的性质达标」。它关心的是「硬件指标够不够」。",
    origin: "拉丁语 qualis（何种性质的）+ facere（做）",
    parts: [["qual", "性质", "root"], ["-ify", "使…化", "suffix"]],
    senses: [
      { dim: "门槛的达成", tag: "资格",
        scene: "通过考试、训练或筛选，使自己具备了做某事的基本条件。",
        zh: "使合格、取得资格",
        ex: [{ en: "She qualified as a doctor last year.", zh: "她去年取得了医生资格。" },
             { en: "The team qualified for the finals.", zh: "该队获得了决赛资格。" }] },
      { dim: "陈述的限定与保留", tag: "语言",
        scene: "给一个过于绝对的说法加上限定条件，缩小它的适用范围（这也是语法术语「限定词」的来源）。",
        zh: "限定、使有保留",
        ex: [{ en: "I should qualify that statement.", zh: "我应该给那句话加个限定条件。" }] }
    ],
    contrasts: [{ w: "entitle", note: "qualify 强调「门槛的跨越」（你的硬件指标达标了）；empower 强调「力量的注入」（给你一把剑去劈开障碍）；entitle 强调「地位的拔高与索取权」（不关心你有没有能力，就是系统发给你的一张欠条）。" }]
  },

  {
    id: "specially", w: "specially", pos: "adv.",
    core: "为了某个特定目的，从零开始定制一个原本不存在的东西",
    image: "一副专属打造的模具。核心是「目的（Purpose）」，而不是「程度」。",
    senses: [
      { dim: "目的导向的定制", tag: "目的",
        scene: "某个动作或物品的存在完全服务于一个指定的对象或场景，如果没有这个目的它就不会出现。",
        zh: "专门地、特意地",
        ex: [{ en: "I baked this cake specially for you.", zh: "我专门为你烤了这个蛋糕。" },
             { en: "This coat was designed specially for cold weather.", zh: "这件大衣是专门为寒冷天气设计的。" }] }
    ],
    contrasts: [{ w: "especially", note: "英语中最危险的陷阱之一。especially 的核心是「程度与聚焦」——从已有的一堆东西里挑出最扎眼的那个，图景是聚光灯；specially 的核心是「目的与定制」——为某个目的从零打造，图景是专属模具。对照：This coat is useful, especially in cold weather（聚焦极端场景）vs. designed specially for cold weather（目的定制）。" }]
  },

  {
    id: "clever", w: "clever", pos: "adj.",
    core: "反应快、点子多——遇到突发问题能立刻想出一个绝妙的解法",
    image: "如果 smart 是 CPU 算力强（知识储备与逻辑处理），clever 就是 RAM 反应快（临场敏捷度）。",
    senses: [
      { dim: "临场的机敏", tag: "认知",
        scene: "面对没有预案的状况，迅速找到一个巧妙的切入点。",
        zh: "聪明的、机灵的",
        ex: [{ en: "That's a clever solution.", zh: "这个解法很巧妙。" }] },
      { dim: "设计的巧思", tag: "物",
        scene: "形容一个装置或方案的构思出人意料地简洁高效。",
        zh: "精巧的、构思巧妙的",
        ex: [{ en: "a clever piece of engineering", zh: "一件构思巧妙的工程作品" }] },
      { dim: "略带贬义的耍小聪明", tag: "语用",
        scene: "在某些语境下暗示「聪明用错了地方」，尤其是 too clever by half。",
        zh: "自作聪明的",
        ex: [{ en: "Don't try to be clever with me.", zh: "别跟我耍小聪明。" }] }
    ],
    contrasts: [{ w: "cunning", note: "智力坐标系：smart 是算力强（学得多、想得深，中性偏褒）；clever 是反应快（点子多，可褒可贬）；cunning 是「智力的黑客行为」（只在乎不择手段地赢，永远带隐秘、欺骗与极度利己的底色）。面对迷宫，smart 的人推导路线，clever 的人迅速试错，cunning 的人直接炸开墙壁或骗别人替他走。" }]
  },

  {
    id: "live", w: "live", pos: "v.",
    core: "维持生命并在某处展开日常——吃饭、睡觉、过日子",
    image: "「一缕炊烟」。英语中最通用、最有烟火气的居住动词，门槛极低，不涉及任何法律或行政色彩。",
    senses: [
      { dim: "日常的居住", tag: "生活",
        scene: "长期在某地过日子，不强调户籍或法律身份。",
        zh: "住、居住",
        ex: [{ en: "I live in London.", zh: "我住在伦敦。" }] },
      { dim: "生命的存续", tag: "生物",
        scene: "处于活着的状态，或维持生存所需。",
        zh: "活着、生存",
        ex: [{ en: "She lived to be ninety.", zh: "她活到了九十岁。" },
             { en: "They live on a small pension.", zh: "他们靠一小笔养老金生活。" }] },
      { dim: "生活方式的展开", tag: "抽象",
        scene: "指以某种方式度过人生。",
        zh: "过（某种生活）",
        ex: [{ en: "He lives a quiet life.", zh: "他过着平静的生活。" }] }
    ],
    contrasts: [{ w: "reside", note: "居住三档：stay 是「一片浮萍」，极短暂的过渡性落脚（住酒店）；live 是「一缕炊烟」，最通用最有烟火气；reside 是「一枚钢印」，极度正式冰冷，直接指向法律行政系统中的长期锚定（警方或法庭用语）。" }]
  },

  {
    id: "apply", w: "apply", pos: "v.",
    core: "把 A 精确地贴合、对准到 B 之上",
    image: "ap-（朝向）+ plicare（折叠、贴合）＝「折过去贴上」。它的核心是「接触与对准」，不强调力度大小。",
    origin: "拉丁语 applicare：ad-（朝向）+ plicare（折叠、贴附）",
    parts: [["ap-", "朝向（ad-）", "prefix"], ["ply", "折叠/贴合", "root"]],
    senses: [
      { dim: "物质的表面涂敷", tag: "物理",
        scene: "把药膏、油漆或防晒霜均匀地贴合到一个表面上。",
        zh: "涂、敷、施加",
        ex: [{ en: "Apply the cream twice a day.", zh: "每天涂两次药膏。" },
             { en: "Apply gentle pressure to the wound.", zh: "在伤口上轻轻施压。" }] },
      { dim: "规则与方法的套用", tag: "抽象",
        scene: "把一条通用的公式、法律或原则，精确对准某个具体案例来使用。",
        zh: "应用、适用",
        ex: [{ en: "The same rule applies here.", zh: "同样的规则也适用于此。" },
             { en: "Apply the formula to this data set.", zh: "把公式套用到这组数据上。" }] },
      { dim: "申请：把自己递上去", tag: "社会",
        scene: "把自己的资料贴附到一个职位或名额上，请求被接纳。",
        zh: "申请",
        ex: [{ en: "She applied for the job.", zh: "她申请了那份工作。" }] }
    ],
    contrasts: [{ w: "exert", note: "力度分级：use 是门槛最低的「工具调用」；apply 的核心是「表面贴合与对准」，apply pressure 可能只是把手轻轻按在伤口上，重在精确接触；exert 的核心是「能量的爆发与下压」，exert pressure 是带着庞大重量死死压上去。" }]
  },

  {
    id: "promise", w: "promise", pos: "v./n.",
    core: "在此刻把一句关于未来的话送出去，作为一份口头契约",
    image: "pro-（向前）+ mittere（送）＝「把话送到未来」。它的重量全部依赖说话者的主观意愿——所以随时可能被打破。",
    origin: "拉丁语 promittere：pro-（向前）+ mittere（送）",
    parts: [["pro-", "向前", "prefix"], ["mise", "送（mittere）", "root"]],
    senses: [
      { dim: "口头契约的建立", tag: "承诺",
        scene: "向对方保证未来会做或不做某事，建立起一份仅由信用担保的约定。",
        zh: "承诺、答应",
        ex: [{ en: "He promised to call.", zh: "他答应会打电话来。" },
             { en: "She broke her promise.", zh: "她食言了。" }] },
      { dim: "潜力的预示", tag: "前景",
        scene: "某人或某物当前展现出的迹象，让人预期它未来会有好结果。",
        zh: "希望、前途",
        ex: [{ en: "a young writer of great promise", zh: "一位大有前途的年轻作家" },
             { en: "The sky promises rain.", zh: "天色预示着要下雨。" }] }
    ],
    contrasts: [{ w: "commit", note: "promise 是「嘴上的契约」，门槛极低重量极轻，随主观意愿改变就能打破；submit 是「由下向上的呈递」，把自己交给上位权威审查；commit 是「不可逆的系统固化」，你自己把状态强行砸进底层系统，一旦提交就成为系统历史不可分割的一部分。" }]
  },

  {
    id: "use", w: "use", pos: "v./n.",
    core: "调用一件工具去执行它本来就该执行的任务",
    image: "顺理成章的常规操作：用笔写字、用肺呼吸、用键盘敲代码。它只陈述「借助了某物」，不强调力气、也不强调巧思。",
    senses: [
      { dim: "工具的常规调用", tag: "动作",
        scene: "事物正在履行它被设计出来时就该履行的功能。",
        zh: "使用、用",
        ex: [{ en: "I use a knife to cut the apple.", zh: "我用刀切苹果／刀就是用来切东西的。" },
             { en: "Use the search box to find it.", zh: "用搜索框找它。" }] },
      { dim: "资源的消耗", tag: "资源",
        scene: "在运转过程中把某种资源耗掉。",
        zh: "耗用、用掉",
        ex: [{ en: "This car uses a lot of fuel.", zh: "这辆车很费油。" }] },
      { dim: "利用他人（贬义）", tag: "人际",
        scene: "把人当成达成目的的工具，不顾其感受。",
        zh: "利用（某人）",
        ex: [{ en: "He just used me.", zh: "他只是在利用我。" }] }
    ],
    contrasts: [{ w: "utilize", note: "科技论文中最常被滥用的一对。use 是「顺理成章的常规操作」；utilize 必须包含「资源的重新分配」或「功能的非预设转化」（I utilize a knife as a mirror）。在没有转化意味的句子里强用 utilize，在母语者眼中就像用高射炮打蚊子。" }]
  },

  {
    id: "undermine", w: "undermine", pos: "v.",
    core: "从底部一点点掏空地基，使上面的结构逐渐动摇、失去支撑",
    image: "under（在下面）+ mine（挖矿）。海水长年累月冲刷悬崖的底部；同事在老板面前暗中说你坏话削弱你的威信。它的结果是「岌岌可危」，未必立刻倒塌。",
    origin: "under-（在下面）+ mine（挖掘）",
    parts: [["under-", "在下面", "prefix"], ["mine", "挖掘", "root"]],
    senses: [
      { dim: "威信与信心的侵蚀", tag: "抽象",
        scene: "通过持续的、往往不公开的动作，让一个人的权威、自信或一项政策的公信力逐步流失。",
        feature: "强调渐进与隐蔽，结果是削弱而非摧毁。",
        zh: "暗中破坏、削弱",
        ex: [{ en: "The rumours undermined her authority.", zh: "这些谣言削弱了她的权威。" },
             { en: "Such behaviour undermines public trust.", zh: "这种行为侵蚀了公众信任。" }] },
      { dim: "地基的物理掏空", tag: "物理",
        scene: "水流或挖掘作业把结构底部的支撑物带走。",
        zh: "掏空……的基础",
        ex: [{ en: "The river had undermined the bridge's foundations.", zh: "河水掏空了桥的地基。" }] }
    ],
    contrasts: [{ w: "subvert", note: "力的方向三分：overthrow 是「正面强攻、从上往下推」，暴力公开；undermine 也是从底下挖，但结果是「削弱、动摇」，大楼岌岌可危却未必倒塌；subvert 是「挖空并强制翻转」，强调最终那个「倒错与崩塌的质变」。你可以 undermine 别人的信心，但不能 subvert 别人的信心。" }]
  },

  {
    id: "transform", w: "transform", pos: "v.",
    core: "外在形态被彻底粉碎并重塑，变到让人认不出来",
    image: "毛毛虫变成蝴蝶，或变形金刚（Transformer）。trans-（跨越）+ form（形态）＝「跨过形态的边界」。",
    origin: "拉丁语：trans-（跨越）+ forma（形态）",
    parts: [["trans-", "跨越", "prefix"], ["form", "形态", "root"]],
    senses: [
      { dim: "外形与结构的剧变", tag: "物理",
        scene: "事物的可见形态发生根本改变，前后对比几乎无法辨认。",
        zh: "使变形、彻底改变",
        ex: [{ en: "The caterpillar transforms into a butterfly.", zh: "毛毛虫变成蝴蝶。" },
             { en: "The renovation transformed the old factory.", zh: "翻修彻底改变了这座旧工厂的面貌。" }] },
      { dim: "性质与局面的根本改观", tag: "抽象",
        scene: "一项技术或事件把某个领域的运作方式整个改写。",
        zh: "彻底改观、变革",
        ex: [{ en: "The internet transformed how we work.", zh: "互联网彻底改变了我们的工作方式。" }] }
    ],
    contrasts: [{ w: "convert", note: "「改变」三档：alter 是「局部修补」（裁缝改衣服），核心身份和功能不变；transform 是「外在形态的彻底粉碎与重塑」，强调视觉上的惊天动地；convert 是「内部协议或用途的切换」，外表可能毫无变化。把无神论者变成基督徒，肉体外观没有任何改变（不能用 transform），但大脑里运行的底层代码全换了——那是 convert。" }]
  }

];
