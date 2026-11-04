import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** JSON：层次结构与跨程序数据交换。 */
export const scenes: DraftScene[] = [
  {
    id: "file-json-dumps",
    title: "结构化数据用 JSON",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "当数据里有列表和嵌套字典",
      body: "数据同时包含字符串和列表。这种嵌套结构适合保存为 JSON，也是与外部程序交换数据的常用格式。",
      bulletPoints: [
        "json.dump 写入文件，json.load 从文件读回",
        "ensure_ascii=False 保留非 ASCII 字符",
        "读回后还原为字典和列表",
      ],
    },
    code: code(`import json

profile = {
    "姓名": "小明",
    "时长": [45, 60, 35],
}

with open("profile.json", "w", encoding="utf-8") as f:
    json.dump(profile, f, ensure_ascii=False)

with open("profile.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print(data["姓名"])
print(sum(data["时长"]))`),
  },
  {
    id: "file-json-three-concepts",
    title: "容器、文件与格式",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "分清三件事：容器、文件、数据格式",
      gridTable: {
        headers: ["层次", "角色", "例子", "解决的问题"],
        rows: [
          ["Python 容器", "程序内部组织数据", "list、dict", "运行时怎样高效增删、查找和计算"],
          ["文件", "外部存储载体", "study.txt、data.json", "程序关闭后数据怎样保留下来"],
          ["CSV / JSON", "存储与交换格式", "表格行 / 键值嵌套", "不同程序或服务之间怎样读懂同一份数据"],
        ],
      },
      bulletPoints: [
        "CSV 适合字段一致的二维表格记录",
        "JSON 适合嵌套对象与 Web / 大模型接口数据交换",
      ],
    },
  },
];
