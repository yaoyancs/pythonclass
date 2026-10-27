import type { LoopDrillFlowChart, LoopDrillFlowNode, LoopDrillFlowsContent } from '../../types/scene';

function Arrow() {
  return <p className="py-0.5 text-center text-lg leading-none text-accent">↓</p>;
}

function Node({ node }: { node: LoopDrillFlowNode }) {
  if (node.kind === 'start' || node.kind === 'end') {
    return (
      <div className="mx-auto w-fit rounded-full border-2 border-accent bg-accent-muted px-4 py-1.5 text-center text-base font-semibold">
        {node.text}
      </div>
    );
  }
  if (node.kind === 'decision') {
    return (
      <div className="mx-auto w-full max-w-[15rem]">
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-1 rotate-45 rounded-md border-2 border-accent bg-white" />
          <p className="relative z-10 whitespace-pre-line px-1 text-center text-sm font-semibold leading-tight">
            {node.text}
          </p>
        </div>
        {(node.yes || node.no) && (
          <div className="mt-2 grid grid-cols-2 gap-2 text-center text-sm">
            <p className="rounded-xl bg-accent-muted px-2 py-1.5 leading-snug">
              <span className="font-semibold text-accent">是</span>
              {node.yes ? `　${node.yes}` : ''}
            </p>
            <p className="rounded-xl bg-white px-2 py-1.5 leading-snug">
              <span className="font-semibold text-accent">否</span>
              {node.no ? `　${node.no}` : ''}
            </p>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-classroom-border bg-white px-3 py-2 text-center text-base leading-snug">
      {node.text}
    </div>
  );
}

function Chart({ chart }: { chart: LoopDrillFlowChart }) {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-3xl border border-classroom-border bg-classroom-playground/60 px-3 py-4">
      {chart.image ? (
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
          <img
            src={chart.image}
            alt={`${chart.title}：外层与内层嵌套，并标出回流`}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      ) : (
        <>
          <h3 className="text-center text-xl font-semibold text-accent">{chart.title}</h3>
          <div className="mt-3 flex flex-1 flex-col items-stretch justify-start">
            {(chart.nodes ?? []).map((node, index) => (
              <div key={`${chart.title}-${index}-${node.text}`}>
                {index > 0 && <Arrow />}
                <Node node={node} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/** 练习2：三种嵌套写法流程图并排对照。 */
export function LoopDrillFlowsStage({ content }: { content: LoopDrillFlowsContent }) {
  return (
    <div className="flex h-full flex-col">
      <h2 className="title-stage text-center text-3xl text-text-primary">{content.title}</h2>
      <p className="mt-2 text-center text-lg text-text-secondary">
        蓝色虚线框＝外层循环，橙色实线框＝内层循环；两侧箭头＝回流
      </p>
      <div className="mt-3 grid min-h-0 flex-1 grid-cols-3 gap-4">
        {content.charts.map((chart) => (
          <Chart key={chart.title} chart={chart} />
        ))}
      </div>
    </div>
  );
}
