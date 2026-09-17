import { useSceneEngine } from '../../engine/SceneEngine';
import { PredictPanel } from './PredictPanel';
import { RevealPanel } from './RevealPanel';
import { VotePanel } from './VotePanel';
import { BreakPanel } from './BreakPanel';
import { SummaryPanel } from './SummaryPanel';
import { HintPanel } from './HintPanel';
import { HumanReviewPanel } from './HumanReviewPanel';
import { AIReviewerPanel } from '../ai/AIReviewerPanel';
import {
  CatalogList,
  GradeTable,
  InfoCardGrid,
  SceneSideImage,
  ScheduleList,
} from './CourseInfoBlocks';
import { LearningFlowStage } from './LearningFlowStage';
import { HistoryDialogueStage } from './HistoryDialogueStage';
import { MachineLangStage } from './MachineLangStage';
import { AssemblyLangStage } from './AssemblyLangStage';
import { HighLevelCompareStage } from './HighLevelCompareStage';
import { LanguageTimelineStage } from './LanguageTimelineStage';
import { WhyPythonCompareStage } from './WhyPythonCompareStage';
import { BigDataPathStage } from './BigDataPathStage';
import { PythonProsStage } from './PythonProsStage';
import { RuntimeModelStage } from './RuntimeModelStage';
import { ReplDemoStage } from './ReplDemoStage';
import { StepExecStage } from './StepExecStage';
import { TypedDemoStage } from './TypedDemoStage';
import { ExprOrderStage } from './ExprOrderStage';
import { SyntaxRulesStage } from './SyntaxRulesStage';
import { VarModelStage } from './VarModelStage';
import { IpoStage } from './IpoStage';
import { WhyNeedVarStage } from './WhyNeedVarStage';
import { VarPredictStage } from './VarPredictStage';
import { InputFlowStage } from './InputFlowStage';
import { QuestionCascadeStage } from './QuestionCascadeStage';
import { CodeChoiceStage } from './CodeChoiceStage';
import { OnceVsProgramStage } from './OnceVsProgramStage';
import { AiLiveCodeStage } from './AiLiveCodeStage';
import { MethodVerifyStage } from './MethodVerifyStage';
import { WhyLearnWrapStage } from './WhyLearnWrapStage';
import { FinalVerdictStage } from './FinalVerdictStage';

