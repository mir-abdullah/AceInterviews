import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import {
  fetchMostClickedTechnicalInterview,
  fetchMostClickedBehavioralInterview,
  fetchMostClickedQuiz,
} from '../../redux/slices/admin/statistics/statisctics'; // Update the path accordingly

const InterviewsChart = () => {
  const dispatch = useDispatch();

  // Selectors to get all interviews and quizzes
  const technicalInterviews = useSelector(state => state.stats.mostClickedTechnicalInterview) || [];
  const behavioralInterviews = useSelector(state => state.stats.mostClickedBehavioralInterview) || [];
  const quizzes = useSelector(state => state.stats.mostClickedQuiz) || []; // Ensure this key exists in your slice

  useEffect(() => {
    dispatch(fetchMostClickedTechnicalInterview());
    dispatch(fetchMostClickedBehavioralInterview());
    dispatch(fetchMostClickedQuiz());
  }, [dispatch]);

  // Prepare the data for each chart
  const technicalData = Array.isArray(technicalInterviews)
    ? technicalInterviews.map(interview => ({
        title: interview.title,
        clicks: interview.clicks,
      }))
    : [];

  const behavioralData = Array.isArray(behavioralInterviews)
    ? behavioralInterviews.map(interview => ({
        title: interview.title,
        clicks: interview.clicks,
      }))
    : [];

  const quizData = Array.isArray(quizzes)
    ? quizzes.map(quiz => ({
        title: quiz.title,
        clicks: quiz.clicks,
      }))
    : [];

  return (
    <div className="flex flex-col items-center"> {/* Centering the charts horizontally */}
      <div className="flex flex-row justify-between w-full p-2"> {/* First row for the first two charts */}
        <div className="w-full sm:w-1/2 p-2"> {/* Responsive width for each chart container */}
          <h2 className="text-lg font-bold mb-2">Technical Interviews Stats</h2>
          <BarChart width={600} height={300} data={technicalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="clicks" fill="#8884d8" />
          </BarChart>
        </div>

        <div className="w-full sm:w-1/2 p-2"> {/* Responsive width for each chart container */}
          <h2 className="text-lg font-bold mb-2">Behavioral Interviews Stats</h2>
          <BarChart width={600} height={300} data={behavioralData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="clicks" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>

      <div className="w-full p-2 flex justify-center"> {/* Centering the last chart */}
        <div className="w-full sm:w-1/2"> {/* Responsive width for the last chart container */}
          <h2 className="text-lg font-bold mb-2">Quizzes Stats</h2>
          <BarChart width={600} height={300} data={quizData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="clicks" fill="#ffc658" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default InterviewsChart;
