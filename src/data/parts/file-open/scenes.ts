import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** open、with open()、写入("w")、读取("r")、追加("a")。 */
export const scenes: DraftScene[] = [
  {
    id: "file-open-write",
    title: "写入与读取",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "with 语句负责关闭文件",
      body: "模式 \"w\" 创建或覆盖文件并写入文本，模式 \"r\" 读取文本。离开 with 代码块时文件被关闭。",
      bulletPoints: [
        "encoding=\"utf-8\" 指定文本编码",
        "write 写入字符串，换行使用 \\n",
        "read 一次读取全部文本",
      ],
    },
    code: code(`with open("study.txt", "w", encoding="utf-8") as f:
    f.write("周一 45\\n")
    f.write("周二 60\\n")

with open("study.txt", "r", encoding="utf-8") as f:
    content = f.read()

print(content)`),
  },
  {
    id: "file-open-mode-predict",
    title: "w 与 a 的区别",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      body: "连续两次对同一个文件使用 \"w\" 模式写入，最后文件里有什么？",
    },
    code: code(`with open("note.txt", "w", encoding="utf-8") as f:
    f.write("第一条记录\\n")

with open("note.txt", "w", encoding="utf-8") as f:
    f.write("第二条记录\\n")

with open("note.txt", "r", encoding="utf-8") as f:
    print(f.read().strip())`),
    prediction: {
      question: "运行后打印出什么？",
      options: [
        { id: "both", label: "两行都有：第一条记录、第二条记录" },
        { id: "only-second", label: "只有「第二条记录」", isCorrect: true },
        { id: "err", label: "报错，因为文件已经存在" },
      ],
    },
    reveal: {
      title: "\"w\" 会清空原有内容",
      body: "\"w\"（write）每次打开都会覆盖旧文件。如果要在末尾继续添新记录，必须把模式改成 \"a\"（append）。",
    },
  },
  {
    id: "file-open-append",
    title: "追加记录并按行统计",
    type: "modify",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "用 \"a\" 追加新一天的数据",
      body: "把第二次打开的模式从 \"w\" 改成 \"a\"，让「周三 35」追加在后面，再按行读取并算出三天总时长。",
    },
    code: code(`with open("study.txt", "w", encoding="utf-8") as f:
    f.write("周一 45\\n")
    f.write("周二 60\\n")

with open("study.txt", "w", encoding="utf-8") as f:
    f.write("周三 35\\n")

total = 0
with open("study.txt", "r", encoding="utf-8") as f:
    for line in f:
        day, minutes = line.strip().split()
        total += int(minutes)

print("总时长:", total)`),
    hints: [
      { level: 1, text: "看第 5 行的 open(\"study.txt\", \"w\", ...)。" },
      { level: 2, text: "把第 5 行的 \"w\" 改成 \"a\"，保留前两天的数据。" },
      {
        level: 3,
        text: 'with open("study.txt", "a", encoding="utf-8") as f:\n    f.write("周三 35\\n")',
      },
    ],
    reveal: {
      title: "对照",
      body: "45 + 60 + 35 = 140。用 \"a\" 追加后，文件中保留了全部三行记录。",
    },
    expectedOutput: `总时长: 140`,
  },
];
