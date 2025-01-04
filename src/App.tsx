import React, { useState } from 'react';
import { BrowserRouter as Router, NavLink, Link } from 'react-router-dom';
import AnimatedRoutes from './components/Routes.tsx';
import ThreeBackground from './components/Background.tsx';
import { Menu, X } from 'lucide-react';

import './index.css'; 


function App() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);


  return (
    <Router>
      <div className='content'>
        <div className='frame flex flex-col justify-between'>

          {!isMenuOpen && 
            <div className='flex flex-col md:flex-row justify-between h-full md:h-full'>
            <header className={`sticky top-0 flex md:min-h-screen cursor-default
                  max-h-screen md:w-[40%] flex-col py-2 px-4 justify-between pl-10 md:pl-[100px] pb-6 md:pb-0 pt-10 md:pt-[100px]`}> 
              
              <div className='flex flex-col gap-14'> 
                <div className='text-[3.7rem] font-logo relative w-full flex justify-between'>
                  <Link to={'/'}>
                    <div className='rectangle'/>
                    <h1 className='mt-[-10px]'>
                      daniel
                    </h1>
                    <h1 className='mt-[-25px]'>
                      vegara
                    </h1>
                  </Link>


                  <button
                    onClick={toggleMenu}
                    className="p-8 focus:outline-none md:hidden"
                    aria-label="Toggle menu"
                  >
                    <Menu size={37} />
                  </button>
                </div>
                
                <nav className='hidden md:block'>
                <ul className='font-mono flex justify-between flex-col h-full'>
                    {["about", "work", "projects", "contact"].map((path) => (
                      <li key={path}>
                        <NavLink 
                          to={path==='about' ? '/':`/${path}`} 
                          className={({ isActive }) => `${isActive ? "active" : 'cursor-pointer'}` }
                        >
                          <p>{path}</p>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </nav>
              
              </div>
            </header>

            <main className="flex-grow relative overflow-auto md:hidden">
              <div className="layout-preserve pb-10 px-6">
                <AnimatedRoutes />
              </div>
            </main>


            <main className='hidden md:flex m-10 items-end justify-end relative md:w-[70%] min-h-[200px]'>
              <AnimatedRoutes />
            </main>
            </div>
          }

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="absolute top-0 left-0 w-full h-full z-50 flex flex-col items-center justify-center">
              <button
                onClick={toggleMenu}
                className="absolute top-[5.5rem] right-12 focus:outline-none"
                aria-label="Close menu"
              >
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
                      }
                    >
                      <p className=' text-4xl'>{path}</p>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
    </div>
    </div>
          
      <ThreeBackground />
    </Router>
  );
}

export default App;