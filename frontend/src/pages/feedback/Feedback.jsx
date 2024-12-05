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
  Tabs, Tab
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";

const Feedback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { item, type } = location.state;

  const [expanded, setExpanded] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };


  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleBackClick = () => {
    navigate("/dashboard/results");
  };

  if (type === "quizzes") {
    const totalMarks = item.score || 0;
    const maxMarks = item.answers.length;

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
                      className={`font-bold ${answer.isCorrect ? "text-green-600" : "text-red-600"}`}
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

  if (type === "language") {
    const score = item.score || 0
    return (
      <Box className="p-6 min-h-screen bg-gradient-to-t from-lime-100 to-cyan-100 rounded-2xl">
        <h1 className="text-black text-4xl font-semibold mb-2 text-center">
          Language Test Feedback
        </h1>
        <Typography variant="body1" className="text-black mb-4 text-center text-2xl">
          Total Score:{" "}
          <span className="text-red-600 font-bold">{score}/15</span>
        </Typography>
        
        {/* Tabs for sections */}
        <Tabs value={selectedTab} onChange={handleTabChange} centered>
          <Tab label="MCQ Feedback" />
          <Tab label=" Response Feedback" />
          <Tab label="Speech Feedback" />
        </Tabs>
  
        <Grid container spacing={2}>
          {/* MCQ Section */}
          {selectedTab === 0 && item.mcq?.length > 0 && (
            <>
              
              {item.mcq.map((question, index) => (
                <Grid item xs={12} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="p-2"
                  >
                    <Accordion expanded={expanded === `mcq-${index}`} onChange={handleChange(`mcq-${index}`)} className="p-2">
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`mcq-${index}-content`}
                        id={`mcq-${index}-header`}
                      >
                        <Typography className="text-gray-900">
                          <strong>Q{index + 1}</strong>: {question.questionText}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails className="space-y-4">
                        <Paper className="p-4 bg-green-50 border border-green-200">
                          <Typography variant="body1" className="text-green-700 font-semibold mb-2">
                            <strong>Correct Option: {question.correctOption}</strong>
                          </Typography>
                          <Typography variant="body2" className="text-black font-bold">
                            <strong>Your Answer: {question.selectedOption}</strong>
                          </Typography>
                        </Paper>
                        <Typography variant="body1" className={`font-bold ${question.isCorrect ? "text-green-600" : "text-red-600"}`}>
                          {question.isCorrect ? "Correct" : "Incorrect"}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </motion.div>
                </Grid>
              ))}
            </>
          )}
  
          {/* Response Section */}
          {selectedTab === 1 && item.response?.length > 0 && (
            <>
             
              {item.response.map((response, index) => (
                <Grid item xs={12} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="p-2"
                  >
                    <Accordion expanded={expanded === `response-${index}`} onChange={handleChange(`response-${index}`)} className="p-2">
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`response-${index}-content`}
                        id={`response-${index}-header`}
                      >
                        <Typography className="text-gray-900">
                          <strong>Q{index + 1}</strong>
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails className="space-y-4">
                        <Paper className="p-4 bg-blue-50 border border-blue-200">
                          <Typography variant="body1" className="text-green-700 font-semibold mb-2">
                            <strong>Correct Option: {response.correctOption}</strong>
                          </Typography>
                          <Typography variant="body2" className="text-black font-bold">
                            <strong>Your Answer: {response.selectedOption}</strong>
                          </Typography>
                        </Paper>
                        <Typography variant="body1" className={`font-bold ${response.isCorrect ? "text-green-600" : "text-red-600"}`}>
                          {response.isCorrect ? "Correct" : "Incorrect"}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    
                  </motion.div>
                  
                </Grid>
              ))}
              
            </>
          )}
  
          {/* Speech Section */}
          {selectedTab === 2 && item.speech?.length > 0 && (
            <>
              {item.speech.map((speech, index) => (
                <Grid item xs={12} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="p-2"
                  >
                    <Accordion expanded={expanded === `speech-${index}`} onChange={handleChange(`speech-${index}`)} className="p-2">
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`speech-${index}-content`}
                        id={`speech-${index}-header`}
                      >
                        <Typography className="text-gray-900">
                          <strong>Q{index + 1}</strong>: {speech.questionText}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails className="space-y-4">
                        <Paper className="p-4 bg-yellow-50 border border-yellow-200">
                          <Typography variant="body1" className="text-black font-bold mb-2">
                            <strong>Answer:
                              </strong> {speech.transcribedText}
                          </Typography>
                          <Typography variant="body1" className="text-black font-semibold mb-2">
                            <strong>Analysis:</strong> {speech.analysis}
                          </Typography>
                        </Paper>
                      </AccordionDetails>
                    </Accordion>
                  </motion.div>
                </Grid>
              ))}
            </>
          )}
            <div className=" justify-center items-center mb-4">
        <Button
          variant="contained"
          color="primary"
          onClick={handleBackClick}
        >
          Back to Results
        </Button>
      </div>
        </Grid>
      </Box>
      
    );
  }

  const totalMarks = item.responses.reduce((acc, response) => {
    const score = response.evaluation?.score ?? 0;
    return acc + score;
  }, 0);

  const maxMarks = item.responses.length * 5;

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
                      <strong>Score: {response.evaluation?.score ?? 0} / 5</strong>
                    </Typography>
                    <Typography variant="body2" className="text-black font-bold">
                      <strong>Answer: {response.answer ?? "No answer provided"}</strong>
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
                      <strong>{response.evaluation?.feedback ?? "No feedback provided"}</strong>
                    </Typography>
                  </Paper>
                  <Paper className="p-4 bg-green-50 border border-green-200">
                    <Typography
                      variant="body1"
                      className="text-green-700 font-semibold mb-2"
                    >
                      <strong>Suggestions:</strong>
                    </Typography>
                    <Typography variant="body2" className="text-black text-bold">
                      <strong>{response.evaluation?.suggestion ?? "No suggestion provided"}</strong>
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
