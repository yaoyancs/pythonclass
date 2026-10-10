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
        'id = "532625999999994021"\n# 前 6 位：每个下标一个方括号\nfront = id[0] + id[1] + id[2] + id[3] + id[4] + id[5]\nprint(front)',
      editable: true,
      resetToInitial: true,
    },
    expectedOutput: '532625********4021',
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
    title: '切片语法',
    partId: '04',
    type: 'run',
    layout: 'split',
    content: {
      stringSlice: { mode: 'syntax' },
    },
    code: {
      initial:
        'text = "风送花香红满地，雨滋春树碧连天"\n# 完整写法：s[start:end:step]\nprint(text[0:7:1])',
      editable: true,
      resetToInitial: true,
    },
    expectedOutput: '天连碧树春滋雨，地满红香花送风',
  },
  {
    id: 'slice-cases',
    title: '写对了，是否写好了',
    partId: '05',
    type: 'run',
    layout: 'split',
    content: {
      stringSlice: { mode: 'cases' },
    },
    code: {
      initial:
        'phone = "13906331234"\n# 能运行，结果是 139****1234\nprint(phone[:3] + "****" + phone[7:11])',
      editable: true,
      resetToInitial: true,
    },
    expectedOutput: '139****1234',
  },
  {
    id: 'slice-practice',
    title: '课堂练习',
    partId: '06',
    type: 'modify',
    layout: 'split',
    content: {
      stringSlice: { mode: 'practice' },
    },
    code: {
      initial:
        'row = "2026100443213360931"\ndate = ""     # 切出日期\nphone = ""    # 转正手机号\npublic = ""   # 公示行：日期 + 空格 + 脱敏手机号\n\nprint(public)\nprint(row)',
      editable: true,
      resetToInitial: true,
    },
    expectedOutput: '20261004 139****1234\n2026100443213360931',
    hints: [
      { level: 1, text: '前 8 位是日期，后面 11 位是倒序手机号。' },
      { level: 2, text: '倒序看步长的符号：往回走用 -1，整串倒过来时 start 和 end 都可以空着。后 4 位不要从左边数，用负索引写到这一侧的尽头。' },
    ],
  },
  {
    id: 'slice-values',
    title: '课堂思政',
    partId: '07',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      stringSlice: { mode: 'values' },
    },
  },
  {
    id: 'slice-summary',
    title: '课堂总结',
    partId: '08',
    type: 'summary',
    layout: 'fullscreen',
    content: {
      stringSlice: { mode: 'summary' },
    },
  },
  {
    id: 'slice-homework',
    title: '课后任务',
    partId: '09',
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
    { index: '04', title: '切片语法' },
    { index: '05', title: '写对了，是否写好了' },
    { index: '06', title: '课堂练习' },
    { index: '07', title: '课堂思政' },
    { index: '08', title: '课堂总结' },
    { index: '09', title: '课后任务' },
  ],
  sceneCount: scenes.length,
  scenes,
};
