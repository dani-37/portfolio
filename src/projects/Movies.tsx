export default function Movies() {
  return (
    <article className="max-w-2xl mx-auto px-6 py-16 font-grotesk font-light text-ink">
      <p className="font-mono text-[8px] tracking-[3px] uppercase text-green-deep mb-6">
        Graph theory
      </p>
      <h1 className="font-syne font-bold text-[40px] tracking-[-1.5px] leading-none mb-8">
        Movie Network
      </h1>
      <div className="space-y-5 text-[15px] leading-relaxed text-[#444]">
        <p>
          A graph-based movie recommender: given a list of films you like,
          find what sits "between" them in the taste graph. Built over the
          MovieLens dataset (11M rows after cleaning).
        </p>
        <p>
          Each movie is a node; edges are weighted by how strongly users who
          liked one film liked the other. The recommender walks the graph to
          find films that bridge your inputs.
        </p>
        <p>
          <strong className="font-medium">Stack:</strong> Python (NetworkX,
          pandas), MovieLens 33M dataset.
        </p>
      </div>
    </article>
  )
}
