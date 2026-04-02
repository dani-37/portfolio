export default function Graphext() {
  return (
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
  );
}
