"use client";

import { m } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Direction the element travels in from. */
  from?: "below" | "left" | "right";
};

const offsets = {
  below: { y: 28 },
  left: { x: -36 },
  right: { x: 36 },
};

export function Reveal({ children, className, delay = 0, from = "below" }: RevealProps) {
  return (
    <m.div
      data-reveal
      className={className}
      initial={{ opacity: 0, ...offsets[from] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
