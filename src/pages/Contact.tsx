import React from 'react';
import { TextAnimator } from '../components/Animation.tsx';
import { Outlet, useLocation } from 'react-router-dom';
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { HiOutlineMail, HiOutlineDocumentText } from 'react-icons/hi';


const Contact = () => {
  const location = useLocation();
  const isBaseRoute = location.pathname === '/contact'; 

  return (
      <>
      {isBaseRoute ? (
        <div className='text-right w-full'>
            <ul className="w-full flex flex-col gap-10 items-end">
                <li
                    className={`font-mono text-5xl cursor-pointer w-min hover:active flex items-center gap-4`}
                    style={{ textDecoration: "underline", textDecorationColor: "white", textDecorationThickness: "3px", }}
                >
                    <a href="https://linkedin.com/in/dvegarabalsa" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
                    <TextAnimator text="linkedin" />
                    <FaLinkedin className='pb-2' />
                    </a>
                </li>

                {/* <li
                    className={`font-mono text-5xl cursor-pointer w-min hover:active flex items-center gap-4`}
                    style={{ textDecoration: "underline", textDecorationColor: "white", textDecorationThickness: "3px", }}
                >
                    <a href="https://github.com/dani-37" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
                    <TextAnimator text="github" />
                    <FaGithub className='pb-2' />
                    </a>
                </li> */}

                <li
                    className={`font-mono text-5xl cursor-pointer w-min hover:active flex items-center gap-4`}
                    style={{ textDecoration: "underline", textDecorationColor: "white", textDecorationThickness: "3px", }}
                >
                    <a href="mailto:dani+work@vegarabalsa.com" className="flex items-center gap-4">
                    <TextAnimator text="email" />
                    <HiOutlineMail className='pb-2' />
                    </a>
                </li>

                <li
                    className={`font-mono text-5xl cursor-pointer w-min hover:active flex items-center gap-4`}
                    style={{ textDecoration: "underline", textDecorationColor: "white", textDecorationThickness: "3px", }}
                >
                    <a href="/Daniel_Vegara_CV.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
                    <TextAnimator text="cv" />
                    <HiOutlineDocumentText className='pb-2' />
                    </a>
                </li>
            </ul>
        </div>
      ) : (
        <div className='mt-10 h-full w-full'>
          <Outlet /> 
        </div>
      )}
    </>
  );
};

export default Contact;