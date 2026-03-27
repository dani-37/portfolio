export default function ODI({ stack }: { stack?: string[] }) {
  return (
    <article className="max-w-2xl mx-auto px-6 pt-8 pb-16 font-grotesk font-light text-ink">
      <h1 className="font-syne font-bold text-[40px] tracking-[-1.5px] leading-none mb-4">
        Open Data Interpreter
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
          ODI is a tool for working with public datasets through a combination of
          a high-quality dataset search experience and a chatbot/agent interface.
          It targets professional users who work with data from international
          organisations like the OECD, World Bank, and IMF.
        </p>
        <p>
          The core challenge: making public data easier to discover, inspect,
          cite, and analyse — with full provenance and reproducible steps.
          A user can ask "Make a graph showing GDP in Spain over time" and get
          back a response grounded in real datasets with citations.
        </p>
        <p>
          <strong className="font-medium">Stack:</strong> Python backend with a
          Claude-powered agent, PostgreSQL + pgvector for semantic dataset search,
          TypeScript frontend, deployed on Fly.io.
        </p>
      </div>
    </article>
  )
}
