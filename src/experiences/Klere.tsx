export default function Klere() {
  return (
    <>
      <img
        src="/images/bd_map.webp"
        alt="Biodiversity density map of the UK"
        loading="lazy"
        width={1817}
        height={2305}
        className="w-full md:w-1/3 object-cover rounded-lg md:float-right md:ml-4 mb-4"
      />
      <p>
        My role as an Analyst at Klere focused on designing effective methods
        for calculating a company's footprint on biodiversity.
      </p>
      <p>
        I used GIS and Python to analyse UK habitat data, creating biodiversity
        density maps of the UK. We used these maps to analyse the biodiversity
        opportunity cost of a company's direct land use. Using EXIOBASE, an
        international input-output table with environmental data, I calculated
        land use embedded in supply chains. Combining data on direct and
        embedded land use impacts gave us a quantum for the biodiversity
        footprint of a company.
      </p>
      <p>
        Using SQL, TypeScript, and AWS, I built a platform to host this data,
        showing both carbon and nature footprints with clear visualizations. It
        has been our data presentation tool for multiple large projects, from
        media to construction. Read more about it{" "}
        <a
          href="https://www.klere.uk/nature-impact-metric"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-deep hover:underline">
          here ↗
        </a>
        .
      </p>
    </>
  );
}
