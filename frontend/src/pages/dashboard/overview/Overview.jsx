import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";
import MainCard from "../MainCard";
import Interviews from "../Interviews";
import QuizCard from "../QuizCard";
const interview = [
  {
    name: "Website Redesign",
    type: "Web Development",
    date: "2024-03-15",
    members: ["Alice", "Bob", "Charlie"],
    files: 4,
    progress: 20,
  },
  {
    name: "Mobile App Development",
    type: "Mobile Application",
    date: "2024-02-10",
    members: ["David", "Eva", "Frank"],
    attempts: 9,
    progress: 80,
  },
  {
    name: "Marketing Campaign",
    type: "Marketing",
    date: "2024-04-25",
    members: ["Grace", "Henry", "Ivy"],
    files: 1,
    progress: 18,
  },
  {
    name: "Product Launch",
    type: "Product Management",
    date: "2024-01-05",
    members: ["Jack", "Kelly", "Liam"],
    files: 2,
    progress: 6,
  },
];
const behavoiralInterview = [
  {
    name: "Behavioul Interviews",
    type: "Human Behaviour",
    date: "2024-03-15",
    members: ["Alice", "Bob", "Charlie"],
    tries: 6,
    progress: 80,
  },
];

const Overview = () => {
  return (
    <div className="p-5">
      <div className="grid xl-col-1 gap-4">
        <MainCard />
      </div>
      <div>
        <div className="flex justify-between items-center py-4">
          <h1 className="text-lg font-semibold">Previous Interviews</h1>
          <p className="text-sm underline text-indigo-600">See all</p>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
          {behavoiralInterview &&
            behavoiralInterview.map((behavoiralInterview, index) => (
              <Interviews key={index} interview={behavoiralInterview} />
            ))}
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
          {interview &&
            interview.map((interview, index) => (
              <Interviews key={index} interview={interview} />
            ))}
        </div>

        <QuizCard />
      </div>
    </div>
  );
};

export default Overview;
