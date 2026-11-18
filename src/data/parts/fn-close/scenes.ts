import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const INTERACTIVE_APP = `import random

MIN_UNIT = 0.01
MAX_TOTAL = 200

def valid_budget(total, count):
    """核验发包金额与个数是否合规"""
    return count >= 1 and count * MIN_UNIT <= total <= MAX_TOTAL

def create_packets(total, count=5, lucky=True):
    """生成红包池：lucky=True 为拼手气红包，False 为普通平分红包"""
    if not lucky:
        each = round(total / count, 2)
        return [each] * count
    packets = []
    rest = total
    for i in range(count - 1):
        left = count - i
        max_can = min(rest - (left - 1) * MIN_UNIT, (rest / left) * 2)
        money = max(MIN_UNIT, round(random.uniform(MIN_UNIT, max_can), 2))
        packets.append(money)
        rest = round(rest - money, 2)
    packets.append(round(rest, 2))
    random.shuffle(packets)
    return packets

def grab_packet(packets):
    """从红包池抢走一包；若已抢空则返回 0.0"""
    if len(packets) == 0:
        return 0.0
    return packets.pop()

def find_extremes(records):
    """同时返回 (手气最佳姓名, 最高金额, 手气最差姓名, 最低金额)"""
    king_name, king_money = "", -1.0
    low_name, low_money = "", MAX_TOTAL + 1.0
    for name, money in records.items():
        if money > king_money:
            king_name, king_money = name, money
        if money < low_money:
            low_name, low_money = name, money
    return king_name, king_money, low_name, low_money

def main():
    members = ["小明", "小红", "小刚", "小美", "阿杰"]
    total = float(input("请输入红包总金额（如 66）："))
    if not valid_budget(total, len(members)):
        print(f"发包失败：总额需在 {len(members) * MIN_UNIT} ~ {MAX_TOTAL} 元之间")
        return

    mode = input("选择类型（1-拼手气，2-普通等额，直接回车默认 1）：").strip()
    wish = input("输入祝福语（直接回车默认「恭喜发财，大吉大利」）：").strip()
    if wish == "":
        wish = "恭喜发财，大吉大利"
    lucky = (mode != "2")

    tag = "拼手气红包" if lucky else "普通红包"
    print(f"\\n🧧 [{tag}] {wish}（共 {len(members)} 包，总额 {total} 元）")
    pool = create_packets(total, len(members), lucky=lucky)

    records = {}
    for name in members:
        money = grab_packet(pool)
        records[name] = money
        print(f"  {name} 抢到 {money:.2f} 元")

    king, best, low_user, worst = find_extremes(records)
    print(f"核对实发总额：{round(sum(records.values()), 2)} 元")
    if lucky:
        print(f"👑 手气最佳：{king}（{best:.2f} 元）")
        print(f"🍀 运气最差：{low_user}（{worst:.2f} 元）")

if __name__ == "__main__":
    main()`;

const CHALLENGE_STARTER = `import random

def valid_budget(total, count):
    return count >= 1 and count * 0.01 <= total <= 200

def split_lucky(total, count=4):
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

def find_lucky_king(records):
    king_name, king_money = "", -1.0
    for name, money in records.items():
        if money > king_money:
            king_name, king_money = name, money
    return king_name, king_money

# 请补全主调度函数 send_and_grab(total, members, wish="恭喜发财")
def send_and_grab(total, members, wish="恭喜发财"):
    pass


random.seed(2026)
members = ["小明", "小红", "小刚", "小美"]
send_and_grab(0.02, members)
send_and_grab(20, members, wish="周末愉快")`;

