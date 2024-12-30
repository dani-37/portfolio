import React from "react";
import Page from "../../components/Pages.tsx";

const Footprints = () => {
    const description = 'using data to quantify biodiversity impacts'

    const content = 
      <div className="relative space-y-5 text-gray-800">
        <p>
         At Klere, we wanted to offer companies a way to map, measure, and manage their impacts on biodiversity. In the UK, 
         the Department of Environment, Food, and Rural Affairs (DEFRA) made public their <b>Biodiversity Metric 4.0</b>. 
         Developed by a cohort of ecologists, economists, and policy makers, this metric serves as a practical approach to
         nature impact measuremnet. It was created with construction sites in mind - new developers must measure the biodiversity
         value of their developments before and after construction to either offset or mitigate their <b>nature impacts</b>.
        </p>

        <img
          src="/images/bd_growth.png"
          alt="Description of the image"
          className="w-2/5 object-cover rounded-lg float-right ml-4 mb-2"
        />

        <p>
          Our idea was simple - let's revert this metric to analyse the <b>biodiversity opportunity cost</b> of companies'
          ongoing activities. In other words, we sought to create a measure of nature impact by looking at how much nature
          is being supressed by a company's activity.
        </p>

        <p>
          The first step was to look at a way to model this potential growth. The DEFRA Biodiversity Metric uses habitats as 
          a proxy for biodiversity. This makes it quite useful, as an ecologist visit serves as enough to quantify the amount
          of <b>Biodiversity Units</b> present on site. We can use the multipliers present in the metric, related to habitat
          difficulty of creation, overall biodiversity value, and time until target condition, to model the potential biodiversity
          growth over time for each habitat. 
        </p>

        <img
          src="/images/bd_map.png"
          alt="Description of the image"
          className="w-1/3 object-cover rounded-lg float-left mr-4 mb-2"
        />

        <p>
          This allows us to create biodiversity maps of the UK, which in turn can be used to measure the biodiversity impact
          of a company's <b>direct land use</b>. This was done by combining a variety of publicly available habitat maps - it was a very 
          interesting way to learn about <b>Geographic Information Systems</b> (GIS), as well as using them in conjunction with 
          Python (GeoPandas) and SQL (PostGIS).
        </p>

        <p>
          However, this only completes one piece of the puzzle - the largest nature impact of most companies happens off-site. To
          get around the issue of complex supply chains, I used <b>input-output tables</b>. They give data on how each industry relates
          to the other, in both economic and ecological terms. This opened up a whole world of possibilities - I could now look at
          one unit of output from an industry and see how much land use was embedded in its supply chain.
        </p>

        <img
          src="/images/sankey.png"
          alt="Description of the image"
          className="w-1/2 object-cover rounded-lg float-right mr-4 my-2"
        />

        <p>
          Using <a href='https://www.exiobase.eu/' target="_blank" rel="noopener noreferrer" className="font-semibold" >EXIOBASE</a>, a popular environmentally enhanced input-output table, I gathered data on over 200 industries and their
          embedded land use types. To give an example, let's use wheatfields. EXIOBASE was telling me the ammount of wheatfield used per
          industry, and I could use my habitat maps to see the average biodiversity cost of a single hectare of wheatfield. Aggregating 
          this data meant that I could go from expenditure to <b>biodiversity impact</b>. Effectively, I could give a measure of biodiversity
          footprint per dollar spent in a wide variety of industries and products.
        </p>

        <img
          src="/images/bd_dash.png"
          alt="Description of the image"
          className="w-2/5 object-cover rounded-lg float-left mr-4 my-2"
        />

        <p>
          The last part of the story was conveying this data effectively. I developped an online dashboard to give our clients access
          to their impact data. We combined this with carbon footprint measurements, and are expanding it using maps of protected
          sites, data on threatened species, and impacts such as water use and waste management. Read more about it <a href='https://www.klere.uk/nature-impact-metric' target="_blank" rel="noopener noreferrer" className="font-semibold" >
          here</a>.
        </p>
      </div>

    return (
      <Page title={"nature footprints"} description={description} content={content} dates={"2023 - 2024"} page='projects'     />

    );
  };
  
export default Footprints