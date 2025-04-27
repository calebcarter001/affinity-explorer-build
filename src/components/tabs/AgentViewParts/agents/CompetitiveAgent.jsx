import React from 'react';
import { FiBarChart2, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const CompetitiveAgent = ({ property }) => {
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
          This agent benchmarks against competitors to identify relative strengths and gaps.
        </p>
      </div>
      
      <h4 className="font-semibold text-lg mb-3">Competitive Analysis</h4>
      <p className="mb-3 text-gray-700">Competitive Agent analyzed 12 similar properties in the same market segment.</p>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <h5 className="font-semibold mb-2">Luxury Positioning</h5>
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Your Property</span>
              <span className="text-sm font-medium">9.1/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '91%' }}></div>
            </div>
            
            <div className="flex justify-between items-center mb-1 mt-3">
              <span className="text-sm">Market Average</span>
              <span className="text-sm font-medium">7.8/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-gray-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
          <p className="text-sm text-green-600">+1.3 points above market average</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h5 className="font-semibold mb-2">Competitive Advantages</h5>
          <ul className="list-disc pl-5 space-y-1">
            <li className="text-sm">Premium spa facilities (top 10% in market)</li>
            <li className="text-sm">Beachfront location (unique in segment)</li>
            <li className="text-sm">Michelin-starred restaurant (only property with this)</li>
          </ul>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h5 className="font-semibold mb-2">Competitive Gaps</h5>
          <ul className="list-disc pl-5 space-y-1">
            <li className="text-sm">Limited conference facilities compared to competitors</li>
            <li className="text-sm">Fewer room types than market leaders</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CompetitiveAgent; 