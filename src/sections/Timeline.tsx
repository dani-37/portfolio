import { useState, useEffect } from "react";

interface TimelineProps {
  onSelect?: (name: string) => void;
  mobile?: boolean;
  introReady?: boolean;
}

/* ── Mobile: vertical timeline built with Tailwind ─────────────────── */

function MobileTimeline({ onSelect, introReady = true }: { onSelect?: (name: string) => void; introReady?: boolean }) {
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(introReady);

  useEffect(() => {
    if (introReady && !visible && !animating) {
      // Start animation 400ms after hero finishes
      const delay = setTimeout(() => {
        setAnimating(true);
        setTimeout(() => { setAnimating(false); setVisible(true); }, 900);
      }, 400);
      return () => clearTimeout(delay);
    }
  }, [introReady, visible, animating]);

  const cls = (_delay: number) =>
    animating ? "animate-hero-in" : visible ? "" : "opacity-0";
  const sty = (_delay: number): React.CSSProperties | undefined =>
    animating ? { animationDelay: `${_delay}ms` } : undefined;

  return (
    <div className="p-8 md:p-14 pb-10 md:pb-10">
      <div className={`mb-6 ${cls(0)}`} style={sty(0)}>
        <h2 className="font-mono text-caption tracking-wide uppercase text-green-deep">
          Timeline
        </h2>
      </div>

      <div className={`relative ${cls(100)}`} style={sty(100)}>
        {/* Vertical spine */}
        <div
          className="absolute left-0 top-[6px] bottom-[6px] w-px bg-gray-warm"
          aria-hidden="true"
        />

        {/* ── Madrid ── */}
        <TimelineLocation year="2000" city="Madrid" />

        {/* DC detour */}
        <div className="relative pl-7 py-2">
          <div
            className="absolute left-[-2.5px] top-[10px] w-[6px] h-[6px] rounded-full border border-gray-warm bg-card"
            aria-hidden="true"
          />
          <p className="font-display font-bold text-[14px] text-gray-muted leading-none">
            DC
          </p>
          <p className="font-mono text-[13px] text-gray-muted mt-0.5">
            09–12
          </p>
          <p className="font-display italic text-[14px] text-gray-muted mt-1 leading-snug">
            I sound American. This is why.
          </p>
        </div>

        {/* ── London ── */}
        <TimelineLocation year="2018" city="London" className="mt-3" />

        {/* Imperial College */}
        <TimelineEntry
          type="study"
          name="Imperial College"
          detail="MSci Mathematics & Statistics"
          years="2018–22"
        />

        {/* Graphext */}
        <TimelineEntry
          type="experience"
          name="Graphext"
          detail="Data viz intern"
          years="2020"
          onSelect={() => onSelect?.("Graphext")}
        />

        {/* Toolip */}
        <TimelineEntry
          type="experience"
          name="Toolip"
          detail="Non-profit tech"
          years="2020–22"
          onSelect={() => onSelect?.("Toolip")}
        />

        {/* Gap year */}
        <div className="relative pl-7 py-3">
          <div
            className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full border border-dashed border-gray-warm"
            aria-hidden="true"
          />
          <p className="font-display italic text-[14px] text-gray-muted leading-none">
            gap year
          </p>
          <p className="font-mono text-[13px] text-gray-muted mt-0.5">
            22–23
          </p>
        </div>

        {/* Klere */}
        <TimelineEntry
          type="experience"
          name="Klere"
          detail="Biodiversity footprints"
          years="2023–25"
          onSelect={() => onSelect?.("Klere")}
        />

        {/* UCL */}
        <TimelineEntry
          type="study"
          name="UCL"
          detail="MSc AI for Sustainability"
          years="2024–25"
        />

        {/* ── Paris ── */}
        <TimelineLocation year="2025" city="Paris" className="mt-3" />

        {/* OECD */}
        <TimelineEntry
          type="experience"
          name="OECD"
          detail="Regional data analysis"
          years="2025–Now"
          onSelect={() => onSelect?.("OECD")}
        />
      </div>

    </div>
  );
}

