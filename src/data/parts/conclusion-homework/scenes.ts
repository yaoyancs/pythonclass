import type { DraftScene } from "../../../types/scene";

/** 第 2 讲收束：小结 + 作业 + 第 3 讲钩子。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-ch-01",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "课堂小结",
      finalVerdict: {
        lines: [
          "本讲弄清：数据不仅有值，还有类型。",
          "会认 int / float / str / bool，会转换，会比较。",
          "CampusLife 从「能展示」升级到「可计算、可判断」。",
        ],
        abilities: [
          "解释为什么 input 的数字不能直接做算术",
          "使用 type() 查证类型",
          "进行整数与浮点基本运算",
          "拼接字符串并写最简 f-string",
          "使用 int() / float() / str() 转换",
          "写出比较表达式并理解 True/False",
          "完成 CampusLife 0.2 一日报告",
        ],
        teaserCode:
          'study_ok = study_hours >= 2.0\nprint(study_ok)\n# 若 study_ok 为 True，打印鼓励；\n# 若为 False，打印提醒——怎么写？',
        teaserQuestion: "只有 True/False 还不够：程序如何根据结果走不同的路？",
        teaserClose: "下一讲：条件判断 —— 让程序作出选择。",
      },
    },
  },
  {
    id: "scene-ch-02",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "课后作业",
      body: "第二次课后作业",
      bulletPoints: [
        "复习：用 type() 区分 2、2.0、\"2\"、True",
        "改写开场年龄程序：必须先转换再 +1，并自测两组输入",
        "扩展 CampusLife 0.2：再增加一个比较（如睡眠 ≥ 7）并打印布尔结果",
        "完成 PTA 中本讲对应练习",
      ],
    },
  },
  {
    id: "scene-ch-03",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "下一讲预告",
      body: "比较给了我们 True / False；下一讲用 if 让程序分支。",
      bulletPoints: [
        "同一段程序，不同输入，可以走不同路径",
        "CampusLife 将从「打印是否达标」变成「给出不同建议」",
        "先保证类型正确，再写分支 —— 否则 if 判断的是错的东西",
      ],
      preview: "第 3 讲 · 条件判断",
    },
  },
];
