import { useSceneEngine } from '../../engine/SceneEngine';

export function BreakPanel() {
  const { scene } = useSceneEngine();
  if (!scene.break) return null;

  return (
    <div className="mt-8 space-y-8">
      <div>
        <p className="text-text-secondary uppercase tracking-wide text-sm mb-4">已完成</p>
        <ul className="space-y-3">
          {scene.break.recapItems.map((item) => (
            <li key={item} className="text-stage-body flex items-center gap-3">
              <span className="text-success text-2xl">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-stage-sub text-accent border-t border-classroom-border pt-8">
        {scene.break.previewText}
      </p>
      <p className="text-text-secondary text-lg">教师准备好后，点击「下一页」继续。</p>
    </div>
  );
}
