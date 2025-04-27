import React from 'react';

const CompatibilityScore = ({ score, show }) => {
  if (!show) return null;
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Compatibility Score</h4>
        <span className="text-lg font-bold text-green-600">{score}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div
          className="bg-green-600 h-2.5 rounded-full"
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        This score indicates how well these affinities work together for property matching.
      </p>
    </div>
  );
};

export default CompatibilityScore; 