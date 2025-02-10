import React from "react";
import Page from "../../components/Pages.tsx";


const Toolip = () => {
  const content = (
        <div className="relative space-y-5 text-gray-800">
          <p>
            I was the <b className="font-semibold">co-founder</b> and <b className="font-semibold">software developer</b> at Toolip, 
            which put me at the forefront of many interesting projects. I worked alongside 3 other university students
            also interested in putting business and technical skills at the service of non-profits.
          </p>

          <img
            src="/images/toolip.jpg"
            alt="Toolip members picture"
            className="w-[45%] object-cover float-right p-3 rounded-[1rem]"
          />

          <p>
            Our largest project involved automating processes for a food donation NGO in Madrid called <b className="font-semibold">
            De Familia a Familia</b>. They would calculate by hand where each of the volunteers had to go and what food they should bring. 
            As they hosted all their data on Google Drive, I used <b className="font-semibold">Google APIs</b> to automate these processes and have them sync to their 
            existing infrastructure. We integrated this with a newly formatted sign up service that saved the organization time and resources.
          </p>

          <p>
            We also helped automate processes for a student-led project in Barcelona looking to help young
            students find part-time jobs. It involved using <b className="font-semibold">Chromium</b> and <b className="font-semibold">Azure</b> to
            host an online WhatsApp bot which responded in real time to students and would update their database
            live to keep track of existing offers and current candidates. 
          </p>
        </div>
    );
  
  return (
    <Page
      title="toolip"
      description="non-profit that provides IT solutions to NGOs and SMEs"
      content={content}
      link={'https://toolipweb.github.io/web/home.html'}
      dates={'Sept 2020 - May 2022'}
    />
  );
  };
  
export default Toolip