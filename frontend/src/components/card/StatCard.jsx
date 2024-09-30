import React, { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { areaElementClasses } from "@mui/x-charts/LineChart";
import { motion } from "framer-motion";
import { FaUserAlt, FaChartLine, FaDollarSign, FaTasks } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTotalUsers,
  fetchTotalQuizzes,
  fetchTechnicalInterviews,
  fetchBehavioralInterviews,
} from "../../redux/slices/admin/statistics/statisctics";
import { TfiAgenda } from "react-icons/tfi";


function getDaysInMonth(month, year) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString("en-US", { month: "short" });
  const daysInMonth = date.getDate();
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(`${monthName} ${i}`);
  }
  return days;
}

function AreaGradient({ color, id }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

const StatCard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  // Fetch stats data on mount
  useEffect(() => {
    dispatch(fetchTotalUsers());
    dispatch(fetchTotalQuizzes());
    dispatch(fetchTechnicalInterviews());
    dispatch(fetchBehavioralInterviews());
  }, [dispatch]);

  // Get stats from Redux store
  const { totalUsers, totalQuizzes, technicalInterviews, behavioralInterviews, loading, error } =
    useSelector((state) => state.stats);

  const daysInWeek = getDaysInMonth(4, 2024);

  const data = [
    {
      title: "Total Users",
      value: totalUsers || "N/A",
      interval: "Last 30 days",
      trend: "up",
      icon: <FaUserAlt />,
      data: [1000, 1200, 1100, 1300, 1400, 1500, 1600, 1700],
    },
    {
      title: "Quizzes Conducted",
      value: totalQuizzes || "N/A",
      interval: "Last 30 days",
      trend: "neutral",
      icon: <FaTasks />,
      data: [200, 220, 230, 250, 260, 270, 280, 300],
    },
    {
      title: "Technical Interviews",
      value: technicalInterviews || "N/A",
      interval: "Last 30 days",
      trend: "down",
      icon: <FaChartLine />,
      data: [300, 320, 330, 340, 350, 360, 370, 400],
    },
    {
      title: "Behavioral Interviews",
      value: behavioralInterviews || "N/A",
      interval: "Last 30 days",
      trend: "up",
      icon: <TfiAgenda />,
      data: [150, 160, 170, 180, 190, 200, 220, 240],
    },
  ];

  const trendColors = {
    up:
      theme.palette.mode === "light"
        ? theme.palette.success.main
        : theme.palette.success.dark,
    down:
      theme.palette.mode === "light"
        ? theme.palette.error.main
        : theme.palette.error.dark,
    neutral:
      theme.palette.mode === "light"
        ? theme.palette.grey[400]
        : theme.palette.grey[700],
  };

  const labelColors = {
    up: "success",
    down: "error",
    neutral: "default",
  };

  const trendValues = { up: "+25%", down: "-25%", neutral: "+5%" };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-8">
      {data.map((item, index) => {
        const color = labelColors[item.trend];
        const chartColor = trendColors[item.trend];

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="hover:scale-105 transform transition duration-300"
          >
            <Card
              variant="outlined"
              className="flex-grow h-full shadow-lg rounded-lg overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <div className="p-3 bg-indigo-100 rounded-full mr-2 text-indigo-600 text-lg">
                      {item.icon}
                    </div>
                    <Typography
                      component="h2"
                      variant="subtitle1"
                      className="text-indigo-800 font-bold"
                    >
                      {item.title}
                    </Typography>
                  </div>
                  <Chip
                    size="small"
                    color={color}
                    label={trendValues[item.trend]}
                    className="font-semibold text-sm"
                  />
                </div>
                <Stack direction="column" className="gap-2 justify-between">
                  <Stack
                    direction="row"
                    className="justify-between items-center"
                  >
                    <Typography
                      variant="h4"
                      component="p"
                      className="font-extrabold text-2xl"
                    >
                      {item.value}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" className="text-gray-500">
                    {item.interval}
                  </Typography>
                  <Box className="w-full h-16">
                    <SparkLineChart
                      colors={[chartColor]}
                      data={item.data}
                      area
                      showHighlight
                      showTooltip
                      xAxis={{
                        scaleType: "band",
                        data: daysInWeek,
                      }}
                      sx={{
                        [`& .${areaElementClasses.root}`]: {
                          fill: `url(#area-gradient-${item.value})`,
                        },
                      }}
                    >
                      <AreaGradient
                        color={chartColor}
                        id={`area-gradient-${item.value}`}
                      />
                    </SparkLineChart>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatCard;
