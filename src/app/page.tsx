import { AboutSection } from "@/components/AboutSection";
import { BookingForm } from "@/components/BookingForm";
import { ContactSection } from "@/components/ContactSection";
import { FAQ } from "@/components/FAQ";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { LocationMap } from "@/components/LocationMap";
import { MobileActionBar } from "@/components/MobileActionBar";
import { Navbar } from "@/components/Navbar";
import { OpeningHours } from "@/components/OpeningHours";
import { PageLoader } from "@/components/PageLoader";
import { ServiceSection } from "@/components/ServiceSection";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { salonConfig } from "@/config/salon";
import { isOpeningTimeConfirmed } from "@/lib/hours";

function structuredData() {
  const { name, phone, addressParts, coordinates, siteUrl, googleMapsUrl, closedDays, openingTime, closingTime } =
    salonConfig;
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const social = Object.values(salonConfig.social).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name,
    description: salonConfig.businessType,
    url: siteUrl,
    telephone: phone,
    image: `${siteUrl}/images/brand/owner.jpg`,
    hasMap: googleMapsUrl,
    address: { "@type": "PostalAddress", ...addressParts },
    geo: { "@type": "GeoCoordinates", ...coordinates },
    ...(social.length > 0 ? { sameAs: social } : {}),
    // Search engines need an exact opening time, so hours are published only once it's confirmed.
    ...(isOpeningTimeConfirmed(salonConfig)
      ? {
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: dayNames.filter((_, i) => !closedDays.includes(i)),
            opens: openingTime,
            closes: closingTime,
          },
        }
      : {}),
  };
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()).replace(/</g, "\\u003c") }}
      />
      <PageLoader />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[70] focus:bg-gold focus:px-4 focus:py-2 focus:text-deep"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <div id="services">
          <ServiceSection />
          <BookingForm />
        </div>
        <Gallery />
        <AboutSection />
        <WhyChooseUs />
        <FAQ />
        <div id="contact">
          <section id="find-us" aria-labelledby="find-us-title" className="section-pad bg-lavender/60">
            <div className="container-site">
              <LocationMap />
              <div className="mt-12 lg:mt-16">
                <OpeningHours />
              </div>
            </div>
          </section>
          <ContactSection />
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
      <MobileActionBar />
    </>
  );
}
