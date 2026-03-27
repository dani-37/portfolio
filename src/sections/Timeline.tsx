// src/sections/Timeline.tsx

export default function Timeline() {
  return (
    <div className="absolute inset-0 p-10 md:p-12 flex flex-col">
      {/* Section header */}
      <div className="flex items-baseline mb-4">
        <span className="font-mono text-[9px] tracking-[1px] text-[#bbb]">
          002 — TIMELINE
        </span>
        <span className="flex-1 h-px bg-[#ebe6dc] mx-4" />
        <span className="font-mono text-[9px] tracking-[1px] text-[#bbb]">
          2000 – NOW
        </span>
      </div>

      {/* SVG timeline — flex-1 fills available space */}
      <div className="flex-1 flex items-center">
        <svg
          viewBox="0 0 770 250"
          className="w-full"
          style={{ overflow: 'visible', fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {/* Spine */}
          {/* Madrid segment 1: 2000–2009 */}
          <line x1="35" y1="70" x2="75" y2="70" stroke="#d8d4cc" strokeWidth="1" />

          {/* DC detour: 3px dip */}
          <line x1="78" y1="70" x2="78" y2="73" stroke="#d8d4cc" strokeWidth="0.75" />
          <line x1="78" y1="73" x2="95" y2="73" stroke="#d8d4cc" strokeWidth="0.75" />
          <line x1="95" y1="73" x2="95" y2="70" stroke="#d8d4cc" strokeWidth="0.75" />
          <text x="86" y="82" fontSize="6.5" fill="#aaa" fontFamily="Lora, serif" fontWeight="700" textAnchor="middle">DC</text>
          <text x="86" y="89" fontSize="5.5" fill="#ccc" fontFamily="'Space Mono', monospace" textAnchor="middle">09–12</text>

          {/* Madrid segment 2: 2012–2018 */}
          <line x1="101" y1="70" x2="132" y2="70" stroke="#d8d4cc" strokeWidth="1" />

          {/* London: 2018 to mid-2022 */}
          <line x1="140" y1="70" x2="352" y2="70" stroke="#d8d4cc" strokeWidth="1" />

          {/* Gap year dotted: mid-2022 – Sept 2023 */}
          <line x1="356" y1="70" x2="412" y2="70" stroke="#d8d4cc" strokeWidth="1" strokeDasharray="3,4" />
          <text x="384" y="63" fontSize="7" fill="#ccc" fontFamily="Lora, serif" fontStyle="italic" textAnchor="middle">gap year</text>
          <text x="384" y="80" fontSize="5.5" fill="#ccc" fontFamily="'Space Mono', monospace" textAnchor="middle">22–23</text>

          {/* London resumed: Sept 2023 – Oct 2025 */}
          <line x1="416" y1="70" x2="649" y2="70" stroke="#d8d4cc" strokeWidth="1" />

          {/* Paris: Oct 2025 – now */}
          <line x1="655" y1="70" x2="755" y2="70" stroke="#d8d4cc" strokeWidth="1" />

          {/* --- LOCATIONS --- */}

          {/* Madrid */}
          <text x="35" y="50" fontSize="8" fill="#999" fontFamily="'Space Mono', monospace" textAnchor="middle">2000</text>
          <circle cx="35" cy="70" r="5" fill="#fdfcf9" stroke="#1a6b5a" strokeWidth="2" />
          <text x="35" y="92" fontSize="15" fill="#1a1a18" fontFamily="Lora, serif" fontWeight="700" textAnchor="middle">Madrid</text>
          <text x="35" y="101" fontSize="5" fill="#ccc" fontFamily="'Space Mono', monospace" textAnchor="middle">40.42°N · 3.70°W</text>

          {/* London */}
          <text x="140" y="50" fontSize="8" fill="#999" fontFamily="'Space Mono', monospace" textAnchor="middle">2018</text>
          <circle cx="140" cy="70" r="5" fill="#fdfcf9" stroke="#1a6b5a" strokeWidth="2" />
          <text x="140" y="92" fontSize="15" fill="#1a1a18" fontFamily="Lora, serif" fontWeight="700" textAnchor="middle">London</text>
          <text x="140" y="101" fontSize="5" fill="#ccc" fontFamily="'Space Mono', monospace" textAnchor="middle">51.51°N · 0.13°W</text>

          {/* Paris */}
          <text x="655" y="50" fontSize="8" fill="#999" fontFamily="'Space Mono', monospace" textAnchor="middle">2025</text>
          <circle cx="655" cy="70" r="5" fill="#fdfcf9" stroke="#1a6b5a" strokeWidth="2" />
          <text x="655" y="92" fontSize="15" fill="#1a1a18" fontFamily="Lora, serif" fontWeight="700" textAnchor="middle">Paris</text>
          <text x="655" y="101" fontSize="5" fill="#ccc" fontFamily="'Space Mono', monospace" textAnchor="middle">48.86°N · 2.35°E</text>

          {/* --- STUDIES (ink) --- */}

          {/* Imperial: 2018 to mid-2022 (x=140 to x=356) */}
          <text x="142" y="120" fontSize="10" fill="#1a1a18" fontFamily="'Space Grotesk', sans-serif" fontWeight="500">Imperial College</text>
          <rect x="140" y="124" width="216" height="2" fill="#1a1a18" />
          <text x="142" y="134" fontSize="7" fill="#aaa" fontFamily="'Space Mono', monospace">MSci Mathematics & Statistics</text>
          <text x="142" y="143" fontSize="6.5" fill="#bbb" fontFamily="'Space Mono', monospace">2018–22</text>

          {/* UCL: Oct 2024 – Oct 2025 (x=540 to x=655) */}
          <text x="542" y="120" fontSize="10" fill="#1a1a18" fontFamily="'Space Grotesk', sans-serif" fontWeight="500">UCL</text>
          <rect x="540" y="124" width="115" height="2" fill="#1a1a18" />
          <text x="542" y="134" fontSize="7" fill="#aaa" fontFamily="'Space Mono', monospace">MSc AI for Sustainability</text>
          <text x="542" y="143" fontSize="6.5" fill="#bbb" fontFamily="'Space Mono', monospace">2024–25</text>

          {/* --- EXPERIENCE (green) --- */}

          {/* Graphext: Jun–Sept 2020 (x=256 to x=272) */}
          <text x="256" y="160" fontSize="10" fill="#1a1a18" fontFamily="'Space Grotesk', sans-serif" fontWeight="500">Graphext</text>
          <rect x="256" y="164" width="16" height="2" fill="#1a6b5a" />
          <text x="256" y="174" fontSize="7" fill="#aaa" fontFamily="'Space Mono', monospace">Data viz intern</text>
          <text x="256" y="183" fontSize="6.5" fill="#bbb" fontFamily="'Space Mono', monospace">2020</text>

          {/* Klere: Sept 2023 – Dec 2025 (x=416 to x=666) */}
          <text x="418" y="160" fontSize="10" fill="#1a1a18" fontFamily="'Space Grotesk', sans-serif" fontWeight="500">Klere</text>
          <rect x="416" y="164" width="250" height="2" fill="#1a6b5a" />
          <text x="418" y="174" fontSize="7" fill="#aaa" fontFamily="'Space Mono', monospace">Biodiversity footprints</text>
          <text x="418" y="183" fontSize="6.5" fill="#bbb" fontFamily="'Space Mono', monospace">2023–25</text>

          {/* Toolip: Sept 2020 – May 2022 (x=272 to x=348) */}
          <text x="274" y="200" fontSize="10" fill="#1a1a18" fontFamily="'Space Grotesk', sans-serif" fontWeight="500">Toolip</text>
          <rect x="272" y="204" width="76" height="2" fill="#1a6b5a" />
          <text x="274" y="214" fontSize="7" fill="#aaa" fontFamily="'Space Mono', monospace">Non-profit tech</text>
          <text x="274" y="223" fontSize="6.5" fill="#bbb" fontFamily="'Space Mono', monospace">2020–22</text>

          {/* OECD: Apr 2025 – now (x=589 to x=755) */}
          <text x="591" y="200" fontSize="10" fill="#1a1a18" fontFamily="'Space Grotesk', sans-serif" fontWeight="500">OECD</text>
          <rect x="589" y="204" width="166" height="2" fill="#1a6b5a" />
          <text x="591" y="214" fontSize="7" fill="#aaa" fontFamily="'Space Mono', monospace">Regional data analysis</text>
          <text x="591" y="223" fontSize="6.5" fill="#bbb" fontFamily="'Space Mono', monospace">2025–Now</text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex gap-5 pt-3 border-t border-[#ebe6dc]">
        <div className="flex items-center gap-[5px]">
          <div className="w-3 h-[2px] bg-ink" />
          <span className="font-mono text-[7.5px] text-[#aaa]">studies</span>
        </div>
        <div className="flex items-center gap-[5px]">
          <div className="w-3 h-[2px] bg-green-deep" />
          <span className="font-mono text-[7.5px] text-[#aaa]">experience</span>
        </div>
      </div>
    </div>
  )
}
