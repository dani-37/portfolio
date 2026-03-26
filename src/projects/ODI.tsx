export default function ODI() {
  return (
    <article className="max-w-2xl mx-auto px-6 py-16 font-grotesk font-light text-ink">
      <p className="font-mono text-[8px] tracking-[3px] uppercase text-green-deep mb-6">
        AI · full-stack
      </p>
      <h1 className="font-syne font-bold text-[40px] tracking-[-1.5px] leading-none mb-8">
        Open Data Interpreter
      </h1>
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
