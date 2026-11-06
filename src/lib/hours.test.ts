import { describe, expect, it } from "vitest";
import {
  formatDateKey,
  getBookingCalendar,
  getSalonStatus,
  getTimeSlots,
  getWeeklySchedule,
  getZonedParts,
  type HoursConfig,
} from "./hours";
import { salonConfig } from "../config/salon";

const unconfirmed: HoursConfig = {
  timezone: "Asia/Kolkata",
  openingTime: "CONFIGURE_ACTUAL_TIME",
  openingTimeUpperBound: "07:00",
  closingTime: "21:30",
  closedDays: [2],
};
const confirmed: HoursConfig = { ...unconfirmed, openingTime: "06:15" };

/** Builds an instant from an IST wall-clock time. 2026-11-09 is a Monday. */
const ist = (date: string, time: string) => new Date(`${date}T${time}:00+05:30`);
const MONDAY = "2026-11-09";
const TUESDAY = "2026-11-10";
const WEDNESDAY = "2026-11-11";

describe("salon config", () => {
  it("matches the supplied schedule", () => {
    expect(salonConfig.closingTime).toBe("21:30");
    expect(salonConfig.closedDays).toEqual([2]);
    expect(salonConfig.timezone).toBe("Asia/Kolkata");
    expect(salonConfig.openingHours.tuesday).toBe(false);
    const open = Object.values(salonConfig.openingHours).filter(Boolean);
    expect(open).toHaveLength(6);
  });
});

describe("getSalonStatus", () => {
  it("is closed all day on Tuesday, whatever the time", () => {
    for (const time of ["00:00", "07:00", "12:00", "21:29", "23:59"]) {
      const status = getSalonStatus(ist(TUESDAY, time), confirmed);
      expect(status.state).toBe("closed");
      expect(status.isHoliday).toBe(true);
    }
  });

  it("points to Wednesday from Tuesday and from Monday night", () => {
    expect(getSalonStatus(ist(TUESDAY, "12:00"), unconfirmed).detail).toContain("tomorrow");
    expect(getSalonStatus(ist(MONDAY, "22:00"), unconfirmed).detail).toContain("Wednesday");
  });

  it("closes exactly at 9:30 PM", () => {
    expect(getSalonStatus(ist(MONDAY, "21:29"), confirmed).state).toBe("open");
    expect(getSalonStatus(ist(MONDAY, "21:30"), confirmed).state).toBe("closed");
    expect(getSalonStatus(ist(MONDAY, "23:59"), confirmed).state).toBe("closed");
  });

  it("uses a confirmed opening time exactly", () => {
    expect(getSalonStatus(ist(WEDNESDAY, "06:14"), confirmed).state).toBe("closed");
    expect(getSalonStatus(ist(WEDNESDAY, "06:15"), confirmed).state).toBe("open");
  });

  it("never claims open or closed before 7:00 AM while the time is unconfirmed", () => {
    const early = getSalonStatus(ist(WEDNESDAY, "06:30"), unconfirmed);
    expect(early.state).toBe("opens-early");
    expect(early.label).toBe("Opens before 7:00 AM");
    expect(getSalonStatus(ist(WEDNESDAY, "07:00"), unconfirmed).state).toBe("open");
  });

  it("uses IST regardless of the instant's UTC date", () => {
    // Monday 20:00 UTC is 01:30 on Tuesday in India, which is the holiday.
    const status = getSalonStatus(new Date("2026-11-09T20:00:00Z"), confirmed);
    expect(status.isHoliday).toBe(true);
    // Tuesday 18:30 UTC is exactly midnight going into Wednesday in India.
    const parts = getZonedParts(new Date("2026-11-10T18:30:00Z"), "Asia/Kolkata");
    expect(parts).toMatchObject({ weekday: 3, minutes: 0, dateKey: WEDNESDAY });
  });
});

describe("getWeeklySchedule", () => {
  it("lists six open days and Tuesday as the holiday, Monday first", () => {
    const rows = getWeeklySchedule(unconfirmed);
    expect(rows.map((r) => r.name)[0]).toBe("Monday");
    expect(rows.filter((r) => !r.isClosed)).toHaveLength(6);
    expect(rows.find((r) => r.isClosed)?.name).toBe("Tuesday");
    expect(rows[0].hours).toBe("Before 7:00 AM – 9:30 PM");
  });
});

describe("booking slots", () => {
  const now = ist(MONDAY, "10:10");

  it("offers nothing on Tuesdays or past dates", () => {
    expect(getTimeSlots(TUESDAY, now, unconfirmed, 30)).toEqual([]);
    expect(getTimeSlots("2026-11-08", now, unconfirmed, 30)).toEqual([]);
  });

  it("never offers a time at or after closing", () => {
    const slots = getTimeSlots(WEDNESDAY, now, unconfirmed, 30);
    expect(slots[0].value).toBe("07:00");
    expect(slots.at(-1)?.value).toBe("21:00");
  });

  it("starts from a confirmed opening time, rounded up to the next slot", () => {
    expect(getTimeSlots(WEDNESDAY, now, confirmed, 30)[0].value).toBe("06:30");
  });

  it("drops times already past today", () => {
    expect(getTimeSlots(MONDAY, now, unconfirmed, 30)[0].value).toBe("10:30");
    expect(getTimeSlots(MONDAY, ist(MONDAY, "21:15"), unconfirmed, 30)).toEqual([]);
  });

  it("marks Tuesdays and past days unavailable in the calendar", () => {
    const calendar = getBookingCalendar(ist(WEDNESDAY, "10:00"), unconfirmed, 4, 30);
    expect(calendar).toHaveLength(28);
    expect(calendar[0].key).toBe(MONDAY);
    expect(calendar[0].isAvailable).toBe(false);
    expect(calendar[1].isHoliday).toBe(true);
    expect(calendar[1].isAvailable).toBe(false);
    expect(calendar[2].isToday).toBe(true);
    expect(calendar[2].isAvailable).toBe(true);
    expect(calendar.filter((d) => d.isHoliday)).toHaveLength(4);
  });

  it("formats dates in full", () => {
    expect(formatDateKey("2026-11-12")).toBe("Thursday, 12 November 2026");
  });
});
