// eslint-disable-next-line no-unused-vars
import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, Typography } from "@mui/material";
import { motion } from "framer-motion";

const TechnicalProgress = () => {
  const data = [
    {
      field: "Problem-Solving",
      QAJob: 120,
      UXJob: 98,
      DevJob: 86,
      fullMark: 150,
    },
    {
      field: "System Design",
      QAJob: 110,
      UXJob: 130,
      DevJob: 130,
      fullMark: 150,
    },
    {
      field: "Coding Skills",
      QAJob: 99,
      UXJob: 100,
      DevJob: 130,
      fullMark: 150,
    },
    {
      field: "Communication",
      QAJob: 85,
      UXJob: 90,
      DevJob: 100,
      fullMark: 150,
    },
    {
      field: "Technical Knowledge",
      QAJob: 65,
      UXJob: 85,
      DevJob: 90,
      fullMark: 150,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex justify-center items-center flex-col gap-6 space-y-8"
    >
      {/* Card with the RadarChart */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex justify-center items-center"
      >
        <Card
          sx={{ maxWidth: 800, borderRadius: 4, boxShadow: 3, padding: "20px" }}
        >
          <CardContent>
            <Typography
              variant="h5"
              component="div"
              className="text-center font-bold mb-4 text-neutralBlack"
            >
              Technical Interview Progress
            </Typography>

            {/* Radar Chart */}
            <div
              style={{ width: "100%", height: 400 }}
              className="flex justify-center items-center"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="field" />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} />
                  {/* Updated Colors for Different Interviews */}
                  <Radar
                    name="QA Job"
                    dataKey="QAJob"
                    stroke="#4CAF50"
                    fill="#4CAF50"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="UI/UX Job"
                    dataKey="UXJob"
                    stroke="#9575CD" // Light purple
                    fill="#9575CD"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Web Developer Job"
                    dataKey="DevJob"
                    stroke="#4FC3F7" // Light blue
                    fill="#4FC3F7"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>

          {/* Explanation Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center items-center"
          >
            <Card
              sx={{
                maxWidth: 900,
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
                  This radar chart represents your performance across multiple
                  fields in technical interviews. The colored areas represent
                  your scores for different job types like QA, UI/UX, and Web
                  Developer interviews.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default TechnicalProgress;
