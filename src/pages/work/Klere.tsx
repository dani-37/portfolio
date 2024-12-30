import React from "react";
import Page from "../../components/Pages.tsx";


const Klere = () => {
  const content = (
        <div className="relative space-y-5 text-gray-800 -mt-5">
          <img
            src="/images/bd_map.png"
            alt="Description of the image"
            className="w-1/3 object-cover rounded float-right pl-2 pb-2"
          />

          <p>
            My role as an <b>Analyst</b> at Klere focuses 
            on designing effective methods for calculating a company's footprint on biodiversity. 
            I also cover most things related to data and software development in the company.
          </p>

          <p>
            In my role as a <b>biodiversity data analyst</b> I use GIS (Geographic Information Systems) and Python to analyse UK habitat data. 
            Combining these datasets with the DEFRA Biodiversity Metric, a UK government metric that 
            became statutory this February, I then create density maps of the UK. We use these 
            maps to analyse the biodiversity opportunity cost of a company's direct land use.
          </p>

          <p>
            I then used location data and advice from ecologists at <a href='https://www.greengage-env.com/' target="_blank" rel="noopener noreferrer" className="font-semibold" >
            Greengage Environmental</a> to analyse the average biodiversity cost of different land use types. I used <a href='https://www.exiobase.eu/' target="_blank" rel="noopener noreferrer" className="font-semibold" >EXIOBASE</a>
            , an international input-output table with environmental data, to calculate land use embedded in supply chains. Combining data 
            on direct and embedded land use impacts, we can get a quantum for the <b>biodiveristy footprint</b> of a company.
          </p>

          <video
            src="/images/platform_demo.mov"
            controls
            className="h-60 object-cover rounded-md float-left mr-6 mb-6"
          />

          <p>
            Using SQL, Typescript, and AWS, I built a platform to host this data. It shows both carbon and 
            nature footprints with clear visualizations and intuitive UI. It has been our data presentation
            tool for multiple large projects, from media to construction. Read more about it  <a href='https://www.klere.uk/nature-impact-metric' target="_blank" rel="noopener noreferrer" className="font-semibold" >
            here</a>.
          </p>

          <div className="h-5"/>
        </div>
    );
  
  return (
    <Page
      title="klere"
      description="boutique sustainability consultancy based in London focusing on net-zero strategy and nature impact measurements"
      content={content}
      link={'https://klere.uk/'}
      dates={'Oct 2023 - Present'}
    />
  );
  };
  
export default Klere