/** Abbrev keys from getWeekDates (Monday-first offsets 0–6). */
export type WeekDateAbbrev = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

export type WeekDateEntry = {
  label: string;
  date: Date;
  dateLabel: string;
};

export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function getWeekDates(): Record<WeekDateAbbrev, WeekDateEntry> {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  const days: WeekDateAbbrev[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const offsets = [0, 1, 2, 3, 4, 5, 6];

  const result = {} as Record<WeekDateAbbrev, WeekDateEntry>;
  days.forEach((day, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + offsets[i]);
    const month = d.toLocaleString("en-US", { month: "short" });
    result[day] = {
      label: day,
      date: d,
      dateLabel: `${month} ${d.getDate()}`,
    };
  });
  return result;
}

export const ABBREV_TO_FULL: Record<WeekDateAbbrev, string> = {
  SUN: "Sunday",
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
};

export const FULL_TO_ABBREV: Record<string, WeekDateAbbrev> = {
  Sunday: "SUN",
  Monday: "MON",
  Tuesday: "TUE",
  Wednesday: "WED",
  Thursday: "THU",
  Friday: "FRI",
  Saturday: "SAT",
};

/** Monday-first full day names for sorting and defaults. */
export const WEEK_ORDER_MON_FIRST = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

/** UI toggle order SUN → SAT */
export const TOGGLE_ORDER: { abbrev: WeekDateAbbrev; full: string }[] = [
  { abbrev: "SUN", full: "Sunday" },
  { abbrev: "MON", full: "Monday" },
  { abbrev: "TUE", full: "Tuesday" },
  { abbrev: "WED", full: "Wednesday" },
  { abbrev: "THU", full: "Thursday" },
  { abbrev: "FRI", full: "Friday" },
  { abbrev: "SAT", full: "Saturday" },
];

export function isFullDayInPast(fullDay: string, weekDates: ReturnType<typeof getWeekDates>): boolean {
  const abbrev = FULL_TO_ABBREV[fullDay];
  if (!abbrev) return false;
  const dayStart = startOfDay(weekDates[abbrev].date);
  const todayStart = startOfDay(new Date());
  return dayStart < todayStart;
}

/** Keep only nights whose calendar date is on or after today (start of day). */
export function filterNightsOnOrAfterToday(
  fullDayNames: string[],
  weekDates: ReturnType<typeof getWeekDates>,
): string[] {
  const todayStart = startOfDay(new Date());
  const set = new Set(fullDayNames);
  return WEEK_ORDER_MON_FIRST.filter((d) => {
    if (!set.has(d)) return false;
    const abbrev = FULL_TO_ABBREV[d];
    if (!abbrev) return false;
    return startOfDay(weekDates[abbrev].date) >= todayStart;
  });
}
