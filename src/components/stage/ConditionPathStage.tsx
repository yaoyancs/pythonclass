import { useEffect, useState } from 'react';
import { useSceneEngine } from '../../engine/SceneEngine';
import { useStageAdvance } from '../../hooks/useStageAdvance';
import type { ConditionPathContent } from '../../types/scene';

interface Props {
  content: ConditionPathContent;
  sceneId: string;
}

function Choice({
  question,
  options,
  okText,
  badText,
}: {
  question: string;
  options: { id: string; label: string; correct: boolean }[];
  okText: string;
  badText: string;
}) {
  const [choice, setChoice] = useState<string | null>(null);
  const picked = options.find((option) => option.id === choice);
  return (
    <div>
      <p className="text-xl text-text-secondary">{question}</p>
      <div className="mt-4 space-y-3">
        {options.map((option) => {
          const selected = choice === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setChoice(option.id)}
              className={`block w-full rounded-2xl border px-4 py-3 text-left text-lg ${
                selected
                  ? option.correct
                    ? 'border-accent bg-accent-muted'
                    : 'border-error bg-error/10'
                  : 'border-classroom-border'
              }`}
            >
              {option.label}
              {selected && (
                <span className={`ml-3 text-base font-semibold ${option.correct ? 'text-accent' : 'text-error'}`}>
                  {option.correct ? '正确' : '不正确'}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {picked && (
        <p className={`mt-5 text-xl font-semibold ${picked.correct ? 'text-accent' : 'text-error'}`}>
          {picked.correct ? okText : badText}
        </p>
      )}
    </div>
  );
}

function Next({ onClick, children }: { onClick: () => void; children: string }) {
  return (
    <button type="button" className="mt-6 text-left text-lg font-semibold text-accent" onClick={onClick}>
      {children}
    </button>
  );
}

const SORT_ITEMS = [
  { id: 'banana', name: '香蕉皮', bin: '厨余垃圾', src: '/lesson03/waste-banana.jpg' },
  { id: 'can', name: '易拉罐', bin: '可回收物', src: '/lesson03/waste-can.jpg' },
  { id: 'paper', name: '旧报纸', bin: '可回收物' },
] as const;

const SORT_BINS = ['厨余垃圾', '可回收物', '其他垃圾'] as const;

function ExprLife() {
  const [picked, setPicked] = useState<Record<string, string>>({});
  const done = SORT_ITEMS.every((item) => picked[item.id]);
  const right = SORT_ITEMS.every((item) => picked[item.id] === item.bin);
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">同一个分类系统，为什么结果不同？</h2>
      <p className="mt-3 text-xl text-text-secondary">先把每件物品放进垃圾桶，再说你依据什么判断。</p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {SORT_ITEMS.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-3xl bg-white">
            {'src' in item && item.src ? (
              <img src={item.src} alt={item.name} className="h-24 w-full object-cover" />
            ) : (
              <div className="flex h-24 items-center justify-center bg-[#f4efe4] text-2xl text-text-primary">旧报纸</div>
            )}
            <p className="px-3 pt-2 text-center text-lg">{item.name}</p>
            <div className="flex flex-wrap justify-center gap-1 p-2">
              {SORT_BINS.map((bin) => (
                <button
                  key={bin}
                  type="button"
                  onClick={() => setPicked((current) => ({ ...current, [item.id]: bin }))}
                  className={`rounded-lg border px-2 py-1 text-sm ${
                    picked[item.id] === bin ? 'border-accent bg-accent-muted' : 'border-classroom-border'
                  }`}
                >
                  {bin}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {done && (
        <p className={`mt-5 text-2xl font-semibold ${right ? 'text-accent' : 'text-error'}`}>
          {right
            ? '输入变了，判断依据也变了。程序要先问「是不是」，才能给出不同结果。'
            : '再看依据：香蕉皮是厨余，易拉罐和旧报纸是可回收物。'}
        </p>
      )}
    </div>
  );
}

function ExprBool() {
  const { dispatch } = useSceneEngine();
  const base = `item = "香蕉皮"\nprint(item == "香蕉皮")\nprint(item == "易拉罐")`;
  useEffect(() => {
    dispatch({ type: 'UPDATE_CODE', code: base, clearOutput: true });
  }, [base, dispatch]);
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">比较表达式的值</h2>
      <ul className="mt-5 space-y-3 text-xl">
        <li className="rounded-2xl bg-white px-4 py-3 font-mono">item == "香蕉皮"</li>
        <li className="rounded-2xl bg-white px-4 py-3 font-mono">item == "易拉罐"</li>
      </ul>
    </div>
  );
}

function ExprAnd() {
  const { dispatch } = useSceneEngine();
  const [banana, setBanana] = useState(true);
  const [harm, setHarm] = useState(false);
  const py = (value: boolean) => (value ? 'True' : 'False');
  const code = `is_banana = ${py(banana)}\nis_hazard = ${py(harm)}\nprint(is_banana and is_hazard)`;
  useEffect(() => {
    dispatch({ type: 'UPDATE_CODE', code, clearOutput: true });
  }, [code, dispatch]);
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">A and B 的值</h2>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Toggle label="is_banana" on={banana} set={setBanana} />
        <Toggle label="is_hazard" on={harm} set={setHarm} />
      </div>
      <p className="mt-6 text-xl text-text-secondary">A、B 都是 True 时为 True，否则为 False。</p>
    </div>
  );
}

function ExprOr() {
  const { dispatch } = useSceneEngine();
  const [can, setCan] = useState(false);
  const [paper, setPaper] = useState(true);
  const py = (value: boolean) => (value ? 'True' : 'False');
  const code = `is_can = ${py(can)}\nis_paper = ${py(paper)}\nprint(is_can or is_paper)`;
  useEffect(() => {
    dispatch({ type: 'UPDATE_CODE', code, clearOutput: true });
  }, [code, dispatch]);
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">A or B 的值</h2>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Toggle label="is_can" on={can} set={setCan} />
        <Toggle label="is_paper" on={paper} set={setPaper} />
      </div>
      <p className="mt-6 text-xl text-text-secondary">A、B 至少有一个是 True 时为 True，否则为 False。</p>
    </div>
  );
}

function ExprNot() {
  const { dispatch } = useSceneEngine();
  const [banana, setBanana] = useState(true);
  const py = (value: boolean) => (value ? 'True' : 'False');
  const code = `is_banana = ${py(banana)}\nprint(not is_banana)`;
  useEffect(() => {
    dispatch({ type: 'UPDATE_CODE', code, clearOutput: true });
  }, [code, dispatch]);
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">not A 的值</h2>
      <div className="mt-5">
        <Toggle label="is_banana" on={banana} set={setBanana} />
      </div>
      <p className="mt-6 text-xl text-text-secondary">A 为 True 时，not A 为 False。A 为 False 时，not A 为 True。</p>
    </div>
  );
}

function ExprCombine() {
  const { dispatch } = useSceneEngine();
  const code =
    'is_banana = True\nis_can = False\nis_paper = False\nprint(is_banana and not (is_can or is_paper))';
  useEffect(() => {
    dispatch({ type: 'UPDATE_CODE', code, clearOutput: true });
  }, [code, dispatch]);
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">运算顺序</h2>
      <p className="mt-3 text-xl text-text-secondary">not 先于 and，and 先于 or。</p>
      <Choice
        question="is_banana and not (is_can or is_paper) 的值是？"
        options={[
          { id: 'true', label: 'True', correct: true },
          { id: 'false', label: 'False', correct: false },
        ]}
        okText="括号中的 or 先计算，再计算 not，最后计算 and。"
        badText="先计算括号中的 or，再计算 not，最后计算 and。"
      />
    </div>
  );
}

function ExprShort({ sceneId }: { sceneId: string }) {
  const { phase, advance } = useStageAdvance(sceneId, 1);
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">右边还会执行吗？</h2>
      {phase === 0 && (
        <Choice
          question='False and print("执行了") 会打印「执行了」吗？'
          options={[
            { id: 'no', label: '不会', correct: true },
            { id: 'yes', label: '会', correct: false },
          ]}
          okText="and 的左边已经是 False，右边不再计算。"
          badText="先看左边：False 已经能决定 and 的结果。"
        />
      )}
      {phase >= 1 && (
        <div>
          <ul className="mt-4 space-y-3 text-xl">
            <li className="rounded-2xl bg-white px-4 py-3">False and … ：左边为假，右边不执行。</li>
            <li className="rounded-2xl bg-white px-4 py-3">True or … ：左边为真，右边不执行。</li>
          </ul>
          <p className="mt-5 text-xl font-semibold text-violet-600">用左边的真假决定右边还要不要算。</p>
        </div>
      )}
      {phase < 1 && <Next onClick={advance}>再看 or</Next>}
    </div>
  );
}

function ExprTruthy() {
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">不是布尔值，也能拿去判断</h2>
      <Choice
        question='if "香蕉皮" 和 if "" 分别走哪边？'
        options={[
          { id: 'split', label: '非空当作真，空字符串当作假', correct: true },
          { id: 'both', label: '都当作真，因为它们是字符串', correct: false },
          { id: 'err', label: '报错，if 只能写 True / False', correct: false },
        ]}
        okText="非空字符串、非零数字当作真。空字符串和 0 当作假。"
        badText="先运行左侧，看哪一句 print 出现了。"
      />
    </div>
  );
}

