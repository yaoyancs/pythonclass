import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 课堂练习、本讲要点、课后作业。 */
export const scenes: DraftScene[] = [
  {
    id: "file-close-practice",
    title: "练习：读取 JSON 并统计",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      body: "先将字典 record 写入 record.json，再从 record.json 读回字典。第一行打印「主题」的值，第二行打印「时长」列表的平均值（整数或浮点数均可，示例三项平均为 50.0）。",
    },
    code: code(`import json

record = {"主题": "Python容器", "时长": [40, 50, 60]}
with open("record.json", "w", encoding="utf-8") as f:
    json.dump(record, f, ensure_ascii=False)
`),
    hints: [
      { level: 1, text: "用 with open(\"record.json\", \"r\", encoding=\"utf-8\") as f: 打开文件。" },
      { level: 2, text: "data = json.load(f)，然后取 data[\"主题\"] 和 data[\"时长\"]。" },
      {
        level: 3,
        text: 'with open("record.json", "r", encoding="utf-8") as f:\n    data = json.load(f)\nprint(data["主题"])\nprint(sum(data["时长"]) / len(data["时长"]))',
      },
    ],
    reveal: {
      title: "对照",
      body: "json.load 把文件中的 JSON 文本还原为 Python 字典，列表可直接用 sum 和 len 计算平均值。",
    },
    expectedOutput: `Python容器
50.0`,
  },
  {
    id: "file-close-points",
    title: "本讲要点",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "文件与数据格式",
      bulletPoints: [
        "内存中的数据在程序结束后消失，写入文件才能持久化保存",
        "with open(路径, 模式, encoding=\"utf-8\") 自动管理文件关闭",
        "\"r\" 读取、\"w\" 覆盖写入、\"a\" 末尾追加",
        "CSV 适合字段一致的多条表格记录，可用 csv.DictReader 按列名读取",
        "JSON 适合嵌套结构与跨程序交换，用 json.dump / json.load 转换容器与文件",
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
