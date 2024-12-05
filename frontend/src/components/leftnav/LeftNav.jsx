import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import videocall from '../../assets/video-call.png'
import {
  LuBarChart4,
  LuHome,
  LuMenu,
  LuSettings,
  LuUser2,
  LuMail,
  LuChevronDown,
  LuChevronUp,
  LuBookMarked,
  LuLanguages,
  LuClipboard,
  LuBookCopy
} from "react-icons/lu";
import { MdOutlineQuiz } from "react-icons/md";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isInterviewOpen, setIsInterviewOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const toggleInterviewMenu = () => setIsInterviewOpen(!isInterviewOpen);

  const routes = [
    { path: "/dashboard/overview", name: "Overview", icon: <LuHome /> },
    {
      name: "Interview",
      icon: <LuBookCopy/>,
      submenu: [
        { path: "/dashboard/behavioral-interviews", name: "Behavioral" },
        { path: "/dashboard/technical", name: "Technical" },
      ],
    },

    {path:"/dashboard/language-test" ,name:"Language Test",icon:<LuLanguages/>},
    { path: "/dashboard/quizes", name: "Quizes", icon: <MdOutlineQuiz /> },
    { path: "/dashboard/preperation", name: "Preperation Hub", icon: <LuClipboard /> },
    { path: "/dashboard/profile", name: "Profile", icon: <LuUser2 /> },
    { path: "/dashboard/results", name: "Results", icon: <LuBookMarked /> },

  ];

  return (
    <motion.div
      className="bg-gradient-to-tl from-teal-400 to-green-900 text-white h-screen flex flex-col relative"
      animate={{ width: isOpen ? "200px" : "45px" }}
      transition={{ duration: 0.5, type: "spring", damping: 10 }}
    >
      <div className="flex items-center justify-between p-6">
        <LuMenu
          onClick={toggle}
          className="text-xl cursor-pointer absolute left-4 top-5.5"
        />
        {isOpen && (
          <motion.div
          className="flex items-center ml-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* <img
            src={logo}
            alt="AceInterview Logo"
            className="w-5 h-6 mr-3" // Adjust size and margin as needed
          /> */}
          <motion.h1 className="text-xl leading-none font-bold">
            AceInterview
          </motion.h1>
        </motion.div>
        )}
      </div>
      <nav className="mt-8 space-y-1 flex-grow">
        {routes.map((route, index) => {
          if (route.submenu) {
            return (
              <div key={index} className="flex flex-col">
                <button
                  onClick={toggleInterviewMenu}
                  className={`flex items-center justify-between gap-4 p-4 border-r-4 transition-colors duration-200 ease-in-out text-sm ${
                    isInterviewOpen
                      ? "bg-green-700 border-green-300"
                      : "border-transparent hover:border-green-300 hover:bg-green-700"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {route.icon}
                    {isOpen && (
                      <div className="whitespace-nowrap">{route.name}</div>
                    )}
                  </div>
                  {isOpen && (
                    <div>
                      {isInterviewOpen ? <LuChevronUp /> : <LuChevronDown />}
                    </div>
                  )}
                </button>
                <AnimatePresence>
                  {isInterviewOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="flex flex-col ml-8"
                    >
                      {route.submenu.map((submenuItem, idx) => (
                        <NavLink
                          key={idx}
                          to={submenuItem.path}
                          className="flex items-center gap-4 p-2 transition-colors duration-200 ease-in-out hover:bg-green-600 text-sm"
                        >
                          {submenuItem.name}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }
          return (
            <NavLink
              key={index}
              to={route.path}
              className={({ isActive }) =>
                `flex items-center gap-4 p-4 border-r-4 transition-colors duration-200 ease-in-out text-sm ${
                  isActive
                    ? "bg-green-700 border-green-300"
                    : "border-transparent hover:border-green-300 hover:bg-green-700"
                }`
              }
            >
              <div>{route.icon}</div>
              {isOpen && <div className="whitespace-nowrap">{route.name}</div>}
            </NavLink>
          );
        })}
      </nav>
    </motion.div>
  );
};

export default Sidebar;
