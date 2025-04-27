import React from 'react';
import { FiAlertTriangle, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const BiasDetectionAgent = ({ property }) => {
  if (!property) {
    return (
      <div className="text-center py-8 text-gray-500">
        <i className="fas fa-building text-gray-300 text-4xl mb-3"></i>
        <p>Select a property to see agent analysis</p>
      </div>
    );
  }

  return (
    <div className="agent-content">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">{property.name}</h3>
        <p className="text-gray-600">
          This agent identifies potential biases in affinity scoring and data collection.
        </p>
      </div>
      
      <h4 className="font-semibold text-lg mb-3">Bias Analysis</h4>
      <p className="mb-3 text-gray-700">Bias Detection Agent analyzed 24 data sources and 3,421 data points.</p>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-semibold">Luxury Affinity</h5>
            <span className="badge score-high">Low Bias (92%)</span>
          </div>
          <div className="mb-3">
            <div className="flex items-center mb-1">
              <FiCheckCircle className="text-green-500 mr-2" />
              <span className="text-sm">Multiple data sources used</span>
            </div>
            <div className="flex items-center mb-1">
              <FiCheckCircle className="text-green-500 mr-2" />
              <span className="text-sm">Balanced review sample</span>
            </div>
            <div className="flex items-center mb-1">
              <FiAlertTriangle className="text-yellow-500 mr-2" />
              <span className="text-sm">Potential seasonal bias in reviews</span>
            </div>
          </div>
          <p className="text-sm">Recommendation: Consider seasonal normalization for more accurate year-round scoring</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-semibold">Beach Access Affinity</h5>
            <span className="badge score-high">Very Low Bias (97%)</span>
          </div>
          <div className="mb-3">
            <div className="flex items-center mb-1">
              <FiCheckCircle className="text-green-500 mr-2" />
              <span className="text-sm">Objective geospatial data used</span>
            </div>
            <div className="flex items-center mb-1">
              <FiCheckCircle className="text-green-500 mr-2" />
              <span className="text-sm">Verified through multiple sources</span>
            </div>
          </div>
          <p className="text-sm">No significant biases detected</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-semibold">Family-Friendly Affinity</h5>
            <span className="badge score-medium">Moderate Bias (78%)</span>
          </div>
          <div className="mb-3">
            <div className="flex items-center mb-1">
              <FiCheckCircle className="text-green-500 mr-2" />
              <span className="text-sm">Objective amenities data used</span>
            </div>
            <div className="flex items-center mb-1">
              <FiXCircle className="text-red-500 mr-2" />
              <span className="text-sm">Limited review data from families with children</span>
            </div>
            <div className="flex items-center mb-1">
              <FiAlertTriangle className="text-yellow-500 mr-2" />
              <span className="text-sm">Potential cultural bias in family-friendly definition</span>
            </div>
          </div>
          <p className="text-sm">Recommendation: Collect more targeted feedback from families and normalize for cultural differences</p>
        </div>
      </div>
    </div>
  );
};

export default BiasDetectionAgent; 