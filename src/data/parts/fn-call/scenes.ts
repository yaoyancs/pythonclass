import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 第五部分：多函数嵌套调用协作、局部与全局作用域、不可变对象与可变列表的参数传递机制，以及可变默认参数避坑。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-call-compose",
    title: "多函数协作：一个函数调用另一个函数",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "小函数各管一事，主流程函数串联组装",
      flowDiagram: [
        "run_equal_round(total, members)",
        "  ├── valid_budget(total, n)    # 1. 先核验金额",
        "  ├── make_equal(total, n)      # 2. 生成红包池",
        "  └── find_lucky_king(records)  # 3. 统计手气最佳",
      ],
      body: "真实程序很少把几百行代码塞进同一个函数，而是拆成职责单一的小函数，再由上层函数按业务步骤依次调用。",
    },
    code: code(`def valid_budget(total, count):
    return count >= 1 and count * 0.01 <= total <= 200

def make_equal(total, count):
    each = round(total / count, 2)
    return [each] * count

def run_equal_round(total, members):
    if not valid_budget(total, len(members)):
        print("发包失败：金额不符合规则")
        return
    pool = make_equal(total, len(members))
    for name in members:
        print(f"{name} 抢到 {pool.pop()} 元")

run_equal_round(20, ["小明", "小红", "小刚", "小美"])`),
    expectedOutput: `小明 抢到 5.0 元
小红 抢到 5.0 元
小刚 抢到 5.0 元
小美 抢到 5.0 元`,
  },
  {
    id: "fn-call-local",
    title: "局部变量：函数内部的独立工作间",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "函数内创建的变量，出了函数就自动销毁",
      image: {
        src: "/lesson08/rp-scope.svg",
        alt: "全局作用域与函数局部作用域隔离示意图",
      },
      body: "make_equal 内部定义了临时变量 each 来存放每包金额。函数调用结束后，在外部直接 print(each) 会怎样？",
    },
    code: code(`def make_equal(total, count):
    each = round(total / count, 2)
    return [each] * count

pool = make_equal(20, 4)
print("红包池:", pool)
print("单包金额:", each)`),
    prediction: {
      question: "最后一行 print(\"单包金额:\", each) 的运行结果是？",
      options: [
        { id: "val", label: "单包金额: 5.0" },
        { id: "none", label: "单包金额: None" },
        { id: "err", label: "报 NameError（名字 each 未定义）", isCorrect: true },
      ],
    },
    reveal: {
      title: "局部变量只在函数执行期间存活",
      body: "形参（total, count）和函数内赋值的变量（each）都属于局部作用域。这样不同函数内部就算都用 each、i 等名字也互不冲突；想把结果传出来，必须靠 return。",
    },
  },
  {
    id: "fn-call-read",
    title: "全局变量：函数内部直接读取全局常量",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "顶层定义的变量，函数内部可直接读取",
      body: "定义在所有函数外面的变量称为全局变量。工程上常把全程序共享的业务规则（如最低 0.01 元、单次上限 200 元）写成大写全局常量，供各个函数读取。",
    },
    code: code(`MIN_UNIT = 0.01
MAX_TOTAL = 200

def valid_budget(total, count):
    # 只读取全局常量，无需任何额外声明
    return count * MIN_UNIT <= total <= MAX_TOTAL

print("20 元发 4 包:", valid_budget(20, 4))
print("250 元发 4 包:", valid_budget(250, 4))`),
    expectedOutput: `20 元发 4 包: True
250 元发 4 包: False`,
  },
  {
    id: "fn-call-shadow",
    title: "同名变量遮蔽：函数内赋值默认新建局部变量",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "函数内对同名变量赋值，不会改动外面的全局变量",
      body: "全局上限 MAX_TOTAL 是 200。festival_check 函数内部写了一行 MAX_TOTAL = 500（节日临时额度），运行后外面的 MAX_TOTAL 会变吗？",
    },
    code: code(`MAX_TOTAL = 200

def festival_check(total):
    MAX_TOTAL = 500
    return total <= MAX_TOTAL

print(festival_check(300))
print("全局上限:", MAX_TOTAL)`),
    prediction: {
      question: "两行 print 的输出依次是什么？",
      options: [
        { id: "t500", label: "True 和 全局上限: 500" },
        { id: "t200", label: "True 和 全局上限: 200", isCorrect: true },
        { id: "f200", label: "False 和 全局上限: 200" },
      ],
    },
    reveal: {
      title: "函数内的 MAX_TOTAL = 500 只在局部生效",
      body: "只要函数内出现了对某名字的赋值语句，Python 就将该名字视为当前函数的局部变量，不会覆盖外面的全局 MAX_TOTAL。",
    },
  },
  {
    id: "fn-call-global",
    title: "global 关键字与作用域工程准则",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "少用 global 暗改外部状态，优先「参数进、return 出」",
      bulletPoints: [
        "注意：若函数内对同名变量既有读取又有赋值（如先 print 再赋值），因整段被视为局部变量，赋值前读取会报 UnboundLocalError",
        "语法：确实要在函数内修改全局变量，需在开头声明 global 变量名",
        "规范：到处用 global 会让变量被谁改过难以追踪；推荐把旧值作为参数传入，用 return 交回新值",
      ],
    },
    code: code(`sent_rounds = 0

# 方式 A：使用 global 修改全局变量（仅在确有必要时使用）
def mark_round():
    global sent_rounds
    sent_rounds += 1

mark_round()
print("已发轮数:", sent_rounds)

# 方式 B（更推荐）：参数传入旧值，return 返回新值
def add_round(current):
    return current + 1

sent_rounds = add_round(sent_rounds)
print("推荐写法更新后:", sent_rounds)`),
    expectedOutput: `已发轮数: 1
推荐写法更新后: 2`,
  },
  {
    id: "fn-call-rebind",
    title: "参数传递 ①：数字与字符串重新赋值不影响外部",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "给形参重新赋新值，不会改变调用方的变量",
      body: "小明钱包里有 balance = 100 元，发了 20 元红包。spend 函数里写了 wallet = wallet - cost，外面的 balance 变成 80 了吗？",
    },
    code: code(`def spend(wallet, cost):
    wallet = wallet - cost
    return wallet

balance = 100
print("函数返回:", spend(balance, 20))
print("外部 balance:", balance)`),
    prediction: {
      question: "两行输出中的金额依次是多少？",
      options: [
        { id: "80-80", label: "80 和 80" },
        { id: "80-100", label: "80 和 100", isCorrect: true },
        { id: "100-100", label: "100 和 100" },
      ],
    },
    reveal: {
      title: "重新赋值只是让局部变量 wallet 指向新整数 80",
      body: "整数、浮点数、字符串、元组都是不可变对象。外部若要更新余额，应写成 balance = spend(balance, 20) 接住返回值。",
    },
  },
  {
    id: "fn-call-alias",
    title: "参数传递 ②：可变列表传入后原地修改会影响外部",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      stepRun: true,
      headline: "形参和实参指向同一个列表，pop / append 直接改原对象",
      body: "点「下一步」观察内存：把红包池列表 pool 传给 grab_packet 后，函数内执行 packets.pop()，外面的 pool 也同步少了一项！若不想改坏原列表，调用时可传入 pool.copy()。",
    },
    code: code(`def grab_packet(packets):
    if len(packets) == 0:
        return 0.0
    return packets.pop()

pool = [3.28, 8.66, 6.64]
first = grab_packet(pool)
second = grab_packet(pool)
print("抢走两包后剩余:", pool)`),
    expectedOutput: "抢走两包后剩余: [3.28]",
  },
  {
    id: "fn-call-default-fix",
    title: "经典避坑：默认参数不要直接写可变列表 []",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "默认参数用 None 占位，在函数体内新建空列表",
      body: "默认值表达式在 def 定义时只创建一次！左侧函数用 history=[] 当默认值，结果第二轮发红包居然把第一轮的旧记录也带进来了。请用 None 修复它。",
    },
    code: code(`def add_log(name, money, history=[]):
    history.append(f"{name}:{money}")
    return history

# 期望两轮各自独立建立新账单，互不串数据
print("第 1 轮:", add_log("小明", 5.20))
print("第 2 轮:", add_log("小红", 8.88))`),
    hints: [
      { level: 1, text: "不能把 [] 直接写在形参默认值里，否则两次调用共用同一个列表对象。" },
      { level: 2, text: "把形参改为 history=None；函数体第一行加 if history is None: history = []。" },
      {
        level: 3,
        text: `def add_log(name, money, history=None):
    if history is None:
        history = []
    history.append(f"{name}:{money}")
    return history

print("第 1 轮:", add_log("小明", 5.20))
print("第 2 轮:", add_log("小红", 8.88))`,
      },
    ],
    reveal: {
      title: "None 占位是 Python 工程标准惯用法",
      body: "当默认参数需要是列表、字典或集合等可变容器时，一律写成 param=None，进入函数后再新建空容器，彻底杜绝跨次调用串数据。",
    },
    expectedOutput: `第 1 轮: ['小明:5.2']
第 2 轮: ['小红:8.88']`,
  },
];
