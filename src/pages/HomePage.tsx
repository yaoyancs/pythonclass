import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  COURSE,
  lectureHomeworkPath,
  lecturePath,
  type LectureMeta,
} from '../data/course';
import { LECTURES } from '../data/lessons';
import { CURRENT_OFFERING } from '../data/offerings';
import { HomeTeacherBar } from '../components/controls/HomeTeacherBar';

function ReadyLectureLink({
  lecture,
  featured,
}: {
  lecture: LectureMeta;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl bg-classroom-stage shadow-card border border-classroom-border ${
        featured ? 'px-10 py-8' : 'px-8 py-5'
      }`}
    >
      <Link
        to={lecturePath(lecture.id)}
        className="group flex items-center gap-6 transition-colors"
      >
        <div className="min-w-0 flex-1">
          {featured && (
            <p className="text-sm font-semibold tracking-[0.18em] text-accent mb-2">当前讲次</p>
          )}
          <p
            className={`title-stage text-text-primary group-hover:text-accent transition-colors ${
              featured ? 'text-4xl' : 'text-2xl'
            }`}
          >
            第 {lecture.number} 讲　{lecture.title}
          </p>
        </div>
        <span className="text-accent text-xl shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
          →
        </span>
      </Link>
      <p className={`text-text-secondary mt-2 ${featured ? 'text-xl' : 'text-base'}`}>
        {lecture.blurb}
        {lecture.homework && (
          <>
            <span className="mx-2 text-classroom-border">·</span>
            <Link
              to={lectureHomeworkPath(lecture.id)}
              className="text-accent hover:underline underline-offset-4"
            >
              作业
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

export function HomePage() {
  const [logoAvailable, setLogoAvailable] = useState(true);
  const ready = LECTURES.filter((lecture) => lecture.ready);
  const upcoming = LECTURES.filter((lecture) => !lecture.ready);
  const featured = ready.at(-1);
  const earlierReady = featured ? ready.filter((lecture) => lecture.id !== featured.id) : [];

  return (
    <div className="min-h-full classroom-grid">
      <header className="bg-classroom-stage border-b border-classroom-border">
        <div className="mx-auto max-w-5xl px-10 py-5 flex items-center gap-4">
          {logoAvailable ? (
            <img
              src="/logo.png"
              alt={COURSE.university}
              className="h-14 w-auto shrink-0 object-contain"
              onError={() => setLogoAvailable(false)}
            />
          ) : (
            <span className="title-stage text-lg text-accent shrink-0">{COURSE.university}</span>
          )}
          <span className="h-8 w-px bg-classroom-border shrink-0" aria-hidden />
          <p className="text-sm text-text-secondary">
            {COURSE.department}
            <span className="mx-2 text-classroom-border">|</span>
            {COURSE.title}
            <span className="mx-2 text-classroom-border">|</span>
            授课教师：{COURSE.teacher}
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-10 py-10">
        <div className="flex items-center gap-8">
          <img
            src="/python-logo.svg"
            alt="Python"
            className="h-28 w-28 shrink-0 object-contain"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-[0.22em] text-accent">{COURSE.role}</p>
            <h1 className="title-stage text-6xl text-text-primary mt-3">{COURSE.title}</h1>
            <p className="text-xl text-text-secondary mt-4 font-medium">
              {CURRENT_OFFERING.term}
              <span className="mx-3 text-classroom-border">·</span>
              共 {COURSE.totalLectures} 讲
              <span className="mx-3 text-classroom-border">·</span>
              {COURSE.practiceNote}
            </p>
          </div>
        </div>

        {featured && (
          <section className="mt-12">
            <ReadyLectureLink lecture={featured} featured />
          </section>
        )}

        {earlierReady.length > 0 && (
          <section className="mt-8">
            <p className="text-sm font-semibold text-text-secondary mb-3">已就绪</p>
            <ol className="space-y-3">
              {earlierReady.map((lecture) => (
                <li key={lecture.id}>
                  <ReadyLectureLink lecture={lecture} />
                </li>
              ))}
            </ol>
          </section>
        )}

        {upcoming.length > 0 && (
          <details className="mt-8 group">
            <summary className="cursor-pointer list-none text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">
              <span className="group-open:hidden">后续讲次（筹备中）</span>
              <span className="hidden group-open:inline">收起后续讲次</span>
            </summary>
            <ol className="mt-3 space-y-2">
              {upcoming.map((lecture) => (
                <li key={lecture.id}>
                  <Link
                    to={lecturePath(lecture.id)}
                    className="flex items-baseline gap-4 rounded-2xl border border-dashed border-classroom-border px-6 py-3 text-text-secondary hover:text-text-primary hover:border-accent/30 transition-colors"
                  >
                    <span className="shrink-0">第 {lecture.number} 讲</span>
                    <span className="title-stage">{lecture.title}</span>
                    <span className="text-sm">{lecture.blurb}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </details>
        )}
      </main>

      <footer className="bg-classroom-stage border-t border-classroom-border px-10 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between gap-4">
          <p className="text-sm text-text-secondary">
            本站仅用于理论课授课
            <span className="mx-2 text-classroom-border">·</span>
            {COURSE.university} {COURSE.department}
          </p>
          <HomeTeacherBar />
        </div>
      </footer>
    </div>
  );
}
