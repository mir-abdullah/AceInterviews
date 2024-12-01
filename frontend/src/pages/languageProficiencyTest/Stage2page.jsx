import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { getAllResponseQuestions } from "../../redux/slices/languageProficiencyTest/responseQuestion.slice"; // Import the slice to get the questions
import WaveSurfer from "wavesurfer.js"; // Import WaveSurfer for waveform display
import { submitResponseAnswers } from "../../redux/slices/languageProficiencyTest/languageTest.slice"; // Import the submit action

const Stage2Page = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { testId } = location.state || {}; // Retrieve testId passed from Stage1

  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question index
  const [answers, setAnswers] = useState({}); // Track user's answers
  const [wavesurfer, setWavesurfer] = useState(null); // Store the WaveSurfer instance
  const [loadingQuestions, setLoadingQuestions] = useState(true); // Track loading state for questions
  const [stageCompleted, setStageCompleted] = useState(false); // Track if Stage 2 is completed

  const responseQuestions = useSelector((state) => state.responseQuestions.responseQuestions);

  useEffect(() => {
    if (testId) {
      dispatch(getAllResponseQuestions()).then(() => {
        setLoadingQuestions(false); // Set loadingQuestions to false once the questions are fetched
      });
    } else {
      navigate("/dashboard/language-test");
    }
  }, [dispatch, testId, navigate]);

  useEffect(() => {
    // Check if the container exists and if there's a valid question audio before initializing WaveSurfer
    const waveformContainer = document.getElementById("waveform");
    
    if (responseQuestions[currentQuestionIndex]?.questionAudio && waveformContainer && !wavesurfer) {
      const wave = WaveSurfer.create({
        container: "#waveform", // Container where the waveform will be rendered
        waveColor: "#4CAF50", // Green wave color
        progressColor: "#388E3C", // Green progress bar color
        height: 80, // Height of the waveform
        barWidth: 3, // Bar width of the waveform
        cursorColor: "#388E3C", // Green cursor color
      });
      wave.load(responseQuestions[currentQuestionIndex]?.questionAudio);
      setWavesurfer(wave);
    } else if (wavesurfer && responseQuestions[currentQuestionIndex]?.questionAudio) {
      wavesurfer.load(responseQuestions[currentQuestionIndex]?.questionAudio);
    }
  }, [currentQuestionIndex, responseQuestions, wavesurfer]);

  const handlePlayRecording = () => {
    wavesurfer.playPause(); // Toggle play and pause
  };

  const handleAnswerSelect = (event) => {
    const optionId = event.target.value;
    setAnswers((prev) => ({
      ...prev,
      [responseQuestions[currentQuestionIndex]?._id]: optionId,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < responseQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setLoading(true); // Show the loader when submitting
      // Submit the answers and navigate to Stage 3
      dispatch(submitResponseAnswers({ testId, responseAnswers: answers }))
        .then(() => {
          setLoading(false); // Hide the loader after submission
          setStageCompleted(true); // Mark Stage 2 as completed
        })
        .catch((error) => {
          setLoading(false); // Hide the loader on error
          console.error("Error submitting answers:", error);
        });
    }
  };

  // Conditional rendering: show loading indicator until questions are loaded
  if (loadingQuestions) {
    return (
      <Box sx={{ textAlign: "center", marginTop: "20px" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Loading questions, please wait...
        </Typography>
      </Box>
    );
  }

  // Display message if no questions are available after loading
  if (!responseQuestions.length) {
    return (
      <Box sx={{ textAlign: "center", marginTop: "20px" }}>
        <Typography variant="h6">No questions available. Please try again later.</Typography>
      </Box>
    );
  }

  // Display Stage 2 completion message after all questions are answered
  if (stageCompleted) {
    return (
        <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center min-h-screen"
      >
        <Card
          sx={{
            padding: "20px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "15px",
            textAlign: "center",
            backgroundColor: "#ffffff",
            width: '100%',
            maxWidth: "600px",
            "&:hover": {
              boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#4CAF50", mb: 2 }}
            >
              Stage 2 Completed!
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 3, color: "#616161" }}
            >
              You have answered all the questions. Click below to proceed to Stage 3.
            </Typography>
            <Button
              variant="contained"
              sx={{
                mt: 4,
                backgroundColor: "#388E3C",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#4CAF50",
                },
                width: "200px",
                height: "50px",
                borderRadius: "8px",
              }}
              onClick={() => navigate("/dashboard/stage3", { state: { testId } })}
            >
              Proceed to Stage 3
            </Button>
          </CardContent>
        </Card>
      </motion.div>
      
      
    );
  }

  return (
    <Box
      sx={{
        padding: "40px",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card
          sx={{
            padding: "30px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "15px",
            textAlign: "center",
            backgroundColor: "#ffffff",
            width: "600px",
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#4CAF50", mb: 2 }}>
              Stage 2: Listening Test
            </Typography>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Listen to the recording
            </Typography>

            {/* Waveform with Play and Pause */}
            <Box id="waveform" sx={{ width: "100%", marginBottom: 3 }} />

            {/* Play/Pause Button and Waveform in the Same Line */}
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#4CAF50",
                  color: "#ffffff",
                  borderRadius: "50%",
                  minWidth: "56px",
                  height: "56px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 2, // Adds some space between the button and waveform
                }}
                onClick={handlePlayRecording}
              >
                {wavesurfer?.isPlaying() ? "❚❚" : "▶️"}
              </Button>
              <Typography variant="body1" sx={{ fontWeight: "bold", color: "#4CAF50" }}>
                {wavesurfer?.isPlaying() ? "Pause" : "Play"}
              </Typography>
            </Box>

            {/* Question and Radio Buttons */}
            <Typography variant="h6" sx={{ mb: 2 }}>
              {responseQuestions[currentQuestionIndex]?.text}
            </Typography>
            <FormControl component="fieldset" sx={{ width: "100%", marginBottom: 3 }}>
              <RadioGroup
                value={answers[responseQuestions[currentQuestionIndex]?._id] || ""}
                onChange={handleAnswerSelect}
              >
                {responseQuestions[currentQuestionIndex]?.options.map((option) => (
                  <FormControlLabel
                    key={option._id}
                    value={option.text}
                    control={<Radio />}
                    label={option.text}
                    sx={{ marginBottom: 1 }}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            {/* Next/Submit Button */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#388E3C",
                  color: "#ffffff",
                  borderRadius: "8px",
                  padding: "10px 20px",
                }}
                onClick={handleNextQuestion}
                disabled={loading} // Disable the button while loading
              >
              {loading ? <CircularProgress size={24} color="inherit" /> : currentQuestionIndex === responseQuestions.length - 1 ? "Submit" : "Next Question"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Stage2Page;
