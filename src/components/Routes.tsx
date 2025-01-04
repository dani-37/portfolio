import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import About from '../pages/About.tsx'

import Work from '../pages/Work.tsx';
import Klere from '../pages/work/Klere.tsx';
import Graphext from '../pages/work/Graphext.tsx';
import Toolip from '../pages/work/Toolip.tsx';

import Projects from '../pages/Projects.tsx';
import Movies from '../pages/projects/Movies.tsx';
import Footprints from '../pages/projects/Footprints.tsx';
import Contact from '../pages/Contact.tsx';
import Webs from '../pages/projects/Webs.tsx';


function AnimatedRoutes() {
    const location = useLocation();
    const isPhone = () => {
      return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
    };

    return (
      <TransitionGroup component={null}> 
        <CSSTransition
          key={location.pathname} 
          timeout={isPhone() ? 0 : 1000}
          classNames="fade"
        >
          <Routes location={location}>
            <Route path="" element={<About />} />
  
            <Route path="work" element={<Work />}>
              <Route path="klere" element={<Klere />} />
              <Route path="graphext" element={<Graphext />} />
              <Route path="toolip" element={<Toolip />} />
            </Route>
  
            <Route path="projects" element={<Projects />} >
              <Route path='movie-decider' element={<Movies />} />
              <Route path='nature-footprints' element={<Footprints />} />
              <Route path='web-development' element={<Webs />} />
            </Route>

            <Route path='contact' element={<Contact />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    );
  }

export default AnimatedRoutes