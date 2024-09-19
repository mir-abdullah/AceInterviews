import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import { FaQuestionCircle, FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const quizzes = [
  {
    title: "JavaScript Quiz",
    description: "Test your knowledge of JavaScript fundamentals.",
    icon: <FaQuestionCircle size={40} color="#4CAF4F" />,
  },
  {
    title: "React Quiz",
    description: "Assess your understanding of React and its ecosystem.",
    icon: <FaClipboardList size={40} color="#FF9800" />,
  },
  {
    title: "CSS Quiz",
    description: "Evaluate your skills in CSS and responsive design.",
    icon: <FaQuestionCircle size={40} color="#2196F3" />,
  },
  {
    title: "Database Quiz",
    description: "Test your database knowledge and SQL skills.",
    icon: <FaClipboardList size={40} color="#9C27B0" />,
  },
  {
    title: "UI/UX Design Quiz",
    description: "Assess your proficiency in UI/UX design principles.",
    icon: <FaQuestionCircle size={40} color="#4CAF4F" />,
  },
  {
    title: "HTML Quiz",
    description: "Test your understanding of HTML and web structures.",
    icon: <FaClipboardList size={40} color="#FF9800" />,
  },
];

const Quizes = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        padding: "20px",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#263238" }}
      >
        Choose Your Quiz
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {quizzes.map((quiz, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  padding: "20px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  borderRadius: "15px",
                  textAlign: "center",
                  backgroundColor: "#ffffff",
                  "&:hover": {
                    boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>{quiz.icon}</Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#4CAF4F" }}
                  >
                    {quiz.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 2 }}
                  >
                    {quiz.description}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 4,
                      backgroundColor: "#4CAF4F",
                      color: "#ffffff",
                      "&:hover": {
                        backgroundColor: "#388E3C",
                      },
                    }}
                    onClick={() => navigate(`/dashboard/quiz/${index + 1}`)}
                  >
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Quizes;
