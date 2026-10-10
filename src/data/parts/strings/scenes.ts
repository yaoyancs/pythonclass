import type { DraftScene } from "../../../types/scene";

/** 第 2 讲字符串：先掌握一排字符，再整理成一张确认单。不能改其中一格，要留下就改指向。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-str-02",
    type: "run",
    layout: "split",
    content: {
      headline: "引号",
      markedPoints: [
        [
          { text: " 1 是 " },
          { text: "int", mark: true },
          { text: "，" },
          { text: '"1"', mark: true },
          { text: " 是 " },
          { text: "str", mark: true },
          { text: "。" },
        ],
        [{ text: "int 的 + 是相加：1 + 2 得到 3。" }],
        [
          { text: "str 的 + 是拼接：" },
          { text: '"1" + "2"', mark: true },
          { text: " 是 " },
          { text: '"12"', mark: true },
        ],
        [
          { text: "引号只用来标出字符串，引号本身不是内容。" },
          { text: '"李华"', mark: true },
          { text: " 里面是李、华两个字。" },
        ],
        [
          { text: "单引号和双引号没有类型差别。句子里已有单引号时，外面用双引号：" },
          { text: '"I\'m a student."', mark: true },
          { text: "。" },
        ],
        [
          { text: "1 + " },
          { text: '"2"', mark: true },
          { text: " 类型不匹配，无法计算。" },
        ],
      ],
    },
    code: {
      initial:
        'print(1 + 2)\nprint("1" + "2")\nprint(type(1))\nprint(type("1"))\nprint("李" + "华")\nsentence = "I\'m a student."\nprint(sentence)\nprint(type("李华"))\nprint(type(\'李华\'))\nprint(1 + "2")',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-str-03",
    type: "explain",
    layout: "split",
    content: {
      headline: "下标",
      stringBoard: {
        word: "风送花香红满地，雨滋春树碧连天",
        mode: "index",
        bindingName: "text",
        lead: "字符串是排成一排的字符。下标标记这一格离起点有多远。",
        examples: [
          {
            code: "text[0]",
            result: "风",
            note: "起点还没往右移，偏移是 0，所以下标从 0 开始。第 1 个字是「风」。",
            pick: [0],
          },
          {
            code: "text[2]",
            result: "花",
            note: "往右移 2 格，下标是 2，是「花」。",
            pick: [2],
          },
        ],
      },
    },
    code: {
      initial: 'text = "风送花香红满地，雨滋春树碧连天"\nprint(text[0])\nprint(text[2])',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-str-04",
    type: "explain",
    layout: "split",
    content: {
      headline: "负向索引",
      stringBoard: {
        word: "风送花香红满地，雨滋春树碧连天",
        mode: "negative",
        bindingName: "word",
        lead: "正向索引从左往右。负向索引从右往左，最后一个永远是 -1。",
        examples: [
          { code: "word[0]", result: "风", note: "取开头。", pick: [0] },
          { code: "word[2]", result: "花", note: "取指定的一格。", pick: [2] },
          { code: "word[-1]", result: "天", note: "取最后一个，不用先数完再减 1。", pick: [14] },
          { code: "word[-2]", result: "连", note: "取倒数第二个。", pick: [13] },
          {
            code: "word[7]",
            result: "，",
            note: "逗号也占一格。len(word) 是 15，正向最后一个下标是 14。",
            pick: [7],
          },
        ],
      },
    },
    code: {
      initial:
        'word = "风送花香红满地，雨滋春树碧连天"\nprint(word[0])\nprint(word[2])\nprint(word[-1])\nprint(word[-2])\nprint(word[7])\nprint(len(word))',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-str-05",
    type: "explain",
    layout: "split",
    content: {
      headline: "切片",
      stringBoard: {
        word: "风送花香红满地，雨滋春树碧连天",
        mode: "slice",
        bindingName: "word",
        lead: "索引一次只拿一格。要一整句，就用切片连续取一段。word[start:end] 含 start，不含 end。",
        examples: [
          {
            code: "word[0:7]",
            result: "风送花香红满地",
            note: "含下标 0，不含下标 7。上联七个字，逗号不取。",
            pick: [0, 1, 2, 3, 4, 5, 6],
          },
          {
            code: "word[8:15]",
            result: "雨滋春树碧连天",
            note: "从下标 8 连续取到末尾，是下联。",
            pick: [8, 9, 10, 11, 12, 13, 14],
          },
          {
            code: "word[2:4]",
            result: "花香",
            note: "含下标 2，不含下标 4。下标 4 的「红」不取。",
            pick: [2, 3],
          },
        ],
      },
    },
    code: {
      initial:
        'word = "风送花香红满地，雨滋春树碧连天"\nprint(word[0:7])\nprint(word[8:15])\nprint(word[2:4])',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-str-step",
    type: "explain",
    layout: "split",
    content: {
      headline: "步长",
      stringBoard: {
        word: "风送花香红满地，雨滋春树碧连天",
        mode: "step",
        bindingName: "word",
        lead: "word[start:end:step]。step 为正，从左往右，这是正向切。step 是 2，每隔一个取一个。",
        examples: [
          {
            code: "word[0:7:1]",
            result: "风送花香红满地",
            note: "步长 1，一格挨着一格，就是连续切。",
          },
          {
            code: "word[0:7:2]",
            result: "风花红地",
            note: "步长 2，取下标 0、2、4、6。",
            pick: [0, 2, 4, 6],
          },
        ],
      },
    },
    code: {
      initial:
        'word = "风送花香红满地，雨滋春树碧连天"\nprint(word[0:7:1])\nprint(word[0:7:2])',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-str-reverse",
    type: "explain",
    layout: "split",
    content: {
      headline: "负步长",
      stringBoard: {
        word: "风送花香红满地，雨滋春树碧连天",
        mode: "reverse",
        bindingName: "word",
        lead: "step 为负，从右往左。起点放在右边，终点那一格仍然不取。",
        examples: [
          {
            code: "word[6::-1]",
            result: "地满红香花送风",
            note: "从上联末字「地」走到开头，上联倒过来。",
            pick: [6, 5, 4, 3, 2, 1, 0],
          },
          {
            code: "word[::-1]",
            result: "天连碧树春滋雨，地满红香花送风",
            note: "省略起点和终点，整句倒过来，仍是一副对联。",
          },
        ],
      },
    },
    code: {
      initial:
        'word = "风送花香红满地，雨滋春树碧连天"\nprint(word[6::-1])\nprint(word[::-1])',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-str-qufu",
    type: "run",
    layout: "split",
    content: {
      headline: "曲阜",
      codeBeats: {
        beforeRun: true,
        beats: [
          {
            line: "「曲阜」在第 0、1 格。含起点 0，不含终点 2。",
            code: 'campus = "曲阜师范大学计算机学院"\nprint(campus[0:2])',
          },
          {
            line: "起点就是 0。方括号左边可以空着，campus[:2] 和 campus[0:2] 一样。",
            code: 'campus = "曲阜师范大学计算机学院"\nprint(campus[0:2])\nprint(campus[:2])',
          },
          {
            line: "「计算机学院」从第 6 格一直到最后。终点可以不写 11。",
            code: 'campus = "曲阜师范大学计算机学院"\nprint(campus[0:2])\nprint(campus[:2])\nprint(campus[6:])',
          },
          {
            line: "「师范」从哪一格开始？找到下标后，两个字的终点比起点大 2。",
            code: 'campus = "曲阜师范大学计算机学院"\nprint(campus[0:2])\nprint(campus[:2])\nprint(campus[6:])\nstart = campus.find("师范")\nprint(start)\nprint(campus[start:start + 2])',
          },
        ],
      },
    },
    code: {
      initial: 'campus = "曲阜师范大学计算机学院"',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-str-find",
    type: "run",
    layout: "split",
    content: {
      headline: "查找",
      codeBeats: {
        beforeRun: true,
        beats: [
          {
            line: "「学」在不在这串里？一共有几个？",
            code: 'campus = "曲阜师范大学计算机学院"\nprint("学" in campus)\nprint(campus.count("学"))',
          },
          {
            line: "find 交回第一次出现的下标。这里是「大学」的学，下标是 5。",
            code: 'campus = "曲阜师范大学计算机学院"\nprint("学" in campus)\nprint(campus.count("学"))\nprint(campus.find("学"))',
          },
          {
            line: "学院的学从第 6 格再找，下标是 9。",
            code: 'campus = "曲阜师范大学计算机学院"\nprint("学" in campus)\nprint(campus.count("学"))\nprint(campus.find("学"))\nprint(campus.find("学", 6))',
          },
          {
            line: "没有「青岛」。in 交回 False，find 交回 -1。",
            code: 'campus = "曲阜师范大学计算机学院"\nprint("学" in campus)\nprint(campus.count("学"))\nprint(campus.find("学"))\nprint(campus.find("学", 6))\nprint("青岛" in campus)\nprint(campus.find("青岛"))',
          },
        ],
      },
    },
    code: {
      initial: 'campus = "曲阜师范大学计算机学院"',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-str-name",
    type: "predict",
    layout: "split",
    content: {
      headline: "空白",
      codeBeats: {
        beats: [
          {
            line: 'name[2:-2] 碰巧能切对。空白变成 " 李华   " 还对吗？',
            code: 'name = "  李华  "\nprint(name[2:-2] == "李华")\n\nname = " 李华   "\nprint(name[2:-2] == "李华")',
          },
          {
            line: "strip() 去掉两端空白之后，原来的 name 还在吗？",
            code: 'name = "  李华  "\nprint(name.strip() == "李华")\nprint(name)\n\nname = " 李华   "\nprint(name.strip() == "李华")',
          },
          {
            line: '"李 华".strip() 中间的空格还在吗？',
            code: 'name = "  李华  "\nprint(name.strip() == "李华")\nprint(name)\nprint("李 华".strip())',
          },
        ],
      },
    },
    code: {
      initial: 'name = "  李华  "\nprint(name == "李华")',
      editable: true,
      resetToInitial: true,
    },
    prediction: {
      question: 'print(name == "李华") 得到什么？',
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False", isCorrect: true },
      ],
    },
    reveal: {
      body: "空白也是字符。",
    },
  },
  {
    id: "scene-str-case",
    type: "predict",
    layout: "split",
    content: {
      headline: "大小写",
      codeBeats: {
        beats: [
          {
            line: "切片能把 Y 变成 y 吗？",
            code: 'answer = "YES"\nprint(answer[0])',
          },
          {
            line: 'answer.lower() == "yes" 吗？原来的 answer 还是 YES 吗？',
            code: 'answer = "YES"\nprint(answer.lower() == "yes")\nprint(answer)',
          },
          {
            line: "要收成大写呢？",
            code: 'answer = "YES"\nprint(answer.lower() == "yes")\nprint("yes".upper() == "YES")\nprint(answer)',
          },
        ],
      },
    },
    code: {
      initial: 'answer = "YES"\nprint(answer == "yes")',
      editable: true,
      resetToInitial: true,
    },
    prediction: {
      question: 'print(answer == "yes") 得到什么？',
      options: [
        { id: "true", label: "True" },
        { id: "false", label: "False", isCorrect: true },
      ],
    },
    reveal: {
      body: "大小写不同，就不相等。",
    },
  },
  {
    id: "scene-str-replace-keep",
    type: "run",
    layout: "split",
    content: {
      headline: "替换",
      question: 'intro[:7] + "Python" 得到什么？',
      codeBeats: {
        beforeRun: true,
        beats: [
          {
            line: 'intro[:7] 是 "I like "，接上 "Python" 得到 "I like Python"。',
            code: 'intro = "I like C"\nprint(intro[:7] + "Python")',
          },
          {
            line: '换成 "I really like C"，同一刀切出来的是 "I reallPython"。',
            code: 'intro = "I like C"\nprint(intro[:7] + "Python")\n\nintro = "I really like C"\nprint(intro[:7] + "Python")',
          },
          {
            line: "只写 replace，原来的 intro 还是 \"I like C\"。",
            code: 'intro = "I like C"\nintro.replace("C", "Python")\nprint(intro)',
          },
          {
            line: "要留下，就让名字 intro 改指向新串。",
            code: 'intro = "I like C"\nintro = intro.replace("C", "Python")\nprint(intro)',
          },
          {
            line: '"C and C" 里有两处 C，replace 都换掉。',
            code: 'intro = "I like C"\nintro = intro.replace("C", "Python")\nprint(intro)\nprint("C and C".replace("C", "Python"))',
          },
        ],
      },
    },
    code: {
      initial: 'intro = "I like C"',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-str-08",
    type: "predict",
    layout: "split",
    content: {
      headline: "改一格",
      codeBeats: {
        beats: [
          {
            line: '"J" + word[1:] 改到原来那一排了吗？',
            code: 'word = "Python"\nnew_word = "J" + word[1:]\nprint(word)\nprint(new_word)',
            fork: {
              keep: { name: "word", value: '"Python"' },
              created: { name: "new_word", value: '"Jython"' },
              rejectInPlace: "在原来那一排里面把 P 改成 J",
              close: "不能改其中一格。要留下新的一排，就用另一个名字指向它。",
            },
          },
        ],
      },
    },
    code: {
      initial: 'word = "Python"\nword[0] = "J"\nprint(word)',
      editable: true,
      resetToInitial: true,
    },
    prediction: {
      question: "运行之后会得到什么？",
      options: [
        { id: "jython", label: "Jython" },
        { id: "same", label: "Python" },
        { id: "typeerror", label: "TypeError", isCorrect: true },
      ],
    },
    reveal: {
      body: "能取出 word[0]，但不能给这一格换一个值。",
    },
  },
  {
    id: "scene-str-split",
    type: "run",
    layout: "split",
    content: {
      headline: "分词",
      question: "按位置能切出 I、like、C 吗？",
      codeBeats: {
        beforeRun: true,
        beats: [
          {
            line: "这三刀对的是 \"I like C\"：I、like、C。",
            code: 'intro = "I like C"\nprint(intro[0:1])\nprint(intro[2:6])\nprint(intro[7:8])',
          },
          {
            line: '换成 "I really like C"，同样的三刀变成 I、real、y。',
            code: 'intro = "I really like C"\nprint(intro[0:1])\nprint(intro[2:6])\nprint(intro[7:8])',
          },
          {
            line: "split() 按空白切开，交回一组词。intro 还是原来那一句。",
            code: 'intro = "I really like C"\nprint(intro.split())\nprint(intro)',
          },
        ],
      },
    },
    code: {
      initial: 'intro = "I like C"',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-str-join",
    type: "run",
    layout: "split",
    content: {
      headline: "拼接",
      question: "切开的词怎么再接成一句？",
      codeBeats: {
        beforeRun: true,
        beats: [
          {
            line: '词在 words 里。words.join(" ") 把方法写在词前面，运行会报错。',
            code: 'intro = "I really like C"\nwords = intro.split()\nprint(words.join(" "))',
          },
          {
            line: '分隔符写在前面：" ".join(words)。intro 还是原来那一句。',
            code: 'intro = "I really like C"\nwords = intro.split()\nprint(" ".join(words))\nprint(intro)',
          },
        ],
      },
    },
    code: {
      initial: 'intro = "I really like C"\nwords = intro.split()',
      editable: true,
      resetToInitial: true,
    },
  },
  {
    id: "scene-str-09",
    type: "predict",
    layout: "split",
    content: {
      headline: "键盘读入",
      codeBeats: {
        beats: [
          {
            line: "minutes * 1.5 能算吗？",
            code: 'minutes = input("骑了多少分钟：")\nprint(minutes)\nprint(type(minutes))\nprint(minutes * 1.5)',
          },
          {
            line: "怎么变成数字，再留下算钱？",
            code: 'minutes = "18"\nminutes = int(minutes)\nprice = 1.5\nprint(minutes * price)',
          },
        ],
      },
    },
    code: {
      initial: 'minutes = input("骑了多少分钟：")\nprint(minutes)\nprint(type(minutes))',
      editable: true,
      resetToInitial: true,
    },
    prediction: {
      question: "print(type(minutes))输出类型是？",
      options: [
        { id: "int", label: "int" },
        { id: "str", label: "str", isCorrect: true },
        { id: "float", label: "float" },
      ],
    },
  },
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
