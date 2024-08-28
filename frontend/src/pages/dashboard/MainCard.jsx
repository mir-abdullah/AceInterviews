import React from "react";
// Icons
import { AiOutlineClockCircle, AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoIosThumbsUp } from "react-icons/io";
import { FaGlobeAmericas } from "react-icons/fa";

const MainCard = () => {
  return (
    <div className="p-5 bg-white rounded-xl shadow-lg transition-shadow hover:shadow-xl">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">
        Interview Insights
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PlatformStatistic
          count={158}
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
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const PlatformStatistic = ({ count, icon, metric }) => (
  <div className="space-y-2 text-gray-500">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="text-3xl">{icon}</span>
        <span className="text-xl font-semibold">{metric}</span>
      </div>
      <h1 className="text-3xl font-bold">{count}</h1>
    </div>
  </div>
);

export default MainCard;
