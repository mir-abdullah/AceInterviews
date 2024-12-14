import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  TextField,
  CircularProgress,
  Modal,
  Stack,
  Avatar,
} from "@mui/material";
import { motion } from "framer-motion";
import Webcam from "react-webcam";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams ,useNavigate} from "react-router-dom";
import {
  fetchInterview,
  addBehaviouralInterview,
} from "../../redux/slices/behaviouralInterview/behaviouralInterview.slice";

const Behavioral = () => {
  const { interviewId } = useParams();
  const dispatch = useDispatch();
  const interview = useSelector(
    (state) => state.behaviouralInterview.interview
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [statusCounts, setStatusCounts] = useState({
    Attentive: 0,
    Distracted: 0,
    Drowsy: 0,
  });
  const [answers, setAnswers] = useState({});
  const [isSpeechActive, setIsSpeechActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const webcamRef = useRef(null);
  const intervalIdRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const navigate =useNavigate()

  useEffect(() => {
    if (interviewId) {
      dispatch(fetchInterview(interviewId));
    }
  }, [dispatch, interviewId]);

  useEffect(() => {
    startVideoProcessing();
    handleSpeechStart();
    return () => {
      stopVideoProcessing();
      handleSpeechStop();
    };
  }, []);

  const handleSpeechStart = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;

    recognition.onresult = (event) => {
      const speechResult =
        event.results[event.results.length - 1][0].transcript;
      setAnswer((prev) => `${prev} ${speechResult}`);
    };

    recognition.onerror = (err) => {
      console.error("Speech recognition error:", err);
    };

    recognition.onend = () => {
      setIsSpeechActive(false);
    };

    speechRecognitionRef.current = recognition;
    setIsSpeechActive(true);
    recognition.start();
  };

  const handleSpeechStop = () => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      setIsSpeechActive(false);
    }
  };

  const startVideoProcessing = () => {
    intervalIdRef.current = setInterval(() => {
      captureFrame();
    }, 2000);
  };

  const stopVideoProcessing = () => {
    clearInterval(intervalIdRef.current);
  };

  const captureFrame = useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        try {
          const blob = await fetch(imageSrc).then((res) => res.blob());
          const formData = new FormData();
          formData.append("file", blob, "image.jpg");

          const response = await axios.post(
            "http://localhost:8000/analyze_frame",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              withCredentials: true,
            }
          );

          const status = response.data[0].status;
          setStatusCounts((prev) => ({
            ...prev,
            [status]: prev[status] + 1,
          }));
        } catch (err) {
          console.error("Error analyzing frame:", err);
        }
      }
    }
  }, []);

  const handleSubmitAnswer = () => {
    const questionId = interview?.questions?.[currentQuestionIndex]?._id;
  
    // Make sure the last question's answer is added to the answers state
    if (questionId) {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: {
          answer,
          statusCounts: { ...statusCounts },
        },
      }));
    }
  
    // Reset the state for the next question or finish the interview
    setAnswer("");
    setStatusCounts({ Attentive: 0, Distracted: 0, Drowsy: 0 });
  
    // Move to the next question or reset to the first question if it's the last
    setCurrentQuestionIndex((prev) => {
      const nextIndex = prev + 1;
      return nextIndex < (interview?.questions?.length || 1) ? nextIndex : prev;
    });
  
    // If it's the last question, submit the interview
    if (currentQuestionIndex === (interview?.questions?.length || 1) - 1) {
      handleSubmitInterview();  // Submit the interview when the last question is answered
    }
  };
  
  

  const handleSubmitInterview = async () => {
    setLoading(true);
    try {
      // Ensure the last question's answer is added to the answers before submission
      const questionId = interview?.questions?.[currentQuestionIndex]?._id;
      if (questionId && answer) {
        setAnswers((prev) => ({
          ...prev,
          [questionId]: {
            answer,
            statusCounts: { ...statusCounts },
          },
        }));
      }
  
      // Dispatch the action to save the answers
      await dispatch(addBehaviouralInterview({ interviewTopicId: interviewId, answers }));
      setShowModal(true);  // Show success modal after submission
    } catch (err) {
      console.error("Error submitting interview:", err);
    } finally {
      setLoading(false);
    }
  };
  

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/dashboard/results", { state: { answers } }); 

  };

  return (
    <Box className="p-5 md:flex gap-8" sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 8, padding: 5 }}>
      <Box className="md:w-1/2 w-full" sx={{ width: { xs: "100%", md: "50%" } }}>
        <Card className="p-6 space-y-6 shadow-lg h-full flex flex-col justify-between" sx={{ padding: 6, boxShadow: 3, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <Typography variant="h6" className="font-bold text-neutralBlack mt-4" sx={{ fontWeight: "bold", color: "#263238" }}>
            Q. {interview?.questions?.[currentQuestionIndex]?.text || "Loading question..."}
          </Typography>

          <TextField
            multiline
            rows={4}
            placeholder="Type your answer here or use speech..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            sx={{ mt: 2, width: "100%" }}
          />

          <Button
            variant="contained"
            color="success"
            onClick={currentQuestionIndex === (interview?.questions?.length || 1) - 1 ? handleSubmitInterview : handleSubmitAnswer}
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : currentQuestionIndex === (interview?.questions?.length || 1) - 1 ? "Submit Interview" : "Submit Answer"}
          </Button>
        </Card>
      </Box>

      <Box className="md:w-1/2 w-full flex flex-col items-center mt-6 md:mt-0" sx={{ width: { xs: "100%", md: "50%" }, display: "flex", flexDirection: "column", alignItems: "center", marginTop: { xs: 6, md: 0 } }}>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="rounded-lg overflow-hidden shadow-lg mb-4" style={{ borderRadius: "8px", overflow: "hidden", width: "100%", maxWidth: "600px", aspectRatio: "4/3" }}>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </motion.div>

        {/* <Typography variant="body2" color="textSecondary">
          Attentive: {statusCounts.Attentive}, Distracted: {statusCounts.Distracted}, Drowsy: {statusCounts.Drowsy}
        </Typography> */}
      </Box>

      <Modal open={showModal} onClose={handleCloseModal} aria-labelledby="modal-title" aria-describedby="modal-description">
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: "12px" }}>
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
              sx={{ mt: 3, px: 4, py: 1.5 }}
            >
              Close & Review
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default Behavioral;
