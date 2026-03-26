export default function Other() {
  return (
    <article className="max-w-2xl mx-auto px-6 py-16 font-grotesk font-light text-ink">
      <p className="font-mono text-[8px] tracking-[3px] uppercase text-green-deep mb-6">
        Various
      </p>
      <h1 className="font-syne font-bold text-[40px] tracking-[-1.5px] leading-none mb-8">
        Smaller projects
      </h1>
      <div className="space-y-8 text-[15px] leading-relaxed text-[#444]">
        <div>
          <h2 className="font-syne font-bold text-[20px] mb-2">Chess AI</h2>
          <p>Neural network trained to evaluate chess positions, with an ELO estimator for amateur players. Python + NumPy.</p>
        </div>
        <div>
          <h2 className="font-syne font-bold text-[20px] mb-2">unReel</h2>
          <p>An iOS app built in Swift. A personal project exploring native mobile development.</p>
        </div>
        <div>
          <h2 className="font-syne font-bold text-[20px] mb-2">p5 / Generative</h2>
          <p>Creative coding sketches in p5.js — exploring generative patterns, noise fields, and visual mathematics.</p>
        </div>
        <div>
          <h2 className="font-syne font-bold text-[20px] mb-2">Budget tool</h2>
          <p>A personal finance tracking tool built for my own use. TypeScript.</p>
        </div>
      </div>
    </article>
  )
}
