import { Link } from 'react-router-dom';
import { useState } from 'react';
import { COURSE, lecturePath } from '../data/course';
import { LECTURES } from '../data/lessons';

export function HomePage() {
  const [logoAvailable, setLogoAvailable] = useState(true);

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

      <main className="mx-auto w-full max-w-5xl px-10 py-14">
        <p className="text-sm uppercase tracking-[0.22em] font-semibold text-accent">Course</p>
        <h1 className="title-stage text-stage-hero text-text-primary mt-3">{COURSE.title}</h1>
        <p className="text-stage-sub text-text-secondary mt-5 font-medium">
          共 {COURSE.totalLectures} 讲 · 每讲 {COURSE.hoursPerLecture} 课时
        </p>

        <ol className="mt-14 space-y-4">
          {LECTURES.map((lecture) => (
            <li key={lecture.id}>
              <Link
                to={lecturePath(lecture.id)}
                className="group flex items-center gap-6 rounded-3xl bg-classroom-stage shadow-card px-8 py-6 transition-all hover:shadow-lift hover:border-accent/40 border border-classroom-border"
              >
                <span className="text-accent text-2xl font-semibold tabular-nums tracking-widest shrink-0 w-14">
                  {String(lecture.number).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="title-stage text-2xl text-text-primary group-hover:text-accent transition-colors">
                    第 {lecture.number} 讲　{lecture.title}
                  </p>
                  <p className="text-base text-text-secondary mt-1">
                    {lecture.hours} 课时
                    <span className="mx-2 text-classroom-border">·</span>
                    {lecture.blurb}
                    {!lecture.ready && (
                      <span className="ml-3 text-highlight font-semibold">内容筹备中</span>
                    )}
                  </p>
                </div>
                <span className="text-accent text-xl shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </main>

      <footer className="bg-classroom-stage border-t border-classroom-border px-10 py-4">
        <p className="mx-auto max-w-5xl text-sm text-text-secondary">
          {COURSE.university} · {COURSE.department} · {COURSE.title}
        </p>
      </footer>
    </div>
  );
}
