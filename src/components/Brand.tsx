type LogoProps = {
  /** "light" for dark backgrounds, "dark" for light backgrounds. */
  tone?: "light" | "dark";
  className?: string;
};

export function Logo({ tone = "dark", className = "" }: LogoProps) {
  const stylo = tone === "light" ? "text-white" : "text-royal";
  const sy = tone === "light" ? "text-gold" : "text-royal";
  return (
    <span className={`inline-flex items-center gap-2.5 font-brand font-semibold leading-none ${className}`}>
      <span className={`text-[1.45em] transition-colors duration-300 ${sy}`}>SY</span>
      <span aria-hidden className="h-[1.3em] w-px bg-gold" />
      <span className={`tracking-[0.16em] transition-colors duration-300 ${stylo}`}>STYLO</span>
    </span>
  );
}

/** The stepped gold corners from the SY STYLO poster's border. */
export function FrameCorners({ inset = "-0.625rem", size = 44 }: { inset?: string; size?: number }) {
  const positions = [
    { top: inset, left: inset, transform: "none" },
    { top: inset, right: inset, transform: "scaleX(-1)" },
    { bottom: inset, left: inset, transform: "scaleY(-1)" },
    { bottom: inset, right: inset, transform: "scale(-1)" },
  ];
  return (
    <>
      {positions.map((style, i) => (
        <svg
          key={i}
          aria-hidden
          viewBox="0 0 44 44"
          width={size}
          height={size}
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="1.25"
          className="pointer-events-none absolute z-10"
          style={style}
        >
          <path d="M.6 44V.6H44" />
          <path d="M6 30V6h24" />
          <path d="M6 30h7V13h17v-7" />
          <path d="M19 19h6v6h-6z" />
        </svg>
      ))}
    </>
  );
}

export function WhatsAppIcon({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
