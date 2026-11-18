import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 04 JSON 结构化数据：嵌套结构、格式与序列化映射、dump/load、排版参数、dumps/loads、语法调试与练习。 */
export const scenes: DraftScene[] = [
  {
    id: "file-json-why",
    title: "二维表装不下嵌套数据",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "当数据内部嵌套着列表与字典：JSON",
      body: "顾客在小程序提交的订单不仅有单号、是否外送，还包含「加料列表」与「饮品明细字典」。这种多层嵌套结构无法直接塞进规整的二维表格，最适合保存为 JSON（JavaScript Object Notation）。",
      codeSnippet: `{
  "订单号": "B102",
  "顾客": "林晓",
  "外送": false,
  "地址": null,
  "加料": ["珍珠", "椰果"],
  "明细": {"生椰拿铁": 2, "茉莉奶绿": 1}
}`,
      bulletPoints: [
        "支持键值对与数组的多层嵌套，结构与 Python 的字典和列表高度一致",
        "纯文本、跨语言通用：网页前端、手机 App、后端服务与大模型接口都用 JSON 交换数据",
      ],
    },
  },
  {
    id: "file-json-spec",
    title: "Python 容器与 JSON 格式对照",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "序列化与反序列化：类型自动映射",
      body: "把内存里的 Python 对象转为标准文本存入文件或网络传输，称为序列化（Serialization）；把 JSON 文本还原回内存对象，称为反序列化（Deserialization）。",
      compareTable: {
        leftHeader: "Python 对象写法",
        rightHeader: "JSON 标准写法与语法规则",
        rows: [
          { left: "dict  {'杯型': '大杯'}", right: 'object  {"杯型": "大杯"}（键名和字符串必须用双引号 ""）' },
          { left: "list / tuple  ['珍珠', '椰果']", right: 'array   ["珍珠", "椰果"]（最后一项末尾不能多写逗号）' },
          { left: "int / float  16, 8.5", right: "number  16, 8.5（读回后自动还原为数值，无需手动转 int）" },
          { left: "True / False / None", right: "true / false / null（全部小写，处理接口空值时常遇到）" },
        ],
      },
    },
  },
  {
    id: "file-json-file",
    title: "json.dump 与 json.load：读写文件",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "将嵌套字典直接存入 .json 文件并原样读回",
      flowDiagram: [
        "写入文件：json.dump(Python对象, f, ensure_ascii=False)",
        "读回内存：data = json.load(f)",
      ],
      bulletPoints: [
        "读回的 data 直接还原为 Python 字典",
        "内部的整数、布尔值、列表、None 等类型全部自动恢复，与 CSV 全是字符串不同",
      ],
    },
    code: code(`import json

order = {
    "订单号": "B102",
    "外送": False,
    "地址": None,
    "加料": ["珍珠", "椰果"],
    "应付": 36,
}

with open("order.json", "w", encoding="utf-8") as f:
    json.dump(order, f, ensure_ascii=False)

with open("order.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print(type(data), data["加料"])
print("应付类型:", type(data["应付"]), "地址:", data["地址"])`),
    expectedOutput: `<class 'dict'> ['珍珠', '椰果']
应付类型: <class 'int'> 地址: None`,
  },
  {
    id: "file-json-format-modify",
    title: "中文显示与缩进排版",
    type: "modify",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "用 ensure_ascii=False 保留中文，indent=2 格式化缩进",
      body: "json.dump 默认会把中文字符转义成 \\uXXXX 形式并挤在同一行。请给第 10 行的 json.dump 补上 ensure_ascii=False 和 indent=2，生成清晰易读的会员档案文件。",
    },
    code: code(`import json

member = {
    "姓名": "陈宇",
    "积分": 120,
    "常点": ["生椰拿铁", "柠檬水"],
}

with open("member.json", "w", encoding="utf-8") as f:
    json.dump(member, f)

with open("member.json", "r", encoding="utf-8") as f:
    print(f.read().strip())`),
    hints: [
      { level: 1, text: "修改第 10 行的 json.dump(member, f)。" },
      { level: 2, text: "加上关键字参数 ensure_ascii=False 和 indent=2。" },
      {
        level: 3,
        text: "    json.dump(member, f, ensure_ascii=False, indent=2)",
      },
    ],
    reveal: {
      title: "对照",
      body: "ensure_ascii=False 让汉字原样保存；indent=2 按两格缩进换行，便于直接打开文件查看和排查问题。",
    },
    expectedOutput: `{
  "姓名": "陈宇",
  "积分": 120,
  "常点": [
    "生椰拿铁",
    "柠檬水"
  ]
}`,
  },
  {
    id: "file-json-str",
    title: "json.dumps 与 json.loads：转换字符串",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "尾字母 s 代表 str：在内存字符串与容器间直接互转",
      compareTable: {
        leftHeader: "函数对",
        rightHeader: "适用场景",
        rows: [
          { left: "json.dump / json.load", right: "操作文件对象 f（读写磁盘上的 .json 文件）" },
          { left: "json.dumps / json.loads", right: "操作字符串 str（解析小程序网络请求或大模型返回的 JSON 文本）" },
        ],
      },
    },
    code: code(`import json

raw_msg = '{"订单号": "B105", "饮品": "杨枝甘露", "杯数": 2, "备注": null}'

info = json.loads(raw_msg)
print("解析出字典:", info["饮品"], info["杯数"], info["备注"])

reply = {"状态": "已接单", "预计分钟": 8}
reply_str = json.dumps(reply, ensure_ascii=False)
print("序列化为字符串:", type(reply_str), reply_str)`),
    expectedOutput: `解析出字典: 杨枝甘露 2 None
序列化为字符串: <class 'str'> {"状态": "已接单", "预计分钟": 8}`,
  },
  {
    id: "file-json-debug",
    title: "调试：非法的 JSON 语法",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "排查 JSONDecodeError：单引号与布尔值大小写",
      body: "手写或拼接 JSON 字符串时，若误用了 Python 的单引号 '' 或大写 True，json.loads 会立即报错。请将 raw 修正为合法的 JSON 字符串。",
    },
    code: code(`import json

raw = "{'饮品': '茉莉奶绿', '少糖': True}"
data = json.loads(raw)
print(data["饮品"], data["少糖"])`),
    hints: [
      { level: 1, text: "JSON 规范要求键和字符串必须使用双引号 \"\"，不能用单引号 ''。" },
      { level: 2, text: "JSON 中的布尔值必须全小写：True 应改为 true。" },
      {
        level: 3,
        text: `raw = '{"饮品": "茉莉奶绿", "少糖": true}'`,
      },
    ],
    reveal: {
      title: "对照",
      body: "JSON 是跨语言标准：外层 Python 字符串可用单引号包裹，内部的 JSON 键名与字符串值一律用双引号，布尔值写 true / false。",
    },
    expectedOutput: "茉莉奶绿 True",
  },
  {
    id: "file-json-summary",
    title: "JSON 读写小结",
    type: "explain",
    layout: "fullscreen",
    content: {
      note: {
        title: "JSON 核心要点",
        points: [
          "适用数据\n含列表、嵌套字典的层次化数据（如订单详情、会员配置档案、Web 接口与大模型返回数据）。",
          "两对函数\n面向文件用 json.dump / json.load；面向字符串用 json.dumps / json.loads（尾字母 s 即 str）。",
          "书写规范\n双引号、true/false、null；保存中文常写 ensure_ascii=False, indent=2；读回后各基本类型自动还原。",
        ],
      },
    },
  },
  {
    id: "file-json-practice",
    title: "练习：解析小程序订单包",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`# 任务：读取小程序订单文件 order.json 并核算应付总额
# 订单结构包含：
# - "顾客": 字符串
# - "饮品列表": 字典列表，每项含 "名称"、"单价"、"加料"（列表，每种加料另收 2 元）
# 请使用 json.load 读取 order.json：
# 第一行打印顾客姓名
# 第二行打印本单应付总金额（整数，单杯金额 = 单价 + 加料种数 * 2）

import json

sample = {
    "顾客": "林晓",
    "饮品列表": [
        {"名称": "生椰拿铁", "单价": 16, "加料": ["咖啡冻"]},
        {"名称": "杨枝甘露", "单价": 18, "加料": ["椰果", "西米"]},
    ],
}
with open("order.json", "w", encoding="utf-8") as f:
    json.dump(sample, f, ensure_ascii=False)
`),
    hints: [
      { level: 1, text: '用 with open("order.json", "r", encoding="utf-8") as f: 配合 data = json.load(f) 读回字典。' },
      { level: 2, text: '遍历 data["饮品列表"]，每杯价格为 item["单价"] + len(item["加料"]) * 2。' },
      {
        level: 3,
        text: `with open("order.json", "r", encoding="utf-8") as f:
    data = json.load(f)

total = 0
for item in data["饮品列表"]:
    total += item["单价"] + len(item["加料"]) * 2

print(data["顾客"])
print(total)`,
      },
    ],
    reveal: {
      title: "对照",
      body: "json.load 直接还原出嵌套列表与整数单价：第一杯 16 + 1×2 = 18 元，第二杯 18 + 2×2 = 22 元，合计 40 元。",
    },
    expectedOutput: `林晓
40`,
  },
];
