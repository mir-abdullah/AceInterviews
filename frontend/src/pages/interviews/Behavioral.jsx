// src/components/Behavioral/Behavioral.jsx

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import Webcam from "react-webcam";
import { FaMicrophone, FaCamera, FaStop } from "react-icons/fa";
import axios from "axios";

const questions = [
  {
    id: 1,
    text: "Tell me about a time you had to work under pressure to meet a tight deadline in a previous kitchen environment.",
  },
  {
    id: 2,
    text: "Describe a situation where you had to deal with a difficult coworker.",
  },
  {
    id: 3,
    text: "Give me an example of a time you demonstrated leadership skills.",
  },
  {
    id: 4,
    text: "Tell me about a time you had to make a difficult decision at work.",
  },
  {
    id: 5,
    text: "Describe a scenario where you had to adapt to significant changes at work.",
  },
];

const Behavioral = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("");
  const [gaze, setGaze] = useState("");
  const [error, setError] = useState(null);
  const webcamRef = useRef(null);
  const intervalIdRef = useRef(null);

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex(
      (prev) => (prev - 1 + questions.length) % questions.length
    );
  };

  const handleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setStatus("");
      setGaze("");
      // Start capturing images every 2 seconds
      intervalIdRef.current = setInterval(() => {
        captureImage();
      }, 2000);
    } else {
      setIsRecording(false);
      clearInterval(intervalIdRef.current);
    }
  };

  // Capture the image from webcam
  const captureImage = useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();

      // Send the image to FastAPI server
      if (imageSrc) {
        try {
          const blob = await fetch(imageSrc).then((res) => res.blob());

          const formData = new FormData();
          formData.append("file", blob, "image.jpg");

          // Post to FastAPI backend
          const response = await axios.post(
            "http://localhost:8000/analyze_frame",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          // Ensure response.data.status and response.data.gaze are strings
          const receivedStatus =
            typeof response.data.status === "string"
              ? response.data.status
              : response.data.status?.message || "N/A";
          const receivedGaze =
            typeof response.data.gaze === "string"
              ? response.data.gaze
              : response.data.gaze?.message || "N/A";

          // Update the UI with the result from the backend
          setStatus(receivedStatus);
          setGaze(receivedGaze);
          setError(null);
        } catch (err) {
          console.error("Error sending image to backend:", err);
          setError(
            err.response?.data?.message || "Failed to analyze the frame."
          );
        }
      }
    }
  }, []);

  const handleVideoSave = useCallback(() => {
    const videoElement = document.querySelector("video");
    if (videoElement) {
      const stream = videoElement.srcObject;
      if (stream) {
        const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
        const chunks = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          const videoUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = videoUrl;
          link.download = `Interview_Question_${currentQuestionIndex + 1}.webm`;
          link.click();
        };

        recorder.start();
        setTimeout(() => {
          recorder.stop();
        }, 1000); // Stop recording after 1 second
      }
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  return (
    <Box
      className="p-5 md:flex gap-8"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 8,
        padding: 5,
      }}
    >
      {/* Question Card */}
      <Box
        className="md:w-1/2 w-full"
        sx={{
          width: { xs: "100%", md: "50%" },
        }}
      >
        <Card
          className="p-6 space-y-6 shadow-lg h-full flex flex-col justify-between"
          sx={{
            padding: 6,
            boxShadow: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Question Navigation */}
          <Box>
            <Box
              className="flex justify-between flex-wrap p-6"
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                padding: 2,
              }}
            >
              {questions.map((question, index) => (
                <Button
                  key={question.id}
                  variant={
                    currentQuestionIndex === index ? "contained" : "outlined"
                  }
                  onClick={() => setCurrentQuestionIndex(index)}
                  className="rounded-full mb-2"
                  sx={{
                    margin: 0.5,
                    borderRadius: "50px",
                    textTransform: "none",
                  }}
                >
                  Question #{index + 1}
                </Button>
              ))}
            </Box>

            {/* Current Question */}
            <Typography
              variant="h6"
              className="font-bold text-neutralBlack mt-4"
              sx={{ fontWeight: "bold", color: "#263238" }}
            >
              Q. {questions[currentQuestionIndex].text}
            </Typography>

            {/* Status Icons */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: 2,
                gap: 1,
              }}
            >
              <FaMicrophone size={20} color="#4CAF50" />
              <Typography variant="body1" color="text.secondary">
                {isRecording ? "Recording..." : "Not Recording"}
              </Typography>
            </Box>
          </Box>

          {/* Note Section */}
          <Paper
            variant="outlined"
            className="p-3 mt-6"
            sx={{
              backgroundColor: "#e8f5e9",
              borderColor: "#4CAF4F",
              padding: 2,
            }}
          >
            <Typography variant="body2" className="font-semibold text-gray-800">
              <span className="font-semibold text-green-700">Note:</span> Click
              on "Start Recording" when you want to answer the question. At the end
              of the interview, we will provide you with feedback along with the
              correct answers for each question to compare with your responses.
            </Typography>
          </Paper>
        </Card>
      </Box>

      {/* Webcam and Controls */}
      <Box
        className="md:w-1/2 w-full flex flex-col items-center mt-6 md:mt-0"
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: { xs: 6, md: 0 },
        }}
      >
        {/* Webcam Feed */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-lg overflow-hidden shadow-lg mb-4"
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            width: "100%", 
            maxWidth: "600px",
            aspectRatio: "4/3", 
          }}
        >
          <Webcam
            ref={webcamRef}
            audio={isRecording}
            screenshotFormat="image/jpeg"
            videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
            style={{
              width: "100%", // Makes it responsive to the container
              height: "100%", // Ensure it fills the container
              objectFit: "cover", // Covers the box without distorting the feed
            }}
          />
        </motion.div>

        {/* Control Buttons */}
        <Box
          className="flex gap-4"
          sx={{
            display: "flex",
            gap: 2,
            marginTop: 2,
          }}
        >
          <Button
            variant="contained"
            startIcon={isRecording ? <FaStop /> : <FaMicrophone />}
            onClick={handleRecording}
            className="bg-brandPrimary"
            sx={{
              backgroundColor: isRecording ? "#f44336" : "#4CAF50",
              "&:hover": {
                backgroundColor: isRecording ? "#d32f2f" : "#388E3C",
              },
              textTransform: "none",
            }}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
          <Button
            variant="contained"
            startIcon={<FaCamera />}
            onClick={handleVideoSave}
            className="bg-purple-500"
            sx={{
              backgroundColor: "#9C27B0",
              "&:hover": {
                backgroundColor: "#7B1FA2",
              },
              textTransform: "none",
            }}
            disabled={!isRecording}
          >
            Submit Answer
          </Button>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ marginTop: 2, width: "100%" }}>
            {error}
          </Alert>
        )}

        {/* Analysis Results */}
        {!error && (
          <Box className="mt-4" sx={{ textAlign: "center", marginTop: 2 }}>
            <Typography variant="h6">Status: {status || "N/A"}</Typography>
            <Typography variant="h6">Gaze: {gaze || "N/A"}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Behavioral;
