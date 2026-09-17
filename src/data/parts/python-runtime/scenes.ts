import type { DraftScene } from "../../../types/scene";

export const scenes: DraftScene[] = [
  {
    id: "scene-09-env",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "Python 编程环境",
      pythonEnv: {
        filename: "hello.py",
        sampleCode: 'print("Hello")',
        fileLabel: ".py 文件",
        fileHint: "写好的程序",
        editorLabel: "编辑器 · PyCharm",
        editorHint: "写、改、点运行",
        interpreterLabel: "Python 解释器",
        interpreterHint: "读代码并执行",
        consoleLabel: "控制台",
        consoleOutput: "Hello",
        conclusion:
          "编程环境 = 编辑器 + 解释器 + 文件。PyCharm 是工作台，不是 Python；装了编辑器，也不等于已经有解释器。",
      },
    },
  },
  {
    id: "scene-09-mode",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "编译型 vs 解释型",
      compileVsInterpret: {
        lines: ['print("一")', 'print("二")', 'print("三")'],
        outputs: ["一", "二", "三"],
        compiledTitle: "编译型语言（如 C）",
        interpretedTitle: "解释型语言（如 Python）",
        compiledTag: "先全部译完，再运行",
        interpretedTag: "读一行，执行一行",
        conclusion:
          "编译型：先把代码全部翻译成完整程序，再运行——输出往往一起出现。解释型：运行时读一行、执行一行、输出一行，不先生成整份可执行文件。Python 课堂主线按解释型理解。",
      },
    },
  },
  {
    id: "scene-09-version",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "Python 版本",
      pythonVersion: {
        courseVersion: "3.12+",
        lead: "版本号告诉你：用的是哪一代解释器。本课统一要求，避免各装各的对不上。",
        versionParts: [
          { label: "3", meaning: "主版本（语言大代）" },
          { label: "12", meaning: "次版本（功能更新）" },
          { label: "x", meaning: "修订号（修复小问题）" },
        ],
        notes: [
          "不要再用 Python 2.x",
          "本课使用 Python 3.12 及以上即可",
          "电脑上若有多个解释器，运行前先确认选中的是哪一个",
        ],
        linkLabel: "打开 python.org 下载页",
        href: "https://www.python.org/downloads/",
      },
    },
  },
  {
    id: "scene-09-install",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "安装：先解释器，再编辑器",
      pythonInstall: {
        lead: "安装顺序错了，最容易出现「装了软件却跑不了代码」。",
        orderNote: "先装 Python 解释器，再装 / 配置编辑器。",
        steps: [
          { title: "下载", body: "官网获取安装包" },
          { title: "安装", body: "勾选 Add to PATH" },
          { title: "打开编辑器", body: "PyCharm 或 VS Code" },
          { title: "选解释器", body: "指向刚装的 Python" },
        ],
        pythonLink: {
          label: "Python 官方下载",
          href: "https://www.python.org/downloads/",
        },
        editors: [
          {
            name: "PyCharm Community",
            role: "本课主推：集成度高，适合课堂统一",
            href: "https://www.jetbrains.com/pycharm/download/",
            primary: true,
          },
          {
            name: "VS Code",
            role: "备选：需安装 Python 扩展后再选解释器",
            href: "https://code.visualstudio.com/",
          },
        ],
      },
    },
  },
  {
    id: "scene-09-verify",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "验收：环境真的能跑吗？",
      pythonVerify: {
        checks: [
          {
            label: "看版本",
            detail: "python --version\n→ Python 3.12.x",
          },
          {
            label: "看解释器",
            detail: "编辑器设置里能看到 Python 路径",
          },
          {
            label: "跑通 Hello",
            detail: 'print("Hello")\n→ Hello',
          },
        ],
        pitfalls: [
          "安装时没勾选 Add python.exe to PATH",
          "装了多个 Python，编辑器选错了解释器",
          "只装了 PyCharm / VS Code，还没有 Python 解释器",
        ],
        successLine: "三步都过关，本课编程环境就算就绪——可以开始写程序了。",
      },
    },
  },
];
