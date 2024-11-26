/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { LineChart } from "@mui/x-charts/LineChart";
import AreaGradient from "./AreaGradient"; // Import the AreaGradient component
import {
  fetchTotalQuizzes,
  fetchTechnicalInterviews,
  fetchBehavioralInterviews,
} from "../../redux/slices/admin/statistics/statisctics"; // Import your thunks

// Helper function to get the days in a month
function getDaysInMonth(month, year) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString("en-US", { month: "short" });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

export default function SessionsChart() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {
    totalQuizzes,
    technicalInterviews,
    behavioralInterviews,
    loading,
  } = useSelector((state) => state.stats); // Access stats from Redux

  // Fetch data when component mounts
  useEffect(() => {
    dispatch(fetchTotalQuizzes());
    dispatch(fetchTechnicalInterviews());
    dispatch(fetchBehavioralInterviews());
  }, [dispatch]);

  // Days in the month for the x-axis
  const data = getDaysInMonth(9, 2024); 

  // Dummy data for illustration (adjust with real data if needed)
  const quizzesData = Array(30).fill(totalQuizzes); // Simulating quiz data over 30 days
  const technicalInterviewsData = Array(30).fill(technicalInterviews); // Simulating tech interview data
  const behavioralInterviewsData = Array(30).fill(behavioralInterviews); // Simulating behavioral interview data

  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Sessions
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: "center", sm: "flex-start" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {totalQuizzes + technicalInterviews + behavioralInterviews || "0"}
            </Typography>
            <Chip size="small" color="success" label="+35%" />
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Quizzes and Interviews for the last 30 days
          </Typography>
        </Stack>

        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: "point",
              data,
              tickInterval: (index, i) => (i + 1) % 5 === 0,
            },
          ]}
          series={[
            {
              id: "quizzes",
              label: "Quizzes",
              showMark: false,
              curve: "linear",
              stack: "total",
              area: true,
              stackOrder: "ascending",
              data: quizzesData,
            },
            {
              id: "technicalInterviews",
              label: "Technical Interviews",
              showMark: false,
              curve: "linear",
              stack: "total",
              area: true,
              stackOrder: "ascending",
              data: technicalInterviewsData,
            },
            {
              id: "behavioralInterviews",
              label: "Behavioral Interviews",
              showMark: false,
              curve: "linear",
              stack: "total",
              stackOrder: "ascending",
              data: behavioralInterviewsData,
              area: true,
            },
          ]}
          height={250}
          margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          sx={{
            "& .MuiAreaElement-series-behavioralInterviews": {
              fill: "url('#behavioral')",
            },
            "& .MuiAreaElement-series-technicalInterviews": {
              fill: "url('#technical')",
            },
            "& .MuiAreaElement-series-quizzes": {
              fill: "url('#quizzes')",
            },
          }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        >
          <AreaGradient color={theme.palette.primary.dark} id="behavioral" />
          <AreaGradient color={theme.palette.primary.main} id="technical" />
          <AreaGradient color={theme.palette.primary.light} id="quizzes" />
        </LineChart>
      </CardContent>
    </Card>
  );
}
