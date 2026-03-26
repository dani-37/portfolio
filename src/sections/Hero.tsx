export default function Hero() {
  return (
    <div className="absolute inset-0 p-10 md:p-12 flex flex-col justify-between">
      {/* Name wordmark */}
      <div>
        <span className="block font-grotesk font-light text-[22px] tracking-[6px] uppercase text-[#888] mb-1">
          daniel
        </span>
        <span className="block font-display font-bold text-[clamp(40px,8vw,66px)] leading-none tracking-[-1.5px] text-ink">
          Vegara<span className="text-green-deep">.</span>
        </span>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-[9px]">
        {[
          { color: '#1a1a18', label: 'Data Science & Mathematical Modelling' },
          { color: '#1a6b5a', label: 'Sustainability & Environmental Analysis' },
          { color: '#6aab90', label: 'Software Development' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-[7px] h-[7px] rounded-[1px] shrink-0" style={{ background: color }} />
            <span className="font-grotesk font-light text-[13px] text-[#666]">{label}</span>
          </div>
        ))}
      </div>

      {/* Footer: coordinates + links */}
      <div>
        <p className="font-mono text-[9px] text-[#aaa] tracking-[2px] mb-4">
          51.5074° N &nbsp;·&nbsp; 0.1278° W &nbsp;·&nbsp; London &nbsp;·&nbsp; MSc AI · UCL
        </p>
        <div className="flex gap-3">
          {[
            { label: 'LinkedIn ↗', href: 'https://linkedin.com/in/dvegarabalsa' },
            { label: 'CV ↗', href: '/Daniel_Vegara_CV.pdf' },
            { label: 'Email', href: 'mailto:dani+work@vegarabalsa.com' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="font-grotesk text-[11px] text-[#888] border border-[#d8d4cc] px-4 py-[6px] hover:border-green-deep hover:text-green-deep transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
