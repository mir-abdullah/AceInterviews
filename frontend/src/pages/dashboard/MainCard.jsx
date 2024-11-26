import React from "react";
import { AiOutlineClockCircle, AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoIosThumbsUp } from "react-icons/io";
import { FaGlobeAmericas } from "react-icons/fa";
import { motion } from "framer-motion";

const MainCard = () => {
  return (
    <motion.div
      className="p-8 bg-white rounded-xl shadow-lg transition-shadow hover:shadow-2xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h1 className="text-3xl font-bold text-neutralDGrey mb-6">
        Interview Insights
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PlatformStatistic
          count={8}
          icon={<AiOutlineUsergroupAdd />}
          metric="Total Interviews"
        />
        <PlatformStatistic
          count="27 min"
          icon={<AiOutlineClockCircle />}
          metric="Avg. Duration"
        />
        <PlatformStatistic
          count="92%"
          icon={<IoIosThumbsUp />}
          metric="Satisfaction Rate"
        />
        <PlatformStatistic
          count="Web & Mobile"
          icon={<FaGlobeAmericas />}
          metric="Accessibility"
        />
      </div>
    </motion.div>
  );
};

const PlatformStatistic = ({ count, icon, metric }) => (
  <motion.div
    className="bg-neutralSilver p-5 rounded-lg flex items-center justify-between hover:bg-brandPrimary transition-all duration-300 shadow-sm hover:shadow-lg"
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center space-x-4">
      <span className="text-4xl text-brandPrimary">{icon}</span>
      <span className="text-lg font-semibold text-neutralGrey">{metric}</span>
    </div>
    <motion.h1
      className="text-4xl font-bold text-neutralBlack"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {count}
    </motion.h1>
  </motion.div>
);

export default MainCard;
