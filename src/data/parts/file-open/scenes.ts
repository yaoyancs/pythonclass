import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 02 文本文件读写：open/close、with open、w 与 a、三种读取方式、strip、游标指针、存在性判断与练习。 */
export const scenes: DraftScene[] = [
  {
    id: "file-open-close",
    title: "打开与关闭文件",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "open() 获取文件对象，操作完毕调用 close()",
      flowDiagram: [
        'f = open(文件路径, 模式, encoding="utf-8")',
        "f.write(...) / f.read()",
        "f.close()",
      ],
      bulletPoints: [
        "open() 向操作系统申请打开文件，返回文件对象 f",
        "写入的数据先暂存在缓冲区，close() 确保数据刷入磁盘并释放文件句柄",
        "若读写中途代码报错中断，后面的 f.close() 可能来不及执行",
      ],
    },
    code: code(`f = open("receipt.txt", "w", encoding="utf-8")
f.write("单号: A01\\n")
f.write("饮品: 生椰拿铁 16元\\n")
f.close()

f = open("receipt.txt", "r", encoding="utf-8")
print(f.read().strip())
f.close()`),
    expectedOutput: `单号: A01
饮品: 生椰拿铁 16元`,
  },
  {
    id: "file-open-with",
    title: "with 上下文管理器",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "with open(...) as f: 自动关闭文件",
      flowDiagram: [
        'with open("receipt.txt", "r", encoding="utf-8") as f:',
        "    读写操作（缩进块结束时自动执行 f.close()）",
      ],
      bulletPoints: [
        "标准工程写法：无需手动调用 f.close()",
        "离开 with 缩进块时，无论正常结束还是发生异常，文件都会自动关闭",
        "f.closed 属性可检查文件当前是否已关闭",
      ],
    },
    code: code(`with open("receipt.txt", "w", encoding="utf-8") as f:
    f.write("单号: A02\\n")
    f.write("饮品: 杨枝甘露 18元\\n")
    print("with 块内是否已关闭:", f.closed)

print("离开 with 后是否已关闭:", f.closed)

with open("receipt.txt", "r", encoding="utf-8") as f:
    print(f.read().strip())`),
    expectedOutput: `with 块内是否已关闭: False
离开 with 后是否已关闭: True
单号: A02
饮品: 杨枝甘露 18元`,
  },
  {
    id: "file-open-mode-predict",
    title: "写入模式 w 与追加模式 a",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      body: "门店每做好一杯饮品就往 log.txt 记一笔。连续两次用 \"w\" 模式打开同一个文件写入，最后文件里剩什么？",
    },
    code: code(`with open("log.txt", "w", encoding="utf-8") as f:
    f.write("A01 生椰拿铁\\n")

with open("log.txt", "w", encoding="utf-8") as f:
    f.write("A02 杨枝甘露\\n")

with open("log.txt", "r", encoding="utf-8") as f:
    print(f.read().strip())`),
    prediction: {
      question: "运行后打印出什么？",
      options: [
        { id: "both", label: "两行都有：A01 生椰拿铁、A02 杨枝甘露" },
        { id: "only-second", label: "只有一行：A02 杨枝甘露", isCorrect: true },
        { id: "err", label: "报错，因为 log.txt 已经存在" },
      ],
    },
    reveal: {
      title: "\"w\" 打开已存在文件时会立即清空原内容",
      body: "\"w\"（write）每次打开都会覆盖旧文件，适合生成单张新小票；若要保留历史出杯记录、在末尾接着记，必须用 \"a\"（append）追加模式。",
    },
  },
  {
    id: "file-open-append",
    title: "追加写入与换行符",
    type: "modify",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "用 \"a\" 追加新记录，并用 \\n 控制换行",
      body: "f.write() 不会像 print() 那样自动换行。请把第二次打开 log.txt 的模式改为 \"a\"，并给「A03 茉莉奶绿」补上换行符 \\n，使四条出杯记录各占一行。",
    },
    code: code(`with open("log.txt", "w", encoding="utf-8") as f:
    f.write("A01 生椰拿铁\\n")
    f.write("A02 杨枝甘露\\n")

with open("log.txt", "w", encoding="utf-8") as f:
    f.write("A03 茉莉奶绿")
    f.write("A04 柠檬水\\n")

with open("log.txt", "r", encoding="utf-8") as f:
    print(f.read().strip())`),
    hints: [
      { level: 1, text: "先看第 5 行：\"w\" 会清空前两杯记录，应改成追加模式 \"a\"。" },
      { level: 2, text: "再看第 6 行：\"A03 茉莉奶绿\" 末尾缺少 \\n，会与下一行黏在同一行。" },
      {
        level: 3,
        text: 'with open("log.txt", "a", encoding="utf-8") as f:\n    f.write("A03 茉莉奶绿\\n")\n    f.write("A04 柠檬水\\n")',
      },
    ],
    reveal: {
      title: "对照",
      body: "\"a\" 模式把写入位置移到文件末尾保留旧数据；write() 只原样写入字符串，换行必须显式加上 \\n。",
    },
    expectedOutput: `A01 生椰拿铁
A02 杨枝甘露
A03 茉莉奶绿
A04 柠檬水`,
  },
  {
    id: "file-open-read-ways",
    title: "读取文本的三种方式",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "read()、readlines() 与逐行迭代",
      bulletPoints: [
        "f.read()：把整份文件读成一个长字符串（适合短文本小票）",
        "f.readlines()：按行读成字符串列表，注意每项末尾都保留了 '\\n'",
        "for line in f:：每次只读一行到内存，处理超大日志文件也不会撑爆内存",
      ],
    },
    code: code(`with open("log.txt", "w", encoding="utf-8") as f:
    f.write("生椰拿铁\\n杨枝甘露\\n茉莉奶绿\\n")

with open("log.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()
print("readlines 列表:", lines)

with open("log.txt", "r", encoding="utf-8") as f:
    for line in f:
        print("逐行:", line.strip())`),
    expectedOutput: `readlines 列表: ['生椰拿铁\\n', '杨枝甘露\\n', '茉莉奶绿\\n']
逐行: 生椰拿铁
逐行: 杨枝甘露
逐行: 茉莉奶绿`,
  },
  {
    id: "file-open-strip-debug",
    title: "清除行尾换行符 strip()",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "明明卖出了两杯「生椰拿铁」，为什么统计结果是 0？",
      body: "逐行读取文件时，line 末尾带着换行符 \"\\n\"，导致 \"生椰拿铁\\n\" == \"生椰拿铁\" 为 False。请用 .strip() 修复统计代码。",
    },
    code: code(`with open("log.txt", "w", encoding="utf-8") as f:
    f.write("生椰拿铁\\n杨枝甘露\\n生椰拿铁\\n茉莉奶绿\\n")

count = 0
with open("log.txt", "r", encoding="utf-8") as f:
    for line in f:
        if line == "生椰拿铁":
            count += 1

print("生椰拿铁杯数:", count)`),
    hints: [
      { level: 1, text: "从文件读出的 line 实际是 \"生椰拿铁\\n\"，末尾多了一个换行符。" },
      { level: 2, text: "比较前先用 line.strip() 去掉首尾空白字符与换行符。" },
      {
        level: 3,
        text: '        if line.strip() == "生椰拿铁":\n            count += 1',
      },
    ],
    reveal: {
      title: "对照",
      body: "按行读取文本文件时，第一时间做 line = line.strip() 是处理日志的标准习惯，既能去掉行尾 \\n，也能去除多余首尾空格。",
    },
    expectedOutput: "生椰拿铁杯数: 2",
  },
  {
    id: "file-open-cursor-predict",
    title: "文件读写指针（游标）",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      body: "在同一个 with 代码块里，先用 f.read() 读完整个文件，紧接着再调用一次 f.read()，第二次会读到什么？",
    },
    code: code(`with open("receipt.txt", "w", encoding="utf-8") as f:
    f.write("生椰拿铁 16元")

with open("receipt.txt", "r", encoding="utf-8") as f:
    first = f.read()
    second = f.read()

print("第一次:", repr(first))
print("第二次:", repr(second))`),
    prediction: {
      question: "第二次打印出的 repr(second) 是什么？",
      options: [
        { id: "same", label: "'生椰拿铁 16元'（自动从头再读一遍）" },
        { id: "empty", label: "''（空字符串）", isCorrect: true },
        { id: "err", label: "报错，同一个文件对象不能读两次" },
      ],
    },
    reveal: {
      title: "文件流内部有读写游标，读到底后停在文件末尾",
      body: "第一次 f.read() 已将游标推进到文件末尾，继续往下读自然只剩空字符串 ''。若需重新读取，可再次使用 with open 打开文件（或调用 f.seek(0) 将游标移回开头）。",
    },
  },
  {
    id: "file-open-exists",
    title: "判断文件是否存在",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "用 \"r\" 打开不存在的文件会报 FileNotFoundError",
      flowDiagram: [
        "import os",
        'if os.path.exists("morning_log.txt"):',
        "    ...",
      ],
      body: "门店清晨刚开机时，当日日志文件尚未创建。读取前用标准库 os.path.exists() 检查路径是否存在，可避免程序直接崩溃。",
    },
    code: code(`import os

filename = "morning_log.txt"
if os.path.exists(filename):
    with open(filename, "r", encoding="utf-8") as f:
        print(f.read())
else:
    print(filename, "尚未生成，今日销量从 0 开始")`),
    expectedOutput: "morning_log.txt 尚未生成，今日销量从 0 开始",
  },
  {
    id: "file-open-summary",
    title: "文本文件读写小结",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "三种常用打开模式对照",
      gridTable: {
        headers: ["模式", "用途", "文件不存在时", "文件已存在时"],
        rows: [
          ['"r"', "只读（默认模式）", "报 FileNotFoundError", "游标在开头，读取文件内容"],
          ['"w"', "覆盖写入", "自动创建新文件", "立即清空原内容，从头写入"],
          ['"a"', "末尾追加", "自动创建新文件", "保留原内容，游标移至末尾追加"],
        ],
      },
      bulletPoints: [
        '始终使用 with open(路径, 模式, encoding="utf-8") as f: 自动关闭文件',
        "write() 需手动加 \\n，逐行读取先做 .strip()，留意文件游标是否已到末尾",
      ],
    },
  },
  {
    id: "file-open-practice",
    title: "练习：出杯流水统计",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`# 任务：门店出杯流水追加与汇总
# 1. 下方代码已将前 3 杯记录写入 today_log.txt（每行格式：「饮品名 金额」）
# 2. 请以追加模式 "a" 打开 today_log.txt，在末尾写入一行："生椰拿铁 16\\n"
# 3. 再以只读模式 "r" 打开 today_log.txt，逐行读取并统计：
#    第一行打印总杯数
#    第二行打印总销售额（整数）

with open("today_log.txt", "w", encoding="utf-8") as f:
    f.write("杨枝甘露 18\\n")
    f.write("茉莉奶绿 14\\n")
    f.write("生椰拿铁 16\\n")
`),
    hints: [
      { level: 1, text: '先用 with open("today_log.txt", "a", encoding="utf-8") as f: 追加写入第四杯。' },
      { level: 2, text: "再用 \"r\" 模式逐行读取，name, price = line.strip().split()，累加杯数与 int(price)。" },
      {
        level: 3,
        text: `with open("today_log.txt", "a", encoding="utf-8") as f:
    f.write("生椰拿铁 16\\n")

cups = 0
total = 0
with open("today_log.txt", "r", encoding="utf-8") as f:
    for line in f:
        name, price = line.strip().split()
        cups += 1
        total += int(price)

print(cups)
print(total)`,
      },
    ],
    reveal: {
      title: "对照",
      body: "用 \"a\" 追加第 4 杯后共 4 行记录；逐行 strip().split() 拆出金额并转为 int，总销售额为 18 + 14 + 16 + 16 = 64。",
    },
    expectedOutput: `4
64`,
  },
];
