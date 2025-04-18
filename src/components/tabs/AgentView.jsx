import React, { useState } from 'react';
import { FiChevronDown, FiArrowUp } from 'react-icons/fi';

const AgentView = () => {
  const [activeTab, setActiveTab] = useState('verification');
  const [expandedSections, setExpandedSections] = useState({});

  // Mock property data
  const selectedProperty = {
    name: "Oceanview Resort & Spa",
    affinities: {
      luxury: {
        score: 9.1,
        evidence: [
          {
            source: "Guest Reviews",
            quote: "The marble bathrooms and premium amenities exceeded our expectations",
            confidence: 92
          },
          {
            source: "Professional Assessment",
            quote: "High-end finishes and attentive service throughout",
            confidence: 88
          }
        ]
      }
    },
    discoveries: [
      {
        attribute: "Wellness Focus",
        confidence: 89,
        description: "Strong emphasis on health and wellness programs",
        suggestion: "Consider adding Wellness affinity score"
      },
      {
        attribute: "Local Culture Integration",
        confidence: 85,
        description: "Significant incorporation of local art and traditions",
        suggestion: "Potential Cultural Authenticity affinity"
      }
    ],
    sentiment: {
      totalReviews: 250,
      luxuryAnalysis: {
        keyPhrases: [
          { phrase: "exceptional service", sentiment: "positive", mentions: 45 },
          { phrase: "worth every penny", sentiment: "positive", mentions: 32 },
          { phrase: "dated furniture", sentiment: "negative", mentions: 8 }
        ]
      }
    },
    competitive: {
      luxuryPositioning: {
        expedia: 9.2,
        competitors: [
          { name: "Grand Resort", score: 8.8 },
          { name: "Elite Hotel", score: 8.5 }
        ],
        advantage: 0.5
      }
    },
    biases: [
      {
        type: "Seasonal Sampling",
        severity: "Low",
        impact: 5,
        description: "Reviews slightly overrepresent peak season experiences",
        correction: {
          action: "Applied seasonal normalization factor",
          original: 9.3,
          corrected: 9.1
        }
      }
    ],
    trends: [
      {
        name: "Sustainable Luxury",
        status: "Rising",
        description: "Growing demand for eco-conscious luxury experiences",
        alignment: {
          description: "Property has some green initiatives but room for expansion",
          opportunity: "Enhance sustainability programs while maintaining luxury standards"
        }
      }
    ]
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getScoreClass = (score) => {
    if (score >= 8) return 'score-high';
    if (score >= 6) return 'score-medium';
    return 'score-low';
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex space-x-4 px-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('verification')}
              className={`px-3 py-2 text-sm font-medium ${
                activeTab === 'verification'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Verification Agent
            </button>
            <button
              onClick={() => setActiveTab('discovery')}
              className={`px-3 py-2 text-sm font-medium ${
                activeTab === 'discovery'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Discovery Agent
            </button>
            <button
              onClick={() => setActiveTab('sentiment')}
              className={`px-3 py-2 text-sm font-medium ${
                activeTab === 'sentiment'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sentiment Agent
            </button>
            <button
              onClick={() => setActiveTab('competitive')}
              className={`px-3 py-2 text-sm font-medium ${
                activeTab === 'competitive'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Competitive Agent
            </button>
            <button
              onClick={() => setActiveTab('bias')}
              className={`px-3 py-2 text-sm font-medium ${
                activeTab === 'bias'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Bias Agent
            </button>
            <button
              onClick={() => setActiveTab('trend')}
              className={`px-3 py-2 text-sm font-medium ${
                activeTab === 'trend'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Trend Agent
            </button>
          </nav>
        </div>

        <div className="p-4">
          {/* Verification Agent */}
          {activeTab === 'verification' && (
            <div>
              <div className="mb-4">
                <p className="text-gray-600">This agent verifies the evidence supporting each affinity score.</p>
              </div>
              
              <h4 className="font-semibold text-lg mb-3">Evidence Analysis</h4>
              <div className="space-y-4">
                {Object.entries(selectedProperty.affinities).map(([affinity, data]) => (
                  <div key={affinity} className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-semibold capitalize">{affinity}</h5>
                      <span className={`badge ${getScoreClass(data.score)}`}>
                        Score: {data.score}/10
                      </span>
                    </div>
                    
                    {data.evidence.map((item, index) => (
                      <div key={index} className="mt-2 border-t pt-2">
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-medium">{item.source}</span>
                          <span className="text-sm text-gray-500">
                            Confidence: {item.confidence}%
                          </span>
                        </div>
                        <p className="text-sm mt-1 italic">
                          "{item.quote}"
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Discovery Agent */}
          {activeTab === 'discovery' && (
            <div>
              <div className="mb-4">
                <p className="text-gray-600">This agent identifies new attributes and characteristics not currently captured in existing affinities.</p>
              </div>
              
              <h4 className="font-semibold text-lg mb-3">Newly Discovered Attributes</h4>
              <p className="mb-3 text-gray-700">Discovery Agent found {selectedProperty.discoveries.length} new attributes that can enhance existing affinities or suggest new ones.</p>
              
              <div className="space-y-4">
                {selectedProperty.discoveries.map((discovery, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-semibold">{discovery.attribute}</h5>
                      <span className="badge score-high">High Confidence ({discovery.confidence}%)</span>
                    </div>
                    <p className="text-sm">{discovery.description}</p>
                    <p className="text-xs text-blue-600 mt-2">Suggests: {discovery.suggestion}</p>
                    <div className="confidence-indicator mt-2">
                      <div 
                        className="confidence-fill"
                        style={{ width: `${discovery.confidence}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sentiment Agent */}
          {activeTab === 'sentiment' && (
            <div>
              <div className="mb-4">
                <p className="text-gray-600">This agent analyzes reviews and social media to gauge sentiment about property affinities.</p>
              </div>
              
              <h4 className="font-semibold text-lg mb-3">Sentiment Analysis</h4>
              <p className="mb-3 text-gray-700">
                Sentiment Agent analyzed {selectedProperty.sentiment.totalReviews} recent reviews and social media mentions.
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h5 className="font-semibold mb-2">Luxury Sentiment</h5>
                  <div className="mb-3">
                    <h6 className="text-sm font-medium">
                      Key Phrases ({selectedProperty.sentiment.totalReviews} reviews)
                    </h6>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedProperty.sentiment.luxuryAnalysis.keyPhrases.map((phrase, index) => (
                        <span
                          key={index}
                          className={`inline-block px-2 py-1 ${
                            phrase.sentiment === 'positive' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          } text-xs rounded-full`}
                        >
                          "{phrase.phrase}" ({phrase.mentions} mentions)
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm">Impact: Sentiment confirms high Luxury score (9.1)</p>
                </div>
              </div>
            </div>
          )}

          {/* Competitive Agent */}
          {activeTab === 'competitive' && (
            <div>
              <div className="mb-4">
                <p className="text-gray-600">This agent benchmarks against competitors to identify relative strengths and gaps.</p>
              </div>
              
              <h4 className="font-semibold text-lg mb-3">Competitive Analysis</h4>
              <p className="mb-3 text-gray-700">
                Benchmarked against {selectedProperty.competitive.luxuryPositioning.competitors.length + 1} similar resorts on competing booking sites.
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div 
                    className="cursor-pointer flex justify-between items-center"
                    onClick={() => toggleSection('competitive-luxury')}
                  >
                    <h5 className="font-semibold">Luxury Positioning</h5>
                    <FiChevronDown className={`transform transition-transform ${
                      expandedSections['competitive-luxury'] ? 'rotate-180' : ''
                    }`} />
                  </div>
                  {expandedSections['competitive-luxury'] && (
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Expedia:</span>
                        <span className="font-semibold">
                          {selectedProperty.competitive.luxuryPositioning.expedia}/10
                        </span>
                      </div>
                      {selectedProperty.competitive.luxuryPositioning.competitors.map((competitor, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{competitor.name}:</span>
                          <span>{competitor.score}/10</span>
                        </div>
                      ))}
                      <div className="mt-3 text-sm text-green-700">
                        <FiArrowUp className="inline mr-1" />
                        Competitive Edge: +{selectedProperty.competitive.luxuryPositioning.advantage} points above average
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Bias Agent */}
          {activeTab === 'bias' && (
            <div>
              <div className="mb-4">
                <p className="text-gray-600">This agent detects and corrects systematic biases in affinity scores.</p>
              </div>
              
              <h4 className="font-semibold text-lg mb-3">Bias Detection</h4>
              <p className="mb-3 text-gray-700">Minor biases detected in review sourcing and seasonal sampling.</p>
              
              <div className="space-y-4">
                {selectedProperty.biases.map((bias, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md">
                    <div 
                      className="cursor-pointer flex justify-between items-center"
                      onClick={() => toggleSection(`bias-${index}`)}
                    >
                      <h5 className="font-semibold">{bias.type}</h5>
                      <FiChevronDown className={`transform transition-transform ${
                        expandedSections[`bias-${index}`] ? 'rotate-180' : ''
                      }`} />
                    </div>
                    {expandedSections[`bias-${index}`] && (
                      <div className="mt-3">
                        <p className="text-sm">{bias.description}</p>
                        <div className="mt-2 px-3 py-2 bg-yellow-50 border-l-4 border-yellow-400">
                          <span className="text-sm font-medium">
                            Bias Severity: {bias.severity} ({bias.impact}% score impact)
                          </span>
                        </div>
                        <div className="mt-3">
                          <h6 className="text-sm font-medium">Correction Applied</h6>
                          <p className="text-sm mt-1">{bias.correction.action}</p>
                          <div className="flex justify-between mt-2 text-sm">
                            <span>Original Score: {bias.correction.original}/10</span>
                            <span>Corrected Score: {bias.correction.corrected}/10</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trend Agent */}
          {activeTab === 'trend' && (
            <div>
              <div className="mb-4">
                <p className="text-gray-600">This agent identifies emerging trends relevant to the property.</p>
              </div>
              
              <h4 className="font-semibold text-lg mb-3">Trend Analysis</h4>
              <p className="mb-3 text-gray-700">
                Trend Agent identified {selectedProperty.trends.length} emerging patterns relevant to this property.
              </p>
              
              <div className="space-y-4">
                {selectedProperty.trends.map((trend, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <h5 className="font-semibold">{trend.name}</h5>
                      <span className="badge badge-validated">{trend.status}</span>
                    </div>
                    <div className="mt-2 text-sm">
                      <p>{trend.description}</p>
                      <div className="mt-3">
                        <h6 className="font-medium">Property Alignment</h6>
                        <p className="mt-1">{trend.alignment.description}</p>
                        <p className="text-green-700 mt-2">
                          <FiArrowUp className="inline mr-1" />
                          Opportunity: {trend.alignment.opportunity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentView;