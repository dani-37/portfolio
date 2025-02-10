import React, { useEffect, useRef } from "react";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";
import { TextAnimator } from "./Animation.tsx";
import { GoArrowUpRight } from "react-icons/go";
import ThreeBackground from "./Background.tsx";

const Page = ({
  title,
  description,
  content,
  link,
  dates,
  page = "work",
}: {
  title: string;
  description: string;
  content: React.ReactNode;
  link?: string;
  dates: string;
  page?: string;
}) => {
  return (
    <div className="relative w-full md:max-h-[85vh] flex flex-col cursor-default">
      <div className="flex gap-[12px] md:-ml-[4.45rem] items-center pt-5 md:pt-0">
        <Tooltip
          title={<p className="font-mono"> Back </p>}
          placement="left"
          className="hidden md:block">
          <Link
            to={"/" + page}
            className="w-14 h-10 group flex items-center cursor-pointer">
            <p className="text-[2.7rem] w-16 ml-3 -mt-4 group-hover:ml-2 transition-all cursor-pointer pointer-events-none text-gray-800 opacity-70 group-hover:opacity-100">
              {"<"}
            </p>
          </Link>
        </Tooltip>

        <h2 className="font-mono text-5xl md:text-[3.5rem] flex flex-col md:flex-row justify-between w-full h-max md:items-end">
          <TextAnimator text={title} />
          <div className="w-full h-full flex md:justify-end min-h-full text-base pr-[20px] text-gray-800 mb-8">
            {dates}
          </div>
        </h2>
      </div>

      <p className="md:text-xl font-mono text-gray-800 -mt-4 md:mt-0">
        {description}
        {link && (
          <Tooltip
            title={<p className="font-mono"> Go to site </p>}
            placement="right">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center ml-1 translate-y-1 text-white opacity-70 hover:opacity-100 hover:scale-110">
              <GoArrowUpRight className="ml-1 -mb-4" />
            </a>
          </Tooltip>
        )}
      </p>

      <div className="h-[1px] w-full bg-white mt-4" />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar fade-edge">
        <div className="text-gray-600 md:text-[1.1rem] font-aptos py-5 overflow-auto">
          {content}
        </div>
      </div>
      <ThreeBackground />
    </div>
  );
};

export default Page;
