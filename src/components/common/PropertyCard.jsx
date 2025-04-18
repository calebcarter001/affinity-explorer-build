import React from 'react';
import { FiMapPin, FiHome, FiHash } from 'react-icons/fi';

const PropertyCard = ({
  property,
  isSelected,
  onClick,
  showMetrics = false,
  className = '',
  affinityDetails = null
}) => {
  const {
    id,
    name,
    location,
    address,
    propertyType,
    metrics,
    type // CL or VR
  } = property;

  // Use address if available, otherwise fall back to location
  const displayAddress = address || location || 'No address available';

  return (
    <div
      key={id}
      className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-all ${
        isSelected ? 'border-2 border-blue-500 ring-2 ring-blue-200' : 'border border-gray-200'
      } hover:shadow-md hover:-translate-y-1 ${className}`}
      onClick={() => onClick(property)}
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          {type && (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              type === 'VR' 
                ? 'bg-purple-100 text-purple-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {type}
            </span>
          )}
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <FiMapPin className="mr-1" />
          <span>{displayAddress}</span>
        </div>

        <div className="flex items-center text-xs text-gray-500">
          <FiHash className="mr-1" />
          <span>ID: {id}</span>
        </div>

        {propertyType && (
          <div className="flex items-center text-sm text-gray-600">
            <FiHome className="mr-1" />
            <span>{propertyType}</span>
          </div>
        )}

        {showMetrics && metrics && (
          <div className="grid grid-cols-2 gap-4 mt-2">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{metric.label}</div>
                <div className="text-sm font-semibold">{metric.value}</div>
              </div>
            ))}
          </div>
        )}

        {affinityDetails && (
          <div className="border-t pt-4 mt-4">
            {affinityDetails}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard; 