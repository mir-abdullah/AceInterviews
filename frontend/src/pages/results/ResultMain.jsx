import React from 'react';

const ResultsMain = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-4">Interview results</h1>
        
        {/* Number of Interviews */}
        <div className="text-center text-gray-700 text-xl mb-2">0</div>
        <p className="text-center text-gray-500 mb-6">Interviews taken</p>

        {/* Button Group */}
        <div className="flex justify-center mb-6">
          <button className="px-4 py-2 mr-2 bg-orange-500 text-white font-semibold rounded-md focus:outline-none hover:bg-orange-600">
            Mock Interviews
          </button>
          <button className="px-4 py-2 bg-transparent border border-orange-500 text-orange-500 font-semibold rounded-md focus:outline-none hover:bg-orange-100">
            Custom Interviews
          </button>
        </div>

        {/* No Results Text */}
        <p className="text-center text-gray-400">No results yet.</p>
      </div>
    </div>
  );
};

export default ResultsMain;
