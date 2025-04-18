import React from 'react';
import { FiMapPin, FiHome, FiStar, FiTrendingUp } from 'react-icons/fi';

const PropertyDetails = ({
  name,
  location,
  propertyType,
  rating,
  metrics,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">{name}</h2>
          <div className="flex items-center text-gray-500">
            <FiMapPin className="mr-1" />
            <span>{location}</span>
          </div>
        </div>
        <div className="flex items-center">
          <FiStar className="text-yellow-400 mr-1" />
          <span className="font-semibold">{rating}</span>
        </div>
      </div>

      <div className="flex items-center mb-4 text-gray-600">
        <FiHome className="mr-1" />
        <span>{propertyType}</span>
      </div>

      {metrics && (
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-gray-50 rounded p-3">
              <div className="text-sm text-gray-500 mb-1">{metric.label}</div>
              <div className="flex items-center">
                <span className="text-lg font-semibold">{metric.value}</span>
                {metric.trend && (
                  <div className={`ml-2 flex items-center ${
                    metric.trend > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    <FiTrendingUp className={`mr-1 ${
                      metric.trend < 0 ? 'transform rotate-180' : ''
                    }`} />
                    <span className="text-sm">{Math.abs(metric.trend)}%</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyDetails; 