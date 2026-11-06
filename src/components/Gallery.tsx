"use client";

import { AnimatePresence, m } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { galleryCategories, galleryImages, hasStockGalleryImages, type GalleryImage } from "@/config/content";
import { Reveal } from "./Reveal";

type Filter = (typeof galleryCategories)[number]["id"];

/** A repeating rhythm of shapes in a masonry layout: asymmetric, with no gaps at any filter. */
const shapes = ["aspect-[4/5]", "aspect-square", "aspect-[3/4]", "aspect-[4/3]", "aspect-[4/5]", "aspect-[5/4]", "aspect-[3/4]"];

const SWIPE_THRESHOLD = 50;

export function Gallery() {
  const [filter, setFilter] = useState<Filter>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const touchStart = useRef<number | null>(null);

  const visible = filter === "all" ? galleryImages : galleryImages.filter((image) => image.category === filter);
  const current: GalleryImage | null = openIndex === null ? null : (visible[openIndex] ?? null);

  const go = useCallback(
    (step: number) => {
      setDirection(step);
      setOpenIndex((index) => (index === null ? index : (index + step + visible.length) % visible.length));
    },
    [visible.length],
  );

  const close = useCallback(() => setOpenIndex(null), []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (openIndex !== null && !dialog.open) dialog.showModal();
    if (openIndex === null && dialog.open) {
      dialog.close();
      triggerRef.current?.focus();
    }
  }, [openIndex]);

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  }

  function onTouchEnd(event: React.TouchEvent) {
    if (touchStart.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(delta) > SWIPE_THRESHOLD) go(delta < 0 ? 1 : -1);
  }

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="section-pad bg-warm">
      <div className="container-site">
        <Reveal className="grid gap-5 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow text-royal">Gallery</p>
            <h2 id="gallery-title" className="section-title mt-4 text-royal">
              The look of good grooming
            </h2>
          </div>
          {hasStockGalleryImages && (
            <p className="max-w-md text-sm text-charcoal/80 lg:justify-self-end" data-testid="gallery-note">
              <strong>These are sample images for inspiration,</strong> not photos of SY STYLO customers or our
              salon. Bring along a look you like and we&apos;ll talk it through.
            </p>
          )}
        </Reveal>

        <div role="group" aria-label="Filter gallery by category" className="mt-8 flex flex-wrap gap-2 lg:mt-10">
          {galleryCategories.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
              className={`min-h-11 border px-4 text-sm font-semibold transition-colors duration-300 ${
                filter === id
                  ? "border-royal bg-royal text-white"
                  : "border-royal/25 text-royal hover:border-royal"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <m.ul
            key={filter}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-6 columns-2 gap-2.5 lg:columns-3 lg:gap-4"
          >
            {visible.map((image, index) => (
              <li key={image.id} className={`mb-2.5 break-inside-avoid lg:mb-4 ${shapes[index % shapes.length]}`}>
                <m.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "0px 0px -5% 0px" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  data-reveal
                  onClick={(event) => {
                    triggerRef.current = event.currentTarget;
                    setDirection(1);
                    setOpenIndex(index);
                  }}
                  aria-label={`View full screen: ${image.alt}`}
                  className="group relative block size-full cursor-zoom-in overflow-hidden bg-lavender"
                >
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-deep/0 transition-colors duration-500 group-hover:bg-deep/25" />
                  <Expand
                    size={20}
                    aria-hidden
                    className="absolute top-3 right-3 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  {image.source === "stock" && (
                    <span className="absolute bottom-0 left-0 bg-deep/75 px-1.5 py-0.5 text-[0.62rem] text-white">
                      Illustrative
                    </span>
                  )}
                </m.button>
              </li>
            ))}
          </m.ul>
        </AnimatePresence>
      </div>

      <dialog
        ref={dialogRef}
        className="lightbox m-0 p-0"
        aria-label="Full-screen image viewer"
        onClose={close}
        onKeyDown={onKeyDown}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        onTouchStart={(event) => {
          touchStart.current = event.touches[0].clientX;
        }}
        onTouchEnd={onTouchEnd}
      >
        {current && (
          <div className="flex h-full flex-col text-white" onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}>
            <div className="flex items-center justify-between p-2 sm:p-4">
              <p className="pl-2 text-sm tabular-nums" aria-live="polite">
                {(openIndex ?? 0) + 1} / {visible.length}
              </p>
              <button
                type="button"
                onClick={close}
                aria-label="Close image viewer"
                className="grid size-12 place-items-center hover:text-gold"
              >
                <X size={26} aria-hidden />
              </button>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <m.div
                  key={current.id}
                  custom={direction}
                  initial={{ opacity: 0, x: 60 * direction }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 * direction }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 mx-2 sm:mx-20"
                >
                  <Image src={current.src} alt={current.alt} fill sizes="100vw" quality={90} className="object-contain" />
                </m.div>
              </AnimatePresence>
              {visible.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous image"
                    className="absolute top-1/2 left-1 hidden size-12 -translate-y-1/2 place-items-center hover:text-gold sm:left-4 sm:grid"
                  >
                    <ChevronLeft size={32} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next image"
                    className="absolute top-1/2 right-1 hidden size-12 -translate-y-1/2 place-items-center hover:text-gold sm:right-4 sm:grid"
                  >
                    <ChevronRight size={32} aria-hidden />
                  </button>
                </>
              )}
            </div>

            <div className="mx-auto max-w-2xl p-4 text-center text-sm">
              <p>{current.alt}</p>
              {current.source === "stock" && (
                <p className="mt-1 text-xs text-white/70">Illustrative image, not SY STYLO customer work.</p>
              )}
              {visible.length > 1 && <p className="mt-1 text-xs text-white/70 sm:hidden">Swipe to see more</p>}
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
