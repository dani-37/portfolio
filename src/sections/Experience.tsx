export const ROLES = [
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

interface ExperienceProps {
  onSelect: (name: string) => void
}

export default function Experience({ onSelect }: ExperienceProps) {
  return (
    <div className="absolute inset-0 p-10 md:p-12 flex flex-col">
      <p className="font-mono text-[8px] tracking-[3px] uppercase text-green-deep mb-4">
        Experience
      </p>
      <div className="flex flex-col gap-1">
        {ROLES.map(({ name, role, years }) => (
          <div
            key={name}
            className="border-b border-[#ebe6dc] last:border-b-0 py-2 cursor-pointer group"
            onClick={() => onSelect(name)}
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
          </div>
        ))}
      </div>
    </div>
  )
}
