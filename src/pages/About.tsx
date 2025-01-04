import React from 'react';
import { TextAnimator } from '../components/Animation.tsx';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { HiOutlineDocumentText, HiOutlineMail } from 'react-icons/hi';
import Tooltip from '@mui/material/Tooltip';

const About = () => {
  return (
    <div className='text-right md:w-2/3 flex flex-col justify-end items-end cursor-default'>
      <h1 className='font-mono text-2xl'>
        <p > 
          <TextAnimator text='I use data to focus'/> 
        </p> 
        <p>
          <TextAnimator text='on the climate crisis'/>
        </p>
      </h1>

      <div className='h-[2px] w-full bg-white my-3'/>

      <div className='space-y-3 font-aptos md:text-[1.15rem]'>
        <p>
        I am a statistician focused on sustainable development. I transform data into climate action by blending analysis, visualizations, and sustainability strategy.</p>
        <p>
        I hold an MSCi from Imperial College London in Mathematics and Statistics. Currently, I work for <a href='https:/klere.uk/' target="_blank" rel="noopener noreferrer" className="font-semibold" >Klere</a> (a sustainability consultancy) while completing an MSc in AI for Sustainable Development at UCL. 
        </p>
      </div>

      <div className="flex justify-between w-[180px] mt-5">
        <Tooltip arrow title={<p className='font-mono'> LinkedIn </p>}>
          <a
            href="https://linkedin.com/in/dvegarabalsa"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-black transition-all"
          >
            <FaLinkedin size={27} />
          </a>
        </Tooltip>

        {/* <Tooltip arrow title={<p className='font-mono'> GitHub </p>} classes={{ tooltip: 'font-mono' }}>
          <a
            href="https://github.com/dani-37"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:text-black transition-all"
          >
            <FaGithub size={27} />
          </a>
        </Tooltip> */}

        <Tooltip arrow title={<p className='font-mono'> Mail </p>} >
          <a
            href="mailto:dani+work@vegarabalsa.com"
            className="text-gray-800 hover:text-black transition-all"
          >
            <HiOutlineMail size={27} />
          </a>
        </Tooltip>

        <Tooltip arrow title={<p className='font-mono'> CV </p>} >
          <a
            href="/Daniel_Vegara_CV.pdf"
            className="text-gray-800 hover:text-black transition-all"
          >
            <HiOutlineDocumentText size={27} />
          </a>
        </Tooltip>

    </div>
    </div>
  );
};

export default About;