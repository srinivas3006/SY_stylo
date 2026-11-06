import { salonConfig, telHref, whatsappHref } from "@/config/salon";
import { getHoursLabel } from "@/lib/hours";
import { Logo } from "./Brand";

const socialLabels = { instagram: "Instagram", facebook: "Facebook", youtube: "YouTube" } as const;

export function Footer() {
  const socials = (Object.keys(socialLabels) as (keyof typeof socialLabels)[]).filter((key) => salonConfig.social[key]);

  const linkClass = "inline-flex min-h-8 items-center hover:text-gold";

  return (
    <footer id="site-footer" className="border-t border-white/10 bg-[#170730] py-12 text-sm text-white/80">
      <div className="container-site grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="text-lg">
            <Logo tone="light" />
          </span>
          <p className="mt-3">{salonConfig.businessType}</p>
        </div>
        <div>
          <h2 className="font-sans text-xs font-bold tracking-widest text-gold uppercase">Visit</h2>
          <address className="mt-3 not-italic">{salonConfig.address}</address>
          <a href={salonConfig.directionsUrl} target="_blank" rel="noopener noreferrer" className={`${linkClass} underline underline-offset-4`}>
            Get Directions
          </a>
        </div>
        <div>
          <h2 className="font-sans text-xs font-bold tracking-widest text-gold uppercase">Hours</h2>
          <p className="mt-3">Monday, Wednesday to Sunday</p>
          <p>{getHoursLabel(salonConfig)}</p>
          <p className="mt-1">Closed every Tuesday</p>
        </div>
        <div>
          <h2 className="font-sans text-xs font-bold tracking-widest text-gold uppercase">Connect</h2>
          <ul className="mt-2">
            <li>
              <a href={telHref} className={linkClass}>
                Call {salonConfig.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
                WhatsApp
              </a>
            </li>
            {socials.map((key) => (
              <li key={key}>
                <a href={salonConfig.social[key]} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {socialLabels[key]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="container-site mt-10 border-t border-white/10 pt-6 text-xs text-white/65">
        © {new Date().getFullYear()} {salonConfig.name}. All rights reserved.
      </p>
    </footer>
  );
}
