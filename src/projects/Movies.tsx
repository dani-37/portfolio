export default function Movies({ stack }: { stack?: string[] }) {
  return (
    <article className="max-w-2xl mx-auto px-6 pt-10 pb-16 font-grotesk font-light text-ink">
      <h1 className="font-display font-bold text-title tracking-tight leading-none mb-4">
        Movie Network
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
        <img
          src="/images/graph.png"
          alt="Network graph of movies"
          className="w-full md:w-1/2 object-cover rounded-lg md:float-right md:ml-4 mb-2 dark:invert-0 invert"
        />

        <p>
          A personal project born from a real problem: my housemates and I had
          wildly different tastes in movies. I wanted a recommender that finds
          common ground between inputs rather than just matching one of them. To
          me, it seemed like a graph problem.
        </p>

        <p>
          Each movie is a node in a directed graph, with edges are weighted by
          how much users who liked one film liked the next. The recommender
          walks the graph to find films that bridge different tastes. I used the{" "}
          <a
            href="https://grouplens.org/datasets/movielens/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-deep hover:underline">
            MovieLens
          </a>{" "}
          dataset (33M rows, cleaned to about 11M) and weighted user opinions so
          that strong preferences contributed more to edge weights than lukewarm
          ratings.
        </p>

        <p>
          I discovered one of my favorite films using this project! It's called{" "}
          <a
            href="https://www.imdb.com/title/tt0088846/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-deep hover:underline">
            Brazil
          </a>
          {": "}
          an absurd humour, distopyian future, wonky tale that fits right in
          with my movie tastes.
        </p>

        <p>
          <a
            href="https://github.com/dani-37/movie-recommender-graph/blob/main/main.ipynb"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-deep hover:underline">
            See the code ↗
          </a>
        </p>
      </div>
    </article>
  );
}
