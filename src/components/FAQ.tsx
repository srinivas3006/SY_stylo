import { Plus } from "lucide-react";
import { services } from "@/config/content";
import { salonConfig } from "@/config/salon";
import { getClosingLabel, getOpeningLabel } from "@/lib/hours";
import { Reveal } from "./Reveal";

const opening = getOpeningLabel(salonConfig);
const openingPhrase = opening.startsWith("Before") ? opening.toLowerCase() : `at ${opening}`;

const items: { question: string; answer: string }[] = [
  {
    question: "What services are available?",
    answer: `${services.map((s) => s.name).join(", ")}. Call or message us if you'd like to know more about any of them.`,
  },
  {
    question: "How can I book an appointment?",
    answer: `Fill in the booking form on this page and press Confirm via WhatsApp, or call ${salonConfig.phoneDisplay}. A WhatsApp booking is a request, and your appointment is confirmed once the salon replies.`,
  },
  {
    question: "Where is SY STYLO located?",
    answer: `${salonConfig.address}. Use the Get Directions button in the Find Us section to navigate here with Google Maps.`,
  },
  {
    question: "Is the salon open on Tuesday?",
    answer: "No. SY STYLO remains closed every Tuesday.",
  },
  {
    question: "What are the opening hours?",
    answer: `We're open Monday and Wednesday to Sunday. We open ${openingPhrase} and close at ${getClosingLabel(salonConfig)}, Indian Standard Time. We're closed every Tuesday.`,
  },
];

export function FAQ() {
  return (
    <section aria-labelledby="faq-title" className="section-pad bg-warm">
      <div className="container-site grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow text-royal">Questions</p>
          <h2 id="faq-title" className="section-title mt-4 text-royal">
            Good to know
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="border-t border-royal/20">
          {items.map(({ question, answer }) => (
            <details key={question} className="faq-item border-b border-royal/20">
              <summary className="flex min-h-16 list-none items-center justify-between gap-4 py-3 font-display text-xl text-royal lg:text-2xl">
                {question}
                <Plus size={22} aria-hidden className="flex-none" />
              </summary>
              <p className="max-w-2xl pb-5 text-charcoal/85">{answer}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
