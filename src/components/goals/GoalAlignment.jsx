import React from 'react';
import { FiTarget, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';

const GoalAlignment = ({
  quarterly,
  yearly
}) => {
  const getStatusColor = (current, target) => {
    const ratio = current / target;
    if (ratio >= 0.9) return 'text-green-500';
    if (ratio >= 0.7) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium mb-6">Goal Alignment</h3>

      {/* Quarterly Goals */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-600">Quarterly Targets</h4>
          <span className={`text-lg font-semibold ${getStatusColor(quarterly.current, quarterly.target)}`}>
            {quarterly.current}% / {quarterly.target}%
          </span>
        </div>

        {/* Initiatives Progress */}
        <div className="space-y-4">
          {quarterly.initiatives.map((initiative, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <FiTarget className="text-gray-400 mr-2" />
                  <span className="font-medium">{initiative.name}</span>
                </div>
                <span className={`font-medium ${getStatusColor(initiative.progress, quarterly.target)}`}>
                  {initiative.progress}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${getStatusColor(initiative.progress, quarterly.target).replace('text', 'bg')}`}
                  style={{ width: `${initiative.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Yearly Projection */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-sm font-medium text-gray-600">Yearly Projection</h4>
          <span className={`px-2 py-1 rounded text-sm font-medium ${getRiskBadgeColor(yearly.riskLevel)}`}>
            {yearly.riskLevel} Risk
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <FiTarget className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">Target</span>
            </div>
            <p className="text-2xl font-semibold">{yearly.target}%</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <FiTrendingUp className="text-gray-500 mr-2" />
              <span className="text-sm text-gray-600">Projected</span>
            </div>
            <p className={`text-2xl font-semibold ${getStatusColor(yearly.projected, yearly.target)}`}>
              {yearly.projected}%
            </p>
          </div>
        </div>

        {/* Gap Analysis */}
        {yearly.gap > 0 && (
          <div className="mt-6 bg-orange-50 rounded-lg p-4">
            <div className="flex items-center">
              <FiAlertTriangle className="text-orange-500 mr-2" />
              <div>
                <p className="font-medium text-orange-800">Performance Gap Detected</p>
                <p className="text-sm text-orange-600 mt-1">
                  Current projection is {yearly.gap}% below the yearly target.
                  Additional focus needed to meet objectives.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalAlignment; 