import type { DraftScene } from "../../../types/scene";

export const scenes: DraftScene[] = [
  {
    id: "scene-pyhist-father",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "Python 之父",
      pythonFather: {
        portrait: {
          src: "/guido-van-rossum.jpg",
          alt: "Guido van Rossum",
          caption: "Guido van Rossum · Python 之父",
        },
        anecdotes: [
          {
            title: "名字从哪来",
            body: "Python 取自英国喜剧团体 Monty Python，不是那条蛇。",
            takeaway: "语言可以有轻松气质；真正认真的，是让人更容易读懂代码。",
          },
          {
            title: "起步很轻",
            body: "1989 年圣诞假期，Guido 开始写这个业余项目；1991 年公开发布。",
            takeaway: "后来影响很大的工具，常常先从解决眼前的小需求开始。",
          },
          {
            title: "从个人到社区",
            body: "他长期主导语言演进，后来把更多决策交给社区。",
            takeaway: "语言会继续变，决策也越来越多地交给社区。",
          },
        ],
        pronunciationsHint: "点一下，听听 Python 的几种读法",
        pronunciations: [
          {
            label: "美式",
            phonetic: "/ˈpaɪθɑːn/",
            src: "/audio/python-us.m4a",
            note: "PIE-thon",
          },
          {
            label: "英式",
            phonetic: "/ˈpaɪθən/",
            src: "/audio/python-uk.m4a",
            note: "偏弱尾音",
          },
          {
            label: "澳式",
            phonetic: "/ˈpaɪθən/",
            src: "/audio/python-au.m4a",
          },
          {
            label: "课堂常用",
            phonetic: "派森",
            src: "/audio/python-zh.m4a",
            note: "中文近似",
          },
        ],
      },
    },
  },
  {
    id: "scene-pyhist-brief",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "几个关键节点",
      pythonBriefHistory: {
        nodes: [
          {
            year: "1989–1991",
            title: "起步与发布",
            note: "假期里开工，随后公开第一版。",
          },
          {
            year: "此后",
            title: "通用语言 + 数据生态",
            note: "网站、自动化、科学计算与数据分析，库越来越多。",
          },
          {
            year: "今天",
            title: "Python 3 是主流",
            note: "社区与生态已转到 Python 3。",
          },
        ],
      },
    },
  },
];
