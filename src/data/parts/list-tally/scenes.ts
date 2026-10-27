import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 8 点到 11 点每个小时的候诊人数。时间顺序要留着，名次另算。 */
export const scenes: DraftScene[] = [
  {
    id: "list-tally-make",
    title: "四个小时的格子",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "先有时段，再把人数填进格子",
      markedPoints: [
        [
          { text: "list(range(8, 12))", mark: true },
          { text: " 得到 8、9、10、11 四个小时。止点 12 不包含。" },
        ],
        [
          { text: "[0] * 4", mark: true },
          { text: " 准备 4 个初始人数。重复的是同一个数，四个格子可以分别修改。" },
        ],
        [{ text: "8 点来了 3 人，就把下标 0 改成 3。下标是第几个小时，不是钟点本身。" }],
      ],
    },
    code: code(`hours = list(range(8, 12))
counts = [0] * 4
print(hours)
print(counts)
counts[0] = 3
counts[1] = 5
counts[2] = 5
counts[3] = 2
print(counts)`),
  },
  {
    id: "list-tally-stats",
    title: "闭诊时的三个数",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "一共多少人，哪一小时最忙",
      markedPoints: [
        [
          { text: "len", mark: true },
          { text: " 是小时数。sum 是四小时人数合计。max、min 是最忙和最空的人数。" },
        ],
        [{ text: "这些函数要的是一串数。号票列表能算 len，不能拿姓名去比大小。" }],
        [
          { text: "count(5)", mark: true },
          { text: " 问有几个小时正好是 5 人。这里比的是人数这个值。" },
        ],
      ],
    },
    code: code(`counts = [3, 5, 5, 2]
print(len(counts))
print(sum(counts))
print(max(counts))
print(min(counts))
print(counts.count(5))`),
  },
  {
    id: "list-tally-rank",
    title: "人数名次",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "名次另算，时间顺序留着",
      markedPoints: [
        [
          { text: "sorted", mark: true },
          { text: " 返回排好的新列表。reverse=True 时从多到少。counts 仍按 8 点到 11 点。" },
        ],
        [
          { text: "sort", mark: true },
          { text: " 改的是这张表自己。只有这张表就是要改成名次时才用。" },
        ],
        [
          { text: "reverse", mark: true },
          { text: " 把当前顺序整表倒过来，不按人数重排。倒过来之后不再是从 8 点开始。" },
        ],
      ],
    },
    code: code(`counts = [3, 5, 5, 2]
print(sorted(counts, reverse=True))
print(counts)
counts.sort()
print(counts)
counts.reverse()
print(counts)`),
  },
];