function ExprInputItem() {
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">为什么这里可以直接写 if item:，而不必写 if item != ""？</h2>
    </div>
  );
}

function ExprOperand({ sceneId }: { sceneId: string }) {
  const { phase, advance } = useStageAdvance(sceneId, 1);
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">and / or 返回的是哪个值？</h2>
      <Choice
        question='print("香蕉皮" and "易拉罐") 和 print("" or "暂未识别") 分别输出什么？'
        options={[
          { id: 'vals', label: '易拉罐，然后暂未识别', correct: true },
          { id: 'bools', label: 'True，然后 True', correct: false },
        ]}
        okText="「香蕉皮」当作真，所以 and 继续看右边，留下「易拉罐」。空字符串当作假，所以 or 继续看右边，留下「暂未识别」。"
        badText="两边都是字符串。先看左边当真还是当假，再看屏幕上留下的是哪一个值。"
      />
      {phase >= 1 && (
        <p className="mt-5 text-xl font-semibold text-violet-600">
          利用对象的真假决定是否继续计算，但返回的是某个操作数本身。
        </p>
      )}
      {phase < 1 && <Next onClick={advance}>揭示结论</Next>}
    </div>
  );
}

function ExprCmpBool() {
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">比较表达式可以参与布尔运算</h2>
      <ul className="mt-5 space-y-3 text-xl">
        <li className="rounded-2xl bg-white px-4 py-4">比较运算先于 not、and、or。</li>
        <li className="rounded-2xl bg-white px-4 py-4 font-mono">not item == &quot;香蕉皮&quot; 即 not (item == &quot;香蕉皮&quot;)</li>
      </ul>
    </div>
  );
}

const TERNARY_ITEMS = ['香蕉皮', '易拉罐', '旧报纸'] as const;

function ExprTernary({ sceneId }: { sceneId: string }) {
  const { dispatch } = useSceneEngine();
  const { phase, advance } = useStageAdvance(sceneId, 1);
  const [item, setItem] = useState<(typeof TERNARY_ITEMS)[number]>('香蕉皮');
  const hit = item === '香蕉皮';
  const message = hit ? '厨余垃圾' : '暂未识别';
  const code = `item = "${item}"\nmessage = "厨余垃圾" if item == "香蕉皮" else "暂未识别"\nprint(message)`;
  useEffect(() => {
    dispatch({ type: 'UPDATE_CODE', code: phase >= 1 ? code : '# 先看右侧选择了什么\n', clearOutput: true });
  }, [code, dispatch, phase]);
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">条件表达式</h2>
      <p className="mt-2 font-mono text-lg text-text-secondary">值1 if 条件 else 值2</p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {TERNARY_ITEMS.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setItem(name)}
            className={`rounded-2xl border px-3 py-4 text-lg ${
              item === name ? 'border-accent bg-accent-muted' : 'border-classroom-border bg-white'
            }`}
          >
            {name}
          </button>
        ))}
      </div>
      <ul className="mt-5 space-y-3 text-xl">
        <li className="flex justify-between rounded-2xl bg-white px-4 py-3">
          <span className="font-mono">item == "香蕉皮"</span>
          <span className={`font-semibold ${hit ? 'text-accent' : 'text-highlight'}`}>{String(hit)}</span>
        </li>
        <li className="flex justify-between rounded-2xl bg-white px-4 py-3">
          <span>表达式的值</span>
          <span className="font-semibold">{message}</span>
        </li>
      </ul>
      {phase >= 1 && (
        <p className="mt-5 text-xl font-semibold text-violet-600">
          先计算条件。条件为 True 时取左边的值，否则取 else 后面的值。结果是一个值，不是语句块。
        </p>
      )}
      {phase < 1 && <Next onClick={advance}>揭示代码</Next>}
    </div>
  );
}

function ExprEssence({ sceneId }: { sceneId: string }) {
  const { phase, advance } = useStageAdvance(sceneId, 2);
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">条件成立时，Python 选择了什么？</h2>
      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className={`rounded-3xl px-5 py-5 ${phase === 1 ? 'bg-accent-muted' : 'bg-white'}`}>
          <p className="text-lg font-semibold">条件表达式</p>
          <p className="mt-3 text-xl">判断为 True</p>
          <p className="mt-2 font-mono text-xl">选择「厨余垃圾」</p>
          <p className="mt-2 text-xl">再执行 message = 这个值</p>
          {phase >= 1 && <p className="mt-4 text-lg font-semibold text-accent">message = 只有一次。它算出一个值。</p>}
        </div>
        <div className={`rounded-3xl px-5 py-5 ${phase === 2 ? 'bg-accent-muted' : 'bg-white'}`}>
          <p className="text-lg font-semibold">if ... else</p>
          <p className="mt-3 text-xl">判断为 True，进入 if</p>
          <p className="mt-2 font-mono text-xl">执行其中的赋值语句</p>
          {phase >= 2 && <p className="mt-4 text-lg font-semibold text-accent">两个分支里各写一次赋值。它执行一个代码块。</p>}
        </div>
      </div>
      {phase >= 2 && (
        <p className="mt-5 text-xl font-semibold text-violet-600">
          条件表达式产生一个值。双分支决定执行哪个代码块。两种写法都只走一条路径。
        </p>
      )}
      {phase < 2 && <Next onClick={advance}>{phase === 0 ? '看左边：选出一个值' : '看右边：执行一个代码块'}</Next>}
    </div>
  );
}

