  import React, { useState, useEffect, useCallback } from "react";
  import { Box, Button, Card, Typography, TextField, IconButton } from "@mui/material";
  import { useTimer } from "react-timer-hook";
  import { FaMicrophone, FaStop } from "react-icons/fa";
  import { useLocation } from "react-router-dom"; // Import useLocation

  const TechInterviewPage = () => {
    const location = useLocation(); // Get location object
    const { questions = [], difficulty } = location.state || {}; // Retrieve questions and difficulty from state
  console.log(questions)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [transcribedText, setTranscribedText] = useState("");
    const [answers, setAnswers] = useState({}); // Store answers in the format { questionId: answer }

    const { seconds, minutes, start, pause, reset, restart } = useTimer({
      expiryTimestamp: new Date().getTime() + 90 * 1000, // 90 seconds timer
      onExpire: () => handleNextQuestion(), // Use arrow function to ensure handleNextQuestion is defined
    });

    // Define handleNextQuestion before use
    const handleNextQuestion = useCallback(() => {
      if (transcribedText.trim()) {
        setAnswers((prev) => ({
          ...prev,
          [questions[currentQuestionIndex]?._id]: transcribedText.trim(),
        }));
      }
      setTranscribedText(""); // Clear text field

      // Move to the next question
      setCurrentQuestionIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex < questions.length) {
          restart(new Date().getTime() + 90 * 1000); // Reset timer for the next question
          return nextIndex;
        } else {
          // End of questions
          return prevIndex;
        }
      });
    }, [currentQuestionIndex, restart, transcribedText, questions]);

    useEffect(() => {
      // Initialize speech recognition
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = "en-US";
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscribedText(transcript);
      };
      recognition.onend = () => setIsRecording(false);

      if (isRecording) {
        recognition.start();
      } else {
        recognition.stop();
      }

      return () => {
        recognition.stop(); // Cleanup recognition when component unmounts or recording stops
      };
    }, [isRecording]);

    const handleStartRecording = () => {
      setIsRecording(true);
      start(); // Start timer when recording starts
    };

    const handleStopRecording = () => {
      setIsRecording(false);
      pause(); // Pause timer when recording stops
    };

    const handleSubmitAnswer = () => {
      if (transcribedText.trim()) {
        setAnswers((prev) => ({
          ...prev,
          [questions[currentQuestionIndex]?.id]: transcribedText.trim(),
        }));
      }
      handleNextQuestion();
    };
    console.log(answers)

    return (
      <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 4 }}>
          <Button variant="contained" color="primary">← Question Generation</Button>
          <Typography variant="h6">Question {currentQuestionIndex + 1}</Typography>
          <Button variant="contained" color="secondary" disabled={currentQuestionIndex >= questions.length - 1}>
            End & Review
          </Button>
        </Box>

        <Card sx={{ padding: '20px', maxWidth: 600, width: '100%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <Typography variant="h5" align="center" sx={{ mb: 2 }}>
            {questions[currentQuestionIndex]?.text || "No questions available"}
          </Typography>

          <Typography variant="h6" align="center" sx={{ mb: 2 }}>
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds} / 1:30
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <IconButton
              onClick={handleStartRecording}
              disabled={isRecording}
              sx={{ fontSize: 40, color: 'primary.main' }}
            >
              <FaMicrophone />
            </IconButton>
            {isRecording && (
              <IconButton onClick={handleStopRecording} sx={{ fontSize: 40, color: 'error.main' }}>
                <FaStop />
              </IconButton>
            )}

            <TextField
              label=" Answer"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              value={transcribedText}
              onChange={(e) => setTranscribedText(e.target.value)}
              inputProps={{ maxLength: 500 }}
              sx={{ mt: 4, mb: 2 }}
              placeholder="your Answer"
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSubmitAnswer}
              >
                Submit Answer
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleNextQuestion}
              >
                Next Question
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
    );
  };

  export default TechInterviewPage;
