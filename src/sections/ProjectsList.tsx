import { PROJECT_REGISTRY } from "../projects";
import { PROJECT_ICONS } from "../components/ProjectIcons";

interface ProjectsListProps {
  onSelect: (slug: string) => void;
  mobile?: boolean;
}

export default function ProjectsList({ onSelect, mobile }: ProjectsListProps) {
  return (
    <div className={mobile ? "p-8 md:p-14 flex flex-col" : "absolute inset-0 px-14 py-10 md:px-16 md:py-12 flex flex-col"}>
      <h2 className="font-mono text-caption tracking-wide uppercase text-green-deep mb-3">
        Projects
      </h2>
      <div className={mobile ? "flex flex-col gap-1" : "flex flex-col flex-1 overflow-hidden divide-y divide-gray-faint"}>
        {PROJECT_REGISTRY.map(({ slug, name, tag, description }) => (
          <button
            key={slug}
            aria-label={`View ${name} project details`}
            onClick={() => onSelect(slug)}
            className={
              mobile
                ? "focusable-row border-b border-gray-faint last:border-b-0 group cursor-pointer py-4 bg-transparent hover:bg-green-deep/5 border-x-0 border-t-0 text-left w-full transition-colors"
                : "focusable-row flex items-center gap-4 flex-1 group cursor-pointer bg-transparent hover:bg-green-deep/5 border-0 text-left w-full transition-colors"
            }>
            {mobile ? (
              <>
                <div className="flex items-baseline justify-between">
                  <span className="inline-flex items-center gap-3 font-display font-bold text-subhead tracking-tight text-ink group-hover:text-green-deep">
                    {PROJECT_ICONS[slug] && (() => { const I = PROJECT_ICONS[slug]; return <I />; })()}
                    {name}
                  </span>
                  <div className="flex items-center gap-2 shrink-0 ml-auto">
                    <span className="font-mono text-label tracking-wide uppercase text-green-deep">
                      {tag}
                    </span>
                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="var(--color-gray-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50" aria-hidden="true">
                      <path d="M1 1l5 5-5 5" />
                    </svg>
                  </div>
                </div>
                <p className="font-grotesk font-light text-caption text-gray-muted group-hover:text-green-mid mt-0.5">
                  {description}
                </p>
              </>
            ) : (
              <>
                <span className="inline-flex items-center gap-3 w-[190px] shrink-0">
                  <span className="inline-flex items-center gap-3 font-display font-bold text-subhead tracking-tight text-ink group-hover:text-green-deep">
                    {PROJECT_ICONS[slug] && (() => { const I = PROJECT_ICONS[slug]; return <I />; })()}
                    {name}
                  </span>
                  <svg width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="var(--color-green-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-30 translate-x-0 group-hover:opacity-60 group-hover:translate-x-0.5 transition-all duration-200 ease-out" aria-hidden="true">
                    <path d="M1 1l5 5-5 5" />
                  </svg>
                </span>
                <span className="font-mono text-label tracking-wide uppercase text-green-deep w-[160px] shrink-0">
                  {tag}
                </span>
                <span className="font-grotesk font-light text-caption text-gray-muted group-hover:text-green-mid flex-1 hidden md:block">
                  {description}
                </span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
