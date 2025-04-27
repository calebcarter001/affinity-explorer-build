import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiBarChart2 } from 'react-icons/fi';

const TrendAgent = ({ property }) => {
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
          This agent analyzes market trends and predicts future affinity changes.
        </p>
      </div>
      
      <h4 className="font-semibold text-lg mb-3">Trend Analysis</h4>
      <p className="mb-3 text-gray-700">Trend Agent analyzed 18 months of data and market indicators.</p>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-semibold">Luxury Affinity</h5>
            <span className="badge score-high">Rising Trend (+0.4/year)</span>
          </div>
          <div className="mb-3">
            <div className="flex items-center mb-1">
              <FiTrendingUp className="text-green-500 mr-2" />
              <span className="text-sm">Increasing demand for luxury amenities</span>
            </div>
            <div className="flex items-center mb-1">
              <FiTrendingUp className="text-green-500 mr-2" />
              <span className="text-sm">Growing premium service expectations</span>
            </div>
          </div>
          <p className="text-sm">Prediction: Score will increase to 9.5/10 within 12 months</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-semibold">Beach Access Affinity</h5>
            <span className="badge score-high">Stable Trend (0.0/year)</span>
          </div>
          <div className="mb-3">
            <div className="flex items-center mb-1">
              <FiBarChart2 className="text-blue-500 mr-2" />
              <span className="text-sm">Physical location remains unchanged</span>
            </div>
            <div className="flex items-center mb-1">
              <FiTrendingUp className="text-green-500 mr-2" />
              <span className="text-sm">Increasing value of beachfront properties</span>
            </div>
          </div>
          <p className="text-sm">Prediction: Score will remain stable at 9.5/10</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-semibold">Eco-Friendly Affinity</h5>
            <span className="badge score-high">Rapidly Rising Trend (+0.8/year)</span>
          </div>
          <div className="mb-3">
            <div className="flex items-center mb-1">
              <FiTrendingUp className="text-green-500 mr-2" />
              <span className="text-sm">Growing consumer demand for sustainability</span>
            </div>
            <div className="flex items-center mb-1">
              <FiTrendingUp className="text-green-500 mr-2" />
              <span className="text-sm">Increasing regulatory requirements</span>
            </div>
            <div className="flex items-center mb-1">
              <FiTrendingUp className="text-green-500 mr-2" />
              <span className="text-sm">New solar installation planned for Q3</span>
            </div>
          </div>
          <p className="text-sm">Prediction: Score will increase to 8.2/10 within 12 months</p>
        </div>
      </div>
    </div>
  );
};

export default TrendAgent; 