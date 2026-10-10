export type SceneType =
  | 'explain'
  | 'question'
  | 'predict'
  | 'run'
  | 'modify'
  | 'debug'
  | 'challenge'
  | 'aiReview'
  | 'break'
  | 'summary';

export type LayoutMode = 'split' | 'fullscreen';

export interface PredictionOption {
  id: string;
  label: string;
  isCorrect?: boolean;
}

export interface PredictionConfig {
  question: string;
  options: PredictionOption[];
  allowMultiple?: boolean;
  stepTrace?: string[];
}

export interface RevealContent {
  title?: string;
  body: string;
  highlights?: string[];
}

export interface HintLevel {
  level: number;
  text: string;
}

export interface AIReviewTrigger {
  unlockAfter: 'firstRun' | 'predictionSubmitted' | 'errorObserved' | 'humanReviewDone';
  presetKey: string;
}

export interface SceneImage {
  src: string;
  alt: string;
  caption?: string;
  /** 连线用的标识 */
  id?: string;
}

export interface GalleryLink {
  from: string;
  to: string;
  color: string;
}

export interface InfoCard {
  title: string;
  items: string[];
  href?: string;
}

export interface ScheduleBlock {
  title: string;
  subtitle: string;
  rows: { time: string; place: string }[];
}

export interface GradeItem {
  label: string;
  percent: string;
  note?: string;
  children?: { label: string; percent: string; note?: string }[];
}

export interface CatalogItem {
  index: string;
  title: string;
}

export interface LearningFlowContent {
  /** 开场总结句 */
  lead: string;
  /** 依次出现的步骤（不含箭头） */
  steps: string[];
  /** 流程旁的 AI 说明 */
  aiNote: {
    title: string;
    body: string;
  };
}

export interface HistoryDialogueContent {
  /** 贯穿任务，如：让计算机计算：12 + 8 */
  task: string;
  /** 本页小标题 */
  subtitle: string;
  humanText: string;
  cpuConfused: string;
  /** 点击后 CPU 侧展示的二进制（可多行） */
  cpuBinary: string[];
  /** 点击后人类侧淡出时的提示 */
  transformHint?: string;
  /** 冲突立住后的过渡句 */
  conclusion?: string;
}

/** 第一代：机器语言 */
export interface MachineLangContent {
  era: string;
  taskNote?: string;
  binaryLines: string[];
  disclaimer?: string;
  question: string;
  painPoints: string[];
  bugHint: string;
  /** 这一代解决了什么、留下什么问题 */
  conclusion?: string;
}

/** 第二代：汇编语言 */
export interface AssemblyLangContent {
  binaryLines: string[];
  assemblyLines: string[];
  teacherNote: string;
  assemblerLabel: string;
  translatorHint: string;
  conclusion?: string;
}

/** 第三代：高级语言对比 */
export interface HighLevelCompareContent {
  columns: { label: string; code: string }[];
  question: string;
  conclusion: string;
}

/** 帽子页：人话 → 高级语言 → 汇编 → 机器指令 → CPU，同一任务逐层点亮 */
export interface TranslateStackContent {
  lead: string;
  task: string;
  layers: {
    label: string;
    note: string;
    body: string;
  }[];
  conclusion: string;
}

/** 高级语言如何被计算机「吃下」：源码→翻译→指令→CPU→结果 */
export interface DigestPipelineContent {
  sourceCode: string;
  sourceLabel: string;
  translatorLabel: string;
  /** 短标签，如「编译器 / 解释器」 */
  translatorHint: string;
  machineLines: string[];
  machineLabel: string;
  cpuLabel: string;
  result: string;
  resultLabel: string;
  /** 收束一句 */
  conclusion: string;
}

/** TIOBE 等流行度排行：分步揭示柱状图 */
export interface TiobeRankContent {
  /** 开场说明（文中「TIOBE」会渲染为可点击链接） */
  lead: string;
  /** 数据来源标注，如「TIOBE Index · 2026 年 9 月」 */
  sourceLabel: string;
  /** rating 为百分比数值，如 17.76 表示 17.76% */
  rows: { rank: number; language: string; rating: number }[];
  /** 点击 TIOBE 跳转的官网 */
  href: string;
}

