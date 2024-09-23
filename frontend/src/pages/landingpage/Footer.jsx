import React from "react";
import {
  FaDribbbleSquare,
  FaFacebookSquare,
  FaGithubSquare,
  FaInstagram,
  FaTwitterSquare,
} from "react-icons/fa";

const Footer = () => {
  return (
    <div className="w-full py-16 px-4 bg-black text-gray-300">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h1 className="text-3xl font-bold text-[#00df9a]">ACEINTERVIEW.</h1>
          <p className="py-4">
            AceInterview revolutionizes the way you prepare for your next job
            interview with tailored, real-time simulation feedback.
          </p>
          <div className="flex justify-around md:justify-between md:w-[75%] my-6">
            <FaFacebookSquare size={30} />
            <FaInstagram size={30} />
            <FaTwitterSquare size={30} />
            <FaGithubSquare size={30} />
            <FaDribbbleSquare size={30} />
          </div>
        </div>
        <div className="flex justify-between flex-wrap col-span-2">
          <div>
            <h6 className="font-medium text-gray-400">Support</h6>
            <ul>
              <li className="py-2 text-sm">
                <a href="#" className="hover:text-white">
                  Help Center
                </a>
              </li>
              <li className="py-2 text-sm">
                <a href="#" className="hover:text-white">
                  Documentation
                </a>
              </li>
              <li className="py-2 text-sm">
                <a href="#" className="hover:text-white">
                  Community Forums
                </a>
              </li>
              <li className="py-2 text-sm">
                <a href="#" className="hover:text-white">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="font-medium text-gray-400">Company</h6>
            <ul>
              <li className="py-2 text-sm">
                <a href="#" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li className="py-2 text-sm">
                <a href="#" className="hover:text-white">
                  Careers
                </a>
              </li>
              <li className="py-2 text-sm">
                <a href="#" className="hover:text-white">
                  Press
                </a>
              </li>
              <li className="py-2 text-sm">
                <a href="#" className="hover:text-white">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="font-medium text-gray-400">Legal</h6>
            <ul>
              <li className="py-2 text-sm">
                <a href="#" className="hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li className="py-2 text-sm">
                <a href="#" className="hover:text-white">
                  Terms of Use
                </a>
              </li>
              <li className="py-2 text-sm">
                <a href="#" className="hover:text-white">
                  Licensing
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
