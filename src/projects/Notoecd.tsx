export default function Notoecd({ stack }: { stack?: string[] }) {
  return (
    <article className="max-w-2xl mx-auto px-6 pt-10 pb-16 font-grotesk font-light text-ink">
      <h1 className="font-display font-bold text-title tracking-tight leading-none mb-4">
        notoecd
      </h1>
      {stack && (
        <div className="flex flex-wrap gap-2 mb-8">
          {stack.map((tech) => (
            <span
              key={tech}
              className="font-mono text-label tracking-wide uppercase text-gray-muted border border-gray-faint rounded-sm px-2 py-[2px]"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
      <div className="space-y-5 text-body leading-relaxed text-gray-strong">
        <p>
          A lightweight Python interface for the OECD's SDMX API — published on
          PyPI. Lets you discover datasets, search by keyword, explore structure,
          and download filtered data directly into a pandas DataFrame.
        </p>
        <p>
          Built out of a real need while working at the OECD: the official API
          is powerful but underdocumented. notoecd wraps it into something
          usable in a notebook in a few lines.
        </p>
        <p>
          <a href="https://pypi.org/project/notoecd/" target="_blank" rel="noopener noreferrer"
             className="text-green-deep hover:underline">
            pip install notoecd ↗
          </a>
        </p>
      </div>
    </article>
  )
}
