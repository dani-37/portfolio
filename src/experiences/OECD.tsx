export default function OECD() {
  return (
    <>
      <p>
        Data scientist in the Centre for Entrepreneurship, SMEs, Regions and
        Cities. I produce data analysis, visualisations, and tools that
        policy analysts use to write recommendations for OECD member countries.
      </p>
      <p>
        My first project was an overhaul of the{" "}
        <a
          href="https://www.oecd.org/en/about/programmes/rethinking-regional-attractiveness.html"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-deep hover:underline">
          Regional Attractiveness
        </a>{" "}
        database. The codebase was a single large file with no structure. I
        rebuilt it into a modular Python repository, expanded it to include time
        series, and formalised procedures for collecting, transforming, and making
        60+ indicators internationally comparable. The output is a composite
        score for regions across OECD countries.
      </p>
      <img
        src="/images/oecd_regatt.png"
        alt="OECD Regional Attractiveness visualisation"
        className="img-full w-full md:w-1/2 rounded-lg my-2 md:float-right md:ml-4"
      />
      <p>
        Under this programme I also worked on country projects for Spain,
        Guatemala, Latvia, Greece, and Italy, producing datasets, charts, and
        analysis for their reports and policy briefs. For Latvia, I built and
        handed over a large Python codebase that calculates regional values at
        both regional and municipal level. It was the first time the programme could offer this
        level of granularity and technical output.
      </p>
      <p>
        I now work with the Rural team on projects covering forestry, rural
        discontent, and indigenous communities. Recent work includes using
        input-output tables to analyse the indirect effects of forestry on
        the economy.
      </p>
    </>
  );
}
