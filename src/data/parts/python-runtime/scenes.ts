import type { DraftScene } from '../../types/scene';

export const scenes: DraftScene[] = [
{
    id: 'scene-09',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '一段 Python 程序究竟怎样运行？',
      runtimeModel: {
        items: [
          { title: 'Python 语言', body: '代码应当怎样书写' },
          { title: 'Python 解释器', body: '读取并执行 Python 代码' },
          { title: 'PyCharm', body: '帮助我们编辑、运行和调试代码的工具' },
        ],
        analogies: [
          { label: 'Python 语言', value: '菜谱使用的表达规则' },
          { label: '.py 文件', value: '写好的菜谱' },
          { label: '解释器', value: '按菜谱做菜的人' },
          { label: 'PyCharm', value: '提供工具和工作台的厨房' },
        ],
        caveat: 'PyCharm 不是 Python。安装了 PyCharm，也不一定已经有可以运行代码的 Python 解释器。',
      },
    },
  },
{
    id: 'scene-10',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '浏览器里的交互式 Python',
      replDemo: {
        steps: [
          { input: '1 + 2', promptPredict: '会得到什么？', output: '3', note: '表达式会被计算' },
          { input: '"1 + 2"', promptPredict: '和刚才一样吗？', output: "'1 + 2'", note: '引号里是文字，原样留下' },
          { input: 'print("Hello, Python!")', output: 'Hello, Python!' },
        ],
        suitedFor: ['快速尝试', '验证表达式', '观察结果'],
        designNote: '把讲解和可执行代码放在同一页，是非常适合初学者的设计。',
      },
    },
  },
{
    id: 'scene-11',
    type: 'explain',
    layout: 'fullscreen',
    content: {
      headline: '从文件到输出',
      stepExec: {
        filename: 'hello.py',
        pipeline: [
          'hello.py',
          '解释器读取一行',
          '理解 print 指令',
          '执行指令',
          'Console 显示结果',
        ],
        lines: ['print("第一行")', 'print("第二行")', 'print("第三行")'],
        outputs: ['第一行', '第二行', '第三行'],
        conclusion: '默认情况下，Python 从上到下，一次执行一条语句。',
      },
    },
  }
];
