import { useState } from 'react'

const ROLES = [
  {
    name: 'Klere',
    role: 'Analyst · sustainability consulting',
    years: '2023 – now',
    detail: 'Built biodiversity impact models using DEFRA\'s Biodiversity Metric 4.0, GIS tooling (GeoPandas, PostGIS), and input-output analysis to quantify companies\' nature footprints.',
  },
  {
    name: 'OECD',
    role: 'Intern · regional attractiveness & policy data',
    years: '2024 – now',
    detail: 'Working with the Regional Attractiveness and Migrant Integration team on data pipelines, analysis, and tooling over OECD public datasets.',
  },
  {
    name: 'Toolip',
    role: 'Co-Founder · non-profit software',
    years: '2020 – 22',
    detail: 'Co-founded a non-profit building software tools for social impact organisations. Led product and engineering from zero to first users.',
  },
  {
    name: 'Graphext',
    role: 'Data Science Content Creator · data viz',
    years: '2020',
    detail: 'Produced data analysis and visualisation content showcasing the Graphext platform to a technical audience.',
  },
]

export default function Experience() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="absolute inset-0 p-12 md:p-14 flex flex-col justify-between">
      <p className="font-mono text-[8px] tracking-[3px] uppercase text-green-deep mb-2">
        Experience
      </p>
      <div className="flex flex-col flex-1 justify-evenly">
        {ROLES.map(({ name, role, years, detail }) => (
          <div
            key={name}
            className="border-b border-[#ebe6dc] last:border-b-0 py-2 cursor-pointer group"
            onClick={() => setExpanded(expanded === name ? null : name)}
          >
            <div className="flex justify-between items-baseline">
              <div>
                <span className="font-display font-bold text-[26px] tracking-[-0.5px] text-ink group-hover:text-green-deep transition-colors">
                  {name}
                </span>
                <p className="font-grotesk font-light text-[12px] text-[#999] mt-[2px]">{role}</p>
              </div>
              <span className="font-mono text-[9px] text-[#ccc] tracking-[1px] shrink-0 ml-4">
                {years}
              </span>
            </div>
            {expanded === name && (
              <p className="font-grotesk font-light text-[13px] text-[#666] mt-2 leading-relaxed">
                {detail}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
