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
import { FaCode, FaMobileAlt, FaPencilRuler, FaDatabase } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import TechInterviewPage from "./TechInterviewPage";
const fields = [
  {
    title: "Web Development",
    description:
      "Take an interview to test your skills in modern web technologies and frameworks.",
    icon: <FaCode size={40} color="#4CAF4F" />,
  },
  {
    title: "Mobile Development",
    description:
      "Assess your knowledge in developing mobile applications for iOS and Android.",
    icon: <FaMobileAlt size={40} color="#FF9800" />,
  },
  {
    title: "UI/UX Design",
    description:
      "Evaluate your design skills in user interfaces and user experiences.",
    icon: <FaPencilRuler size={40} color="#2196F3" />,
  },
  {
    title: "Database Engineering",
    description:
      "Test your ability to design, implement, and manage databases.",
    icon: <FaDatabase size={40} color="#9C27B0" />,
  },
  {
    title: "Product Manager",
    description:
      "Test your ability to design, implement, and manage databases.",
    icon: <FaDatabase size={40} color="#9C27B0" />,
  },
  {
    title: "Product Manager",
    description:
      "Test your ability to design, implement, and manage databases.",
    icon: <FaDatabase size={40} color="#9C27B0" />,
  },
];

const Technical = () => {
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
        Choose Your Technical Interview
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {fields.map((field, index) => (
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
                  <Box sx={{ mb: 2 }}>{field.icon}</Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#4CAF4F" }}
                  >
                    {field.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 2 }}
                  >
                    {field.description}
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
                    onClick={() => navigate("/dashboard/techinterviewpage")}
                  >
                    Start Interview
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

export default Technical;
