import React from 'react';
import { FiAlertTriangle, FiTrendingUp, FiCheck, FiX } from 'react-icons/fi';

const AgentAnalysis = ({
  type,
  title,
  description,
  metrics,
  recommendations,
  className = ''
}) => {
  const getAgentStyles = () => {
    switch (type) {
      case 'bias':
        return {
          bgColor: 'bg-red-50/50',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
          icon: <FiAlertTriangle className="text-red-500" />
        };
      case 'trend':
        return {
          bgColor: 'bg-yellow-50/50',
          textColor: 'text-yellow-700',
          borderColor: 'border-yellow-200',
          icon: <FiTrendingUp className="text-yellow-500" />
        };
      case 'verification':
        return {
          bgColor: 'bg-green-50/50',
          textColor: 'text-green-700',
          borderColor: 'border-green-200',
          icon: <FiCheck className="text-green-500" />
        };
      default:
        return {
          bgColor: 'bg-gray-50/50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200',
          icon: <FiAlertTriangle className="text-gray-500" />
        };
    }
  };

  const styles = getAgentStyles();

  return (
    <div className={`${styles.bgColor} rounded-lg border ${styles.borderColor} p-6 ${className}`}>
      <div className="flex items-start mb-4">
        <div className={`mr-3 ${styles.textColor}`}>
          {styles.icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>

      {metrics && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded p-3">
              <div className="text-sm text-gray-500 mb-1">{metric.label}</div>
              <div className="text-lg font-semibold">{metric.value}</div>
            </div>
          ))}
        </div>
      )}

      {recommendations && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Recommendations</h4>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AgentAnalysis; 