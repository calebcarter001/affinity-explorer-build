import React, { useState } from 'react';
import { FiCheckCircle, FiChevronDown } from 'react-icons/fi';

const VerificationAgent = ({ property }) => {
  const [expandedPanels, setExpandedPanels] = useState(new Set());

  const togglePanel = (panelId) => {
    setExpandedPanels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(panelId)) {
        newSet.delete(panelId);
      } else {
        newSet.add(panelId);
      }
      return newSet;
    });
  };

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
          This agent confirms affinity scores against ground truth using human-verified data, multiple external sources, and crowdsourced information.
        </p>
      </div>
      
      <h4 className="font-semibold text-lg mb-3">Verified Affinities</h4>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-semibold">Luxury</h5>
            <span className="badge score-high">9.1/10 Verified</span>
          </div>
          <div className={`evidence-panel collapsible-header ${expandedPanels.has('luxury1') ? 'active' : ''}`}>
            <div className="flex justify-between items-center cursor-pointer" onClick={() => togglePanel('luxury1')}>
              <p className="text-sm text-gray-700">Five-star rating confirmed</p>
              <FiChevronDown className={`text-gray-500 transform transition-transform ${expandedPanels.has('luxury1') ? 'rotate-180' : ''}`} />
            </div>
            <div className="collapsible-content">
              <p className="text-xs text-gray-600 mt-2">Source: Official Hotel Classification Registry (verified)</p>
            </div>
          </div>
          <div className={`evidence-panel collapsible-header ${expandedPanels.has('luxury2') ? 'active' : ''}`}>
            <div className="flex justify-between items-center cursor-pointer" onClick={() => togglePanel('luxury2')}>
              <p className="text-sm text-gray-700">Premium amenities detected: spa, butler service, fine dining</p>
              <FiChevronDown className={`text-gray-500 transform transition-transform ${expandedPanels.has('luxury2') ? 'rotate-180' : ''}`} />
            </div>
            <div className="collapsible-content">
              <p className="text-xs text-gray-600 mt-2">Source: Property website (verified), Guest reviews (aggregated)</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-semibold">Beach Access</h5>
            <span className="badge score-high">9.5/10 Verified</span>
          </div>
          <div className={`evidence-panel collapsible-header ${expandedPanels.has('beach1') ? 'active' : ''}`}>
            <div className="flex justify-between items-center cursor-pointer" onClick={() => togglePanel('beach1')}>
              <p className="text-sm text-gray-700">Direct beachfront location confirmed</p>
              <FiChevronDown className={`text-gray-500 transform transition-transform ${expandedPanels.has('beach1') ? 'rotate-180' : ''}`} />
            </div>
            <div className="collapsible-content">
              <p className="text-xs text-gray-600 mt-2">Source: Geospatial data (verified), On-site inspection (verified)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationAgent; 