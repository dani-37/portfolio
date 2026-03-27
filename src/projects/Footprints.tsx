export default function Footprints({ stack }: { stack?: string[] }) {
  return (
    <article className="max-w-2xl mx-auto px-6 pt-8 pb-16 font-grotesk font-light text-ink">
      <h1 className="font-syne font-bold text-[40px] tracking-[-1.5px] leading-none mb-4">
        Nature Footprints
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
          At Klere, we wanted to offer companies a way to map, measure, and
          manage their impacts on biodiversity. In the UK, the Department of
          Environment, Food, and Rural Affairs (DEFRA) made public their{" "}
          <strong className="font-medium">Biodiversity Metric 4.0</strong>.
          Developed by ecologists, economists, and policy makers, this metric
          serves as a practical approach to nature impact measurement.
        </p>

        <p>
          Our idea was simple — reverse this metric to analyse the{" "}
          <strong className="font-medium">biodiversity opportunity cost</strong>{" "}
          of companies' ongoing activities. In other words, we sought to measure
          how much nature is being suppressed by a company's activity.
        </p>

        <img
          src="/images/bd_growth.png"
          alt="Biodiversity growth over time for different habitats"
          className="w-full md:w-2/5 object-cover rounded-lg md:float-right md:ml-4 mb-2"
        />

        <p>
          The first step was to model potential growth. The DEFRA Metric uses
          habitats as a proxy for biodiversity — an ecologist visit is enough to
          quantify the{" "}
          <strong className="font-medium">Biodiversity Units</strong> present on
          site. This let us create biodiversity maps of the UK by combining
          publicly available habitat maps using GIS (GeoPandas) and SQL
          (PostGIS).
        </p>

        <img
          src="/images/bd_map.png"
          alt="Biodiversity density map of the UK"
          className="w-full md:w-1/3 object-cover rounded-lg md:float-left md:mr-4 mb-2"
        />

        <p>
          These maps gave us a granular picture of where biodiversity value was
          concentrated and how different land uses affected it — letting us
          measure the biodiversity impact of a company's{" "}
          <strong className="font-medium">direct land use</strong>.
        </p>

        <p>
          However, direct land use is only one piece of the puzzle. The largest
          nature impact of most companies happens off-site, embedded in their
          supply chains. To capture this, I used{" "}
          <strong className="font-medium">input-output tables</strong> — data on
          how each industry relates to every other in both economic and
          ecological terms.
        </p>

        <img
          src="/images/sankey.png"
          alt="Sankey diagram of various industries' inputs"
          className="w-full md:w-1/2 object-cover rounded-lg md:float-right md:ml-4 my-2"
        />

        <p>
          Using{" "}
          <a
            href="https://www.exiobase.eu/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-deep hover:underline"
          >
            EXIOBASE
          </a>
          , an environmentally enhanced input-output table, I gathered data on
          over 200 industries and their embedded land use types. For instance,
          EXIOBASE told me the amount of wheatfield used per industry, and I
          could use my habitat maps to see the average biodiversity cost of a
          single hectare of wheatfield. Aggregating this data meant I could go
          from expenditure to{" "}
          <strong className="font-medium">biodiversity impact</strong> —
          effectively, a measure of biodiversity footprint per dollar spent
          across a wide variety of industries and products.
        </p>

        <img
          src="/images/bd_dash.png"
          alt="Biodiversity footprint dashboard"
          className="w-full md:w-2/5 object-cover rounded-lg md:float-left md:mr-4 my-2"
        />

        <p>
          The last part was conveying this data effectively. I developed an
          online dashboard to give clients access to their impact data, combining
          carbon and nature footprint measurements into a clear, actionable
          interface. We're expanding it with maps of protected sites, data on
          threatened species, and impacts such as water use and waste management.
          Read more about it{" "}
          <a
            href="https://www.klere.uk/nature-impact-metric"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-deep hover:underline"
          >
            here ↗
          </a>
          .
        </p>
      </div>
    </article>
  );
}
