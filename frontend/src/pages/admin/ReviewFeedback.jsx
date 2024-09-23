import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllFeedback, getRatingsCount, clearFeedbackState } from "../../redux/slices/feedback/userFeedback"; // Import actions
import { PieChart } from "@mui/x-charts/PieChart";
import { Avatar, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";
import FeedbackChartCard from "../../components/chart/FeedbackChart";
import user from '../../assets/user.png'

const FeedbackPage = () => {
  const dispatch = useDispatch();

  // Access state from Redux store
  const { feedbacks, ratingsCount, loading, error, successMessage } = useSelector(
    (state) => state.feedback
  );
  console.log(feedbacks)
  console.log(ratingsCount)

  useEffect(() => {
    // Fetch feedbacks and ratings when component mounts
    dispatch(getAllFeedback());
    dispatch(getRatingsCount());

    // Cleanup state when unmounting or before new data is fetched
    return () => {
      dispatch(clearFeedbackState());
    };
  }, [dispatch]);

  // Prepare data for the pie chart
  const pieChartData = ratingsCount.map((rating) => ({
    value: rating.count,
    label: `Rating ${rating._id}`,
  }));

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Page Title */}
      <Typography
        variant="h4"
        className="text-center font-bold mb-8 text-gray-700"
      >
        User Feedback Overview
      </Typography>

      {/* Display loading/error messages */}
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {successMessage && <Typography color="primary">{successMessage}</Typography>}

      {/* Pie Chart Card */}
      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex justify-center"
        >
          <FeedbackChartCard data={pieChartData} />
        </motion.div>
      )}

      {/* Feedback Rows */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        {!loading &&

          feedbacks.map((feedback, index) => (
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
                    alt={feedback.user.name}
                    src={user || "https://i.pravatar.cc/150?img=1"}
                    sx={{ width: 56, height: 56 }}
                  />
                  <Stack>
                    <Typography variant="h6" className="font-semibold text-gray-800">
                      {feedback.user.name}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {feedback.comment}
                    </Typography>
                  </Stack>
                </Stack>
                <Typography variant="caption" className="text-gray-400">
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </Typography>
              </Stack>
            </motion.div>
          ))} 
      </motion.div>
    </div>
  );
};

export default FeedbackPage;
