import { hasStockServiceImages, services } from "@/config/content";
import { Reveal } from "./Reveal";
import { ServiceCard } from "./ServiceCard";

export function ServiceSection() {
  return (
    <section aria-labelledby="services-title" className="section-pad bg-warm">
      <div className="container-site">
        <Reveal className="grid gap-5 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow text-royal">Our Services</p>
            <h2 id="services-title" className="section-title mt-4 text-royal">
              Grooming, done your way
            </h2>
          </div>
          <p className="max-w-md text-charcoal/80 lg:justify-self-end">
            Choose what you need and send us your preferred time. Not sure what suits you? Ask, and we&apos;ll
            help you decide.
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-5 lg:pb-10">
          {services.map((service, index) => (
            <li key={service.id}>
              <Reveal delay={(index % 4) * 0.08} className="h-full">
                <ServiceCard service={service} priorityOffset={index % 2 === 1} />
              </Reveal>
            </li>
          ))}
        </ul>

        {hasStockServiceImages && (
          <p className="mt-6 text-xs text-charcoal/65">
            Photos are illustrative and do not show SY STYLO customers. Prices are confirmed by the salon.
          </p>
        )}
      </div>
    </section>
  );
}
