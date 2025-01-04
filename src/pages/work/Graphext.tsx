import React from "react";
import Page from "../../components/Pages.tsx";


const Graphext = () => {
  const content = (
        <div className="relative space-y-5 text-gray-800">
          <p>
            I worked as a <b className="font-semibold">Data Science Content Creator</b> at Graphext during
            my Bachelor's. Graphext provides an analytics tool for companies to analyse large datasets, and my 
            role focused on communicating these complex statistical analysis to a wide audience.
          </p>

          <p>
            I used NLP and graphing software to conduct and present multiple data analytics and 
            multimedia projects. I presented results using a variety of <b className="font-semibold">data visualisation</b> techniques, such as 
            clustering methods and connected graphs. We were using Word2Vec and even got access to an early-version
            GPT2 to process language-based datasets.
          </p>

          <img
            src="/images/graphext.png"
            alt="Graphs from my article"
            className="w-full md:w-1/2 object-cover float-right p-3 rounded-[1rem]"
          />

          <p>
            A project I'm particularly proud of is <a href='https://www.graphext.com/post/how-us-congress-tweets' target="_blank" rel="noopener noreferrer" className="font-semibold" >
            this blogpost</a> I wrote analysing US Congress tweets during COVID. To gather the data, I used a Twitter scraper,
            which gave me a wide variety of tweets. These were analysed and clustered using NLP and k-means to provide groupings. 
            I could then filter to find strategies that were succesful for each of the parties.
          </p>
        </div>
    );
  
  return (
    <Page
      title="graphext"
      description="advanced analytics solution to help businesses make better decisions based on data"
      content={content}
      link={'https://www.graphext.com/'}
      dates={'Jun 2020 - Oct 2020'}
    />
  );
  };
  
export default Graphext