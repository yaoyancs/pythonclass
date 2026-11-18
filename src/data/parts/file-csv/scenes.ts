import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 03 CSV 表格数据：为什么需要 CSV、split 的局限、csv.reader、DictReader、字符串数值陷阱、DictWriter 与练习。 */
export const scenes: DraftScene[] = [
  {
    id: "file-csv-why",
    title: "表格型数据与 CSV",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "字段一致的二维表格记录：CSV",
      body: "门店菜单包含「饮品、分类、单价」多列属性。把同一行字段用英文逗号隔开保存为 .csv（Comma-Separated Values，逗号分隔值），它既是纯文本文件，又能直接用 Excel 或 WPS 作为表格打开。",
      flowDiagram: [
        "饮品,分类,单价",
        "生椰拿铁,咖啡,16",
        "杨枝甘露,果茶,18",
        "茉莉奶绿,奶茶,14",
      ],
      bulletPoints: [
        "第一行通常是表头（列名），说明每一列代表什么字段",
        "后续每一行是一条字段结构完全一致的记录",
        "Python 标准库 csv 专门用于安全读写此类表格数据",
      ],
    },
  },
  {
    id: "file-csv-split-limit",
    title: "为什么不用 split(',') 硬切",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "字段内容本身包含逗号时，split(',') 会切错列",
      body: "CSV 标准允许用双引号把带逗号的文本包起来（例如规格写成 \"生椰拿铁,少冰\"）。手动 split(',') 会把引号里的逗号也切开，而标准库 csv 能正确识别。",
    },
    code: code(`import csv

line = '"生椰拿铁,少冰",咖啡,16'
print("手动 split:", line.split(","))

row = next(csv.reader([line]))
print("csv 模块解析:", row)`),
    expectedOutput: `手动 split: ['"生椰拿铁', '少冰"', '咖啡', '16']
csv 模块解析: ['生椰拿铁,少冰', '咖啡', '16']`,
  },
  {
    id: "file-csv-reader",
    title: "csv.reader：按行读成列表",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "每一行解析为一个字符串列表",
      flowDiagram: [
        "reader = csv.reader(f)",
        "row  ──▶  ['生椰拿铁', '咖啡', '16']",
      ],
      bulletPoints: [
        "第一次读出的是表头行，可用 next(reader) 单独取出跳过",
        "按列下标 row[0]、row[2] 取值；列数较多时数下标容易出错",
      ],
    },
    code: code(`import csv

with open("menu.csv", "w", encoding="utf-8", newline="") as f:
    f.write("饮品,分类,单价\\n生椰拿铁,咖啡,16\\n杨枝甘露,果茶,18\\n茉莉奶绿,奶茶,14\\n")

with open("menu.csv", "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    header = next(reader)
    print("表头:", header)
    for row in reader:
        print(row[0], "->", row[2], "元")`),
    expectedOutput: `表头: ['饮品', '分类', '单价']
生椰拿铁 -> 16 元
杨枝甘露 -> 18 元
茉莉奶绿 -> 14 元`,
  },
  {
    id: "file-csv-dictreader",
    title: "csv.DictReader：按行读成字典",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "自动将第一行表头作为字典的键",
      flowDiagram: [
        "reader = csv.DictReader(f)",
        "row  ──▶  {'饮品': '生椰拿铁', '分类': '咖啡', '单价': '16'}",
      ],
      bulletPoints: [
        "遍历时直接从第一条数据记录开始，不必手动跳过表头",
        "按列名 row[\"单价\"] 取值清晰直观，即使表格列顺序调整也不受影响",
      ],
    },
    code: code(`import csv

with open("menu.csv", "w", encoding="utf-8", newline="") as f:
    f.write("饮品,分类,单价\\n生椰拿铁,咖啡,16\\n杨枝甘露,果茶,18\\n茉莉奶绿,奶茶,14\\n")

with open("menu.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["分类"], "|", row["饮品"], row["单价"])`),
    expectedOutput: `咖啡 | 生椰拿铁 16
果茶 | 杨枝甘露 18
奶茶 | 茉莉奶绿 14`,
  },
  {
    id: "file-csv-str-trap",
    title: "CSV 数值类型陷阱",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      body: "店长想从 sales.csv 中筛选出销量超过 20 杯的饮品。美式咖啡卖了 9 杯，杨枝甘露卖了 120 杯，下面这段代码会打印出哪一款？",
    },
    code: code(`import csv

with open("sales.csv", "w", encoding="utf-8", newline="") as f:
    f.write("饮品,杯数\\n美式咖啡,9\\n杨枝甘露,120\\n")

with open("sales.csv", "r", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        if row["杯数"] > "20":
            print(row["饮品"])`),
    prediction: {
      question: "运行后会打印出什么？",
      options: [
        { id: "yangzhi", label: "杨枝甘露（120 大于 20）" },
        { id: "meishi", label: "美式咖啡（字符串 '9' 首字符大于 '2'）", isCorrect: true },
        { id: "both", label: "美式咖啡和杨枝甘露都打印" },
      ],
    },
    reveal: {
      title: "从 CSV 读出的所有字段值默认都是字符串 str",
      body: "\"9\" > \"20\" 按字符顺序逐位比较：首字符 '9' > '2' 为 True；而 \"120\" 的首字符 '1' < '2' 反而被过滤掉了！凡是参与算术运算或大小比较，必须先写 int(row[\"杯数\"]) 或 float(...)。",
    },
  },
  {
    id: "file-csv-writer",
    title: "csv.DictWriter：写入表格文件",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "writeheader() 写表头，writerows() 批量写字典列表",
      bulletPoints: [
        "fieldnames 指定表头列名及各列先后顺序",
        "写入 CSV 时 open() 应加上 newline=\"\"，防止在 Windows 系统下每两行之间多出空行",
      ],
    },
    code: code(`import csv

sales = [
    {"饮品": "生椰拿铁", "单价": 16, "杯数": 25},
    {"饮品": "杨枝甘露", "单价": 18, "杯数": 15},
]

with open("report.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["饮品", "单价", "杯数"])
    writer.writeheader()
    writer.writerows(sales)

with open("report.csv", "r", encoding="utf-8") as f:
    print(f.read().strip())`),
    expectedOutput: `饮品,单价,杯数
生椰拿铁,16,25
杨枝甘露,18,15`,
  },
  {
    id: "file-csv-summary",
    title: "CSV 读写小结",
    type: "explain",
    layout: "fullscreen",
    content: {
      note: {
        title: "CSV 核心要点",
        points: [
          "适用数据\n字段一致、无多层嵌套的二维表格记录（如商品价目表、销售日报、实验采集表）。",
          "常用写法\ncsv.DictReader 按列名把每行读成字典；csv.DictWriter 将字典列表写入文件（open 配合 newline=\"\"）。",
          "类型转换\n从 CSV 读出的数字全是字符串 str，求和、乘算或比大小前务必用 int() 或 float() 转换。",
        ],
      },
    },
  },
  {
    id: "file-csv-practice",
    title: "练习：核算门店今日营收",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`# 任务：读取销售明细表 sales.csv，核算总营业额与销量冠军
# 表中包含三列：饮品,单价,杯数（单品营业额 = 单价 * 杯数）
# 请使用 csv.DictReader 读取 sales.csv：
# 第一行打印门店今日总营业额（整数）
# 第二行打印售出杯数最多的饮品名称

import csv

with open("sales.csv", "w", encoding="utf-8", newline="") as f:
    f.write("饮品,单价,杯数\\n生椰拿铁,16,30\\n杨枝甘露,18,20\\n茉莉奶绿,14,35\\n")
`),
    hints: [
      { level: 1, text: "遍历 csv.DictReader(f)，先把 row[\"单价\"] 和 row[\"杯数\"] 用 int() 转成整数。" },
      { level: 2, text: "累加 price * cups 求总营业额；同时用 max_cups 和 best_drink 记录最大杯数及对应饮品名。" },
      {
        level: 3,
        text: `total = 0
best_drink = ""
max_cups = -1
with open("sales.csv", "r", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        price = int(row["单价"])
        cups = int(row["杯数"])
        total += price * cups
        if cups > max_cups:
            max_cups = cups
            best_drink = row["饮品"]

print(total)
print(best_drink)`,
      },
    ],
    reveal: {
      title: "对照",
      body: "16×30 + 18×20 + 14×35 = 480 + 360 + 490 = 1330；茉莉奶绿售出 35 杯最多。",
    },
    expectedOutput: `1330
茉莉奶绿`,
  },
];
