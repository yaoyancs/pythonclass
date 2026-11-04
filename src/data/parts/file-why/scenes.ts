import type { DraftScene } from "../../../types/scene";

const code = (initial: string) => ({
  initial,
  editable: true,
  resetToInitial: true,
});

/** 内存与外部存储：为什么程序关闭后数据会丢失。 */
export const scenes: DraftScene[] = [
  {
    id: "file-why-lost",
    title: "变量只活在运行期间",
    type: "run",
    layout: "split",
    editorSide: "left",
    content: {
      headline: "进程结束后，内存中的对象不再保留",
      body: "列表 logs 只在本次运行中存在。进程结束后该对象被释放，再次启动时需要重新建立数据。",
      bulletPoints: [
        "变量、列表、字典位于内存",
        "内存数据的生命周期与本次进程一致",
        "需要跨次运行保留时，必须写入文件",
      ],
    },
    code: code(`logs = [45, 60]
logs.append(35)
print("当前记录:", logs)
print("累计分钟:", sum(logs))`),
  },
  {
    id: "file-why-compare",
    title: "内存与文件",
    type: "explain",
    layout: "fullscreen",
    content: {
      headline: "从临时数据到持久化数据",
      compareTable: {
        leftHeader: "程序内存（列表 / 字典）",
        rightHeader: "外部文件（.txt / .csv / .json）",
        rows: [
          { left: "访问快，可直接参与计算", right: "保存在磁盘，进程结束后仍然存在" },
          { left: "进程结束即释放", right: "下次运行可以重新读入内存" },
          { left: "仅当前进程可直接使用", right: "可供其他程序在其他时间读取" },
        ],
      },
      bulletPoints: [
        "处理流程：从文件读入容器，计算后再写回文件",
      ],
    },
  },
];
