import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Cinzel, Manrope, Noto_Serif_Telugu } from "next/font/google";
import { Providers } from "@/components/Providers";
import { salonConfig } from "@/config/salon";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["500", "600"],
  display: "swap",
});
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const telugu = Noto_Serif_Telugu({
  subsets: ["telugu"],
  variable: "--font-telugu-serif",
  weight: ["500", "700"],
  display: "swap",
  preload: false,
});

const description =
  "SY STYLO is a men's salon and beauty parlour in Nakrekal, Telangana. Haircuts, beard styling, hair colouring, facials and more. Request an appointment on WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(salonConfig.siteUrl),
  title: "SY STYLO | Men's Salon & Beauty Parlour in Nakrekal",
  description,
  keywords: ["men's salon Nakrekal", "barber Nakrekal", "beauty parlour Nakrekal", "SY STYLO", "haircut Nakrekal"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: salonConfig.name,
    title: "SY STYLO | Your Style. Your Identity.",
    description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: "SY STYLO | Your Style. Your Identity.", description },
};

export const viewport: Viewport = {
  themeColor: "#210B42",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Runs before first paint: skips the loader on repeat views and holds hero animation states. */
const bootScript = `(function(){var d=document.documentElement;try{if(sessionStorage.getItem('sy-seen'))d.classList.add('seen');sessionStorage.setItem('sy-seen','1')}catch(e){}if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('js-anim');setTimeout(function(){d.classList.remove('js-anim')},3000)}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      className={`${bodoni.variable} ${cinzel.variable} ${manrope.variable} ${telugu.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
