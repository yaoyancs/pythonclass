import { useSceneEngine } from '../../engine/SceneEngine';
import { RevealPanel } from './RevealPanel';

export function SummaryPanel() {
  const { scene } = useSceneEngine();
  const checklist = scene.content.checklist;

  return (
    <div className="mt-8 space-y-8">
      {checklist && (
        // 两列排布，让整页清单在投影上一屏放得下
        <ul className="grid grid-cols-2 gap-x-10 gap-y-3">
          {checklist.map((item) => (
            <li key={item} className="text-stage-sub font-medium flex items-center gap-3 text-text-primary">
              <span className="text-success text-2xl font-semibold">✓</span>
              {item}
            </li>
          ))}
        </ul>
      )}
      {scene.content.body && (
        <p className="stage-emphasis title-stage text-stage-headline mt-10">{scene.content.body}</p>
      )}
      <RevealPanel />
      {scene.content.exitTicket && (
        <div className="rounded-2xl bg-classroom-playground border border-classroom-border p-8 mt-8">
          <p className="text-text-secondary text-sm uppercase tracking-[0.18em] font-semibold mb-2">
            Exit Ticket
          </p>
          <p className="text-stage-sub font-medium text-text-primary">{scene.content.exitTicket}</p>
        </div>
      )}
      {scene.content.preview && (
        <p className="stage-emphasis text-stage-sub mt-4">{scene.content.preview}</p>
      )}
    </div>
  );
}
