import React from 'react';
import { FiDollarSign, FiClock, FiMapPin } from 'react-icons/fi';

const VariantC = () => {
  const variantCContent = {
    snippet: "Make a splash without breaking the bank! Our affordable pool access includes complimentary towels, poolside seating, and extended hours until 10 PM. Perfect for budget-conscious travelers who don't want to compromise on relaxation and fun.",
    qualityScore: 89,
    readabilityGrade: "Grade 7.8",
    keyFeatures: [
      "Affordable pool access",
      "Complimentary towels",
      "Poolside seating",
      "Extended hours until 10 PM",
      "Budget-friendly pricing",
      "No compromise on quality"
    ],
    targetAudience: "Budget-conscious travelers seeking value",
    tone: "Friendly and value-focused",
    wordCount: 35,
    characterCount: 228,
    valuePropositions: [
      "No hidden fees",
      "Free amenities included",
      "Flexible booking options",
      "Group discounts available"
    ],
    costSavings: [
      "50% less than premium pools",
      "Free towel service ($15 value)",
      "Extended hours at no extra cost",
      "Complimentary poolside seating"
    ]
  };

  return (
    <div className="space-y-6">
      {/* Generated Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Content - Variant C</h3>
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
          <p className="text-gray-800 leading-relaxed">{variantCContent.snippet}</p>
        </div>
        
        {/* Content Metrics */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Word Count</div>
            <div className="text-xl font-semibold text-gray-900">{variantCContent.wordCount}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Character Count</div>
            <div className="text-xl font-semibold text-gray-900">{variantCContent.characterCount}</div>
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
              <span className="text-sm font-semibold text-orange-600">{variantCContent.qualityScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${variantCContent.qualityScore}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Readability</span>
              <span className="text-sm font-semibold text-green-600">{variantCContent.readabilityGrade}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Value Propositions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Value Propositions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Key Features</h4>
            <div className="space-y-2">
              {variantCContent.keyFeatures.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <FiMapPin className="w-4 h-4 text-orange-500 mr-2" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Value Benefits</h4>
            <div className="space-y-2">
              {variantCContent.valuePropositions.map((value, index) => (
                <div key={index} className="flex items-center">
                  <FiDollarSign className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cost Savings Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Savings Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {variantCContent.costSavings.map((saving, index) => (
            <div key={index} className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="flex items-center">
                <FiDollarSign className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">{saving}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Target Audience & Tone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Target Audience</h3>
          <div className="flex items-center">
            <FiDollarSign className="w-5 h-5 text-orange-500 mr-2" />
            <span className="text-sm text-gray-700">{variantCContent.targetAudience}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Tone & Style</h3>
          <div className="flex items-center">
            <FiClock className="w-5 h-5 text-blue-500 mr-2" />
            <span className="text-sm text-gray-700">{variantCContent.tone}</span>
          </div>
        </div>
      </div>

      {/* Value Score */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Value Appeal Analysis</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">This variant excels at communicating value and affordability</span>
          <div className="flex items-center">
            <FiDollarSign className="w-5 h-5 text-orange-500 mr-2" />
            <span className="text-lg font-bold text-orange-600">93%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariantC;
