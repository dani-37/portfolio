import React, { useEffect, useRef, useState } from "react";
import ThreeBackground from "./components/Background.tsx";

import "./index.css";
import About from "./pages/About.tsx";
import Work from "./pages/Work.tsx";
import Sections from "./components/NavBar.tsx";
import Projects from "./pages/Projects.tsx";
import Contact from "./pages/Contact.tsx";

const sections = [
  { number: "1", title: "Home", id: "home" },
  { number: "2", title: "Work", id: "work" },
  { number: "3", title: "Projects", id: "projects" },
  { number: "4", title: "Contact", id: "contact" },
];

function App() {
  const [activeSection, setActiveSection] = useState("home");

  // Update active section based on scroll position
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.5,
    });

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Nav */}
      <aside
        className="fixed top-0 left-0 w-[28.57vw] h-screen 
                   hidden md:flex items-center
                   overflow-hidden pointer-events-none">
        <div
          className="border-r-[1.5px] w-3/5 h-[75vh] border-yellow
                     py-[15vh] flex flex-col justify-between items-end pr-4">
          <Sections
            sections={sections}
            activeSection={activeSection}
            scrollToSection={scrollToSection}
          />
        </div>
      </aside>

      <div className="md:ml-[28.57vw] ml-[5vw]">
        {/* HOME */}
        <section
          id="home"
          className="mb-[24vh] md:pt-[30vh] pt-[25vh]
                     md:w-[43vw] max-w-[90vw] md:max-w-[550px]">
          <About />
        </section>

        {/* WORK */}
        <section
          id="work"
          className="min-h-screen flex flex-col justify-center">
          <Work />
        </section>

        {/* PROJECTS */}
        <section
          id="projects"
          className="min-h-screen flex flex-col justify-center">
          <Projects />
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className="min-h-screen flex flex-col justify-center">
          <Contact />
        </section>
      </div>

      <ThreeBackground />
    </>
  );
}

export default App;
