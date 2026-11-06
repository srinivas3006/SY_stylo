"use client";

import { AnimatePresence, m } from "framer-motion";
import { Phone } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { salonConfig, telHref } from "@/config/salon";
import { Logo } from "./Brand";

const links = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "gallery", label: "Gallery" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    links.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  const measure = useCallback(() => {
    const element = linkRefs.current[active];
    if (element) setIndicator({ left: element.offsetLeft, width: element.offsetWidth });
  }, [active]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const solid = scrolled && !open;
  const textOnHeader = solid ? "text-royal" : "text-white";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        solid ? "bg-warm/95 shadow-[0_1px_0_rgb(50_16_100/0.12)] backdrop-blur" : "bg-transparent"
      } ${open ? "bg-deep!" : ""}`}
    >
      <div className="container-site flex h-[4.25rem] items-center justify-between gap-3 lg:h-20">
        <a href="#home" aria-label="SY STYLO home" className="text-[0.92rem] lg:text-lg" onClick={() => setOpen(false)}>
          <Logo tone={solid ? "dark" : "light"} />
        </a>

        <nav aria-label="Main" className="relative hidden lg:block">
          <ul className="flex items-center gap-9">
            {links.map(({ id, label }) => (
              <li key={id}>
                <a
                  ref={(el) => {
                    linkRefs.current[id] = el;
                  }}
                  href={`#${id}`}
                  aria-current={active === id ? "true" : undefined}
                  className={`inline-block py-2 text-sm font-semibold transition-colors duration-300 ${textOnHeader}`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          {indicator && (
            <m.span
              aria-hidden
              className="absolute bottom-0 left-0 h-0.5 bg-gold"
              initial={false}
              animate={{ x: indicator.left, width: indicator.width }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
            />
          )}
        </nav>

        <div className="flex items-center gap-2 lg:gap-4">
          <a
            href={telHref}
            aria-label={`Call ${salonConfig.name}`}
            className={`hidden items-center gap-2 text-sm font-semibold lg:inline-flex ${textOnHeader}`}
          >
            <Phone size={16} aria-hidden />
            {salonConfig.phoneDisplay}
          </a>
          <a href="#book" className="btn btn-gold min-h-11! px-3.5! text-[0.8rem]! lg:px-5! lg:text-sm!" onClick={() => setOpen(false)}>
            <span className="lg:hidden">Book</span>
            <span className="hidden lg:inline">Book Appointment</span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
            className={`relative grid size-11 place-items-center lg:hidden ${textOnHeader}`}
          >
            <span aria-hidden className="relative block h-3.5 w-6">
              <span
                className={`absolute left-0 h-0.5 w-6 bg-current transition-transform duration-300 ease-luxe ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-6 bg-current transition-transform duration-300 ease-luxe ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-[4.25rem] bottom-0 overflow-y-auto bg-deep lg:hidden"
          >
            <nav aria-label="Mobile" className="container-site flex min-h-full flex-col justify-between pt-6 pb-10">
              <ul>
                {links.map(({ id, label }, index) => (
                  <m.li
                    key={id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * index + 0.1, duration: 0.4 }}
                    className="border-b border-white/10"
                  >
                    <a
                      href={`#${id}`}
                      onClick={() => setOpen(false)}
                      aria-current={active === id ? "true" : undefined}
                      className={`flex items-center justify-between py-4 font-display text-3xl ${
                        active === id ? "text-gold" : "text-white"
                      }`}
                    >
                      {label}
                    </a>
                  </m.li>
                ))}
              </ul>
              <div className="mt-8 grid gap-3">
                <a href="#book" onClick={() => setOpen(false)} className="btn btn-gold">
                  Book Appointment
                </a>
                <a href={telHref} className="btn btn-outline-light">
                  <Phone size={18} aria-hidden /> Call {salonConfig.phoneDisplay}
                </a>
              </div>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
