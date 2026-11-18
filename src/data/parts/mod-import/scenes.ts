import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const REDPACKET_MODULE = `# redpacket.py：存放可复用的群红包工具函数
import random

def split_lucky(total, count=4):
    """二倍均值法生成拼手气红包列表"""
    if count <= 0 or total < count * 0.01:
        return []
    packets = []
    rest = total
    for i in range(count - 1):
        left = count - i
        max_can = min(rest - (left - 1) * 0.01, (rest / left) * 2)
        money = round(random.uniform(0.01, max_can), 2)
        money = max(0.01, money)
        packets.append(money)
        rest = round(rest - money, 2)
    packets.append(round(rest, 2))
    return packets

def find_lucky_king(records):
    """返回抢包字典中的 (手气最佳姓名, 金额)"""
    king_name, king_money = "", -1.0
    for name, money in records.items():
        if money > king_money:
            king_name, king_money = name, money
    return king_name, king_money
`;

const MAIN_APP = `# main.py：导入左侧的 redpacket 模块发起群抢红包
import random
import redpacket

random.seed(2026)
members = ["小明", "小红", "小刚", "小美"]

# 调用自定义模块里的函数
pool = redpacket.split_lucky(20, len(members))
records = {}
for name in members:
    records[name] = pool.pop()
    print(f"{name} 抢到 {records[name]} 元")

king, best = redpacket.find_lucky_king(records)
print(f"👑 手气最佳：{king}（{best} 元）")
`;

const MODULE_WITH_MAIN = `# 试一试：先点左侧「运行」，再点右侧「运行」观察 __name__ 的变化！
def check_budget(total, count):
    return count >= 1 and count * 0.01 <= total <= 200

print("redpacket 模块里的 __name__ 是:", __name__)

if __name__ == "__main__":
    print("--- 正在单独运行 redpacket.py 自测 ---")
    print("自测 20 元 4 包:", check_budget(20, 4))
`;

const MAIN_IMPORT_TEST = `# 右侧主程序导入 redpacket 模块
import redpacket

print("main.py 里的 __name__ 是:", __name__)
print("主程序核验 50 元 5 包:", redpacket.check_budget(50, 5))
`;

