import React, { useState } from 'react';
import { FiChevronDown, FiMapPin, FiUsers, FiMessageCircle, FiEye, FiClock, FiStar } from 'react-icons/fi';

const LocalInsiderAgent = ({ property }) => {
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
        <FiUsers className="mx-auto text-gray-300 text-4xl mb-3" />
        <p>Select a property to see local insider knowledge</p>
      </div>
    );
  }

  // Mock data based on LocalInsiderKnowledgeAgent structure
  const insiderKnowledge = [
    {
      id: 'tourist-tells-1',
      category: 'Tourist Tells & How to Blend In',
      insight_title: 'Never Use Hotel Umbrellas',
      description: 'Locals in this area never use umbrellas, even in heavy rain. They wear rain jackets and hoods instead. Using a hotel umbrella immediately marks you as a tourist.',
      confidence_level: 'High',
      consensus_score: 0.92,
      provider_count: 3,
      cultural_analysis: {
        cultural_depth: 'moderate',
        tourist_impact: 'high',
        local_importance: 'important',
        universality: 'common'
      },
      application_tips: [
        'Observe locals carefully before adapting your behavior',
        'Invest in a good rain jacket instead of relying on umbrellas',
        'This is well-established local knowledge - you can rely on it'
      ],
      evidence_sources: [
        {
          title: 'Local Weather Patterns Discussion',
          snippet: 'Residents discuss rain gear preferences and cultural norms',
          url: 'https://example.com/local-forum',
          evidence_type: 'web_search',
          confidence_score: 0.8
        }
      ]
    },
    {
      id: 'social-rules-1',
      category: 'Unwritten Social Rules',
      insight_title: 'Elevator Etiquette in High-Rise Buildings',
      description: 'In luxury high-rise buildings, residents never make small talk in elevators. Silence is expected and appreciated. Greeting with a simple nod is acceptable.',
      confidence_level: 'High',
      consensus_score: 0.88,
      provider_count: 3,
      cultural_analysis: {
        cultural_depth: 'deep',
        tourist_impact: 'moderate',
        local_importance: 'critical',
        universality: 'universal'
      },
      application_tips: [
        'When in doubt, follow the lead of locals around you',
        'Keep conversations brief and quiet if you must speak',
        'This is well-established local knowledge - you can rely on it'
      ],
      evidence_sources: [
        {
          title: 'Urban Living Etiquette Guide',
          snippet: 'High-rise living social norms and expectations',
          url: 'https://example.com/urban-guide',
          evidence_type: 'web_search',
          confidence_score: 0.9
        }
      ]
    },
    {
      id: 'communication-1',
      category: 'Local Slang & Communication',
      insight_title: 'Service Industry Phrases',
      description: 'Locals use specific phrases when interacting with hotel staff. Saying "I appreciate your help" instead of "thank you" shows cultural awareness and often results in better service.',
      confidence_level: 'Medium',
      consensus_score: 0.75,
      provider_count: 2,
      cultural_analysis: {
        cultural_depth: 'moderate',
        tourist_impact: 'moderate',
        local_importance: 'important',
        universality: 'common'
      },
      application_tips: [
        'Listen before speaking - pick up the local rhythm and tone',
        'Don\'t overuse local expressions - authenticity comes from understanding',
        'This may vary by specific area or demographic - verify locally'
      ],
      evidence_sources: [
        {
          title: 'Service Industry Communication Patterns',
          snippet: 'Local communication preferences in hospitality',
          url: 'https://example.com/service-guide',
          evidence_type: 'web_search',
          confidence_score: 0.7
        }
      ]
    },
    {
      id: 'neighborhood-1',
      category: 'Neighborhood Dynamics',
      insight_title: 'Local Hangout Hierarchy',
      description: 'The hotel bar is considered tourist territory. Locals prefer the coffee shop two blocks north for morning meetings and the wine bar across the street for evening socializing.',
      confidence_level: 'High',
      consensus_score: 0.85,
      provider_count: 3,
      cultural_analysis: {
        cultural_depth: 'moderate',
        tourist_impact: 'high',
        local_importance: 'important',
        universality: 'situational'
      },
      application_tips: [
        'Ask locals for their perspective on different areas',
        'Spend time in local neighborhoods to understand dynamics firsthand',
        'This is well-established local knowledge - you can rely on it'
      ],
      evidence_sources: [
        {
          title: 'Neighborhood Social Spaces Analysis',
          snippet: 'Local preferences for social gathering spots',
          url: 'https://example.com/neighborhood-guide',
          evidence_type: 'web_search',
          confidence_score: 0.85
        }
      ]
    },
    {
      id: 'food-culture-1',
      category: 'Food & Drink Culture Reality',
      insight_title: 'Dining Time Expectations',
      description: 'Locals eat dinner much later than tourists expect. Restaurants don\'t get busy until 8:30 PM, and showing up at 6 PM marks you as a tourist. The best tables are reserved for 9 PM.',
      confidence_level: 'High',
      consensus_score: 0.94,
      provider_count: 3,
      cultural_analysis: {
        cultural_depth: 'deep',
        tourist_impact: 'high',
        local_importance: 'critical',
        universality: 'universal'
      },
      application_tips: [
        'Observe local behavior patterns and adapt gradually',
        'Make reservations for later times to get better service',
        'This is well-established local knowledge - you can rely on it'
      ],
      evidence_sources: [
        {
          title: 'Local Dining Culture Study',
          snippet: 'Traditional meal times and restaurant customs',
          url: 'https://example.com/dining-culture',
          evidence_type: 'web_search',
          confidence_score: 0.92
        }
      ]
    },
    {
      id: 'transportation-1',
      category: 'Transportation Reality',
      insight_title: 'Peak Hour Navigation',
      description: 'Locals never take taxis during 4-6 PM rush hour. They use the subway system or walk. Tourists who take taxis during this time pay 3x more and arrive later than those who walk.',
      confidence_level: 'High',
      consensus_score: 0.89,
      provider_count: 3,
      cultural_analysis: {
        cultural_depth: 'moderate',
        tourist_impact: 'high',
        local_importance: 'important',
        universality: 'common'
      },
      application_tips: [
        'Plan your schedule around local transportation patterns',
        'Download local transit apps used by residents',
        'This is well-established local knowledge - you can rely on it'
      ],
      evidence_sources: [
        {
          title: 'Urban Transportation Patterns',
          snippet: 'Local commuting preferences and timing',
          url: 'https://example.com/transport-guide',
          evidence_type: 'web_search',
          confidence_score: 0.87
        }
      ]
    }
  ];

  const getCategoryIcon = (category) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('tourist') || categoryLower.includes('blend')) return <FiEye className="text-blue-500" />;
    if (categoryLower.includes('social') || categoryLower.includes('rules')) return <FiUsers className="text-green-500" />;
    if (categoryLower.includes('communication') || categoryLower.includes('slang')) return <FiMessageCircle className="text-purple-500" />;
    if (categoryLower.includes('neighborhood')) return <FiMapPin className="text-red-500" />;
    if (categoryLower.includes('food') || categoryLower.includes('drink')) return <FiClock className="text-orange-500" />;
    if (categoryLower.includes('transport')) return <FiStar className="text-indigo-500" />;
    return <FiUsers className="text-gray-500" />;
  };

  const getConfidenceBadge = (confidence) => {
    const confidenceLower = confidence.toLowerCase();
    if (confidenceLower === 'high') return 'badge score-high';
    if (confidenceLower === 'medium') return 'badge score-medium';
    return 'badge score-low';
  };

  const getCulturalDepthColor = (depth) => {
    if (depth === 'deep') return 'text-green-600 bg-green-50';
    if (depth === 'moderate') return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getTouristImpactColor = (impact) => {
    if (impact === 'high') return 'text-red-600 bg-red-50';
    if (impact === 'moderate') return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="agent-content">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">{property.name}</h3>
        <p className="text-gray-600">
          This agent discovers authentic local culture, unwritten rules, and insider secrets that separate tourists from locals using multi-LLM consensus and evidence validation.
        </p>
      </div>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">🎯 Local Insider Intelligence</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="font-bold text-blue-700">{insiderKnowledge.length}</div>
            <div className="text-blue-600">Insights</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-blue-700">{insiderKnowledge.filter(k => k.confidence_level === 'High').length}</div>
            <div className="text-blue-600">High Confidence</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-blue-700">{new Set(insiderKnowledge.map(k => k.category)).size}</div>
            <div className="text-blue-600">Categories</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-blue-700">{Math.round(insiderKnowledge.reduce((acc, k) => acc + k.consensus_score, 0) / insiderKnowledge.length * 100)}%</div>
            <div className="text-blue-600">Avg Consensus</div>
          </div>
        </div>
      </div>
      
      <h4 className="font-semibold text-lg mb-3">Local Insider Knowledge</h4>
      
      <div className="space-y-4">
        {insiderKnowledge.map((insight) => (
          <div key={insight.id} className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-start space-x-3">
                {getCategoryIcon(insight.category)}
                <div>
                  <h5 className="font-semibold text-gray-900">{insight.insight_title}</h5>
                  <p className="text-sm text-gray-600">{insight.category}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={getConfidenceBadge(insight.confidence_level)}>
                  {insight.confidence_level} Confidence
                </span>
                <span className="text-xs text-gray-500">
                  {Math.round(insight.consensus_score * 100)}% consensus
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
            
            {/* Cultural Analysis */}
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCulturalDepthColor(insight.cultural_analysis.cultural_depth)}`}>
                  {insight.cultural_analysis.cultural_depth} cultural depth
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTouristImpactColor(insight.cultural_analysis.tourist_impact)}`}>
                  {insight.cultural_analysis.tourist_impact} tourist impact
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-50">
                  {insight.cultural_analysis.local_importance} to locals
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium text-purple-600 bg-purple-50">
                  {insight.cultural_analysis.universality} applicability
                </span>
              </div>
            </div>
            
            {/* Application Tips */}
            <div className={`evidence-panel collapsible-header ${expandedPanels.has(`tips-${insight.id}`) ? 'active' : ''}`}>
              <div className="flex justify-between items-center cursor-pointer" onClick={() => togglePanel(`tips-${insight.id}`)}>
                <p className="text-sm font-medium text-gray-700">💡 Application Tips ({insight.application_tips.length})</p>
                <FiChevronDown className={`text-gray-500 transform transition-transform ${expandedPanels.has(`tips-${insight.id}`) ? 'rotate-180' : ''}`} />
              </div>
              <div className="collapsible-content">
                <ul className="mt-2 space-y-1">
                  {insight.application_tips.map((tip, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Evidence Sources */}
            {insight.evidence_sources && insight.evidence_sources.length > 0 && (
              <div className={`evidence-panel collapsible-header ${expandedPanels.has(`evidence-${insight.id}`) ? 'active' : ''}`}>
                <div className="flex justify-between items-center cursor-pointer" onClick={() => togglePanel(`evidence-${insight.id}`)}>
                  <p className="text-sm font-medium text-gray-700">🔍 Evidence Sources ({insight.evidence_sources.length})</p>
                  <FiChevronDown className={`text-gray-500 transform transition-transform ${expandedPanels.has(`evidence-${insight.id}`) ? 'rotate-180' : ''}`} />
                </div>
                <div className="collapsible-content">
                  <div className="mt-2 space-y-2">
                    {insight.evidence_sources.map((source, index) => (
                      <div key={index} className="p-2 bg-white rounded border border-gray-200">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-xs font-medium text-gray-800">{source.title}</p>
                          <span className="text-xs text-gray-500">
                            {Math.round(source.confidence_score * 100)}% confidence
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{source.snippet}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-blue-600">{source.evidence_type}</span>
                          <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                            View Source
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h5 className="font-semibold text-gray-800 mb-2">🧠 Multi-LLM Consensus Process</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-3 bg-white rounded border">
            <div className="font-bold text-blue-600">Tier 1</div>
            <div className="text-gray-700">Multi-LLM Generation</div>
            <div className="text-xs text-gray-500 mt-1">3 LLM providers generated candidates</div>
          </div>
          <div className="text-center p-3 bg-white rounded border">
            <div className="font-bold text-green-600">Tier 2</div>
            <div className="text-gray-700">Consensus Selection</div>
            <div className="text-xs text-gray-500 mt-1">Selected insights with 60%+ agreement</div>
          </div>
          <div className="text-center p-3 bg-white rounded border">
            <div className="font-bold text-purple-600">Tier 3</div>
            <div className="text-gray-700">Evidence Validation</div>
            <div className="text-xs text-gray-500 mt-1">Web search validation & cultural analysis</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalInsiderAgent;
