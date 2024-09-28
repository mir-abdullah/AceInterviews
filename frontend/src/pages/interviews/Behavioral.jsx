import React, { useState, useCallback, useEffect, useRef } from "react";
import { Box, Button, Card, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";
import Webcam from "react-webcam";
import { FaMicrophone, FaCamera } from "react-icons/fa";
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
  const [videoSrc, setVideoSrc] = useState(null);
  const [status, setStatus] = useState("");
  const [gaze, setGaze] = useState("");
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
    setIsRecording(!isRecording);

    // If starting recording, begin sending images every 2 seconds
    if (!isRecording) {
      intervalIdRef.current = setInterval(() => {
        captureImage();
      }, 1000);
    } else {
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
          const response = await axios.post("http://localhost:8000/analyze_frame", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          // Update the UI with the result from the backend
          setStatus(response.data.status);
          setGaze(response.data.gaze);
        } catch (error) {
          console.error("Error sending image to backend:", error);
        }
      }
    }
  }, [webcamRef]);

  const handleVideoSave = useCallback(() => {
    const videoElement = document.querySelector("video");
    const videoBlob = new Blob([videoElement.src], { type: "video/webm" });
    const videoUrl = URL.createObjectURL(videoBlob);
    setVideoSrc(videoUrl);
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = `Interview_Question_${currentQuestionIndex + 1}.webm`;
    link.click();
  }, [currentQuestionIndex]);

  useEffect(() => {
    return () => {
      // Clear the interval when the component is unmounted
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  return (
    <Box className="p-5 md:flex gap-8 ">
      <Box className="md:w-1/2  w-full  ">
        <Card className="p-6 space-y-6 shadow-lg h-full flex flex-col justify-between">
          <Box>
            <Box className="flex justify-between flex-wrap p-6">
              {questions.map((question, index) => (
                <Button
                  key={question.id}
                  variant={currentQuestionIndex === index ? "contained" : "outlined"}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className="rounded-full mb-2"
                >
                  Question #{index + 1}
                </Button>
              ))}
            </Box>
            <Typography variant="h6" className="font-bold text-neutralBlack mt-4">
              Q. {questions[currentQuestionIndex].text}
            </Typography>
            <FaMicrophone size={20} className="mt-4" />
          </Box>

          <Paper
            variant="outlined"
            className="p-3 mt-6"
            sx={{
              backgroundColor: "#e8f5e9",
              borderColor: "#4CAF4F",
            }}
          >
            <Typography variant="body2" className="font-semibold text-gray-800">
              <span className="font-semibold text-green-700">Note:</span> Click
              on Record Answer when you want to answer the question. At the end
              of the interview, we will give you feedback along with the correct
              answer for each question and your answer to compare it.
            </Typography>
          </Paper>
        </Card>
      </Box>

      <Box className="md:w-1/2 w-full flex flex-col items-center mt-6 md:mt-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-lg overflow-hidden shadow-lg mb-4"
        >
          <Webcam
            ref={webcamRef}
            audio={isRecording}
            screenshotFormat="image/jpeg"
            videoConstraints={{ width: 320, height: 320 }}
            style={{ borderRadius: "50%", width: "720px", height: "680px" }}
          />
        </motion.div>

        <Box className="flex gap-4">
          <Button
            variant="contained"
            startIcon={<FaCamera />}
            onClick={handleRecording}
            className="bg-brandPrimary"
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleVideoSave}
            className="bg-purple-500"
          >
            Submit Answer
          </Button>
        </Box>

        {/* Display analysis results */}
        <Box className="mt-4">
          <Typography variant="h6">Status: {status}</Typography>
          <Typography variant="h6">Gaze: {gaze}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Behavioral;


// import React, { useState, useCallback } from "react";
// import { Box, Button, Card, Typography, Paper } from "@mui/material";
// import { motion } from "framer-motion";  // Import motion here
// import Webcam from "react-webcam";
// import { FaMicrophone, FaCamera } from "react-icons/fa";

// const questions = [
//   {
//     id: 1,
//     text: "Tell me about a time you had to work under pressure to meet a tight deadline in a previous kitchen environment.",
//   },
//   {
//     id: 2,
//     text: "Describe a situation where you had to deal with a difficult coworker.",
//   },
//   {
//     id: 3,
//     text: "Give me an example of a time you demonstrated leadership skills.",
//   },
//   {
//     id: 4,
//     text: "Tell me about a time you had to make a difficult decision at work.",
//   },
//   {
//     id: 5,
//     text: "Describe a scenario where you had to adapt to significant changes at work.",
//   },
// ];

// const Behavioral = () => {  
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [isRecording, setIsRecording] = useState(false);
//   const [videoSrc, setVideoSrc] = useState(null);

//   const handleNextQuestion = () => {
//     setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
//   };

//   const handlePrevQuestion = () => {
//     setCurrentQuestionIndex(
//       (prev) => (prev - 1 + questions.length) % questions.length
//     );
//   };

//   const handleRecording = () => {
//     setIsRecording(!isRecording);
//   };

//   const handleVideoSave = useCallback(async () => {
//     const videoElement = document.querySelector("video");
    
//     if (videoElement) {
//       const mediaRecorder = videoElement.srcObject; // Get the MediaStream from the video element
//       const videoBlob = new Blob([mediaRecorder], { type: "video/webm" });
      
//       // Prepare to send the video blob to the server
//       const formData = new FormData();
//       formData.append('video', videoBlob, `Interview_Question_${currentQuestionIndex + 1}.webm`);
  
//       // Send the video to the server
//       try {
//         const response = await fetch("http://localhost:5000/submit_recording", {
//           method: 'POST',
//           body: formData,
//         });
//         const data = await response.json();
//         if (response.ok) {
//           alert(data.message); // Display success message
//         } else {
//           alert(data.error); // Display error message
//         }
//       } catch (error) {
//         console.error("Error uploading video:", error);
//         alert("Error uploading video");
//       }
//     }
//   }, [currentQuestionIndex]);
  

//   return (
//     <Box className="p-5 md:flex gap-8 ">
//       <Box className="md:w-1/2  w-full  ">
//         <Card className="p-6 space-y-6 shadow-lg h-full flex flex-col justify-between">
//           <Box>
//             <Box className="flex justify-between flex-wrap p-6">
//               {questions.map((question, index) => (
//                 <Button
//                   key={question.id}
//                   variant={
//                     currentQuestionIndex === index ? "contained" : "outlined"
//                   }
//                   onClick={() => setCurrentQuestionIndex(index)}
//                   className="rounded-full mb-2"
//                 >
//                   Question #{index + 1}
//                 </Button>
//               ))}
//             </Box>
//             <Typography
//               variant="h6"
//               className="font-bold text-neutralBlack mt-4"
//             >
//               Q. {questions[currentQuestionIndex].text}
//             </Typography>
//             <FaMicrophone size={20} className="mt-4" />
//           </Box>

//           <Paper
//             variant="outlined"
//             className="p-3 mt-6"
//             sx={{
//               backgroundColor: "#e8f5e9",
//               borderColor: "#4CAF4F",
//             }}
//           >
//             <Typography variant="body2" className="font-semibold text-gray-800">
//               <span className="font-semibold text-green-700">Note:</span> Click
//               on Record Answer when you want to answer the question. At the end
//               of the interview, we will give you feedback along with the correct
//               answer for each question and your answer to compare it.
//             </Typography>
//           </Paper>
//         </Card>
//       </Box>

//       <Box className="md:w-1/2 w-full flex flex-col items-center mt-6 md:mt-0">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5 }}
//           className="rounded-lg overflow-hidden shadow-lg mb-4"
//         >
//           <Webcam
//             audio={isRecording}
//             videoConstraints={{ width: 320, height: 320 }}
//             style={{ borderRadius: "50%", width: "720px", height: "680px" }}
//           />
//         </motion.div>

//         <Box className="flex gap-4">
//           <Button
//             variant="contained"
//             startIcon={<FaCamera />}
//             onClick={handleRecording}
//             className="bg-brandPrimary"
//           >
//             {isRecording ? "Stop Recording" : "Start Recording"}
//           </Button>
//           <Button
//             variant="contained"
//             color="secondary"
//             onClick={handleVideoSave}
//             className="bg-purple-500"
//           >
//             Submit Answer
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Behavioral;



