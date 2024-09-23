import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Card, Typography, TextField, IconButton, Modal, CircularProgress } from "@mui/material"; // Added CircularProgress
import { useTimer } from "react-timer-hook";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom"; // Add useNavigate
import { useDispatch } from "react-redux";
import { startInterview } from "../../redux/slices/technicalInterview/technicalInterview.slice"; // Import the startInterview action

const TechInterviewPage = () => {
  const location = useLocation(); // Get location object
  const navigate = useNavigate(); // Add navigation
  const dispatch = useDispatch();
  const { interviewId } = useParams();

  const { questions = [], difficulty } = location.state || {}; // Retrieve questions and difficulty from state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [answers, setAnswers] = useState({}); // Store answers in the format { questionId: answer }
  const [showModal, setShowModal] = useState(false); // State for showing modal
  const [loading, setLoading] = useState(false); // State for loading indicator

  const { seconds, minutes, start, pause, restart } = useTimer({
    expiryTimestamp: new Date().getTime() + 90 * 1000, // 90 seconds timer
    onExpire: () => handleNextQuestion(), // Use arrow function to ensure handleNextQuestion is defined
  });

  const handleNextQuestion = useCallback(() => {
    if (transcribedText.trim()) {
      setAnswers((prev) => ({
        ...prev,
        [questions[currentQuestionIndex]?._id]: transcribedText.trim(),
      }));
    }
    setTranscribedText(""); // Clear text field
    setCurrentQuestionIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex < questions.length) {
        restart(new Date().getTime() + 90 * 1000); // Reset timer for the next question
        return nextIndex;
      } else {
        return prevIndex;
      }
    });
  }, [currentQuestionIndex, restart, transcribedText, questions]);

  // Handle speech recognition
  useEffect(() => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event) => setTranscribedText(transcribedText + " " + event.results[0][0].transcript);
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
        [questions[currentQuestionIndex]?._id]: transcribedText.trim(),
      }));
    }

    if (currentQuestionIndex === questions.length - 1) {
      // Last question - wait for answers to be updated and then call startInterview
      setLoading(true); // Show loading indicator
      setTimeout(() => {
        dispatch(
          startInterview({
            interviewTopicId: interviewId, // Assuming topicId is passed in the location state
            answers: {
              ...answers,
              [questions[currentQuestionIndex]?._id]: transcribedText.trim(), // Include the last answer
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
      }, 0); // Slight delay to ensure state updates before dispatching
    } else {
      handleNextQuestion();
    }
  };

  // Close modal and navigate to review page
  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/dashboard/technical", { state: { answers, difficulty } }); // Navigate to review page
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
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mb: 4 }}>
        <Button variant="contained" color="primary">
          ← Back to Questions
        </Button>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#263238" }}>
          Question {currentQuestionIndex + 1}
        </Typography>
        <Button variant="contained" color="secondary" disabled={currentQuestionIndex >= questions.length - 1}>
          End & Review
        </Button>
      </Box>

      <Card
        sx={{
          padding: "30px",
          maxWidth: 700,
          width: "100%",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
          borderRadius: "20px",
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h5" align="center" sx={{ mb: 3, color: "#424242", fontWeight: "500" }}>
          {questions[currentQuestionIndex]?.text || "No questions available"}
        </Typography>

        <Typography variant="h6" align="center" sx={{ mb: 3, color: "#0288d1" }}>
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds} / 1:30
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
          <IconButton
            onClick={handleStartRecording}
            disabled={isRecording}
            sx={{
              fontSize: 40,
              color: isRecording ? "error.main" : "primary.main",
              backgroundColor: isRecording ? "#ffebee" : "#e3f2fd",
              "&:hover": {
                backgroundColor: isRecording ? "#ffcdd2" : "#bbdefb",
              },
              padding: "12px",
              borderRadius: "50%",
            }}
          >
            {isRecording ? <FaStop /> : <FaMicrophone />}
          </IconButton>

          <TextField
            label="Your Answer"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            value={transcribedText}
            onChange={(e) => setTranscribedText(e.target.value)}
            sx={{
              mt: 4,
              mb: 2,
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
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitAnswer}
            disabled={loading} // Disable button when loading
            sx={{
              padding: "10px 20px",
              borderRadius: "20px",
              backgroundColor: "#0288d1",
              "&:hover": {
                backgroundColor: "#0277bd",
              },
            }}
          >
            {currentQuestionIndex === questions.length - 1 ? "Submit Interview" : "Submit Answer"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleNextQuestion}
            sx={{
              padding: "10px 20px",
              borderRadius: "20px",
              borderColor: "#ff9800",
              color: "#ff9800",
              "&:hover": {
                backgroundColor: "#fff3e0",
              },
            }}
            disabled={currentQuestionIndex >= questions.length - 1}
          >
            Next Question
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
          <Typography id="modal-title" variant="h6" component="h2">
            Interview Completed!
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Your interview has been submitted successfully.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseModal}
            sx={{ mt: 3, display: "block", marginLeft: "auto" }}
          >
            Close & Review
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default TechInterviewPage;
  