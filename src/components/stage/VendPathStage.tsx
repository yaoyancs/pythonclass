import { useEffect, useState } from 'react';
import { useSceneEngine } from '../../engine/SceneEngine';
import type { VendPathContent } from '../../types/scene';

interface Props {
  content: VendPathContent;
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
                  : 'border-classroom-border bg-white'
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
        <p className={`mt-5 text-xl font-semibold leading-relaxed ${picked.correct ? 'text-accent' : 'text-error'}`}>
          {picked.correct ? okText : badText}
        </p>
      )}
    </div>
  );
}

function Guide({ content }: { content: VendPathContent }) {
  return (
    <div>
      {content.title && <h2 className="title-stage text-3xl text-text-primary">{content.title}</h2>}
      {content.image && (
        <img
          src={content.image.src}
          alt={content.image.alt}
          className="mt-5 max-h-56 w-full rounded-3xl object-cover"
        />
      )}
      {content.lead && (
        <div className="mt-5 space-y-3 text-xl leading-relaxed text-text-secondary">
          {content.lead.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}
      {content.tasks && (
        <div className="mt-6">
          <p className="text-xl font-semibold text-text-primary">程序需要完成的五项任务</p>
          <ol className="mt-3 space-y-3">
            {content.tasks.map((task) => (
              <li key={task.index} className="rounded-2xl bg-white px-4 py-3">
                <p className="text-lg font-semibold text-text-primary">
                  <span className="mr-2 text-accent">{task.index}</span>
                  {task.title}
                </p>
                <p className="mt-1 whitespace-pre-line text-lg leading-relaxed text-text-secondary">{task.body}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
      {content.rows && (
        <ul className="mt-5 space-y-3">
          {content.rows.map((row) => (
            <li key={row.name} className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-4">
              <span className="text-xl font-semibold">{row.name}</span>
              <span className="font-mono text-lg text-text-secondary">{row.detail}</span>
            </li>
          ))}
        </ul>
      )}
      {content.question && content.options && content.okText && content.badText && (
        <div className={content.title || content.rows ? 'mt-6' : ''}>
          <Choice
            question={content.question}
            options={content.options}
            okText={content.okText}
            badText={content.badText}
          />
        </div>
      )}
      {content.conclusion && <p className="mt-6 text-xl font-semibold leading-relaxed">{content.conclusion}</p>}
    </div>
  );
}

function Trace() {
  const { dispatch } = useSceneEngine();
  const [short, setShort] = useState(true);
  const balance = short ? 1 : 10;
  const code = `product = "橙汁"
price = 5
balance = ${balance}
print(f"您选择了：{product}")
if balance < price:
    print("余额不足，请先充值")
print("感谢使用，欢迎下次光临")`;
  useEffect(() => {
    dispatch({ type: 'UPDATE_CODE', code, clearOutput: true });
  }, [code, dispatch]);
  const rows = short
    ? [
        ['balance < price', 'True'],
        ['print("余额不足，请先充值")', '执行'],
        ['print("感谢使用，欢迎下次光临")', '执行'],
      ]
    : [
        ['balance < price', 'False'],
        ['print("余额不足，请先充值")', '跳过'],
        ['print("感谢使用，欢迎下次光临")', '执行'],
      ];
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">
        {short ? '条件为 True：执行语句块' : '条件为 False：跳过语句块'}
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[
          [true, 'balance = 1'],
          [false, 'balance = 10'],
        ].map(([on, label]) => (
          <button
            key={String(label)}
            type="button"
            onClick={() => setShort(Boolean(on))}
            className={`rounded-2xl border px-3 py-3 text-lg ${
              short === on ? 'border-accent bg-accent-muted' : 'border-classroom-border bg-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {rows.map(([text, note]) => (
          <li key={text} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
            <span className="font-mono text-lg">{text}</span>
            <span className={`text-lg font-semibold ${note === '跳过' ? 'text-text-secondary' : 'text-accent'}`}>
              {note}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-xl font-semibold leading-relaxed">
        单分支在条件为 False 时跳过语句块。语句块之后的语句继续执行。
      </p>
    </div>
  );
}

function Paths() {
  const { dispatch } = useSceneEngine();
  const [enough, setEnough] = useState(false);
  const balance = enough ? 10 : 1;
  const code = `product = "橙汁"
price = 5
balance = ${balance}
if balance >= price:
    print("付款成功")
    print("开始出货")
else:
    print("余额不足，无法购买")`;
  useEffect(() => {
    dispatch({ type: 'UPDATE_CODE', code, clearOutput: true });
  }, [code, dispatch]);
  return (
    <div>
      <h2 className="title-stage text-3xl text-text-primary">两条语句块，执行其中一条</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[
          [false, 'balance = 1'],
          [true, 'balance = 10'],
        ].map(([on, label]) => (
          <button
            key={String(label)}
            type="button"
            onClick={() => setEnough(Boolean(on))}
            className={`rounded-2xl border px-3 py-3 text-lg ${
              enough === on ? 'border-accent bg-accent-muted' : 'border-classroom-border bg-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <ul className="mt-4 space-y-3 text-xl">
        <li className="flex justify-between rounded-2xl bg-white px-4 py-3">
          <span>if 语句块</span>
          <span className={enough ? 'font-semibold text-accent' : 'text-text-secondary'}>{enough ? '执行' : '跳过'}</span>
        </li>
        <li className="flex justify-between rounded-2xl bg-white px-4 py-3">
          <span>else 语句块</span>
          <span className={!enough ? 'font-semibold text-accent' : 'text-text-secondary'}>{enough ? '跳过' : '执行'}</span>
        </li>
      </ul>
      <p className="mt-5 text-xl font-semibold leading-relaxed">
        if...else 中两个语句块互斥。同一语句块内的语句仍按顺序执行。
      </p>
    </div>
  );
}

function Values() {
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">分支写入的是交易规则</h2>
      <p className="mt-4 text-xl leading-relaxed text-text-secondary">
        balance 小于 price 时仍执行「付款成功」，程序可以运行结束，但结果与规则不符。分支结构把规则写成条件，由条件的值决定执行哪一语句块。
      </p>
      <p className="mt-6 text-2xl font-semibold">程序的输出必须与条件的求值结果一致。</p>
    </div>
  );
}

function Summary() {
  const rows = [
    ['顺序结构', '语句按书写顺序依次执行'],
    ['比较表达式', '求值为 True 或 False'],
    ['单分支', '条件为 False 时跳过语句块'],
    ['双分支', 'if 与 else 只执行一个语句块'],
    ['多分支', '自上而下，选中第一个值为 True 的分支'],
    ['嵌套分支', '外层条件为 False 时，内层不执行'],
    ['条件表达式', '按条件选择一个值，不构成语句块'],
  ];
  return (
    <div>
      <h2 className="title-stage text-4xl text-text-primary">分支结构</h2>
      <ul className="mt-6 space-y-3">
        {rows.map(([name, detail]) => (
          <li key={name} className="grid grid-cols-[9rem_1fr] gap-4 rounded-2xl bg-white px-5 py-3 text-xl">
            <span className="font-semibold text-accent">{name}</span>
            <span>{detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Thanks() {
  return (
    <div className="flex h-full items-center">
      <h2 className="title-stage text-6xl text-text-primary">谢谢</h2>
    </div>
  );
}

export function VendPathStage({ content }: Props) {
  switch (content.mode) {
    case 'guide':
      return <Guide content={content} />;
    case 'trace':
      return <Trace />;
    case 'paths':
      return <Paths />;
    case 'values':
      return <Values />;
    case 'summary':
      return <Summary />;
    case 'thanks':
      return <Thanks />;
  }
}
