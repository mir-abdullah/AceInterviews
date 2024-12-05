import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPreperationMaterial,
  resetPreperation,
} from "../../redux/slices/preperation/preperation.slice";

const PreperationHub = () => {
  const [requirements, setRequirements] = useState("");
  const dispatch = useDispatch();
  const { preperationMaterial, status, error } = useSelector((state) => state.preperation || {});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (requirements.trim()) {
      dispatch(fetchPreperationMaterial(requirements));
    }
  };

  const handleBack = () => {
    setRequirements("");
    dispatch(resetPreperation());
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-lime-100 to-cyan-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-3xl p-8">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
          Preparation Hub
        </h1>
        <p className="text-gray-700 text-center mb-8">
          Enter your job application requirements below, and we'll provide
          personalized preparation materials tailored to your needs.
        </p>

        {status === "idle" || status === "failed" ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter job application requirements..."
              rows="6"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              required
            ></textarea>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              disabled={status === "loading"}
            >
              Get Preparation
            </button>
          </form>
        ) : null}

        {/* Loading progress bar */}
        {status === "loading" && (
          <div className="mt-6 relative w-full h-2 bg-gray-300 rounded-lg overflow-hidden">
            <div className="absolute left-0 top-0 h-2 w-full bg-blue-500 animate-progress-bar"></div>
          </div>
        )}

        {/* Display preparation material */}
        {status === "succeeded" && (
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Preparation Material:</h2>
            <div>
              <h3 className="font-semibold">Essential Skills:</h3>
              <ul className="list-disc list-inside ml-4 text-sm text-gray-700">
                {preperationMaterial.essentialSkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>

              <h3 className="font-semibold mt-4">Resources:</h3>
              <ul className="list-disc list-inside ml-4 text-sm text-gray-700">
                {preperationMaterial.resources.map((resource, index) => (
                  <li key={index}>{resource}</li>
                ))}
              </ul>

              <h3 className="font-semibold mt-4">Common Questions:</h3>
              <ul className="list-disc list-inside ml-4 text-sm text-gray-700">
                {preperationMaterial.commonQuestions.map((question, index) => (
                  <li key={index}>{question}</li>
                ))}
              </ul>

              <h3 className="font-semibold mt-4">Application Tips:</h3>
              <ul className="list-disc list-inside ml-4 text-sm text-gray-700">
                {preperationMaterial.applicationTips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={handleBack}
              className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
            >
              Back
            </button>
          </div>
        )}

        {/* Error message */}
        {status === "failed" && (
          <div className="mt-8 bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg">
            <p className="text-sm">{error || "An error occurred. Please try again."}</p>
            <button
              onClick={handleBack}
              className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
            >
              Back
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes progress-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-progress-bar {
          animation: progress-bar 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PreperationHub;
