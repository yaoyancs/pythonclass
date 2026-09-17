import { useNavigate } from 'react-router-dom';
import { LECTURES, lecturePath } from '../../data/course';
import { useSceneEngine } from '../../engine/SceneEngine';
import { TeacherPanel } from './TeacherPanel';

interface JumpLessonPanelProps {
  onClose: () => void;
}

export function JumpLessonPanel({ onClose }: JumpLessonPanelProps) {
  const navigate = useNavigate();
  const { lesson } = useSceneEngine();

  return (
    <TeacherPanel title="跳转到某一讲" onClose={onClose}>
      <ul className="space-y-2">
        {LECTURES.map((lec) => {
          const current = lec.id === lesson.id;
          return (
            <li key={lec.id}>
              <button
                type="button"
                disabled={current}
                className={`w-full text-left rounded-2xl px-5 py-4 border transition-colors ${
                  current
                    ? 'border-accent bg-accent-muted text-accent cursor-default'
                    : 'border-classroom-border hover:border-accent/40 hover:bg-classroom-playground'
                }`}
                onClick={() => {
                  navigate(lecturePath(lec.id));
                  onClose();
                }}
              >
                <span className="tabular-nums text-accent mr-3">
                  {String(lec.number).padStart(2, '0')}
                </span>
                <span className="title-kai text-xl">第 {lec.number} 讲　{lec.title}</span>
                {!lec.ready && (
                  <span className="ml-3 text-sm text-highlight">筹备中</span>
                )}
                {current && <span className="ml-3 text-sm">当前</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </TeacherPanel>
  );
}
