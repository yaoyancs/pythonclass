import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 05 格式选型与综合实战：三层概念辨析、三种格式选型表、综合闭环实战、本讲要点、课后作业。 */
export const scenes: DraftScene[] = [
  {
    id: "file-close-three-layers",
    title: "容器、文件与数据格式",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "分清三层概念：内存容器、磁盘文件、数据格式",
      gridTable: {
        headers: ["层次", "扮演角色", "典型代表", "解决的核心问题"],
        rows: [
          ["Python 容器", "程序内部组织数据", "list、dict、set", "运行时怎样高效增删、按键查找与统计计算"],
          ["外部文件", "操作系统存储载体", "log.txt、menu.csv、order.json", "程序结束后数据怎样持久保存在磁盘上"],
          ["数据格式", "文本编码与结构约定", "TXT / CSV / JSON", "不同程序、不同语言之间怎样读懂同一份文件内容"],
        ],
      },
    },
  },
  {
    id: "file-close-choose",
    title: "三种文本格式选型对照",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "按数据结构特征选择存储格式",
      gridTable: {
        headers: ["数据格式", "结构特征", "门店典型场景", "推荐读写方式", "读回后的类型"],
        rows: [
          [".txt 纯文本", "自由文字或简单按行记录", "打印小票、出杯运行日志", "f.read() / for line in f", "字符串 str"],
          [".csv 表格", "字段一致的二维行列记录", "饮品价目表、每日销售报表", "csv.DictReader / DictWriter", "每行一个 dict（值全为 str）"],
          [".json 结构化", "键值与列表多层嵌套结构", "小程序订单包、会员档案、接口通信", "json.load / dump / loads / dumps", "自动还原 dict、list、int、bool、None"],
        ],
      },
    },
  },
  {
    id: "file-close-practice",
    title: "综合实战：点单结算全流程闭环",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`# 综合实战：打通 CSV 价目表、JSON 订单包与 TXT 结算日志
# 下方代码已准备好三份初始文件：
# 1. menu.csv：门店价目表（两列：饮品,单价）
# 2. order.json：新订单（含 "单号"、"外送"(布尔值，True 需另加 3 元配送费)、"明细"(字典：饮品名 -> 杯数)）
# 3. log.txt：已有一条历史结算记录 "C01 32"
#
# 请编写程序完成本单结算闭环：
# 1. 读取 menu.csv，构建「饮品名 -> 整数单价」字典
# 2. 读取 order.json，结合价目表与是否外送算出本单应付总额（整数）
# 3. 以追加模式 "a" 将本单结果写入 log.txt 末尾，格式为："{单号} {应付总额}\\n"
# 4. 重新读取并打印整个 log.txt 的内容（去掉首尾空白）

import csv
import json

with open("menu.csv", "w", encoding="utf-8", newline="") as f:
    f.write("饮品,单价\\n生椰拿铁,16\\n杨枝甘露,18\\n茉莉奶绿,14\\n")

with open("order.json", "w", encoding="utf-8") as f:
    json.dump({"单号": "C02", "外送": True, "明细": {"生椰拿铁": 2, "茉莉奶绿": 1}}, f, ensure_ascii=False)

with open("log.txt", "w", encoding="utf-8") as f:
    f.write("C01 32\\n")
`),
    hints: [
      { level: 1, text: '先用 csv.DictReader 读 menu.csv，存成 prices[row["饮品"]] = int(row["单价"])。' },
      { level: 2, text: '再用 json.load 读 order.json，遍历 order["明细"].items() 累加 prices[name] * count；若 order["外送"] 为真再加 3。' },
      {
        level: 3,
        text: `prices = {}
with open("menu.csv", "r", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        prices[row["饮品"]] = int(row["单价"])

with open("order.json", "r", encoding="utf-8") as f:
    order = json.load(f)

total = 0
for name, count in order["明细"].items():
    total += prices[name] * count
if order["外送"]:
    total += 3

with open("log.txt", "a", encoding="utf-8") as f:
    f.write(f'{order["单号"]} {total}\\n')

with open("log.txt", "r", encoding="utf-8") as f:
    print(f.read().strip())`,
      },
    ],
    reveal: {
      title: "对照",
      body: "生椰拿铁 16×2 + 茉莉奶绿 14×1 + 外送费 3 = 49 元；追加写入 log.txt 后保留了 C01 32 与 C02 49 两笔记录。",
    },
    expectedOutput: `C01 32
C02 49`,
  },
  {
    id: "file-close-points",
    title: "本讲要点",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "文件与数据格式",
      bulletPoints: [
        "内存数据随进程结束而释放，写入磁盘文件才能持久化保存与跨程序共享",
        '统一使用 with open(路径, 模式, encoding="utf-8") as f: 自动管理文件关闭',
        '"r" 只读（可配 os.path.exists 检查）、"w" 清空覆盖、"a" 末尾追加；逐行读先 .strip()，留意游标位置',
        "CSV 适合字段一致的二维表格，推荐 csv.DictReader / DictWriter，读出的数值须用 int() / float() 转换",
        "JSON 适合嵌套层级与跨语言交换，文件用 dump / load，字符串用 dumps / loads，中文配 ensure_ascii=False",
      ],
    },
  },
  {
    id: "file-close-homework",
    title: "课后作业",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "课后作业",
      bulletPoints: [],
    },
  },
];
