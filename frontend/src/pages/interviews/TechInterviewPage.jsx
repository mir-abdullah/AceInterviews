import React, { useState } from "react";
import { Box, Button, Card, Typography, TextField, Paper } from "@mui/material";
import { useTimer } from "react-timer-hook";
import { ReactMic } from "react-mic";
import { FaMicrophone } from "react-icons/fa";
const questions = [
  {
    id: 1,
    text: "Can you walk me through a specific project where you had to collaborate closely with both product and engineering teams to implement innovative design solutions?",
  },
  {
    id: 2,
    text: "Describe a challenging technical problem you've faced and how you resolved it.",
  },
  {
    id: 3,
    text: "How do you ensure the quality of your code and what practices do you follow?",
  },
  {
    id: 4,
    text: "Explain a time when you had to make a critical decision under pressure. What was the outcome?",
  },
  {
    id: 5,
    text: "How do you approach learning new technologies, and can you give an example of a technology you've recently adopted?",
  },
];

const TechInterviewPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const { seconds, minutes, start, pause, reset } = useTimer({
    expiryTimestamp: 90,
  });

  const handleStartRecording = () => {
    setIsRecording(true);
    start();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    pause();
  };

  const onStop = (blob) => {
    setRecordedBlob(blob);
  };

  const handleRetry = () => {
    setRecordedBlob(null);
    reset();
    setTypedAnswer("");
    setIsTyping(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      handleRetry();
    }
  };

  const handleSubmitAnswer = () => {
    // Store the answer (either audio or text)
    // Here you could send the data to a backend or save it in localStorage
    handleNextQuestion();
  };

  return (
    <Box className="p-6 ">
      <Box className="flex justify-between items-center mb-6">
        <Button>← Question Generation</Button>
        <Typography variant="h6">
          Question {currentQuestionIndex + 1}
        </Typography>
        <Button disabled={currentQuestionIndex < questions.length - 1}>
          End & Review
        </Button>
      </Box>

      <Card className="p-6 shadow-lg ">
        <Typography variant="h5" align="center" className="mb-4">
          {questions[currentQuestionIndex].text}
        </Typography>

        <Typography variant="h3" align="center" className="mb-4">
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds} / 1:30
        </Typography>

        {!isTyping ? (
          <Box className="flex flex-col items-center p-8 ">
            <Button
              onClick={handleStartRecording}
              disabled={isRecording}
              startIcon={<FaMicrophone />}
              className="mb-4"
            >
              Record Your Answer
            </Button>
            <ReactMic
              record={isRecording}
              className="sound-wave"
              onStop={onStop}
              mimeType="audio/mp3"
              strokeColor="#440693"
              backgroundColor="#55af0f"
            />
            {isRecording && (
              <Button onClick={handleStopRecording}>Stop Recording</Button>
            )}
            {recordedBlob && (
              <Box className="flex mt-4 gap-4">
                <Button onClick={handleRetry}>Retry</Button>
                <Button onClick={handleSubmitAnswer}>Submit Answer</Button>
              </Box>
            )}
            <Button onClick={() => setIsTyping(true)} className="mt-4 p-5">
              Or type your answer
            </Button>
          </Box>
        ) : (
          <Box className="flex flex-col items-center">
            <TextField
              label="Type your answer"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              inputProps={{ maxLength: 500 }}
              helperText={`${500 - typedAnswer.length} chars left`}
              className="mb-4"
            />
            <Button
              onClick={handleSubmitAnswer}
              className="bg-black text-white"
            >
              Submit for AI feedback
            </Button>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default TechInterviewPage;
