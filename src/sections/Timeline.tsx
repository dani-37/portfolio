// src/sections/Timeline.tsx

export default function Timeline() {
  return (
    <div className="absolute inset-0 p-10 md:p-12 flex flex-col">
      <p className="font-mono text-[12px] tracking-[3px] uppercase text-green-deep mb-4">
        Timeline
      </p>

      {/* SVG timeline — flex-1 fills available space */}
      <div className="flex-1 flex items-center">
        <svg
          viewBox="0 0 770 270"
          className="w-full"
          style={{ overflow: 'visible', fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {/* Spine at y=30 */}

          {/* Madrid segment 1: 2000–2009 */}
          <line x1="35" y1="30" x2="86" y2="30" stroke="#d8d4cc" strokeWidth="1" />

          {/* DC detour: 3px dip */}
          <line x1="89" y1="30" x2="89" y2="33" stroke="#d8d4cc" strokeWidth="0.75" />
          <line x1="89" y1="33" x2="106" y2="33" stroke="#d8d4cc" strokeWidth="0.75" />
          <line x1="106" y1="33" x2="106" y2="30" stroke="#d8d4cc" strokeWidth="0.75" />
          <text x="97" y="44" fontSize="8" fill="#aaa" fontFamily="Lora, serif" fontWeight="700" textAnchor="middle">DC</text>
          <text x="97" y="53" fontSize="7" fill="#aaa" fontFamily="'Space Mono', monospace" textAnchor="middle">09–12</text>

          {/* Madrid segment 2: 2012–2018 */}
          <line x1="112" y1="30" x2="152" y2="30" stroke="#d8d4cc" strokeWidth="1" />

          {/* London: 2018 to mid-2022 */}
          <line x1="160" y1="30" x2="362" y2="30" stroke="#d8d4cc" strokeWidth="1" />

          {/* Gap year dotted: mid-2022 – Sept 2023 */}
          <line x1="366" y1="30" x2="422" y2="30" stroke="#d8d4cc" strokeWidth="1" strokeDasharray="3,4" />
          <text x="394" y="23" fontSize="9" fill="#aaa" fontFamily="Lora, serif" fontStyle="italic" textAnchor="middle">gap year</text>
          <text x="394" y="41" fontSize="7" fill="#aaa" fontFamily="'Space Mono', monospace" textAnchor="middle">22–23</text>

          {/* London resumed: Sept 2023 – Oct 2025 */}
          <line x1="426" y1="30" x2="649" y2="30" stroke="#d8d4cc" strokeWidth="1" />

          {/* Paris: Oct 2025 – now */}
          <line x1="655" y1="30" x2="755" y2="30" stroke="#d8d4cc" strokeWidth="1" />

          {/* --- LOCATIONS --- */}

          {/* Madrid */}
          <text x="35" y="12" fontSize="10" fill="#999" fontFamily="'Space Mono', monospace" textAnchor="middle">2000</text>
          <circle cx="35" cy="30" r="5" fill="#fdfcf9" stroke="#1a6b5a" strokeWidth="2" />
          <text x="35" y="52" fontSize="19" fill="#1a1a18" fontFamily="Lora, serif" fontWeight="700" textAnchor="middle">Madrid</text>
          <text x="35" y="63" fontSize="7" fill="#ccc" fontFamily="'Space Mono', monospace" textAnchor="middle">40.42°N · 3.70°W</text>

          {/* London */}
          <text x="160" y="12" fontSize="10" fill="#999" fontFamily="'Space Mono', monospace" textAnchor="middle">2018</text>
          <circle cx="160" cy="30" r="5" fill="#fdfcf9" stroke="#1a6b5a" strokeWidth="2" />
          <text x="160" y="52" fontSize="19" fill="#1a1a18" fontFamily="Lora, serif" fontWeight="700" textAnchor="middle">London</text>
          <text x="160" y="63" fontSize="7" fill="#ccc" fontFamily="'Space Mono', monospace" textAnchor="middle">51.51°N · 0.13°W</text>

          {/* Paris */}
          <text x="655" y="12" fontSize="10" fill="#999" fontFamily="'Space Mono', monospace" textAnchor="middle">2025</text>
          <circle cx="655" cy="30" r="5" fill="#fdfcf9" stroke="#1a6b5a" strokeWidth="2" />
          <text x="655" y="52" fontSize="19" fill="#1a1a18" fontFamily="Lora, serif" fontWeight="700" textAnchor="middle">Paris</text>
          <text x="655" y="63" fontSize="7" fill="#ccc" fontFamily="'Space Mono', monospace" textAnchor="middle">48.86°N · 2.35°E</text>

          {/* --- STUDIES (ink) --- */}

          {/* Imperial: 2018 to mid-2022 (x=160 to x=366) */}
          <text x="162" y="110" fontSize="13" fill="#1a1a18" fontFamily="'Space Grotesk', sans-serif" fontWeight="500">Imperial College</text>
          <rect x="160" y="115" width="206" height="2" fill="#1a1a18" />
          <text x="162" y="128" fontSize="9" fill="#aaa" fontFamily="'Space Grotesk', sans-serif" fontWeight="300">MSci Mathematics & Statistics</text>
          <text x="162" y="140" fontSize="8.5" fill="#bbb" fontFamily="'Space Mono', monospace">2018–22</text>

          {/* UCL: Oct 2024 – Oct 2025 (x=540 to x=655) */}
          <text x="542" y="110" fontSize="13" fill="#1a1a18" fontFamily="'Space Grotesk', sans-serif" fontWeight="500">UCL</text>
          <rect x="540" y="115" width="115" height="2" fill="#1a1a18" />
          <text x="542" y="128" fontSize="9" fill="#aaa" fontFamily="'Space Grotesk', sans-serif" fontWeight="300">MSc AI for Sustainability</text>
          <text x="542" y="140" fontSize="8.5" fill="#bbb" fontFamily="'Space Mono', monospace">2024–25</text>

          {/* --- EXPERIENCE (green) --- */}

          {/* Graphext: Jun–Sept 2020 (x=276 to x=292) */}
          <text x="276" y="165" fontSize="13" fill="#1a1a18" fontFamily="'Space Grotesk', sans-serif" fontWeight="500">Graphext</text>
          <rect x="276" y="170" width="16" height="2" fill="#1a6b5a" />
          <text x="276" y="183" fontSize="9" fill="#aaa" fontFamily="'Space Grotesk', sans-serif" fontWeight="300">Data viz intern</text>
          <text x="276" y="195" fontSize="8.5" fill="#bbb" fontFamily="'Space Mono', monospace">2020</text>

          {/* Klere: Sept 2023 – Dec 2025 (x=426 to x=666) */}
          <text x="428" y="165" fontSize="13" fill="#1a1a18" fontFamily="'Space Grotesk', sans-serif" fontWeight="500">Klere</text>
          <rect x="426" y="170" width="240" height="2" fill="#1a6b5a" />
          <text x="428" y="183" fontSize="9" fill="#aaa" fontFamily="'Space Grotesk', sans-serif" fontWeight="300">Biodiversity footprints</text>
          <text x="428" y="195" fontSize="8.5" fill="#bbb" fontFamily="'Space Mono', monospace">2023–25</text>

          {/* Toolip: Sept 2020 – May 2022 (x=292 to x=358) */}
          <text x="294" y="220" fontSize="13" fill="#1a1a18" fontFamily="'Space Grotesk', sans-serif" fontWeight="500">Toolip</text>
          <rect x="292" y="225" width="66" height="2" fill="#1a6b5a" />
          <text x="294" y="238" fontSize="9" fill="#aaa" fontFamily="'Space Grotesk', sans-serif" fontWeight="300">Non-profit tech</text>
          <text x="294" y="250" fontSize="8.5" fill="#bbb" fontFamily="'Space Mono', monospace">2020–22</text>

          {/* OECD: Apr 2025 – now (x=589 to x=755) */}
          <text x="591" y="220" fontSize="13" fill="#1a1a18" fontFamily="'Space Grotesk', sans-serif" fontWeight="500">OECD</text>
          <rect x="589" y="225" width="166" height="2" fill="#1a6b5a" />
          <text x="591" y="238" fontSize="9" fill="#aaa" fontFamily="'Space Grotesk', sans-serif" fontWeight="300">Regional data analysis</text>
          <text x="591" y="250" fontSize="8.5" fill="#bbb" fontFamily="'Space Mono', monospace">2025–Now</text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex gap-5 pt-3 border-t border-[#ebe6dc]">
        <div className="flex items-center gap-[5px]">
          <div className="w-3 h-[2px] bg-ink" />
          <span className="font-mono text-[9px] text-[#aaa]">studies</span>
        </div>
        <div className="flex items-center gap-[5px]">
          <div className="w-3 h-[2px] bg-green-deep" />
          <span className="font-mono text-[9px] text-[#aaa]">experience</span>
        </div>
      </div>
    </div>
  )
}
