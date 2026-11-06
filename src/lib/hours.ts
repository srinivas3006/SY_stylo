export type HoursConfig = {
  timezone: string;
  openingTime: string;
  openingTimeUpperBound: string;
  closingTime: string;
  closedDays: readonly number[];
};

export type StatusState = "open" | "closed" | "opens-early";

export type SalonStatus = {
  state: StatusState;
  /** Short label: "Open now", "Closed", or "Opens before 7:00 AM". */
  label: string;
  /** One-line explanation of what happens next. */
  detail: string;
  isHoliday: boolean;
};

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SHORT_WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type ZonedParts = {
  weekday: number;
  minutes: number;
  year: number;
  month: number;
  day: number;
  dateKey: string;
};

/** Reads the wall-clock time in the salon's timezone, whatever the visitor's device is set to. */
export function getZonedParts(date: Date, timezone: string): ZonedParts {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const year = Number(get("year"));
  const month = Number(get("month"));
  const day = Number(get("day"));
  return {
    weekday: SHORT_WEEKDAYS.indexOf(get("weekday")),
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
    year,
    month,
    day,
    dateKey: toDateKey(year, month, day),
  };
}

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** "21:30" becomes 1290. Returns null for anything else, including the unconfirmed placeholder. */
export function parseTime(value: string): number | null {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
}

export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const period = hours >= 12 ? "PM" : "AM";
  const display = hours % 12 === 0 ? 12 : hours % 12;
  return `${display}:${String(minutes % 60).padStart(2, "0")} ${period}`;
}

function formatTime(value: string): string {
  const minutes = parseTime(value);
  return minutes === null ? value : formatMinutes(minutes);
}

export function isOpeningTimeConfirmed(config: HoursConfig): boolean {
  return parseTime(config.openingTime) !== null;
}

/** "6:15 AM" when confirmed, otherwise "Before 7:00 AM". */
export function getOpeningLabel(config: HoursConfig): string {
  return isOpeningTimeConfirmed(config)
    ? formatTime(config.openingTime)
    : `Before ${formatTime(config.openingTimeUpperBound)}`;
}

export function getClosingLabel(config: HoursConfig): string {
  return formatTime(config.closingTime);
}

export function getHoursLabel(config: HoursConfig): string {
  return `${getOpeningLabel(config)} – ${getClosingLabel(config)}`;
}

function nextOpening(weekday: number, config: HoursConfig): string {
  let offset = 1;
  while (offset < 7 && config.closedDays.includes((weekday + offset) % 7)) offset++;
  const dayName = offset === 1 ? "tomorrow" : WEEKDAYS[(weekday + offset) % 7];
  const time = isOpeningTimeConfirmed(config)
    ? `at ${formatTime(config.openingTime)}`
    : `before ${formatTime(config.openingTimeUpperBound)}`;
  return `Opens ${dayName} ${time}`;
}

export function getSalonStatus(date: Date, config: HoursConfig): SalonStatus {
  const { weekday, minutes } = getZonedParts(date, config.timezone);

  if (config.closedDays.includes(weekday)) {
    return {
      state: "closed",
      label: "Closed",
      detail: `${WEEKDAYS[weekday]} is our weekly holiday. ${nextOpening(weekday, config)}`,
      isHoliday: true,
    };
  }

  const closing = parseTime(config.closingTime) ?? 0;
  if (minutes >= closing) {
    return {
      state: "closed",
      label: "Closed",
      detail: `Closed for today. ${nextOpening(weekday, config)}`,
      isHoliday: false,
    };
  }

  const opensAt = parseTime(config.openingTime);
  const closesDetail = `Closes at ${formatTime(config.closingTime)}`;

  if (opensAt !== null) {
    return minutes >= opensAt
      ? { state: "open", label: "Open now", detail: closesDetail, isHoliday: false }
      : {
          state: "closed",
          label: "Closed",
          detail: `Opens today at ${formatTime(config.openingTime)}`,
          isHoliday: false,
        };
  }

  // Exact opening time unconfirmed. From the upper bound onward the salon is definitely open.
  // Before it we can't truthfully say open or closed, so we say what we do know.
  const upperBound = parseTime(config.openingTimeUpperBound) ?? 0;
  if (minutes >= upperBound) {
    return { state: "open", label: "Open now", detail: closesDetail, isHoliday: false };
  }
  return {
    state: "opens-early",
    label: `Opens before ${formatTime(config.openingTimeUpperBound)}`,
    detail: "Please call to check early-morning timing",
    isHoliday: false,
  };
}

export type ScheduleRow = {
  weekday: number;
  name: string;
  isClosed: boolean;
  hours: string;
};

/** Weekly schedule, Monday first. */
export function getWeeklySchedule(config: HoursConfig): ScheduleRow[] {
  return [1, 2, 3, 4, 5, 6, 0].map((weekday) => {
    const isClosed = config.closedDays.includes(weekday);
    return {
      weekday,
      name: WEEKDAYS[weekday],
      isClosed,
      hours: isClosed ? "Weekly holiday" : getHoursLabel(config),
    };
  });
}

export type TimeSlot = { value: string; label: string };

/** Bookable times for a date. Past times are removed for today; closed days have none. */
export function getTimeSlots(
  dateKey: string,
  now: Date,
  config: HoursConfig,
  intervalMinutes: number,
): TimeSlot[] {
  const weekday = weekdayOfKey(dateKey);
  if (config.closedDays.includes(weekday)) return [];

  const today = getZonedParts(now, config.timezone);
  if (dateKey < today.dateKey) return [];

  const opensAt = parseTime(config.openingTime) ?? parseTime(config.openingTimeUpperBound) ?? 0;
  const closing = parseTime(config.closingTime) ?? 0;
  const first = Math.ceil(opensAt / intervalMinutes) * intervalMinutes;

  const slots: TimeSlot[] = [];
  for (let m = first; m < closing; m += intervalMinutes) {
    if (dateKey === today.dateKey && m <= today.minutes) continue;
    const value = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    slots.push({ value, label: formatMinutes(m) });
  }
  return slots;
}

function weekdayOfKey(dateKey: string): number {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export type CalendarDay = {
  key: string;
  day: number;
  month: string;
  label: string;
  isToday: boolean;
  isHoliday: boolean;
  isAvailable: boolean;
};

/** Whole weeks starting on the Monday of the current week in the salon's timezone. */
export function getBookingCalendar(
  now: Date,
  config: HoursConfig,
  weeks: number,
  intervalMinutes: number,
): CalendarDay[] {
  const today = getZonedParts(now, config.timezone);
  const mondayOffset = (today.weekday + 6) % 7;
  const start = Date.UTC(today.year, today.month - 1, today.day - mondayOffset);
  const dayMs = 86_400_000;

  return Array.from({ length: weeks * 7 }, (_, i) => {
    const date = new Date(start + i * dayMs);
    const key = toDateKey(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
    return {
      key,
      day: date.getUTCDate(),
      month: date.toLocaleDateString("en-IN", { month: "short", timeZone: "UTC" }),
      label: formatDateKey(key),
      isToday: key === today.dateKey,
      isHoliday: config.closedDays.includes(date.getUTCDay()),
      isAvailable: getTimeSlots(key, now, config, intervalMinutes).length > 0,
    };
  });
}

/** "2026-11-12" becomes "Thursday, 12 November 2026". */
export function formatDateKey(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const month = date.toLocaleDateString("en-IN", { month: "long", timeZone: "UTC" });
  return `${WEEKDAYS[date.getUTCDay()]}, ${d} ${month} ${y}`;
}
