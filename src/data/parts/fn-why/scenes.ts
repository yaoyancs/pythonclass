import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 第一部分：从早已用过的内置函数出发，给出内置函数全景分类表与组合实操，再由三轮微信群红包的重复统计引出自定义函数。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-why-used",
    title: "认识函数：早已用过的工具",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "给它输入数据，它完成特定工作",
      body: "从第 1 讲起我们就在使用 Python 自带的函数：把数据放进圆括号交给它，就能直接完成统计、换算或打印。",
      bulletPoints: [
        "len(amounts)：数出这一轮共有几个红包",
        "sum(amounts)：算出所有红包的总金额",
        "max(amounts) / min(amounts)：找出手气最佳与手气最差",
        "round(数值, 2)：四舍五入保留 2 位小数",
      ],
    },
    code: code(`# 宿舍群刚抢完一轮红包（单位：元）
amounts = [3.28, 8.66, 1.42, 6.64]

print("红包个数:", len(amounts))
print("红包总额:", sum(amounts))
print("手气最佳:", max(amounts))
print("手气最差:", min(amounts))
print("平均每包:", round(sum(amounts) / len(amounts), 2))`),
    expectedOutput: `红包个数: 4
红包总额: 20.0
手气最佳: 8.66
手气最差: 1.42
平均每包: 5.0`,
  },
  {
    id: "fn-why-builtin",
    title: "Python 内置函数全景速查",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "Python 内置函数分类速查",
      body: "Python 3 解释器内置了约 70 个开箱即用的函数，无需额外配置即可直接调用。日常编程最常用的集中在以下五大类：",
      gridTable: {
        headers: ["功能分类", "常用内置函数", "核心用途与示例"],
        rows: [
          ["输入与输出", "print()、input()", "print(x) 屏幕打印；input('提示') 读取键盘输入并返回 str"],
          ["类型与容器", "int()、float()、str()、bool()、list()、tuple()、dict()、set()", "转换数据类型（如 int('5')），或构造与转换四大容器"],
          ["数学与统计", "len()、sum()、max()、min()、abs()、round()、pow()、divmod()", "元素个数、求和、最值、绝对值、round(x,2) 保留小数、divmod 商和余数"],
          ["序列与遍历", "range()、sorted()、reversed()、enumerate()、zip()、all()、any()", "整数序列、sorted 排序返回新列表、enumerate 带序号遍历、zip 配对"],
          ["自省与编码", "type()、id()、help()、ord()、chr()、bin()、hex()", "type 查类型、id 查对象标识、help 查函数说明书、字符编码与进制转换"],
        ],
      },
    },
  },
  {
    id: "fn-why-builtin-combo",
    title: "组合使用内置函数",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "几个内置函数配合，快速排出手气榜",
      body: "内置函数可以嵌套或串联搭配：先排序、再带名次遍历，最后算最高与最低的差值。",
      bulletPoints: [
        "sorted(amounts, reverse=True)：从大到小排好新列表，原列表不变",
        "enumerate(列表, 1)：从 1 开始自动生成名次编号",
        "abs(a - b)：求两个金额相差多少，无需关心谁减谁",
      ],
    },
    code: code(`amounts = [3.28, 8.66, 1.42, 6.64]

ranking = sorted(amounts, reverse=True)
for rank, money in enumerate(ranking, 1):
    print(f"第 {rank} 名：{money} 元")

gap = round(abs(amounts[0] - amounts[1]), 2)
print("前两人相差:", gap, "元")`),
    expectedOutput: `第 1 名：8.66 元
第 2 名：6.64 元
第 3 名：3.28 元
第 4 名：1.42 元
前两人相差: 5.38 元`,
  },
  {
    id: "fn-why-repeat",
    title: "痛点：多轮红包重复写三遍",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "同一套统计播报逻辑，三个群抄了三遍",
      body: "跨年夜宿舍群、班级群、家庭群各抢了一轮红包。内置函数能算单步的 len、sum、max，但「汇总并按固定格式播报战况」这一整套步骤没有现成内置函数。",
      bulletPoints: [
        "代码冗余：每多一个群，就要把同样的 3 行代码再复制粘贴一遍",
        "难以维护：一旦播报格式要调整（例如补上最低金额），每一处都得手工同步改，极易漏改出错",
      ],
    },
    code: code(`r1 = [3.28, 8.66, 1.42, 6.64]
r2 = [12.50, 5.20, 18.80, 13.50]
r3 = [1.08, 6.66, 2.26]

total1 = round(sum(r1), 2)
print(f"宿舍群：共 {len(r1)} 包，总额 {total1} 元，最高 {max(r1)} 元")

total2 = round(sum(r2), 2)
print(f"班级群：共 {len(r2)} 包，总额 {total2} 元，最高 {max(r2)} 元")

total3 = round(sum(r3), 2)
print(f"家庭群：共 {len(r3)} 包，总额 {total3} 元，最高 {max(r3)} 元")`),
    expectedOutput: `宿舍群：共 4 包，总额 20.0 元，最高 8.66 元
班级群：共 4 包，总额 50.0 元，最高 18.8 元
家庭群：共 3 包，总额 10.0 元，最高 6.66 元`,
  },
  {
    id: "fn-why-def",
    title: "破局：封装成自定义函数",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "把重复步骤打包命名，随用随调",
      flowDiagram: [
        "# 1. 打包定义一次",
        "def show_round(group, amounts):",
        "    ...",
        "",
        "# 2. 按需调用多次",
        'show_round("宿舍群", r1)',
      ],
      body: "用 def 给这套「核总额 + 找最高 + 打印战报」的步骤起个名字叫 show_round。之后不管有几个群，每次只需一行调用。",
    },
    code: code(`def show_round(group, amounts):
    total = round(sum(amounts), 2)
    print(f"{group}：共 {len(amounts)} 包，总额 {total} 元，最高 {max(amounts)} 元")

r1 = [3.28, 8.66, 1.42, 6.64]
r2 = [12.50, 5.20, 18.80, 13.50]
r3 = [1.08, 6.66, 2.26]

show_round("宿舍群", r1)
show_round("班级群", r2)
show_round("家庭群", r3)`),
    expectedOutput: `宿舍群：共 4 包，总额 20.0 元，最高 8.66 元
班级群：共 4 包，总额 50.0 元，最高 18.8 元
家庭群：共 3 包，总额 10.0 元，最高 6.66 元`,
  },
  {
    id: "fn-why-one",
    title: "优势体验：改一处，全局生效",
    type: "modify",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "需求升级：每轮战报补上「最低金额」",
      body: "群友还想看到每轮手气最差抢了多少元。请保持下面三行 show_round(...) 调用不变，只修改函数体内部的 print 语句，在末尾加上「，最低 {min(amounts)} 元」。",
    },
    code: code(`def show_round(group, amounts):
    total = round(sum(amounts), 2)
    print(f"{group}：共 {len(amounts)} 包，总额 {total} 元，最高 {max(amounts)} 元")

r1 = [3.28, 8.66, 1.42, 6.64]
r2 = [12.50, 5.20, 18.80, 13.50]
r3 = [1.08, 6.66, 2.26]

show_round("宿舍群", r1)
show_round("班级群", r2)
show_round("家庭群", r3)`),
    hints: [
      { level: 1, text: "最低金额可以用内置函数 min(amounts) 求出，不需要改动下面的三行调用。" },
      { level: 2, text: "在函数体第 3 行的 f-string 末尾补上：，最低 {min(amounts)} 元" },
      {
        level: 3,
        text: `def show_round(group, amounts):
    total = round(sum(amounts), 2)
    print(f"{group}：共 {len(amounts)} 包，总额 {total} 元，最高 {max(amounts)} 元，最低 {min(amounts)} 元")`,
      },
    ],
    reveal: {
      title: "一次修改，处处生效",
      body: "把公共逻辑收进函数后，不仅消除了重复代码，业务规则变化时也只需修改函数体一处，所有调用点自动同步更新。",
    },
    expectedOutput: `宿舍群：共 4 包，总额 20.0 元，最高 8.66 元，最低 1.42 元
班级群：共 4 包，总额 50.0 元，最高 18.8 元，最低 5.2 元
家庭群：共 3 包，总额 10.0 元，最高 6.66 元，最低 1.08 元`,
  },
];
