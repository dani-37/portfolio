import { EXPERIENCE_REGISTRY } from "../experiences";

interface ExperienceProps {
  onSelect: (name: string) => void;
  mobile?: boolean;
}

export default function Experience({ onSelect, mobile }: ExperienceProps) {
  return (
    <div
      className={
        mobile
          ? "p-8 md:p-14 flex flex-col"
          : "absolute inset-0 px-14 py-10 md:px-16 md:py-12 flex flex-col"
      }>
      <h2 className="font-mono text-caption tracking-wide uppercase text-green-deep mb-4">
        Experience
      </h2>
      <div
        className={
          mobile
            ? "flex flex-col"
            : "flex flex-col flex-1 divide-y divide-gray-faint"
        }>
        {EXPERIENCE_REGISTRY.map(({ name, title, description, years }) => (
          <button
            key={name}
            aria-label={`View ${name} experience details`}
            className={`focusable-row flex-1 flex flex-col justify-center cursor-pointer group bg-transparent hover:bg-green-deep/5 text-left w-full transition-colors ${mobile ? "py-4 border-b border-gray-faint last:border-b-0 border-x-0 border-t-0" : "border-0"}`}
            onClick={() => onSelect(name)}>
            <div className="flex justify-between items-baseline">
              <span className="inline-flex items-center gap-3">
                <span className="font-display font-bold text-heading tracking-tight text-ink group-hover:text-green-deep">
                  {name}
                </span>
                {!mobile && (
                  <svg width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="var(--color-green-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-30 translate-x-0 group-hover:opacity-60 group-hover:translate-x-0.5 transition-all duration-200 ease-out" aria-hidden="true">
                    <path d="M1 1l5 5-5 5" />
                  </svg>
                )}
              </span>
              <span className="flex items-center shrink-0 ml-4">
                <span className="font-mono text-[13px] text-gray-muted group-hover:text-green-mid tracking-wide">
                  {years}
                </span>
                {mobile && (
                  <svg width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="var(--color-gray-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2 opacity-50" aria-hidden="true">
                    <path d="M1 1l5 5-5 5" />
                  </svg>
                )}
              </span>
            </div>
            {mobile ? (
              <>
                <p className="mt-[2px] font-mono text-label tracking-wide uppercase text-gray-muted group-hover:text-green-mid leading-none">
                  {title}
                </p>
                <p className="mt-1 font-grotesk font-light text-caption text-gray-muted group-hover:text-green-mid leading-none">
                  {description}
                </p>
              </>
            ) : (
              <p className="mt-[2px] flex items-center gap-1.5">
                <span className="font-mono text-label tracking-wide uppercase text-gray-muted group-hover:text-green-mid leading-none">
                  {title}
                </span>
                <span className="text-gray-faint group-hover:text-green-mid text-label leading-none">
                  ·
                </span>
                <span className="font-grotesk font-light text-caption text-gray-muted group-hover:text-green-mid leading-none">
                  {description}
                </span>
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
