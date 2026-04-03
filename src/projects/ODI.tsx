export default function ODI({ stack }: { stack?: string[] }) {
  return (
    <article className="max-w-2xl mx-auto px-6 pt-10 pb-16 font-grotesk font-light text-ink">
      <h2 className="font-display font-bold text-title tracking-tight leading-none mb-4">
        Open Data Interpreter
      </h2>
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
          ODI is a tool for working with public datasets through a combination
          of a high-quality dataset search experience and a chatbot/agent
          interface. It targets professional users who work with data from
          international organisations like the OECD, World Bank, and IMF.
        </p>
        <p>
          The core challenge: making public data easier to discover, inspect,
          cite, and analyse — with full provenance and reproducible steps. A
          user can ask "Make a graph showing GDP in Spain over time" and get
          back a response grounded in real datasets with citations.
        </p>

        <img
          src="/images/odi_example.webp"
          alt="ODI interface showing a data query and response"
          loading="lazy"
          width={2540}
          height={1694}
          className="img-full w-full rounded-lg my-2"
        />

        <p>
          Currently the tool indexes over 50,000 datasets from more than 30
          sources, including international organisations and national
          statistical offices. Over 40 users across 6 teams within the OECD use
          it internally, more than half of them daily — replacing hours of
          manual searching across national statistical offices and data portals.
          I've presented it to leadership and teams totalling over 300 people.
        </p>
      </div>
    </article>
  );
}
