import { PROJECT_REGISTRY } from "../projects";

interface ProjectsListProps {
  onSelect: (slug: string) => void;
}

export default function ProjectsList({ onSelect }: ProjectsListProps) {
  return (
    <div className="absolute inset-0 p-10 md:p-12 flex flex-col">
      <p className="font-mono text-[12px] tracking-[3px] uppercase text-green-deep mb-3">
        Projects
      </p>
      <div className="flex flex-col flex-1 justify-between overflow-hidden">
        {PROJECT_REGISTRY.map(({ slug, name, tag, description }) => (
          <div
            key={slug}
            onClick={() => onSelect(slug)}
            className="flex items-center gap-4 min-h-[44px] border-b border-[#ebe6dc] last:border-b-0 group cursor-pointer">
            <span className="font-display font-bold text-[20px] min-w-[150px] tracking-[-0.3px] transition-colors text-ink group-hover:text-green-deep">
              {name}
            </span>
            <span className="font-mono text-[8px] tracking-[1.5px] uppercase text-green-deep min-w-[120px]">
              {tag}
            </span>
            <span className="font-grotesk font-light text-[12px] text-[#aaa] flex-1 hidden md:block">
              {description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
