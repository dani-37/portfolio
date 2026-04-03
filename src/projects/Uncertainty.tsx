export default function Uncertainty({ stack }: { stack?: string[] }) {
  return (
    <article className="max-w-2xl mx-auto px-6 pt-10 pb-16 font-grotesk font-light text-ink">
      <h2 className="font-display font-bold text-title tracking-tight leading-none mb-4">
        Forest Growth Uncertainty
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
          Forests are a vital ecosystem. Under climate change, their future is
          increasingly uncertain. For my MSc thesis, I wanted to quantify this
          uncertainty using statistical methods.
        </p>

        <p>
          I built a{" "}
          <strong className="font-medium">
            Variational Sparse Heteroscedastic Gaussian Process
          </strong>{" "}
          that decomposes uncertainty into its sources. It separates irreducible
          noise (aleatoric) from lack of data (epistemic), and further
          attributes each to tree characteristics, climate, or spatial location
          using additive kernels.
        </p>

        <img
          src="/images/uncertainty_fig.webp"
          alt="Scenario analysis showing uncertainty decomposition under increasing temperature"
          loading="lazy"
          width={1374}
          height={776}
          className="img-full w-full rounded-lg my-2"
        />

        <p>
          The model was trained on 89K tree measurements from California's{" "}
          <a
            href="https://www.fia.fs.usda.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-deep hover:underline">
            FIA inventory
          </a>
          , paired with PRISM climate data. It matched Random Forest accuracy
          while producing calibrated confidence intervals. In scenario analyses,
          pushing climate inputs into unseen regimes doubled epistemic
          uncertainty, showing the model can flag when its predictions become
          unreliable.
        </p>

        <p>
          <a
            href="/papers/ucl_thesis_daniel_vegara.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-deep hover:underline">
            Read the thesis ↗
          </a>
        </p>
      </div>
    </article>
  );
}
