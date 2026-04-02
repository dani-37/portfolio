export default function Toolip({ stack }: { stack?: string[] }) {
  return (
    <article className="max-w-2xl mx-auto px-6 pt-10 pb-16 font-grotesk font-light text-ink">
      <h1 className="font-display font-bold text-title tracking-tight leading-none mb-4">
        Toolip
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
          src="/images/toolip.png"
          alt="Toolip team"
          className="w-full md:w-2/5 object-cover rounded-lg md:float-right md:ml-4 mb-4"
        />
        <p>
          I led a project called Toolip, putting digital tools at the service of
          non-profits.
        </p>
        <p>
          We automated processes for a food donation NGO in Madrid called De
          Familia a Familia. They calculated by hand where each volunteer had to
          go and what food they should bring. I used Google APIs to automate
          these processes and sync them to their existing infrastructure. We
          integrated this with a newly formatted sign-up service that saved the
          organization time and resources.
        </p>
        <p>
          We also helped automate processes for a student-led project in
          Barcelona helping young students find part-time jobs. It involved
          using Chromium and Azure to host an online WhatsApp bot which
          responded in real time to students and would update their database
          live to keep track of existing offers and current candidates.
        </p>
        <p>
          <a
            href="https://toolipweb.github.io/web/home.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-deep hover:underline">
            Learn more
          </a>
        </p>
      </div>
    </article>
  );
}
