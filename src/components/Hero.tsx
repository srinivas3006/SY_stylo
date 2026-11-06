"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { heroImage } from "@/config/content";
import { salonConfig } from "@/config/salon";
import { FrameCorners, Logo } from "./Brand";
import { StatusBadge } from "./SalonStatus";

const lines = [
  { words: ["YOUR", "STYLE."], accent: false },
  { words: ["YOUR", "IDENTITY."], accent: true },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    gsap.registerPlugin(ScrollTrigger);

    const seen = document.documentElement.classList.contains("seen");
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const timeline = gsap.timeline({ delay: seen ? 0.05 : 0.5, defaults: { ease: "power3.out" } });
        timeline
          .fromTo(
            "[data-hero-image]",
            { clipPath: "inset(100% 0 0 0)" },
            { clipPath: "inset(0% 0 0 0)", duration: 1.1, ease: "expo.inOut" },
          )
          .fromTo("[data-hero-word]", { opacity: 0, yPercent: 60 }, { opacity: 1, yPercent: 0, duration: 0.9, stagger: 0.08 }, 0.15)
          .fromTo("[data-hero-fade]", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.07 }, 0.45);

        gsap.to("[data-hero-parallax]", {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: element, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-ghost]", {
          yPercent: -14,
          ease: "none",
          scrollTrigger: { trigger: element, start: "top top", end: "bottom top", scrub: true },
        });
      }, element);
      // GSAP now owns these states, so the pre-paint hiding styles can go.
      document.documentElement.classList.remove("js-anim");
      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <section
      id="home"
      ref={root}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden bg-deep text-white md:min-h-svh"
    >
      {/* The Telugu wordmark from the poster, as a large outlined backdrop */}
      <span
        aria-hidden
        data-hero-ghost
        lang="te"
        className="pointer-events-none absolute -bottom-[6vw] -left-[3vw] z-0 hidden whitespace-nowrap font-telugu text-[23vw] leading-none font-bold text-transparent opacity-25 [-webkit-text-stroke:1px_var(--color-gold)] lg:block"
      >
        {salonConfig.nameTelugu}
      </span>

      {/* Full-bleed behind the text on phones and tablets, a framed portrait on desktop */}
      <div className="absolute inset-0 z-0 lg:inset-auto lg:top-28 lg:right-[max(4vw,calc((100vw-88rem)/2+3rem))] lg:bottom-14 lg:w-[38vw] lg:max-w-[38rem]">
        <div data-hero-image className="absolute inset-0 overflow-hidden">
          <div data-hero-parallax className="absolute -inset-y-[10%] inset-x-0">
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              fill
              priority
              quality={75}
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover object-[50%_18%]"
            />
          </div>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-deep/55 via-deep/20 via-35% to-deep to-[78%] lg:hidden" />
        </div>
        <div data-hero-fade className="absolute inset-0 hidden lg:block">
          <FrameCorners />
        </div>
        {heroImage.source === "stock" && (
          <p className="absolute top-[4.75rem] right-4 z-10 bg-deep/70 px-2 py-0.5 text-[0.65rem] text-white/85 lg:top-2 lg:right-auto lg:left-2">
            Illustrative image
          </p>
        )}
      </div>

      <div className="container-site relative z-10 mt-auto flex flex-1 flex-col justify-end pt-28 pb-8 lg:justify-center lg:pt-28 lg:pb-16">
        <div className="max-w-[46rem] lg:max-w-[50vw]">
          <div data-hero-fade className="mb-5 hidden text-3xl lg:block">
            <Logo tone="light" />
          </div>
          <p data-hero-fade className="eyebrow text-gold">
            {salonConfig.businessType}
          </p>
          <h1
            id="hero-title"
            className="mt-4 text-[clamp(2.75rem,13vw,5.5rem)] leading-[0.98] lg:text-[clamp(4.5rem,6.9vw,7.5rem)]"
          >
            {lines.map(({ words, accent }) => (
              <span key={words.join(" ")} className={`block ${accent ? "text-gold" : ""}`}>
                {words.map((word) => (
                  <span key={word}>
                    <span data-hero-word className="inline-block">
                      {word}
                    </span>{" "}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p data-hero-fade className="mt-5 max-w-md text-base text-white/85 lg:mt-7 lg:text-lg">
            Look sharp. Feel confident. Experience grooming at SY STYLO.
          </p>
          <div data-hero-fade className="mt-6 grid gap-3 sm:flex lg:mt-9">
            <a href="#book" className="btn btn-gold">
              Book Appointment
            </a>
            <a href="#services" className="btn btn-outline-light">
              Explore Services <ArrowDown size={16} aria-hidden />
            </a>
          </div>
          <div data-hero-fade className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm lg:mt-9">
            <StatusBadge tone="dark" />
            <a href="#find-us" className="inline-flex min-h-6 items-center gap-2 text-white/85 hover:text-white">
              <MapPin size={16} className="text-gold" aria-hidden />
              {salonConfig.addressParts.addressLocality}, {salonConfig.addressParts.addressRegion}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
