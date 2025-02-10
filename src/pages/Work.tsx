import React from "react";
import { useNavigate } from "react-router-dom";

import { FiArrowUpRight } from "react-icons/fi"; // Import the arrow icon

const Experience = ({
  name,
  role,
  description,
  years,
}: {
  name: string;
  role: string;
  description: string;
  years: string;
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col text-yellow">
      <a
        onClick={() => navigate(`/${name.toLowerCase()}`)}
        className="cursor-pointer group max-w-80">
        <ul className="w-full flex items-center">
          <li
            className="font-aptos text-5xl md:text-6xl  w-min group-hover:underline group-hover:cursor-pointer opacity-80 group-hover:opacity-100
            md:group-hover:translate-x-1 text-nowrap text-yellow font-normal relative tracking-wider"
            style={{
              textDecoration: "underline",
              textDecorationColor: "#00E04B",
              textDecorationThickness: "3px",
            }}>
            {name}

            <FiArrowUpRight
              className="hidden md:inline-block ml-3 mb-2 opacity-0 transition-all duration-500 ease-in-out transform h-5 w-5
                          group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:opacity-100 text-green"
            />
          </li>
        </ul>

        <p className="font-aptos font-light text-xl text-yellow md:group-hover:translate-x-2 transition-all duration-[400ms] ease-in-out">
          {role}
        </p>
        <p className="-mt-1 font-aptos font-light text-yellow text-[0.9rem] md:group-hover:translate-x-2 transition-all duration-[200ms] ease-in-out">
          {description}
        </p>
        <p className="-mt-1 font-aptos font-light text-yellow text-[0.9rem] md:group-hover:translate-x-2 transition-all duration-[200ms] ease-in-out">
          {years}
        </p>
      </a>
    </div>
  );
};

const Work = () => {
  return (
    <div className="space-y-10">
      <p className="md:hidden font-aptos text-5xl md:text-6xl mb-16 font-medium tracking-wider text-green">
        Work
      </p>
      <Experience
        name="Klere"
        role="Analyst"
        description="sustainability / consulting"
        years="2023 - Present"
      />
      <Experience
        name="Toolip"
        role="Co-Founder"
        description="non-profit / software"
        years="2020 - 2022"
      />
      <Experience
        name="Graphext"
        role="Data Science Content Creator"
        description="data viz / analysis"
        years="2020"
      />
    </div>
  );
};

export default Work;
