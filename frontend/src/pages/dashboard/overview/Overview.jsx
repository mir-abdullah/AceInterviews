import React from "react";
import { Grid } from "@mui/material";
import BehavioralProgress from "../cards/BehavioralProgress";
import TechnicalProgress from "../cards/TechnicalProgress";
import MainCard from "../MainCard";
import Interviews from "../Interviews";
import QuizProgressCard from "../cards/QuizProgress";

const interview = [
  {
    name: "Website Redesign",
    type: "Web Development",
    date: "2024-03-15",
    members: ["Alice", "Bob", "Charlie"],
    files: 4,
    progress: 20,
  },
  // ... other interview objects
];

const behavoiralInterview = [
  {
    name: "Behavioral Interviews",
    type: "Human Behaviour",
    date: "2024-03-15",
    members: ["Alice", "Bob", "Charlie"],
    tries: 6,
    progress: 80,
  },
];

const Overview = () => {
  return (
    <div className="p-5 space-y-8">
      {/* MainCard Section */}
      <MainCard />

      {/* Grid Layout for Behavioral and Technical Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Behavioral Progress Card */}
        <BehavioralProgress />

        {/* quiz card*/}
        <QuizProgressCard />

        {/* Technical Progress Card */}
        <TechnicalProgress />
      </div>

      {/* Previous Interviews Section */}

      {/* <div className="flex justify-between items-center py-4">
        <h1 className="text-lg font-semibold">Previous Interviews</h1>
        <p className="text-sm underline text-indigo-600">See all</p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
        {behavoiralInterview &&
          behavoiralInterview.map((interview, index) => (
            <Interviews key={index} interview={interview} />
          ))}
      </div> */}

      {/* <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
        {interview &&
          interview.map((interview, index) => (
=======
      <div className="flex justify-between items-center py-4">
        <h1 className="text-lg font-semibold">Previous Interviews</h1>
        <p className="text-sm underline text-indigo-600">See all</p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
        {behavoiralInterview &&
          behavoiralInterview.map((interview, index) => (

            <Interviews key={index} interview={interview} />
          ))}
      </div>


      <QuizCard />
      {/* Quiz Section */}

//       <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
//         {interview &&
//           interview.map((interview, index) => (
//             <Interviews key={index} interview={interview} />
//           ))}
//       </div>

//       {/* Quiz Section */}
//       <QuizCard />

    </div>
  );
};

export default Overview;
