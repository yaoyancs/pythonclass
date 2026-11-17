import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const HISTORY = `history = ["晴天", "稻香", "晴天", "夜曲", "稻香"]`;

/** 从最近播放切入：列表记下每一次点击，回答不了「听过几首不同的歌」。 */
export const scenes: DraftScene[] = [
  {
    id: "set-why-problem",
    title: "引入",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "最近播放里，听过几首不同的歌？",
      image: {
        src: "/lesson07/play-history.svg?v=2",
        alt: "播放记录：晴天、稻香、晴天、夜曲、稻香",
      },
    },
  },
  {
    id: "set-why-list-defect",
    title: "列表保留重复元素",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "len 统计的是点击次数",
      body: "同一首歌点两次，列表里就有两项。len(history) 是 5，不是「不同的歌」的数量。",
      bulletPoints: [
        "列表有顺序、允许重复——这正是最近播放需要的",
        "问「听过几首不同的歌」时，重复反而成了障碍",
      ],
    },
    code: code(`${HISTORY}
print(history)
print(len(history))
print("晴天" in history)
print("七里香" in history)`),
  },
  {
    id: "set-why-scan-cost",
    title: "用列表实现去重",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "先建空列表，再一首首判断",
      flowDiagram: [
        "heard = []",
        "for name in history:",
        "    if name not in heard:",
        "        heard.append(name)",
      ],
      body: "列表也能去重，但要自己写循环：碰到还没有的歌才加进去。后面用集合，这一段就不必手写了。",
    },
    code: code(`${HISTORY}
heard = []
for name in history:
    if name not in heard:
        heard.append(name)
print(heard)
print(len(heard))`),
  },
  {
    id: "set-why-need",
    title: "集合要解决的问题",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "只要「有没有」，不要次数",
      image: {
        src: "/lesson07/set-vs-list.svg",
        alt: "列表留下每一次点击；集合只留下听过哪些歌",
      },
      bulletPoints: [
        "字典回答：这首歌对应什么信息（时长、次数）",
        "列表回答：第几首、点过几次、先后顺序",
        "现在缺的是：这首歌出现过没有、一共几种",
      ],
      preview: "下一页：用花括号写出听过的歌",
    },
  },
];
