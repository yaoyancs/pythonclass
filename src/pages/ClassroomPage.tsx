import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { ClassroomShell } from '../components/layout/ClassroomShell';
import { SceneEngineProvider } from '../engine/SceneEngine';
import { findHomeworkSceneIndex } from '../data/course';
import { getLessonById } from '../data/lessons';

export function ClassroomPage() {
  const { lessonId = '' } = useParams();
  const [params] = useSearchParams();
  const lesson = getLessonById(lessonId);

  if (!lesson) {
    return (
      <div className="min-h-full classroom-grid grid place-items-center px-10">
        <div className="text-center max-w-xl">
          <h1 className="title-stage text-stage-headline">未找到这一讲</h1>
          <p className="text-stage-sub text-text-secondary mt-4">
            没有 id 为「{lessonId}」的课程内容。
          </p>
          <Link to="/" className="inline-block mt-10 text-accent text-xl underline underline-offset-4">
            返回课程首页
          </Link>
        </div>
      </div>
    );
  }

  const openHomework = params.get('page') === 'homework';
  const homeworkIndex = openHomework ? findHomeworkSceneIndex(lesson) : -1;
  const startIndex = homeworkIndex >= 0 ? homeworkIndex : undefined;

  return (
    <SceneEngineProvider
      key={`${lesson.id}-${openHomework ? 'hw' : 'saved'}`}
      lesson={lesson}
      initialSceneIndex={startIndex}
    >
      <ClassroomShell />
    </SceneEngineProvider>
  );
}

/** 兼容旧地址 /classroom → 第 1 讲 */
export function LegacyClassroomRedirect() {
  return <Navigate to="/lesson/lesson01" replace />;
}
