import React, { useEffect, useRef, useState } from "react";
import { FaLinkedin, FaPython } from "react-icons/fa";
import { HiOutlineDocumentText, HiOutlineMail } from "react-icons/hi";
import { AiOutlineTool } from "react-icons/ai";
import {
  SiTypescript,
  SiPostgresql,
  SiRstudioide,
  SiTailwindcss,
  SiPython,
} from "react-icons/si";
import { TbBrandNextjs } from "react-icons/tb";

function useIsVisible(ref: React.RefObject<HTMLElement>) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    });

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isVisible;
}

const About = () => {
  const [toolsOpen, setToolsOpen] = useState(false);

  const [waveActive, setWaveActive] = useState(false);
  const handleMouseEnter = () => {
    if (waveActive) return;
    setWaveActive(true);
    setTimeout(() => {
      setWaveActive(false);
    }, 750);
  };

  const [expanded, setExpanded] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const playedBefore = sessionStorage.getItem("lineAnimationPlayed");

    if (playedBefore) {
      // Skip animation on reload or subsequent visits
      setHasPlayed(true);
      setExpanded(true);
    } else {
      // Animate only once per session
      requestAnimationFrame(() => {
        setExpanded(true);
        sessionStorage.setItem("lineAnimationPlayed", "true");
      });
    }
  }, []);

  // If it already played, no transition. Otherwise, animate w-0 → w-full.
  const lineClass = hasPlayed
    ? "absolute bottom-3 left-0 h-[1.27px] bg-green w-full" // No transition
    : `absolute bottom-3 left-0 h-[1.27px] bg-green transition-all duration-500 ease-out ${
        expanded ? "w-full" : "w-0"
      }`;

  return (
    <div className="flex-col cursor-default md:min-w-[495px] text-yellow font-aptos">
      <div className="relative pb-4 text-[70px]">
        <div className="z-10 md:text-nowrap text-yellow font-thin leading-[0.75] ">
          daniel vegara
        </div>

        {/* Line behind */}
        <div className={lineClass} />
      </div>

      <h1 className="font-light text-3xl pb-5 mt-3 md:text-nowrap w-full tracking-wide leading-[1.15]">
        <p>
          Using data to tackle{" "}
          <span
            className={`green-wash ${waveActive ? "wave-animate" : ""}`}
            onMouseEnter={handleMouseEnter}>
            climate change
          </span>
          .
        </p>
      </h1>

      <div className="space-y-3 md:text-[1.15rem] font-light text-yellow">
        <p>
          Sustainability Analyst at Klere with a background in Data Science and
          Mathematics. Currently completing an MSc in AI for Sustainable
          Development at University College London.
        </p>
      </div>

      <div className="flex justify-between w-[225px] mt-[23px] items-center -ml-[9px]">
        <a
          href="https://linkedin.com/in/dvegarabalsa"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-green flex flex-col items-center group -mb-1 ">
          <FaLinkedin size={27} />
          <p className="text-xs mt-1 opacity-0 group-hover:opacity-100 h-0">
            LinkedIn
          </p>
        </a>

        <a
          href="mailto:dani+work@vegarabalsa.com"
          className="hover:text-green flex flex-col items-center group -mb-1">
          <HiOutlineMail size={27} />
          <p className="text-xs mt-1 opacity-0 group-hover:opacity-100 h-0">
            Email
          </p>
        </a>

        <a
          href="/Daniel_Vegara_CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-green flex flex-col items-center group -mb-1">
          <HiOutlineDocumentText size={27} />
          <p className="text-xs mt-1 opacity-0 group-hover:opacity-100 h-0">
            Resume
          </p>
        </a>

        <div
          className={`hover:text-green hover:border-green transition-all relative
              flex pl-[7px] pr-[10px] py-1 rounded-md gap-2 border text-sm items-center
              border-yellow border-opacity-25 
              hover:drop-shadow-[0_0_4px_rgba(0,255,255,0.4)]`}
          onMouseEnter={() => setToolsOpen(true)}
          onMouseLeave={() => setToolsOpen(false)}>
          <AiOutlineTool size={27} className="scale-x-[-1]" />
          <p className="opacity-80">Tools</p>
        </div>
      </div>
      <div
        className={`transition-all text-green font-aptos font-light border-green border ${
          toolsOpen ? "opacity-100" : "opacity-0"
        }  w-max bg-[#191917] bg-opacity-60 rounded-md py-3 px-4 mt-5 relative cursor-default flex items-center justify-center`}>
        <div className="md:flex grid grid-cols-3 grid-rows-2 md:gap-x-8 gap-x-6 gap-y-4">
          <div className="flex flex-col items-center">
            <SiPython size={27} />
            <p className="text-xs pt-1">Python</p>
          </div>

          <div className="flex flex-col items-center">
            <SiRstudioide size={27} />
            <p className="text-xs pt-1">RStudio</p>
          </div>

          <div className="flex flex-col items-center">
            <SiPostgresql size={27} />
            <p className="text-xs pt-1">SQL</p>
          </div>

          <div className="flex flex-col items-center">
            <SiTypescript size={27} />
            <p className="text-xs pt-1">TypeScript</p>
          </div>

          <div className="flex flex-col items-center">
            <TbBrandNextjs size={27} />
            <p className="text-xs pt-1">NextJS</p>
          </div>

          <div className="flex flex-col items-center">
            <SiTailwindcss size={27} />
            <p className="text-xs pt-1">Tailwind</p>
          </div>
        </div>

        <div
          className="absolute -top-[6px] left-[165px] scale-[2.0]
                    w-0 h-0 
                    border-l-2 border-r-2 border-b-4 
                    border-transparent border-b-green"
        />
      </div>
    </div>
  );
};

export default About;
