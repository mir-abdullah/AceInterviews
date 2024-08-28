import React from "react";
import { TiAttachment } from "react-icons/ti";
import { motion } from "framer-motion";
import { Card, CardContent, Typography, LinearProgress } from "@mui/material";

// Static data for quizzes
const quizzes = [
  {
    name: "Quiz Overview",
    type: "Complete the quizzes to assess your knowledge and track your progress.",
    date: "2024-03-15",
    progress: 60,
    lastScore: 85,
    files: 5,
  },
  {
    name: "Behavioral Interviews",
    type: "Complete the quizzes to assess your knowledge and track your progress.",
    date: "2024-02-20",
    progress: 40,
    lastScore: 78,
    files: 3,
  },
];

const QuizCard = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 p-6">
      {quizzes.map((quiz, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full max-w-md"
        >
          <Card className="shadow-lg rounded-xl">
            <CardContent className="p-6">
              <div>
                <Typography
                  variant="h6"
                  className="font-semibold text-gray-700"
                >
                  {quiz.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {quiz.type}
                </Typography>
              </div>
              <Typography
                variant="caption"
                display="block"
                className="mt-4 mb-2 text-gray-500"
              >
                {quiz.date}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={quiz.progress}
                className="rounded-full"
                sx={{ height: 8, backgroundColor: "#e0e0e0" }}
              />
              <div className="mt-4">
                <Typography
                  variant="body2"
                  className="font-semibold text-gray-700"
                >
                  Last Quiz Score:
                </Typography>
                <Typography variant="h5" color="primary" className="mt-1">
                  {quiz.lastScore}%
                </Typography>
              </div>
              <div className="flex justify-between items-center mt-4">
                <Typography
                  variant="caption"
                  className="flex space-x-1 items-center text-gray-400"
                >
                  <TiAttachment /> <span>{quiz.files} tries</span>
                </Typography>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default QuizCard;
