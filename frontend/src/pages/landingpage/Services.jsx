import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CodeIcon from "@mui/icons-material/Code";
import TranslateIcon from "@mui/icons-material/Translate";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import FeedbackIcon from "@mui/icons-material/Feedback";

// Data for services
const services = [
  {
    icon: <CheckCircleIcon style={{ fontSize: "3rem", color: "#4CAF50" }} />,
    title: "Behavioral Interview",
    description:
      "Master behavioral interview questions with personalized simulations tailored to your industry and experience level.",
  },
  {
    icon: <CodeIcon style={{ fontSize: "3rem", color: "#4CAF50" }} />,
    title: "Technical Interview",
    description:
      "Prepare for technical interviews with coding challenges and real-time feedback on your performance.",
  },
  {
    icon: <TranslateIcon style={{ fontSize: "3rem", color: "#4CAF50" }} />,
    title: "Language Proficiency Test",
    description:
      "Test your language skills with AI-driven assessments that help you ace your communication tests.",
  },
  {
    icon: <QuestionMarkIcon style={{ fontSize: "3rem", color: "#4CAF50" }} />,
    title: "Interview Scenarios Quiz",
    description:
      "Practice with interview scenarios and quizzes designed to simulate the real interview environment.",
  },
  {
    icon: <FeedbackIcon style={{ fontSize: "3rem", color: "#4CAF50" }} />,
    title: "AI Generated Feedback",
    description:
      "Receive AI-powered feedback and analytics to continuously improve your interview responses.",
  },
];

const Services = () => {
  return (
    <div
      className="px-4 lg:px-14 max-w-screen-2xl mx-auto my-16 bg-neutralSilver py-8"
      id="services"
    >
      <motion.div
        variants={fadeIn("up", 0.3)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: false, amount: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl text-neutralDGrey font-semibold mb-4">
          AceInterview <span className="text-brandPrimary">Services</span>
        </h2>
        <p className="text-sm text-neutralGrey md:w-3/4 mx-auto">
          Explore the variety of services AceInterview provides to ensure you
          are ready for every aspect of the interview process.
        </p>
      </motion.div>

      <motion.div
        className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 mt-16"
        variants={fadeIn("up", 0.4)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: false, amount: 0.6 }}
      >
        {services.map((service, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-lg p-6 rounded-lg text-center hover:bg-[#F5F7FA] transition-all duration-300"
          >
            <Box className="mb-4">{service.icon}</Box>
            <Typography
              variant="h6"
              component="div"
              className="font-bold text-neutralDGrey mb-2"
            >
              <span className="text-brandPrimary">
                {service.title.split(" ")[0]}
              </span>{" "}
              {service.title.split(" ").slice(1).join(" ")}
            </Typography>
            <Typography
              variant="body2"
              component="p"
              className="text-neutralGrey"
            >
              {service.description}
            </Typography>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Services;
