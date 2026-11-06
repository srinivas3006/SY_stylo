"use client";

import { AnimatePresence, m } from "framer-motion";
import { Check, ExternalLink, Info, Phone } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { services } from "@/config/content";
import { salonConfig, telHref } from "@/config/salon";
import { readNow, useNow } from "@/hooks/useNow";
import {
  formatDateKey,
  getBookingCalendar,
  getOpeningLabel,
  getTimeSlots,
  isOpeningTimeConfirmed,
} from "@/lib/hours";
import { buildBookingMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { FrameCorners, WhatsAppIcon } from "./Brand";
import { useBooking } from "./Providers";
import { Reveal } from "./Reveal";

const { weeksAhead, slotIntervalMinutes } = salonConfig.booking;
const WEEKDAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Errors = Partial<Record<"service" | "name" | "date" | "time", string>>;

export function scrollToBooking() {
  document.getElementById("book")?.scrollIntoView();
}

export function BookingForm() {
  const { serviceId, requestCount, setServiceId } = useBooking();
  const now = useNow();
  const [name, setName] = useState("");
  const [dateKey, setDateKey] = useState("");
  const [time, setTime] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const calendar = useMemo(
    () => (now ? getBookingCalendar(now, salonConfig, weeksAhead, slotIntervalMinutes) : []),
    [now],
  );
  const slots = useMemo(
    () => (now && dateKey ? getTimeSlots(dateKey, now, salonConfig, slotIntervalMinutes) : []),
    [now, dateKey],
  );
  const service = services.find((s) => s.id === serviceId);

  // A "Book This Service" click moves keyboard and screen-reader users here too.
  useEffect(() => {
    if (requestCount > 0) headingRef.current?.focus({ preventScroll: true });
  }, [requestCount]);

  function clearError(field: keyof Errors) {
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function pickDate(key: string) {
    setDateKey(key);
    clearError("date");
    setSentUrl(null);
    // The chosen time may not exist on the new date.
    if (time && !getTimeSlots(key, readNow(), salonConfig, slotIntervalMinutes).some((s) => s.value === time)) {
      setTime("");
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // Re-check against the clock now, as the page may have been open for a while.
    const freshSlots = dateKey ? getTimeSlots(dateKey, readNow(), salonConfig, slotIntervalMinutes) : [];
    const selectedSlot = freshSlots.find((s) => s.value === time);

    const nextErrors: Errors = {};
    if (!service) nextErrors.service = "Please choose a service.";
    if (!name.trim()) nextErrors.name = "Please enter your name.";
    if (!dateKey) nextErrors.date = "Please choose a date.";
    else if (freshSlots.length === 0) nextErrors.date = "This date is no longer available. Please choose another.";
    if (!selectedSlot && !nextErrors.date) {
      nextErrors.time = time ? "This time has passed. Please choose another." : "Please choose a time.";
    }

    setErrors(nextErrors);
    const firstInvalid = (["service", "name", "time"] as const).find((field) => nextErrors[field]);
    if (service && selectedSlot && Object.keys(nextErrors).length === 0) {
      const message = buildBookingMessage({
        name,
        service: service.name,
        date: formatDateKey(dateKey),
        time: selectedSlot.label,
      });
      const url = buildWhatsAppUrl(salonConfig.whatsapp, message);
      setSentUrl(url);
      window.open(url, "_blank", "noopener,noreferrer");
    } else if (nextErrors.date && firstInvalid !== "service" && firstInvalid !== "name") {
      document.getElementById("booking-date")?.focus();
    } else if (firstInvalid) {
      document.getElementById(`booking-${firstInvalid}`)?.focus();
    }
  }

  return (
    <section id="book" aria-labelledby="book-title" className="section-pad scroll-mt-4 bg-lavender/60 lg:scroll-mt-6">
      <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.45fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow text-royal">Book on WhatsApp</p>
          <h2 id="book-title" ref={headingRef} tabIndex={-1} className="section-title mt-4 text-royal outline-none">
            Request your appointment
          </h2>
          <p className="mt-5 max-w-md text-charcoal/80">
            Tell us what you&apos;d like and when. We&apos;ll write the message for you, so all you need to do is
            press send in WhatsApp.
          </p>
          <div className="mt-6 flex max-w-md gap-3 border-l-2 border-gold pl-4 text-sm">
            <Info size={18} className="mt-0.5 flex-none text-royal" aria-hidden />
            <p>
              <strong>This is a request.</strong> Your appointment is confirmed only once SY STYLO replies to you.
            </p>
          </div>
          <a href={telHref} className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-royal underline-offset-4 hover:underline">
            <Phone size={16} aria-hidden /> Prefer to talk? Call {salonConfig.phoneDisplay}
          </a>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={handleSubmit} noValidate className="relative grid gap-6 bg-white p-5 sm:p-8">
            <FrameCorners inset="-0.4rem" size={36} />

            <div className="grid gap-6 sm:grid-cols-2">
              <Field id="booking-service" label="1. Service" error={errors.service}>
                <select
                  id="booking-service"
                  className="field"
                  value={serviceId}
                  aria-invalid={!!errors.service}
                  aria-describedby={errors.service ? "booking-service-error" : undefined}
                  onChange={(event) => {
                    setServiceId(event.target.value);
                    clearError("service");
                    setSentUrl(null);
                  }}
                >
                  <option value="">Choose a service</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field id="booking-name" label="2. Your name" error={errors.name}>
                <input
                  id="booking-name"
                  className="field"
                  type="text"
                  autoComplete="name"
                  maxLength={60}
                  value={name}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "booking-name-error" : undefined}
                  onChange={(event) => {
                    setName(event.target.value);
                    clearError("name");
                    setSentUrl(null);
                  }}
                />
              </Field>
            </div>

            <fieldset aria-describedby={errors.date ? "booking-date-error" : "booking-date-hint"}>
              <legend className="mb-2 text-sm font-bold">3. Preferred date</legend>
              <div className="grid grid-cols-7 gap-1 text-center" id="booking-date" tabIndex={-1}>
                {WEEKDAY_HEADERS.map((day) => (
                  <span
                    key={day}
                    aria-hidden
                    className={`pb-1 text-[0.7rem] font-bold ${day === "Tue" ? "text-charcoal/50" : "text-charcoal/75"}`}
                  >
                    {day}
                  </span>
                ))}
                {calendar.length === 0
                  ? Array.from({ length: weeksAhead * 7 }, (_, i) => (
                      <span key={i} aria-hidden className="h-11 bg-lavender/40 sm:h-12" />
                    ))
                  : calendar.map((day) => {
                      const selected = day.key === dateKey;
                      return (
                        <button
                          key={day.key}
                          type="button"
                          disabled={!day.isAvailable}
                          aria-pressed={selected}
                          aria-label={`${day.label}${day.isHoliday ? ", closed for weekly holiday" : ""}`}
                          onClick={() => pickDate(day.key)}
                          data-date={day.key}
                          className={`relative flex h-11 flex-col items-center justify-center text-sm leading-none transition-colors duration-200 sm:h-12 ${
                            selected
                              ? "bg-royal font-bold text-white"
                              : day.isAvailable
                                ? "bg-lavender/40 text-charcoal hover:bg-lavender"
                                : "text-charcoal/40"
                          } ${day.isHoliday ? "line-through" : ""} ${
                            day.isToday && !selected ? "shadow-[inset_0_0_0_1.5px_var(--color-royal)]" : ""
                          }`}
                        >
                          {day.day}
                          {(day.day === 1 || day.isToday) && (
                            <span className="mt-0.5 text-[0.58rem] leading-none no-underline">
                              {day.isToday ? "Today" : day.month}
                            </span>
                          )}
                        </button>
                      );
                    })}
              </div>
              {errors.date ? (
                <FieldError id="booking-date-error" message={errors.date} />
              ) : (
                <p id="booking-date-hint" className="mt-2 text-xs text-charcoal/70">
                  We&apos;re closed every Tuesday.
                </p>
              )}
            </fieldset>

            <Field id="booking-time" label="4. Preferred time" error={errors.time}>
              <select
                id="booking-time"
                className="field disabled:bg-lavender/20 disabled:text-charcoal/60"
                value={time}
                disabled={!dateKey}
                aria-invalid={!!errors.time}
                aria-describedby={errors.time ? "booking-time-error" : "booking-time-hint"}
                onChange={(event) => {
                  setTime(event.target.value);
                  clearError("time");
                  setSentUrl(null);
                }}
              >
                <option value="">{dateKey ? "Choose a time" : "Choose a date first"}</option>
                {slots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
              {!errors.time && !isOpeningTimeConfirmed(salonConfig) && (
                <p id="booking-time-hint" className="mt-2 text-xs text-charcoal/70">
                  We open {getOpeningLabel(salonConfig).toLowerCase()}. For an earlier visit, please call us.
                </p>
              )}
            </Field>

            <button type="submit" className="btn btn-royal w-full">
              <WhatsAppIcon size={20} /> Confirm via WhatsApp
            </button>

            <AnimatePresence>
              {sentUrl && (
                <m.div
                  role="status"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3 bg-lavender/60 p-4 text-sm"
                  data-testid="booking-sent"
                >
                  <Check size={18} className="mt-0.5 flex-none text-royal" aria-hidden />
                  <p>
                    Your message is ready in WhatsApp. Press send there, then wait for SY STYLO to reply and confirm.{" "}
                    <a
                      href={sentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-royal underline underline-offset-2"
                    >
                      Open WhatsApp again <ExternalLink size={13} aria-hidden />
                    </a>
                  </p>
                </m.div>
              )}
            </AnimatePresence>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-bold">
        {label}
      </label>
      {children}
      {error && <FieldError id={`${id}-error`} message={error} />}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="mt-2 text-sm font-semibold text-shut">
      {message}
    </p>
  );
}
