import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** CSV：字段一致的表格型数据。 */
export const scenes: DraftScene[] = [
  {
    id: "file-csv-why",
    title: "表格型数据用 CSV",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "字段一致的多条记录：CSV",
      body: "当每条记录具有相同字段（例如日期、科目、时长）时，使用逗号分隔的 CSV。该格式可由表格软件直接打开。",
      flowDiagram: [
        "日期,科目,时长",
        "周一,Python,45",
        "周二,数学,60",
        "周三,Python,35",
      ],
      bulletPoints: [
        "第一行通常是表头（字段名）",
        "后面每一行是一条结构相同的记录",
        "Python 标准库 csv 可直接读写表格数据",
      ],
    },
  },
  {
    id: "file-csv-dictreader",
    title: "用 csv.DictReader 读取",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "把每一行读成字典",
      body: "csv.DictReader 会自动把第一行表头当作键。遍历时，每一行都是一个字典，直接按列名取值。",
      bulletPoints: [
        "从 CSV 文件读出的值默认都是字符串",
        "参与加法运算前，要用 int() 转成整数",
      ],
    },
    code: code(`import csv

with open("records.csv", "w", encoding="utf-8", newline="") as f:
    f.write("日期,时长\\n周一,45\\n周二,60\\n周三,35\\n")

total = 0
with open("records.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["日期"], row["时长"])
        total += int(row["时长"])

print("合计:", total)`),
  },
];
