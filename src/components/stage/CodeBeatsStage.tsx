import { useEffect, useState } from 'react';
import type { CodeBeat, CodeBeatsContent } from '../../types/scene';
import { useSceneEngine } from '../../engine/SceneEngine';
import { publishBeatPhase, useStageAdvance } from '../../hooks/useStageAdvance';
import { StringForkStage } from './StringForkStage';

interface Props {
  content: CodeBeatsContent;
  sceneId: string;
  onPhase?: (phase: number) => void;
}

export function CodeBeatsStage({ content, sceneId, onPhase }: Props) {
  const { scene, state, dispatch } = useSceneEngine();
  const needsRun = Boolean(scene.code) && !content.beforeRun;
  const unlocked = !needsRun || state.sceneLocal.runCount >= 1;
  const { phase, advance, done } = useStageAdvance(sceneId, content.beats.length, unlocked);
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    publishBeatPhase(phase);
    onPhase?.(phase);
    return () => publishBeatPhase(0);
  }, [onPhase, phase]);

  const visible = content.accumulate ? content.beats.slice(0, phase) : phase > 0 ? [content.beats[phase - 1]!] : [];

  useEffect(() => {
    if (!unlocked) return;
    const next = [...content.beats.slice(0, phase)].reverse().find((beat) => beat.code)?.code;
    if (next) {
      dispatch({ type: 'UPDATE_CODE', code: next });
    }
  }, [unlocked, phase, content.beats, dispatch]);

  useEffect(() => {
    setPicked(null);
  }, [sceneId, phase]);

  if (!unlocked) return null;

  return (
    <div
      className="mt-4 cursor-pointer select-none"
      onClick={() => advance()}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && advance()) event.preventDefault();
      }}
    >
      {visible.map((beat, index) => (
        <BeatView key={index} beat={beat} picked={picked} onPick={setPicked} />
      ))}
      {!done && <p className="mt-4 text-base text-accent/80">点击继续 · 或按空格 / →</p>}
    </div>
  );
}

function BeatView({
  beat,
  picked,
  onPick,
}: {
  beat: CodeBeat;
  picked: string | null;
  onPick: (label: string) => void;
}) {
  return (
    <div className="mt-4 timeline-node-in">
      {beat.line && <p className="stage-emphasis text-xl text-text-primary">{beat.line}</p>}
      {beat.choices && (
        <div className="mt-3 flex flex-wrap gap-3">
          {beat.choices.map((choice) => {
            const on = picked === choice.label;
            return (
              <button
                key={choice.label}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onPick(choice.label);
                }}
                className={`rounded-2xl px-5 py-3 text-xl ${
                  on && choice.correct
                    ? 'bg-accent text-white'
                    : on
                      ? 'bg-accent-muted text-text-primary'
                      : 'bg-classroom-stage text-text-primary shadow-card'
                }`}
              >
                {choice.label}
              </button>
            );
          })}
        </div>
      )}
      {beat.note && <p className="mt-2 text-base text-text-secondary">{beat.note}</p>}
      {beat.fork && (
        <div onClick={(event) => event.stopPropagation()}>
          <StringForkStage content={beat.fork} sceneId={beat.fork.keep.name} />
        </div>
      )}
    </div>
  );
}
