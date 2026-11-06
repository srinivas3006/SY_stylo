import { Logo } from "./Brand";

/** A brief logo reveal, about a second long. Pure CSS, never blocks interaction. */
export function PageLoader() {
  return (
    <div aria-hidden className="page-loader">
      <div className="page-loader-mark text-2xl">
        <Logo tone="light" />
      </div>
    </div>
  );
}
