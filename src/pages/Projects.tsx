import React from "react";
import { TextAnimator } from "../components/Animation.tsx";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

const Project = ({
  name,
  description,
}: {
  name: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col text-yellow max-w-[500px]">
      <Link to={name.replace(/\s+/g, "-")} className="cursor-pointer group">
        <ul className="w-full flex">
          <li
            className="font-aptos text-5xl md:text-6xl  w-min opacity-80 group-hover:opacity-100
            md:group-hover:translate-x-1 md:text-nowrap font-normal tracking-wider leading-[0.95]"
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
        <p className="font-aptos font-light md:group-hover:translate-x-2 transition-all duration-[400ms] ease-in-out">
          {description}
        </p>
      </Link>
    </div>
  );
};

const Projects = () => {
  return (
    <div className="space-y-10">
      <p className="md:hidden font-aptos text-5xl md:text-6xl mb-16 font-medium tracking-wider text-green ">
        Projects
      </p>
      <Project name="Nature Footprints" description="modelling / full-stack" />
      <Project name="Movie Network" description="python / graph theory" />
      <Project name="Web Development" description="typescript / tailwind" />
    </div>
  );
};

export default Projects;
