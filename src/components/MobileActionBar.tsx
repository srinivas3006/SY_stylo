import { CalendarCheck, Phone } from "lucide-react";
import { telHref, whatsappHref } from "@/config/salon";
import { WhatsAppIcon } from "./Brand";

const itemClass = "flex h-16 flex-col items-center justify-center gap-1 text-xs font-bold";

export function MobileActionBar() {
  return (
    <nav
      aria-label="Quick actions"
      data-testid="mobile-action-bar"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 bg-deep pb-[env(safe-area-inset-bottom)] text-white shadow-[0_-1px_0_rgb(217_164_65/0.5)] md:hidden"
    >
      <a href={telHref} className={itemClass}>
        <Phone size={20} aria-hidden /> Call Now
      </a>
      <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={`${itemClass} border-x border-white/15`}>
        <WhatsAppIcon size={20} /> WhatsApp
      </a>
      <a href="#book" className={`${itemClass} bg-gold text-deep`}>
        <CalendarCheck size={20} aria-hidden /> Book Now
      </a>
    </nav>
  );
}
