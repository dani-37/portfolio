import { PROJECT_REGISTRY } from '../projects'

interface ProjectsListProps {
  onSelect: (slug: string) => void
}

export default function ProjectsList({ onSelect }: ProjectsListProps) {
  return (
    <div className="absolute inset-0 p-10 md:p-12 flex flex-col">
      <p className="font-mono text-[8px] tracking-[3px] uppercase text-green-deep mb-3">
        Projects
      </p>
      <div className="flex flex-col gap-[2px] overflow-hidden">
        {PROJECT_REGISTRY.map(({ slug, name, tag, description, featured }) => (
          <div
            key={slug}
            onClick={() => onSelect(slug)}
            className="flex items-baseline gap-4 py-[7px] border-b border-[#ebe6dc] last:border-b-0 group cursor-pointer"
          >
            <span
              className={`font-display font-bold text-[20px] min-w-[100px] tracking-[-0.3px] transition-colors ${
                featured ? 'text-green-deep' : 'text-ink group-hover:text-green-deep'
              }`}
            >
              {name}
            </span>
            <span className="font-mono text-[8px] tracking-[1.5px] uppercase text-green-deep min-w-[90px]">
              {tag}
            </span>
            <span className="font-grotesk font-light text-[12px] text-[#aaa] flex-1 hidden md:block">
              {description}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
