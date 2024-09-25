import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation and useHistory
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
  const { item } = location.state; // Destructure the item from location.state

  const [expanded, setExpanded] = useState(false);

  // Calculate total marks and maximum possible marks
  const totalMarks = item.responses.reduce(
    (acc, response) => acc + response.evaluation.score,
    0
  );
  const maxMarks = item.responses.length * 5; // Each question is out of 5

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleBackClick = () => {
    navigate("/dashboard/results"); // Navigate back to results page
  };

  return (
    <Box className="p-6  min-h-screen bg-gradient-to-t from-lime-100 to-cyan-100 rounded-2xl">
      {/* <Typography variant="h4" className="text-green-700 font-bold mb-4 text-center">
        Congratulations!
      </Typography> */}
      <h1  className="text-black text-4xl font-semibold mb-2 text-center">
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
                      <strong>
                      Score: {response.evaluation.score} / 5
                      </strong>
                    </Typography>
                    <Typography variant="body2" className="text-black font-bold">
                      <strong> Answer: {response.answer} </strong>
                    </Typography>
                  </Paper>

                  <Paper className="p-4 bg-purple-50 border border-purple-200">
                    <Typography
                      variant="body1"
                      className="text-purple-700 font-semibold mb-2"
                    >
                      <strong>

                      Feedback:
                      </strong>
                    </Typography>
                    <Typography variant="body2" className="text-black text-bold">
                     <strong>
                     {response.evaluation.feedback}
                      </strong> 
                    </Typography>
                  </Paper>
                  
                  <Paper className="p-4 bg-green-50 border border-green-200">
                    <Typography
                      variant="body1"
                      className="text-green-700 font-semibold mb-2"
                    >
                      <strong>

                      Ideal Answer:
                      </strong>
                    </Typography>
                    <Typography variant="body2" className="text-black">
                      <strong>
                      {response.evaluation.idealAnswer}
                        </strong>
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