function ExprChoose() {
  const [task, setTask] = useState<'label' | 'steps'>('label');
  const labelTask = task === 'label';
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">你会选择哪种写法？</h2>
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-classroom-playground p-1.5">
        <button
          type="button"
          onClick={() => setTask('label')}
          className={`rounded-xl py-3 text-lg font-semibold ${labelTask ? 'bg-white shadow-card' : 'text-text-secondary'}`}
        >
          任务 A：生成分类标签
        </button>
        <button
          type="button"
          onClick={() => setTask('steps')}
          className={`rounded-xl py-3 text-lg font-semibold ${!labelTask ? 'bg-white shadow-card' : 'text-text-secondary'}`}
        >
          任务 B：分类并给出提醒
        </button>
      </div>
      <p className="mt-4 text-xl text-text-secondary">
        {labelTask
          ? '根据是不是香蕉皮，给 category 赋「厨余垃圾」或「暂未识别」。'
          : '识别成功要输出三句：分类成功、类别、投放提醒。失败要输出两句提示。最后都打印「本次分类结束」。'}
      </p>
      <div className="mt-4">
        <Choice
          key={task}
          question="这个任务更适合哪一种？"
          options={
            labelTask
              ? [
                  { id: 'expr', label: '条件表达式', correct: true },
                  { id: 'if', label: 'if ... else', correct: false },
                ]
              : [
                  { id: 'if', label: 'if ... else', correct: true },
                  { id: 'expr', label: '条件表达式', correct: false },
                ]
          }
          okText={
            labelTask
              ? '只要选出一个值。条件表达式：根据条件，选择一个值。'
              : '每条路径有多条操作。双分支语句：根据条件，执行一个代码块。'
          }
          badText={
            labelTask
              ? '这里没有一组操作，只是给 category 一个名称。'
              : '每边不止一句。用双分支把操作分开写更清楚。'
          }
        />
      </div>
    </div>
  );
}

function ExprReview() {
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">else 后面的值</h2>
      <Choice
        question='item 的值是「易拉罐」。这个条件表达式输出什么？'
        options={[
          { id: 'other', label: '其他垃圾', correct: true },
          { id: 'recycle', label: '可回收物', correct: false },
          { id: 'error', label: '程序报错', correct: false },
        ]}
        okText="输出是「其他垃圾」。条件为 False 只说明不是香蕉皮，这个值并不等于正确分类。"
        badText={'易拉罐使 item == "香蕉皮" 为 False，表达式取 else 后面的值。'}
      />
    </div>
  );
}

function BranchMeet() {
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">条件成立时才执行语句</h2>
      <p className="mt-3 text-xl text-text-secondary">比较表达式已经得到 True 或 False。若只在条件成立时执行语句，使用 if。</p>
      <div className="mt-5 overflow-hidden rounded-3xl bg-white">
        <img src="/lesson03/waste-medicine.jpg" alt="过期药品" className="mx-auto h-40 object-cover" />
      </div>
      <div className="mt-4">
        <Choice
          question="遇到过期药品，要不要多显示一条投放提醒？其他物品呢？"
          options={[
            { id: 'only', label: '只有过期药品显示提醒', correct: true },
            { id: 'all', label: '每种物品都显示这条提醒', correct: false },
          ]}
          okText="该语句只在条件成立时执行。条件不成立时跳过语句块，后续语句继续执行。"
          badText="易拉罐不执行这条有害垃圾提示。"
        />
      </div>
    </div>
  );
}

function BranchTrace({ sceneId }: { sceneId: string }) {
  const { dispatch } = useSceneEngine();
  const { phase, advance } = useStageAdvance(sceneId, 1);
  const hazard = phase === 0;
  const rows = hazard
    ? [
        { text: 'item = "过期药品"', note: '赋值' },
        { text: 'if item == "过期药品"', note: 'True' },
        { text: '    print("请按有害垃圾要求投放")', note: '执行' },
        { text: 'print("分类检查结束")', note: '执行' },
      ]
    : [
        { text: 'item = "易拉罐"', note: '赋值' },
        { text: 'if item == "过期药品"', note: 'False' },
        { text: '    print("请按有害垃圾要求投放")', note: '跳过' },
        { text: 'print("分类检查结束")', note: '执行' },
      ];
  const code = hazard
    ? 'item = "过期药品"\nif item == "过期药品":\n    print("请按有害垃圾要求投放")\nprint("分类检查结束")'
    : 'item = "易拉罐"\nif item == "过期药品":\n    print("请按有害垃圾要求投放")\nprint("分类检查结束")';
  useEffect(() => {
    dispatch({ type: 'UPDATE_CODE', code, clearOutput: true });
  }, [code, dispatch]);
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">{hazard ? '条件为 True：执行语句块' : '条件为 False：跳过语句块'}</h2>
      <ul className="mt-5 space-y-2">
        {rows.map((row) => (
          <li key={row.text} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
            <span className="font-mono text-lg">{row.text}</span>
            <span className={`text-lg font-semibold ${row.note === '跳过' ? 'text-text-secondary' : 'text-accent'}`}>
              {row.note}
            </span>
          </li>
        ))}
      </ul>
      {phase < 1 && <Next onClick={advance}>换成易拉罐</Next>}
    </div>
  );
}

function ExprChain() {
  const { state } = useSceneEngine();
  const ran = state.sceneLocal.runCount > 0;
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">连着写，和拆开写一样吗？</h2>
      <Choice
        question="minutes 是 18。15 <= minutes < 30 和 minutes >= 15 and minutes < 30 的结果？"
        options={[
          { id: 'same', label: '都是 True', correct: true },
          { id: 'diff', label: '链式比较会报错', correct: false },
        ]}
        okText="链式比较就是两项比较用 and 连起来。18 既不小于 15，也小于 30。"
        badText="先看 18 是否大于等于 15，再看它是否小于 30。"
      />
      {ran && (
        <p className="mt-5 text-xl font-semibold leading-relaxed text-error">
          链式比较：适合表达“一个数在某个区间内”。
          <br />
          and逻辑运算：适合表达“多个条件必须同时满足”。
        </p>
      )}
    </div>
  );
}

function ExprOneSide() {
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">没被选中的一边会执行吗？</h2>
      <Choice
        question='item 是香蕉皮，条件 item == "易拉罐" 为 False。会打印什么？'
        options={[
          { id: 'else', label: '只打印「未识别」', correct: true },
          { id: 'both', label: '「厨余」和「未识别」都打印', correct: false },
        ]}
        okText="条件为假，只计算 else 后面的表达式。这和短路一样：没被选中的一边不执行。"
        badText="先看中间的条件。它不成立，左边的 print 不会运行。"
      />
    </div>
  );
}

function BranchAssign() {
  return (
    <div>
      <Choice
        question="if battery = 15 能运行吗？"
        options={[
          { id: 'err', label: '不能，运行前就报错', correct: true },
          { id: 'yes', label: '能，会打印返航提醒', correct: false },
        ]}
        okText="一个 = 是赋值，不能放在 if 后面。要问是不是 15，写成 =="
        badText="运行左侧。语法还没通过，提醒那一行不会执行。"
      />
    </div>
  );
}

function BranchInput() {
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">从键盘读来的电量能直接比大小吗？</h2>
      <Choice
        question='battery 是 input() 得到的 "15"。if battery < 20 会怎样？'
        options={[
          { id: 'err', label: '报错，文字不能和数字比', correct: true },
          { id: 'yes', label: '成立，打印返航提醒', correct: false },
        ]}
        okText={'input() 得到的是字符串。"15" < 20 比的是文字和数字。要先写成 int(battery)。'}
        badText="引号里的 15 是文字，不是数值 15。"
      />
    </div>
  );
}

