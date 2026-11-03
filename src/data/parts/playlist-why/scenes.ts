import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 第一幕：没有列表时，一批有顺序的歌很难统一管理。 */
export const scenes: DraftScene[] = [
  {
    id: "playlist-why-open",
    title: "引入",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "实现一份歌单",
      bulletPoints: [
        "查看全部歌曲",
        "播放指定歌曲",
        "增加、删除、调整顺序",
        "查看歌曲数量",
      ],
      image: {
        src: "/lesson06/playlist.jpg",
        alt: "手机音乐播放器中的歌单：晴天、稻香、夜曲",
      },
      preview: "下一页：用多个变量分别保存歌曲",
    },
  },
  {
    id: "playlist-why-vars",
    title: "多个变量",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "🤔多首歌曲如何存储？",
    },
    code: code(`song1 = "晴天"
song2 = "稻香"
song3 = "夜曲"
print(song1)
print(song2)
print(song3)`),
  },
  {
    id: "playlist-why-list",
    title: "创建列表",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "基本语法",
      flowDiagram: [
        "# 字面量",
        "[元素1, 元素2, 元素3, 元素4, ...]",
        "# 定义变量",
        "变量名称 = [元素1, 元素2, 元素3, 元素4, ...]",
        "# 定义空列表",
        "变量名称 = []",
        "变量名称 = list()",
      ],
      body: "列表内的每一个数据，称之为元素。",
      bulletPoints: [
        "以 [] 作为标识",
        "列表内每一个元素之间用逗号隔开",
        "元素类型可以相同，也可以不同：整数、字符串、列表都可以放进同一个列表",
      ],
    },
    code: code(`songs = ["晴天", "稻香", "夜曲"]
print(songs)`),
  },
  {
    id: "playlist-index-create-summary",
    title: "列表创建小结",
    type: "explain",
    layout: "fullscreen",
    content: {
      note: {
        title: "列表创建小结",
        points: [
          "列表的定义语法\n[元素1, 元素2, 元素3, …]",
          "什么是元素？\n数据容器内的每一份数据，都称之为元素。",
          "元素的类型有限制吗？\n元素的数据类型没有任何限制，甚至元素也可以是列表，这样就定义了嵌套列表。",
        ],
      },
    },
  },
  {
    id: "playlist-why-practice",
    title: "练习：点名册",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      body: "用一个列表保存周杰伦、林俊杰、邓紫棋，再把整份名单打印出来。",
    },
    code: code(``),
    hints: [
      { level: 1, text: "一个列表用方括号，姓名之间用逗号隔开。" },
      { level: 2, text: "先赋给变量，再 print 这个变量。" },
      {
        level: 3,
        text: `names = ["周杰伦", "林俊杰", "邓紫棋"]
print(names)`,
      },
    ],
    reveal: {
      title: "对照",
      body: "三个人放在同一个列表里，一次打印整份名单。",
    },
    expectedOutput: "['周杰伦', '林俊杰', '邓紫棋']",
  },
];
