import type { IntFloatContent } from '../../types/scene';
import { useStageAdvance } from '../../hooks/useStageAdvance';

interface Props {
  content: IntFloatContent;
  sceneId: string;
}

/** 0 整数精确存放 → 1 浮点数有小数点 → 2 == 比数值 */
export function IntFloatStage({ content, sceneId }: Props) {
  const { phase, advance, done } = useStageAdvance(sceneId, 2);
  const showFloat = phase >= 1;
  const showEqual = phase >= 2;
  const note = showEqual ? content.equalNote : showFloat ? content.floatNote : content.intNote;

  return (
    <div
      className="mt-3 cursor-pointer select-none"
      onClick={() => advance()}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && advance()) event.preventDefault();
      }}
    >
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl border-2 border-dashed border-accent bg-white px-3 py-3 text-center">
          <p className="text-sm leading-none text-text-secondary">int</p>
          <p className="mt-2 font-mono text-3xl leading-none text-text-primary">18</p>
          <p className="mt-2 text-sm leading-none text-text-secondary">精确整数</p>
        </div>
        <div
          className={`rounded-2xl border-2 border-dashed px-3 py-3 text-center ${
            showFloat ? 'border-accent bg-white' : 'border-classroom-border bg-white'
          }`}
        >
          <p className="text-sm leading-none text-text-secondary">float</p>
          <p className="mt-2 font-mono text-3xl leading-none text-text-primary">18.0</p>
          <p className={`mt-2 text-sm leading-none ${showFloat ? 'text-accent' : 'text-text-secondary'}`}>
            {showFloat ? '有小数点' : '？'}
          </p>
          <p className={`mt-1 text-xs leading-none text-text-secondary ${showFloat ? '' : 'invisible'}`}>
            和整数 18 写法不同
          </p>
        </div>
      </div>
      <p
        key={phase}
        className={`mt-3 title-kai text-lg leading-relaxed timeline-node-in ${
          showEqual
            ? 'rounded-3xl bg-accent-muted px-4 py-3 text-text-primary'
            : 'text-text-secondary'
        }`}
      >
        {note}
      </p>
      {!done && <p className="mt-3 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}
