import React, { useState } from "react";
import { TextAnimator } from "./Animation.tsx";

function Sections({ sections, activeSection, scrollToSection }) {
  const [hovered, setHovered] = useState(null);

  return (
    <ul className="flex flex-col justify-between h-full text-right z-50">
      {sections.map((section) => (
        <li
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          onMouseEnter={() => setHovered(section.id)}
          onMouseLeave={() => setHovered(null)}
          className={`cursor-pointer relative font-mono ml-12 flex justify-end pointer-events-auto h-16 items-center
            ${activeSection === section.id ? "opacity-100" : "opacity-40"}`}>
          <span
            className={`${
              activeSection === section.id && "lg:text-2xl text-xl -mt-[5px]"
            }`}>
            {activeSection === section.id || hovered === section.id ? (
              <TextAnimator text={section.title} />
            ) : (
              section.number
            )}
          </span>

          <span
            className={`absolute left-full ml-8 transition-opacity
              duration-300 font-mono pointer-events-none
              ${activeSection === section.id ? "opacity-100" : "opacity-0"}`}>
            {section.number}
          </span>

          <div
            className={`absolute left-full duration-300 font-mono pointer-events-none
               drop-shadow-lg border transition-all
              ${
                activeSection === section.id
                  ? "bg-green w-[9px] h-[9px] ml-[12px] rounded-full"
                  : "bg-yellow w-1 h-[1px] ml-[12px] rounded-none"
              }`}
          />
        </li>
      ))}
    </ul>
  );
}

export default Sections;
