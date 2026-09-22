import type { LectureSpec, ScheduleBlock } from "../types/scene";

/** 2026 秋第 1 周星期一 */
export const WEEK1_MONDAY = "2026-09-21";

export const THEORY_LECTURES = 10;
export const LAB_SESSIONS = 8;

/** 校历周次 → 放假说明；放假周不安排理论/实验，后续讲次顺延 */
export const HOLIDAY_WEEKS: Record<number, string> = {
  2: "国庆节放假",
};

/** 有课但不上实验的周次（实验顺延到后续周） */
export const NO_LAB_WEEKS = new Set([9]);

export interface ClassSchedule {
  id: "1" | "2";
  name: string;
  theory: { weekday: string; dayOffset: number; time: string; place: string };
  lab: { weekday: string; dayOffset: number; time: string; place: string };
}

export const CLASS_SCHEDULES: ClassSchedule[] = [
  {
    id: "1",
    name: "大数据1班",
    theory: { weekday: "周二", dayOffset: 1, time: "3–5 节", place: "JC405" },
    lab: { weekday: "周四", dayOffset: 3, time: "6–7 节", place: "JS325" },
  },
  {
    id: "2",
    name: "大数据2班",
    theory: { weekday: "周三", dayOffset: 2, time: "3–5 节", place: "JS104" },
    lab: { weekday: "周四", dayOffset: 3, time: "8–9 节", place: "JS325" },
  },
];

export const COURSE_SCHEDULE: ScheduleBlock[] = [
  {
    title: "理论 32 学时",
    subtitle: "第 1 至 11 周（第 2 周国庆放假，第 2 讲起顺延）",
    rows: [
      { time: "周二 3–5 节", place: "JC405（大数据1班）" },
      { time: "周三 3–5 节", place: "JS104（大数据2班）" },
    ],
  },
  {
    title: "实验 16 学时",
    subtitle: "第 1 至 10 周（第 2 周国庆放假，第 9 周无实验）",
    rows: [
      { time: "周四 6–7 节", place: "JS325（大数据1班）" },
      { time: "周四 8–9 节", place: "JS325（大数据2班）" },
    ],
  },
];

export interface CalendarSession {
  date: string;
  weekday: string;
  time: string;
  place: string;
}

export interface ClassWeekSlots {
  name: string;
  theory?: CalendarSession;
  lab?: CalendarSession;
}

export interface CalendarWeek {
  week: number;
  holiday?: string;
  lecture?: Pick<LectureSpec, "id" | "number" | "title">;
  classes: ClassWeekSlots[];
}

function addDays(isoDate: string, days: number): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days));
}

function formatIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const WEEKDAYS = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];

function weekdayLabel(date: Date): string {
  return WEEKDAYS[date.getUTCDay() === 0 ? 6 : date.getUTCDay() - 1];
}

function sessionOn(week: number, dayOffset: number, time: string, place: string): CalendarSession {
  const date = addDays(WEEK1_MONDAY, (week - 1) * 7 + dayOffset);
  return {
    date: formatIso(date),
    weekday: weekdayLabel(date),
    time,
    place,
  };
}

function lectureByNumber(
  lectures: Pick<LectureSpec, "id" | "number" | "title">[],
  number: number,
): Pick<LectureSpec, "id" | "number" | "title"> | undefined {
  const spec = lectures.find((item) => item.number === number);
  if (!spec) return undefined;
  return { id: spec.id, number: spec.number, title: spec.title };
}

export function buildCalendarWeeks(
  lectures: Pick<LectureSpec, "id" | "number" | "title">[],
): CalendarWeek[] {
  const weeks: CalendarWeek[] = [];
  let lectureNumber = 0;
  let labCount = 0;
  let week = 1;

  while (lectureNumber < THEORY_LECTURES || labCount < LAB_SESSIONS) {
    const holiday = HOLIDAY_WEEKS[week];
    if (holiday) {
      weeks.push({ week, holiday, classes: [] });
      week += 1;
      continue;
    }

    lectureNumber += 1;
    const hasTheory = lectureNumber <= THEORY_LECTURES;
    const hasLab = labCount < LAB_SESSIONS && !NO_LAB_WEEKS.has(week);
    if (hasLab) labCount += 1;

    weeks.push({
      week,
      lecture: hasTheory ? lectureByNumber(lectures, lectureNumber) : undefined,
      classes: CLASS_SCHEDULES.map((cls) => ({
        name: cls.name,
        theory: hasTheory
          ? sessionOn(week, cls.theory.dayOffset, cls.theory.time, cls.theory.place)
          : undefined,
        lab: hasLab
          ? sessionOn(week, cls.lab.dayOffset, cls.lab.time, cls.lab.place)
          : undefined,
      })),
    });
    week += 1;
  }

  return weeks;
}

export function formatCalendarDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${year}年${month}月${day}日`;
}

export function formatShortDate(isoDate: string): string {
  const [, month, day] = isoDate.split("-").map(Number);
  return `${month}月${day}日`;
}