/** 完整时间轴 + Prompt 认知冲突 + 语言用途表 */
export interface LanguageTimelineContent {
  eras: string[];
  axisLeft: string;
  axisRight: string;
  conflictQuestion: string;
  teacherHold: string;
  tableTitle: string;
  tableRows: { language: string; uses: string }[];
}

/** 为什么选 Python：同一任务代码对比 */
export interface WhyPythonCompareContent {
  taskLabel: string;
  left: { label: string; code: string };
  right: { label: string; code: string };
  /** C 中将被淡化的「底层细节」行（按行号，0-based） */
  hiddenLineIndexes: number[];
  explanation: string;
}

/** Python 与大数据专业路径 + 效果演示 */
export interface BigDataPathContent {
  steps: string[];
  chartTitle: string;
  chartBars: { label: string; value: number }[];
  bridgeQuote: string;
}

/** Python 优点与边界 */
export interface PythonProsContent {
  question: string;
  reasons: string[];
  boundary: string;
}

/** Python 之父：肖像 + 分步趣事 */
export interface PythonFatherContent {
  portrait: SceneImage;
  anecdotes: { title: string; body: string; takeaway: string }[];
  /** 名称读音（可点击播放） */
  pronunciations?: {
    label: string;
    /** 如 /ˈpaɪθɑːn/ 或「派森」 */
    phonetic: string;
    src: string;
    note?: string;
  }[];
  pronunciationsHint?: string;
  /** 全部趣事揭开后的结语（可选） */
  closing?: string;
}

/** Python 设计取向：原则 + 可选短代码对照 */
export interface PythonDesignContent {
  principles: { line: string; gloss: string }[];
  compare?: {
    left: { label: string; code: string };
    right: { label: string; code: string };
  };
  conclusion?: string;
}

/** Python 简史节点（轻量） */
export interface PythonBriefHistoryContent {
  nodes: { year: string; title: string; note: string }[];
  bridge?: string;
}

/** 语言 / 解释器 / IDE 三者辨析 */
export interface RuntimeModelContent {
  items: { title: string; body: string }[];
  analogies: { label: string; value: string }[];
  caveat: string;
}

/** Python 专用环境插画：.py → 编辑器 → 解释器 → 输出 */
export interface PythonEnvContent {
  filename: string;
  sampleCode: string;
  fileLabel: string;
  fileHint: string;
  editorLabel: string;
  editorHint: string;
  interpreterLabel: string;
  interpreterHint: string;
  consoleLabel: string;
  consoleOutput: string;
  /** 收束：环境关系 */
  conclusion: string;
}

/** 编译型 vs 解释型：双轨插画对比（强调整份先译 vs 读一行执行一行） */
export interface CompileVsInterpretContent {
  /** 多行源码，用于演示「整份」与「逐行」 */
  lines: string[];
  /** 与 lines 一一对应的输出 */
  outputs: string[];
  compiledTitle: string;
  interpretedTitle: string;
  compiledTag: string;
  interpretedTag: string;
  conclusion: string;
}

/** Python 版本说明 + 官网下载 */
export interface PythonVersionContent {
  courseVersion: string;
  lead: string;
  /** 如 3 / 12 / x 的分段释义 */
  versionParts: { label: string; meaning: string }[];
  notes: string[];
  linkLabel: string;
  href: string;
}

/** 安装顺序插画 + 编辑器外链 */
export interface PythonInstallContent {
  lead: string;
  orderNote: string;
  steps: { title: string; body: string }[];
  pythonLink: { label: string; href: string };
  editors: { name: string; role: string; href: string; primary?: boolean }[];
}

/** 环境验收清单 + 常见坑 */
export interface PythonVerifyContent {
  checks: { label: string; detail: string }[];
  pitfalls: string[];
  successLine: string;
}

/** 交互式 REPL 演示 */
export interface ReplDemoContent {
  steps: {
    input: string;
    promptPredict?: string;
    output: string;
    note?: string;
  }[];
  suitedFor: string[];
  designNote: string;
}

