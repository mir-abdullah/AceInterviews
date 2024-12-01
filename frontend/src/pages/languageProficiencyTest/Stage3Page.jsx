import React, { useState, useEffect } from "react";
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
import { FaMicrophone, FaStop } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpeechQuestions } from "../../redux/slices/languageProficiencyTest/speechQuestion.slice";
import { submitSpeechAnswers } from "../../redux/slices/languageProficiencyTest/languageTest.slice";
import FeedbackModal from "../../components/modals/FeedbackModal,"; 

const Stage3Page = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { testId } = location.state || {}; // Retrieve testId passed from Stage1
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [answers, setAnswers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [testSubmitting, setTestSubmitting] = useState(false); // Track test submission state

  const { speechQuestions, loading, error } = useSelector(
    (state) => state.speechQuestion
  );

  const handleFeedbackClose = () => {
    setShowFeedbackModal(false);
    navigate("/dashboard/results");
  };

  useEffect(() => {
    dispatch(fetchSpeechQuestions());
  }, [dispatch]);

  const handleNextQuestion = () => {
    if (transcribedText.trim()) {
      setAnswers((prev) => ({
        ...prev,
        [speechQuestions[currentQuestionIndex]?._id]: transcribedText.trim(),
      }));
    }
    setTranscribedText("");
    setCurrentQuestionIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex < speechQuestions.length ? nextIndex : prevIndex;
    });
  };

  useEffect(() => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
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
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleSubmitAnswer = async () => {
    if (transcribedText.trim()) {
      setAnswers((prev) => ({
        ...prev,
        [speechQuestions[currentQuestionIndex]?._id]: transcribedText.trim(),
      }));
    }
    if (currentQuestionIndex === speechQuestions.length - 1) {
      setTestSubmitting(true); // Set loading state to true when test is being submitted
      // Dispatch submitSpeechAnswers with testId and answers
      await dispatch(submitSpeechAnswers({ testId, speechAnswers: answers }))
        .unwrap()
        .then(() => {
          setShowModal(true);
        })
        .catch((error) => {
          console.error("Error submitting speech answers:", error);
        })
        .finally(() => {
          setTestSubmitting(false); // Reset the loading state once submission is complete
        });
    } else {
      handleNextQuestion();
    }
  };

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
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: 900,
          mb: 4,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#263238" }}>
          Question {currentQuestionIndex + 1} of {speechQuestions.length}
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
          {speechQuestions[currentQuestionIndex]?.text ||
            "No questions available"}
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
            {testSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : currentQuestionIndex === speechQuestions.length - 1 ? (
              "Submit Test"
            ) : (
              "Submit Answer"
            )}
          </Button>
        </Box>
      </Card>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Modal for Test Completion */}
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
            <Avatar sx={{ bgcolor: "green.500", width: 56, height: 56 }}>
              <Typography variant="h4" color="white">
                ✓
              </Typography>
            </Avatar>
            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: "bold", textAlign: "center" }}
            >
              Test Completed!
            </Typography>
            <Typography
              id="modal-description"
              sx={{ mt: 2, textAlign: "center", color: "text.secondary" }}
            >
              Your test has been submitted successfully.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCloseModal}
              sx={{
                mt: 3,
                px: 4,
                py: 1.5,
                backgroundColor: "#0288d1",
                "&:hover": { backgroundColor: "#0277bd" },
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              View Results
            </Button>
          </Stack>
        </Box>
      </Modal>
       {/* Feedback Modal */}
       <FeedbackModal open={showFeedbackModal} handleClose={handleFeedbackClose} />
    </Box>
  );
};

export default Stage3Page;
