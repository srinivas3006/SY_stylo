"use client";

import { ArrowUpRight, Clock } from "lucide-react";
import Image from "next/image";
import type { Service } from "@/config/content";
import { useBooking } from "./Providers";
import { scrollToBooking } from "./BookingForm";

export function ServiceCard({ service, priorityOffset = false }: { service: Service; priorityOffset?: boolean }) {
  const { bookService } = useBooking();

  return (
    <article
      className={`group grid h-full grid-cols-[7.5rem_1fr] bg-white shadow-[0_0_0_1px_rgb(50_16_100/0.1)] transition-shadow duration-500 hover:shadow-[0_18px_40px_-20px_rgb(50_16_100/0.45)] sm:grid-cols-1 sm:grid-rows-[auto_1fr] ${
        priorityOffset ? "lg:translate-y-10" : ""
      }`}
    >
      <div className="relative min-h-44 overflow-hidden bg-lavender sm:aspect-[4/3] sm:min-h-0">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 120px"
          className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
        />
      </div>
      <div className="flex min-w-0 flex-col p-4 lg:p-5">
        <h3 className="text-xl lg:text-[1.45rem]">{service.name}</h3>
        <p className="mt-2 text-sm text-charcoal/75">{service.description}</p>
        <dl className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <div>
            <dt className="sr-only">Price</dt>
            <dd className={service.price ? "font-bold text-royal" : "text-charcoal/70"}>
              {service.price ?? "Price on request"}
            </dd>
          </div>
          {service.duration && (
            <div className="inline-flex items-center gap-1.5 text-charcoal/70">
              <Clock size={14} aria-hidden />
              <dt className="sr-only">Duration</dt>
              <dd>{service.duration}</dd>
            </div>
          )}
        </dl>
        <div className="mt-auto pt-4">
          <a
            href="#book"
            onClick={(event) => {
              event.preventDefault();
              bookService(service.id);
              scrollToBooking();
            }}
            aria-label={`Book ${service.name}`}
            className="btn btn-outline-royal min-h-11! w-full px-3! text-[0.82rem]! group-hover:bg-royal group-hover:text-white"
          >
            Book This Service <ArrowUpRight size={16} aria-hidden />
          </a>
        </div>
      </div>
    </article>
  );
}
