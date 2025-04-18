import React, { useState } from 'react';
import { FiChevronDown, FiArrowUp, FiCheck } from 'react-icons/fi';

const mockProperties = [
  {
    id: 'PROP001',
    name: 'Oceanview Resort & Spa',
    location: 'Miami Beach, FL',
    affinities: [
      {
        name: 'Luxury',
        score: 9.1,
        evidence: [
          {
            description: 'Premium amenities and exceptional service',
            confidence: 95,
            sources: ['Property website (verified)', 'Guest reviews (aggregated)']
          }
        ]
      },
      {
        name: 'Beach Access',
        score: 9.5,
        evidence: [
          {
            description: 'Direct beachfront location confirmed',
            confidence: 98,
            sources: ['Geospatial data (verified)', 'On-site inspection (verified)']
          }
        ]
      }
    ],
    discoveries: [
      {
        attribute: 'Electric Vehicle Charging Stations',
        confidence: 92,
        description: '4 Tesla and 2 universal charging stations available in the parking garage.',
        suggestion: 'Eco-Friendly affinity'
      },
      {
        attribute: 'Soundproof Rooms',
        confidence: 89,
        description: 'Enhanced soundproofing mentioned in 37 recent guest reviews.',
        suggestion: 'Enhances: Privacy, Luxury affinities'
      }
    ],
    sentiment: {
      totalReviews: 736,
      luxuryAnalysis: {
        keyPhrases: [
          { phrase: 'exceptional service', mentions: 127, sentiment: 'positive' },
          { phrase: 'worth every penny', mentions: 98, sentiment: 'positive' },
          { phrase: '5-star experience', mentions: 82, sentiment: 'positive' },
          { phrase: 'overpriced', mentions: 24, sentiment: 'negative' }
        ]
      }
    },
    competitive: {
      luxuryPositioning: {
        expedia: 9.1,
        competitors: [
          { name: 'Competitor A', score: 8.7 },
          { name: 'Competitor B', score: 8.9 }
        ],
        advantage: 0.3
      }
    },
    biases: [
      {
        type: 'Review Source Bias',
        description: 'Pet-Friendly scores are disproportionately influenced by reviews from summer travelers (72% of data points).',
        severity: 'Medium',
        impact: 11,
        correction: {
          original: 7.5,
          corrected: 7.2,
          action: 'Reweighted seasonal reviews to ensure balanced representation.'
        }
      }
    ],
    trends: [
      {
        name: 'Wellness Travel',
        status: 'Rising Trend',
        description: '43% increase in searches for wellness amenities and spa facilities in luxury beach resorts over last 90 days.',
        alignment: {
          description: 'Property has comprehensive spa facilities, meditation classes, and wellness packages.',
          opportunity: 'Create new "Wellness Retreat" affinity and feature property prominently.'
        }
      }
    ]
  }
];

const AgentView = () => {
  const [selectedProperty] = useState(mockProperties[0]);
  const [activeTab, setActiveTab] = useState('verification');
  const [expandedSections, setExpandedSections] = useState({});

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
      <h2 className="text-2xl font-bold mb-6">Agent View</h2>

      <div className="bg-white rounded-lg shadow">
        {/* Property Selection */}
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold">{selectedProperty.name}</h3>
          <p className="text-gray-600">{selectedProperty.location}</p>
        </div>

        {/* Agent Tabs */}
        <div className="border-b">
          <div className="flex">
            <button
              className={`agent-tab ${activeTab === 'verification' ? 'active' : ''}`}
              onClick={() => setActiveTab('verification')}
            >
              Verification Agent
            </button>
            <button
              className={`agent-tab ${activeTab === 'discovery' ? 'active' : ''}`}
              onClick={() => setActiveTab('discovery')}
            >
              Discovery Agent
            </button>
            <button
              className={`agent-tab ${activeTab === 'sentiment' ? 'active' : ''}`}
              onClick={() => setActiveTab('sentiment')}
            >
              Sentiment Agent
            </button>
            <button
              className={`agent-tab ${activeTab === 'competitive' ? 'active' : ''}`}
              onClick={() => setActiveTab('competitive')}
            >
              Competitive Agent
            </button>
            <button
              className={`agent-tab ${activeTab === 'bias' ? 'active' : ''}`}
              onClick={() => setActiveTab('bias')}
            >
              Bias Agent
            </button>
            <button
              className={`agent-tab ${activeTab === 'trend' ? 'active' : ''}`}
              onClick={() => setActiveTab('trend')}
            >
              Trend Agent
            </button>
          </div>
        </div>

        {/* Agent Content */}
        <div className="p-6">
          {/* Verification Agent */}
          {activeTab === 'verification' && (
            <div>
              <div className="mb-4">
                <p className="text-gray-600">This agent verifies affinity scores using multiple data sources and evidence.</p>
              </div>
              
              <h4 className="font-semibold text-lg mb-3">Evidence Analysis</h4>
              <div className="space-y-4">
                {selectedProperty.affinities.map((affinity, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-semibold">{affinity.name}</h5>
                      <span className={`badge ${getScoreClass(affinity.score)}`}>
                        {affinity.score}/10 Verified
                      </span>
                    </div>
                    {affinity.evidence.map((item, i) => (
                      <div key={i} className="evidence-panel">
                        <div 
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => toggleSection(`evidence-${index}-${i}`)}
                        >
                          <p className="text-sm text-gray-700">{item.description}</p>
                          <FiChevronDown className={`transform transition-transform ${
                            expandedSections[`evidence-${index}-${i}`] ? 'rotate-180' : ''
                          }`} />
                        </div>
                        {expandedSections[`evidence-${index}-${i}`] && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-600">
                              Source: {item.sources.join(', ')}
                            </p>
                          </div>
                        )}
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
                          <i className="fas fa-lightbulb mr-1"></i>
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