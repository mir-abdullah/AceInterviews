import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";

const Feedback = () => {
  const location = useLocation(); // Get the location object
  const navigate = useNavigate(); // Initialize useHistory for navigation
  const { item, type } = location.state; // Destructure the item and type from location.state
  console.log(type)
  console.log(item)

  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleBackClick = () => {
    navigate("/dashboard/results"); // Navigate back to results page
  };

  if (type === "quizzes") {
    // Calculate quiz score and total possible score
    const totalMarks = item.score;
    const maxMarks = item.answers.length; // Assuming each question is worth 1 point

    return (
      <Box className="p-6 min-h-screen bg-gradient-to-t from-lime-100 to-cyan-100 rounded-2xl">
        <h1 className="text-black text-4xl font-semibold mb-2 text-center">Quiz Feedback</h1>
        <Typography variant="body1" className="text-black mb-4 text-center text-2xl">
          Total Score:{" "}
          <span className="text-red-600 font-bold">{totalMarks}/{maxMarks}</span>
        </Typography>

        <Grid container spacing={2}>
          {item.answers.map((answer, index) => (
            <Grid item xs={12} key={answer._id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-2"
              >
                <Accordion
                  expanded={expanded === answer._id}
                  onChange={handleChange(answer._id)}
                  className="p-2"
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${answer._id}a-content`}
                    id={`panel${answer._id}a-header`}
                  >
                    <Typography className="text-gray-900">
                      <strong>Q{index + 1}</strong>: {answer.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className="space-y-4">
                    <Paper className="p-4 bg-green-50 border border-green-200">
                      <Typography
                        variant="body1"
                        className="text-green-700 font-semibold mb-2"
                      >
                        <strong>Correct Option: {answer.correctOption}</strong>
                      </Typography>
                      <Typography variant="body2" className="text-black font-bold">
                        <strong>Your Answer: {answer.selectedOption}</strong>
                      </Typography>
                    </Paper>

                    <Typography
                      variant="body1"
                      className={`font-bold ${
                        answer.isCorrect ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {answer.isCorrect ? "Correct" : "Incorrect"}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <div className="flex justify-center items-center mb-4">
          <Button
            variant="contained"
            color="primary"
            onClick={handleBackClick}
          >
            Back to Results
          </Button>
        </div>
      </Box>
    );
  }

  // Interview feedback (your original logic)
  const totalMarks = item.responses.reduce(
    (acc, response) => acc + response.evaluation.score,
    0
  );
  const maxMarks = item.responses.length * 5; // Each question is out of 5

  return (
    <Box className="p-6 min-h-screen bg-gradient-to-t from-lime-100 to-cyan-100 rounded-2xl">
      <h1 className="text-black text-4xl font-semibold mb-2 text-center">
        Interview Feedback
      </h1>
      <Typography variant="body1" className="text-black mb-4 text-center text-2xl">
        Total Score:{" "}
        <span className="text-red-600 font-bold">{totalMarks}/{maxMarks}</span>
      </Typography>

      <Grid container spacing={2}>
        {item.responses.map((response, index) => (
          <Grid item xs={12} key={response._id}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-2"
            >
              <Accordion
                expanded={expanded === response._id}
                onChange={handleChange(response._id)}
                className="p-2"
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${response._id}a-content`}
                  id={`panel${response._id}a-header`}
                >
                  <Typography className="text-gray-900">
                    <strong>Q{index + 1}</strong>: {response.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails className="space-y-4">
                  <Paper className="p-4 bg-red-50 border border-red-200">
                    <Typography
                      variant="body1"
                      className="text-red-700 font-semibold mb-2"
                    >
                      <strong>Score: {response.evaluation.score} / 5</strong>
                    </Typography>
                    <Typography variant="body2" className="text-black font-bold">
                      <strong>Answer: {response.answer}</strong>
                    </Typography>
                  </Paper>

                  <Paper className="p-4 bg-purple-50 border border-purple-200">
                    <Typography
                      variant="body1"
                      className="text-purple-700 font-semibold mb-2"
                    >
                      <strong>Feedback:</strong>
                    </Typography>
                    <Typography variant="body2" className="text-black text-bold">
                      <strong>{response.evaluation.feedback}</strong>
                    </Typography>
                  </Paper>

                  <Paper className="p-4 bg-green-50 border border-green-200">
                    <Typography
                      variant="body1"
                      className="text-green-700 font-semibold mb-2"
                    >
                      <strong>Ideal Answer:</strong>
                    </Typography>
                    <Typography variant="body2" className="text-black">
                      <strong>{response.evaluation.idealAnswer}</strong>
                    </Typography>
                  </Paper>
                </AccordionDetails>
              </Accordion>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      
      <div className="flex justify-center items-center mb-4">
        <Button
          variant="contained"
          color="primary"
          onClick={handleBackClick}
        >
          Back to Results
        </Button>
      </div>
    </Box>
  );
};

export default Feedback;
