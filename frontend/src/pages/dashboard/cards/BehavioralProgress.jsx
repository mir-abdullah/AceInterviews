import React from "react";
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

const data = [
  {
    name: "Interview 1",
    score: 80,
    total: 100,
  },
  {
    name: "Interview 2",
    score: 70,
    total: 100,
  },
  {
    name: "Interview 3",
    score: 65,
    total: 100,
  },
  {
    name: "Interview 4",
    score: 85,
    total: 100,
  },
  {
    name: "Interview 5",
    score: 90,
    total: 100,
  },
  {
    name: "Interview 6",
    score: 75,
    total: 100,
  },
];

const ProgressCard = () => {
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
            Behavioral Interview Progress
          </Typography>

          {/* Chart Rendering */}
          <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="total"
                  fill="#A8E6CF"
                  stroke="#A8E6CF"
                />
                <Bar dataKey="score" barSize={20} fill="#4CAF50" />
                <Line type="monotone" dataKey="score" stroke="#2E7D32" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
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
                  This chart displays your performance in recent behavioral
                  interviews. Each bar represents your score, and the line
                  indicates your progress across multiple interviews. The total
                  possible marks are 100 for each interview.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </CardContent>
      </Card>

      {/* Card with the Text */}
    </motion.div>
  );
};

export default ProgressCard;
