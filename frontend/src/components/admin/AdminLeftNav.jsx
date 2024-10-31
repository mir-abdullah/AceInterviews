/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LuBarChart4,
  LuHome,
  LuMenu,
  LuSettings,
  LuUser2,
  LuMail,
  LuChevronDown,
  LuChevronUp,
} from "react-icons/lu";

const AdminLeftNav = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isInterviewOpen, setIsInterviewOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const toggleInterviewMenu = () => setIsInterviewOpen(!isInterviewOpen);

  const routes = [
    { path: "/admin/overview", name: "Overview", icon: <LuHome /> },
    {
      name: "Interview",
      icon: <LuUser2 />,
      submenu: [
        { path: "/admin/behavioraladmin", name: "Behavioral" },
        { path: "/admin/technicaladmin", name: "Technical" },
      ],
    },
    { path: "/admin/quizes", name: "Quizes", icon: <LuMail /> },
    { path: "/admin/reviewfeedback", name: "Feedback", icon: <LuBarChart4 /> },
    { path: "/admin/profileadmin", name: "Profile", icon: <LuSettings /> },
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
          <motion.h1 className="text-xl leading-none ml-8">
            AceInterview
          </motion.h1>
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

export default AdminLeftNav;
