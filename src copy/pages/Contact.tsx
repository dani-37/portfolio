import React from "react";
import { TextAnimator } from "../components/Animation.tsx";
import { Outlet, useLocation } from "react-router-dom";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { HiOutlineMail, HiOutlineDocumentText } from "react-icons/hi";

const Contact = () => {
  const location = useLocation();
  const isBaseRoute = location.pathname === "/contact";

  return (
    <>
      {isBaseRoute ? (
        <div className="text-right w-full">
          <div className="md:hidden font-mono text-3xl w-full border-b-2 mb-12">
            Contact
          </div>

          <ul className="w-full flex flex-col gap-10 items-end">
            <li
              className={`font-mono text-5xl cursor-pointer w-min hover:active flex items-center gap-4`}>
              <a
                href="https://linkedin.com/in/dvegarabalsa"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4"
                style={{
                  textDecoration: "underline",
                  textDecorationColor: "white",
                  textDecorationThickness: "3px",
                }}>
                <TextAnimator text="linkedin" />
                <FaLinkedin className="pb-2" />
              </a>
            </li>

            {/* <li className={`font-mono text-5xl cursor-pointer w-min hover:active flex items-center gap-4`} >
                    <a href="https://github.com/dani-37" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4"
                    style={{ textDecoration: "underline", textDecorationColor: "white", textDecorationThickness: "3px", }}>
                    <TextAnimator text="github" />
                    <FaGithub className='pb-2' />
                    </a>
                </li> */}

            <li
              className={`font-mono text-5xl cursor-pointer w-min hover:active flex items-center gap-4`}>
              <a
                href="mailto:dani+work@vegarabalsa.com"
                className="flex items-center gap-4"
                style={{
                  textDecoration: "underline",
                  textDecorationColor: "white",
                  textDecorationThickness: "3px",
                }}>
                <TextAnimator text="email" />
                <HiOutlineMail className="pb-2" />
              </a>
            </li>

            <li className="font-mono text-5xl cursor-pointer w-min hover:active flex items-center gap-4">
              <a
                href="/Daniel_Vegara_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4"
                style={{
                  textDecoration: "underline",
                  textDecorationColor: "white",
                  textDecorationThickness: "3px",
                }}
                // onClick={(e) => {
                //     e.preventDefault();
                //     window.open('/Daniel_Vegara_CV.pdf', '_blank', 'noopener,noreferrer');
                //     const link = document.createElement('a');
                //     link.href = '/Daniel_Vegara_CV.pdf';
                //     link.download = 'Daniel_Vegara_CV.pdf';
                //     link.click();
                // }}
              >
                <TextAnimator text="cv" />
                <HiOutlineDocumentText className="pb-2" />
              </a>
            </li>
          </ul>
        </div>
      ) : (
        <div className="mt-10 h-full w-full">
          <Outlet />
        </div>
      )}
    </>
  );
};

export default Contact;
