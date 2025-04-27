import React from 'react';
import { FiMessageSquare, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const SentimentAgent = ({ property }) => {
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
          This agent analyzes reviews and social media to gauge sentiment about property affinities.
        </p>
      </div>
      
      <h4 className="font-semibold text-lg mb-3">Sentiment Analysis</h4>
      <p className="mb-3 text-gray-700">Sentiment Agent analyzed 736 recent reviews and social media mentions.</p>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <h5 className="font-semibold mb-2">Luxury Sentiment</h5>
          <div className="mb-3">
            <h6 className="text-sm font-medium">Key Phrases (736 reviews)</h6>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                "exceptional service" (127 mentions)
              </span>
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                "worth every penny" (98 mentions)
              </span>
              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                "5-star experience" (82 mentions)
              </span>
              <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                "overpriced" (24 mentions)
              </span>
            </div>
          </div>
          <p className="text-sm">Impact: Sentiment confirms high Luxury score (9.1)</p>
        </div>
      </div>
    </div>
  );
};

export default SentimentAgent; 