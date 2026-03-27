import React from "react";

export const ROLES: {
  name: string;
  role: string;
  years: string;
  detail: React.ReactNode;
}[] = [
  {
    name: "OECD",
    role: "Consultant · regional attractiveness & policy data",
    years: "2025 – now",
    detail: (
      <>
        <p>
          Working with the Regional Attractiveness and Migrant Integration team
          on data pipelines, analysis, and tooling over OECD public datasets.
        </p>
        <p>
          Building tools that make international statistical data more
          accessible and usable for policy research — from dataset discovery to
          automated analysis pipelines.
        </p>
      </>
    ),
  },
  {
    name: "Klere",
    role: "Analyst · sustainability consulting",
    years: "2023 – 26",
    detail: (
      <>
        <img
          src="/images/bd_map.png"
          alt="Biodiversity density map of the UK"
          className="w-full md:w-1/3 object-cover rounded-lg md:float-right md:ml-4 mb-4"
        />
        <p>
          My role as an Analyst at Klere focused on designing effective methods
          for calculating a company's footprint on biodiversity. I also covered
          most things related to data and software development in the company.
        </p>
        <p>
          I used GIS (Geographic Information Systems) and Python to analyse UK
          habitat data. Combining these datasets with the DEFRA Biodiversity
          Metric, a UK government metric that became statutory in February 2024,
          I created density maps of the UK. We used these maps to analyse the
          biodiversity opportunity cost of a company's direct land use.
        </p>
        <p>
          I then used location data and ecologist advice to analyse the average
          biodiversity cost of different land use types. Using EXIOBASE, an
          international input-output table with environmental data, I calculated
          land use embedded in supply chains. Combining data on direct and
          embedded land use impacts gave us a quantum for the biodiversity
          footprint of a company.
        </p>
        <p>
          Using SQL, TypeScript, and AWS, I built a platform to host this data,
          showing both carbon and nature footprints with clear visualizations.
          It has been our data presentation tool for multiple large projects,
          from media to construction. Read more about it{" "}
          <a
            href="https://www.klere.uk/nature-impact-metric"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-deep hover:underline">
            here ↗
          </a>
          .
        </p>
      </>
    ),
  },
  {
    name: "Toolip",
    role: "Co-Founder · non-profit software",
    years: "2020 – 22",
    detail: (
      <>
        <img
          src="/images/toolip.png"
          alt="Toolip team"
          className="w-full md:w-2/5 object-cover rounded-lg md:float-right md:ml-4 mb-4"
        />
        <p>
          I was the co-founder and software developer at Toolip, working
          alongside 3 other university students interested in putting business
          and technical skills at the service of non-profits.
        </p>
        <p>
          Our largest project involved automating processes for a food donation
          NGO in Madrid called De Familia a Familia. They calculated by hand
          where each volunteer had to go and what food they should bring. As
          they hosted all their data on Google Drive, I used Google APIs to
          automate these processes and sync them to their existing
          infrastructure. We integrated this with a newly formatted sign-up
          service that saved the organization time and resources.
        </p>
        <p>
          We also helped automate processes for a student-led project in
          Barcelona helping young students find part-time jobs. It involved
          using Chromium and Azure to host an online WhatsApp bot which
          responded in real time to students and would update their database
          live to keep track of existing offers and current candidates.
        </p>
      </>
    ),
  },
  {
    name: "Graphext",
    role: "Data Science Content Creator · data viz",
    years: "2020",
    detail: (
      <>
        <p>
          I worked as a Data Science Content Creator at Graphext during my
          Bachelor's. Graphext provides an analytics tool for companies to
          analyse large datasets, and my role focused on communicating complex
          statistical analysis to a wide audience.
        </p>
        <img
          src="/images/graphext.png"
          alt="Graphs from Congress tweets analysis"
          className="w-full md:w-1/2 object-cover rounded-lg md:float-right md:ml-4 mb-4"
        />
        <p>
          I used NLP and graphing software to conduct and present multiple data
          analytics and multimedia projects. I presented results using data
          visualisation techniques such as clustering methods and connected
          graphs. We were using Word2Vec and even got access to an early-version
          GPT2 to process language-based datasets.
        </p>
        <p>
          A project I'm particularly proud of is{" "}
          <a
            href="https://www.graphext.com/post/how-us-congress-tweets"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-deep hover:underline">
            this blogpost ↗
          </a>{" "}
          analysing US Congress tweets during COVID. To gather the data, I used
          a Twitter scraper, which gave me a wide variety of tweets. These were
          analysed and clustered using NLP and k-means to provide groupings. I
          could then filter to find strategies that were successful for each of
          the parties.
        </p>
      </>
    ),
  },
];

interface ExperienceProps {
  onSelect: (name: string) => void;
}

export default function Experience({ onSelect }: ExperienceProps) {
  return (
    <div className="absolute inset-0 p-10 md:p-12 flex flex-col">
      <p className="font-mono text-[12px] tracking-[3px] uppercase text-green-deep mb-4">
        Experience
      </p>
      <div className="flex flex-col flex-1 justify-between">
        {ROLES.map(({ name, role, years }) => (
          <div
            key={name}
            className="border-b border-[#ebe6dc] last:border-b-0 min-h-[60px] flex flex-col justify-center cursor-pointer group"
            onClick={() => onSelect(name)}>
            <div className="flex justify-between items-baseline">
              <div>
                <span className="font-display font-bold text-[26px] tracking-[-0.5px] text-ink group-hover:text-green-deep transition-colors">
                  {name}
                </span>
                <p className="mt-[2px] flex items-center gap-[5px]">
                  <span className="font-mono text-[8px] tracking-[1.5px] uppercase text-[#999] leading-none relative top-[1px]">
                    {role.split(" · ")[0]}
                  </span>
                  {role.includes(" · ") && (
                    <>
                      <span className="text-[#ccc] text-[8px] leading-none">
                        ·
                      </span>
                      <span className="font-grotesk font-light text-[12px] text-[#bbb] leading-none">
                        {role.split(" · ")[1]}
                      </span>
                    </>
                  )}
                </p>
              </div>
              <span className="font-mono text-[9px] text-[#ccc] tracking-[1px] shrink-0 ml-4">
                {years}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
