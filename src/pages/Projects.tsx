import React from 'react';
import { TextAnimator } from '../components/Animation.tsx';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Project = ({name, description}:{name:string, description:string}) => {
    return(
      <div className='flex flex-col items-end'>
        <Link to={name.replace(/\s+/g, '-')} className='cursor-pointer group'>
            <ul className='w-full flex justify-end'>
            <li className='font-mono text-3xl w-min group-hover:underline group-hover:cursor-pointer group-hover:italic group-hover:translate-x-1 text-nowrap'
              style={{ textDecoration: 'underline', textDecorationColor: 'white', textDecorationThickness: '3px' }}>
              <TextAnimator text={name} />
            </li>
             
            </ul>
            <p className='-mt-1 font-aptos text-lg'>
              {description}
            </p>
        </Link>
      </div>
    )
}

const Projects = () => {
  const location = useLocation();
  const isBaseRoute = location.pathname === '/projects'; 

  return (
      <>
      {isBaseRoute ? (
        <div className='text-right w-full space-y-10 '>
          <Project name='nature footprints' description='modelling / sustainability' />
          <Project name='movie decider' description='python / graph theory' />
          {/* <Project name='time series AI' description='ML / big data' /> */}
          <Project name='web development' description='typescript / tailwind' />
          {/* <Project name='fundraiser' description='project management' /> */}
        </div>
      ) : (
        <div className='mt-10 h-full w-full'>
          <Outlet /> 
        </div>
      )}
    </>
  );
};

export default Projects;