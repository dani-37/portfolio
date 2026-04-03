export default function Footprints({ stack }: { stack?: string[] }) {
  return (
    <article className="max-w-2xl mx-auto px-6 pt-10 pb-16 font-grotesk font-light text-ink">
      <h1 className="font-display font-bold text-title tracking-tight leading-none mb-4">
        Nature Footprints
      </h1>
      {stack && (
        <div className="flex flex-wrap gap-2 mb-8">
          {stack.map((tech) => (
            <span
              key={tech}
              className="font-mono text-label tracking-wide uppercase text-gray-muted border border-gray-faint rounded-sm px-2 py-[2px]">
              {tech}
            </span>
          ))}
        </div>
      )}
      <div className="space-y-5 text-body leading-relaxed text-gray-strong">
        <p>
          At Klere, we wanted to measure how much biodiversity is being suppressed
          by a company's activity. The UK's{" "}
          <strong className="font-medium">DEFRA Biodiversity Metric 4.0</strong>{" "}
          gave us the tools. Our idea was to reverse this metric to analyse the
          biodiversity opportunity cost of ongoing land use.
        </p>

        <img
          src="/images/bd_map.png"
          alt="Biodiversity density map of the UK"
          className="w-full md:w-1/3 object-cover rounded-lg md:float-right md:ml-4 mb-2"
        />

        <p>
          I built biodiversity maps of the UK by combining publicly available
          habitat data using GIS (GeoPandas) and SQL (PostGIS). These maps showed
          where biodiversity value was concentrated and how different land uses
          affected it, letting us measure a company's{" "}
          <strong className="font-medium">direct land use</strong> impact.
        </p>

        <p>
          But most nature impact happens off-site, embedded in supply chains. Using{" "}
          <a
            href="https://www.exiobase.eu/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-deep hover:underline">
            EXIOBASE
          </a>
          , an environmentally enhanced input-output table covering 200+ industries,
          I went from expenditure to{" "}
          <strong className="font-medium">biodiversity impact</strong> per dollar
          spent.
        </p>

        <img
          src="/images/bd_dash.png"
          alt="Biodiversity footprint dashboard"
          className="w-full md:w-2/5 object-cover rounded-lg md:float-left md:mr-4 my-2"
        />

        <p>
          The last part was conveying this data effectively. I developed an online
          dashboard combining carbon and nature footprint measurements into one
          interface. Read more about it{" "}
          <a
            href="https://www.klere.uk/nature-impact-metric"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-deep hover:underline">
            here ↗
          </a>
          .
        </p>
      </div>
    </article>
  );
}
