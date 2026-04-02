import { useState, useCallback, useEffect } from "react";
import MorphingSphere from "../components/MorphingSphere";
import SphereInfo from "../components/SphereInfo";

type IntroPhase = "sphere" | "reveal" | "done";
type TextState = "hidden" | "animating" | "visible";

export default function Hero({
  mobile,
  introPhase = "done",
  onSphereDrawn,
}: {
  mobile?: boolean;
  introPhase?: IntroPhase;
  onSphereDrawn?: () => void;
}) {
  const [sphereFocus, setSphereFocus] = useState(false);
  const closeSphere = useCallback(() => setSphereFocus(false), []);

  const fade = "transition-opacity duration-700 ease-out";

  // Mobile text: hidden → animating (staggered hero-in) → visible (transition-based for sphere focus)
  const [textState, setTextState] = useState<TextState>(
    !mobile || introPhase === "done" ? "visible" : "hidden",
  );

  useEffect(() => {
    if (mobile && introPhase === "done" && textState === "hidden") {
      // Small delay so the card border/bg is fully painted before text animates in
      const start = setTimeout(() => {
        setTextState("animating");
      }, 80);
      const end = setTimeout(() => setTextState("visible"), 80 + 950);
      return () => {
        clearTimeout(start);
        clearTimeout(end);
      };
    }
  }, [mobile, introPhase, textState]);

  // Helper: returns className + style for a mobile text element at a given stagger delay
  const mt = (
    delay: number,
  ): { className: string; style: React.CSSProperties | undefined } => {
    if (textState === "animating" && !sphereFocus)
      return {
        className: `animate-hero-in ${fade}`,
        style: { animationDelay: `${delay}ms` },
      };
    if (textState === "animating" || textState === "visible")
      return { className: fade, style: { opacity: sphereFocus ? 0 : 1 } };
    return { className: "", style: { opacity: 0 } };
  };

  return (
    <div
      className={
        mobile
          ? "px-8 md:px-14 pt-16 pb-8 landscape:pt-8 landscape:pb-4 min-h-[min(70vh,500px)] landscape:min-h-[max(70vh,400px)] flex flex-col justify-between relative overflow-hidden"
          : "absolute inset-0 px-14 py-10 md:px-16 md:py-12 flex flex-col justify-center"
      }>
      {/* Name wordmark */}
      {mobile ? (
        <h1 className={mt(0).className} style={mt(0).style}>
          <span className="block font-grotesk font-light text-[clamp(25px,4vw,30px)] leading-none tracking-display uppercase text-gray">
            daniel
          </span>
          <span className="block font-display font-bold text-[clamp(58px,10.5vw,70px)] leading-[1.05] tracking-tight text-ink">
            Vegara<span className="text-green-deep pl-[1px]">.</span>
          </span>
        </h1>
      ) : (
        <h1 className="animate-hero-in">
          <span className="block font-grotesk font-light text-[clamp(25px,4vw,30px)] leading-none tracking-display uppercase text-gray">
            daniel
          </span>
          <span className="block font-display font-bold text-[clamp(58px,10.5vw,70px)] leading-[1.05] tracking-tight text-ink">
            Vegara<span className="text-green-deep pl-[1px]">.</span>
          </span>
        </h1>
      )}

      {/* Structured data for SEO */}
      {!mobile && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Daniel Vegara",
              jobTitle: "Data Scientist",
              worksFor: { "@type": "Organization", name: "OECD" },
              url: "https://daniel.vegarabalsa.com",
              sameAs: [
                "https://linkedin.com/in/dvegarabalsa",
                "https://github.com/dani-37",
              ],
            }),
          }}
        />
      )}

      {mobile ? (
        <div>
          <p
            className={`font-grotesk text-label tracking-wide uppercase text-gray-muted ${mt(130).className}`}
            style={mt(130).style}>
            Data Scientist · OECD, Paris
          </p>
          <p
            className={`font-grotesk font-light text-body text-ink max-w-[360px] my-4 ${mt(260).className}`}
            style={mt(260).style}>
            I build data tools for teams working on climate, nature, and policy.
          </p>
          <p
            className={`font-grotesk text-label tracking-wide uppercase text-gray-muted ${mt(390).className}`}
            style={mt(390).style}>
            Imperial College · UCL
          </p>
        </div>
      ) : (
        <>
          {/* Role line */}
          <p className="font-grotesk text-label tracking-wide uppercase text-gray-muted animate-hero-in [animation-delay:130ms] mt-10">
            Data Scientist · OECD, Paris
          </p>
          {/* Tagline */}
          <p className="font-grotesk font-light text-body text-ink max-w-[360px] my-4 animate-hero-in [animation-delay:260ms]">
            I build data tools for teams working on climate, nature, and policy.
          </p>
          {/* Education line */}
          <p className="font-grotesk text-label mb-8 tracking-wide uppercase text-gray-muted animate-hero-in [animation-delay:400ms]">
            Imperial College · UCL
          </p>
        </>
      )}

      {/* Morphing sphere + info */}
      {mobile ? (
        <div
          className="absolute top-1/2 flex flex-col items-center transition-opacity duration-[3000ms] ease-in-out"
          style={{
            left: "calc(50% + max(0px, 0.5 * (100% - 500px)))",
            transform: "translate(-50%, -50%)",
            opacity: introPhase === "sphere" ? 1 : sphereFocus ? 1 : introPhase === "reveal" ? 0.7 : 0.3,
          }}>
          <MorphingSphere
            size={414}
            className={sphereFocus ? "" : "pointer-events-none"}
            intro={introPhase === "sphere"}
            onIntroComplete={onSphereDrawn}
          />
          <div
            className={`-mt-4 ${fade}`}
            style={{ opacity: sphereFocus ? 1 : 0 }}>
            <SphereInfo autoStart={sphereFocus} onDone={closeSphere} />
          </div>
          <button
            onClick={closeSphere}
            aria-label="Close sphere info"
            className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-gray hover:text-ink cursor-pointer bg-transparent border-0 z-10 ${fade}`}
            style={{
              opacity: sphereFocus ? 1 : 0,
              pointerEvents: sphereFocus ? "auto" : "none",
            }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ) : (
        <div
          className="absolute top-[45%] -translate-y-1/2 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-[60px]"
          style={{ width: 414, height: 414 }}>
          <MorphingSphere size={414} className="animate-hero-in [animation-delay:530ms] pointer-events-none" intro />
          <div className="absolute -bottom-5 w-full flex justify-center animate-hero-in [animation-delay:660ms]">
            <SphereInfo />
          </div>
        </div>
      )}

      {/* Footer links */}
      <div
        className={
          mobile ? mt(530).className : "animate-hero-in [animation-delay:530ms] max-w-max"
        }
        style={mobile ? mt(530).style : undefined}>
        <div className="flex gap-3">
          {[
            {
              label: "LinkedIn",
              href: "https://linkedin.com/in/dvegarabalsa",
            },
            { label: "GitHub", href: "https://github.com/dani-37" },
            { label: "CV", href: "/Daniel_Vegara_CV.pdf", newTab: true },
          ].map(
            ({
              label,
              href,
              newTab,
            }: {
              label: string;
              href: string;
              newTab?: boolean;
            }) => (
              <span key={label} className="btn-brutalist-wrap">
                <a
                  href={href}
                  target={
                    href.startsWith("http") || newTab ? "_blank" : undefined
                  }
                  rel="noopener noreferrer"
                  className="btn-brutalist flex items-center min-h-[44px] lg:min-h-0 font-grotesk text-caption text-green-deep border border-green-deep px-4 py-1.5 bg-card">
                  {label}
                </a>
              </span>
            ),
          )}
        </div>
        {mobile && (
          <button
            onClick={() => setSphereFocus(true)}
            className="mt-6 font-grotesk font-light text-[13px] text-gray-muted opacity-90 cursor-pointer bg-transparent border-0 p-0 text-left hover:text-green-deep hover:opacity-100 transition-all duration-200">
            about the sphere ›
          </button>
        )}
      </div>

    </div>
  );
}