/** 第六部分：从拼手气红包引出模块生态、标准库 random 二倍均值拆包、三种导入语法、双栏实战自定义模块与 __name__ 入口保护。 */
export const scenes: DraftScene[] = [
  {
    id: "mod-why",
    title: "为什么需要模块与三类模块全景",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "一个 .py 文件就是一个模块，站在现成工具箱的肩膀上",
      body: "前面我们只会发金额相等的普通红包；要发每个人金额随机波动的「拼手气红包」，就需要借助随机数模块 random。Python 中的模块分为三大类：",
      gridTable: {
        headers: ["模块类别", "获取与使用方式", "代表模块与典型用途"],
        rows: [
          ["标准库模块", "Python 安装自带，直接 import 即可使用", "random（随机抽取与打乱）、math（取整与数学运算）、datetime（日期时间）、json（数据读写）"],
          ["第三方库", "由社区开发，先在终端 pip install 安装再 import", "numpy / pandas（表格与大数据处理）、matplotlib（图表绘制）、requests（网络请求）"],
          ["自定义模块", "自己编写的 .py 代码文件，同目录下直接 import", "如本讲把红包算法封装成 redpacket.py，供多个程序共同调用"],
        ],
      },
    },
  },
  {
    id: "mod-random",
    title: "标准库实战：用 random 拆出拼手气红包",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "二倍均值法：每次在 [0.01, 当前剩余均值×2) 内随机抽取",
      body: "微信拼手气红包既要随机刺激，又要保证「每人至少 0.01 元、所有人加起来分毫不差等于总金额」。多次点击「运行」，观察每包金额变化而总额始终为 20.0 元！",
      bulletPoints: [
        "前 count - 1 包：用 random.uniform(a, b) 在 0.01 到当前剩余人均 2 倍之间随机生成，并给后面每人留足 0.01 元",
        "最后 1 包：直接取走剩余的 round(rest, 2)，彻底消除小数误差",
      ],
    },
    code: code(`import random

def split_lucky(total, count=4):
    """二倍均值法生成拼手气红包列表"""
    packets = []
    rest = total
    for i in range(count - 1):
        left = count - i
        max_can = min(rest - (left - 1) * 0.01, (rest / left) * 2)
        money = max(0.01, round(random.uniform(0.01, max_can), 2))
        packets.append(money)
        rest = round(rest - money, 2)
    packets.append(round(rest, 2))
    return packets

pool = split_lucky(20, 5)
print("拆出的 5 个红包:", pool)
print("核对总金额:", round(sum(pool), 2))`),
  },
  {
    id: "mod-import-ways",
    title: "导入模块的三种正规写法",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "导整个模块、起简短别名、按需只导指定函数",
      compareTable: {
        leftHeader: "导入语法",
        rightHeader: "调用写法与适用场景",
        rows: [
          { left: "import random", right: "写 random.shuffle(...)，函数来源最清晰（最推荐）" },
          { left: "import random as rd", right: "写 rd.choice(...)，适合模块名较长时简写" },
          { left: "from math import ceil", right: "直接写 ceil(...)，适合只用模块里一两个高频函数" },
        ],
      },
      body: "注释掉 random.seed(7) 每次结果随机；固定种子 seed(7) 则可让每次随机序列可重现，便于调试测试。",
    },
    code: code(`import random as rd
from math import ceil

rd.seed(7)
packets = [3.28, 8.66, 1.42, 6.64]

# 打乱红包顺序，再随机抽一位免单幸运儿
rd.shuffle(packets)
print("洗牌后的红包池:", packets)
print("随机抽一包:", rd.choice(packets))

# 17 名同学按每群 5 人分组发红包，向上取整算需要几个群
print("需要建群数:", ceil(17 / 5))`),
    expectedOutput: `洗牌后的红包池: [6.64, 8.66, 3.28, 1.42]
随机抽一包: 6.64
需要建群数: 4`,
  },
  {
    id: "mod-star",
    title: "避坑：为什么不推荐 from 模块 import *",
    type: "predict",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "通配符 * 会一次性导入大量名字，极易悄悄覆盖同名函数",
      body: "程序员自己写了一个 choice(packets) 函数默认取第一包，随后写了一句 from random import *。看看调用 choice 时执行的是哪一个？",
    },
    code: code(`def choice(packets):
    return packets[0]

from random import *

seed(0)
packets = [3.28, 8.66, 1.42]
print(choice(packets))`),
    prediction: {
      question: "print(choice(packets)) 的输出是什么？",
      options: [
        { id: "first", label: "3.28（自己定义的函数：取第 0 项）" },
        { id: "rand", label: "8.66（被 random.choice 覆盖后的随机结果）", isCorrect: true },
        { id: "err", label: "报命名冲突错误" },
      ],
    },
    reveal: {
      title: "后导入的同名函数静默覆盖了先定义的函数",
      body: "Python 不会对同名覆盖报错，from random import * 会把几十个名字全部倒进当前作用域，排错非常困难。工程上应坚持写 import random 或按需明确列出函数名。",
    },
  },
  {
    id: "mod-debug",
    title: "调试练习：首次使用前导入与前缀匹配",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "用模块前必须先 import，且调用方式要与导入方式一致",
      body: "左侧代码有两处模块使用错误，请运行查看报错并修复，使其输出 8.66 和 4。",
    },
    code: code(`from math import ceil

random.seed(0)
packets = [3.28, 8.66, 1.42]
print(random.choice(packets))
print(math.ceil(17 / 5))`),
    hints: [
      { level: 1, text: "第 1 处报错 NameError: name 'random' is not defined——使用了 random 却忘了写 import random。" },
      { level: 2, text: "第 2 处报错 NameError: name 'math' is not defined——因为开头写的是 from math import ceil，只导入了 ceil，调用时直接写 ceil(17 / 5) 不要加 math. 前缀。" },
      {
        level: 3,
        text: `import random
from math import ceil

random.seed(0)
packets = [3.28, 8.66, 1.42]
print(random.choice(packets))
print(ceil(17 / 5))`,
      },
    ],
    reveal: {
      title: "import 模块 → 模块.函数()；from 模块 import 函数 → 函数()",
      body: "导入整个模块时，名字空间里只有模块名；用 from ... import 导入具体函数时，名字空间里只有该函数名。",
    },
    expectedOutput: `8.66
4`,
  },
  {
    id: "mod-own-intro",
    title: "自定义模块与 __name__ 的双重身份",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "把通用函数收进 redpacket.py，主程序 import 即可复用",
      flowDiagram: [
        "📁 项目文件夹",
        " ├── redpacket.py   # 自定义工具模块：split_lucky()、find_lucky_king()",
        " └── main.py        # 主程序：import redpacket 后直接调用",
      ],
      body: "当代码量变大时，把红包拆分与统计函数独立存成 redpacket.py，其他任何程序只要放在同一目录，写一行 import redpacket 就能调用。每个模块自带内置变量 __name__：",
      bulletPoints: [
        '直接运行该文件时：__name__ 的值等于 "__main__"',
        '被别的文件 import 导入时：__name__ 的值等于模块文件名（如 "redpacket"）',
        '把模块自测代码放进 if __name__ == "__main__":，单独运行能自测，被导入时又不会乱执行！',
      ],
    },
  },
  {
    id: "mod-own",
    title: "双栏实战：自定义模块 redpacket.py 与主程序协作",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {},
    code: code(REDPACKET_MODULE),
    pairedCode: {
      peerLabel: "redpacket.py（自定义红包模块）",
      label: "main.py（群聊主程序：点此运行）",
      initial: MAIN_APP,
    },
  },
  {
    id: "mod-main",
    title: "亲手验证：if __name__ == \"__main__\" 的作用",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {},
    code: code(MODULE_WITH_MAIN),
    pairedCode: {
      peerLabel: "redpacket.py（先点这里运行自测）",
      label: "main.py（再点这里运行导入）",
      initial: MAIN_IMPORT_TEST,
    },
  },
];
