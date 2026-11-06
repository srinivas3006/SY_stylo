import { ExternalLink, Landmark, MapPin, Navigation, Phone } from "lucide-react";
import { salonConfig, telHref } from "@/config/salon";
import { Reveal } from "./Reveal";

export function LocationMap() {
  const details = [
    { icon: MapPin, label: "Address", value: salonConfig.address },
    { icon: Landmark, label: "Landmark", value: salonConfig.landmark },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
      <Reveal>
        <p className="eyebrow text-royal">Find Us</p>
        <h2 id="find-us-title" className="section-title mt-4 text-royal">
          Come and see us
        </h2>
        <dl className="mt-7 space-y-4">
          {details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex gap-3">
              <Icon size={20} className="mt-0.5 flex-none text-royal" aria-hidden />
              <div>
                <dt className="text-xs font-bold tracking-wider text-charcoal/70 uppercase">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            </div>
          ))}
          <div className="flex gap-3">
            <Phone size={20} className="mt-0.5 flex-none text-royal" aria-hidden />
            <div>
              <dt className="text-xs font-bold tracking-wider text-charcoal/70 uppercase">Phone</dt>
              <dd>
                <a href={telHref} className="inline-flex min-h-11 items-center font-medium underline-offset-4 hover:underline">
                  {salonConfig.phoneDisplay}
                </a>
              </dd>
            </div>
          </div>
        </dl>
        <div className="mt-7 grid gap-3 sm:flex lg:grid xl:flex">
          <a href={salonConfig.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-royal min-h-14! sm:min-h-12!">
            <Navigation size={18} aria-hidden /> Get Directions
          </a>
          <a href={salonConfig.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-royal">
            View on Google Maps <ExternalLink size={16} aria-hidden />
          </a>
        </div>
      </Reveal>

      <Reveal from="right" delay={0.1} className="h-[20rem] sm:h-[26rem] lg:h-auto lg:min-h-[28rem]">
        <iframe
          title={`Google Map showing ${salonConfig.name} in ${salonConfig.addressParts.addressLocality}`}
          src={salonConfig.mapEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="size-full border-0 bg-lavender"
        />
      </Reveal>
    </div>
  );
}
