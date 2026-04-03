export default function Graphext() {
  return (
    <>
      <p>
        I worked as a Data Science Content Creator at Graphext during my
        Bachelor's. My role focused on creating data stories that communicate
        complex statistical analysis to a wide audience.
      </p>
      <img
        src="/images/graphext.png"
        alt="Graphs from Congress tweets analysis"
        className="w-full md:w-1/2 object-cover rounded-lg md:float-right md:ml-4 mb-4"
      />
      <p>
        I used NLP to conduct and present multiple projects, presenting results
        using clustering methods and connected graphs. We were using Word2Vec
        and even got access to an early-version GPT2 to process language-based
        datasets.
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
        analysing US Congress tweets during COVID. To gather the data, I used a
        Twitter scraper, which gave me a wide variety of tweets. These were
        analysed and clustered using NLP and k-means to provide groupings. I
        could then filter to find strategies that were successful for
        politicians. As a quick insight, these varied wildly between Replublians
        and Democrats.
      </p>
    </>
  );
}
