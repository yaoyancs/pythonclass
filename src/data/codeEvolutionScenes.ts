import type { DraftScene, CodeEvolutionStep } from '../types/scene';
import { videoEvolutionByPart } from './videoEvolution';

/**
 * Existing lecture08 part registry remains authoritative.
 * Turn verified on-screen code examples into teachable micro-steps, not static slides.
 * Three modes per example: problem -> animated edit -> prediction -> real Python execution.
 * Teacher annotations expand individually without taking over projected screen.
 */
const chapterNames: Record<string, string> = {
  'fn-why': '函数调用：从熟悉的函数出发',
  'fn-def': '定义函数：从固定功能到参数与返回值',
  'fn-call': '作用域与闭包：变量在哪里有效',
  'fn-ext': '参数扩展：默认值和关键字参数',
  'fn-varargs': '可变参数：位置与关键字的收集',
  'fn-unpack': '解包：把容器拆开传递',
  'fn-fnarg': '函数也可以作为参数',
  'fn-higher': '高阶函数：将处理规则参数化',
  'fn-lambda': '匿名函数：用表达式构造函数',
  'fn-recur': '递归：把问题交给规模更小的自己',
};

function makeSteps(part: string): CodeEvolutionStep[] {
  const cases = videoEvolutionByPart[part] ?? [];
  const result: CodeEvolutionStep[] = [];
  let previousCode = '';
  for (let i = 0; i < cases.length; i++) {
    const item = cases[i]!;
    const prompt = item.content.headline || item.title || '想一想为什么这样写';
    const idea = item.content.body || '';
    const code = item.code?.initial || '';
    const sourceName = item.content.afterRunPoints?.[0] || '';
    const nextQuestion = i + 1 < cases.length
      ? cases[i + 1]!.content.headline || ''
      : '我们可以从这些例子中归纳出什么设计规律？';
    const title = item.title || '';

    result.push({
      id: item.id + '-ask',
      phaseLabel: '01 · 发现问题',
      prompt,
      code: previousCode,
      talk: '先不要急着看答案。观察当前代码，想一想它是否已经满足新的需求？如果不满足，具体是哪个部分需要改变？',
      question: prompt,
      teacherNotes: `【情境】${title}。\n【引导】${prompt}\n【停顿】先请一名学生说明思路，不要立即揭示修改后的代码。\n【教学目的】从真实的代码需求自然引出下一个修改动作。`,
      mode: 'predict',
      pauseForQuestion: true,
      holdMs: 3000,
    });
    result.push({
      id: item.id + '-write',
      phaseLabel: '02 · 逐步改写',
      prompt: title,
      code,
      talk: idea,
      teacherNotes: `【本步讲稿】${idea}\n【操作】观看自动键入、删除、替换，着重说明绿色高亮的修改行。\n【为什么这样改】${prompt}\n【视频素材】${sourceName}`,
      mode: 'write',
      holdMs: 2800,
    });
    result.push({
      id: item.id + '-predict',
      phaseLabel: '03 · 运行前预测',
      prompt: '预测：这段程序运行后会发生什么？',
      code,
      talk: '观察新代码中修改的部分，先用自己的语言说出执行顺序或计算过程，再预测输出。',
      question: '会得到什么结果？如果出现错误，可能是什么原因？',
      teacherNotes: `【提问】请学生预测运行结果。\n【追问】结果从哪一行代码产生？参数实际绑定到了什么数据？\n【提醒】此时暂不运行，给学生独立思考的时间。\n【本例重点】${idea}`,
      mode: 'predict',
      pauseForQuestion: true,
    });
    result.push({
      id: item.id + '-run',
      phaseLabel: '04 · 运行与解释',
      prompt: '运行验证：预测正确吗？',
      code,
      talk: `${idea} 对照运行结果，解释函数调用、参数绑定或返回值所产生的具体影响。`,
      question: nextQuestion,
      teacherNotes: `【操作】运行当前完整代码并对照输出。\n【结果分析】${idea}\n【向下一步过渡】${nextQuestion}\n【素材】${sourceName}`,
      expectedOutput: item.expectedOutput,
      mode: 'run',
      holdMs: 3800,
    });
    previousCode = code;
  }
  return result;
}

export const codeEvolutionScenesByPart: Record<string, DraftScene[]> = Object.fromEntries(
  Object.keys(chapterNames).map(part => [
    part,
    [{
      id: `evolution-${part}`,
      title: `代码演进 · ${chapterNames[part]}`,
      type: 'run',
      layout: 'fullscreen',
      content: { codeEvolution: { steps: makeSteps(part) } },
      code: { initial: '', editable: true, resetToInitial: false },
    }],
  ]),
);
