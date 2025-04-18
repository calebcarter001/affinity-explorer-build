import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiShield } from 'react-icons/fi';

const AccuracyMetrics = ({
  currentRate,
  target = 75,
  trend,
  lastSixMonths,
  confidence = {
    high: 142,
    medium: 68,
    low: 38,
    threshold: 0.85
  }
}) => {
  const progress = (currentRate / target) * 100;
  const isImproving = trend[trend.length - 1] >= trend[trend.length - 2];
  
  const getStatusColor = (value) => {
    if (value >= 90) return 'text-green-500';
    if (value >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const total = confidence.high + confidence.medium + confidence.low;
  const confidenceRate = ((confidence.high + confidence.medium) / total) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Validation Accuracy</h3>
        <div className="flex items-center">
          {isImproving ? (
            <FiTrendingUp className="text-green-500 mr-2" />
          ) : (
            <FiTrendingDown className="text-red-500 mr-2" />
          )}
          <span className={`text-sm font-medium ${isImproving ? 'text-green-500' : 'text-red-500'}`}>
            {Math.abs(trend[trend.length - 1] - trend[trend.length - 2]).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Current Rate vs Target */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-3xl font-bold">
            <span className={getStatusColor(currentRate)}>{currentRate}%</span>
            <span className="text-gray-400 text-lg ml-2">/ {target}%</span>
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${getStatusColor(currentRate).replace('text', 'bg')}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Confidence Levels */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FiShield className="text-blue-500 mr-2" />
            <h4 className="text-sm font-medium text-gray-600">Confidence Distribution</h4>
          </div>
          <span className="text-sm font-medium">
            Threshold: {confidence.threshold * 100}%
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">High Confidence</span>
            <span className="text-green-600 font-medium">{confidence.high}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${(confidence.high / total) * 100}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Medium Confidence</span>
            <span className="text-yellow-600 font-medium">{confidence.medium}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full"
              style={{ width: `${(confidence.medium / total) * 100}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Low Confidence</span>
            <span className="text-red-600 font-medium">{confidence.low}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full"
              style={{ width: `${(confidence.low / total) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Overall Confidence Rate</span>
            <span className={`font-medium ${confidenceRate >= confidence.threshold * 100 ? 'text-green-600' : 'text-red-600'}`}>
              {confidenceRate.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-4">6-Month Trend</h4>
        <div className="flex items-end justify-between h-32">
          {trend.map((value, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className={`w-4 rounded-t transition-all duration-300 ${getStatusColor(value).replace('text', 'bg')}`}
                style={{ height: `${value}%` }}
              />
              <span className="text-xs text-gray-500 mt-2">{lastSixMonths[index]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Current</p>
            <p className={`text-lg font-semibold ${getStatusColor(currentRate)}`}>{currentRate}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Target Gap</p>
            <p className="text-lg font-semibold">{Math.max(0, target - currentRate)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Trend</p>
            <p className={`text-lg font-semibold ${isImproving ? 'text-green-500' : 'text-red-500'}`}>
              {isImproving ? '+' : '-'}{Math.abs(trend[trend.length - 1] - trend[0]).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccuracyMetrics; 