import type { DraftScene } from "../../../types/scene";

/** 第 2 讲开篇：名字指向对象。不讲堆，不讲盒子。骑行单价仍是每分钟 1.5 元。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-var-01",
    type: "explain",
    layout: "split",
    content: {
      headline: "没有名字的数字",
      whyNeedVar: {
        bareCode: "print(18)\nprint(18 * 1.5)",
        questions: [
          "18 代表什么含义？",
          "如果将 18 修改为 20，要改几处？",
        ],
        teacherLines: [
          "这段程序能运行，但数字没有名字。",
          "算完就丢了；改一处还得记得改另一处。",
        ],
        numbers: [{ value: "18", label: "骑行分钟" }],
        namedCode: "minutes = 18\nprint(minutes)\nprint(minutes * 1.5)",
        summary: "反复出现的数据，需要被记住，并且有一个名字。",
      },
    },
    code: {
      initial: "print(18)\nprint(18 * 1.5)",
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-var-02",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "赋值",
      body: "age 是名字，18 是对象",
      assignIntro: {
        name: "age",
        value: "18",
        summary:
          "赋值运算符 = ：让左边的名字指向右边的对象。",
      },
    },
  },
  {
    id: "scene-var-03",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "重新赋值",
      question: "数学里 age = age + 1 好像不成立。这里为什么可以？",
      varModel: {
        mode: "update",
        name: "age",
        value: "18",
        nextValue: "19",
        delta: 1,
        codeLines: ["age = 18", "age = age + 1", "print(age)"],
        teacherLine: "先算右边：取出 age 现在指向的 18，加上 1，得到 19。",
        conclusion: "然后让名字 age 改指向 19。原来的 18 不变。",
      },
    },
  },
  {
    id: "scene-var-04",
    type: "run",
    layout: "split",
    content: {
      headline: "变量名规则",
      identifiers: {
        definition: "变量名是标识符：用来称呼一份数据的名字。",
        examples: "右侧先运行不允许的写法，最后换成能通过的名字。",
        rules: [
          "由字母、数字、下划线组成，不能以数字开头。",
          "多个单词用小写加下划线：student_name。",
          "名字要能看出含义：minutes、price。",
          "不能用关键字，也不要用 print、list 这类内置名字。",
        ],
        keywordLead: "下面这些词有专门用途，不能当作变量名。",
        keywords: ["if", "else", "elif", "for", "while", "and", "or", "not", "True", "False", "in", "def", "return"],
        keywordNote: "print 不是关键字。print = 18 会先通过，再调用 print 才会失败。",
        close: "这趟骑行用 minutes、price、nickname。",
        demos: [
          {
            title: "数字开头",
            note: "2minutes 以数字开头。点右侧「运行」，看 SyntaxError。",
            code: "2minutes = 18",
          },
          {
            title: "关键字",
            note: "if 是关键字，不能当作变量名。",
            code: "if = 18",
          },
          {
            title: "内置函数名",
            note: "第一行先通过：名字 print 改指向 18。第二行再调用，才会报错。",
            code: 'print = 18\nprint("hello")',
          },
          {
            title: "可以这样写",
            note: "字母或下划线开头，多个单词用下划线。运行后能打印出来。",
            code: 'minutes = 18\nprice = 1.5\nstudent_name = "李华"\nprint(minutes, price, student_name)',
          },
        ],
      },
    },
    code: {
      initial: "2minutes = 18",
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-var-05",
    type: "run",
    layout: "split",
    content: {
      headline: "两个名字",
      nameLink: {
        mode: "alias",
        summary: "a 和 b 都指向 18",
      },
    },
    code: {
      initial: "a = 18\nb = a\nprint(id(a))\nprint(id(b))",
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-var-06",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "名字空间",
      nameLink: {
        mode: "namespace",
        summary: "名字空间是一张表：键是名字，值是这个名字指向的对象。对象写在表外，赋值只是让名字改指向。",
      },
    },
  },
];
