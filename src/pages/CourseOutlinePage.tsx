import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { COURSE, lecturePath } from "../data/course";
import { CURRENT_OFFERING } from "../data/offerings";
import {
  CLASS_SCHEDULES,
  buildCalendarWeeks,
  formatShortDate,
  type CalendarSession,
} from "../data/calendar";
import { HomeTeacherBar } from "../components/controls/HomeTeacherBar";

function sessionLine(session: CalendarSession): string {
  return `${session.weekday} ${formatShortDate(session.date)}　${session.time}　${session.place}`;
}

function Slot({
  label,
  session,
}: {
  label: string;
  session?: CalendarSession;
}) {
  return (
    <div className="mt-3">
      <p className="text-xs font-semibold tracking-[0.16em] text-accent">{label}</p>
      {session ? (
        <p className="mt-1 text-text-primary">{sessionLine(session)}</p>
      ) : (
        <p className="mt-1 text-text-secondary">本周无{label}</p>
      )}
    </div>
  );
}

export function CourseOutlinePage() {
  const [logoAvailable, setLogoAvailable] = useState(true);
  const calendarWeeks = useMemo(
    () => buildCalendarWeeks(CURRENT_OFFERING.lectures),
    [],
  );

  return (
    <div className="min-h-full classroom-grid">
      <header className="bg-classroom-stage border-b border-classroom-border">
        <div className="mx-auto max-w-5xl px-10 py-5 flex items-center gap-4">
          <Link to="/" className="shrink-0" title="返回课程首页">
            {logoAvailable ? (
              <img
                src="/logo.png"
                alt={COURSE.university}
                className="h-14 w-auto object-contain"
                onError={() => setLogoAvailable(false)}
              />
            ) : (
              <span className="title-stage text-lg text-accent">{COURSE.university}</span>
            )}
          </Link>
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
        <p className="text-sm font-semibold tracking-[0.22em] text-accent">{CURRENT_OFFERING.term}</p>
        <h1 className="title-stage text-5xl text-text-primary mt-3">教学日历</h1>
        <p className="text-lg text-text-secondary mt-4">
          {COURSE.title} · 共 {COURSE.totalLectures} 讲
          <span className="mx-3 text-classroom-border">·</span>
          <Link to="/" className="text-accent hover:underline underline-offset-4">
            返回首页
          </Link>
        </p>
        <p className="text-text-secondary mt-6">第 1 周起始：2026 年 9 月 21 日（星期一）</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {CLASS_SCHEDULES.map((cls) => (
            <div
              key={cls.id}
              className="rounded-3xl bg-classroom-stage shadow-card border border-classroom-border px-7 py-5"
            >
              <p className="title-stage text-xl text-text-primary">{cls.name}</p>
              <p className="mt-3 text-text-primary">
                理论　{cls.theory.weekday} {cls.theory.time}　{cls.theory.place}
              </p>
              <p className="mt-1 text-text-primary">
                实验　{cls.lab.weekday} {cls.lab.time}　{cls.lab.place}
              </p>
            </div>
          ))}
        </div>

        <ol className="mt-10 space-y-4">
          {calendarWeeks.map((week) => (
            <li
              key={week.week}
              className="rounded-3xl bg-classroom-stage shadow-card border border-classroom-border px-8 py-6"
            >
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <p className="title-stage text-2xl text-text-primary">第 {week.week} 周</p>
                {week.holiday ? (
                  <p className="text-lg text-highlight">{week.holiday}</p>
                ) : week.lecture ? (
                  <Link
                    to={lecturePath(week.lecture.id)}
                    className="text-lg text-accent hover:underline underline-offset-4"
                  >
                    第 {week.lecture.number} 讲　{week.lecture.title}
                  </Link>
                ) : null}
              </div>
              {week.holiday ? (
                <p className="mt-3 text-text-secondary">本周理论、实验均停课，后续讲次顺延。</p>
              ) : (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {week.classes.map((cls) => (
                    <div
                      key={cls.name}
                      className="rounded-2xl border border-classroom-border bg-classroom-playground/40 px-5 py-4"
                    >
                      <p className="font-medium text-text-primary">{cls.name}</p>
                      <Slot label="理论" session={cls.theory} />
                      <Slot label="实验" session={cls.lab} />
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>
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
