"use client";

import { useEffect, useState } from "react";
import { whatsappHref } from "@/config/salon";
import { WhatsAppIcon } from "./Brand";

/** Tablet and desktop only. Steps aside at the footer so it never covers footer links. */
export function FloatingWhatsApp() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting));
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with SY STYLO on WhatsApp"
      data-testid="floating-whatsapp"
      tabIndex={hidden ? -1 : undefined}
      className={`fixed right-6 bottom-6 z-40 hidden size-14 place-items-center rounded-full bg-gold text-deep shadow-[0_10px_30px_-8px_rgb(33_11_66/0.6)] transition-[transform,opacity,background-color] duration-300 hover:scale-105 hover:bg-[#e7b95e] md:grid ${
        hidden ? "pointer-events-none translate-y-4 opacity-0" : ""
      }`}
    >
      <WhatsAppIcon size={28} />
    </a>
  );
}
