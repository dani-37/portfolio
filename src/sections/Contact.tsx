import { useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import InOutSphere from "../components/InOutSphere";

const EMAIL = "dani@vegarabalsa.com";

function EmailButton({ onReveal }: { onReveal: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(() => {
    onReveal();
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // clipboard failed — email is revealed below so user can copy manually
    });
  }, [onReveal]);

  return (
    <span className="btn-brutalist-wrap">
      <button
        onClick={handleClick}
        className="btn-brutalist btn-brutalist-inverted flex items-center gap-1.5 min-h-[44px] lg:min-h-0 font-grotesk text-caption text-white border border-green-deep px-4 py-1.5 bg-green-deep cursor-pointer">
        {copied ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Copied
          </>
        ) : (
          "Email"
        )}
      </button>
    </span>
  );
}

export default function Contact({ mobile }: { mobile?: boolean }) {
  const tipRef = useRef<HTMLSpanElement>(null);
  const [emailVisible, setEmailVisible] = useState(false);
  const revealEmail = useCallback(() => setEmailVisible(true), []);

  const onMove = useCallback((e: React.MouseEvent) => {
    const tip = tipRef.current;
    if (!tip) return;
    tip.style.left = `${e.clientX + 12}px`;
    tip.style.top = `${e.clientY - 28}px`;
    tip.style.opacity = "1";
  }, []);

  const onLeave = useCallback(() => {
    const tip = tipRef.current;
    if (tip) tip.style.opacity = "0";
  }, []);

  return (
    <div
      className={
        mobile
          ? "px-8 md:px-14 py-12 flex flex-col justify-center gap-6 relative overflow-hidden"
          : "absolute inset-0 px-14 py-10 md:px-16 md:py-12 flex flex-col gap-5"
      }>
      {!mobile && <div className="h-24" />}
      <div>
        <h2 className="font-display font-bold text-[clamp(39px,5.75vw,60px)] pb-6 tracking-tight leading-none text-ink">
          Let's work
          <br />
          together<span className="text-green-deep">.</span>
        </h2>
      </div>
      <div className="flex gap-3">
        <EmailButton onReveal={revealEmail} />
        {[
          { label: "LinkedIn", href: "https://linkedin.com/in/dvegarabalsa" },
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
                className="btn-brutalist btn-brutalist-inverted flex items-center min-h-[44px] lg:min-h-0 font-grotesk text-caption text-white border border-green-deep px-4 py-1.5 bg-green-deep">
                {label}
              </a>
            </span>
          ),
        )}
      </div>
      <p className={`font-grotesk text-label tracking-wide text-gray-muted transition-opacity duration-300 ${emailVisible ? "opacity-100" : "opacity-0"}`}>
        {EMAIL}
      </p>

      {/* Desktop: links to sphere eversion video */}
      <a
        href="https://www.youtube.com/watch?v=PTXW-dJcUjM"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Watch sphere eversion animation on YouTube"
        className="hidden lg:block absolute top-1/2 -translate-y-1/2 right-[60px] cursor-pointer"
        onMouseMove={onMove}
        onMouseLeave={onLeave}>
        <InOutSphere size={414} />
      </a>

      {createPortal(
        <span
          ref={tipRef}
          className="tooltip-brutalist font-mono text-[10px] tracking-wide uppercase px-2 py-1 border border-green-deep text-green-deep bg-card">
          what's this?
        </span>,
        document.body,
      )}
    </div>
  );
}
