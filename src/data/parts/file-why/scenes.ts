import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 01 文件与持久化：内存生命周期、内存与磁盘对比、路径、文本与二进制、字符编码。 */
export const scenes: DraftScene[] = [
  {
    id: "file-why-lost",
    title: "内存数据的生命周期",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "变量与容器只存在于程序运行期间",
      body: "校园饮品店用列表 orders 记录刚接到的订单。程序运行一旦结束，内存立即释放；下次重新启动程序时，之前追加的订单全部消失。",
      bulletPoints: [
        "变量、列表、字典等对象都存放在内存中",
        "内存数据的生命周期与当前运行进程一致",
        "需要在关闭程序或关机后保留数据，必须写入外部文件",
      ],
    },
    code: code(`orders = ["杨枝甘露", "生椰拿铁"]
orders.append("茉莉奶绿")
print("当前出杯列表:", orders)
print("累计杯数:", len(orders))`),
    expectedOutput: `当前出杯列表: ['杨枝甘露', '生椰拿铁', '茉莉奶绿']
累计杯数: 3`,
  },
  {
    id: "file-why-compare",
    title: "内存与外部文件",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "从临时内存到持久化存储",
      gridTable: {
        headers: ["存储位置", "载体形式", "读写速度", "生命周期", "数据共享"],
        rows: [
          ["程序内存", "变量、list、dict", "极快，直接参与计算", "进程结束即清空", "仅当前运行的程序可用"],
          ["外部存储（磁盘）", ".txt / .csv / .json", "较慢，需按步骤读写", "断电或关程序后持久保留", "可交给其他软件或程序读取"],
        ],
      },
      bulletPoints: [
        "标准处理闭环：从文件读入内存容器 → 在容器中增删与统计 → 将结果写回文件保存",
      ],
    },
  },
  {
    id: "file-why-path",
    title: "文件路径",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "绝对路径与相对路径",
      body: "打开文件前，程序必须通过路径（Path）定位文件在磁盘上的位置。",
      compareTable: {
        leftHeader: "路径写法",
        rightHeader: "含义与工程建议",
        rows: [
          { left: '"receipt.txt"', right: "相对路径：当前工作目录下的 receipt.txt（同目录最常用）" },
          { left: '"data/menu.csv"', right: "相对路径：当前工作目录下 data 子目录中的 menu.csv" },
          { left: '"/Users/shop/data/menu.csv"', right: "绝对路径：从磁盘根目录写起，换一台电脑运行往往失效" },
        ],
      },
      bulletPoints: [
        "路径分隔符统一推荐写正斜杠 /，在 Windows、macOS、Linux 下均通用",
        "相对路径基准是「程序运行时的当前工作目录」，项目开发优先使用相对路径",
      ],
    },
  },
  {
    id: "file-why-text-binary",
    title: "文本文件与二进制文件",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "按数据存储方式分为文本文件与二进制文件",
      compareTable: {
        leftHeader: "文件类别",
        rightHeader: "特征与门店常见实例",
        rows: [
          {
            left: "文本文件",
            right: "字节按字符编码映射为可读文字，用记事本打开能直接看懂。如结账小票 receipt.txt、菜单表 menu.csv、订单包 order.json",
          },
          {
            left: "二进制文件",
            right: "按专用格式存放原始字节，用记事本打开显示乱码。如饮品海报 poster.png、电子表格 sales.xlsx、叫号提示音 alert.wav",
          },
        ],
      },
      bulletPoints: [
        "本讲学习的 .txt、.csv、.json 本质上都是纯文本文件",
        "二进制文件需要用二进制模式（\"rb\" / \"wb\"）或专门的解析库读写，不能按纯文本直接解码",
      ],
    },
  },
  {
    id: "file-why-encoding",
    title: "字符编码与 UTF-8",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "读写中文文本统一显式指定 encoding=\"utf-8\"",
      body: "计算机磁盘底层只存储字节（0 和 1），字符编码规定了文字与字节之间的映射规则。写入和读取若使用不同的编码规则，就会产生乱码或解码报错。",
      bulletPoints: [
        "UTF-8 是互联网与跨平台通用的标准编码，一个常用汉字占 3 个字节",
        "中文 Windows 默认编码常为 GBK（一个汉字占 2 个字节），省略 encoding 跨电脑极易报错",
        "工程规范：每次调用 open() 读写文本文件时，统一写明 encoding=\"utf-8\"",
      ],
    },
    code: code(`drink = "生椰拿铁"
utf8_bytes = drink.encode("utf-8")
gbk_bytes = drink.encode("gbk")

print("UTF-8 字节数:", len(utf8_bytes), utf8_bytes)
print("GBK   字节数:", len(gbk_bytes), gbk_bytes)
print("按 UTF-8 解码还原:", utf8_bytes.decode("utf-8"))`),
  },
];
