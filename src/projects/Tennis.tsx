export default function Tennis({ stack }: { stack?: string[] }) {
  return (
    <article className="max-w-2xl mx-auto px-6 pt-8 pb-16 font-grotesk font-light text-ink">
      <h1 className="font-syne font-bold text-[40px] tracking-[-1.5px] leading-none mb-4">
        Tennis Ratings
      </h1>
      {stack && (
        <div className="flex flex-wrap gap-2 mb-8">
          {stack.map((tech) => (
            <span
              key={tech}
              className="font-mono text-[8px] tracking-[1px] uppercase text-[#999] border border-[#ddd] rounded-sm px-2 py-[2px]"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
      <div className="space-y-5 text-[15px] leading-relaxed text-[#444]">
        <p>
          An exploration of probabilistic player rating systems using real ATP
          match data. Implemented and compared ELO (incremental, match-by-match)
          and Bradley-Terry (maximum likelihood, global optimisation).
        </p>
        <p>
          The interesting problem: ELO is simple and fast but sensitive to
          ordering; Bradley-Terry gives better global rankings but requires
          solving a system iteratively. Both were applied to the same dataset
          and the results compared.
        </p>
        <p>
          <strong className="font-medium">Stack:</strong> Python (NumPy, SciPy,
          pandas), scraped match data.
        </p>
      </div>
    </article>
  )
}
