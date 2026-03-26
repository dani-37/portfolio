export default function Contact() {
  return (
    <div className="absolute inset-0 p-12 md:p-14 flex flex-col justify-center gap-6">
      <p className="font-mono text-[8px] tracking-[3px] uppercase text-[#aaa]">Contact</p>
      <div>
        <h2 className="font-syne font-bold text-[clamp(28px,5vw,40px)] tracking-[-1.5px] leading-none text-ink">
          Let's work<br />together.
        </h2>
      </div>
      <div className="flex flex-col gap-1">
        <a
          href="mailto:dani+work@vegarabalsa.com"
          className="font-grotesk text-[11px] text-green-deep hover:underline"
        >
          dani@vegarabalsa.com
        </a>
        <a
          href="https://linkedin.com/in/dvegarabalsa"
          target="_blank"
          rel="noopener noreferrer"
          className="font-grotesk text-[11px] text-[#aaa] hover:text-green-deep transition-colors"
        >
          linkedin.com/in/dvegarabalsa
        </a>
      </div>
      <p className="font-mono text-[7px] text-[#ccc] tracking-[2px] uppercase">
        Open to · Freelance · Research · Sustainability
      </p>
    </div>
  )
}
