import React from 'react';
import { FiTrendingUp, FiTarget, FiCheckCircle } from 'react-icons/fi';

const VariantA = () => {
  const variantAContent = {
    snippet: "Experience the ultimate in luxury relaxation at our rooftop infinity pool with panoramic city views. Unwind at our world-class spa featuring rejuvenating treatments, then enjoy cocktails at our exclusive swim-up bar while soaking in the sun terrace ambiance.",
    qualityScore: 87,
    readabilityGrade: "Grade 9.2",
    keyFeatures: [
      "Rooftop infinity pool",
      "Panoramic city views", 
      "World-class spa",
      "Swim-up bar",
      "Sun terrace"
    ],
    targetAudience: "Luxury travelers seeking premium amenities",
    tone: "Sophisticated and aspirational",
    wordCount: 42,
    characterCount: 267
  };

  return (
    <div className="space-y-6">
      {/* Generated Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Content - Variant A</h3>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <p className="text-gray-800 leading-relaxed">{variantAContent.snippet}</p>
        </div>
        
        {/* Content Metrics */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Word Count</div>
            <div className="text-xl font-semibold text-gray-900">{variantAContent.wordCount}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Character Count</div>
            <div className="text-xl font-semibold text-gray-900">{variantAContent.characterCount}</div>
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
              <span className="text-sm font-semibold text-blue-600">{variantAContent.qualityScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${variantAContent.qualityScore}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Readability</span>
              <span className="text-sm font-semibold text-green-600">{variantAContent.readabilityGrade}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Features */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features Highlighted</h3>
        <div className="grid grid-cols-1 gap-2">
          {variantAContent.keyFeatures.map((feature, index) => (
            <div key={index} className="flex items-center">
              <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Target Audience & Tone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Target Audience</h3>
          <div className="flex items-center">
            <FiTarget className="w-5 h-5 text-blue-500 mr-2" />
            <span className="text-sm text-gray-700">{variantAContent.targetAudience}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Tone & Style</h3>
          <div className="flex items-center">
            <FiTrendingUp className="w-5 h-5 text-purple-500 mr-2" />
            <span className="text-sm text-gray-700">{variantAContent.tone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariantA;
