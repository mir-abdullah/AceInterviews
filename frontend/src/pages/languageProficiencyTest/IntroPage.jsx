import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Import useDispatch to dispatch actions
import { startTest } from '../../redux/slices/languageProficiencyTest/languageTest.slice';

const IntroPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleStartTest = async () => {
    try {
      // Dispatch the startTest action (no need for userId)
      const action = await dispatch(startTest());
      const { testId } = action.payload; // Assuming response contains testId
      console.log(testId);

      // Navigate to the Stage1MCQ page with the testId
      navigate(`/dashboard/stage1`, { state: { testId } });
    } catch (err) {
      console.error("Error starting the test:", err);
      alert('Unable to start the test. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 px-4 sm:px-8 md:px-12">
      <div className="text-center px-6 md:px-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-600 mb-4">
          Welcome to the Language Proficiency Test
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-6">
          This test is designed to assess your language skills in three stages:
        </p>
        <ul className="list-disc text-left text-gray-700 mb-6 space-y-2 px-6 sm:px-10 md:px-14">
          <li><strong>Stage 1:</strong> Multiple-choice questions to test grammar and vocabulary.</li>
          <li><strong>Stage 2:</strong> A written response task to evaluate coherence and expression.</li>
          <li><strong>Stage 3:</strong> A speech task to analyze fluency and pronunciation.</li>
        </ul>
        <p className="text-base sm:text-lg text-gray-600">
          Get ready to demonstrate your proficiency. Click the button below to begin.
        </p>
      </div>
      <button
        onClick={handleStartTest}
        className="mt-8 px-6 py-3 bg-green-600 text-white text-lg sm:text-xl font-medium rounded shadow hover:bg-black transition duration-300"
      >
        Start the Test
      </button>
    </div>
  );
};

export default IntroPage;
