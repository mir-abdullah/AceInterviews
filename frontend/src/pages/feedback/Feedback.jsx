import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";

const feedbackData = [
  {
    id: 1,
    question:
      "Tell me about a time you had to work under pressure to meet a tight deadline in a previous kitchen environment.",
    rating: 2,
    userAnswer:
      "Apart from technical skills, strong communication and teamwork were essential.",
    correctAnswer:
      "In my previous role, we were often slammed during peak dinner hours. One night, we had a large catering order for a corporate event alongside the usual walk-in customers. I kept a cool head, delegated tasks effectively to my team, and ensured all orders were prepared and delivered on time, even with the added pressure.",
    feedback:
      "The answer misses the mark completely. It doesn’t address the question of working under pressure and meeting a deadline. Instead, it lists general skills and qualities needed in a kitchen, which is irrelevant to the prompt. The answer needs to focus on a specific example and highlight the actions taken to meet the deadline.",
  },
  {
    id: 2,
    question:
      "Tell me about a time you had to work under pressure to meet a tight deadline in a previous kitchen environment.",
    rating: 5,
    userAnswer:
      "Apart from technical skills, strong communication and teamwork were essential.",
    correctAnswer:
      "In my previous role, we were often slammed during peak dinner hours. One night, we had a large catering order for a corporate event alongside the usual walk-in customers. I kept a cool head, delegated tasks effectively to my team, and ensured all orders were prepared and delivered on time, even with the added pressure.",
    feedback:
      "The answer misses the mark completely. It doesn’t address the question of working under pressure and meeting a deadline. Instead, it lists general skills and qualities needed in a kitchen, which is irrelevant to the prompt. The answer needs to focus on a specific example and highlight the actions taken to meet the deadline.",
  },
  // Add more feedback items here if needed
];

const Feedback = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box className="p-6">
      <Typography variant="h4" className="text-green-700 font-bold mb-4">
        Congratulations!
      </Typography>
      <Typography variant="h6" className="text-gray-800 font-semibold mb-6">
        Here is your interview feedback
      </Typography>

      <Typography variant="body1" className="text-gray-800 mb-6">
        Your overall interview rating{" "}
        <span className="text-red-600 font-bold">2/10</span>
      </Typography>

      {feedbackData.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-2"
        >
          <Accordion
            expanded={expanded === item.id}
            onChange={handleChange(item.id)}
            className="p-2"
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${item.id}a-content`}
              id={`panel${item.id}a-header`}
            >
              <Typography className="text-gray-900">{item.question}</Typography>
            </AccordionSummary>
            <AccordionDetails className="space-y-4">
              <Paper className="p-4 bg-red-50 border border-red-200">
                <Typography
                  variant="body1"
                  className="text-red-700 font-semibold mb-2"
                >
                  Rating: {item.rating}
                </Typography>
                <Typography variant="body2" className="text-red-800">
                  Your Answer: {item.userAnswer}
                </Typography>
              </Paper>
              <Paper className="p-4 bg-green-50 border border-green-200">
                <Typography
                  variant="body1"
                  className="text-green-700 font-semibold mb-2"
                >
                  Correct Answer:
                </Typography>
                <Typography variant="body2" className="text-green-800">
                  {item.correctAnswer}
                </Typography>
              </Paper>
              <Paper className="p-4 bg-purple-50 border border-purple-200">
                <Typography
                  variant="body1"
                  className="text-purple-700 font-semibold mb-2"
                >
                  Feedback:
                </Typography>
                <Typography variant="body2" className="text-purple-800">
                  {item.feedback}
                </Typography>
              </Paper>
            </AccordionDetails>
          </Accordion>
        </motion.div>
      ))}
    </Box>
  );
};

export default Feedback;
