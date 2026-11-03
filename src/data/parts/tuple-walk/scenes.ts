import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const STUDENT = `student_info = ("周杰伦", 11, ["football", "music"])`;

/** 遍历、特点、总结，以及学生信息练习。 */
export const scenes: DraftScene[] = [
  {
    id: "tuple-walk-for",
    title: "for 遍历",
    type: "run",
    layout: "split",
    content: {
      headline: "元组可以被遍历",
      flowDiagram: ["for 元素 in 元组:"],
      body: "同列表一样，元组也可以被遍历。for 循环每次取出一个元素。",
      bulletPoints: ["循环变量 song 依次是晴天、稻香、夜曲"],
    },
    code: code(`songs = ("晴天", "稻香", "夜曲")
for song in songs:
    print(song)`),
  },
  {
    id: "tuple-walk-while",
    title: "while 遍历",
    type: "run",
    layout: "split",
    content: {
      headline: "while 循环遍历元组",
      flowDiagram: ["while index < len(元组):"],
      body: "用下标逐个取出。index 从 0 加到 len(songs) 之前。",
      bulletPoints: ["songs[index] 取出当前位置的歌名"],
    },
    code: code(`songs = ("晴天", "稻香", "夜曲")
index = 0
while index < len(songs):
    print(songs[index])
    index += 1`),
  },
  {
    id: "tuple-walk-traits",
    title: "元组的特点",
    type: "explain",
    layout: "fullscreen",
    content: {
      body: "多数特性和列表一致，不同点在于不可修改。",
      bulletPoints: [
        "可以容纳多个数据",
        "可以容纳不同类型的数据",
        "数据是有序存储的，用下标索引",
        "允许重复数据存在",
        "不可以修改，不能增加或删除元素",
        "支持 for 循环",
      ],
    },
  },
  {
    id: "tuple-walk-summary",
    title: "总结",
    type: "explain",
    layout: "fullscreen",
    content: {
      note: {
        title: "",
        points: [
          "元组的定义方式\n(元素, 元素, 元素, ……)。只有一个元素时，元素后面要加逗号。",
          "元组的操作方法\nindex() 查找下标，找不到报错。count() 统计出现次数。len(元组) 统计元素个数。切片规则与列表相同。tuple(range(...)) 把整数序列收成元组。",
          "元组的注意事项\n不可修改内容。可以修改内部 list 的内部元素，不能把这一项换成另一个对象。",
          "元组的特点\n和列表基本相同：有序、任意数量元素、允许重复。不同点在于不可修改。支持 for 循环。",
        ],
      },
    },
  },
  {
    id: "tuple-walk-practice",
    title: "练习：学生信息",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      body: "student_info 里依次是姓名、年龄、爱好列表。查出年龄的下标和学生姓名；从爱好里删掉 football，再追加 coding。四步都打印出来。",
    },
    code: code(`${STUDENT}
`),
    hints: [
      { level: 1, text: "查下标用 index，取姓名用下标 0。爱好是第 3 项，下标是 2。" },
      { level: 2, text: "remove 和 append 写在 student_info[2] 上，不要给元组赋值。" },
      {
        level: 3,
        text: "print(student_info.index(11))\nprint(student_info[0])\nstudent_info[2].remove(\"football\")\nprint(student_info)\nstudent_info[2].append(\"coding\")\nprint(student_info)",
      },
    ],
    reveal: {
      title: "对照",
      body: "年龄 11 的下标是 1，姓名是周杰伦。元组的三项没有被替换，变的是里面那个爱好列表。",
    },
    expectedOutput: `1
周杰伦
('周杰伦', 11, ['music'])
('周杰伦', 11, ['music', 'coding'])`,
  },
  {
    id: "tuple-walk-homework",
    title: "课后作业",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "课后作业",
    },
  },
];
