import React from "react";
import { GoBell } from "react-icons/go";

const Header = () => {
  return (
    <div className="w-full bg-gray-100 shadow-lg p-4 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-indigo-800">Welcome Back!</h1>
        <p className="ml-3 text-xl font-semibold text-gray-700">Alexia</p>
      </div>
      <div className="flex items-center space-x-5">
        <div className="hidden md:flex">
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-200 px-4 py-2 rounded-lg focus:outline-0 focus:ring-2 focus:ring-indigo-600"
          />
        </div>
        <div className="flex items-center space-x-5">
          <button className="relative text-gray-600 hover:text-indigo-600 transition">
            <GoBell size={28} />
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex justify-center items-center bg-red-600 text-white font-semibold text-[10px] w-5 h-4 rounded-full border-2 border-white">
              9
            </span>
          </button>
          <img
            className="w-10 h-10 rounded-full border-4 border-indigo-400"
            src="https://randomuser.me/api/portraits/women/50.jpg"
            alt="User Profile"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
