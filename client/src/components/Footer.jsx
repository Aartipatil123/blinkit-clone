import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row items-center justify-between gap-4 text-center">
        
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} All Rights Reserved
        </p>

        <div className="flex items-center gap-5 text-xl">
          <a href="#" className="hover:text-blue-600 transition">
            <FaFacebook />
          </a>
          <a href="#" className="hover:text-pink-500 transition">
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-blue-500 transition">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;