export default function Chess({ stack }: { stack?: string[] }) {
  return (
    <article className="max-w-2xl mx-auto px-6 pt-10 pb-16 font-grotesk font-light text-ink">
      <h1 className="font-display font-bold text-title tracking-tight leading-none mb-4">
        Smaller projects
      </h1>
      {stack && (
        <div className="flex flex-wrap gap-2 mb-8">
          {stack.map((tech) => (
            <span
              key={tech}
              className="font-mono text-label tracking-wide uppercase text-gray-muted border border-gray-faint rounded-sm px-2 py-[2px]"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
      <div className="space-y-8 text-body leading-relaxed text-gray-strong">
        <div>
          <h2 className="font-display font-bold text-subhead mb-2">Chess AI</h2>
          <p>
            Neural network trained to evaluate chess positions, with an ELO
            estimator for amateur players. Python + NumPy.
          </p>
        </div>
        <div>
          <h2 className="font-display font-bold text-subhead mb-2">unReel</h2>
          <p>
            An iOS app built in Swift. A personal project exploring native
            mobile development.
          </p>
        </div>
        <div>
          <h2 className="font-display font-bold text-subhead mb-2">
            p5 / Generative
          </h2>
          <p>
            Creative coding sketches in p5.js — exploring generative patterns,
            noise fields, and visual mathematics.
          </p>
        </div>
        <div>
          <h2 className="font-display font-bold text-subhead mb-2">Budget tool</h2>
          <p>
            A personal finance tracking tool built for my own use. TypeScript.
          </p>
        </div>
      </div>
    </article>
  );
}
