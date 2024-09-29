import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { fadeIn } from "../../variants"; // Using the existing fadeIn animation

const faqData = [
  {
    question: "What is AceInterview?",
    answer:
      "AceInterview is an AI-powered interview preparation platform designed to help candidates excel in both behavioral and technical interviews through real-time feedback and interactive simulations.",
  },
  {
    question: "How does AceInterview provide feedback?",
    answer:
      "AceInterview uses advanced machine learning algorithms to analyze your responses and provide instant feedback on areas such as communication, problem-solving, and technical knowledge.",
  },
  {
    question: "What kind of interviews can I practice on AceInterview?",
    answer:
      "You can practice behavioral interviews, technical coding challenges, system design interviews, and more with specialized feedback tailored to each domain.",
  },
  {
    question: "How do I get started with AceInterview?",
    answer:
      "Getting started is easy! Simply sign up, choose your desired interview type, and begin your mock interviews with instant feedback. You can access your performance analytics after each session.",
  },
  {
    question: "Can AceInterview help with technical interview questions?",
    answer:
      "Yes! AceInterview offers a wide range of technical interview questions for various job roles, along with detailed insights on your performance.",
  },
];

const FAQ = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div
      className="px-4 lg:px-14 max-w-screen-2xl mx-auto my-16 bg-neutralSilver py-8"
      id="faq"
    >
      <motion.div
        variants={fadeIn("up", 0.3)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: false, amount: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl text-neutralDGrey font-semibold mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-neutralGrey md:w-3/4 mx-auto">
          Have questions? We’ve got answers! Below are some common questions
          users ask about AceInterview and how it works.
        </p>
      </motion.div>

      {/* FAQ Items */}
      <motion.div
        variants={fadeIn("up", 0.4)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: false, amount: 0.6 }}
      >
        <Box className="md:w-3/4 mx-auto">
          {faqData.map((faq, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              sx={{
                backgroundColor: "#F5F7FA",
                borderRadius: 2,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
                marginBottom: 2,
                "&:before": {
                  display: "none",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#4CAF4F" }} />}
                aria-controls={`panel${index}bh-content`}
                id={`panel${index}bh-header`}
              >
                <Typography
                  sx={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "#4D4D4D",
                  }}
                >
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: "#717171" }}>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </motion.div>
    </div>
  );
};

export default FAQ;