function TimelineLocation({
  year,
  city,
  className = "",
}: {
  year: string;
  city: string;
  className?: string;
}) {
  return (
    <div className={`relative pl-7 ${className}`}>
      <div
        className="absolute left-[-4px] top-[4px] w-[9px] h-[9px] rounded-full border-2 border-green-deep bg-card"
        aria-hidden="true"
      />
      <p className="font-mono text-[13px] text-gray-mid leading-none">
        {year}
      </p>
      <p className="font-display font-bold text-[20px] text-ink leading-tight tracking-tight mt-0.5">
        {city}
      </p>
    </div>
  );
}

function TimelineEntry({
  type,
  name,
  detail,
  years,
  onSelect,
}: {
  type: "study" | "experience";
  name: string;
  detail: string;
  years: string;
  onSelect?: () => void;
}) {
  const isExperience = type === "experience";
  const barColor = isExperience ? "bg-green-deep" : "bg-ink";

  const content = (
    <div className="relative pl-7 py-3">
      {/* Tick mark on spine */}
      <div
        className={`absolute left-[-1px] top-[16px] w-[3px] h-px ${barColor}`}
        aria-hidden="true"
      />
      <p className="font-grotesk font-medium text-[14px] text-ink leading-none">
        {name}
      </p>
      <div
        className={`w-8 h-[2px] ${barColor} mt-1`}
        aria-hidden="true"
      />
      <p className="font-grotesk font-light text-[14px] text-gray-muted mt-1 leading-none">
        {detail}
      </p>
      <p className="font-mono text-[13px] text-gray-soft mt-0.5 leading-none">
        {years}
      </p>
    </div>
  );

  if (!onSelect) return content;

  return (
    <button
      onClick={onSelect}
      className="focusable-row w-full text-left bg-transparent border-0 cursor-pointer group"
      aria-label={`View ${name} experience details`}>
      <div className="relative pl-7 py-3 flex items-center w-max">
        <div
          className={`absolute left-[-1px] top-[16px] w-[3px] h-px ${barColor}`}
          aria-hidden="true"
        />
        <div>
          <p className="font-grotesk font-medium text-[14px] text-ink group-hover:text-green-deep leading-none">
            {name}
          </p>
          <div
            className={`w-8 h-[2px] ${barColor} mt-1`}
            aria-hidden="true"
          />
          <p className="font-grotesk font-light text-[14px] text-gray-muted group-hover:text-green-mid mt-1 leading-none">
            {detail}
          </p>
          <p className="font-mono text-[13px] text-gray-soft mt-0.5 leading-none">
            {years}
          </p>
        </div>
        <svg
          width="7"
          height="12"
          viewBox="0 0 7 12"
          fill="none"
          stroke="var(--color-gray-muted)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 ml-3 opacity-50"
          aria-hidden="true">
          <path d="M1 1l5 5-5 5" />
        </svg>
      </div>
    </button>
  );
}

/* ── Desktop: horizontal SVG timeline ──────────────────────────────── */

