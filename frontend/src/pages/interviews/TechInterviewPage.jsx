import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  TextField,
  IconButton,
  Modal,
  CircularProgress,
  Stack,
  Avatar,
} from "@mui/material"; 
import { useTimer } from "react-timer-hook";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  startInterview,
} from "../../redux/slices/technicalInterview/technicalInterview.slice"; 
import FeedbackModal from "../../components/modals/FeedbackModal,"; 
import { motion } from "framer-motion";

const TechInterviewPage = () => {
  const location = useLocation(); 
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const { interviewId } = useParams();

  const { questions = [], difficulty } = location.state || {}; 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [answers, setAnswers] = useState({}); 
  const [showModal, setShowModal] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const handleFeedbackClose = () => {
    setShowFeedbackModal(false); 
    navigate("/dashboard/results", { state: { answers, difficulty } }); 
  };

  // Filter questions based on the selected difficulty level
  const filteredQuestions = questions.filter((q) => q.difficulty === difficulty);

  
  useEffect(() => {
    console.log("Filtered Questions", filteredQuestions);
    console.log("Difficulty", difficulty);
  }, [filteredQuestions, difficulty]);

  const { seconds, minutes, start, pause, restart } = useTimer({
    expiryTimestamp: new Date().getTime() + 90 * 1000,
    onExpire: () => handleSubmitAnswer(), 
  });

  const handleNextQuestion = useCallback(() => {
    if (transcribedText.trim()) {
      setAnswers((prev) => ({
        ...prev,
        [filteredQuestions[currentQuestionIndex]?._id]: transcribedText.trim(),
      }));
    }
    setTranscribedText(""); 
    setCurrentQuestionIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex < filteredQuestions.length) {
        restart(new Date().getTime() + 90 * 1000); 
        return nextIndex;
      } else {
        return prevIndex;
      }
    });
  }, [currentQuestionIndex, restart, transcribedText, filteredQuestions]);

  // Handle speech recognition
  useEffect(() => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event) =>
      setTranscribedText((prev) => prev + " " + event.results[0][0].transcript);
    recognition.onend = () => setIsRecording(false);
    if (isRecording) recognition.start();
    else recognition.stop();
    return () => recognition.stop();
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    start();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    pause();
  };

  const handleSubmitAnswer = () => {
    if (transcribedText.trim()) {
      setAnswers((prev) => ({
        ...prev,
        [filteredQuestions[currentQuestionIndex]?._id]: transcribedText.trim(),
      }));
    }

    if (currentQuestionIndex === filteredQuestions.length - 1) {
      // Last question - submit the interview
      setLoading(true); // Show loading indicator
      dispatch(
        startInterview({
          interviewTopicId: interviewId, // Assuming topicId is passed in the location state
          answers: {
            ...answers,
            [filteredQuestions[currentQuestionIndex]?._id]: transcribedText.trim(), // Include the last answer
          },
          difficulty,
        })
      )
        .then(() => {
          setLoading(false); // Hide loading indicator
          setShowModal(true); // Show completion modal
        })
        .catch((error) => {
          setLoading(false); // Hide loading indicator
          console.error("Error submitting interview:", error);
        });
    } else {
      handleNextQuestion();
    }
  };

  // Close modal and navigate to review page
  const handleCloseModal = () => {
    setShowModal(false);
    setShowFeedbackModal(true);
  };

  return (
    <Box
      sx={{
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f0f4f8",
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: 900,
          mb: 4,
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate("/dashboard/questions")}
          sx={{ textTransform: "none" }}
        >
          ← Back to Questions
        </Button>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#263238" }}>
          Question {currentQuestionIndex + 1} of {filteredQuestions.length}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            backgroundColor: "#e3f2fd",
            color: "#0288d1",
            padding: "8px 16px",
            borderRadius: "20px",
            fontWeight: "bold",
          }}
        >
          Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </Typography>
      </Box>

      {/* Timer Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#0288d1" }}>
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </Typography>
        <Typography variant="subtitle1" sx={{ ml: 2, color: "#424242" }}>
          / 1:30
        </Typography>
      </Box>

      {/* Question Card */}
      <Card
        sx={{
          padding: "30px",
          maxWidth: 800,
          width: "100%",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
          borderRadius: "20px",
          backgroundColor: "#ffffff",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ mb: 3, color: "#424242", fontWeight: "500" }}
        >
          {filteredQuestions[currentQuestionIndex]?.text || "No questions available"}
        </Typography>

        {/* Recording Controls */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 3,
          }}
        >
          <IconButton
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={loading}
            sx={{
              fontSize: 40,
              color: isRecording ? "error.main" : "primary.main",
              backgroundColor: isRecording ? "#ffebee" : "#e3f2fd",
              "&:hover": {
                backgroundColor: isRecording ? "#ffcdd2" : "#bbdefb",
              },
              padding: "12px",
              borderRadius: "50%",
              transition: "background-color 0.3s, transform 0.2s",
              transform: isRecording ? "scale(1.1)" : "scale(1)",
            }}
          >
            {isRecording ? <FaStop /> : <FaMicrophone />}
          </IconButton>
        </Box>

        {/* Answer Input */}
        <TextField
          label="Your Answer"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          value={transcribedText}
          onChange={(e) => setTranscribedText(e.target.value)}
          sx={{
            mb: 3,
            borderRadius: "12px",
            backgroundColor: "#fafafa",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#0288d1",
              },
              "&:hover fieldset": {
                borderColor: "#0277bd",
              },
            },
          }}
          placeholder="Start speaking or type your answer here..."
        />

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitAnswer}
            disabled={loading || !transcribedText.trim()}
            sx={{
              padding: "10px 30px",
              borderRadius: "20px",
              backgroundColor: "#0288d1",
              "&:hover": {
                backgroundColor: "#0277bd",
              },
              textTransform: "none",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
            }}
          >
            {currentQuestionIndex === filteredQuestions.length - 1
              ? "Submit Interview"
              : "Submit Answer"}
          </Button>
        </Box>
      </Card>

      {/* Show loading spinner when submitting the last question */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Modal for Interview Completion */}
      <Modal
        open={showModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "12px",
          }}
        >
          <Stack spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: 'green.500', width: 56, height: 56 }}>
              <Typography variant="h4" color="white">✓</Typography>
            </Avatar>
            <Typography id="modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              Interview Completed!
            </Typography>
            <Typography id="modal-description" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
              Your interview has been submitted successfully.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCloseModal}
              sx={{
                mt: 3,
                px: 4,
                py: 1.5,
                backgroundColor: '#0288d1',
                '&:hover': {
                  backgroundColor: '#0277bd',
                },
              }}
            >
              Close & Review
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Feedback Modal */}
      <FeedbackModal open={showFeedbackModal} handleClose={handleFeedbackClose} />
    </Box>
  );
};

export default TechInterviewPage;
