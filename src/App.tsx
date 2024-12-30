import React from 'react';
import { BrowserRouter as Router, NavLink, Link } from 'react-router-dom';
import AnimatedRoutes from './components/Routes.tsx';
import ThreeBackground from './components/Background.tsx';

import './index.css'; 


function App() {

  return (
    <Router>
      <div className='content'>
        <div className='frame'>

          <div className='lg:flex lg:justify-between max-h-full'>
            <header className={`lg:sticky lg:top-0 lg:flex lg:min-h-screen cursor-default 
                  max-h-screen lg:w-[40%] flex-col py-2 px-4 lg:justify-between pl-[100px] pt-[100px]`}> 
              
              <div className='flex flex-col gap-14'> 
                <div className='text-[3.7rem] font-logo relative w-min'>
                <Link to={'/'}>
                  <div className='rectangle'/>
                  <h1 className='mt-[-10px]'>
                    daniel
                  </h1>
                  <h1 className='mt-[-25px]'>
                    vegara
                  </h1>
                </Link>
                </div>
                

                <nav>
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

          <main className="m-10 mr-10 flex items-end justify-end relative w-[70%] min-h-[200px]">
            <AnimatedRoutes />
          </main>
        </div>

        </div>
      </div>
      <ThreeBackground />
    </Router>
  );
}

export default App;