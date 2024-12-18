import React, { useState, useEffect } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { FaUserTie, FaLaptopCode, FaQuestionCircle, FaArrowLeft ,FaArrowRight } from "react-icons/fa";
import { LuLanguages } from "react-icons/lu";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBehavioralInterviewResults,
  fetchTechnicalInterviewResults,
  fetchQuizResults,
} from "../../redux/slices/results/results.slice";
import {
  getAllTestResults,
  countUserTests,
} from "../../redux/slices/languageProficiencyTest/languageTest.slice";
import language from '../../assets/languages.png'

// Render result cards with arrow button for details
const renderResults = (data, type, navigate) => {
  const sortedData = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (sortedData.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg shadow">
        <Typography variant="body1" className="text-gray-600">
          No results yet
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {sortedData.map((item) => (
        <motion.div
          key={`${type}-${item._id}`}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-4">
            <img
              src={type === "language" ? language : item.topic?.picture || language}
              alt={item.topic?.title || "Language Proficiency Test"}
              className="w-16 h-16 rounded-full object-cover shadow-md"
            />
            <div className="flex flex-col">
              <Typography variant="h6" className="text-gray-900 font-bold truncate">
                {item.topic?.title || "Language Proficiency Test"}
              </Typography>
              {/* <Typography variant="body2" className="text-neutralGrey truncate">
                {type}
              </Typography> */}
              <Typography variant="body2" className="text-neutralGrey truncate">
                {type === "behavioral"
                  ? "Behavioral Interviews"
                  : type === "technical"
                  ? "Technical Interviews"
                  : type ==="quizzes"
                   ? "Quizzes" :
                   "Language Test"
                }
              </Typography>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <button
              onClick={() =>
                navigate(`/dashboard/result-details/${type}/${item._id}`, { state: { item, type } })
              }
              className="bg-transparent text-cyan-500 hover:text-green-600 transition-colors"
            >
              View Results <FaArrowRight className="inline" />
            </button>
            <Typography variant="body2" className="text-neutralGrey whitespace-nowrap">
              {new Date(item.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </div>
        </motion.div>
      ))}
    </div>
  );
};


const Results = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    behavioralInterviews,
    technicalInterviews,
    quizzes,
    loading,
  } = useSelector((state) => state.results);

  const {
    testResults: languageTests,
    userTestCount,
    status: languageLoading,
  } = useSelector((state) => state.languageTest);

  useEffect(() => {
    dispatch(fetchBehavioralInterviewResults());
    dispatch(fetchTechnicalInterviewResults());
    dispatch(fetchQuizResults());
    dispatch(getAllTestResults());
    dispatch(countUserTests());
  }, [dispatch]);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const totalTests =
    behavioralInterviews.length +
    technicalInterviews.length +
    quizzes.length +
    userTestCount;

  return (
    <div className="flex flex-col items-center justify-center rounded min-h-screen p-8 space-y-6 bg-gray-50">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-black font-bold text-5xl mb-5 tracking-wide">
          Interview Results
        </h1>
        <Typography variant="h6" className="text-neutralGrey">
          <div className="flex flex-col items-center">
            <span className="text-6xl font-extrabold text-green-700">{totalTests}</span>
            <span className="text-lg text-gray-600">Interviews And Tests Taken</span>
          </div>
        </Typography>
      </motion.div>

      <Box
        sx={{
          borderBottom: 2,
          borderColor: "divider",
          width: "100%",
          maxWidth: 900,
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          centered
          sx={{
            "& .Mui-selected": {
              background: "#4CAF50",
              color: "#fff",
              borderRadius: "10px",
              border: "2px solid #4CAF50",
            },
            "& .MuiTab-root": {
              color: "#4CAF50",
              fontWeight: "bold",
              fontSize: "1rem",
              textTransform: "none",
              borderRadius: "10px",
              border: "2px solid #4CAF50",
              margin: "0 10px",
              transition: "all 0.3s ease-in-out",
              backgroundColor: "#fff",
              "&:hover": {
                backgroundColor: "rgba(76, 175, 80, 0.2)",
              },
            },
          }}
        >
          <Tab
            label={
              <div className="flex items-center space-x-2">
                <FaUserTie className="text-xl" />
                <span>Behavioral</span>
              </div>
            }
          />
          <Tab
            label={
              <div className="flex items-center space-x-2">
                <FaLaptopCode className="text-xl" />
                <span>Technical</span>
              </div>
            }
          />
          <Tab
            label={
              <div className="flex items-center space-x-2">
                <FaQuestionCircle className="text-xl" />
                <span>Quizzes</span>
              </div>
            }
          />
          <Tab
            label={
              <div className="flex items-center space-x-2">
                <LuLanguages className="text-xl" />
                <span>Language Test</span>
              </div>
            }
          />
        </Tabs>
      </Box>

      <motion.div
        className="w-full max-w-4xl mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        {loading || languageLoading === "loading" ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            {selectedTab === 0 &&
              renderResults(behavioralInterviews, "behavioral", navigate)}
            {selectedTab === 1 &&
              renderResults(technicalInterviews, "technical", navigate)}
            {selectedTab === 2 && renderResults(quizzes, "quizzes", navigate)}
            {selectedTab === 3 &&
              renderResults(languageTests, "language", navigate)}
          </>
        )}
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#4CAF50",
            color: "#fff",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#388E3C",
            },
            padding: "10px 20px",
            borderRadius: "8px",
            textTransform: "none",
          }}
          startIcon={<FaArrowLeft />}
          className="mt-6"
          onClick={() => navigate("/dashboard/overview")}
        >
          Back to Dashboard
        </Button>
      </motion.div>
    </div>
  );
};

export default Results;
