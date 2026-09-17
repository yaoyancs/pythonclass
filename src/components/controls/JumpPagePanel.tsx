import { useSceneEngine } from "../../engine/SceneEngine";
import { TeacherPanel } from "./TeacherPanel";

interface JumpPagePanelProps {
  onClose: () => void;
}

export function JumpPagePanel({ onClose }: JumpPagePanelProps) {
  const { lesson, state, dispatch } = useSceneEngine();

  return (
    <TeacherPanel title="跳转到本讲某页" onClose={onClose} wide>
      <ul className="space-y-1.5">
        {lesson.scenes.map((scene, index) => {
          const current = index === state.currentSceneIndex;
          return (
            <li key={scene.id}>
              <button
                type="button"
                disabled={current}
                className={`w-full text-left rounded-xl px-4 py-3 border transition-colors ${
                  current
                    ? "border-accent bg-accent-muted text-accent cursor-default"
                    : "border-transparent hover:border-classroom-border hover:bg-classroom-playground"
                }`}
                onClick={() => {
                  dispatch({ type: "GOTO_SCENE", index });
                  onClose();
                }}
              >
                <span className="tabular-nums text-text-secondary mr-3 w-10 inline-block">
                  {scene.index}
                </span>
                {scene.partId && (
                  <span className="tabular-nums text-accent mr-2 text-sm">
                    {scene.partId}
                  </span>
                )}
                <span className="text-lg">{scene.title}</span>
                {scene.content.headline &&
                  scene.content.headline !== scene.title && (
                    <span className="ml-3 text-sm text-text-secondary truncate">
                      {scene.content.headline}
                    </span>
                  )}
                <span className="ml-3 text-sm text-text-secondary">
                  {scene.type}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </TeacherPanel>
  );
}
