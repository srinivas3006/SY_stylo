import { CalendarCheck, Phone } from "lucide-react";
import { salonConfig, telHref, whatsappHref } from "@/config/salon";
import { WhatsAppIcon } from "./Brand";
import { Reveal } from "./Reveal";

export function ContactSection() {
  return (
    <section aria-labelledby="contact-title" className="section-pad relative overflow-hidden bg-deep text-white">
      <span
        aria-hidden
        lang="te"
        className="pointer-events-none absolute -right-4 -bottom-10 font-telugu text-[9rem] leading-none font-bold text-transparent opacity-25 [-webkit-text-stroke:1px_var(--color-gold)] md:text-[16rem]"
      >
        {salonConfig.nameTelugu}
      </span>
      <div className="container-site relative">
        <Reveal>
          <p className="eyebrow text-gold">Contact</p>
          <h2 id="contact-title" className="section-title mt-4 max-w-3xl">
            Ready for a fresh look?
          </h2>
          <p className="mt-5 max-w-md text-white/85">Call the salon directly, send a message, or request a time that suits you.</p>
          <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
            <a href="#book" className="btn btn-gold">
              <CalendarCheck size={18} aria-hidden /> Book Appointment
            </a>
            <a href={telHref} className="btn btn-outline-light">
              <Phone size={18} aria-hidden /> Call {salonConfig.phoneDisplay}
            </a>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">
              <WhatsAppIcon size={18} /> WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
