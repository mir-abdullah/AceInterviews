import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { evaluateQuiz } from "../../redux/slices/quiz/quiz.slice"; // Adjust the import path accordingly

const QuizPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { quizTopicId } = useParams();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { questions, difficulty } = state;

  // Filter questions based on the selected difficulty
  const filteredQuestions = questions.filter(
    (question) => question.difficulty === difficulty
  );

  const handleAnswerChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer) {
      const currentQuestion = filteredQuestions[currentQuestionIndex];

      // Update answers with the current question ID and selected answer
      const updatedAnswers = {
        ...answers,
        [currentQuestion._id]: selectedAnswer, // Store selected answer with question's ID as the key
      };

      // Check if the selected answer is correct
      const correctAnswer = currentQuestion.options.find(
        (option) => option.text === selectedAnswer
      );

      // Increment score if the answer is correct
      if (correctAnswer && correctAnswer.isCorrect) {
        setScore((prevScore) => prevScore + 1);
      }

      // If on the last question, submit the quiz
      if (currentQuestionIndex === filteredQuestions.length - 1) {
        // Prepare the final submission data
        const finalSubmission = {
          answers: updatedAnswers, // Use the updated answers object
          difficulty, // Include difficulty level
        };

        // Dispatch the quiz evaluation action with the quizTopicId, answers, and difficulty
        dispatch(evaluateQuiz({ quizTopicId, ...finalSubmission }))
          .unwrap()
          .then(() => {
            setShowResult(true); // Show results after successful submission
          })
          .catch((error) => {
            console.error("Error evaluating quiz:", error); // Handle error
          });
      } else {
        // Proceed to next question
        setAnswers(updatedAnswers); // Update the state with the new answers
        setSelectedAnswer(""); // Clear selected answer for the next question
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1); // Move to the next question
      }
    }
  };

  if (!filteredQuestions.length) {
    return <Typography>No questions available for this difficulty.</Typography>;
  }

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
      {showResult ? (
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
                Your Score: {score}/{filteredQuestions.length}
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
                onClick={() => navigate("/dashboard/quizes")}
              >
                Back to Quizzes
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
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
                {filteredQuestions.title}
              </Typography>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {filteredQuestions[currentQuestionIndex].questionText}
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="quiz"
                  name="quiz"
                  value={selectedAnswer}
                  onChange={handleAnswerChange}
                >
                  {filteredQuestions[currentQuestionIndex].options.map(
                    (option) => (
                      <FormControlLabel
                        key={option._id}
                        value={option.text}
                        control={
                          <Radio
                            sx={{
                              color: "#4CAF4F",
                              "&.Mui-checked": {
                                color: "#388E3C",
                              },
                            }}
                          />
                        }
                        label={
                          <Typography
                            sx={{ color: "#263238", fontWeight: "500" }}
                          >
                            {option.text}
                          </Typography>
                        }
                        sx={{
                          marginBottom: "10px",
                          "& .MuiFormControlLabel-label": {
                            fontSize: "1rem",
                          },
                        }}
                      />
                    )
                  )}
                </RadioGroup>
              </FormControl>
              <Box sx={{ mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={(currentQuestionIndex / filteredQuestions.length) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 5,
                    backgroundColor: "#e0e0e0",
                  }}
                />
              </Box>
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
                {currentQuestionIndex < filteredQuestions.length - 1
                  ? "Next Question"
                  : "Submit Quiz"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Box>
  );
};

export default QuizPage;
