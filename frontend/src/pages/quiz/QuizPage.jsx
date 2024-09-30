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
  Fade,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { evaluateQuiz } from "../../redux/slices/quiz/quiz.slice"; 

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
  const [loading, setLoading] = useState(false); // Loading state

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
        [currentQuestion._id]: selectedAnswer,
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
        setLoading(true); // Set loading to true when submitting
        const finalSubmission = {
          answers: updatedAnswers,
          difficulty,
        };

        dispatch(evaluateQuiz({ quizTopicId, ...finalSubmission }))
          .unwrap()
          .then(() => {
            setShowResult(true);
          })
          .catch((error) => {
            console.error("Error evaluating quiz:", error);
          })
          .finally(() => {
            setLoading(false); // Reset loading when done
          });
      } else {
        setAnswers(updatedAnswers);
        setSelectedAnswer("");
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
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
        backgroundColor: "#e8f0fe",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
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
              padding: "30px",
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
          key={currentQuestionIndex} // Use key to trigger reanimation on question change
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }} // Exit animation for the question
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg" // Increased width
        >
          <Card
            sx={{
              padding: "30px", // Increased padding
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
                {filteredQuestions[currentQuestionIndex].title}
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
                            sx={{
                              color: "#263238",
                              fontWeight: "500",
                              fontSize: "1.2rem", // Increased font size for options
                            }}
                          >
                            {option.text}
                          </Typography>
                        }
                        sx={{
                          marginBottom: "15px", // Increased margin bottom
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
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#ffffff", mr: 1 }} />
                ) : (
                  (currentQuestionIndex < filteredQuestions.length - 1
                    ? "Next Question"
                    : "Submit Quiz")
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Box>
  );
};

export default QuizPage;
