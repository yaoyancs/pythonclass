import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const MENU = `songs = ["晴天", "稻香", "夜曲"]
while True:
    print("====== 我的歌单 ======")
    print("1. 查看全部歌曲")
    print("2. 添加歌曲")
    print("3. 删除歌曲")
    print("4. 修改歌曲")
    print("0. 退出")
    choice = input("请选择：")
    if choice == "1":
        for i in range(len(songs)):
            print(i + 1, songs[i])
    elif choice == "2":
        name = input("歌名：")
        songs.append(name)
        print(songs)
    elif choice == "0":
        break
    else:
        print("这个功能还没写")`;

/** 第五幕：用 while、if、break 把歌单操作收成一个小程序。 */
export const scenes: DraftScene[] = [
  {
    id: "playlist-manager-menu",
    title: "程序结构",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "歌单管理程序",
      body: "反复显示菜单，输入 0 退出。",
      bulletPoints: [
        "1. 查看全部歌曲",
        "2. 添加歌曲",
        "3. 删除歌曲",
        "4. 修改歌曲",
        "0. 退出",
      ],
    },
  },
  {
    id: "playlist-manager-run",
    title: "查看与添加",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      body: "1 查看，2 添加，0 退出。3 和 4 下一页再写。",
      markedPoints: [
        [{ text: "while True：反复出现，break 才停。" }],
        [{ text: "和 \"1\"、\"0\" 比较。" }],
        [{ text: "序号是 i + 1。" }],
      ],
    },
    code: code(MENU),
  },
  {
    id: "playlist-manager-ex",
    title: "删除与修改",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      body: "3：按歌名删除。4：按第几首换成新歌名。改完打印 songs。",
    },
    code: code(`songs = ["晴天", "稻香", "夜曲"]
while True:
    print("====== 我的歌单 ======")
    print("1. 查看全部歌曲")
    print("2. 添加歌曲")
    print("3. 删除歌曲")
    print("4. 修改歌曲")
    print("0. 退出")
    choice = input("请选择：")
    if choice == "1":
        for i in range(len(songs)):
            print(i + 1, songs[i])
    elif choice == "2":
        name = input("歌名：")
        songs.append(name)
        print(songs)
    elif choice == "3":
        name = input("要删除的歌名：")
    elif choice == "4":
        which = int(input("第几首："))
        name = input("新歌名：")
    elif choice == "0":
        break
`),
    hints: [
      { level: 1, text: "知道歌名，用 remove。用户说的第几首从 1 数，索引要减 1。" },
      { level: 2, text: "input 得到文字。第几首要先 int，才能拿去当索引。" },
      {
        level: 3,
        text: `elif choice == "3":
    name = input("要删除的歌名：")
    songs.remove(name)
    print(songs)
elif choice == "4":
    which = int(input("第几首："))
    name = input("新歌名：")
    songs[which - 1] = name
    print(songs)`,
      },
    ],
    reveal: {
      title: "对照",
      body: "remove(name) 按歌名删。songs[which - 1] = name 按位置改。第 2 首的下标是 1。",
    },
  },
  {
    id: "playlist-manager-questions",
    title: "查找问题",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "判断歌曲是否存在",
      body: "输入歌名。在就打印位置（从 1 数），不在就打印「不存在」。先不用 index()。",
      note: {
        title: "分析步骤",
        points: [
          "数据为什么适合用列表存储？",
          "解决问题需要依次执行哪些步骤？",
          "怎样利用已有的循环和分支实现？",
        ],
      },
    },
  },
  {
    id: "playlist-manager-find",
    title: "练习：查找位置",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      body: "找到就打印位置并停止。都没有就打印「不存在」。稻香 → 2；七里香 → 不存在。",
    },
    code: code(`songs = ["晴天", "稻香", "夜曲"]
name = input("歌名：")
`),
    hints: [
      { level: 1, text: "要知道位置，用 range(len(songs))。找到时位置是 i + 1。" },
      { level: 2, text: "用一个标记记录有没有找到。找到就打印并 break。循环结束后，标记仍是未找到，才打印「不存在」。" },
      {
        level: 3,
        text: `songs = ["晴天", "稻香", "夜曲"]
name = input("歌名：")
found = False
for i in range(len(songs)):
    if songs[i] == name:
        print(i + 1)
        found = True
        break
if not found:
    print("不存在")`,
      },
    ],
    reveal: {
      title: "对照",
      body: "稻香下标是 1，打印 2。七里香对不上，打印不存在。",
    },
  },
  {
    id: "playlist-manager-practice",
    title: "练习：迟到名单",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      body: "名单里已有小明、小红。追加小刚。若小李不在名单中，打印「未到」；小红在，打印她是第几位（从 1 数）。先不用 index()。",
    },
    code: code(`names = ["小明", "小红"]
`),
    hints: [
      { level: 1, text: "追加用 append。查找用 for 和 range(len(names))。" },
      { level: 2, text: "小李遍历结束仍没遇到，才打印未到。小红对上时打印 i + 1。" },
      {
        level: 3,
        text: `names = ["小明", "小红"]
names.append("小刚")
found = False
for i in range(len(names)):
    if names[i] == "小李":
        found = True
        break
if not found:
    print("未到")
for i in range(len(names)):
    if names[i] == "小红":
        print(i + 1)
        break`,
      },
    ],
    reveal: {
      title: "对照",
      body: "追加后是小明、小红、小刚。小李不在，打印未到。小红是第 2 位。",
    },
    expectedOutput: "未到\n2",
  },
];
