import MorphingSphere from "../components/MorphingSphere";
import SphereInfo from "../components/SphereInfo";

export default function Hero({ mobile }: { mobile?: boolean }) {
  return (
    <div
      className={
        mobile
          ? "px-8 py-14 min-h-[55vh] flex flex-col justify-center relative overflow-hidden"
          : "absolute inset-0 p-10 md:p-12 flex flex-col justify-center"
      }>
      {/* Name wordmark */}
      <h1 className={mobile ? "" : "animate-hero-in"}>
        <span className="block font-grotesk font-light text-[clamp(22px,3.5vw,24px)] leading-none tracking-display uppercase text-gray">
          daniel
        </span>
        <span className="block font-display font-bold text-[clamp(64px,10vw,66px)] leading-[1.05] tracking-tight text-ink">
          Vegara<span className="text-green-deep">.</span>
        </span>
      </h1>

      {/* Role line */}
      <p
        className={`font-mono text-label tracking-wide uppercase text-gray-muted mt-3 ${mobile ? "" : "animate-hero-in [animation-delay:100ms]"}`}>
        Data Scientist · OECD, Paris
      </p>

      {/* Tagline */}
      <p
        className={`font-grotesk font-light text-body text-gray max-w-[360px] mt-6 ${mobile ? "" : "animate-hero-in [animation-delay:200ms]"}`}>
        I build tools that make environmental data useful for policy.
      </p>

      {/* Education line */}
      <p
        className={`font-mono text-label tracking-wide uppercase text-gray-faint mt-2 ${mobile ? "" : "animate-hero-in [animation-delay:300ms]"}`}>
        Imperial College · UCL
      </p>

      {/* Morphing sphere + info */}
      {mobile ? (
        <MorphingSphere
          size={360}
          className="opacity-20 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none"
        />
      ) : (
        <div className="animate-sphere-in [animation-delay:400ms] absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-[60px] flex flex-col items-center -gap-2">
          <MorphingSphere size={360} />
          <div className="-mt-4">
            <SphereInfo />
          </div>
        </div>
      )}

      {/* Footer links */}
      <div className={`mt-6 ${mobile ? "" : "animate-hero-in [animation-delay:400ms]"}`}>
        <div className="flex gap-3">
          {[
            {
              label: "LinkedIn",
              href: "https://linkedin.com/in/dvegarabalsa",
            },
            { label: "CV", href: "/Daniel_Vegara_CV.pdf", newTab: true },
            { label: "GitHub", href: "https://github.com/dani-37" },
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
              <a
                key={label}
                href={href}
                target={
                  href.startsWith("http") || newTab ? "_blank" : undefined
                }
                rel="noopener noreferrer"
                className="font-grotesk text-caption text-gray border border-gray-faint px-4 py-1.5 hover:border-green-deep hover:text-green-deep transition-colors">
                {label}
              </a>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
