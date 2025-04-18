import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

const AffinityScore = ({
  name,
  score,
  previousScore,
  trend,
  category,
  className = ''
}) => {
  // Calculate trend percentage
  const calculateTrend = () => {
    if (!previousScore) return 0;
    return ((score - previousScore) / previousScore) * 100;
  };

  // Get trend icon
  const getTrendIcon = () => {
    const trendValue = calculateTrend();
    if (trendValue > 0) {
      return <FiTrendingUp className="text-green-500" />;
    } else if (trendValue < 0) {
      return <FiTrendingDown className="text-red-500" />;
    }
    return <FiMinus className="text-gray-500" />;
  };

  // Get score color
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          <span className="text-sm text-gray-500">{category}</span>
        </div>
        <div className="flex items-center">
          {getTrendIcon()}
          <span className={`ml-2 font-bold ${getScoreColor()}`}>
            {score}%
          </span>
        </div>
      </div>

      {previousScore && (
        <div className="flex items-center text-sm text-gray-500">
          <span>Previous: {previousScore}%</span>
          <span className="mx-2">•</span>
          <span className={calculateTrend() >= 0 ? 'text-green-500' : 'text-red-500'}>
            {calculateTrend().toFixed(1)}% change
          </span>
        </div>
      )}

      {trend && (
        <div className="mt-4">
          <div className="text-sm text-gray-500 mb-1">Trend</div>
          <div className="flex space-x-1">
            {trend.map((value, index) => (
              <div
                key={index}
                className="flex-1 bg-gray-200 rounded"
                style={{
                  height: `${value}px`,
                  minHeight: '4px'
                }}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AffinityScore; 