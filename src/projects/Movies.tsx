export default function Movies({ stack }: { stack?: string[] }) {
  return (
    <article className="max-w-2xl mx-auto px-6 pt-8 pb-16 font-grotesk font-light text-ink">
      <h1 className="font-syne font-bold text-[40px] tracking-[-1.5px] leading-none mb-4">
        Movie Network
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
        <img
          src="/images/graph.png"
          alt="Network graph of movies"
          className="w-full md:w-1/2 object-cover rounded-lg md:float-right md:ml-4 mb-2"
        />

        <p>
          A personal project born from a real problem: my housemates and I love
          watching movies together, but we have wildly different tastes. If I
          wanted to watch Shrek and somebody wanted James Bond, how could we meet
          in the middle? To me, it seemed like a graph-based task.
        </p>

        <p>
          Each movie is a node, and connections are weighted by how much users
          who liked one film liked the other. The recommender walks the graph to
          find films that bridge your inputs — movies that sit between different
          tastes rather than simply matching one of them.
        </p>

        <p>
          I started with the{" "}
          <a
            href="https://grouplens.org/datasets/movielens/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-deep hover:underline"
          >
            MovieLens
          </a>{" "}
          dataset — 33 million rows, cleaned down to about 11 million. Outlier
          users with more than 10,000 reviews were removed, as were movies with
          fewer than 10 reviews. I then weighted users' opinions to ensure that
          those who clearly liked a movie contributed more to the edge weights
          than lukewarm raters.
        </p>

        <img
          src="/images/histogram.png"
          alt="Exploratory data analysis of movie dataset"
          className="w-full md:w-1/2 object-cover rounded-lg md:float-left md:mr-4 mb-2"
        />

        <p>
          To validate the approach I built three clearly distinct test profiles:{" "}
          <em>The Romcom Lover</em>, <em>The Tarantino Fanatic</em>, and{" "}
          <em>Family Friendly Fun</em>. The movies the user likes are on the
          left, and the recommendations on the right.
        </p>

        <div className="clear-both" />

        <p className="font-medium italic text-[#666]">The Romcom Lover</p>
        <img
          src="/images/romcom.png"
          alt="Romcom movie recommendation results"
          className="w-full object-cover rounded-lg"
        />

        <p className="font-medium italic text-[#666]">The Tarantino Fanatic</p>
        <img
          src="/images/tarantino.png"
          alt="Tarantino movie recommendation results"
          className="w-full object-cover rounded-lg"
        />

        <p className="font-medium italic text-[#666]">Family Friendly Fun</p>
        <img
          src="/images/family.png"
          alt="Family friendly movie recommendation results"
          className="w-full object-cover rounded-lg"
        />

        <p>
          The recommendations clearly reflect different tastes, and blended
          profiles produce genuinely interesting middle-ground suggestions.
          Playing around with different movies I enjoy, I've found new ones to
          watch.
        </p>

        <p>
          The main challenges were dealing with biases — generous raters,
          universally popular movies — and sparsity in the user-movie matrices.
          Since I was working with large matrices, users or movies with few
          reviews introduce many missing values. Dealing with these efficiently
          taught me a lot about SciPy's optimisation techniques and sparse data
          structures.
        </p>
      </div>
    </article>
  );
}
