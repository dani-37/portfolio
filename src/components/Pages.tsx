import React, { useEffect, useRef } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';
import { TextAnimator } from './Animation.tsx';
import { GoArrowUpRight } from 'react-icons/go';


const Page = ({ title, description, content, link, dates, page='work' }: 
    { title: string; description: string; content: React.ReactNode; link?: string; dates: string, page?: string }) => {
    const scrollableDivRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const preventBodyScroll = (e: Event) => e.preventDefault();
    
        const syncScroll = (e: WheelEvent) => {
          const scrollableDiv = scrollableDivRef.current;
          if (scrollableDiv) { scrollableDiv.scrollTop += e.deltaY; }
        };
    
        // Disable native page scrolling
        window.addEventListener('wheel', preventBodyScroll, { passive: false });
    
        // Add custom scrolling logic
        window.addEventListener('wheel', syncScroll);
    
        return () => {
          // Clean up event listeners
          window.removeEventListener('wheel', preventBodyScroll);
          window.removeEventListener('wheel', syncScroll);
        };
    }, []);
  
    return (
      <div className="relative w-full max-h-[85vh] overflow-visible flex flex-col cursor-default">
        <div className="flex gap-[12px] -ml-[4.45rem] items-center">
            <Tooltip title={<p className='font-mono'> Back </p>} placement="left">
                <Link to={'/' + page} className="w-14 h-10 group flex items-center cursor-pointer">
                    <p className="text-[2.7rem] w-16 ml-3 mb-3 group-hover:ml-2 transition-all cursor-pointer pointer-events-none text-gray-800 opacity-70 group-hover:opacity-100" >
                        {'<'}
                    </p>
                </Link>
            </Tooltip>

            <h2 className="font-mono text-[3.5rem] flex justify-between w-full h-max items-end">
                <TextAnimator text={title} />
                <div className='w-full h-full flex justify-end min-h-full text-base pr-[20px] text-gray-800 mb-8'>
                    {dates}
                </div>
            </h2>
        </div>
      
        <p className="text-xl font-mono text-gray-800">
          {description}
          {link && (
            <Tooltip title={<p className='font-mono'> Go to site </p>} placement="right">
              <a
                href={link} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center ml-1 translate-y-1 text-white opacity-70 hover:opacity-100 hover:scale-110"
              >
                <GoArrowUpRight className="ml-1 -mb-4" />
              </a>
            </Tooltip>
          )}
        </p>
            
        <div className="h-[1px] w-full bg-white mt-4" />
    
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar fade-edge" ref={scrollableDivRef}>
          <div className="text-gray-600 text-[1.1rem] font-aptos py-5">
            {content}
          </div>
        </div>

      </div>
    );
  };

export default Page