/** 从上到下逐步执行 */
export interface StepExecContent {
  filename: string;
  lines: string[];
  outputs: string[];
  pipeline: string[];
  conclusion: string;
}

/** 带着色 token 的代码演示 */
export interface TypedDemoContent {
  lead?: string;
  lines: {
    code: string;
    tokens?: { text: string; tone: 'int' | 'float' | 'str' | 'bool' | 'plain' }[];
    /** 行右侧浅色类型标，如 int / str */
    kind?: string;
  }[];
  predict?: { question: string; codes: string[]; answers: string[] };
  takeaway: string;
}

/** 算术运算符优先级：层级表 + 对照例子 */
export interface ExprOrderContent {
  tiers: { rank: string; ops: string; note: string }[];
  cases: { expr: string; result: string; note: string }[];
}

/** 标识符定义、命名规则、Python 保留字 */
export interface IdentifiersContent {
  definition: string;
  examples: string;
  rules: string[];
  keywordLead: string;
  keywords: string[];
  keywordNote?: string;
  close?: string;
  /** 点按切换右侧编辑器里的例子。第一段同时作为 scene.code.initial。 */
  demos?: { title: string; note: string; code: string }[];
}

/** 最小语法规则 + 故意错误 */
export interface SyntaxRulesContent {
  rules: string[];
  brokenCode: string;
  fixSteps: string[];
}

/** 变量标签 / 重绑定 / 自增 动画 */
export interface VarModelContent {
  mode: 'label' | 'rebind' | 'update';
  codeLines: string[];
  teacherLine: string;
  conclusion: string;
  /** 板书补充，如「赋值」 */
  boardNote?: string;
  humanTranslation?: string;
  /** 名字胶囊，默认 score */
  name?: string;
  /** 起始值，默认 92；update 模式默认 90 */
  value?: string;
  /** 重绑定 / 自增后的新值，默认 95 */
  nextValue?: string;
  /** 值卡片上的浅色类型标（如 int），不展开讲堆/对象 */
  valueKind?: string;
  /** update 模式右边加上的数。未写时按 5，与 score = score + 5 一致。 */
  delta?: number;
  /** 重绑定之后紧接着讲「取出旧值再贴回去」，避免再翻一页重复「= 不是相等」 */
  followOn?: {
    codeLines: string[];
    value: string;
    nextValue: string;
    teacherLine: string;
    conclusion: string;
    humanTranslation?: string;
    question?: string;
    /** 右边加上的数，动画写成「旧值 + delta」。默认 5，与「score = score + 5」一致。 */
    delta?: number;
  };
}

/** 名字一侧与对象一侧：identity / type / value */
export interface BindingModelContent {
  summary: string;
}

/** 第 2 讲：上图（名字指向数据）+ 下动画（赋值过程） */
export interface AssignIntroContent {
  name: string;
  value: string;
  summary: string;
}

/** 变量定义落脚页：名字、值、赋值三件套 */
export interface VarDefinitionContent {
  parts: { label: string; note: string; example: string }[];
  definition: string;
  mathLine: string;
  programLine: string;
}

/** 输入→处理→输出 */
export interface IpoContent {
  modules: { title: string; prompt: string; answer: string }[];
  task: string;
  englishFlow?: string[];
}

/** 为什么需要变量：无名数字 → 标签 → 代码 */
export interface WhyNeedVarContent {
  bareCode: string;
  questions: string[];
  teacherLines: string[];
  numbers: { value: string; label: string }[];
  namedCode: string;
  summary: string;
}

/** 变量 vs 字符串预测 */
export interface VarPredictContent {
  code: string;
  question: string;
  options?: string[];
  revealOutputs: string[];
  compareCode?: string;
  compareOutputs?: string[];
  takeaway: string[];
  /** 收束时并排的值卡片（名字/字面量 + 值 + 可选类型标） */
  cards?: { caption: string; value: string; kind?: string }[];
}

/** input / float 流程动画 */
export interface InputFlowContent {
  mode: 'input' | 'float';
  code: string;
  steps: string[];
  teacherLine: string;
  typeContrast?: { label: string; kind: string }[];
}

