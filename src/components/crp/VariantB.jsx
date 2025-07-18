import React from 'react';
import { FiUsers, FiHeart, FiStar } from 'react-icons/fi';

const VariantB = () => {
  const variantBContent = {
    snippet: "Dive into family fun at our heated swimming pool complex featuring a dedicated kids' area with water slides and splash zones. Parents can relax in the adjacent adult pool while keeping an eye on the little ones, creating perfect memories for the whole family.",
    qualityScore: 92,
    readabilityGrade: "Grade 8.1",
    keyFeatures: [
      "Heated swimming pool",
      "Dedicated kids' area",
      "Water slides",
      "Splash zones",
      "Adjacent adult pool",
      "Family-friendly design"
    ],
    targetAudience: "Families with children seeking safe, fun activities",
    tone: "Warm and family-oriented",
    wordCount: 38,
    characterCount: 245,
    familyFeatures: [
      "Child safety measures",
      "Lifeguard supervision",
      "Shallow water areas",
      "Pool toys available"
    ]
  };

  return (
    <div className="space-y-6">
      {/* Generated Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Content - Variant B</h3>
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
          <p className="text-gray-800 leading-relaxed">{variantBContent.snippet}</p>
        </div>
        
        {/* Content Metrics */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Word Count</div>
            <div className="text-xl font-semibold text-gray-900">{variantBContent.wordCount}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Character Count</div>
            <div className="text-xl font-semibold text-gray-900">{variantBContent.characterCount}</div>
          </div>
        </div>
      </div>

      {/* Quality Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Analysis</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Quality Score</span>
              <span className="text-sm font-semibold text-green-600">{variantBContent.qualityScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${variantBContent.qualityScore}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Readability</span>
              <span className="text-sm font-semibold text-green-600">{variantBContent.readabilityGrade}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Family-Specific Features */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Family-Friendly Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Pool Amenities</h4>
            <div className="space-y-2">
              {variantBContent.keyFeatures.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <FiStar className="w-4 h-4 text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Safety Features</h4>
            <div className="space-y-2">
              {variantBContent.familyFeatures.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <FiHeart className="w-4 h-4 text-red-500 mr-2" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Target Audience & Tone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Target Audience</h3>
          <div className="flex items-center">
            <FiUsers className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-sm text-gray-700">{variantBContent.targetAudience}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Tone & Style</h3>
          <div className="flex items-center">
            <FiHeart className="w-5 h-5 text-pink-500 mr-2" />
            <span className="text-sm text-gray-700">{variantBContent.tone}</span>
          </div>
        </div>
      </div>

      {/* Family Appeal Score */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Family Appeal Analysis</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">This variant scores high for family engagement and safety messaging</span>
          <div className="flex items-center">
            <FiUsers className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-lg font-bold text-green-600">95%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariantB;