function BranchSyntax() {
  const rows = [
    ['条件', 'item == "过期药品"'],
    ['冒号', '条件之后的 :'],
    ['语句块', '缩进的 print'],
  ];
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">if 语句的三个部分</h2>
      <ul className="mt-5 space-y-3">
        {rows.map(([name, detail]) => (
          <li key={name} className="flex items-center justify-between rounded-2xl bg-white px-4 py-4">
            <span className="text-2xl font-semibold">{name}</span>
            <span className="font-mono text-lg text-text-secondary">{detail}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-xl text-text-secondary">冒号引出语句块。缩进相同的语句属于这个 if。</p>
    </div>
  );
}

function BranchIndent() {
  const { dispatch } = useSceneEngine();
  const [indented, setIndented] = useState(false);
  const tail = indented ? '    print("分类检查结束")' : 'print("分类检查结束")';
  const code = `item = "易拉罐"\nif item == "过期药品":\n    print("请按有害垃圾要求投放")\n${tail}`;
  useEffect(() => {
    dispatch({ type: 'UPDATE_CODE', code, clearOutput: true });
  }, [code, dispatch]);
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">缩进决定语句块</h2>
      <Choice
        question="item 的值是易拉罐。若把「分类检查结束」缩进 if，它还会输出吗？"
        options={[
          { id: 'no', label: '不会。它属于该语句块', correct: true },
          { id: 'yes', label: '会。它在 if 之后', correct: false },
        ]}
        okText="缩进决定语句是否属于该 if。条件为 False 时，整个语句块被跳过。"
        badText="看这行 print 是否位于 if 的缩进之内。"
      />
      <button
        type="button"
        onClick={() => setIndented((value) => !value)}
        className="mt-5 rounded-2xl bg-white px-4 py-3 text-lg font-semibold"
      >
        {indented ? '已缩进：条件为 False，两行都跳过' : '未缩进：分类检查结束仍会执行'}
      </button>
    </div>
  );
}

function BranchQuiz() {
  const { dispatch } = useSceneEngine();
  const [item, setItem] = useState('易拉罐');
  const hit = item === '过期药品';
  const code = `item = "${item}"\nif item == "过期药品":\n    print("请按有害垃圾要求投放")\nprint("分类检查结束")`;
  useEffect(() => {
    dispatch({ type: 'UPDATE_CODE', code, clearOutput: true });
  }, [code, dispatch]);
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">哪些语句会执行？</h2>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {['过期药品', '易拉罐', '香蕉皮'].map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setItem(name)}
            className={`rounded-2xl border px-3 py-3 text-lg ${
              item === name ? 'border-accent bg-accent-muted' : 'border-classroom-border bg-white'
            }`}
          >
            {name}
          </button>
        ))}
      </div>
      <ul className="mt-4 space-y-3 text-xl">
        <li className="flex justify-between rounded-2xl bg-white px-4 py-3">
          <span>有害垃圾提醒</span>
          <span className={hit ? 'font-semibold text-accent' : 'text-text-secondary'}>{hit ? '执行' : '跳过'}</span>
        </li>
        <li className="flex justify-between rounded-2xl bg-white px-4 py-3">
          <span>分类检查结束</span>
          <span className="font-semibold text-accent">执行</span>
        </li>
      </ul>
      <p className="mt-5 text-xl font-semibold text-violet-600">
        满足条件才执行指定代码块；不满足就跳过，程序继续向下运行。
      </p>
    </div>
  );
}

function BranchPractice() {
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">随堂练习：低电量才提醒</h2>
      <p className="mt-3 text-lg text-text-secondary">电量低于 20 才多一句返航提醒。自检结束每次都要有。</p>
      <ul className="mt-5 space-y-2">
        {[
          ['battery = 15', '电量不足，请返航', '自检结束'],
          ['battery = 40', '不打印返航提醒', '自检结束'],
        ].map(([when, mid, end]) => (
          <li key={when} className="rounded-2xl bg-white px-4 py-3 text-xl">
            <span className="font-mono text-text-secondary">{when}</span>
            <span className="mt-1 block">{mid}</span>
            <span className="block font-semibold">{end}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DualGap() {
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">条件不成立时没有另一条语句</h2>
      <Choice
        question="只有香蕉皮会打印「厨余垃圾」。item 为易拉罐时，输出什么分类说明？"
        options={[
          { id: 'none', label: '没有分类说明，只执行后续语句', correct: true },
          { id: 'other', label: '输出「其他垃圾」', correct: false },
        ]}
        okText="单分支在条件不成立时跳过语句块。需要另一条语句时，使用 else。"
        badText="这段代码没有 else。易拉罐不会进入分类说明。"
      />
    </div>
  );
}

function DualPaths() {
  const { dispatch } = useSceneEngine();
  const [item, setItem] = useState('香蕉皮');
  const hit = item === '香蕉皮';
  const code = `item = "${item}"\nif item == "香蕉皮":\n    print("厨余垃圾")\nelse:\n    print("暂未识别，请查询分类指南")\nprint("本次分类检查完成")`;
  useEffect(() => {
    dispatch({ type: 'UPDATE_CODE', code, clearOutput: true });
  }, [code, dispatch]);
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">两条语句块，只执行一条</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {['香蕉皮', '易拉罐'].map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setItem(name)}
            className={`rounded-2xl border px-3 py-3 text-lg ${
              item === name ? 'border-accent bg-accent-muted' : 'border-classroom-border bg-white'
            }`}
          >
            {name}
          </button>
        ))}
      </div>
      <ul className="mt-4 space-y-3 text-xl">
        <li className="flex justify-between rounded-2xl bg-white px-4 py-3">
          <span>if 厨余垃圾</span>
          <span className={hit ? 'font-semibold text-accent' : 'text-text-secondary'}>{hit ? '执行' : '跳过'}</span>
        </li>
        <li className="flex justify-between rounded-2xl bg-white px-4 py-3">
          <span>else 暂未识别</span>
          <span className={!hit ? 'font-semibold text-accent' : 'text-text-secondary'}>{hit ? '跳过' : '执行'}</span>
        </li>
        <li className="flex justify-between rounded-2xl bg-white px-4 py-3">
          <span>本次分类检查完成</span>
          <span className="font-semibold text-accent">执行</span>
        </li>
      </ul>
    </div>
  );
}

function DualMeaning() {
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">else 表示条件不成立</h2>
      <Choice
        question="item 是易拉罐，else 中打印「其他垃圾」。这个输出正确吗？"
        options={[
          { id: 'no', label: '不正确。不成立只说明不是香蕉皮', correct: true },
          { id: 'yes', label: '正确。else 就是其他垃圾', correct: false },
        ]}
        okText="else 表示前面的条件不成立，不表示另一种正确分类。"
        badText="易拉罐使条件为 False，于是执行 else。执行了，不等于分类正确。"
      />
    </div>
  );
}

function DualCompare() {
  const { dispatch } = useSceneEngine();
  const [block, setBlock] = useState(false);
  const expr = 'item = "香蕉皮"\nmessage = "厨余垃圾" if item == "香蕉皮" else "暂未识别"\nprint(message)';
  const stmt =
    'item = "香蕉皮"\nif item == "香蕉皮":\n    print("厨余垃圾")\n    print("已记录投放")\nelse:\n    print("暂未识别")\n    print("请查询分类指南")';
  useEffect(() => {
    dispatch({ type: 'UPDATE_CODE', code: block ? stmt : expr, clearOutput: true });
  }, [block, dispatch, expr, stmt]);
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">选择一个值，还是执行语句块</h2>
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-classroom-playground p-1.5">
        <button
          type="button"
          onClick={() => setBlock(false)}
          className={`rounded-xl py-3 text-lg font-semibold ${!block ? 'bg-white shadow-card' : 'text-text-secondary'}`}
        >
          条件表达式
        </button>
        <button
          type="button"
          onClick={() => setBlock(true)}
          className={`rounded-xl py-3 text-lg font-semibold ${block ? 'bg-white shadow-card' : 'text-text-secondary'}`}
        >
          if ... else
        </button>
      </div>
      <p className="mt-5 text-xl">{block ? '按条件执行不同的语句块。' : '按条件选择一个值。'}</p>
      <div className="mt-4">
        <Choice
          question="每条分支要执行多条语句时，用哪一种？"
          options={[
            { id: 'if', label: 'if ... else', correct: true },
            { id: 'expr', label: '条件表达式', correct: false },
          ]}
          okText="一条分支只有一个值时用条件表达式。一条分支有多条语句时用 if ... else。"
          badText="条件表达式只产生一个值，不能包含多条语句。"
        />
      </div>
    </div>
  );
}

