import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const ROSTER = `roster = {"2024001": "周杰伦", "2024002": "林俊杰"}`;

/** 遍历、四类容器对照、课堂练习、课后作业。 */
export const scenes: DraftScene[] = [
  {
    id: "dict-walk-for",
    title: "遍历键",
    type: "run",
    layout: "split",
    content: {
      headline: "for 直接遍历得到键",
      flowDiagram: ["for sid in roster:"],
      body: "直接遍历字典时，循环变量依次绑定键。访问对应值需要再用该键索引。",
      bulletPoints: ["遍历得到的是键", "roster[sid] 才是对应的值"],
    },
    code: code(`${ROSTER}
for sid in roster:
    print(sid, roster[sid])`),
  },
  {
    id: "dict-walk-views",
    title: "keys、values、items",
    type: "run",
    layout: "split",
    content: {
      headline: "键视图、值视图与项视图",
      flowDiagram: ["roster.keys()", "roster.values()", "roster.items()"],
      body: "keys 返回全部键，values 返回全部值，items 返回键值对。下面分别转为列表后输出。",
      bulletPoints: ["只需键或只需值时使用 keys、values", "同时需要键和值时使用 items"],
    },
    code: code(`${ROSTER}
print(list(roster.keys()))
print(list(roster.values()))
print(list(roster.items()))`),
  },
  {
    id: "dict-walk-traits",
    title: "字典的特点",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "字典的特点",
      bulletPoints: [
        "按键访问，不需要线性扫描",
        "键不重复，后写入的值覆盖先写入的值",
        "不支持下标，roster[0] 不表示第一项",
        "可以新增、修改、删除",
        "for 遍历得到的是键",
      ],
    },
  },
  {
    id: "dict-walk-summary",
    title: "四种容器",
    type: "explain",
    layout: "fullscreen",
    content: {
      note: {
        title: "列表、元组、集合、字典",
        points: [
          "列表\n有顺序，允许重复，可以改。用下标取出一项。",
          "元组\n有顺序，允许重复，不能改项。用下标取出一项。",
          "集合\n无序，元素不重复，可增删。用 in 做成员检测，不支持下标。",
          "字典\n键不重复，可插入、更新、删除。用键访问值，不支持下标。",
        ],
      },
    },
  },
  {
    id: "dict-walk-practice",
    title: "练习：查名册",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      body: "依次查询键 \"2024002\" 和 \"2024009\"。键存在时输出对应值，不存在时输出「查无此人」。缺少的键不得使程序中断。",
    },
    code: code(`${ROSTER}
`),
    hints: [
      { level: 1, text: "方括号取值在键不存在时会报 KeyError。" },
      { level: 2, text: "get 的第二个参数写成「查无此人」。" },
      {
        level: 3,
        text: "print(roster.get(\"2024002\", \"查无此人\"))\nprint(roster.get(\"2024009\", \"查无此人\"))",
      },
    ],
    reveal: {
      title: "对照",
      body: "键 \"2024002\" 的值是林俊杰。键 \"2024009\" 不存在，输出查无此人。",
    },
    expectedOutput: `林俊杰
查无此人`,
  },
  {
    id: "dict-walk-containers",
    title: "容器数据类型总结",
    type: "explain",
    layout: "fullscreen",
    content: {
      gridTable: {
        headers: ["对比", "列表", "元组", "集合", "字典"],
        rows: [
          ["写法", "[a, b]", "(a, b)", "{a, b}", "{k: v}"],
          ["空容器", "[]", "()", "set()", "{}"],
          ["顺序", "有", "有", "无", "无"],
          ["重复", "允许", "允许", "不重复", "键不重复"],
          ["修改", "可变", "元素不可变", "可增删", "可增改删"],
          ["取出", "下标", "下标", "不能用下标", "用键"],
          ["适合解决的问题", "保留顺序、按位置访问或修改", "固定序列、防意外修改", "唯一性、成员判断与集合运算", "根据键快速查找对应信息"],
        ],
      },
    },
  },
  {
    id: "dict-walk-homework",
    title: "课后作业",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "课后作业",
      bulletPoints: [
        "集合 A 为 {\"周杰伦\", \"林俊杰\", \"邓紫棋\"} 的来源列表含重复项，集合 B 同理。输出 A 与 B 的交集，再输出 A - B。各组按字典序，每个元素一行。自验：林俊杰；随后为周杰伦、邓紫棋。",
        "字典 {\"2024001\": \"周杰伦\", \"2024002\": \"林俊杰\"}。依次查询 \"2024002\" 与 \"2024009\"。键存在则输出值，否则输出「查无此人」。使用 get 或分支，不得因缺少的键中断。自验：林俊杰；查无此人。",
      ],
    },
  },
];
