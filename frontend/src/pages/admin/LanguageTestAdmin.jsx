import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LanguageTestAdmin = () => {
  const navigate = useNavigate();

  const navigateToStage = (stage) => {
    navigate(`/admin/language-test/stage${stage}Questions`);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Language Test Admin</h1>
      <div className="flex flex-col gap-6">
        {/* Button for Stage 1 */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-tl from-teal-400 to-green-900 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700"
          onClick={() => navigateToStage(1)}
        >
          View Stage 1 Questions
        </motion.button>
        {/* Button for Stage 2 */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-tl from-teal-400 to-green-900 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700"
          onClick={() => navigateToStage(2)}
        >
          View Stage 2 Questions
        </motion.button>
        {/* Button for Stage 3 */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-tl from-teal-400 to-green-900 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700"
          onClick={() => navigateToStage(3)}
        >
          View Stage 3 Questions
        </motion.button>
      </div>
    </div>
  );
};

export default LanguageTestAdmin;