/** 第七部分：串联全讲所有核心积木，完成浏览器内 100% 真实可运行的微信群拼手气红包系统，并归纳总结与布置作业。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-close-arch",
    title: "系统组装：微信群「拼手气红包」架构",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "四个职责清晰的函数，拼出完整的群红包系统",
      flowDiagram: [
        "if __name__ == '__main__': main()",
        "  ├── 1. valid_budget(total, count)          # 门卫：拦截金额不足或超限",
        "  ├── 2. create_packets(total, count, lucky) # 发包：默认拼手气（random 二倍均值法）",
        "  ├── 3. grab_packet(pool)                   # 抢包：列表原地 pop，抢空返回 0.0",
        "  └── 4. find_extremes(records)              # 结算：多返回值解包手气最佳与运气最差",
      ],
      body: "回顾前六节写过的每一个小组件：核验、默认/关键字参数、提前返回、列表传参、多返回值解包、random 模块与 __name__ 入口，现在严丝合缝地组装在一起。",
    },
  },
  {
    id: "fn-close-app",
    title: "综合实战：控制台互动发红包与抢红包",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "点击「运行」，亲手发一轮拼手气红包！",
      body: "左侧是完整的纯 Python 互动程序，每一行都可以在浏览器里直接修改并真实运行。",
      bulletPoints: [
        "试一试 ①：输入 66，后面两项直接回车，看看 5 位群友谁是手气王",
        "试一试 ②：输入 0.02，验证 valid_budget 是否成功拦截非法金额",
        "试一试 ③：把 members 列表改成你们宿舍同学的名字，多跑几轮比比手气！",
      ],
    },
    code: code(INTERACTIVE_APP),
  },
  {
    id: "fn-close-challenge",
    title: "综合挑战：编写主调度函数串联全流程",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "补全 send_and_grab(total, members, wish=\"恭喜发财\")",
      body: "底层三个工具函数已就绪，请补全 send_and_grab 把它们组装起来：",
      bulletPoints: [
        "第 1 步：调用 valid_budget(total, len(members))；若为 False，打印「发包失败：金额不合规」并提前 return",
        "第 2 步：打印「🧧 [{wish}] 发出 {total} 元（共 {len(members)} 包）」",
        "第 3 步：调用 split_lucky(total, len(members)) 得到 pool；遍历 members，每人 money = pool.pop() 记入字典 records，并打印「{name} 抢到 {money} 元」",
        "第 4 步：调用 find_lucky_king(records) 解包出 king, best，打印「👑 手气最佳：{king}（{best} 元）」",
      ],
    },
    code: code(CHALLENGE_STARTER),
    hints: [
      { level: 1, text: '开头先写卫语句：if not valid_budget(total, len(members)): print("发包失败：金额不合规") 然后 return。' },
      { level: 2, text: "生成 pool = split_lucky(total, len(members))，建空字典 records = {}，循环里 money = pool.pop() 并写 records[name] = money。" },
      {
        level: 3,
        text: `def send_and_grab(total, members, wish="恭喜发财"):
    if not valid_budget(total, len(members)):
        print("发包失败：金额不合规")
        return
    print(f"🧧 [{wish}] 发出 {total} 元（共 {len(members)} 包）")
    pool = split_lucky(total, len(members))
    records = {}
    for name in members:
        money = pool.pop()
        records[name] = money
        print(f"{name} 抢到 {money} 元")
    king, best = find_lucky_king(records)
    print(f"👑 手气最佳：{king}（{best} 元）")`,
      },
    ],
    reveal: {
      title: "对照：这就是模块化编程的威力",
      body: "有了职责分明的底层工具函数，主调度函数只需十几行就能清晰读出「核验 → 拆包 → 派发 → 评手气王」的完整业务脉络。",
    },
    expectedOutput: `发包失败：金额不合规
🧧 [周末愉快] 发出 20 元（共 4 包）
小明 抢到 6.1 元
小红 抢到 6.4 元
小刚 抢到 6.3 元
小美 抢到 1.2 元
👑 手气最佳：小红（6.4 元）`,
  },
  {
    id: "fn-close-points",
    title: "本讲总结",
    type: "explain",
    layout: "fullscreen",
    content: {
      note: {
        title: "函数与模块核心要点",
        points: [
          "1. 定义、调用与文档字符串\ndef 创建函数时不执行函数体，加括号调用才执行；首行三引号文档字符串是函数说明书，可用 help(函数名) 查看；避免用变量名覆盖 sum、max 等内置函数。",
          "2. 四类参数传递规则\n定义时必填形参在前、默认形参在后（默认参数切勿直接写 []，应用 None 占位）；调用时位置实参在前、关键字实参在后；*args 将多余位置实参收集为元组。",
          "3. 返回值与提前结束\nprint 只在屏幕打印（函数默认返回 None），return 才把结果交回后续代码使用并立即结束函数；return a, b 实质返回元组，可直接用多变量解包。",
          "4. 作用域与模块拆分\n局部变量在函数外不可见；传入可变列表原地 pop/append 会影响外部同一列表；用 import 导入标准库或同目录自定义 .py 模块，用 if __name__ == \"__main__\": 保护模块自测代码。",
        ],
      },
    },
  },
  {
    id: "fn-close-homework",
    title: "课后作业",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "课后作业",
      bulletPoints: [],
    },
  },
];
