import type { DraftScene } from "../../../types/scene";

/** f-string：把名字和算式填进句子。先看加号拼接的麻烦，再写 f、表达式、格式，最后交回确认单。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-fs-plus",
    type: "run",
    layout: "split",
    content: {
      headline: "加号的麻烦",
      stringTemplate: {
        plusCode:
          'name = "李华"\nminutes = 18\nprint(name + "骑了" + str(minutes) + "分钟")',
        formatCode: 'name = "李华"\nminutes = 18\nprint(f"{name}骑了{minutes}分钟")',
        pieces: ["name", '"骑了"', "str(minutes)", '"分钟"'],
        gaps: ["", "骑了", "分钟"],
        slots: [
          { name: "name", value: "李华" },
          { name: "minutes", value: "18" },
        ],
        lines: [
          "字符串只能和字符串相加。数字要先 str() 才能接进去，加号一多就容易漏。",
          "f 写在引号前面，要填的地方用花括号留空，Python 自动换成名字现在的值。",
        ],
      },
    },
    code: {
      initial: 'name = "李华"\nminutes = 18\nprint(name + "骑了" + str(minutes) + "分钟")',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-fs-basic",
    type: "run",
    layout: "split",
    content: {
      headline: "f-string",
      question: "f 写在哪？花括号里放什么？",
      codeBeats: {
        beforeRun: true,
        beats: [
          {
            line: "f 紧贴在引号前面。花括号里放名字，输出时换成它现在指向的值，数字不用自己转。",
            code: 'name = "李华"\nminutes = 18\nprint(f"{name}骑了{minutes}分钟")',
          },
          {
            line: "忘了 f，花括号就是普通字符，原样打出来。",
            code: 'name = "李华"\nminutes = 18\nprint(f"{name}骑了{minutes}分钟")\nprint("{name}骑了{minutes}分钟")',
          },
          {
            line: "名字改指向别的对象，同一句话换上新的值。name 和 minutes 本身没有被 f 改动。",
            code: 'name = "李华"\nminutes = 18\nprint(f"{name}骑了{minutes}分钟")\nprint("{name}骑了{minutes}分钟")\nminutes = 25\nprint(f"{name}骑了{minutes}分钟")\nprint(type(minutes))',
          },
          {
            line: "f-string 得到的是一个新字符串，可以留在名字里，以后再用。",
            code: 'name = "李华"\nminutes = 18\nprint(f"{name}骑了{minutes}分钟")\nprint("{name}骑了{minutes}分钟")\nminutes = 25\nprint(f"{name}骑了{minutes}分钟")\nprint(type(minutes))\nmessage = f"{name}骑了{minutes}分钟"\nprint(type(message))\nprint(message)',
          },
        ],
      },
    },
    code: {
      initial: 'name = "李华"\nminutes = 18',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-fs-expr",
    type: "run",
    layout: "split",
    content: {
      headline: "花括号里能算",
      question: "花括号里只能放名字吗？",
      codeBeats: {
        beforeRun: true,
        beats: [
          {
            line: "花括号里可以写算式。先算出结果，再换进句子。",
            code: 'minutes = 18\nprice = 1.5\nprint(f"费用 {minutes * price} 元")',
          },
          {
            line: "// 和 % 也行。几小时几分钟，不用先存到别的名字里。",
            code: 'minutes = 18\nprice = 1.5\nprint(f"费用 {minutes * price} 元")\nprint(f"{minutes} 分钟 = {minutes // 60} 小时 {minutes % 60} 分")',
          },
          {
            line: "切片、方法、比较都可以。算完的是新值，campus 和 minutes 都没变。",
            code: 'minutes = 18\nprice = 1.5\nprint(f"费用 {minutes * price} 元")\nprint(f"{minutes} 分钟 = {minutes // 60} 小时 {minutes % 60} 分")\ncampus = "曲阜师范大学"\nprint(f"简称 {campus[::2]}")\nprint(f"超时：{minutes > 15}")\nprint(campus)',
          },
          {
            line: "式子太长，读起来吃力，就先算好放进名字，花括号里只留名字。",
            code: 'minutes = 18\nprice = 1.5\nfee = minutes * price\nshort = "曲阜师范大学"[::2]\novertime = minutes > 15\nprint(f"{short}骑了 {minutes} 分钟，费用 {fee} 元，超时：{overtime}")',
          },
        ],
      },
    },
    code: {
      initial: 'minutes = 18\nprice = 1.5',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-fs-spec",
    type: "run",
    layout: "split",
    content: {
      headline: "格式说明",
      question: "27.0 能不能写成 27.00？",
      codeBeats: {
        beforeRun: true,
        beats: [
          {
            line: "名字后面加冒号，冒号后面写格式。.2f 的意思：保留 2 位小数，不够补零。",
            code: 'fee = 18 * 1.5\nprint(fee)\nprint(f"{fee:.2f}")',
          },
          {
            line: "多出来的小数会四舍五入。0.1 + 0.2 不精确，.2f 之后就是 0.30。",
            code: 'fee = 18 * 1.5\nprint(fee)\nprint(f"{fee:.2f}")\ntotal = 0.1 + 0.2\nprint(total)\nprint(f"{total:.2f}")',
          },
          {
            line: "格式只管输出的样子。fee 本身仍是 27.0，类型没变。",
            code: 'fee = 18 * 1.5\nprint(f"{fee:.2f}")\nprint(fee)\nprint(type(fee))\nprint(type(f"{fee:.2f}"))',
          },
          {
            line: "数字后面还能留宽度。> 靠右，< 靠左，^ 居中，数字是占几格。",
            code: 'minutes = 18\nprint(f"[{minutes:>6}]")\nprint(f"[{minutes:<6}]")\nprint(f"[{minutes:^6}]")',
          },
          {
            line: ".1% 把 0.256 换成百分数，保留 1 位小数。",
            code: 'rate = 18 / 70\nprint(rate)\nprint(f"{rate:.1%}")',
          },
        ],
      },
    },
    code: {
      initial: 'fee = 18 * 1.5',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-fs-predict",
    type: "predict",
    layout: "split",
    content: {
      headline: "少了 f",
      codeBeats: {
        beats: [
          {
            line: "补上 f，花括号才会换成名字的值。",
            code: 'name = "李华"\nprint("{name}好")\nprint(f"{name}好")',
          },
          {
            line: "句子里真要打出花括号，就写两个：{{ 和 }}。",
            code: 'name = "李华"\nprint("{name}好")\nprint(f"{name}好")\nprint(f"{{name}}好")',
          },
        ],
      },
    },
    code: {
      initial: 'name = "李华"\nprint("{name}好")',
      editable: true,
      resetToInitial: true,
    },
    prediction: {
      question: 'print("{name}好") 没有 f，得到什么？',
      options: [
        { id: "hua", label: "李华好" },
        { id: "raw", label: "{name}好", isCorrect: true },
        { id: "nameerror", label: "NameError" },
      ],
    },
    reveal: {
      body: "没有 f，花括号只是普通字符。",
    },
  },
  {
    id: "scene-fs-practice",
    type: "run",
    layout: "split",
    content: {
      headline: "练一练：改写成 f-string",
      bulletPoints: [
        "把最后一行的加号拼接，改写成 f-string。",
        "费用要显示成 27.00 元。",
        "目标输出：李华骑了 18 分钟，费用 27.00 元",
      ],
    },
    code: {
      initial:
        'name = "李华"\nminutes = 18\nprice = 1.5\nfee = minutes * price\n\nprint(name + "骑了" + str(minutes) + "分钟，费用" + str(fee) + "元")',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-str-10",
    type: "run",
    layout: "split",
    content: {
      headline: "确认单",
      codeBeats: {
        beforeRun: true,
        beats: [
          {
            line: "姓名两端有空格，确认是大写。strip() 去掉两端空白，lower() 收成小写。",
            code: 'name = "  李华  "\nanswer = "YES"\ncourse = "程序设计（C）"\ncollege = "曲阜师范大学计算机学院"\ntext = "18"\n\nname = name.strip()\nanswer = answer.lower()\nprint(name)\nprint(answer == "yes")',
          },
          {
            line: "课表上还写着 C。replace 换掉，再让 course 改指向新串。",
            code: 'name = "  李华  "\nanswer = "YES"\ncourse = "程序设计（C）"\ncollege = "曲阜师范大学计算机学院"\ntext = "18"\n\nname = name.strip()\nanswer = answer.lower()\ncourse = course.replace("C", "Python")\nprint(course)',
          },
          {
            line: 'text 里的 "18" 是文字。先 int()，再乘 1.5。',
            code: 'name = "  李华  "\nanswer = "YES"\ncourse = "程序设计（C）"\ncollege = "曲阜师范大学计算机学院"\ntext = "18"\n\nname = name.strip()\nanswer = answer.lower()\ncourse = course.replace("C", "Python")\nminutes = int(text)\nfee = minutes * 1.5\nprint(fee)',
          },
          {
            line: '用刚学的 f-string，把花括号里的名字换成它现在的值。五项用逗号接成一句。',
            code: 'name = "  李华  "\nanswer = "YES"\ncourse = "程序设计（C）"\ncollege = "曲阜师范大学计算机学院"\ntext = "18"\n\nname = name.strip()\nanswer = answer.lower()\ncourse = course.replace("C", "Python")\nminutes = int(text)\nfee = minutes * 1.5\nprint("，".join([\n    name + "已确认",\n    "选修" + course,\n    college,\n    f"骑行 {minutes} 分钟",\n    f"费用 {fee} 元",\n]))',
          },
        ],
      },
    },
    code: {
      initial:
        'name = "  李华  "\nanswer = "YES"\ncourse = "程序设计（C）"\ncollege = "曲阜师范大学计算机学院"\ntext = "18"',
      editable: true,
      resetToInitial: true,
    },
  },
];
