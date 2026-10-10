import { useEffect } from 'react';
import type { TypeProbeContent } from '../../types/scene';
import { useSceneEngine } from '../../engine/SceneEngine';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: TypeProbeContent;
  sceneId: string;
}

const CODES = [
  'print(18 + 1)\nprint("18" + "1")\nprint(18.0 + 1)',
  'print(10 + 20)\nprint("10" + "20")',
  'age = input("请输入年龄：")\nprint(type(age))\nprint(age + 1)',
  'age = int(input("请输入年龄："))\nprint(age + 1)',
  'print(2 + 3)\nprint("2" + "3")\nprint(2 * 3)\nprint("2" * 3)',
];

function codeFor(phase: number): string | null {
  if (phase === 1 || phase === 2) return CODES[0];
  if (phase === 6) return CODES[1];
  if (phase === 7) return CODES[2];
  if (phase === 8) return CODES[3];
  if (phase >= 9) return CODES[4];
  return null;
}

export function TypeProbeStage({ sceneId }: Props) {
  const { dispatch } = useSceneEngine();
  const { phase, advance, done } = useStageAdvance(sceneId, 10);
  const code = codeFor(phase);

  useEffect(() => {
    if (!code) return;
    dispatch({ type: 'UPDATE_CODE', code, clearOutput: true });
  }, [code, dispatch]);

  return (
    <div
      className="mt-2 cursor-pointer select-none"
      onClick={() => advance()}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && advance()) event.preventDefault();
      }}
    >
      {phase === 0 && (
        <>
          <div className="flex justify-center gap-3 font-mono text-4xl font-semibold text-text-primary">
            <span>18</span>
            <span>&quot;18&quot;</span>
            <span>18.0</span>
          </div>
          <p className="mt-6 text-center text-2xl font-semibold text-accent">这三个东西一样吗？</p>
        </>
      )}
      {phase === 1 && (
        <p className="text-center text-2xl font-semibold text-accent">先预测，再运行右侧三行。</p>
      )}
      {phase === 2 && (
        <>
          <div className="space-y-2 text-center font-mono text-2xl text-text-primary">
            <p>19</p>
            <p>181</p>
            <p>19.0</p>
          </div>
          <p className="mt-5 text-center text-xl font-semibold text-accent">
            为什么都是「18」，Python 却做了三种处理？
          </p>
        </>
      )}
      {phase === 3 && (
        <>
          <p className="text-xl leading-relaxed text-text-primary">
            数据类型，就是告诉计算机：这个数据是什么，以及可以怎样处理它。
          </p>
          <div className="mt-3 space-y-1 font-mono text-lg text-text-primary">
            <p>18 → int → 可以做加减乘除</p>
            <p>18.0 → float → 可以做数值计算</p>
            <p>&quot;18&quot; → str → 当作文字处理</p>
            <p>True → bool → 表示真或假</p>
          </div>
          <p className="mt-3 text-lg text-text-secondary">Python 不只看见它长什么样，还必须知道它是什么。</p>
        </>
      )}
      {phase === 4 && (
        <>
          <p className="text-center font-mono text-4xl font-semibold text-text-primary">13800138000</p>
          <p className="mt-5 text-center text-2xl font-semibold text-accent">这是一个数字吗？电话号码要不要做 + 1？</p>
        </>
      )}
      {phase === 5 && (
        <>
          <div className="space-y-1 font-mono text-xl text-text-primary">
            <p>年龄：18</p>
            <p>电话号码：&quot;13800138000&quot;</p>
            <p>姓名：&quot;张三&quot;</p>
            <p>平均分：86.5</p>
            <p>是否及格：True</p>
          </div>
          <p className="mt-4 text-lg leading-relaxed text-text-primary">
            它们都可以存进计算机，但想对它们做的事情完全不同。数据要分类型，是因为不同的数据代表不同的意义，需要不同的操作。
          </p>
        </>
      )}
      {phase === 6 && (
        <>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-2xl bg-classroom-stage px-3 py-3">
              <p className="font-mono text-xl">10 + 20</p>
              <p className="mt-1 text-text-secondary">数值 + 数值</p>
              <p className="mt-1 text-xl font-semibold text-accent">加法 → 30</p>
            </div>
            <div className="rounded-2xl bg-classroom-stage px-3 py-3">
              <p className="font-mono text-xl">&quot;10&quot; + &quot;20&quot;</p>
              <p className="mt-1 text-text-secondary">文本 + 文本</p>
              <p className="mt-1 text-xl font-semibold text-accent">拼接 → 1020</p>
            </div>
          </div>
          <p className="mt-4 text-lg leading-relaxed text-text-primary">
            符号本身不能决定做什么，数据类型也参与决定操作的含义。
          </p>
        </>
      )}
      {phase === 7 && (
        <p className="text-xl leading-relaxed text-text-primary">
          输入 18，为什么不能得到 19？人看见的是 18，Python 看见的是 &quot;18&quot;。type(age) 是 str。
        </p>
      )}
      {phase === 8 && (
        <p className="text-xl leading-relaxed text-text-primary">
          &quot;18&quot; 是文本，不能按年龄计算。int(&quot;18&quot;) 得到 18，这时才能加 1。
        </p>
      )}
      {phase === 9 && (
        <>
          <p className="text-center text-2xl font-semibold leading-relaxed text-text-primary">
            数据类型不是给数据起名字。而是告诉 Python：这个数据应该被当成什么来理解和处理。
          </p>
          <p className="mt-4 text-center text-xl text-accent">先预测右侧最后一行。</p>
        </>
      )}
      {phase >= 10 && (
        <p className="text-center text-2xl font-semibold text-text-primary">&quot;2&quot; * 3 → &quot;222&quot;</p>
      )}
      {!done && <p className="mt-4 text-center text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}
