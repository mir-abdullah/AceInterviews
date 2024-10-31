import React, { useEffect } from "react";
import {
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizResults } from "../../../redux/slices/results/results.slice"; // Update the path based on your project structure

const QuizProgressCard = () => {
  const dispatch = useDispatch();

  // Fetch the quiz results from the Redux store
  const { quizzes, loading } = useSelector((state) => state.results);

  useEffect(() => {
    // Fetch the quiz results when the component mounts
    dispatch(fetchQuizResults());
  }, [dispatch]);

  // Get the last 5 results (reverse to ensure the most recent ones)
  const lastFiveResults = quizzes
    ? [...quizzes]
        .slice(-5)
        .reverse() // Reverse to display the most recent quizzes first
        .map((result, index) => ({
          name: `Quiz ${quizzes.length - index}`, // Adjust quiz name dynamically
          score: result.score, // Use score property from each quiz
          total: 10, // Assuming the total possible score is 10
        }))
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex justify-center items-center flex-col gap-6"
    >
      {/* Card with the Chart */}
      <Card
        sx={{ maxWidth: 800, borderRadius: 4, boxShadow: 3, padding: "20px" }}
      >
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            className="text-center font-bold mb-4 text-neutralBlack"
          >
            Quiz Progress
          </Typography>

          {/* Loading or Error State */}
          {loading ? (
            <Typography variant="body1" className="text-center">
              Loading...
            </Typography>
          ) : lastFiveResults.length > 0 ? (
            <div style={{ width: "100%", height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={lastFiveResults}
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} /> {/* Set max value to 10 */}
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="total"
                    fill="#A0D3E8" // Light blue fill color for Area
                    stroke="#A0D3E8" // Light blue stroke color for Area
                  />
                  <Bar dataKey="score" barSize={20} fill="#81D4FA" /> {/* Light blue for Bar */}
                  <Line type="monotone" dataKey="score" stroke="#0288D1" /> {/* Darker blue for Line */}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Typography variant="body1" className="text-center">
              No data available.
            </Typography>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center items-center"
          >
            <Card
              sx={{
                maxWidth: 800,
                borderRadius: 4,
                boxShadow: 2,
                backgroundColor: "#F5F7FA",
              }}
            >
              <CardContent>
                <Typography
                  variant="body2" // Reduced font size using body2
                  color="text.secondary"
                  className="text-center mt-4"
                  sx={{ fontSize: "0.875rem" }} // Decreased font size further if necessary
                >
                  This chart displays your performance in recent quizzes. Each
                  bar represents your score, and the line indicates your
                  progress across multiple quizzes. The total possible marks are
                  10 for each quiz.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuizProgressCard;
