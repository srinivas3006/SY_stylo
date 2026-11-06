"use client";

import { salonConfig } from "@/config/salon";
import { useNow } from "@/hooks/useNow";
import { getHoursLabel, getWeeklySchedule, getZonedParts, isOpeningTimeConfirmed } from "@/lib/hours";
import { FrameCorners } from "./Brand";
import { Reveal } from "./Reveal";
import { StatusBadge } from "./SalonStatus";

const schedule = getWeeklySchedule(salonConfig);

export function OpeningHours() {
  const now = useNow();
  const today = now ? getZonedParts(now, salonConfig.timezone).weekday : null;
  const todayRow = schedule.find((row) => row.weekday === today);

  return (
    <Reveal>
      <div className="relative grid bg-deep text-white lg:grid-cols-[1fr_1.6fr]" data-testid="opening-hours">
        <FrameCorners inset="0.5rem" size={32} />
        <div className="flex flex-col justify-center gap-4 p-7 sm:p-10 lg:p-12">
          <h3 className="text-3xl text-gold lg:text-4xl">Opening Hours</h3>
          <p className="text-lg">
            <StatusBadge tone="dark" />
          </p>
          <div className="text-sm text-white/85" data-testid="today-hours">
            {todayRow ? (
              todayRow.isClosed ? (
                <p>Today is our weekly holiday. We&apos;re open again tomorrow.</p>
              ) : (
                <p>Today: {getHoursLabel(salonConfig)}</p>
              )
            ) : (
              <p className="min-h-[1.4rem]" />
            )}
          </div>
          <p className="text-xs text-white/70">
            Open six days a week. All times are Indian Standard Time.
            {!isOpeningTimeConfirmed(salonConfig) && " Please call to check early-morning timing."}
          </p>
        </div>

        <ul className="border-t border-white/15 p-4 sm:p-6 lg:border-t-0 lg:border-l lg:p-8">
          {schedule.map((row) => {
            const isToday = row.weekday === today;
            return (
              <li
                key={row.name}
                data-testid={`day-${row.name.toLowerCase()}`}
                aria-current={isToday ? "date" : undefined}
                className={`flex min-h-12 flex-wrap items-center justify-between gap-x-4 px-3 py-2 transition-colors duration-500 ${
                  isToday ? "bg-white/12" : ""
                } ${row.isClosed ? "text-gold" : ""}`}
              >
                <span className={`inline-flex items-center gap-2.5 ${isToday ? "font-bold" : "font-medium"}`}>
                  {row.name}
                  {isToday && (
                    <span className="bg-gold px-1.5 py-px text-[0.62rem] font-bold tracking-wider text-deep uppercase">
                      Today
                    </span>
                  )}
                </span>
                <span
                  className={
                    row.isClosed
                      ? "text-xs font-bold tracking-[0.14em] uppercase"
                      : "text-sm text-white/85 tabular-nums"
                  }
                >
                  {row.hours}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </Reveal>
  );
}
