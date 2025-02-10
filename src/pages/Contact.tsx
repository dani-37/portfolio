import React from "react";
import { TextAnimator } from "../components/Animation.tsx";
import { FiArrowUpRight } from "react-icons/fi";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { HiOutlineMail, HiOutlineDocumentText } from "react-icons/hi";

const ContactItem = ({
  name,
  icon,
  link,
}: {
  name: string;
  icon: any;
  link: string;
}) => {
  return (
    <div className="flex text-5xl md:text-6xl font-aptos cursor-pointer text-yellow group max-w-[430px] opacity-80 hover:opacity-100">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-5"
        style={{
          textDecoration: "underline",
          textDecorationColor: "#00e04b",
          textDecorationThickness: "3px",
        }}>
        <div className="group-hover:text-green drop-shadow-[0_0_4px_rgba(255,255,0,0.6)]">
          {icon}
        </div>
        <div className="group-hover:text-green font-normal tracking-wider">
          {name}
        </div>
      </a>
    </div>
  );
};

const Contact = () => {
  return (
    <div className="space-y-12">
      <p className="md:hidden font-aptos text-5xl md:text-6xl  -mt-8 mb-16 font-medium tracking-wider text-green">
        Contact
      </p>
      <ContactItem
        name="LinkedIn"
        icon={<FaLinkedin />}
        link="https://linkedin.com/in/dvegarabalsa"
      />
      <ContactItem
        name="Mail"
        icon={<HiOutlineMail />}
        link="mailto:dani+work@vegarabalsa.com"
      />
      <ContactItem
        name="Resume"
        icon={<HiOutlineDocumentText />}
        link="/Daniel_Vegara_CV.pdf"
      />
    </div>
  );
};

export default Contact;
