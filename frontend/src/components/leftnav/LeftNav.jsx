import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LuLogOut } from "react-icons/lu";
import { useDispatch } from "react-redux";
import {
  LuBarChart4,
  LuHome,
  LuMenu,
  LuSettings,
  LuUser2,
  LuMail,
  LuChevronDown,
  LuChevronUp,
  LuActivity,
  LuBookMarked,
} from "react-icons/lu";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  Typography,
} from "@mui/material";
import { logoutUser } from "../../redux/slices/user/user.slice.js"; // Import logoutUser action
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isInterviewOpen, setIsInterviewOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggle = () => setIsOpen(!isOpen);
  const toggleInterviewMenu = () => setIsInterviewOpen(!isInterviewOpen);

  const handleLogout = () => {
    // Close the modal and navigate to the landing page
    setLogoutModalOpen(false);
    dispatch(logoutUser()); // Dispatch logout action
    navigate("/");
    // Close profile menu after logout
  };

  const routes = [
    { path: "/dashboard/overview", name: "Overview", icon: <LuHome /> },
    {
      name: "Interview",
      icon: <LuUser2 />,
      submenu: [
        { path: "/dashboard/behavioral-interviews", name: "Behavioral" },
        { path: "/dashboard/technical", name: "Technical" },
      ],
    },
    { path: "/dashboard/quizes", name: "Quizes", icon: <LuMail /> },
    {
      path: "/dashboard/language-proficiency",
      name: "language Proficieny ",
      icon: <LuActivity />,
    },
    { path: "/dashboard/profile", name: "Profile", icon: <LuBarChart4 /> },
    { path: "/dashboard/results", name: "Results", icon: <LuBookMarked /> },
    // { path: "/settings", name: "Settings", icon: <LuSettings /> },
  ];
  // bg-gradient-to-tl from-teal-400 to-green-900
  return (
    <motion.div
      className="bg-gradient-to-tl from-teal-400 to-green-800 text-white h-screen flex flex-col relative"
      animate={{ width: isOpen ? "250px" : "45px" }}
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
            <motion.h1
              className="text-2xl leading-none font-bold" // Increased font size and weight
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            >
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
                  className={`flex items-center justify-between gap-4 p-4 border-r-4 transition-colors duration-200 ease-in-out text-lg font-semibold ${
                    // Increased text size and weight
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
                          className="flex items-center gap-4 p-3 transition-colors duration-200 ease-in-out hover:bg-green-600 text-lg font-medium" // Increased text size and weight
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
                `flex items-center gap-4 p-4 border-r-4 transition-colors duration-200 ease-in-out text-lg font-semibold ${
                  // Increased text size and weight
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

      {/* Logout Button */}
      <div className="flex items-center justify-center p-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition-all w-full text-lg font-semibold" // Increased padding and text size
          onClick={() => setLogoutModalOpen(true)} // Open modal on logout click
        >
          <LuLogOut className="text-2xl" /> {/* Increased icon size */}
          {isOpen && <span>Logout</span>}
        </motion.button>
      </div>

      {/* Logout Confirmation Modal */}
      <Dialog
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        aria-labelledby="logout-dialog-title"
        PaperProps={{
          style: {
            borderRadius: "12px", // Rounded corners
            padding: "20px", // Internal padding
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Softer shadow
          },
        }}
        TransitionComponent={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <DialogTitle
          id="logout-dialog-title"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.5rem",
            color: "#4D4D4D", // Dark grey color to maintain readability
          }}
        >
          Confirm Logout
        </DialogTitle>

        <DialogContent
          sx={{
            textAlign: "center",
            padding: "16px 24px",
            backgroundColor: "#f5f7fa", // Light grey background for contrast
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.125rem",
              color: "#717171", // Slightly lighter text color for description
            }}
          >
            Are you sure you want to log out?
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 2, // Adding space between buttons
            padding: "16px 24px",
          }}
        >
          <Button
            onClick={() => setLogoutModalOpen(false)}
            variant="outlined"
            sx={{
              borderColor: "#4CAF50", // Matching brand color
              color: "#4CAF50",
              borderRadius: "8px",
              padding: "8px 16px",
              fontSize: "1rem", // Increased font size
              "&:hover": {
                borderColor: "#388E3C",
                color: "#388E3C",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleLogout}
            variant="contained"
            sx={{
              backgroundColor: "#D32F2F",
              color: "#fff",
              borderRadius: "8px",
              padding: "8px 16px",
              fontSize: "1rem", // Increased font size
              "&:hover": {
                backgroundColor: "#C62828",
              },
            }}
          >
            Yes, Logout
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default Sidebar;
