import React from "react";
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

function getDaysInMonth(month, year) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString("en-US", {
    month: "short",
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
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
  const daysInWeek = getDaysInMonth(4, 2024);

  // Mock data for StatCard with additional fields
  const mockData = [
    {
      title: "Users",
      value: "14k",
      interval: "Last 30 days",
      trend: "up",
      icon: <FaUserAlt />,
      data: [
        1000, 1200, 1100, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2200,
        2400, 2600, 2800, 3000,
      ],
    },
    {
      title: "Conversions",
      value: "325",
      interval: "Last 30 days",
      trend: "down",
      icon: <FaTasks />,
      data: [
        500, 450, 400, 350, 325, 300, 290, 280, 270, 260, 250, 240, 230, 220,
        210, 200,
      ],
    },
    {
      title: "Sessions",
      value: "120k",
      interval: "Last 30 days",
      trend: "neutral",
      icon: <FaChartLine />,
      data: [
        5000, 5200, 5400, 5600, 5800, 6000, 6200, 6400, 6600, 6800, 7000, 7200,
        7400, 7600, 7800, 8000,
      ],
    },
    {
      title: "Revenue",
      value: "$34k",
      interval: "Last 30 days",
      trend: "up",
      icon: <FaDollarSign />,
      data: [
        3000, 3200, 3400, 3600, 3800, 4000, 4200, 4400, 4600, 4800, 5000, 5200,
        5400, 5600, 5800, 6000,
      ],
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
      {mockData.map((item, index) => {
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
