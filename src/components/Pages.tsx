import React from "react";
import { GoArrowUpRight } from "react-icons/go";
import ThreeBackground from "./Background.tsx";
import { useNavigate } from "react-router-dom";

const Page = ({
  title,
  description,
  content,
  link,
  dates,
}: {
  title: string;
  description: string;
  content: React.ReactNode;
  link?: string;
  dates: string;
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen font-aptos ">
      <aside className="fixed top-0 flex-none w-[28.57vw] h-screen hidden md:flex items-center overflow-hidden pointer-events-none">
        <div
          className="relative border-r-[1.5px] w-3/5 h-[75vh] border-yellow
               drop-shadow-[0_0_2px_rgba(255,255,0,0.6)] py-[15vh]
               flex flex-col justify-between items-end pr-4"
        />
        <div
          onClick={() => navigate("/")}
          className="pt-6 pb-[70vh] absolute top-[12vh] right-[12vw] pr-6 pl-8 text-4xl -ml-20 cursor-pointer pointer-events-auto opacity-70 hover:opacity-100 transition-all hover:text-green hover:pr-8">
          {"<"}
        </div>
      </aside>

      <div className="w-full flex flex-col cursor-default md:pl-[28.57vw] py-[14.28vh] px-[5vw] md:pr-[14.28vw] text-yellow">
        <h2 className="font-medium flex w-full text-5xl md:text-[3.5rem] justify-between items-center">
          <p className="font-medium tracking-wider ">{title}</p>
          <div className="flex md:justify-end text-base font-light">
            {dates}
          </div>
        </h2>

        <p className="md:text-xl font-aptos font-extralight">
          {description}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center ml-1 translate-y-1 text-green opacity-70 hover:opacity-100 hover:scale-110 transition-all">
              <GoArrowUpRight className="ml-1 -mb-4" />
            </a>
          )}
        </p>

        <div className="h-[1px] w-full bg-green mt-4" />

        {/* Scrollable Content */}
        <div className="flex-1">
          <div className="md:text-[1.1rem] py-5 text-yellow font-light font-aptos">
            {content}
          </div>
        </div>
      </div>
      <ThreeBackground />
    </div>
  );
};

export default Page;
