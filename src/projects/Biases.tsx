export default function Biases({ stack }: { stack?: string[] }) {
  return (
    <article className="max-w-2xl mx-auto px-6 pt-10 pb-16 font-grotesk font-light text-ink">
      <h2 className="font-display font-bold text-title tracking-tight leading-none mb-4">
        Quantifying Gender Bias in LLMs
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
          LLMs amplify societal biases from their training data, but the
          internal mechanisms are poorly understood. We used{" "}
          <strong className="font-medium">Sparse Auto-Encoders (SAEs)</strong>{" "}
          to map how gendered prompts influence model outputs; testing
          DeepSeek-R1, Mistral-Nemo, and Llama-3.3-70B. The inputs were 50k
          sentences which were duplicated by swapping pronouns.
        </p>

        <p>
          The idea: if a model is unbiased, swapping <em>he</em> for{" "}
          <em>she</em> should produce similar completions. The key idea was to
          encode outputs into SAE feature space, allowing us to quantify
          divergence in activations in a standardised way. Then, we used
          logistic regression to isolate the pronouns' effect on divergence,
          with clustered semantic categories letting us see which concepts shift
          with gender.
        </p>

        <p>
          In the chart below, categories which shift to the right were
          disproportionately mentioned when the pronouns <em>she</em>/
          <em>her</em> were present, and vice versa for male pronouns.
        </p>

        <img
          src="/images/llm_bias_results.webp"
          alt="Gender bias scores across semantic clusters for DeepSeek-R1, Llama-3.3-70B, and Mistral-Nemo"
          loading="lazy"
          width={1650}
          height={1290}
          className="img-full w-full rounded-lg my-2"
        />

        <p>
          The pattern was consistent across all three models: male prompts
          activated features related to finance, politics, and sports, while
          female prompts skewed toward family and personal relationships.
          DeepSeek-R1 showed the strongest divergence.
        </p>

        <p>
          <a
            href="/papers/llm_biases_daniel_vegara.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-deep hover:underline">
            Read the paper ↗
          </a>
        </p>
      </div>
    </article>
  );
}
