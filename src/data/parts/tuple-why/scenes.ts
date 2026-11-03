import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 列表可以改；要传递不被篡改的信息时用元组。 */
export const scenes: DraftScene[] = [
  {
    id: "tuple-why-need",
    title: "为什么需要元组",
    type: "explain",
    layout: "fullscreen",
    content: {
      body: "列表是可以修改的。如果想要传递的信息不被篡改，列表就不合适。",
      bulletPoints: [
        "元组同列表一样，可以封装多个、不同类型的元素",
        "元组一旦定义完成，就不可修改",
        "需要封装数据，又不希望封装的数据被篡改时，用元组",
      ],
    },
  },
  {
    id: "tuple-why-contrast",
    title: "列表会变，记录不该变",
    type: "run",
    layout: "split",
    content: {
      headline: "同一批信息，两种容器",
      body: "歌单还会追加。学生的姓名和年龄写定后，不该被某一行代码改掉。",
      bulletPoints: ["songs.append 会改列表", "info 用圆括号写成元组"],
    },
    code: code(`songs = ["晴天", "稻香", "夜曲"]
songs.append("七里香")
print(songs)

info = ("周杰伦", 11)
print(info)`),
  },
];
