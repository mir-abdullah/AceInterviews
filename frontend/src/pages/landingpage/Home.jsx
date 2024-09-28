import React from "react";
import { Button } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ReactTyped } from "react-typed"; // Import ReactTyped from the new library
import { motion } from "framer-motion";
import banner1 from "../../assets/svgs/banner1.svg";
import banner2 from "../../assets/svgs/banner2.svg";
import banner3 from "../../assets/svgs/banner3.svg";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-neutralSilver" id="home">
      <div className="px-4 lg:px-14 max-w-screen-2xl mx-auto min-h-screen h-screen flex justify-center items-center">
        {/* Hero Section with Carousel */}
        <div className="w-full">
          <Carousel
            autoPlay
            interval={5000}
            infiniteLoop
            showThumbs={false}
            showArrows={true}
            showStatus={false}
          >
            {/* First Slide */}
            <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <img src={banner1} alt="AceInterview Banner" />
              </motion.div>

              <div className="md:w-1/2 text-center md:text-left">
                <h1 className="text-5xl mb-4 font-semibold text-neutralDGrey md:w-3/4 leading-snug">
                  <ReactTyped
                    strings={["AI-Powered Interview Preparation"]}
                    typeSpeed={40}
                    backSpeed={50}
                    loop
                  />
                </h1>
                <p className="text-neutralGrey text-base mb-8">
                  Ace your next job interview with real-time feedback and
                  AI-driven mock interviews.
                </p>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#4CAF4F", color: "#FFF" }}
                  className="px-7 py-2 hover:bg-neutralDGrey"
                  onClick={() => navigate("/signup")}
                >
                  Get Started
                </Button>
              </div>
            </div>

            {/* Second Slide */}
            <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <img src={banner2} alt="Interactive Behavioral Interviews" />
              </motion.div>

              <div className="md:w-1/2 text-center md:text-left">
                <h1 className="text-5xl mb-4 font-semibold text-neutralDGrey md:w-3/4 leading-snug">
                  <ReactTyped
                    strings={["Interactive Behavioral Interviews"]}
                    typeSpeed={40}
                    backSpeed={50}
                    loop
                  />
                </h1>
                <p className="text-neutralGrey text-base mb-8">
                  Prepare for behavioral interviews by practicing your answers
                  with personalized questions and feedback.
                </p>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#4CAF4F", color: "#FFF" }}
                  className="px-7 py-2 hover:bg-neutralDGrey"
                  onClick={() => navigate("/signup")}
                >
                  Start Practicing
                </Button>
              </div>
            </div>

            {/* Third Slide */}
            <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <img src={banner3} alt="Real-Time Feedback & Insights" />
              </motion.div>

              <div className="md:w-1/2 text-center md:text-left">
                <h1 className="text-5xl mb-4 font-semibold text-neutralDGrey md:w-3/4 leading-snug">
                  <ReactTyped
                    strings={["Real-Time Feedback & Insights"]}
                    typeSpeed={40}
                    backSpeed={50}
                    loop
                  />
                </h1>
                <p className="text-neutralGrey text-base mb-8">
                  Receive instant feedback on your responses and learn how to
                  improve for your next interview.
                </p>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#4CAF4F", color: "#FFF" }}
                  className="px-7 py-2 hover:bg-neutralDGrey"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Home;
