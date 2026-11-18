import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 第二部分：解剖函数定义五要素、调用执行时机、文档字符串说明书与 help()、命名陷阱，最后完成红包系统的第 1 个核心核验函数。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-def-shape",
    title: "自定义函数的语法结构",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "函数定义五要素",
      image: {
        src: "/lesson08/rp-anatomy.svg",
        alt: "函数定义五要素解剖图：def、函数名与参数、冒号、文档字符串、缩进函数体与return",
      },
      body: "定义一个函数就像制作一台专用工具机：函数头声明名字和输入口，缩进块规定内部加工步骤。",
      bulletPoints: [
        "函数头：以关键字 def 开头，后接函数名、圆括号 (参数列表) 和英文冒号 :",
        "函数体：冒号下方整体缩进 4 个空格的所有语句；缩进结束即代表函数定义结束",
        "可选成员：第一行的三引号「文档字符串」用于写说明书；return 用于把计算结果交回",
      ],
    },
  },
  {
    id: "fn-def-when",
    title: "定义时不执行，调用时才执行",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "只写 def 不调用，函数体一行都不会跑",
      body: "观察左侧代码：定义了发红包提示函数 send_notice()，但后面只写了一行普通 print。",
    },
    code: code(`def send_notice():
    print("🧧 有人发了一个大红包！")
    print("快去群里抢！")

print("群聊已打开")`),
    prediction: {
      question: "运行这段代码，屏幕会输出什么？",
      options: [
        { id: "all", label: "先输出两行红包提示，再输出「群聊已打开」" },
        { id: "only-open", label: "只输出「群聊已打开」", isCorrect: true },
        { id: "only-fn", label: "只输出两行红包提示" },
      ],
    },
    reveal: {
      title: "def 只是注册工具，加括号调用才触发执行",
      body: "执行 def 时，Python 只把函数体打包存起来并绑定到名字 send_notice 上；没有写 send_notice() 调用，里面的语句不会运行。",
    },
  },
  {
    id: "fn-def-order",
    title: "调用顺序：先定义，后调用",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "Python 从上往下执行，调用前名字必须已定义",
      body: "左侧代码试图在 def 之前调用 send_notice()，先运行观察报错，再调整代码顺序修复它。",
    },
    code: code(`send_notice("恭喜发财，大吉大利")

def send_notice(wish):
    print(f"🧧 [微信红包] {wish}")`),
    hints: [
      { level: 1, text: "报错为 NameError: name 'send_notice' is not defined——执行第 1 行时解释器还不认识这个名字。" },
      { level: 2, text: "把 def send_notice(wish): 整段定义挪到调用语句之前。" },
      {
        level: 3,
        text: `def send_notice(wish):
    print(f"🧧 [微信红包] {wish}")

send_notice("恭喜发财，大吉大利")`,
      },
    ],
    reveal: {
      title: "先造工具，再使用工具",
      body: "Python 按从上到下的顺序逐行执行，必须先执行完 def 完成函数绑定，后面才能调用它。",
    },
    expectedOutput: "🧧 [微信红包] 恭喜发财，大吉大利",
  },
  {
    id: "fn-def-syntax",
    title: "语法排错：冒号与函数体缩进",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "函数头末尾要有冒号，函数体必须缩进",
      body: "左侧代码存在两处初学者最常犯的语法错误，请根据报错信息逐一修正。",
    },
    code: code(`def send_notice(wish)
print(f"🧧 [微信红包] {wish}")

send_notice("万事如意")`),
    hints: [
      { level: 1, text: "第 1 行 def 函数头末尾漏掉了英文冒号 :。" },
      { level: 2, text: "第 2 行属于函数体，必须向右缩进 4 个空格；第 4 行是外部调用，顶格不缩进。" },
      {
        level: 3,
        text: `def send_notice(wish):
    print(f"🧧 [微信红包] {wish}")

send_notice("万事如意")`,
      },
    ],
    reveal: {
      title: "缩进划定了函数的边界",
      body: "缩进在 def 下方的语句属于函数内部；一旦恢复顶格对齐（如第 4 行），就代表回到了函数外部。",
    },
    expectedOutput: "🧧 [微信红包] 万事如意",
  },
  {
    id: "fn-def-doc",
    title: "文档字符串：函数的官方说明书",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "三引号写说明书，随时用 help() 查阅",
      body: "紧跟在 def 下一行缩进的 \"\"\"三引号字符串\"\"\" 叫做文档字符串（Docstring），用来向调用者说明「函数做什么、参数是什么、返回什么」。",
      compareTable: {
        leftHeader: "对比项",
        rightHeader: "作用与运行期表现",
        rows: [
          { left: "# 普通注释", right: "写给改源码的人看，解释器运行时直接忽略，外部查不到" },
          { left: '"""文档字符串"""', right: "绑定在函数对象上，可用 help(函数名) 打印说明书，编辑器悬停也会自动提示" },
        ],
      },
    },
    code: code(`def show_wish(sender, wish):
    """打印微信群红包的发包人与祝福语卡片。
    参数：sender 为发包人姓名，wish 为红包祝福语。
    """
    print(f"{sender} 发出的红包：{wish}")

# 查看函数的官方说明书
help(show_wish)

# 正常调用函数
show_wish("班长", "期末全过！")`),
  },
  {
    id: "fn-def-name",
    title: "命名规范与误盖内置函数陷阱",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "小写加下划线，切勿占用内置函数名",
      bulletPoints: [
        "规范写法：使用小写字母与下划线（如 check_budget、split_lucky），动词开头、见名知义",
        "高频大坑：如果把变量或函数起名叫 sum、max、min、list，就会把同名内置函数覆盖掉！",
      ],
    },
    code: code(`# 错误示范：用 sum 当普通变量存上一轮金额
sum = 10
print("上一轮抢到:", sum)

# 这一轮想调用内置函数 sum() 求和，看看会发生什么？
amounts = [3.28, 6.72]
print("本轮总额:", sum(amounts))`),
    hints: [
      { level: 1, text: "报错 TypeError: 'int' object is not callable——因为当前名字 sum 已经指向整数 10，不再是求和函数了！" },
      { level: 2, text: "把第 2、3 行的变量名 sum 改成不冲突的名字（如 last_money）。" },
      {
        level: 3,
        text: `last_money = 10
print("上一轮抢到:", last_money)

amounts = [3.28, 6.72]
print("本轮总额:", sum(amounts))`,
      },
    ],
    reveal: {
      title: "函数名也是普通名字，被重新赋值就会失去原功能",
      body: "内置函数名并不是语法保留字。一旦执行了 sum = 10，名字 sum 就改指整数 10，后面写 sum(amounts) 相当于写 10(amounts)，自然报错不可调用。",
    },
    expectedOutput: `上一轮抢到: 10
本轮总额: 10.0`,
  },
  {
    id: "fn-def-practice",
    title: "实战练习：红包发包核验函数",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "模块组件 ①：check_budget(total, count)",
      body: "发微信群红包前，系统必须先核验金额是否合规：每个红包至少要有 0.01 元，且单次发包总额不超过 200 元。请编写核验函数并测试三种情况：",
      bulletPoints: [
        "若 total < count * 0.01：打印「金额不足：每人至少 0.01 元」",
        "若 total > 200：打印「超额提醒：单次不超过 200 元」",
        "其余合规情况：打印「核验通过：共 {count} 包，总额 {total} 元」",
        "依次调用 check_budget(0.03, 5)、check_budget(250, 5)、check_budget(20, 4)",
      ],
    },
    code: code(`# 请定义 check_budget(total, count)，建议写上一句文档字符串


# 依次测试三种发包输入
check_budget(0.03, 5)
check_budget(250, 5)
check_budget(20, 4)`),
    hints: [
      { level: 1, text: "函数头写成 def check_budget(total, count):，内部用 if - elif - else 判断三种情况。" },
      { level: 2, text: "先判断 total < count * 0.01，再 elif total > 200，最后 else 打印核验通过信息。" },
      {
        level: 3,
        text: `def check_budget(total, count):
    """核验群红包总金额与个数是否符合发包规则"""
    if total < count * 0.01:
        print("金额不足：每人至少 0.01 元")
    elif total > 200:
        print("超额提醒：单次不超过 200 元")
    else:
        print(f"核验通过：共 {count} 包，总额 {total} 元")

check_budget(0.03, 5)
check_budget(250, 5)
check_budget(20, 4)`,
      },
    ],
    reveal: {
      title: "对照：综合系统的第一块积木",
      body: "0.03 元不够分给 5 个人（至少需 0.05 元），250 元超出上限，20 元发 4 包顺利通过。这个函数在最终的综合红包程序里将直接负责发包前拦截非法输入。",
    },
    expectedOutput: `金额不足：每人至少 0.01 元
超额提醒：单次不超过 200 元
核验通过：共 4 包，总额 20 元`,
  },
];
