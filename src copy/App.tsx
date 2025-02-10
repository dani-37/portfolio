import React, { useEffect, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import AnimatedRoutes from "./components/Routes.tsx";
import ThreeBackground from "./components/Background.tsx";
import { Menu, X } from "lucide-react";
import ReactGA from "react-ga4";

import "./index.css";

ReactGA.initialize("G-8SZZJKC9XT");

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false); // used to throttle navigation

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const location = useLocation();
  const navigate = useNavigate();

  // Define your sequential pages in order.
  // Homepage is '/', then '/work', '/projects', and '/contact'
  const pages = ["/", "/work", "/projects", "/contact"];

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  useEffect(() => {
    let touchStartY = null; // to record initial touch position

    // Common navigation function to avoid duplication.
    const navigateByDirection = (direction) => {
      let currentIndex = pages.indexOf(location.pathname);
      if (currentIndex === -1) currentIndex = 0;

      if (direction === "down" && currentIndex < pages.length - 1) {
        setIsScrolling(true);
        navigate(pages[currentIndex + 1]);
        setTimeout(() => setIsScrolling(false), 1000); // adjust delay as needed
      } else if (direction === "up" && currentIndex > 0) {
        setIsScrolling(true);
        navigate(pages[currentIndex - 1]);
        setTimeout(() => setIsScrolling(false), 1000);
      }
    };

    // Desktop: wheel event
    const handleWheel = (e) => {
      if (isScrolling) return;
      const threshold = 50; // adjust threshold if needed
      if (Math.abs(e.deltaY) < threshold) return;

      if (e.deltaY > 0) {
        navigateByDirection("down");
      } else if (e.deltaY < 0) {
        navigateByDirection("up");
      }
    };

    // Mobile: touch events
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e) => {
      if (touchStartY === null) return;
      const touchEndY = e.changedTouches[0].clientY;
      const threshold = 50; // swipe threshold in pixels

      // A swipe up (touchStartY - touchEndY > threshold) is equivalent to scrolling down
      if (touchStartY - touchEndY > threshold && !isScrolling) {
        navigateByDirection("down");
      }
      // A swipe down (touchEndY - touchStartY > threshold) is equivalent to scrolling up
      else if (touchEndY - touchStartY > threshold && !isScrolling) {
        navigateByDirection("up");
      }
      touchStartY = null;
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isScrolling, location.pathname, navigate, pages]);

  return (
    <div>
      <div className="content">
        <div className="frame flex flex-col justify-between">
          {!isMenuOpen && (
            <div className="flex flex-col md:flex-row justify-between h-full md:h-full">
              <header
                className={`sticky top-0 flex md:min-h-screen cursor-default 
                  max-h-screen md:w-[40%] flex-col py-2 px-4 justify-between pl-6 md:pl-[100px] pb-4 md:pb-0 pt-2 md:pt-[100px]`}>
                <div className="flex flex-col gap-14">
                  <div className="text-[3.7rem] font-logo relative w-full flex justify-between ">
                    <Link to={"/"} className="scale-75 md:scale-100">
                      <div className="rectangle" />
                      <h1 className="mt-[-10px]">daniel</h1>
                      <h1 className="mt-[-25px]">vegara</h1>
                    </Link>

                    <button
                      onClick={toggleMenu}
                      className="p-8 focus:outline-none md:hidden"
                      aria-label="Toggle menu">
                      <Menu size={37} />
                    </button>
                  </div>

                  <nav className="hidden md:block">
                    <ul className="font-mono flex justify-between flex-col h-full">
                      {["about", "work", "projects", "contact"].map((path) => (
                        <li key={path}>
                          <NavLink
                            to={path === "about" ? "/" : `/${path}`}
                            className={({ isActive }) =>
                              `${isActive ? "active" : "cursor-pointer"}`
                            }>
                            <p>{path}</p>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </header>

              <main className="flex-grow relative overflow-auto md:hidden">
                <div className="layout-preserve pb-10 px-6 fade-edge">
                  <AnimatedRoutes />
                </div>
              </main>

              <main className="hidden md:flex m-10 items-end justify-end relative md:w-[70%] min-h-[200px]">
                <AnimatedRoutes />
              </main>
            </div>
          )}

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="absolute top-0 left-0 w-full h-full z-50 flex flex-col items-center justify-center">
              <button
                onClick={toggleMenu}
                className="absolute top-[5.5rem] right-12 focus:outline-none"
                aria-label="Close menu">
                <X size={40} />
              </button>
              <ul className="font-mono flex flex-col gap-4">
                {["about", "work", "projects", "contact"].map((path) => (
                  <li key={path}>
                    <NavLink
                      to={path === "about" ? "/" : `/${path}`}
                      onClick={toggleMenu} // Close menu on link click
                      className={({ isActive }) =>
                        `${isActive ? "active" : "cursor-pointer"}`
                      }>
                      <p className=" text-4xl">{path}</p>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <ThreeBackground />
    </div>
  );
}

export default App;
