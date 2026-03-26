export default function Footprints() {
  return (
    <article className="max-w-2xl mx-auto px-6 py-16 font-grotesk font-light text-ink">
      <p className="font-mono text-[8px] tracking-[3px] uppercase text-green-deep mb-6">
        GIS · Python
      </p>
      <h1 className="font-syne font-bold text-[40px] tracking-[-1.5px] leading-none mb-8">
        Nature Footprints
      </h1>
      <div className="space-y-5 text-[15px] leading-relaxed text-[#444]">
        <p>
          A tool built at Klere to measure companies' biodiversity impact using
          DEFRA's Biodiversity Metric 4.0 — reversed to quantify the
          biodiversity opportunity cost of ongoing activities.
        </p>
        <p>
          Combined habitat maps of the UK using GeoPandas and PostGIS to create
          biodiversity density maps, then used EXIOBASE input-output tables to
          model supply-chain land use across 200+ industries.
        </p>
        <p>
          <strong className="font-medium">Stack:</strong> Python (GeoPandas, NumPy),
          PostgreSQL + PostGIS, EXIOBASE input-output data.
        </p>
      </div>
    </article>
  )
}