/** 分步提问（不运行先回答） */
export interface QuestionCascadeContent {
  title?: string;
  questions: string[];
  conclusionLines: string[];
  footer?: string;
}

/** 选项挑战 */
export interface CodeChoiceContent {
  prompt: string;
  oldCode: string;
  options: { id: string; code: string; correct?: boolean }[];
  followUps: string[];
  conclusion: string;
}

/** 对照：问一次 AI vs 可重复程序 */
export interface OnceVsProgramContent {
  aiAsk: string;
  aiAnswer: string;
  programCode: string;
  teacherLines: string[];
}

/** AI 现场写代码（可接免费 API，离线有预设） */
export interface AiLiveCodeContent {
  prompt: string;
  presetReply: string;
  admitLine: string;
  challengeQuestion: string;
}

/**
 * 验证/巩固 AI 时代学习方式：
 * 提示词 → AI 代码 → 承认正确 → 逐问接管 → 总结
 */
export interface MethodVerifyContent {
  prompt: string;
  presetReply: string;
  admitLine: string;
  questions: string[];
  summary: string;
}

/** 结课三层答案 + 关系图 */
export interface WhyLearnWrapContent {
  reopenQuestion: string;
  keywords: string[];
  layers: { title: string; body: string }[];
  flow: string[];
  aiNote: string;
}

/** 数据类型思维导图：每种类型一行适用场景 */
export interface TypeMapContent {
  note?: string;
}

/** 第 10 页：整数精确存放，浮点数拆成符号、指数、尾数 */
export interface IntFloatContent {
  intNote: string;
  floatNote: string;
  equalNote: string;
}

/** 第 8 页按点击推进，文案在 TypeProbeStage */
export interface TypeProbeContent {
  steps?: number;
}

/** 最终结论页 */
export interface FinalVerdictContent {
  lines: string[];
  abilities?: string[];
  teaserCode?: string;
  teaserQuestion?: string;
  teaserClose?: string;
}

/** 两个名字指向同一对象，或模块名字空间（dict：键 → 指针，对象在表外） */
export interface NameLinkContent {
  mode: 'alias' | 'namespace';
  summary: string;
}

/** 一次展示的下标或切片例子。pick 是要亮起的下标。 */
export interface StringBoardExample {
  code: string;
  result: string;
  note: string;
  pick?: number[];
}

/** 第 2 讲：一排字符上的下标、切片，以及「有没有 / 有几个」 */
export interface StringBoardContent {
  word: string;
  mode: 'index' | 'negative' | 'slice' | 'step' | 'reverse' | 'find';
  /** 格子上方的变量名，画出「名字 → 字符串对象」 */
  bindingName?: string;
  /** find：要在这排字符里寻找的那一个 */
  mark?: string;
  /** find 点到最后一步时换上的代码 */
  nextCode?: string;
  /** 有 examples 时一次展示整页，不再点按推进 */
  lead?: string;
  examples?: StringBoardExample[];
}

/** 同一组下标先切对、再切错，然后按空白切开 */
export interface StringCutContent {
  fitted: { text: string; ranges: [number, number][] };
  shifted: { text: string; ranges: [number, number][] };
  words: string[];
  codes: [string, string, string];
  close: string;
}

/** 加号接句，再收成带空位的 f-string */
export interface StringTemplateContent {
  plusCode: string;
  formatCode: string;
  pieces: string[];
  gaps: string[];
  slots: { name: string; value: string }[];
  lines: string[];
}

/** 输入的一排数字字符，转成整数后再运算 */
export interface StringCastContent {
  digits: string;
  factor: string;
  product: string;
  code: string;
  line: string;
}

/** 第 2 讲字符串收束：是文本 / 有顺序 / 不可变 */
export interface StringIdeaContent {
  title: string;
  branches: { title: string; items: string[] }[];
  close: string;
}

/** 同一页里，运行之后才逐段换上后面的代码和一句结论 */
export interface CodeBeat {
  code?: string;
  line?: string;
  note?: string;
  choices?: { label: string; correct?: boolean }[];
  fork?: StringForkContent;
}