export function TeachingStage() {
  const { scene } = useSceneEngine();
  const { content } = scene;
  const isFullscreen = scene.layout === 'fullscreen';
  const dense = Boolean(
    content.image ||
      content.infoCards ||
      content.schedule ||
      content.gradeItems ||
      content.catalog ||
      content.learningFlow ||
      content.historyDialogue ||
      content.machineLang ||
      content.assemblyLang ||
      content.highLevelCompare ||
      content.languageTimeline ||
      content.whyPythonCompare ||
      content.bigDataPath ||
      content.pythonPros ||
      content.runtimeModel ||
      content.replDemo ||
      content.stepExec ||
      content.typedDemo ||
      content.exprOrder ||
      content.syntaxRules ||
      content.varModel ||
      content.ipo ||
      content.whyNeedVar ||
      content.varPredict ||
      content.inputFlow ||
      content.questionCascade ||
      content.codeChoice ||
      content.onceVsProgram ||
      content.aiLiveCode ||
      content.methodVerify ||
      content.whyLearnWrap ||
      content.finalVerdict,
  );
  const hasSideImage = Boolean(content.image);

  return (
    <section
      className={`grid h-full place-items-center overflow-hidden ${
        isFullscreen ? 'px-24 py-14' : 'px-14 py-10'
      }`}
    >
      <div className={`w-full max-h-full overflow-y-auto ${isFullscreen ? 'max-w-6xl' : ''}`}>
        <div className={hasSideImage ? 'grid grid-cols-[1.15fr_0.85fr] gap-12 items-center' : ''}>
          <div>
            {content.headline && (
              <h2
                className={`title-stage text-text-primary ${
                  isFullscreen && !dense ? 'text-stage-hero' : 'text-stage-headline'
                }`}
              >
                {content.headline}
              </h2>
            )}

            {content.promptQuote && (
              <blockquote className="mt-12 rounded-3xl bg-classroom-stage shadow-card border border-classroom-border px-8 py-7">
                <p className="text-sm uppercase tracking-[0.2em] font-semibold text-accent mb-3">
                  提示词
                </p>
                <p className="title-kai text-stage-sub text-text-primary leading-relaxed">
                  “{content.promptQuote}”
                </p>
              </blockquote>
            )}

            {content.question && (
              <p
                className={`stage-emphasis text-stage-body flex items-start gap-4 ${
                  content.promptQuote ? 'mt-16' : 'mt-8'
                }`}
              >
                {content.emoji && (
                  <span className="text-5xl leading-none shrink-0" aria-hidden>
                    {content.emoji}
                  </span>
                )}
                <span>{content.question}</span>
              </p>
            )}

            {content.body && scene.type !== 'summary' && (
              <p className="text-stage-body mt-8 text-text-secondary font-medium">{content.body}</p>
            )}

            {content.bulletPoints && (
              <ul className="mt-10 space-y-5">
                {content.bulletPoints.map((point) => (
                  <li
                    key={point}
                    className="text-stage-sub font-medium flex items-baseline gap-4 text-text-primary"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-accent shrink-0 translate-y-[-0.28em]" />
                    {point}
                  </li>
                ))}
              </ul>
            )}

            {content.flowDiagram && (
              <div className="mt-10 rounded-2xl bg-classroom-playground border border-classroom-border px-8 py-6 space-y-2 font-mono text-xl text-text-secondary font-medium">
                {content.flowDiagram.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
            )}

            {content.codeComparison && (
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[content.codeComparison.left, content.codeComparison.right].map((side) => (
                  <div key={side.label} className="rounded-xl border border-code-border overflow-hidden">
                    <div className="bg-code-bg border-b border-code-border px-4 py-2 text-sm text-code-muted">
                      {side.label}
                    </div>
                    <pre className="bg-code-bg p-4 text-base font-mono text-code-text overflow-x-auto whitespace-pre-wrap">
                      {side.code}
                    </pre>
                  </div>
                ))}
              </div>
            )}

            {content.catalog && <CatalogList items={content.catalog} />}
            {content.schedule && <ScheduleList blocks={content.schedule} />}
            {content.infoCards && <InfoCardGrid cards={content.infoCards} />}
            {content.gradeItems && <GradeTable items={content.gradeItems} />}
            {content.learningFlow && (
              <LearningFlowStage flow={content.learningFlow} sceneId={scene.id} />
            )}
            {content.historyDialogue && (
              <HistoryDialogueStage dialogue={content.historyDialogue} sceneId={scene.id} />
            )}
            {content.machineLang && (
              <MachineLangStage content={content.machineLang} sceneId={scene.id} />
            )}
            {content.assemblyLang && (
              <AssemblyLangStage content={content.assemblyLang} sceneId={scene.id} />
            )}
            {content.highLevelCompare && (
              <HighLevelCompareStage content={content.highLevelCompare} sceneId={scene.id} />
            )}
            {content.languageTimeline && (
              <LanguageTimelineStage content={content.languageTimeline} sceneId={scene.id} />
            )}
            {content.whyPythonCompare && (
              <WhyPythonCompareStage content={content.whyPythonCompare} sceneId={scene.id} />
            )}
            {content.bigDataPath && (
              <BigDataPathStage content={content.bigDataPath} sceneId={scene.id} />
            )}
            {content.pythonPros && (
              <PythonProsStage content={content.pythonPros} sceneId={scene.id} />
            )}
            {content.runtimeModel && (
              <RuntimeModelStage content={content.runtimeModel} sceneId={scene.id} />
            )}
            {content.replDemo && <ReplDemoStage content={content.replDemo} sceneId={scene.id} />}
            {content.stepExec && <StepExecStage content={content.stepExec} sceneId={scene.id} />}
            {content.typedDemo && <TypedDemoStage content={content.typedDemo} sceneId={scene.id} />}
            {content.exprOrder && <ExprOrderStage content={content.exprOrder} sceneId={scene.id} />}
            {content.syntaxRules && (
              <SyntaxRulesStage content={content.syntaxRules} sceneId={scene.id} />
            )}
            {content.varModel && <VarModelStage content={content.varModel} sceneId={scene.id} />}
            {content.ipo && <IpoStage content={content.ipo} sceneId={scene.id} />}
            {content.whyNeedVar && (
              <WhyNeedVarStage content={content.whyNeedVar} sceneId={scene.id} />
            )}
            {content.varPredict && (
              <VarPredictStage content={content.varPredict} sceneId={scene.id} />
            )}
            {content.inputFlow && (
              <InputFlowStage content={content.inputFlow} sceneId={scene.id} />
            )}
            {content.questionCascade && (
              <QuestionCascadeStage content={content.questionCascade} sceneId={scene.id} />
            )}
            {content.codeChoice && (
              <CodeChoiceStage content={content.codeChoice} sceneId={scene.id} />
            )}
            {content.onceVsProgram && (
              <OnceVsProgramStage content={content.onceVsProgram} sceneId={scene.id} />
            )}
            {content.aiLiveCode && (
              <AiLiveCodeStage content={content.aiLiveCode} sceneId={scene.id} />
            )}
            {content.methodVerify && (
              <MethodVerifyStage content={content.methodVerify} sceneId={scene.id} />
            )}
            {content.whyLearnWrap && (
              <WhyLearnWrapStage content={content.whyLearnWrap} sceneId={scene.id} />
            )}
            {content.finalVerdict && (
              <FinalVerdictStage content={content.finalVerdict} sceneId={scene.id} />
            )}
          </div>
          {content.image && <SceneSideImage image={content.image} />}
        </div>

        {(scene.prediction || scene.requiresPrediction) && <PredictPanel />}
        {scene.content.voteOptions && <VotePanel />}
        {scene.type === 'break' && <BreakPanel />}
        {scene.type === 'summary' && <SummaryPanel />}
        <HintPanel />
        <HumanReviewPanel />
        {(scene.type === 'challenge' || scene.type === 'aiReview') && <AIReviewerPanel />}
        {scene.type !== 'summary' && <RevealPanel />}
      </div>
    </section>
  );
}
