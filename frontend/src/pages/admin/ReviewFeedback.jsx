import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Avatar, Card, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";
import FeedbackChartCard from "../../components/chart/FeedbackChart";

// Static feedback data (rating 1-5)
const feedbackRatings = [
  { rating: 5, count: 40 }, // 40 excellent reviews
  { rating: 4, count: 30 }, // 30 good reviews
  { rating: 3, count: 15 }, // 15 average reviews
  { rating: 2, count: 10 }, // 10 poor reviews
  { rating: 1, count: 5 }, // 5 very poor reviews
];

// Static user feedback data
const userFeedbacks = [
  {
    username: "John Doe",
    comment:
      "AceInterview was amazing! It really helped me prepare for my interviews.",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    date: "2023/09/15",
  },
  {
    username: "Jane Smith",
    comment: "Great platform, but the UI could be improved.",
    avatarUrl: "https://i.pravatar.cc/150?img=2",
    date: "2023/09/14",
  },
  {
    username: "Mike Johnson",
    comment:
      "The questions were very helpful and prepared me well for my technical interview.",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
    date: "2023/09/13",
  },
];

// Prepare data for the pie chart
const pieChartData = feedbackRatings.map((feedback) => ({
  value: feedback.count,
  label: `Rating ${feedback.rating}`,
}));

const FeedbackPage = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Page Title */}
      <Typography
        variant="h4"
        className="text-center font-bold mb-8 text-gray-700"
      >
        User Feedback Overview
      </Typography>

      {/* Pie Chart Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex justify-center"
      >
        {/* Pie Chart */}
        <FeedbackChartCard />
      </motion.div>

      {/* Feedback Rows */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        {userFeedbacks.map((feedback, index) => (
          <motion.div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              className="justify-between"
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  alt={feedback.username}
                  src={feedback.avatarUrl}
                  sx={{ width: 56, height: 56 }}
                />
                <Stack>
                  <Typography
                    variant="h6"
                    className="font-semibold text-gray-800"
                  >
                    {feedback.username}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {feedback.comment}
                  </Typography>
                </Stack>
              </Stack>
              <Typography variant="caption" className="text-gray-400">
                {feedback.date}
              </Typography>
            </Stack>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default FeedbackPage;
