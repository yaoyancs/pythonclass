import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

const ROW = `for i in range(1, 10):
    for j in range(1, i + 1):
        if j * i > 20:
            break
        print(f"{j}×{i}={j * i}", end="  ")
    print()
`;

const CONFLICT = `import random
count,total = 0,0
for i in range(1,6):
    w = random.randint(0, 5) * 10
    print(f"第{i}个包裹重量：", w)
    if w == 0:
        print(f"第{i}个破损")
    count += 1
    total += w
    print(f"第{i}个已装车")
print(f"装车{count}件,总重量{total}：")
`;

const SKIP = `import random
count,total = 0,0
for i in range(1，6):
    w = random.randint(0, 5) * 10
    print(f"第{i}个包裹重量：", w)
    if w == 0:
        print(f"第{i}个破损")
        continue
    count += 1
    total += w
    print(f"第{i}个已装车")
print(f"装车{count}件,总重量{total}：")
`;

const USE = `import random
m, count, total = 100,0 ,0
for i in range(1,8):
    w = random.randint(0, 4) * 10
    print(f"第{i}个包裹重量：", w)
    if w == 0:
        print(f"第{i}个破损，跳过")
        continue
    if total + w > m:
        print(f"第{i}个超载，停止装车")
        break
    count += 1
    total += w
    print(f"第{i}个装车成功")
print(f"件数：{count}，总重量：{total}")
`;

const FOR_ELSE = `import random
for i in range(1, 5):
    w = random.randint(0, 4) * 10
    print(f"第{i}个包裹重量：", w)
    if w == 30:
        print(f"第{i}个包裹是 30kg")
        break
else:
    print("本趟没有 30kg 包裹")
`;

const NEED_CONTINUE = `import random
m, total = 50, 0
for i in range(1, 6):
    w = random.randint(0, 6) * 10
    print(f"第{i}个：{w}")
    if w == 0:
        print("破损，跳过")
        continue
    if w > 40:
        print("单件过重，跳过")
        continue
    if total + w > m:
        print("本件会超载，跳过")
        continue
    total += w
    print("装车，总重", total)
print("最终总重", total)
`;

const NEED_CONTINUE_IF = `import random
m, total = 50, 0
for i in range(1, 6):
    w = random.randint(0, 6) * 10
    print(f"第{i}个：{w}")
    if w == 0:
        print("破损，跳过")
    else:
        if w > 40:
            print("单件过重，跳过")
        else:
            if total + w > m:
                print("本件会超载，跳过")
            else:
                total += w
                print("装车，总重", total)
print("最终总重", total)
`;

const WHILE_ELSE = `# 限次猜中：最多 3 次；猜中 break；次数用尽才走 else
secret = 37
guesses = [10, 50, 20]
i = 0
while i < 3:
    guess = guesses[i]
    print(f"第{i + 1}次：", guess)
    if guess == secret:
        print("猜中")
        break
    i += 1
else:
    print("机会用完")

print("---")

# 第二次猜中：break 后不会走 else
guesses = [10, 37, 20]
i = 0
while i < 3:
    guess = guesses[i]
    print(f"第{i + 1}次：", guess)
    if guess == secret:
        print("猜中")
        break
    i += 1
else:
    print("机会用完")
`;

/** 九九表用 break 结束这一行。配送装车引出 continue，再和 break 合用；对照多处跳过时 if 只能嵌套。最后用查找 / 限次猜中看 for、while 的 else。 */
export const scenes: DraftScene[] = [
  {
    id: "scene-jump-row",
    title: "break",
    type: "explain",
    layout: "split",
    editorSide: "left",
    content: { loopPath: { topic: "jump", mode: "row" } },
    code: code(ROW),
  },
  {
    id: "scene-jump-still",
    title: "代码分析",
    type: "explain",
    layout: "split",
    content: { loopPath: { topic: "jump", mode: "still" } },
    code: code(CONFLICT),
  },
  {
    id: "scene-jump-skip",
    title: "continue",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: { loopPath: { topic: "jump", mode: "skip" } },
    code: code(SKIP),
  },
  {
    id: "scene-jump-use",
    title: "破损和超载怎么处理",
    type: "explain",
    layout: "split",
    editorOnly: true,
    content: { loopPath: { topic: "jump", mode: "use" } },
    code: code(USE),
  },
  {
    id: "scene-jump-for-else",
    title: "查找 30kg",
    type: "explain",
    layout: "split",
    content: { loopPath: { topic: "jump", mode: "forElse" } },
    code: code(FOR_ELSE),
  },
  {
    id: "scene-jump-need-continue",
    title: "continue 不能只靠 if",
    type: "explain",
    layout: "split",
    content: {},
    code: code(NEED_CONTINUE),
    pairedCode: {
      peerLabel: "continue",
      label: "强行只用 if",
      initial: NEED_CONTINUE_IF,
    },
  },
  {
    id: "scene-jump-while-else",
    title: "限次猜中",
    type: "explain",
    layout: "split",
    content: { loopPath: { topic: "jump", mode: "whileElse" } },
    code: code(WHILE_ELSE),
  },
];
