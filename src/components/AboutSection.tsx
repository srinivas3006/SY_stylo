import Image from "next/image";
import { salonConfig } from "@/config/salon";
import { FrameCorners } from "./Brand";
import { Reveal } from "./Reveal";

export function AboutSection() {
  const { owner, businessType } = salonConfig;
  return (
    <section id="about" aria-labelledby="about-title" className="section-pad bg-lavender/60">
      <div className="container-site grid items-center gap-12 md:grid-cols-[minmax(0,22rem)_1fr] lg:grid-cols-[minmax(0,25rem)_1fr] lg:gap-24 xl:px-24">
        <Reveal from="left" className="mx-auto w-full max-w-[20rem] md:max-w-none">
          <figure>
            <div className="relative aspect-[389/397] bg-lavender">
              <FrameCorners />
              {/* The poster's photo is small, so this layout never shows it much above its real size. */}
              <Image
                src={owner.photo}
                alt={`${owner.nameEnglish}, proprietor of SY STYLO, in a white shirt`}
                fill
                sizes="(min-width: 1024px) 400px, (min-width: 768px) 352px, 320px"
                quality={90}
                className="object-cover"
              />
            </div>
            <figcaption className="mt-5 text-center md:text-left">
              <span lang="te" className="block font-telugu text-xl font-medium text-royal">
                {owner.nameTelugu}
              </span>
              <span className="text-sm text-charcoal/75">{owner.nameEnglish}, Proprietor</span>
            </figcaption>
          </figure>
        </Reveal>

        <Reveal from="right">
          <p className="eyebrow text-royal">About SY STYLO</p>
          <h2 id="about-title" className="section-title mt-4 text-royal">
            Good grooming. Personal touch.
          </h2>
          <div className="mt-6 max-w-xl space-y-4 text-charcoal/85">
            <p className="text-lg font-medium text-charcoal">
              SY STYLO is a {businessType.toLowerCase()} in {salonConfig.addressParts.addressLocality}, where looking
              after yourself is treated as something personal.
            </p>
            <p>
              We believe good grooming should suit the person in the chair. Your hair, your face and the way you like
              to look all come first, so every visit starts with a conversation about what you want.
            </p>
            <p>
              From a regular cut and beard trim to colour, hair care, facials and beauty services, we keep things
              professional, comfortable and easy, and we take our time over the details.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
