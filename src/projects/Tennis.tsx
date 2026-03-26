export default function Tennis() {
  return (
    <article className="max-w-2xl mx-auto px-6 py-16 font-grotesk font-light text-ink">
      <p className="font-mono text-[8px] tracking-[3px] uppercase text-green-deep mb-6">
        Modelling
      </p>
      <h1 className="font-syne font-bold text-[40px] tracking-[-1.5px] leading-none mb-8">
        Tennis Ratings
      </h1>
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
