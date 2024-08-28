import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LuBarChart4,
  LuHome,
  LuMenu,
  LuSearch,
  LuSettings,
  LuUser2,
  LuMail,
  LuChevronDown,
  LuChevronUp,
} from "react-icons/lu";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isInterviewOpen, setIsInterviewOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const toggleInterviewMenu = () => setIsInterviewOpen(!isInterviewOpen);

  const routes = [
    { path: "/dashboard/overview", name: "Overview", icon: <LuHome /> },
    {
      name: "Interview",
      icon: <LuUser2 />,
      submenu: [
        { path: "/dashboard/behavioral", name: "Behavioral" },
        { path: "/dashboard/technical", name: "Technical" },
      ],
    },
    { path: "/dashboard/quizes", name: "Quizes", icon: <LuMail /> },
    { path: "/analytics", name: "Reports", icon: <LuBarChart4 /> },
    { path: "/settings", name: "Settings", icon: <LuSettings /> },
  ];

  return (
    <motion.div
      className="bg-gradient-to-tl from-teal-400 to-green-900 text-white h-screen flex flex-col"
      animate={{ width: isOpen ? "200px" : "45px" }}
      transition={{ duration: 0.5, type: "spring", damping: 10 }}
    >
      <div className="flex items-center justify-between p-6">
        <LuMenu onClick={toggle} className="text-xl cursor-pointer" />
        {isOpen && (
          <motion.h1 className="text-xl leading-none">AceInterview</motion.h1>
        )}
      </div>
      {isOpen && (
        <div className="flex items-center mt-5 mb-5 p-2">
          <LuSearch />
          <motion.input
            type="text"
            placeholder="Search"
            initial={{ width: 0 }}
            animate={{ width: "full" }}
            className="ml-2 bg-gray-200 text-black placeholder-gray-700 focus:outline-none"
          />
        </div>
      )}
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
