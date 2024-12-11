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
import { getAllTestResults } from "../../../redux/slices/languageProficiencyTest/languageTest.slice"; // Adjust path as needed

const LanguageProgressCard = () => {
  const dispatch = useDispatch();

  // Fetch language test results from Redux store
  const { testResults, status } = useSelector((state) => state.languageTest);

  useEffect(() => {
    // Dispatch action to fetch all test results when component mounts
    dispatch(getAllTestResults());
  }, [dispatch]);

  // Get the last 5 test results (most recent first)
  const lastFiveResults = testResults
    ? [...testResults]
        .slice(-5)
        .reverse()
        .map((result, index) => ({
          name: `Test ${testResults.length - index}`, // Dynamic test name
          score: result.score, // Test score
          total: result.total || 15, // Assume total is 10 if not provided
        }))
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex justify-center items-center flex-col gap-6"
    >
      {/* Card for displaying language progress */}
      <Card
        sx={{ maxWidth: 800, borderRadius: 4, boxShadow: 3, padding: "20px" }}
      >
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            className="text-center font-bold mb-4 text-neutralBlack"
          >
            Language Proficiency Progress
          </Typography>

          {/* Loading or Error State */}
          {status === "loading" ? (
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
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="total"
                    fill="#E0F7FA"
                    stroke="#E0F7FA"
                  />
                  <Bar dataKey="score" barSize={20} fill="#26C6DA" />
                  <Line type="monotone" dataKey="score" stroke="#0097A7" />
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
                  variant="body2"
                  color="text.secondary"
                  className="text-center mt-4"
                  sx={{ fontSize: "0.875rem" }}
                >
                  This chart showcases your progress in language proficiency
                  tests. Each bar reflects your score, while the line highlights
                  your improvement across the last few tests.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LanguageProgressCard;