export interface CodeBeatsContent {
  /** 为 true 时，已经出现的句子都留在屏幕上 */
  accumulate?: boolean;
  /** 为 true 时，不必先运行就能逐段打开疑问和对应代码 */
  beforeRun?: boolean;
  beats: CodeBeat[];
}

/** 造一个新字符串：两个名字各指一串，原串内部没有被改掉 */
export interface StringForkContent {
  keep: { name: string; value: string };
  created: { name: string; value: string };
  /** 要点掉的错误想法 */
  rejectInPlace: string;
  close: string;
}

/** 教学比赛微课堂：字符串切片的专用可视化场景 */
export interface BranchContestContent {
  mode:
    | 'cover'
    | 'conflict'
    | 'trace'
    | 'elif'
    | 'lab'
    | 'extend'
    | 'values'
    | 'summary'
    | 'homework'
    | 'thanks';
}

export interface StringSliceContent {
  mode:
    | 'cover'
    | 'privacy'
    | 'decompose'
    | 'index-need'
    | 'syntax'
    | 'cut-demo'
    | 'negative'
    | 'boundary'
    | 'ai-review'
    | 'cases'
    | 'pitfalls'
    | 'minus-ways'
    | 'practice'
    | 'values'
    | 'summary'
    | 'homework';
  phone?: string;
}

/** 圆点里需要单独标红的类型名 */
export interface MarkedSpan {
  text: string;
  mark?: boolean;
}

export interface SceneContent {
  headline?: string;
  /** 点击右侧逐条出现，顺序即出现顺序 */
  clickLines?: string[];
  /** 两列表头对照，如自然语言与 Python 条件 */
  compareTable?: {
    leftHeader: string;
    rightHeader: string;
    rows: { left: string; right: string }[];
  };
  body?: string;
  question?: string;
  bulletPoints?: string[];
  /** 与 bulletPoints 同款圆点，span.mark 为真时标红 */
  markedPoints?: MarkedSpan[][];
  /** 圆点列表下方的另一块说明，标题 + 编号，不与 bulletPoints 混用 */
  note?: { title: string; points: string[] };
  codeComparison?: {
    left: { label: string; code: string };
    right: { label: string; code: string };
  };
  voteOptions?: string[];
  checklist?: string[];
  flowDiagram?: string[];
  exitTicket?: string;
  preview?: string;
  promptQuote?: string;
  emoji?: string;
  image?: SceneImage;
  /** 投屏图片网格，按顺序排列 */
  gallery?: SceneImage[];
  /** 点击 from 后，用对应颜色连线到 to */
  galleryLinks?: GalleryLink[];
  infoCards?: InfoCard[];
  schedule?: ScheduleBlock[];
  gradeItems?: GradeItem[];
  catalog?: CatalogItem[];
  learningFlow?: LearningFlowContent;
  historyDialogue?: HistoryDialogueContent;
  translateStack?: TranslateStackContent;
  machineLang?: MachineLangContent;
  assemblyLang?: AssemblyLangContent;
  highLevelCompare?: HighLevelCompareContent;
  digestPipeline?: DigestPipelineContent;
  tiobeRank?: TiobeRankContent;
  languageTimeline?: LanguageTimelineContent;
  whyPythonCompare?: WhyPythonCompareContent;
  bigDataPath?: BigDataPathContent;
  pythonPros?: PythonProsContent;
  pythonFather?: PythonFatherContent;
  pythonDesign?: PythonDesignContent;
  pythonBriefHistory?: PythonBriefHistoryContent;
  runtimeModel?: RuntimeModelContent;
  pythonEnv?: PythonEnvContent;
  compileVsInterpret?: CompileVsInterpretContent;
  pythonVersion?: PythonVersionContent;
  pythonInstall?: PythonInstallContent;
  pythonVerify?: PythonVerifyContent;
  replDemo?: ReplDemoContent;
  stepExec?: StepExecContent;
  typedDemo?: TypedDemoContent;
  exprOrder?: ExprOrderContent;
  syntaxRules?: SyntaxRulesContent;
  identifiers?: IdentifiersContent;
  varModel?: VarModelContent;
  ipo?: IpoContent;
  whyNeedVar?: WhyNeedVarContent;
  varDefinition?: VarDefinitionContent;
  assignIntro?: AssignIntroContent;
  bindingModel?: BindingModelContent;
  varPredict?: VarPredictContent;
  inputFlow?: InputFlowContent;
  questionCascade?: QuestionCascadeContent;
  codeChoice?: CodeChoiceContent;
  onceVsProgram?: OnceVsProgramContent;
  aiLiveCode?: AiLiveCodeContent;
  methodVerify?: MethodVerifyContent;
  whyLearnWrap?: WhyLearnWrapContent;
  finalVerdict?: FinalVerdictContent;
  typeMap?: TypeMapContent;
  typeProbe?: TypeProbeContent;
  intFloat?: IntFloatContent;
  nameLink?: NameLinkContent;
  stringBoard?: StringBoardContent;
  stringCut?: StringCutContent;
  stringTemplate?: StringTemplateContent;
  stringCast?: StringCastContent;
  stringIdea?: StringIdeaContent;
  stringFork?: StringForkContent;
  codeBeats?: CodeBeatsContent;
  stringSlice?: StringSliceContent;
  branchContest?: BranchContestContent;
}

