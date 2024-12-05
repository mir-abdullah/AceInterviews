import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
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
  CircularProgress,
} from "@mui/material";
import { fetchMcqQuestions } from "../../redux/slices/languageProficiencyTest/mcqQuestion.slice";
import { submitMcqAnswers } from "../../redux/slices/languageProficiencyTest/languageTest.slice";

const Stage1Page = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { testId } = location.state || {}; // Retrieve testId passed from IntroPage
  const questions = useSelector((state) => state.mcq.questions);
  const isLoadingQuestions = useSelector((state) => state.mcq.loading); // Assume `loading` is part of mcq slice
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state for submission

  useEffect(() => {
    if (testId) {
      dispatch(fetchMcqQuestions());
    } else {
      navigate("/dashboard/language-test");
    }
  }, [dispatch, testId, navigate]);

  const handleAnswerChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const handleNextQuestion = () => {
    if (!selectedAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    const updatedAnswers = {
      ...answers,
      [currentQuestion._id]: selectedAnswer,
    };

    if (currentQuestionIndex === questions.length - 1) {
      setLoading(true); // Set loading to true before submitting
      dispatch(submitMcqAnswers({ testId, mcqAnswers: updatedAnswers }))
        .unwrap()
        .then(() => {
          setShowResult(true);
          setLoading(false); // Set loading to false after submission
        })
        .catch((error) => {
          console.error("Error submitting answers:", error);
          setLoading(false); // Set loading to false in case of error
        });
    } else {
      setAnswers(updatedAnswers);
      setSelectedAnswer("");
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  if (isLoadingQuestions) {
    // Show loading spinner while questions are being fetched
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f7fa",
        }}
      >
        <CircularProgress size={50} sx={{ color: "#4CAF4F" }} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading Questions...
        </Typography>
      </Box>
    );
  }

  if (!questions.length) {
    return (
      <Box sx={{ textAlign: "center", marginTop: "20px" }}>
        <Typography variant="h6">
          No questions available. Please try again later.
        </Typography>
      </Box>
    );
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
              width: "100%",
              maxWidth: "600px",
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
                Stage 1 Completed!
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
                onClick={() =>
                  navigate(`/dashboard/stage2`, { state: { testId } })
                }
              >
                Proceed to Stage 2
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
                Stage 1: MCQs
              </Typography>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {questions[currentQuestionIndex]?.questionText}
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="mcqs"
                  name="mcqs"
                  value={selectedAnswer}
                  onChange={handleAnswerChange}
                >
                  {questions[currentQuestionIndex]?.options.map((option) => (
                    <FormControlLabel
                      key={option._id}
                      value={option.text}
                      control={
                        <Radio
                          sx={{
                            color: "#4CAF4F",
                            "&.Mui-checked": { color: "#388E3C" },
                          }}
                        />
                      }
                      label={option.text}
                      sx={{
                        marginBottom: "10px",
                        "& .MuiFormControlLabel-label": {
                          fontSize: "1rem",
                        },
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              <Box sx={{ mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={(currentQuestionIndex / questions.length) * 100}
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
                disabled={!selectedAnswer || loading}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#ffffff" }} />
                ) : currentQuestionIndex < questions.length - 1 ? (
                  "Next Question"
                ) : (
                  "Submit"
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Box>
  );
};

export default Stage1Page;
