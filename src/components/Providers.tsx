"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

type BookingContextValue = {
  serviceId: string;
  /** Bumps on each "Book This Service" click, so the form can respond to repeat clicks. */
  requestCount: number;
  setServiceId: (id: string) => void;
  bookService: (id: string) => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking() {
  const value = useContext(BookingContext);
  if (!value) throw new Error("useBooking must be used inside Providers");
  return value;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [serviceId, setServiceId] = useState("");
  const [requestCount, setRequestCount] = useState(0);

  const bookService = useCallback((id: string) => {
    setServiceId(id);
    setRequestCount((count) => count + 1);
  }, []);

  const value = useMemo(
    () => ({ serviceId, requestCount, setServiceId, bookService }),
    [serviceId, requestCount, bookService],
  );

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
      </MotionConfig>
    </LazyMotion>
  );
}
