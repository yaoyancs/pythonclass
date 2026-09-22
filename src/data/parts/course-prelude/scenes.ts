import type { DraftScene } from "../../../types/scene";
import { COURSE_SCHEDULE } from "../../calendar";

export const scenes: DraftScene[] = [
  {
    id: "scene-course-intro",
    title: "课程简介",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "各位步入大学后的第一门编程课",
      body: "专业必修课  ·  共 48 学时",
      schedule: COURSE_SCHEDULE,
      image: {
        src: "/python-meme.png",
        alt: "人生苦短，我用 Python",
      },
    },
  },
  {
    id: "scene-course-tools",
    title: "课堂辅助工具",
    type: "explain",
    layout: "fullscreen",
    content: {
      infoCards: [
        {
          title: "QQ 群",
          items: ["通知发布", "答疑讨论"],
        },
        {
          title: "PTA 实验平台",
          href: "https://pintia.cn/",
          items: ["上机练习与机考都在这个平台完成"],
        },
      ],
      image: {
        src: "/qq-group.png",
        alt: "26秋 Python 程序设计 QQ 群二维码",
      },
    },
  },
  {
    id: "scene-course-grading",
    title: "如何考核",
    type: "explain",
    layout: "fullscreen",
    content: {
      gradeItems: [
        {
          label: "平时成绩",
          percent: "10%",
          children: [
            {
              label: "课堂互动",
              percent: "5%",
              note: "幸运草；按本班第90百分位折到5分",
            },
            {
              label: "提问",
              percent: "5%",
              note: "抽点小红花；按本班第90百分位折到5分",
            },
          ],
        },
        {
          label: "期中考试",
          percent: "20%",
          note: "PTA 机考，闭卷，第 6～8 周",
        },
        {
          label: "上机实践",
          percent: "30%",
          children: [
            { label: "基础语法 PTA", percent: "15%" },
            { label: "综合项目", percent: "15%" },
          ],
        },
        {
          label: "期末考试",
          percent: "40%",
          note: "PTA 机考，闭卷；折算缺勤达 6 次不得参加（早退 3 次计 1 次缺勤，请假不计）",
        },
      ],
    },
  },
];
