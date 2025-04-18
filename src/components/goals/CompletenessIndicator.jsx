import React from 'react';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const CompletenessIndicator = ({
  subScores,
  overall,
  priority,
  trend
}) => {
  const getStatusColor = (complete, total, required) => {
    const percentage = (complete / total) * 100;
    if (percentage >= 90) return 'text-green-500';
    if (percentage >= 70) return 'text-yellow-500';
    return required ? 'text-red-500' : 'text-orange-500';
  };

  const getProgressColor = (value) => {
    if (value >= 90) return 'bg-green-500';
    if (value >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Completeness Score</h3>
        <div className="flex items-center">
          <span className="text-2xl font-bold">{overall.percentage}%</span>
        </div>
      </div>

      {/* Sub-scores Grid */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {Object.entries(subScores).map(([key, data]) => (
          <div key={key} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className="capitalize text-sm font-medium">{key}</span>
                {data.required && (
                  <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">Required</span>
                )}
              </div>
              <div className="flex items-center">
                {data.complete === data.complete + data.incomplete ? (
                  <FiCheckCircle className="text-green-500 mr-2" />
                ) : (
                  <FiAlertCircle className={`${getStatusColor(data.complete, data.complete + data.incomplete, data.required)} mr-2`} />
                )}
                <span className={`font-medium ${getStatusColor(data.complete, data.complete + data.incomplete, data.required)}`}>
                  {Math.round((data.complete / (data.complete + data.incomplete)) * 100)}%
                </span>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${getStatusColor(data.complete, data.complete + data.incomplete, data.required).replace('text', 'bg')}`}
                style={{ width: `${(data.complete / (data.complete + data.incomplete)) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Missing Scores Priority */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-600 mb-4">Missing Scores by Priority</h4>
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <FiAlertCircle className="text-red-500 mr-2" />
                <p className="text-sm font-medium text-gray-800">High Priority</p>
              </div>
              <div className="flex items-center">
                <span className="text-xl font-semibold text-red-600">{priority.high}</span>
                <span className="text-sm text-gray-500 ml-2">items</span>
              </div>
            </div>
            <div className="w-full bg-red-100 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${(priority.high / (priority.high + priority.medium + priority.low)) * 100}%` }}
              />
            </div>
            <p className="text-sm text-red-700 mt-2">Requires immediate attention</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <FiAlertCircle className="text-yellow-500 mr-2" />
                <p className="text-sm font-medium text-gray-800">Medium Priority</p>
              </div>
              <div className="flex items-center">
                <span className="text-xl font-semibold text-yellow-600">{priority.medium}</span>
                <span className="text-sm text-gray-500 ml-2">items</span>
              </div>
            </div>
            <div className="w-full bg-yellow-100 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${(priority.medium / (priority.high + priority.medium + priority.low)) * 100}%` }}
              />
            </div>
            <p className="text-sm text-yellow-700 mt-2">Plan to address within sprint</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <FiAlertCircle className="text-blue-500 mr-2" />
                <p className="text-sm font-medium text-gray-800">Low Priority</p>
              </div>
              <div className="flex items-center">
                <span className="text-xl font-semibold text-blue-600">{priority.low}</span>
                <span className="text-sm text-gray-500 ml-2">items</span>
              </div>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${(priority.low / (priority.high + priority.medium + priority.low)) * 100}%` }}
              />
            </div>
            <p className="text-sm text-blue-700 mt-2">Can be addressed in future sprints</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Missing Items</span>
            <span className="text-lg font-semibold">
              {priority.high + priority.medium + priority.low}
            </span>
          </div>
        </div>
      </div>

      {/* Trend Indicator */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="text-sm font-medium text-gray-600 mb-4">Completeness Trend</h4>
        <div className="flex items-end space-x-2 h-24">
          {trend.map((value, index) => (
            <div
              key={index}
              className={`w-8 rounded-t ${getProgressColor(value)}`}
              style={{ height: `${value}%` }}
            >
              <span className="text-xs text-gray-500 mt-2 block text-center">
                {value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompletenessIndicator; 