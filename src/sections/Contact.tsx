import InOutSphere from "../components/InOutSphere";

export default function Contact() {
  return (
    <div className="absolute inset-0 p-10 md:p-12 flex flex-col justify-center gap-5">
      <p className="font-mono text-[12px] tracking-[3px] uppercase text-[#aaa]">
        Contact
      </p>
      <div>
        <h2 className="font-display font-bold text-[clamp(34px,5vw,52px)] tracking-[-1.5px] leading-none text-ink">
          Let's work
          <br />
          together.
        </h2>
      </div>
      <div className="flex flex-col gap-1">
        <a
          href="mailto:dani+work@vegarabalsa.com"
          className="font-grotesk text-[13px] text-green-deep hover:underline w-min">
          dani@vegarabalsa.com
        </a>
        <a
          href="https://linkedin.com/in/dvegarabalsa"
          target="_blank"
          rel="noopener noreferrer"
          className="font-grotesk text-[13px] text-[#aaa] hover:text-green-deep transition-colors w-min">
          linkedin.com/in/dvegarabalsa
        </a>
      </div>
      <p className="font-mono text-[9px] text-[#ccc] tracking-[2px] uppercase">
        Open to · Freelance · Research · Sustainability
      </p>

      <a
        href="https://www.youtube.com/watch?v=PTXW-dJcUjM"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-[50px] pointer-events-none md:pointer-events-auto md:cursor-pointer">
        <InOutSphere size={320} className="opacity-30 md:opacity-90" />
      </a>
    </div>
  );
}
