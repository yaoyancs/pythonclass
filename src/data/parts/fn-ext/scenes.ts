import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 默认参数、默认参数位置、关键字参数、位置实参在前。 */
export const scenes: DraftScene[] = [
  {
    id: "fn-ext-default",
    title: "默认参数",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-ext-default.svg",
        alt: "默认参数：export_image(\"cover\") 只传 name，width 和 fmt 用默认值 1920 和 \"png\"",
      },
    },
    code: code(`# 省略实参时，形参采用默认值
def export_image(name, width=1920, fmt="png"):
    print(f"{name}.{fmt} ({width}px)")

export_image("cover")
export_image("banner", 1280)`),
    expectedOutput: `cover.png (1920px)
banner.png (1280px)`,
  },
  {
    id: "fn-ext-order",
    title: "默认参数的位置",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-ext-order.svg",
        alt: "默认参数的位置：无默认值的形参写在左边，有默认值的写在右边，反过来报 SyntaxError",
      },
    },
    code: code(`# 无默认值的形参必须写在默认形参之前
def export_image(width=1920, name):
    print(f"{name}.png ({width}px)")

export_image("cover")`),
    hints: [
      { level: 1, text: "SyntaxError: non-default argument follows default argument" },
      { level: 2, text: "把 name 移到最左边：def export_image(name, width=1920):" },
      {
        level: 3,
        text: `def export_image(name, width=1920):
    print(f"{name}.png ({width}px)")

export_image("cover")`,
      },
    ],
    reveal: {
      title: "无默认值形参在左，默认形参在右",
      body: "width=1920 不能写在必填形参 name 前面。",
    },
    expectedOutput: "cover.png (1920px)",
  },
  {
    id: "fn-ext-keyword",
    title: "关键字参数",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-ext-keyword.svg",
        alt: "关键字参数：fmt=、name=、width= 按名字对号入座，顺序可以和定义时不同",
      },
    },
    code: code(`# 按形参名传参，可以跳过中间的默认参数 width
def export_image(name, width=1920, fmt="png"):
    print(f"{name}.{fmt} ({width}px)")

export_image("avatar", fmt="webp")
export_image(fmt="jpg", name="photo", width=800)`),
    expectedOutput: `avatar.webp (1920px)
photo.jpg (800px)`,
  },
  {
    id: "fn-ext-mix",
    title: "位置实参在关键字实参之前",
    type: "debug",
    layout: "split",
    editorSide: "left",
    content: {
      image: {
        src: "/lesson08/syntax/fn-ext-mix.svg",
        alt: "位置实参在前：\"avatar\" 按位置给 name，fmt=\"webp\" 按名字给 fmt；关键字实参后面再写位置实参报错",
      },
    },
    code: code(`# 调用时，位置实参不能写在关键字实参后面
def export_image(name, width=1920, fmt="png"):
    print(f"{name}.{fmt} ({width}px)")

export_image(fmt="webp", "avatar")`),
    hints: [
      { level: 1, text: "SyntaxError: positional argument follows keyword argument" },
      { level: 2, text: '把位置实参 "avatar" 放到前面：export_image("avatar", fmt="webp")' },
      {
        level: 3,
        text: `def export_image(name, width=1920, fmt="png"):
    print(f"{name}.{fmt} ({width}px)")

export_image("avatar", fmt="webp")`,
      },
    ],
    reveal: {
      title: "关键字实参后面不能再写位置实参",
      body: '"avatar" 按位置绑定 name，fmt="webp" 按名字绑定。',
    },
    expectedOutput: "avatar.webp (1920px)",
  },
  {
    id: "fn-ext-practice",
    title: "练习",
    type: "challenge",
    layout: "split",
    editorSide: "left",
    editorOnly: true,
    content: {},
    code: code(`# 定义一个函数，用来生成饮品订单，并打印下面三次调用的返回值。
# 只说口味 "珍珠"，得到：珍珠 中杯 全糖 冰
# 口味是 "芋泥"，并且不要冰，得到：芋泥 中杯 全糖 去冰
# 口味是 "柠檬"，杯子是 "大杯"，糖是 "半糖"，得到：柠檬 大杯 半糖 冰
# 没写杯子时用中杯，没写糖时用全糖，没说要不要冰时用冰。`),
    hints: [
      { level: 1, text: 'ice_text = "冰" if ice else "去冰"' },
      { level: 2, text: 'return f"{flavor} {size} {sugar} {ice_text}"' },
      {
        level: 3,
        text: `def order(flavor, size="中杯", sugar="全糖", ice=True):
    ice_text = "冰" if ice else "去冰"
    return f"{flavor} {size} {sugar} {ice_text}"

print(order("珍珠"))
print(order("芋泥", ice=False))
print(order("柠檬", "大杯", "半糖"))`,
      },
    ],
    reveal: {
      title: "位置实参、默认值与关键字实参配合使用",
      body: "省略杯子、糖和是否加冰时用默认值。第二次只用关键字关掉冰，不必把中间的杯子和糖再写一遍。",
    },
    expectedOutput: `珍珠 中杯 全糖 冰
芋泥 中杯 全糖 去冰
柠檬 大杯 半糖 冰`,
  },
  {
    id: "fn-ext-syntax",
    title: "语法小结：参数扩展",
    type: "explain",
    layout: "fullscreen",
    content: {
      syntaxMap: {
        root: "参数扩展",
        branches: [
          {
            title: "默认参数",
            code: `def f(name, width=1920): ...
f("cover")`,
            notes: ["省略实参时用默认值"],
          },
          {
            title: "形参顺序",
            code: `def f(name, width=1920): ✓
def f(width=1920, name): ✗`,
            notes: ["无默认值的在左", "有默认值的在右"],
          },
          {
            title: "关键字实参",
            code: `f("avatar", fmt="webp")`,
            notes: ["按形参名传", "可以跳过中间的默认参数"],
          },
          {
            title: "实参顺序",
            code: `f("avatar", fmt="webp")  ✓
f(fmt="webp", "avatar")  ✗`,
            notes: ["位置实参在前", "关键字实参在后"],
          },
        ],
      },
    },
  },
];
