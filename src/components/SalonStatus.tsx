"use client";

import { AnimatePresence, m } from "framer-motion";
import { salonConfig } from "@/config/salon";
import { useNow } from "@/hooks/useNow";
import { getSalonStatus, type StatusState } from "@/lib/hours";

export function useSalonStatus() {
  const now = useNow();
  return now ? getSalonStatus(now, salonConfig) : null;
}

const dotClasses: Record<"light" | "dark", Record<StatusState, string>> = {
  light: { open: "bg-open", closed: "bg-shut", "opens-early": "bg-gold" },
  dark: { open: "bg-open-light", closed: "bg-shut-light", "opens-early": "bg-gold" },
};

export function StatusDot({ state, tone = "light" }: { state: StatusState; tone?: "light" | "dark" }) {
  const color = dotClasses[tone][state];
  return (
    <span aria-hidden className="relative inline-flex size-2.5 flex-none">
      {state === "open" && <span className={`status-pulse absolute inset-0 rounded-full ${color}`} />}
      <span className={`relative size-2.5 rounded-full transition-colors duration-500 ${color}`} />
    </span>
  );
}

/** Live status line. Shows a neutral placeholder until the visitor's clock is available. */
export function StatusBadge({ tone = "light", showDetail = false }: { tone?: "light" | "dark"; showDetail?: boolean }) {
  const status = useSalonStatus();
  const muted = tone === "dark" ? "text-white/75" : "text-charcoal/70";

  return (
    <span role="status" className="inline-flex min-h-6 items-center gap-2.5" data-testid="salon-status">
      <AnimatePresence mode="wait" initial={false}>
        {status ? (
          <m.span
            key={status.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-0.5"
          >
            <StatusDot state={status.state} tone={tone} />
            <span className="font-bold">{status.label}</span>
            {showDetail && <span className={muted}>{status.detail}</span>}
          </m.span>
        ) : (
          <span className={muted}>Checking today&apos;s hours</span>
        )}
      </AnimatePresence>
    </span>
  );
}
