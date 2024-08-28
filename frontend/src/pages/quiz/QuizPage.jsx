import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { motion } from "framer-motion";

// Lover boy you have to  correct the routing of this page according to the logic right now the its simply rendered as the child or dashboard id.
// Right now the Every Quiz start button will only render the Quiz data shown in this.
const quizData = {
  id: 1,
  title: "JavaScript Quiz",
  questions: [
    {
      id: 1,
      question:
        "What is the output of the following code: `console.log(typeof null);`?",
      options: ["object", "null", "undefined", "number"],
      correctAnswer: "object",
    },
    {
      id: 2,
      question: "Which of the following is not a JavaScript data type?",
      options: ["String", "Boolean", "Float", "Object"],
      correctAnswer: "Float",
    },
    // Add more questions as needed
  ],
};

//   const { id } = useParams(); // Get quiz ID from URL
// Fetch or use static data for quiz questions based on the ID
// hey Lover boy  please compelet the part i am leaving have some understanding im currently very bussy I should be
// able to complete the whole backend and frontend part but due to unforseen events occuring and me having other things
//to priorities please complete this without any RR ps. dont cry please.

const QuizPage = () => {
  const { id } = useParams(); // Get quiz ID from URL (not used directly here as we're using static data)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const handleNextQuestion = () => {
    if (
      selectedAnswer === quizData.questions[currentQuestionIndex].correctAnswer
    ) {
      setScore(score + 1);
    }
    setSelectedAnswer(""); // Reset the selected answer
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <Box
      sx={{
        padding: "20px",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {!showResult ? (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
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
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#4CAF4F", mb: 2 }}
              >
                {quizData.title}
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {quizData.questions[currentQuestionIndex].question}
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="quiz"
                  name="quiz"
                  value={selectedAnswer}
                  onChange={handleAnswerChange}
                >
                  {quizData.questions[currentQuestionIndex].options.map(
                    (option, index) => (
                      <FormControlLabel
                        key={index}
                        value={option}
                        control={<Radio />}
                        label={option}
                        sx={{
                          marginBottom: "10px",
                          "& .MuiRadio-root": {
                            color: "#4CAF4F",
                          },
                          "& .MuiFormControlLabel-label": {
                            color: "#263238",
                          },
                        }}
                      />
                    )
                  )}
                </RadioGroup>
              </FormControl>
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
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
              >
                {currentQuestionIndex < quizData.questions.length - 1
                  ? "Next Question"
                  : "Submit Quiz"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md text-center"
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
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "#4CAF4F", mb: 2 }}
              >
                Quiz Completed!
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Your Score: {score}/{quizData.questions.length}
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
                onClick={() => window.location.reload()}
              >
                Retry Quiz
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Box>
  );
};

export default QuizPage;
