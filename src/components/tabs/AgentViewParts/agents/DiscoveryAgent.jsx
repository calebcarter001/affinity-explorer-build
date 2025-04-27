import React from 'react';
import { FiSearch, FiTrendingUp } from 'react-icons/fi';

const DiscoveryAgent = ({ property }) => {
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
          This agent identifies new attributes and characteristics not currently captured in existing affinities.
        </p>
      </div>
      
      <h4 className="font-semibold text-lg mb-3">Newly Discovered Attributes</h4>
      <p className="mb-3 text-gray-700">Discovery Agent found 8 new attributes that can enhance existing affinities or suggest new ones.</p>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-semibold">Electric Vehicle Charging Stations</h5>
            <span className="badge score-high">High Confidence (92%)</span>
          </div>
          <p className="text-sm">4 Tesla and 2 universal charging stations available in the parking garage.</p>
          <p className="text-xs text-blue-600 mt-2">Suggests: Eco-Friendly affinity</p>
          <div className="confidence-indicator mt-2">
            <div className="confidence-fill" style={{ width: '92%' }}></div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-semibold">Soundproof Rooms</h5>
            <span className="badge score-high">High Confidence (89%)</span>
          </div>
          <p className="text-sm">Enhanced soundproofing mentioned in 37 recent guest reviews.</p>
          <p className="text-xs text-blue-600 mt-2">Enhances: Privacy, Luxury affinities</p>
          <div className="confidence-indicator mt-2">
            <div className="confidence-fill" style={{ width: '89%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryAgent; 