export interface SceneCode {
  initial: string;
  editable: boolean;
  resetToInitial: boolean;
}

export interface BreakContent {
  recapItems: string[];
  previewText: string;
}

export interface Scene {
  id: string;
  index: number;
  /** 页眉大块标题：有 part 时为 part 名，开场页为自身 title */
  title: string;
  /** 所属知识块 id（如 '01'）；开场/目录页可为空 */
  partId?: string;
  type: SceneType;
  layout: LayoutMode;
  /** split 时编辑器位置。默认在右侧。 */
  editorSide?: 'left' | 'right';
  /** 只显示代码编辑器，不显示右侧讲稿。 */
  editorOnly?: boolean;
  content: SceneContent;
  code?: SceneCode;
  prediction?: PredictionConfig;
  reveal?: RevealContent;
  hints?: HintLevel[];
  expectedOutput?: string;
  aiReview?: AIReviewTrigger;
  break?: BreakContent;
  requiresPrediction?: boolean;
  requiresReveal?: boolean;
}

/**
 * 写作态幻灯片：页码与块级 title 由 buildLesson 注入。
 * 开场导读页需自带 title；知识块内的页可省略 title。
 */
export type DraftScene = Omit<Scene, 'index' | 'title' | 'partId'> & {
  title?: string;
};

/** parts/ 下单个知识块 */
export interface ContentPart {
  id: string;
  scenes: DraftScene[];
}

/** 开课表中一讲对某知识块的引用 */
export interface LecturePartRef {
  /** 目录序号，如 '01' */
  id: string;
  /** 本讲目录与页眉显示名 */
  title: string;
  /** ContentPart.id */
  ref: string;
}

/** 封面与课堂「课后作业」页共用 */
export interface LectureHomework {
  /** 如「第一次课后作业」 */
  title: string;
  items: string[];
}

/** 某一学期开课表中的一讲 */
export interface LectureSpec {
  id: string;
  number: number;
  title: string;
  blurb: string;
  hours: number;
  ready: boolean;
  /** 开场导读 part id 列表（不含目录页；目录由 buildLesson 自动插入） */
  prelude?: string[];
  parts: LecturePartRef[];
  homework?: LectureHomework;
}

export interface Offering {
  id: string;
  /** 封面学期，如「2026 秋」 */
  term: string;
  lectures: LectureSpec[];
}

export interface Lesson {
  id: string;
  /** 第几讲 */
  number: number;
  /** 讲次主题，如「Python概述」 */
  title: string;
  /** 页眉展示，如「第 1 讲 · Python概述」 */
  subtitle: string;
  /** 本讲课时数 */
  hours: number;
  /** 本讲目录（供目录页与跳转） */
  parts: CatalogItem[];
  sceneCount: number;
  scenes: Scene[];
}
