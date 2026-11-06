"use client";

import { useSyncExternalStore } from "react";

/**
 * A shared clock that ticks on each minute boundary and when the tab becomes visible again.
 * Returns null during server rendering, because a pre-rendered page must never bake in
 * an open/closed status.
 */
let current: Date | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function tick() {
  current = new Date();
  listeners.forEach((listener) => listener());
  schedule();
}

function schedule() {
  clearTimeout(timer);
  const msToNextMinute = 60_000 - (Date.now() % 60_000);
  timer = setTimeout(tick, msToNextMinute + 50);
}

function onVisibility() {
  if (document.visibilityState === "visible") tick();
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) {
    schedule();
    document.addEventListener("visibilitychange", onVisibility);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    }
  };
}

function getSnapshot() {
  current ??= new Date();
  return current;
}

const getServerSnapshot = () => null;

export function useNow(): Date | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Returns a fresh reading, for checks at the moment of an action such as submitting a form. */
export function readNow(): Date {
  return new Date();
}
