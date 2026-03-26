export default function Notoecd() {
  return (
    <article className="max-w-2xl mx-auto px-6 py-16 font-grotesk font-light text-ink">
      <p className="font-mono text-[8px] tracking-[3px] uppercase text-green-deep mb-6">
        Python pkg
      </p>
      <h1 className="font-syne font-bold text-[40px] tracking-[-1.5px] leading-none mb-8">
        notoecd
      </h1>
      <div className="space-y-5 text-[15px] leading-relaxed text-[#444]">
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
