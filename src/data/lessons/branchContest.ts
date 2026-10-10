import type { DraftScene, Lesson, Scene } from '../../types/scene';

const BROKEN =
  'item = "香蕉皮"\nif item == "香蕉皮":\n    print("厨余垃圾")\nif item == "旧报纸":\n    print("可回收物")\nelse:\n    print("暂未收录")';

const FIXED =
  'item = "香蕉皮"\nif item == "香蕉皮":\n    print("厨余垃圾")\nelif item == "旧报纸":\n    print("可回收物")\nelse:\n    print("暂未收录")';

const DRONE_WRONG =
  'distance = 1\nif distance <= 5:\n    print("减速并监测")\nelif distance <= 2:\n    print("紧急停止")\nelse:\n    print("继续前进")\nprint("避障决策完成。")';

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const drafts: Array<DraftScene & { title: string; partId?: string }> = [
  {
    id: 'branch-cover',
    title: '导入',
    partId: '01',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '垃圾如何分类',
      gallery: [
        { id: 'banana', src: '/lesson03/waste-banana.jpg', alt: '香蕉皮' },
        { id: 'durian', src: '/lesson03/waste-durian.jpg', alt: '榴莲壳' },
        { id: 'can', src: '/lesson03/waste-can.jpg', alt: '易拉罐' },
        { id: 'medicine', src: '/lesson03/waste-medicine.jpg', alt: '过期药品' },
        { id: 'green', src: '/lesson03/bin-green.jpg', alt: '绿色垃圾桶' },
        { id: 'gray', src: '/lesson03/bin-gray.jpg', alt: '灰色垃圾桶' },
        { id: 'red', src: '/lesson03/bin-red.jpg', alt: '红色垃圾桶' },
        { id: 'blue', src: '/lesson03/bin-blue.jpg', alt: '蓝色垃圾桶' },
      ],
      galleryLinks: [
        { from: 'banana', to: 'green', color: '#2f9e44' },
        { from: 'durian', to: 'gray', color: '#8b9096' },
        { from: 'can', to: 'blue', color: '#2f6fdb' },
        { from: 'medicine', to: 'red', color: '#e03131' },
      ],
    },
  },
  {
    id: 'branch-conflict',
    title: '代码分析',
    partId: '02',
    type: 'predict',
    layout: 'split',
    editorSide: 'left',
    content: { branchContest: { mode: 'conflict' } },
    code: code(BROKEN),
  },
  {
    id: 'branch-trace',
    title: '错因分析',
    partId: '03',
    type: 'explain',
    layout: 'split',
    editorSide: 'left',
    content: { branchContest: { mode: 'trace' } },
    code: code(BROKEN),
  },
  {
    id: 'branch-elif',
    title: '多分支选择',
    partId: '04',
    type: 'explain',
    layout: 'split',
    editorSide: 'left',
    content: { branchContest: { mode: 'elif' } },
    code: code(BROKEN),
  },
  {
    id: 'branch-lab',
    title: '决策过程可视化',
    partId: '05',
    type: 'run',
    layout: 'split',
    editorSide: 'left',
    content: { branchContest: { mode: 'lab' } },
    code: code(BROKEN),
  },
  {
    id: 'branch-extend',
    title: '如何作出正确选择',
    partId: '06',
    type: 'explain',
    layout: 'split',
    content: { branchContest: { mode: 'extend' } },
    code: code(DRONE_WRONG),
  },
  {
    id: 'branch-values',
    title: '思政小课堂',
    partId: '07',
    type: 'explain',
    layout: 'fullscreen',
    content: { branchContest: { mode: 'values' } },
  },
  {
    id: 'branch-summary',
    title: '课堂小结',
    partId: '08',
    type: 'summary',
    layout: 'split',
    content: { branchContest: { mode: 'summary' } },
    code: code(
      'distance = 1\nif distance <= 2:\n    print("紧急停止前进")\nelif distance <= 5:\n    print("减速并监测")\nelse:\n    print("继续前进")\nprint("避障判断结束，程序继续运行。")',
    ),
  },
  {
    id: 'branch-homework',
    title: '课后任务',
    partId: '09',
    type: 'explain',
    layout: 'fullscreen',
    content: { branchContest: { mode: 'homework' } },
  },
  {
    id: 'branch-thanks',
    title: '谢谢',
    partId: '10',
    type: 'explain',
    layout: 'fullscreen',
    content: { branchContest: { mode: 'thanks' } },
  },
];

/** 供第 3 讲从 part 03 起引用，与本讲页面共用同一份内容 */
export const branchContestParts: { ref: string; title: string; scenes: DraftScene[] }[] = drafts.map(
  (draft) => {
    const { partId: _partId, title, ...scene } = draft;
    return { ref: scene.id, title, scenes: [scene] };
  },
);

const scenes: Scene[] = drafts.map((draft, index) => {
  const { partId, ...scene } = draft;
  return {
    ...scene,
    index: index + 1,
    ...(partId ? { partId } : {}),
  };
});

export const branchContestLesson: Lesson = {
  id: 'branch-contest',
  number: 0,
  title: '多分支条件控制',
  subtitle: '多分支条件控制',
  hours: 0.25,
  parts: [
    { index: '01', title: '导入' },
    { index: '02', title: '代码分析' },
    { index: '03', title: '错因分析' },
    { index: '04', title: '多分支选择' },
    { index: '05', title: '决策过程可视化' },
    { index: '06', title: '如何作出正确选择' },
    { index: '07', title: '思政小课堂' },
    { index: '08', title: '课堂小结' },
    { index: '09', title: '课后任务' },
    { index: '10', title: '谢谢' },
  ],
  sceneCount: scenes.length,
  scenes,
};
