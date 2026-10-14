import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

export const scenes: DraftScene[] = [
  {
    id: "vend-bike",
    title: "综合练习",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      vendPath: {
        mode: "guide",
        title: "综合练习：共享单车开锁",
        image: { src: "/lesson03/bike-unlock.jpg", alt: "学生在校园路边扫码开共享单车" },
        lead: [
          "上课前，一名学生在教学楼门口扫码，准备骑共享单车。",
          "开锁程序不能只看电量。账号被冻结，或者还有未支付订单时，车辆不应当被打开。",
          "任务：用 Python 写出这次开锁的判断程序。每次只输出一行。",
        ],
        tasks: [
          {
            index: "01",
            title: "账号状态",
            body: "status 为「冻结」时，打印「账号已冻结，无法开锁」。\n此时不再判断 unpaid 和 battery。",
          },
          {
            index: "02",
            title: "未支付订单",
            body: "账号正常且 unpaid > 0，打印「有未支付订单，请先支付」。\n此时不再判断电量。",
          },
          {
            index: "03",
            title: "电量分档",
            body: "只有账号正常、且没有未支付订单时，才看 battery。\nbattery < 15：打印「电量过低，请更换车辆」。\nbattery < 40：打印「开锁成功，电量偏低」。\n否则：打印「开锁成功」。\n更小的上界必须写在前面。",
          },
        ],
      },
    },
    code: code(`status = "正常"
unpaid = 0
battery = 40

# 按右侧任务完成开锁判断
# 每次只输出一行
`),
    hints: [
      { level: 1, text: "先判断 status == \"冻结\"。这一支成立后，不要再写欠费和电量。" },
      { level: 2, text: "账号正常后再判断 unpaid > 0。只有没有未支付订单时，才比较 battery。" },
      {
        level: 3,
        text: 'if status == "冻结":\n    print("账号已冻结，无法开锁")\nelif unpaid > 0:\n    print("有未支付订单，请先支付")\nelif battery < 15:\n    print("电量过低，请更换车辆")\nelif battery < 40:\n    print("开锁成功，电量偏低")\nelse:\n    print("开锁成功")',
      },
    ],
    reveal: {
      title: "对照",
      body: "冻结时即使有欠费、电量充足，也只输出冻结。有未支付订单时，即使电量过低，也只提示先支付。没有欠费时，10 更换车辆，20 开锁但电量偏低，40 直接开锁成功。",
    },
  },
  {
    id: "vend-breakfast",
    title: "综合练习",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    content: {
      vendPath: {
        mode: "guide",
        title: "综合练习：校园智能早餐机",
        image: { src: "/lesson03/breakfast-machine.jpg", alt: "教学楼前的智能早餐售货机" },
        lead: [
          "早上7:45，一名大学生匆匆赶往教学楼，发现楼下新安装了一台智能早餐售货机。",
          "它不仅要识别学生选择的商品，还要检查库存、判断余额，并根据距离上课的时间给出提醒。",
          "任务：用 Python 开发这台早餐机的智能决策程序。",
        ],
        tasks: [
          {
            index: "01",
            title: "时间状态判断",
            body: "如果距离上课时间 ≤ 15 分钟，状态为「赶时间」；否则为「时间充裕」。\n要求使用 A if 条件 else B 将结果赋给变量 status。",
          },
          {
            index: "02",
            title: "紧急提醒",
            body: "如果距离上课时间 ≤ 5 分钟，额外输出：提醒：快上课了，请注意时间！\n如果不满足条件，就不输出该提醒，但程序仍继续运行。",
          },
          {
            index: "03",
            title: "商品识别",
            body: "根据 product 判断商品价格。包子 3 元、牛奶 4 元、橙汁 5 元。\n如果输入未收录的商品，例如「咖啡」，则提示「商品暂未收录」，不能继续购买。",
          },
          {
            index: "04",
            title: "交易决策",
            body: "只有商品被识别，才进入交易处理。\n先检查库存：库存为 0，提示商品售罄，不进行支付；库存大于 0，再判断余额。\n有库存时：余额足够，支付成功，并显示剩余余额；余额不足，提示充值。",
          },
          {
            index: "05",
            title: "结束提示",
            body: "无论商品是否成功购买，最后都输出：本次购物处理结束\n思考：这条 print() 应该放在什么缩进位置？",
          },
        ],
      },
    },
    code: code(`minutes = 12
product = "橙汁"
stock = 2
balance = 6

print("=== 校园智能早餐机 ===")

# 任务1：使用条件表达式判断时间状态
status = __________
print("当前状态：", status)

# 任务2：使用单分支进行紧急提醒


# 任务3：使用多分支识别商品及其价格
price = None


# 任务4：使用嵌套分支检查商品、库存和余额
# 只有商品有效，才允许继续检查库存和余额


# 任务5：无论购买是否成功，都显示结束信息
print("本次购物处理结束")
`),
    hints: [
      { level: 1, text: "status 用「赶时间」 if minutes <= 15 else 「时间充裕」。紧急提醒只在 minutes <= 5 时打印，不要写 else。" },
      { level: 2, text: "包子、牛奶、橙汁分别定价。else 打印「商品暂未收录」，此时 price 仍为 None，不要进入库存和余额判断。" },
      {
        level: 3,
        text: 'status = "赶时间" if minutes <= 15 else "时间充裕"\nif minutes <= 5:\n    print("提醒：快上课了，请注意时间！")\nif product == "包子":\n    price = 3\nelif product == "牛奶":\n    price = 4\nelif product == "橙汁":\n    price = 5\nelse:\n    print("商品暂未收录")\nif price is not None:\n    if stock == 0:\n        print("商品售罄")\n    elif balance < price:\n        print("余额不足，请充值")\n    else:\n        print("支付成功，剩余余额：", balance - price)\nprint("本次购物处理结束")',
      },
    ],
    reveal: {
      title: "对照",
      body: "当前数据：状态为赶时间，没有 5 分钟提醒；橙汁 5 元，库存 2，余额 6，支付成功，剩余余额 1；最后输出本次购物处理结束。商品为咖啡时只提示暂未收录，不检查库存。结束语句与最外层 if 对齐，不要缩进。",
    },
  },
];
