import type { DraftScene } from "../../../types/scene";

/** 第 2 讲收束：小结 + 作业 + 第 3 讲钩子。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-ch-01",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "小结",
      finalVerdict: {
        lines: [
          "本讲弄清：数据不仅有值，还有类型。",
          "会认 int / float / str / bool，会转换，会比较。",
          "飞花令从「能展示诗卡」升级到「可计算、可判断」。",
        ],
        abilities: [
          "解释诗卡里的变量：名字、值、赋值",
          "解释为什么 input 的轮次不能直接 +1",
          "使用 type() 查证类型",
          "进行整数与浮点基本运算",
          "拼接字符串并写最简 f-string",
          "使用 int() / float() / str() 转换",
          "写出比较表达式并理解 True/False",
          "完成飞花令 0.2 开场与记分",
        ],
        teaserCode:
          'passed = score >= 60\nprint(passed)\n# 若 passed 为 True，打印「过关」；\n# 若为 False，打印「再来一轮」——怎么写？',
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
        "用 type() 区分 2、2.0、\"花\"、True。",
        "把第 1 讲诗卡改成三个变量 player、poem、author，并用 f-string 打印。",
        "飞花令记分：input 轮次与得分，必须先转换再算「下一轮」和「是否及格」，自测两组输入。",
        "完成 PTA 中本讲对应练习。",
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
        "同一段飞花令程序，不同得分，可以走不同路径",
        "将从「打印是否及格」变成「过关或再来一轮」",
        "先保证类型正确，再写分支 —— 否则 if 判断的是错的东西",
      ],
      preview: "第 3 讲 · 条件判断",
    },
  },
];
