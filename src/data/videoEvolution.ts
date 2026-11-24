import type { DraftScene } from '../../types/scene';

/**
 * 函数专题：依据用户提供的 13 节教学视频中可核对的屏幕代码案例整理。
 * 每一步是课程原有 run 场景，无独立播放器。少量示例为适应浏览器执行而简化，已在提示中标明。
 * 顺序遵从视频案例及对应知识块的推进顺序；可继续对照音频逐段细化讲稿。
 */
export const videoEvolutionByPart: Record<string, DraftScene[]> = {
  "fn-why": [
    {
      "id": "video-fn-why-01",
      "title": "演进 1 · 熟悉的调用：函数就在身边",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "回想我们已经会用哪些函数？",
        "body": "对比 input、print、len 和列表方法 append：以前在使用函数，现在要理解它。",
        "afterRunPoints": [
          "视频素材：70521825-1-208.mp4",
          "对比 input、print、len 和列表方法 append：以前在使用函数，现在要理解它。"
        ]
      },
      "code": {
        "initial": "name = input('请输入姓名：')\nprint(name)\nitems = [1, 2, 3]\nitems.append(4)\nprint(len(items))",
        "editable": true,
        "resetToInitial": true
      }
    },
    {
      "id": "video-fn-why-02",
      "title": "演进 2 · 函数名和调用",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "只写 len 与写 len(items) 有什么区别？",
        "body": "函数名引用函数对象；括号表示调用，括号内传入数据。",
        "afterRunPoints": [
          "视频素材：70521825-1-208.mp4",
          "函数名引用函数对象；括号表示调用，括号内传入数据。"
        ]
      },
      "code": {
        "initial": "items = [1, 2, 3]\nprint(len)\nprint(len(items))",
        "editable": true,
        "resetToInitial": true
      }
    },
    {
      "id": "video-fn-why-03",
      "title": "演进 3 · print 的可变行为",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "如果不想在输出内容之间插入空格呢？",
        "body": "同一函数只改变 sep、end 参数，输出行为就改变了。",
        "afterRunPoints": [
          "视频素材：70521825-1-208.mp4",
          "同一函数只改变 sep、end 参数，输出行为就改变了。"
        ]
      },
      "code": {
        "initial": "print('Hello', 'World', '!')\nprint('Hello', 'World', '!', sep='')\nprint('Hello', 'World', '!', sep='', end='')\nprint('=')",
        "editable": true,
        "resetToInitial": true
      }
    },
    {
      "id": "video-fn-why-04",
      "title": "演进 4 · 输出效果与返回值",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "能打印东西的函数，就一定返回打印的内容吗？",
        "body": "区分修改对象、在屏幕上打印，以及通过 return 返回的值。",
        "afterRunPoints": [
          "视频素材：70521825-1-208.mp4",
          "区分修改对象、在屏幕上打印，以及通过 return 返回的值。"
        ]
      },
      "code": {
        "initial": "items = [1, 2, 3]\na = len(items)\nb = items.append(4)\nprint(a)\nprint(b)\nprint(items)",
        "editable": true,
        "resetToInitial": true
      }
    }
  ],
  "fn-def": [
    {
      "id": "video-fn-def-01",
      "title": "演进 1 · 定义：先写功能",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "如果 Python 没有 say_hi()，我们能不能自己定义？",
        "body": "只执行 def 不会输出 Hello：定义不等于调用。",
        "afterRunPoints": [
          "视频素材：70521921-1-208.mp4",
          "只执行 def 不会输出 Hello：定义不等于调用。"
        ]
      },
      "code": {
        "initial": "def say_hi():\n    print('Hello')",
        "editable": true,
        "resetToInitial": true
      }
    },
    {
      "id": "video-fn-def-02",
      "title": "演进 2 · 调用：一次定义，多次使用",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "怎样让函数真正执行？",
        "body": "函数体在调用时执行；定义一次可多次使用。",
        "afterRunPoints": [
          "视频素材：70521921-1-208.mp4",
          "函数体在调用时执行；定义一次可多次使用。"
        ]
      },
      "code": {
        "initial": "def say_hi():\n    print('Hello')\n\nsay_hi()\nsay_hi()",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "Hello\nHello"
    },
    {
      "id": "video-fn-def-03",
      "title": "演进 3 · 组合：函数调用函数",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "good_morning 也要先输出 Hello，需要重复写吗？",
        "body": "将共同功能交给已有函数，调用结束后返回原来的函数。",
        "afterRunPoints": [
          "视频素材：70521921-1-208.mp4",
          "将共同功能交给已有函数，调用结束后返回原来的函数。"
        ]
      },
      "code": {
        "initial": "def say_hi():\n    print('Hello')\n\ndef good_morning():\n    say_hi()\n    print('Good morning')\n\ngood_morning()",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "Hello\nGood morning"
    },
    {
      "id": "video-fn-def-04",
      "title": "演进 4 · 先定义，后调用",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "两个函数的书写顺序能否调换？",
        "body": "真正调用 good_morning 时，say_hi 已经完成定义。",
        "afterRunPoints": [
          "视频素材：70521921-1-208.mp4",
          "真正调用 good_morning 时，say_hi 已经完成定义。"
        ]
      },
      "code": {
        "initial": "def good_morning():\n    say_hi()\n    print('Good morning')\n\ndef say_hi():\n    print('Hello')\n\ngood_morning()",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "Hello\nGood morning"
    },
    {
      "id": "video-fn-def-05",
      "title": "演进 5 · 固定横线：为什么需要参数",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "如果第二条横线要更长怎么办？",
        "body": "同一功能被复用，但输出长度被写死了。",
        "afterRunPoints": [
          "视频素材：70521960-1-208.mp4",
          "同一功能被复用，但输出长度被写死了。"
        ]
      },
      "code": {
        "initial": "def line():\n    print('-----')\n\nline()\nline()",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "-----\n-----"
    },
    {
      "id": "video-fn-def-06",
      "title": "演进 6 · 把长度变成参数",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "能不能让 line(5)、line(10) 表达不同需求？",
        "body": "先设计调用方式，再为变化的长度定义形参 width。",
        "afterRunPoints": [
          "视频素材：70521960-1-208.mp4",
          "先设计调用方式，再为变化的长度定义形参 width。"
        ]
      },
      "code": {
        "initial": "def line(width):\n    print('-' * width)\n\nline(5)\nline(10)",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "-----\n----------"
    },
    {
      "id": "video-fn-def-07",
      "title": "演进 7 · 把字符也变成参数",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "不仅长度，重复的字符也要变化呢？",
        "body": "共同逻辑是重复并打印，width 与 char 是两个变化因素。",
        "afterRunPoints": [
          "视频素材：70521960-1-208.mp4",
          "共同逻辑是重复并打印，width 与 char 是两个变化因素。"
        ]
      },
      "code": {
        "initial": "def line(width, char):\n    print(char * width)\n\nline(5, '-')\nline(10, '*')",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "-----\n**********"
    },
    {
      "id": "video-fn-def-08",
      "title": "演进 8 · 参数类型与函数说明",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "参数名叫 char，就能保证传入的是字符串吗？",
        "body": "类型注解不自动强制参数类型：两个整数仍会相乘得到 25。",
        "afterRunPoints": [
          "视频素材：70521960-1-208.mp4",
          "类型注解不自动强制参数类型：两个整数仍会相乘得到 25。"
        ]
      },
      "code": {
        "initial": "def line(width: int, char: str):\n    '''输出重复指定次数的内容。'''\n    print(char * width)\n\nline(5, 5)",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "25"
    },
    {
      "id": "video-fn-def-09",
      "title": "演进 9 · 先打印最大值",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "函数自己打印结果，调用处能拿到结果吗？",
        "body": "画面案例先打印 v；调用表达式获得的却是 None。",
        "afterRunPoints": [
          "视频素材：71081231-1-208.mp4",
          "画面案例先打印 v；调用表达式获得的却是 None。"
        ]
      },
      "code": {
        "initial": "def get_max(a, b):\n    if a > b:\n        v = a\n    else:\n        v = b\n    print(v)\n\nx = get_max(5, 8)\nprint(x)",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "8\nNone"
    },
    {
      "id": "video-fn-def-10",
      "title": "演进 10 · return 交回计算结果",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "如何让调用处真正取得较大值？",
        "body": "将 print(v) 改为 return v，结果才可以继续参与计算。",
        "afterRunPoints": [
          "视频素材：71081231-1-208.mp4",
          "将 print(v) 改为 return v，结果才可以继续参与计算。"
        ]
      },
      "code": {
        "initial": "def get_max(a, b):\n    if a > b:\n        v = a\n    else:\n        v = b\n    return v\n\nx = get_max(5, 8)\nprint(x)",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "8"
    },
    {
      "id": "video-fn-def-11",
      "title": "演进 11 · 一次返回多个结果",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "如果一次计算得到几个数据呢？",
        "body": "多个值以元组形式返回；调用处可保存或解包。",
        "afterRunPoints": [
          "视频素材：71081231-1-208.mp4",
          "多个值以元组形式返回；调用处可保存或解包。"
        ]
      },
      "code": {
        "initial": "def func(a, b):\n    return a + b, a - b, a * b\n\nresult = func(12, 9)\nprint(result)",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "(21, 3, 108)"
    }
  ],
  "fn-call": [
    {
      "id": "video-fn-call-01",
      "title": "演进 1 · 局部变量和同名变量",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "函数内部修改 i，外面的 i 会不会改变？",
        "body": "函数内赋值创建局部名称，不会改变外面的 i。",
        "afterRunPoints": [
          "视频素材：72110174-1-208.mp4",
          "函数内赋值创建局部名称，不会改变外面的 i。"
        ]
      },
      "code": {
        "initial": "i = 5\n\ndef f():\n    i = 0\n    print(i)\n\nf()\nprint(i)",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "0\n5"
    },
    {
      "id": "video-fn-call-02",
      "title": "演进 2 · global 修改外部绑定",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "如果确实需要改函数外的变量怎么办？",
        "body": "global 声明函数内部操作的是全局名称。",
        "afterRunPoints": [
          "视频素材：72110174-1-208.mp4",
          "global 声明函数内部操作的是全局名称。"
        ]
      },
      "code": {
        "initial": "i = 5\n\ndef f():\n    global i\n    i = 22\n\nf()\nprint(i)",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "22"
    },
    {
      "id": "video-fn-call-03",
      "title": "演进 3 · 函数中定义函数",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "函数体内部还能定义另一个函数吗？",
        "body": "内部函数可组织局部任务，定义后仍需调用。",
        "afterRunPoints": [
          "视频素材：86717077-1-208.mp4",
          "内部函数可组织局部任务，定义后仍需调用。"
        ]
      },
      "code": {
        "initial": "def outer():\n    def inner():\n        print('inner')\n    inner()\n\nouter()",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "inner"
    },
    {
      "id": "video-fn-call-04",
      "title": "演进 4 · 把内部函数返回出去",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "函数结束后，内部函数还能保存对外层变量的引用吗？",
        "body": "返回内部函数形成闭包；nonlocal 使闭包更新封闭作用域中的 count。",
        "afterRunPoints": [
          "视频素材：86717077-1-208.mp4",
          "返回内部函数形成闭包；nonlocal 使闭包更新封闭作用域中的 count。"
        ]
      },
      "code": {
        "initial": "def counting(count):\n    def next_count():\n        nonlocal count\n        count -= 1\n        return count\n    return next_count\n\nf = counting(5)\nprint(f())\nprint(f())",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "4\n3"
    }
  ],
  "fn-ext": [
    {
      "id": "video-fn-ext-01",
      "title": "演进 1 · 默认参数：可以省略的年龄",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "有的调用只提供姓名，能为年龄提供默认值吗？",
        "body": "默认值让调用者可以不传入某个参数。",
        "afterRunPoints": [
          "视频素材：72665639-1-208.mp4",
          "默认值让调用者可以不传入某个参数。"
        ]
      },
      "code": {
        "initial": "def f(name, age=0):\n    print('name =', name, ', age =', age)\n\nf('小明', 18)\nf('小红')",
        "editable": true,
        "resetToInitial": true
      }
    },
    {
      "id": "video-fn-ext-02",
      "title": "演进 2 · 位置与关键字对应",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "三个参数必须全部按位置填写吗？",
        "body": "关键字实参可以按名称明确指定对应形参。",
        "afterRunPoints": [
          "视频素材：72665639-1-208.mp4",
          "关键字实参可以按名称明确指定对应形参。"
        ]
      },
      "code": {
        "initial": "def f(a, b, c):\n    print(a, b, c)\n\nf(1, 2, 3)\nf(1, c=3, b=2)",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "1 2 3\n1 2 3"
    },
    {
      "id": "video-fn-ext-03",
      "title": "演进 3 · 默认值与关键字组合",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "当有默认值时，调用可以如何简化？",
        "body": "比较默认参数、位置参数和关键字参数三种使用方式。",
        "afterRunPoints": [
          "视频素材：72665639-1-208.mp4",
          "比较默认参数、位置参数和关键字参数三种使用方式。"
        ]
      },
      "code": {
        "initial": "def f(a, b=0, c=0):\n    print(a, b, c)\n\nf(1)\nf(1, c=5)\nf(1, b=2, c=3)",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "1 0 0\n1 0 5\n1 2 3"
    }
  ],
  "fn-varargs": [
    {
      "id": "video-fn-varargs-01",
      "title": "演进 1 · 从固定个数到任意个数",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "函数只定义三个形参，却需要传入五个数字怎么办？",
        "body": "固定的形参个数限制了可调用方式。",
        "afterRunPoints": [
          "视频素材：73010189-1-208.mp4",
          "固定的形参个数限制了可调用方式。"
        ]
      },
      "code": {
        "initial": "def get_sum(a, b, c):\n    return a + b + c\n\nprint(get_sum(4, 8, 2))",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "14"
    },
    {
      "id": "video-fn-varargs-02",
      "title": "演进 2 · *args 收集位置参数",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "希望函数接收任意个位置实参怎么办？",
        "body": "星号形参把多个位置实参收集成元组。",
        "afterRunPoints": [
          "视频素材：73010189-1-208.mp4",
          "星号形参把多个位置实参收集成元组。"
        ]
      },
      "code": {
        "initial": "def get_sum(*args):\n    print(args)\n    return sum(args)\n\nprint(get_sum(1, 2, 3, 4, 5))",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "(1, 2, 3, 4, 5)\n15"
    },
    {
      "id": "video-fn-varargs-03",
      "title": "演进 3 · 普通参数与 *args 混用",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "固定参数和剩余位置实参可以一起接收吗？",
        "body": "前两个位置实参绑定 a、b，剩余实参进入 args 元组。",
        "afterRunPoints": [
          "视频素材：73010189-1-208.mp4",
          "前两个位置实参绑定 a、b，剩余实参进入 args 元组。"
        ]
      },
      "code": {
        "initial": "def f(a, b, *args):\n    print(a)\n    print(b)\n    print(args)\n\nf('hello', 1, 2, 3)",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "hello\n1\n(2, 3)"
    },
    {
      "id": "video-fn-varargs-04",
      "title": "演进 4 · **kwargs 收集关键字实参",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "关键字的名称和数量不确定怎么办？",
        "body": "两个星号收集额外的关键字实参，形成字典。",
        "afterRunPoints": [
          "视频素材：79817899-1-208.mp4",
          "两个星号收集额外的关键字实参，形成字典。"
        ]
      },
      "code": {
        "initial": "def f(**kwargs):\n    print(kwargs)\n\nf(a=1, b=2, c=3)",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "{'a': 1, 'b': 2, 'c': 3}"
    },
    {
      "id": "video-fn-varargs-05",
      "title": "演进 5 · 按键和值遍历 kwargs",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "怎样逐项处理收到的关键字实参？",
        "body": "对 kwargs 使用字典的 items() 遍历名称和值。",
        "afterRunPoints": [
          "视频素材：79817899-1-208.mp4",
          "对 kwargs 使用字典的 items() 遍历名称和值。"
        ]
      },
      "code": {
        "initial": "def f(**kwargs):\n    for k, v in kwargs.items():\n        print(k, v)\n\nf(a=1, b=2, c=3)",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "a 1\nb 2\nc 3"
    },
    {
      "id": "video-fn-varargs-06",
      "title": "演进 6 · 组合普通参数、*args、**kwargs",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "一个函数可以接收这三类参数吗？",
        "body": "先绑定固定位置参数，剩余位置实参和关键字实参分别收集。",
        "afterRunPoints": [
          "视频素材：79817899-1-208.mp4",
          "先绑定固定位置参数，剩余位置实参和关键字实参分别收集。"
        ]
      },
      "code": {
        "initial": "def f(a, b, *args, **kwargs):\n    print(a, b)\n    print(args)\n    print(kwargs)\n\nf(1, 2, 3, 4, k='hi')",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "1 2\n(3, 4)\n{'k': 'hi'}"
    }
  ],
  "fn-unpack": [
    {
      "id": "video-fn-unpack-01",
      "title": "演进 1 · 返回多个值与解包",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "函数返回三个数据，怎样分别接住？",
        "body": "返回的是元组，可以通过多变量赋值解包。",
        "afterRunPoints": [
          "视频素材：79818004-1-208.mp4",
          "返回的是元组，可以通过多变量赋值解包。"
        ]
      },
      "code": {
        "initial": "def f():\n    return 1, 2, 3\n\nx, y, z = f()\nprint(x, y, z)",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "1 2 3"
    },
    {
      "id": "video-fn-unpack-02",
      "title": "演进 2 · 星号解包剩余元素",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "如果元素个数超过变量个数怎么办？",
        "body": "带星号的目标接住剩余元素，并保存为列表。",
        "afterRunPoints": [
          "视频素材：79818004-1-208.mp4",
          "带星号的目标接住剩余元素，并保存为列表。"
        ]
      },
      "code": {
        "initial": "a, b, *c, d = (1, 2, 3, 4, 5, 6)\nprint(a)\nprint(b)\nprint(c)\nprint(d)",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "1\n2\n[3, 4, 5]\n6"
    },
    {
      "id": "video-fn-unpack-03",
      "title": "演进 3 · 实参解包：传入整个列表",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "已有列表时，如何把其中的元素当成单独的实参？",
        "body": "函数调用里的 * 将序列展开为位置实参。",
        "afterRunPoints": [
          "视频素材：79818004-1-208.mp4",
          "函数调用里的 * 将序列展开为位置实参。"
        ]
      },
      "code": {
        "initial": "def f(a, b, c):\n    print(a, b, c, sep='-')\n\nnums = [1, 2, 3]\nf(*nums)",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "1-2-3"
    }
  ],
  "fn-fnarg": [
    {
      "id": "video-fn-fnarg-01",
      "title": "演进 1 · 函数对象：不加括号意味着什么",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "给 print 传入 f 与 f() 是一回事吗？",
        "body": "函数本身是对象，可以保存和传递；加括号才执行函数。",
        "afterRunPoints": [
          "视频素材：79818095-1-208.mp4",
          "函数本身是对象，可以保存和传递；加括号才执行函数。"
        ]
      },
      "code": {
        "initial": "def f():\n    print('f 被调用')\n\nprint(f)\nf()",
        "editable": true,
        "resetToInitial": true
      }
    },
    {
      "id": "video-fn-fnarg-02",
      "title": "演进 2 · 将函数交给另一个函数",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "计时结束后要做什么，能不能由调用者决定？",
        "body": "保留视频中 timer(时长, 回调函数) 的调用思想；课堂版不做真实计时。",
        "afterRunPoints": [
          "视频素材：79818095-1-208.mp4",
          "保留视频中 timer(时长, 回调函数) 的调用思想；课堂版不做真实计时。"
        ]
      },
      "code": {
        "initial": "def finished():\n    print('时间到了')\n\ndef timer(seconds, callback):\n    print('等待', seconds, '秒（课堂演示）')\n    callback()\n\ntimer(2, finished)",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "等待 2 秒（课堂演示）\n时间到了"
    }
  ],
  "fn-higher": [
    {
      "id": "video-fn-higher-01",
      "title": "演进 1 · 把变换规则交给函数",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "希望对列表每个元素应用相同处理，规则如何传入？",
        "body": "map_list 不规定具体如何变换，而是调用传入的函数 fn。",
        "afterRunPoints": [
          "视频素材：86717146-1-208.mp4",
          "map_list 不规定具体如何变换，而是调用传入的函数 fn。"
        ]
      },
      "code": {
        "initial": "def double(x):\n    return x * 2\n\ndef map_list(fn, items):\n    result = []\n    for item in items:\n        result.append(fn(item))\n    return result\n\nprint(map_list(double, [1, 2, 3, 4]))",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "[2, 4, 6, 8]"
    },
    {
      "id": "video-fn-higher-02",
      "title": "演进 2 · 变换规则可以更换",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "如果只想保留满足条件的结果呢？",
        "body": "同一函数可以接受不同的规则；这里用匿名函数表达简单规则。",
        "afterRunPoints": [
          "视频素材：86717146-1-208.mp4",
          "同一函数可以接受不同的规则；这里用匿名函数表达简单规则。"
        ]
      },
      "code": {
        "initial": "def map_list(fn, items):\n    result = []\n    for item in items:\n        result.append(fn(item))\n    return result\n\nprint(map_list(lambda x: x * 2, [1, 2, 3, 4]))",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "[2, 4, 6, 8]"
    }
  ],
  "fn-lambda": [
    {
      "id": "video-fn-lambda-01",
      "title": "演进 1 · 普通函数与匿名函数",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "只做一个简单的乘法，也必须专门命名函数吗？",
        "body": "先观察常规函数中只有一个表达式的返回过程。",
        "afterRunPoints": [
          "视频素材：86717146-1-208.mp4",
          "先观察常规函数中只有一个表达式的返回过程。"
        ]
      },
      "code": {
        "initial": "def f(x):\n    return x * 2\n\nprint(f(3))",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "6"
    },
    {
      "id": "video-fn-lambda-02",
      "title": "演进 2 · lambda 表达一个简单计算",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "同一逻辑能写成一个表达式吗？",
        "body": "lambda 创建函数对象，可用于简短的表达式计算。",
        "afterRunPoints": [
          "视频素材：86717146-1-208.mp4",
          "lambda 创建函数对象，可用于简短的表达式计算。"
        ]
      },
      "code": {
        "initial": "a = lambda x: x * 2\nprint(a(3))\nprint(type(a))",
        "editable": true,
        "resetToInitial": true
      }
    }
  ],
  "fn-recur": [
    {
      "id": "video-fn-recur-01",
      "title": "演进 1 · 自己调用自己会怎样",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "函数在内部再次调用自己，什么时候停止？",
        "body": "视频先通过函数自调用提出问题；课堂先预测，避免直接触发无限递归。",
        "afterRunPoints": [
          "视频素材：86717187-1-208.mp4",
          "视频先通过函数自调用提出问题；课堂先预测，避免直接触发无限递归。"
        ]
      },
      "code": {
        "initial": "def f():\n    f()\n\n# 不直接调用：否则没有终止条件，会不断递归\nprint('需要终止条件')",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "需要终止条件"
    },
    {
      "id": "video-fn-recur-02",
      "title": "演进 2 · 用递归计算阶乘",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "如何描述 n! 和 (n-1)! 的关系？",
        "body": "递归表达问题的自相似结构，i==1 提供终止条件。",
        "afterRunPoints": [
          "视频素材：86717187-1-208.mp4",
          "递归表达问题的自相似结构，i==1 提供终止条件。"
        ]
      },
      "code": {
        "initial": "def f(i):\n    if i == 1:\n        return 1\n    return f(i - 1) * i\n\nprint(f(3))",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "6"
    },
    {
      "id": "video-fn-recur-03",
      "title": "演进 3 · 递归与常规循环比较",
      "type": "run",
      "layout": "split",
      "editorSide": "left",
      "content": {
        "headline": "同一个阶乘问题除了递归还可以怎样做？",
        "body": "这里是依据课堂需求增加的拓展对照，并非原视频原始代码。",
        "afterRunPoints": [
          "视频素材：86717187-1-208.mp4",
          "这里是依据课堂需求增加的拓展对照，并非原视频原始代码。"
        ]
      },
      "code": {
        "initial": "def factorial(n):\n    result = 1\n    for i in range(2, n + 1):\n        result *= i\n    return result\n\nprint(factorial(3))",
        "editable": true,
        "resetToInitial": true
      },
      "expectedOutput": "6"
    }
  ]
};
