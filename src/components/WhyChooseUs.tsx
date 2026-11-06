import { Armchair, Scissors, Search, UserRound, type LucideIcon } from "lucide-react";
import { Reveal } from "./Reveal";

const features: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: UserRound,
    title: "Personalised Grooming",
    body: "We listen first, then shape the service around you and how you like to look.",
  },
  {
    icon: Scissors,
    title: "Professional Styling",
    body: "Careful, considered work on your hair and beard, from start to finish.",
  },
  {
    icon: Armchair,
    title: "Comfortable Environment",
    body: "A relaxed place to sit back, take a moment and be looked after.",
  },
  {
    icon: Search,
    title: "Attention to Detail",
    body: "The neckline, the beard line, the final check. The small things matter to us.",
  },
];

export function WhyChooseUs() {
  return (
    <section aria-labelledby="why-title" className="section-pad bg-royal text-white">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow text-gold">Why Choose SY STYLO</p>
          <h2 id="why-title" className="section-title mt-4 max-w-3xl">
            Care you can see
          </h2>
        </Reveal>
        <ul className="mt-10 grid border-t border-white/20 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, body }, index) => (
            <li
              key={title}
              className="border-b border-white/20 sm:odd:border-r lg:border-r lg:border-b-0 lg:last:border-r-0"
            >
              <Reveal delay={index * 0.08} className="group h-full p-6 lg:p-8">
                <Icon
                  size={30}
                  strokeWidth={1.4}
                  aria-hidden
                  className="text-gold transition-transform duration-500 ease-luxe group-hover:-translate-y-1"
                />
                <h3 className="mt-5 text-2xl">{title}</h3>
                <p className="mt-3 text-sm text-white/80">{body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
