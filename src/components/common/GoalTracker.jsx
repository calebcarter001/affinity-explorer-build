import React from 'react';
import { FiTrendingUp, FiCheckCircle, FiClock, FiAlertTriangle } from 'react-icons/fi';

const GoalTracker = ({ goals }) => {
  const {
    travelConcepts,
    validation,
    completeness,
    alignment
  } = goals;

  const getStatusColor = (progress, target) => {
    const ratio = progress / target;
    if (ratio >= 0.9) return 'text-green-500';
    if (ratio >= 0.7) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Goal Tracking Dashboard</h2>
      
      {/* Travel Concepts Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Travel Concepts</h3>
          <span className="text-sm text-gray-500">Last updated: {travelConcepts.lastUpdated}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FiCheckCircle className="text-green-500 mr-2" />
              <span>Completed</span>
            </div>
            <p className="text-2xl font-semibold mt-2">{travelConcepts.completed}</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FiClock className="text-blue-500 mr-2" />
              <span>In Progress</span>
            </div>
            <p className="text-2xl font-semibold mt-2">{travelConcepts.inProgress}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FiAlertTriangle className="text-gray-500 mr-2" />
              <span>Not Started</span>
            </div>
            <p className="text-2xl font-semibold mt-2">{travelConcepts.notStarted}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <FiTrendingUp className="text-purple-500 mr-2" />
              <span>Progress Rate</span>
            </div>
            <p className="text-2xl font-semibold mt-2">{travelConcepts.progressRate}%</p>
          </div>
        </div>
      </div>
      
      {/* Validation Metrics */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">Validation Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h4 className="text-sm text-gray-500 mb-2">Accuracy</h4>
            <div className="flex items-center">
              <span className={`text-2xl font-semibold ${getStatusColor(validation.accuracy.current, validation.accuracy.target)}`}>
                {validation.accuracy.current}%
              </span>
              <span className="text-sm text-gray-500 ml-2">/ {validation.accuracy.target}%</span>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="text-sm text-gray-500 mb-2">Coverage</h4>
            <div className="flex items-center">
              <span className="text-2xl font-semibold text-blue-500">
                {Math.round((validation.coverage.validated / validation.coverage.total) * 100)}%
              </span>
              <span className="text-sm text-gray-500 ml-2">({validation.coverage.validated}/{validation.coverage.total})</span>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="text-sm text-gray-500 mb-2">Confidence</h4>
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-green-500 font-medium">High: {validation.confidence.high}</span>
              </div>
              <div>
                <span className="text-yellow-500 font-medium">Med: {validation.confidence.medium}</span>
              </div>
              <div>
                <span className="text-red-500 font-medium">Low: {validation.confidence.low}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quarterly Goals */}
      <div>
        <h3 className="text-lg font-bold mb-4">Quarterly Alignment</h3>
        <div className="space-y-4">
          {alignment.quarterly.initiatives.map((initiative, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{initiative.name}</span>
                <span className={`${getStatusColor(initiative.progress, alignment.quarterly.target)}`}>
                  {initiative.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getStatusColor(initiative.progress, alignment.quarterly.target)}`}
                  style={{ width: `${initiative.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoalTracker; 