export default function Timeline({ onSelect, mobile, introReady }: TimelineProps) {

  if (mobile) return <MobileTimeline onSelect={onSelect} introReady={introReady} />;

  return (
    <div className="absolute inset-0 px-14 py-10 md:px-16 md:py-12 flex flex-col">
      <h2 className="font-mono text-caption tracking-wide uppercase text-green-deep mb-4">
        Timeline
      </h2>

      {/* SVG timeline — flex-1 fills available space */}
      <div className="flex-1 flex items-center overflow-x-auto">
        <svg
          viewBox="0 0 790 270"
          className="w-full min-w-[700px]"
          style={{
            overflow: "visible",
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
          {/* Spine at y=30 */}

          {/* Madrid segment 1: 2000–2009 */}
          <line
            x1="35"
            y1="30"
            x2="99"
            y2="30"
            stroke="var(--color-gray-warm)"
            strokeWidth="1"
          />

          {/* DC detour: 3px dip */}
          <line
            x1="99"
            y1="30"
            x2="99"
            y2="33"
            stroke="var(--color-gray-warm)"
            strokeWidth="0.75"
          />
          <line
            x1="99"
            y1="33"
            x2="116"
            y2="33"
            stroke="var(--color-gray-warm)"
            strokeWidth="0.75"
          />
          <line
            x1="116"
            y1="33"
            x2="116"
            y2="30"
            stroke="var(--color-gray-warm)"
            strokeWidth="0.75"
          />
          <text
            x="107"
            y="45"
            fontSize="10"
            fill="var(--color-gray-muted)"
            fontFamily="Lora, serif"
            fontWeight="700"
            textAnchor="middle">
            DC
          </text>
          <text
            x="107"
            y="55"
            fontSize="9"
            fill="var(--color-gray-muted)"
            fontFamily="'Space Mono', monospace"
            textAnchor="middle">
            09–12
          </text>
          <line
            x1="107"
            y1="57"
            x2="107"
            y2="72"
            stroke="var(--color-gray-warm)"
            strokeWidth="0.75"
            strokeDasharray="3,4"
          />
          <text
            x="107"
            y="82"
            fontSize="10"
            fill="var(--color-gray-muted)"
            fontFamily="Lora, serif"
            fontStyle="italic"
            textAnchor="middle">
            I sound American.
          </text>
          <text
            x="107"
            y="94"
            fontSize="10"
            fill="var(--color-gray-muted)"
            fontFamily="Lora, serif"
            fontStyle="italic"
            textAnchor="middle">
            This is why.
          </text>

          {/* Madrid segment 2: 2012–2018 */}
          <line
            x1="116"
            y1="30"
            x2="172"
            y2="30"
            stroke="var(--color-gray-warm)"
            strokeWidth="1"
          />

          {/* London: 2018 to mid-2022 */}
          <line
            x1="180"
            y1="30"
            x2="382"
            y2="30"
            stroke="var(--color-gray-warm)"
            strokeWidth="1"
          />

          {/* Gap year dotted: mid-2022 – Sept 2023 */}
          <line
            x1="386"
            y1="30"
            x2="442"
            y2="30"
            stroke="var(--color-gray-warm)"
            strokeWidth="1"
            strokeDasharray="3,4"
          />
          <text
            x="414"
            y="22"
            fontSize="11"
            fill="var(--color-gray-muted)"
            fontFamily="Lora, serif"
            fontStyle="italic"
            textAnchor="middle">
            gap year
          </text>
          <text
            x="414"
            y="42"
            fontSize="9"
            fill="var(--color-gray-muted)"
            fontFamily="'Space Mono', monospace"
            textAnchor="middle">
            22–23
          </text>

          {/* London resumed: Sept 2023 – Oct 2025 */}
          <line
            x1="446"
            y1="30"
            x2="669"
            y2="30"
            stroke="var(--color-gray-warm)"
            strokeWidth="1"
          />

          {/* Paris: Oct 2025 – now */}
          <line
            x1="675"
            y1="30"
            x2="775"
            y2="30"
            stroke="var(--color-gray-warm)"
            strokeWidth="1"
          />

          {/* --- LOCATIONS --- */}

          {/* Madrid */}
          <text
            x="35"
            y="12"
            fontSize="11.5"
            fill="var(--color-gray-mid)"
            fontFamily="'Space Mono', monospace"
            textAnchor="middle">
            2000
          </text>
          <circle
            cx="35"
            cy="30"
            r="5"
            fill="var(--color-card)"
            stroke="var(--color-green-deep)"
            strokeWidth="2"
          />
          <text
            x="35"
            y="56"
            fontSize="19"
            fill="var(--color-ink)"
            fontFamily="Lora, serif"
            fontWeight="700"
            textAnchor="middle">
            Madrid
          </text>

          {/* London */}
          <text
            x="180"
            y="12"
            fontSize="11.5"
            fill="var(--color-gray-mid)"
            fontFamily="'Space Mono', monospace"
            textAnchor="middle">
            2018
          </text>
          <circle
            cx="180"
            cy="30"
            r="5"
            fill="var(--color-card)"
            stroke="var(--color-green-deep)"
            strokeWidth="2"
          />
          <text
            x="180"
            y="56"
            fontSize="19"
            fill="var(--color-ink)"
            fontFamily="Lora, serif"
            fontWeight="700"
            textAnchor="middle">
            London
          </text>

          {/* Paris */}
          <text
            x="675"
            y="12"
            fontSize="11.5"
            fill="var(--color-gray-mid)"
            fontFamily="'Space Mono', monospace"
            textAnchor="middle">
            2025
          </text>
          <circle
            cx="675"
            cy="30"
            r="5"
            fill="var(--color-card)"
            stroke="var(--color-green-deep)"
            strokeWidth="2"
          />
          <text
            x="675"
            y="56"
            fontSize="19"
            fill="var(--color-ink)"
            fontFamily="Lora, serif"
            fontWeight="700"
            textAnchor="middle">
            Paris
          </text>

          {/* --- STUDIES (ink) --- */}

          {/* Imperial: 2018 to mid-2022 (x=180 to x=386) */}
          <text
            x="182"
            y="110"
            fontSize="13"
            fill="var(--color-ink)"
            fontFamily="'Space Grotesk', sans-serif"
            fontWeight="500">
            Imperial College
          </text>
          <rect
            x="180"
            y="115"
            width="206"
            height="2"
            fill="var(--color-ink)"
          />
          <text
            x="182"
            y="129"
            fontSize="11"
            fill="var(--color-gray-muted)"
            fontFamily="'Space Grotesk', sans-serif"
            fontWeight="300">
            MSci Mathematics & Statistics
          </text>
          <text
            x="182"
            y="142"
            fontSize="10"
            fill="var(--color-gray-soft)"
            fontFamily="'Space Mono', monospace">
            2018–22
          </text>

          {/* UCL: Oct 2024 – Oct 2025 (x=560 to x=675) */}
          <text
            x="562"
            y="110"
            fontSize="13"
            fill="var(--color-ink)"
            fontFamily="'Space Grotesk', sans-serif"
            fontWeight="500">
            UCL
          </text>
          <rect
            x="560"
            y="115"
            width="115"
            height="2"
            fill="var(--color-ink)"
          />
          <text
            x="562"
            y="129"
            fontSize="11"
            fill="var(--color-gray-muted)"
            fontFamily="'Space Grotesk', sans-serif"
            fontWeight="300">
            MSc AI for Sustainability
          </text>
          <text
            x="562"
            y="142"
            fontSize="10"
            fill="var(--color-gray-soft)"
            fontFamily="'Space Mono', monospace">
            2024–25
          </text>

          {/* --- EXPERIENCE (green, clickable) --- */}

          {/* Graphext: Jun–Sept 2020 (x=276 to x=292) */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelect?.("Graphext");
            }}
            aria-label="View Graphext experience details"
            className="cursor-pointer timeline-svg-entry group">
            <rect x="290" y="152" width="100" height="48" fill="transparent" className="timeline-svg-hit" />
            <text
              x="296"
              y="165"
              fontSize="13"
              fill="var(--color-ink)"
              fontFamily="'Space Grotesk', sans-serif"
              fontWeight="500">
              Graphext
            </text>
            <path d="M362 158l3 3-3 3" fill="none" stroke="var(--color-green-deep)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="timeline-chevron" />
            <rect
              x="296"
              y="170"
              width="16"
              height="2"
              fill="var(--color-green-deep)"
            />
            <text
              x="296"
              y="184"
              fontSize="11"
              fill="var(--color-gray-muted)"
              fontFamily="'Space Grotesk', sans-serif"
              fontWeight="300">
              Data viz intern
            </text>
            <text
              x="296"
              y="197"
              fontSize="10"
              fill="var(--color-gray-soft)"
              fontFamily="'Space Mono', monospace">
              2020
            </text>
          </a>

          {/* Klere: Sept 2023 – Dec 2025 (x=426 to x=666) */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelect?.("Klere");
            }}
            aria-label="View Klere experience details"
            className="cursor-pointer timeline-svg-entry group">
            <rect x="440" y="152" width="250" height="48" fill="transparent" className="timeline-svg-hit" />
            <text
              x="448"
              y="165"
              fontSize="13"
              fill="var(--color-ink)"
              fontFamily="'Space Grotesk', sans-serif"
              fontWeight="500">
              Klere
            </text>
            <path d="M489 158l3 3-3 3" fill="none" stroke="var(--color-green-deep)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="timeline-chevron" />
            <rect
              x="446"
              y="170"
              width="240"
              height="2"
              fill="var(--color-green-deep)"
            />
            <text
              x="448"
              y="184"
              fontSize="11"
              fill="var(--color-gray-muted)"
              fontFamily="'Space Grotesk', sans-serif"
              fontWeight="300">
              Biodiversity footprints
            </text>
            <text
              x="448"
              y="197"
              fontSize="10"
              fill="var(--color-gray-soft)"
              fontFamily="'Space Mono', monospace">
              2023–25
            </text>
          </a>

          {/* Toolip: Sept 2020 – May 2022 (x=292 to x=358) */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelect?.("Toolip");
            }}
            aria-label="View Toolip experience details"
            className="cursor-pointer timeline-svg-entry group">
            <rect x="306" y="207" width="100" height="48" fill="transparent" className="timeline-svg-hit" />
            <text
              x="314"
              y="220"
              fontSize="13"
              fill="var(--color-ink)"
              fontFamily="'Space Grotesk', sans-serif"
              fontWeight="500">
              Toolip
            </text>
            <path d="M358 213l3 3-3 3" fill="none" stroke="var(--color-green-deep)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="timeline-chevron" />
            <rect
              x="312"
              y="225"
              width="66"
              height="2"
              fill="var(--color-green-deep)"
            />
            <text
              x="314"
              y="239"
              fontSize="11"
              fill="var(--color-gray-muted)"
              fontFamily="'Space Grotesk', sans-serif"
              fontWeight="300">
              Non-profit tech
            </text>
            <text
              x="314"
              y="252"
              fontSize="10"
              fill="var(--color-gray-soft)"
              fontFamily="'Space Mono', monospace">
              2020–22
            </text>
          </a>

          {/* OECD: Apr 2025 – now (x=589 to x=755) */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelect?.("OECD");
            }}
            aria-label="View OECD experience details"
            className="cursor-pointer timeline-svg-entry group">
            <rect x="603" y="207" width="175" height="48" fill="transparent" className="timeline-svg-hit" />
            <text
              x="611"
              y="220"
              fontSize="13"
              fill="var(--color-ink)"
              fontFamily="'Space Grotesk', sans-serif"
              fontWeight="500">
              OECD
            </text>
            <path d="M655 213l3 3-3 3" fill="none" stroke="var(--color-green-deep)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="timeline-chevron" />
            <rect
              x="609"
              y="225"
              width="166"
              height="2"
              fill="var(--color-green-deep)"
            />
            <text
              x="611"
              y="239"
              fontSize="11"
              fill="var(--color-gray-muted)"
              fontFamily="'Space Grotesk', sans-serif"
              fontWeight="300">
              Regional data analysis
            </text>
            <text
              x="611"
              y="252"
              fontSize="10"
              fill="var(--color-gray-soft)"
              fontFamily="'Space Mono', monospace">
              2025–Now
            </text>
          </a>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex gap-5 pt-3 border-t border-gray-warm-light">
        <div className="flex items-center gap-[5px]">
          <div className="w-3 h-[2px] bg-ink" />
          <span className="font-mono text-label text-gray-muted">
            studies
          </span>
        </div>
        <div className="flex items-center gap-[5px]">
          <div className="w-3 h-[2px] bg-green-deep" />
          <span className="font-mono text-label text-gray-muted">
            experience
          </span>
        </div>
      </div>

    </div>
  );
}
