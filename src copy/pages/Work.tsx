import React from "react";
import { TextAnimator } from "../components/Animation.tsx";
import { Link, Outlet, useLocation } from "react-router-dom";

const Experience = ({
  name,
  description,
}: {
  name: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-end">
      <Link to={name} className="cursor-pointer group">
        <ul className="w-full flex justify-end">
          <li
            className="font-mono text-5xl md:text-6xl w-min group-hover:underline group-hover:cursor-pointer md:group-hover:italic md:group-hover:translate-x-1 text-nowrap"
            style={{
              textDecoration: "underline",
              textDecorationColor: "white",
              textDecorationThickness: "3px",
            }}>
            <TextAnimator text={name} />
          </li>
        </ul>
        <p className="-mt-1 font-aptos text-lg">{description}</p>
      </Link>
    </div>
  );
};

const Work = () => {
  const location = useLocation();
  const isBaseRoute = location.pathname === "/work";

  return (
    <>
      {isBaseRoute ? (
        <div className="text-right w-full space-y-10">
          <div className="md:hidden font-mono text-3xl w-full border-b-2 mb-12">
            Work
          </div>

          <Experience name="klere" description="sustainability / consulting" />
          <Experience name="toolip" description="non-profit / software" />
          <Experience name="graphext" description="data viz / analysis" />
        </div>
      ) : (
        <div className="mt-10 h-full w-full">
          <Outlet />
        </div>
      )}
    </>
  );
};

export default Work;
