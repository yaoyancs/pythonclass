import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const APP = `import tkinter as tk

plays = {"晴天": 12, "稻香": 30, "夜曲": 7}
available = {"晴天", "稻香", "夜曲", "青花瓷"}

def refresh():
    box.delete("1.0", tk.END)
    ranking = sorted(plays.items(), key=lambda item: -item[1])
    for rank, (name, count) in enumerate(ranking, 1):
        box.insert(tk.END, f"{rank}. {name}  {count}\\n")
    total.config(text=f"累计推荐：{sum(plays.values())}")
    playable = set(plays) & available
    missing = set(plays) - available
    result.config(text=(
        f"可播放：{'、'.join(sorted(playable)) or '暂无'}\\n"
        f"需补充：{'、'.join(sorted(missing)) or '暂无'}"
    ))

def recommend():
    name = song.get().strip()
    if not name:
        status.config(text="请先填写歌名")
        return
    plays[name] = plays.get(name, 0) + 1
    status.config(text=f"{name} 已收到 1 次推荐")
    song.delete(0, tk.END)
    refresh()

root = tk.Tk()
root.title("班级点歌榜")
tk.Label(root, text="班级点歌榜", font=("Menlo", 20, "bold")).pack(pady=(12, 0))
total = tk.Label(root, font=("Menlo", 14))
total.pack()
box = tk.Text(root, width=28, height=6, font=("Menlo", 16))
box.pack(padx=12, pady=8)
song = tk.Entry(root, font=("Menlo", 16))
song.pack(fill="x", padx=12)
tk.Button(root, text="推荐 +1", command=recommend).pack(pady=6)
result = tk.Label(root, justify="left", font=("Menlo", 13))
result.pack(pady=4)
status = tk.Label(root, text="", font=("Menlo", 16))
status.pack(pady=8)
refresh()
root.mainloop()`;

/** 遍历听过的歌，收束四种容器怎么选。 */
export const scenes: DraftScene[] = [
  {
    id: "set-walk-for",
    title: "遍历集合",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "用 for，不用下标",
      flowDiagram: [
        "for name in 集合:",
        "    print(name)",
      ],
      body: "集合没有下标，不能 while 配 0、1、2 去取。直接 for。先打印哪一首不固定，不要把打印先后当成「第几首」。",
    },
    code: code(`heard = {"晴天", "稻香", "夜曲"}
for name in heard:
    print(name)`),
  },
  {
    id: "set-walk-summary",
    title: "集合总结",
    type: "explain",
    layout: "fullscreen",
    content: {
      note: {
        title: "",
        points: [
          "定义\n{元素1, 元素2, …}；空集合写 set()，不要写 {}。set(列表) 对最近播放去重。",
          "常用操作\nadd / update 加入；discard 删除（没有也不报错）；in 判断听过没有；& 共同听过，| 合在一起，- 只有我听过。",
          "注意\n没有下标，也没有顺序。元素相同就相等，和花括号里的写法先后无关。问的是「有没有」，不是「第几首、几次」。",
        ],
      },
    },
  },
  {
    id: "set-walk-slogan",
    title: "容器选型",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "这一次任务需要什么",
      bulletPoints: [
        "要顺序、要第几首、允许重复 → 列表",
        "一组数据写定后不能改项 → 元组",
        "按歌名取时长或次数 → 字典",
        "只要听过没有、要去重、要比两份名单 → 集合",
      ],
    },
  },
  {
    id: "set-walk-containers",
    title: "容器数据类型总结和对比",
    type: "explain",
    layout: "fullscreen",
    content: {
      containerMap: {},
    },
  },
  {
    id: "set-walk-memory",
    title: "原地修改与新对象",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      stepRun: true,
      headline: "原地修改与新对象",
      body: "列表、字典改的是原对象。元组不能改项。集合字面量里的重复元素只留一份。",
    },
    code: code(`history = ["晴天", "稻香", "晴天"]
print(history)
history[0] = "夜曲"
print(history)

heard = {"晴天", "稻香", "晴天"}
print(heard)
print(len(heard))
heard.add("晴天")
print(len(heard))

plays = {"晴天": 12, "稻香": 30}
print(plays["晴天"])
plays["晴天"] = 15
print(plays["晴天"])

fixed = ("晴天", "稻香", "晴天")
fixed[0] = "夜曲"`),
  },
  {
    id: "dict-walk-manager-run",
    title: "综合实例：班级点歌榜",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: { playCountsApp: true },
    code: code(APP),
  },
  {
    id: "set-walk-homework",
    title: "课后作业",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "课后作业",
    },
  },
];
