import type { DraftScene, Lesson, Scene } from '../../types/scene';

const drafts: Array<DraftScene & { title: string; partId?: string }> = [
  {
    id: 'slice-cover',
    title: '字符串操作：切片',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      stringSlice: { mode: 'cover' },
    },
  },
  {
    id: 'slice-privacy',
    title: '问题导入',
    partId: '01',
    type: 'question',
    layout: 'fullscreen',
    content: {
      stringSlice: { mode: 'privacy' },
    },
  },
  {
    id: 'slice-index-need',
    title: '问题导入',
    partId: '02',
    type: 'run',
    layout: 'split',
    content: {
      stringSlice: { mode: 'index-need' },
    },
    code: {
      initial:
        'phone = "13800001234"\nfront = phone[0] + phone[1] + phone[2]\nprint(front)',
      editable: true,
      resetToInitial: true,
    },
    expectedOutput: '138',
  },
  {
    id: 'slice-cut-demo',
    title: '切片是怎样“切”的',
    partId: '03',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      stringSlice: { mode: 'cut-demo' },
    },
  },
  {
    id: 'slice-syntax',
    title: 'Python切片语法',
    partId: '04',
    type: 'run',
    layout: 'split',
    content: {
      stringSlice: { mode: 'syntax' },
    },
    code: {
      initial:
        'poem = "举头望明月低头思故乡"\nup = poem[0:5]\ndown = poem[5:10]\n\nprint(up)\nprint(down)',
      editable: true,
      resetToInitial: true,
    },
    expectedOutput: '举头望明月\n低头思故乡\n举望月\n低思乡',
  },
  {
    id: 'slice-cases',
    title: '完成手机号脱敏',
    partId: '05',
    type: 'run',
    layout: 'split',
    content: {
      stringSlice: { mode: 'cases' },
    },
    code: {
      initial: 'phone = "13800001234"\n# 任务：输出 138****1234',
      editable: true,
      resetToInitial: true,
    },
    expectedOutput: '138****1234',
  },
  {
    id: 'slice-ai-review',
    title: '写对了，是否写好了',
    partId: '06',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      stringSlice: { mode: 'ai-review' },
    },
  },
  {
    id: 'slice-pitfalls',
    title: '两处容易用错',
    partId: '07',
    type: 'run',
    layout: 'split',
    content: {
      stringSlice: { mode: 'pitfalls' },
    },
    code: {
      initial: 'phone = "13800001234"\n# 先预测：phone[11] 和 phone[11:]',
      editable: true,
      resetToInitial: true,
    },
    expectedOutput: '138\n13800001234',
  },
  {
    id: 'slice-minus',
    title: '负号的两种走法',
    partId: '08',
    type: 'run',
    layout: 'split',
    content: {
      stringSlice: { mode: 'minus-ways' },
    },
    code: {
      initial: 'phone = "13800001234"\nprint(phone[-4:])\n# 负号在格子上：-4 是倒数第 4 格',
      editable: true,
      resetToInitial: true,
    },
    expectedOutput: '1234\n居然天上客\n43210000831',
  },
  {
    id: 'slice-practice',
    title: '课堂练习',
    partId: '09',
    type: 'modify',
    layout: 'split',
    content: {
      stringSlice: { mode: 'practice' },
    },
    code: {
      initial:
        'row = "2026100443210000831"\ndate = ""     # 切出日期\nphone = ""    # 转正手机号\npublic = ""   # 公示行：日期 + 空格 + 脱敏手机号\n\nprint(public)\nprint(row)',
      editable: true,
      resetToInitial: true,
    },
    expectedOutput: '20261004 138****1234\n2026100443210000831',
    hints: [
      { level: 1, text: '前 8 位是日期，后面 11 位是倒序手机号。' },
      { level: 2, text: '倒序看步长的符号：往回走用 -1，整串倒过来时 start 和 end 都可以空着。后 4 位不要从左边数，用负索引写到这一侧的尽头。' },
    ],
  },
  {
    id: 'slice-values',
    title: '为交出去的那一行负责',
    partId: '10',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      stringSlice: { mode: 'values' },
    },
  },
  {
    id: 'slice-summary',
    title: '课堂总结',
    partId: '11',
    type: 'summary',
    layout: 'fullscreen',
    content: {
      stringSlice: { mode: 'summary' },
    },
  },
  {
    id: 'slice-homework',
    title: '课后任务',
    partId: '12',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      stringSlice: { mode: 'homework' },
    },
  },
];

const scenes: Scene[] = drafts.map((draft, index) => {
  const { partId, ...scene } = draft;
  return {
    ...scene,
    index: index + 1,
    ...(partId ? { partId } : {}),
  };
});

export const stringSlicingLesson: Lesson = {
  id: 'string-slicing',
  number: 0,
  title: 'Python字符串切片',
  subtitle: '【Python程序设计】',
  hours: 0.3,
  parts: [
    { index: '01', title: '问题导入' },
    { index: '02', title: '从索引到切片' },
    { index: '03', title: '切片是怎样“切”的' },
    { index: '04', title: 'Python切片语法' },
    { index: '05', title: '完成手机号脱敏' },
    { index: '06', title: '写对了，是否写好了' },
    { index: '07', title: '两处容易用错' },
    { index: '08', title: '负号的两种走法' },
    { index: '09', title: '课堂练习' },
    { index: '10', title: '为交出去的那一行负责' },
    { index: '11', title: '课堂总结' },
    { index: '12', title: '课后任务' },
  ],
  sceneCount: scenes.length,
  scenes,
};