function DualPractice() {
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">随堂练习：两条路径</h2>
      <p className="mt-3 text-lg text-text-secondary">低于 20 走返航，否则说明电量正常。自检结束两条路径之后都要有。</p>
      <ul className="mt-5 space-y-2">
        {[
          ['battery = 15', '电量不足，请返航', '自检结束'],
          ['battery = 40', '电量正常', '自检结束'],
        ].map(([when, mid, end]) => (
          <li key={when} className="rounded-2xl bg-white px-4 py-3 text-xl">
            <span className="font-mono text-text-secondary">{when}</span>
            <span className="mt-1 block">{mid}</span>
            <span className="block font-semibold">{end}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DualElseBug() {
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">else 与哪一个 if 配对</h2>
      <Choice
        question="item 的值是香蕉皮。这段程序输出什么？"
        options={[
          { id: 'both', label: '厨余垃圾，以及暂未识别', correct: true },
          { id: 'one', label: '只有厨余垃圾', correct: false },
          { id: 'can', label: '可回收物', correct: false },
        ]}
        okText="else 与它前面最近的 if 配对。第一个 if 已经执行，第二个条件为 False，于是执行 else。"
        badText="这里是两个独立的 if。else 不与第一个 if 配对。"
      />
      <p className="mt-5 text-xl font-semibold text-violet-600">else 只属于与它对齐的那个 if。</p>
    </div>
  );
}

function CrosswalkScene({ at = true, ped = true }: { at?: boolean; ped?: boolean }) {
  const carX = at ? 48 : 4;
  const personX = at ? 318 : 430;
  return (
    <svg viewBox="0 0 520 200" className="h-40 w-full" aria-label="汽车与斑马线">
      <rect x="0" y="70" width="520" height="90" fill="#d8dde4" />
      <rect x="0" y="112" width="520" height="6" fill="#f4f6f8" opacity="0.7" />
      {Array.from({ length: 7 }, (_, index) => (
        <rect key={index} x={248} y={76 + index * 12} width="92" height="7" rx="1" fill="#f7f8fa" />
      ))}
      <rect x="236" y="70" width="8" height="90" fill="#c0392b" />
      <g transform={`translate(${carX} 0)`}>
        <rect x="0" y="92" width="108" height="42" rx="10" fill="#4a5568" />
        <rect x="30" y="100" width="52" height="18" rx="4" fill="#e8edf4" />
        <circle cx="24" cy="138" r="11" fill="#1e2430" />
        <circle cx="84" cy="138" r="11" fill="#1e2430" />
      </g>
      {ped && (
        <g>
          <circle cx={personX} cy="96" r="10" fill="#1b3a6b" />
          <rect x={personX - 8} y="106" width="16" height="28" rx="6" fill="#1b3a6b" />
        </g>
      )}
    </svg>
  );
}

const CROSSWALK_RULES = [
  ['到了 · 有人', '停车让行'],
  ['到了 · 没人', '按限速通过'],
  ['还没到线', '继续正常行驶'],
] as const;

function RuleList() {
  return (
    <ul className="space-y-2">
      {CROSSWALK_RULES.map(([when, then]) => (
        <li key={when} className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl bg-white px-4 py-3">
          <span className="text-xl text-text-secondary">{when}</span>
          <span className="text-xl font-semibold text-text-primary">{then}</span>
        </li>
      ))}
    </ul>
  );
}

function BoolCover() {
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">单一条件，能决定是否出行吗？</h2>
      <p className="mt-4 text-xl text-text-secondary">户外计划、暴雨预警、大风预警、预警是否已核验。数据为课堂模拟。</p>
      <div className="mt-8 grid grid-cols-2 gap-4 text-center text-xl">
        <div className="rounded-2xl bg-white px-4 py-6">暴雨预警</div>
        <div className="rounded-2xl bg-white px-4 py-6">大风预警</div>
      </div>
    </div>
  );
}

function BoolConflict() {
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">只看暴雨为 False，等于没有风险吗？</h2>
      <Choice
        question="rain_warning = False，wind_warning = True。print(rain_warning) 得到 False。能否据此说没有风险？"
        options={[
          { id: 'safe', label: '可以，False 就是没有风险', correct: false },
          { id: 'miss', label: '不能，大风这一问还没问', correct: true },
        ]}
        okText="一个条件只回答一个问题。两种预警要用 and / or 组合。"
        badText="左侧只打印了暴雨这一问，大风是 True。"
      />
    </div>
  );
}

function BoolTrace({ sceneId }: { sceneId: string }) {
  const { phase, advance } = useStageAdvance(sceneId, 2);
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">两种预警有多少种组合？</h2>
      {phase >= 1 && (
        <table className="mt-6 w-full text-left text-lg">
          <thead>
            <tr>
              <th className="pb-2">暴雨</th>
              <th className="pb-2">大风</th>
              <th className="pb-2">只看暴雨</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['False', 'False', '不提醒'],
              ['True', 'False', '提醒'],
              ['False', 'True', '漏掉'],
              ['True', 'True', '提醒'],
            ].map((row) => (
              <tr key={row.join()}>
                {row.map((cell) => (
                  <td key={cell} className={`py-2 ${cell === '漏掉' ? 'font-semibold text-error' : ''}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {phase >= 2 && <p className="mt-6 text-2xl font-semibold text-violet-600">组合条件需要 and / or，而不是再写一个无关的 if 就完事。</p>}
      {phase < 2 && <Next onClick={advance}>{phase === 0 ? '列出组合' : '揭示结论'}</Next>}
    </div>
  );
}

function BoolSyntax() {
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">and　or　not</h2>
      <ul className="mt-6 space-y-4 text-xl">
        <li>
          <span className="font-mono text-accent">and</span>：两边都真才真
        </li>
        <li>
          <span className="font-mono text-accent">or</span>：有一边真就真
        </li>
        <li>
          <span className="font-mono text-accent">not</span>：把真假反过来
        </li>
      </ul>
    </div>
  );
}

function BoolLab() {
  const { dispatch } = useSceneEngine();
  const [rain, setRain] = useState(false);
  const [wind, setWind] = useState(true);
  const [op, setOp] = useState<'and' | 'or'>('or');
  const code = `rain_warning = ${rain ? 'True' : 'False'}\nwind_warning = ${wind ? 'True' : 'False'}\nprint(rain_warning ${op} wind_warning)`;
  useEffect(() => {
    dispatch({ type: 'UPDATE_CODE', code, clearOutput: true });
  }, [code, dispatch]);
  const hit = op === 'and' ? rain && wind : rain || wind;
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">点真值，看 and / or</h2>
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-classroom-playground p-1.5">
        <button
          type="button"
          onClick={() => setOp('and')}
          className={`rounded-xl py-3 text-lg font-semibold ${op === 'and' ? 'bg-white shadow-card' : 'text-text-secondary'}`}
        >
          and
        </button>
        <button
          type="button"
          onClick={() => setOp('or')}
          className={`rounded-xl py-3 text-lg font-semibold ${op === 'or' ? 'bg-white shadow-card' : 'text-text-secondary'}`}
        >
          or
        </button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setRain((value) => !value)}
          className="rounded-2xl bg-white px-4 py-4 text-lg"
        >
          暴雨 {rain ? 'True' : 'False'}
        </button>
        <button
          type="button"
          onClick={() => setWind((value) => !value)}
          className="rounded-2xl bg-white px-4 py-4 text-lg"
        >
          大风 {wind ? 'True' : 'False'}
        </button>
      </div>
      <p className={`mt-6 text-2xl font-semibold ${hit ? 'text-accent' : 'text-text-secondary'}`}>
        rain {op} wind → {String(hit)}
      </p>
    </div>
  );
}

function BoolExtend({ sceneId }: { sceneId: string }) {
  const { phase, advance } = useStageAdvance(sceneId, 2);
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">尚未核验，能否视为没有预警？</h2>
      <p className="mt-4 text-xl">not warning_checked 为真，只说明「还没核验」，不说明「没有风险」。</p>
      {phase >= 1 && (
        <p className="mt-5 text-2xl font-semibold text-accent">缺信息时要单独提示，不要并进「没有预警」。</p>
      )}
      {phase >= 2 && (
        <p className="mt-5 text-2xl font-semibold text-violet-600">比较和组合只回答问题。下一步用 if / else 决定做哪一件事。</p>
      )}
      {phase < 2 && <Next onClick={advance}>{phase === 0 ? '揭示结论' : '下一步'}</Next>}
    </div>
  );
}

function NestCover() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <h2 className="title-stage text-4xl text-text-primary">三种情况，三种结论</h2>
      <div className="mt-4 overflow-hidden rounded-3xl bg-white px-3 pt-3">
        <CrosswalkScene />
      </div>
      <div className="mt-4">
        <RuleList />
      </div>
    </div>
  );
}

function NestConflict() {
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">一个 else 对应两种情况</h2>
      <ul className="mt-5 space-y-3 text-xl">
        <li className="rounded-2xl bg-white px-4 py-4">
          <span className="font-semibold">控制流：</span>
          and 为 False 时，执行 else。
        </li>
        <li className="rounded-2xl bg-white px-4 py-4">
          <span className="font-semibold">结论：</span>
          「未到线」和「到了线但没有人」都不能写成「可以加速通过」。
        </li>
      </ul>
      <p className="mt-5 text-xl font-semibold text-violet-600">会执行 else，不等于 else 里的语句正确。</p>
    </div>
  );
}

function NestTrace({ sceneId }: { sceneId: string }) {
  const { phase, advance } = useStageAdvance(sceneId, 1);
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">and 为假，原因只有一种吗？</h2>
      <div className="mt-5">
        <RuleList />
      </div>
      {phase >= 1 && (
        <p className="mt-5 text-2xl font-semibold text-violet-600">三句话，不能塞进一个 else。</p>
      )}
      {phase < 1 && <Next onClick={advance}>揭示结论</Next>}
    </div>
  );
}

function NestSyntax() {
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">嵌套　对照　and</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white px-4 py-4">
          <p className="text-lg font-semibold">嵌套</p>
          <p className="mt-3 text-xl leading-relaxed">外层：到了线吗<br />内层：线上有人吗</p>
          <p className="mt-4 text-lg text-accent">三句话都能说清</p>
        </div>
        <div className="rounded-2xl bg-white px-4 py-4">
          <p className="text-lg font-semibold">复合条件</p>
          <p className="mt-3 font-mono text-lg">at and pedestrian</p>
          <p className="mt-4 text-lg text-text-secondary">只覆盖「停车让行」</p>
        </div>
      </div>
    </div>
  );
}

function NestLab() {
  const { dispatch } = useSceneEngine();
  const [at, setAt] = useState(true);
  const [ped, setPed] = useState(true);
  const [chain, setChain] = useState(true);
  const nest = `at_crosswalk = ${at ? 'True' : 'False'}\npedestrian = ${ped ? 'True' : 'False'}\nif at_crosswalk:\n    if pedestrian:\n        print("停车让行")\n    else:\n        print("按限速通过")\nelse:\n    print("继续正常行驶")`;
  const flat = `at_crosswalk = ${at ? 'True' : 'False'}\npedestrian = ${ped ? 'True' : 'False'}\nif at_crosswalk and pedestrian:\n    print("停车让行")\nelif at_crosswalk:\n    print("按限速通过")\nelse:\n    print("继续正常行驶")`;
  const code = chain ? nest : flat;
  useEffect(() => {
    dispatch({ type: 'UPDATE_CODE', code, clearOutput: true });
  }, [code, dispatch]);
  const msg = !at ? '继续正常行驶' : ped ? '停车让行' : '按限速通过';
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="overflow-hidden rounded-3xl bg-white px-3 pt-2">
        <CrosswalkScene at={at} ped={ped} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl bg-classroom-playground p-1.5">
        <button
          type="button"
          onClick={() => setChain(false)}
          className={`rounded-xl py-3 text-lg font-semibold ${!chain ? 'bg-white shadow-card' : 'text-text-secondary'}`}
        >
          if ... elif ... else
        </button>
        <button
          type="button"
          onClick={() => setChain(true)}
          className={`rounded-xl py-3 text-lg font-semibold ${chain ? 'bg-white shadow-card' : 'text-text-secondary'}`}
        >
          嵌套 if
        </button>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setAt((value) => !value)}
          className={`rounded-2xl px-3 py-3 text-lg ${at ? 'bg-accent-muted text-accent' : 'bg-white text-text-secondary'}`}
        >
          到了线 {at ? 'True' : 'False'}
        </button>
        <button
          type="button"
          onClick={() => setPed((value) => !value)}
          className={`rounded-2xl px-3 py-3 text-lg ${ped ? 'bg-accent-muted text-accent' : 'bg-white text-text-secondary'}`}
        >
          有行人 {ped ? 'True' : 'False'}
        </button>
      </div>
      <p className="mt-4 text-2xl font-semibold text-text-primary">{msg}</p>
      <p className="mt-2 text-lg text-text-secondary">两种写法的输出相同。后一条件依赖前一条件时，可以用嵌套。</p>
    </div>
  );
}

function NestPractice() {
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">随堂练习：阅览室门禁</h2>
      <p className="mt-3 text-lg text-text-secondary">先判断是否工作日，再判断是否已闭馆。</p>
      <ul className="mt-5 space-y-2">
        {[
          ['工作日 · 未闭馆', '开放'],
          ['工作日 · 已闭馆', '已闭馆'],
          ['非工作日', '今日闭馆'],
        ].map(([when, then]) => (
          <li key={when} className="grid grid-cols-[1fr_auto] gap-3 rounded-2xl bg-white px-4 py-3 text-xl">
            <span className="text-text-secondary">{when}</span>
            <span className="font-semibold">{then}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ElifPractice() {
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">随堂练习：95 分是哪一档</h2>
      <Choice
        question="先运行左侧程序。95 分会打印什么？"
        options={[
          { id: 'good', label: '优秀', correct: false },
          { id: 'pass', label: '及格', correct: true },
          { id: 'fail', label: '不及格', correct: false },
        ]}
        okText="score >= 60 写在前面，95 分先满足这一条件。更具体的 score >= 90 应写在前面。"
        badText="先看哪一个条件先被判断。"
      />
    </div>
  );
}

function NestExtend() {
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">先写清三句话，再选结构</h2>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-3xl bg-white px-5 py-8 text-center">
          <p className="text-xl text-text-secondary">只要「停车」一句</p>
          <p className="mt-4 text-2xl font-semibold">用 and</p>
        </div>
        <div className="rounded-3xl bg-white px-5 py-8 text-center">
          <p className="text-xl text-text-secondary">三种结论不同</p>
          <p className="mt-4 text-2xl font-semibold">用嵌套</p>
        </div>
      </div>
    </div>
  );
}

function CloseValues() {
  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col">
      <p className="text-center text-3xl font-semibold">程序能运行，决策就一定正确吗？</p>
      <div className="mt-6 grid flex-1 grid-cols-3 gap-4">
        {[
          ['分类规则', 'else 写成另一种分类', '错误投放'],
          ['else 配对', '配到后一个 if', '多执行一条语句'],
          ['判断顺序', '宽条件写在前面', '进入错误分支'],
        ].map(([title, mid, end]) => (
          <div key={title} className="rounded-3xl border border-classroom-border bg-white px-4 py-6 text-center">
            <p className="text-2xl font-semibold">{title}</p>
            <p className="mt-4 text-lg text-text-secondary">{mid}</p>
            <p className="my-2 text-xl text-text-secondary">↓</p>
            <p className="text-xl font-semibold">{end}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 border-t border-classroom-border py-4 text-center text-2xl font-semibold">代码有逻辑，技术有责任</p>
    </div>
  );
}

function CloseSummary() {
  const keys = [
    '比较表达式的值是 True 或 False',
    '优先级：not、and、or；括号改变顺序',
    'if：条件成立时执行语句块',
    'if ... else：两条语句块只执行一条',
    'else：前面的条件都不成立',
    'elif：自上而下，命中后不再判断',
    '有包含关系时，更具体的条件写在前面',
    '条件表达式按条件选择一个值',
  ];
  return (
    <div className="flex h-full flex-col justify-center">
      <p className="text-center text-3xl font-semibold">条件控制</p>
      <ul className="mx-auto mt-8 max-w-3xl space-y-3">
        {keys.map((line) => (
          <li key={line} className="rounded-2xl bg-white px-5 py-3 text-xl">
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Homework() {
  return null;
}

function Thanks() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="relative px-14 py-12">
        <div className="pointer-events-none absolute inset-0 border border-accent/35" />
        <div className="pointer-events-none absolute inset-2 border border-accent/15" />
        <h2 className="font-display text-6xl tracking-[0.55em] text-[#1B3A6B]" style={{ writingMode: 'vertical-rl' }}>
          谢谢大家
        </h2>
      </div>
    </div>
  );
}

function Status({ name, ok, okText, badText }: { name: string; ok: boolean; okText: string; badText: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
      <span className="text-xl">{name}</span>
      <span className={`text-xl font-semibold ${ok ? 'text-accent' : 'text-error'}`}>
        {ok ? okText : badText}
      </span>
    </div>
  );
}

function CheckPanel() {
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">这次自检通过吗？</h2>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Status name="电量" ok okText="达标" badText="不足" />
        <Status name="定位" ok okText="正常" badText="异常" />
        <Status name="暴雨" ok okText="无" badText="有" />
        <Status name="大风" ok={false} okText="无" badText="有" />
      </div>
      <div className="mt-6">
        <Choice
          question="电量达标，定位正常，没有暴雨，有大风。"
          options={[
            { id: 'pass', label: '通过', correct: false },
            { id: 'hold', label: '不通过', correct: true },
          ]}
          okText="有大风。不能只看电量或定位。"
          badText="大风这一项还没过。"
        />
      </div>
    </div>
  );
}

function CheckConflict() {
  return (
    <Choice
      question="电量、定位都是 True，还有大风。这段程序会打印「任务准备完成」吗？"
      options={[
        { id: 'yes', label: '会打印', correct: true },
        { id: 'no', label: '不会打印', correct: false },
      ]}
      okText="or 没看天气。能运行，判断不合理。"
      badText="条件里只有电量 or 定位，天气没写进去。"
    />
  );
}

function CheckTrace({ sceneId }: { sceneId: string }) {
  const { phase, advance } = useStageAdvance(sceneId, 4);
  const rows = [
    { text: 'battery_ok = True', note: '赋值' },
    { text: 'gps_ok = True', note: '赋值' },
    { text: 'weather_alert = True', note: '有预警' },
    { text: 'if battery_ok or gps_ok', note: 'True' },
    { text: 'print("任务准备完成")', note: '执行' },
  ];
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">天气写了，条件看了吗？</h2>
      <ul className="mt-6 space-y-2">
        {rows.slice(0, phase + 1).map((row) => (
          <li key={row.text} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
            <span className="font-mono text-lg">{row.text}</span>
            <span className="text-lg font-semibold text-accent">{row.note}</span>
          </li>
        ))}
      </ul>
      {phase >= 4 && (
        <p className="mt-6 text-2xl font-semibold text-violet-600">变量里有预警，or 却没问它。</p>
      )}
      {phase < 4 && <Next onClick={advance}>下一行</Next>}
    </div>
  );
}

function CheckLab() {
  const { dispatch } = useSceneEngine();
  const [battery, setBattery] = useState(true);
  const [gps, setGps] = useState(true);
  const [wind, setWind] = useState(true);
  const py = (value: boolean) => (value ? 'True' : 'False');
  const code = `battery_ok = ${py(battery)}\ngps_ok = ${py(gps)}\nwind_alert = ${py(wind)}\nprint(battery_ok and gps_ok)\nprint(False or wind_alert)\nprint(not wind_alert)`;
  useEffect(() => {
    dispatch({ type: 'UPDATE_CODE', code, clearOutput: true });
  }, [code, dispatch]);
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">同一组数据，三种问法</h2>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <Toggle label="电量" on={battery} set={setBattery} />
        <Toggle label="定位" on={gps} set={setGps} />
        <Toggle label="大风" on={wind} set={setWind} />
      </div>
      <ul className="mt-5 space-y-3 text-xl">
        <li className="flex justify-between rounded-2xl bg-white px-4 py-3">
          <span className="font-mono">and</span>
          <span className="font-semibold">{String(battery && gps)}</span>
        </li>
        <li className="flex justify-between rounded-2xl bg-white px-4 py-3">
          <span className="font-mono">or</span>
          <span className="font-semibold">{String(wind)}</span>
        </li>
        <li className="flex justify-between rounded-2xl bg-white px-4 py-3">
          <span className="font-mono">not</span>
          <span className="font-semibold">{String(!wind)}</span>
        </li>
      </ul>
    </div>
  );
}

function CheckPractice() {
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">随堂练习：自检通过吗</h2>
      <p className="mt-3 text-lg text-text-secondary">电量、定位都要达标，并且没有暴雨、也没有大风。</p>
      <ul className="mt-5 space-y-2">
        {[
          ['当前数据', '电量 True，定位 True，暴雨 False，大风 True'],
          ['应当输出', '暂不通过'],
        ].map(([when, then]) => (
          <li key={when} className="grid grid-cols-[8rem_1fr] gap-3 rounded-2xl bg-white px-4 py-3 text-xl">
            <span className="text-text-secondary">{when}</span>
            <span className="font-semibold">{then}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Toggle({ label, on, set }: { label: string; on: boolean; set: (value: boolean) => void }) {
  return (
    <button type="button" onClick={() => set(!on)} className="rounded-2xl bg-white px-4 py-4 text-left text-lg">
      {label}
      <span className={`ml-3 font-semibold ${on ? 'text-accent' : 'text-text-secondary'}`}>
        {on ? 'True' : 'False'}
      </span>
    </button>
  );
}

function CheckAnd() {
  const { dispatch } = useSceneEngine();
  const [battery, setBattery] = useState(true);
  const [gps, setGps] = useState(true);
  const code = `battery_ok = ${battery ? 'True' : 'False'}\ngps_ok = ${gps ? 'True' : 'False'}\nprint(battery_ok and gps_ok)`;
  useEffect(() => {
    dispatch({ type: 'UPDATE_CODE', code, clearOutput: true });
  }, [code, dispatch]);
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">and：两项都要</h2>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Toggle label="电量" on={battery} set={setBattery} />
        <Toggle label="定位" on={gps} set={setGps} />
      </div>
      <p className="mt-6 font-mono text-2xl">{String(battery && gps)}</p>
    </div>
  );
}

function CheckOr() {
  const { dispatch } = useSceneEngine();
  const [rain, setRain] = useState(false);
  const [wind, setWind] = useState(true);
  const code = `rain_alert = ${rain ? 'True' : 'False'}\nwind_alert = ${wind ? 'True' : 'False'}\nprint(rain_alert or wind_alert)`;
  useEffect(() => {
    dispatch({ type: 'UPDATE_CODE', code, clearOutput: true });
  }, [code, dispatch]);
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">or：有一种就提醒</h2>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Toggle label="暴雨" on={rain} set={setRain} />
        <Toggle label="大风" on={wind} set={setWind} />
      </div>
      <p className="mt-6 font-mono text-2xl">{String(rain || wind)}</p>
    </div>
  );
}

function CheckNot() {
  const { dispatch } = useSceneEngine();
  const [alert, setAlert] = useState(true);
  const code = `weather_alert = ${alert ? 'True' : 'False'}\nprint(not weather_alert)`;
  useEffect(() => {
    dispatch({ type: 'UPDATE_CODE', code, clearOutput: true });
  }, [code, dispatch]);
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">not：真假反过来</h2>
      <div className="mt-6">
        <Toggle label="天气预警" on={alert} set={setAlert} />
      </div>
      <p className="mt-6 font-mono text-2xl">not → {String(!alert)}</p>
    </div>
  );
}

function CheckDebug() {
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">把 or 改成 and</h2>
      <p className="mt-6 font-mono text-xl leading-relaxed">
        battery_ok and gps_ok and not weather_alert
      </p>
    </div>
  );
}

function CheckTernary() {
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">先看中间，再选左右</h2>
      <p className="mt-6 font-mono text-xl leading-relaxed">
        "通过" if ready else "暂不通过"
      </p>
    </div>
  );
}

function CheckChallenge() {
  const { dispatch } = useSceneEngine();
  const [battery, setBattery] = useState(true);
  const [gps, setGps] = useState(true);
  const [rain, setRain] = useState(false);
  const [wind, setWind] = useState(false);
  const weather = rain || wind;
  const ready = battery && gps && !weather;
  const py = (value: boolean) => (value ? 'True' : 'False');
  const code = `battery_ok = ${py(battery)}\ngps_ok = ${py(gps)}\nrain_alert = ${py(rain)}\nwind_alert = ${py(wind)}\nweather_alert = rain_alert or wind_alert\nready = battery_ok and gps_ok and not weather_alert\nprint("通过" if ready else "暂不通过")`;
  useEffect(() => {
    dispatch({ type: 'UPDATE_CODE', code, clearOutput: true });
  }, [code, dispatch]);
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">改一项，结果跟着变</h2>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Toggle label="电量" on={battery} set={setBattery} />
        <Toggle label="定位" on={gps} set={setGps} />
        <Toggle label="暴雨" on={rain} set={setRain} />
        <Toggle label="大风" on={wind} set={setWind} />
      </div>
      <p className={`mt-5 text-2xl font-semibold ${ready ? 'text-accent' : 'text-error'}`}>
        {ready ? '通过' : '暂不通过'}
      </p>
    </div>
  );
}

export function ConditionPathStage({ content, sceneId }: Props) {
  const { topic, mode } = content;
  if (topic === 'expr') {
    if (mode === 'life') return <ExprLife />;
    if (mode === 'bool') return <ExprBool />;
    if (mode === 'and') return <ExprAnd />;
    if (mode === 'or') return <ExprOr />;
    if (mode === 'not') return <ExprNot />;
    if (mode === 'combine' || mode === 'precedence') return <ExprCombine />;
    if (mode === 'cmpBool') return <ExprCmpBool />;
    if (mode === 'chain') return <ExprChain />;
    if (mode === 'oneSide') return <ExprOneSide />;
    if (mode === 'short') return <ExprShort sceneId={sceneId} />;
    if (mode === 'truthy') return <ExprTruthy />;
    if (mode === 'inputItem') return <ExprInputItem />;
    if (mode === 'operand') return <ExprOperand sceneId={sceneId} />;
    if (mode === 'ternary') return <ExprTernary sceneId={sceneId} />;
    if (mode === 'essence') return <ExprEssence sceneId={sceneId} />;
    if (mode === 'choose') return <ExprChoose />;
    if (mode === 'compare') return <DualCompare />;
    if (mode === 'review') return <ExprReview />;
  }
  if (topic === 'branch') {
    if (mode === 'meet') return <BranchMeet />;
    if (mode === 'syntax') return <BranchSyntax />;
    if (mode === 'assign') return <BranchAssign />;
    if (mode === 'inputStr') return <BranchInput />;
    if (mode === 'trace') return <BranchTrace sceneId={sceneId} />;
    if (mode === 'indent') return <BranchIndent />;
    if (mode === 'quiz') return <BranchQuiz />;
    if (mode === 'practice') return <BranchPractice />;
  }
  if (topic === 'dual') {
    if (mode === 'gap') return <DualGap />;
    if (mode === 'paths') return <DualPaths />;
    if (mode === 'meaning') return <DualMeaning />;
    if (mode === 'compare') return <DualCompare />;
    if (mode === 'elseBug') return <DualElseBug />;
    if (mode === 'practice') return <DualPractice />;
  }
  if (topic === 'bool') {
    if (mode === 'cover') return <BoolCover />;
    if (mode === 'conflict') return <BoolConflict />;
    if (mode === 'trace') return <BoolTrace sceneId={sceneId} />;
    if (mode === 'syntax') return <BoolSyntax />;
    if (mode === 'lab') return <BoolLab />;
    if (mode === 'extend') return <BoolExtend sceneId={sceneId} />;
  }
  if (topic === 'nest') {
    if (mode === 'cover') return <NestCover />;
    if (mode === 'conflict') return <NestConflict />;
    if (mode === 'trace') return <NestTrace sceneId={sceneId} />;
    if (mode === 'syntax') return <NestSyntax />;
    if (mode === 'lab') return <NestLab />;
    if (mode === 'extend') return <NestExtend />;
    if (mode === 'practice') return <NestPractice />;
  }
  if (topic === 'check') {
    if (mode === 'panel') return <CheckPanel />;
    if (mode === 'conflict') return <CheckConflict />;
    if (mode === 'trace') return <CheckTrace sceneId={sceneId} />;
    if (mode === 'lab') return <CheckLab />;
    if (mode === 'practice') return <CheckPractice />;
    if (mode === 'and') return <CheckAnd />;
    if (mode === 'or') return <CheckOr />;
    if (mode === 'not') return <CheckNot />;
    if (mode === 'debug') return <CheckDebug />;
    if (mode === 'ternary') return <CheckTernary />;
    if (mode === 'challenge') return <CheckChallenge />;
  }
  if (topic === 'elif') {
    if (mode === 'practice') return <ElifPractice />;
  }
  if (topic === 'close') {
    if (mode === 'values') return <CloseValues />;
    if (mode === 'summary') return <CloseSummary />;
    if (mode === 'homework') return <Homework />;
    if (mode === 'thanks') return <Thanks />;
  }
  return null;
}
