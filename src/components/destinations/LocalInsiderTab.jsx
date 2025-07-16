import React, { useState, useMemo } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { 
  EyeIcon, 
  UsersIcon, 
  ChatBubbleLeftRightIcon, 
  MapPinIcon, 
  ClockIcon, 
  StarIcon,
  HeartIcon,
  BuildingOfficeIcon,
  ShoppingBagIcon,
  MusicalNoteIcon,
  BookOpenIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const LocalInsiderTab = ({ selectedDestination, onEvidenceClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedInsights, setExpandedInsights] = useState(new Set());

  // Clickable insight component
  const ClickableInsight = ({ children, context, className = "", as = "span" }) => {
    const Component = as;
    return (
      <Component
        className={`cursor-pointer hover:text-blue-600 hover:underline transition-colors ${className}`}
        onClick={(e) => {
          e.stopPropagation();
          if (onEvidenceClick) {
            onEvidenceClick({
              type: 'local_insider',
              insight: context.insight,
              field: context.field,
              value: context.value
            });
          }
        }}
        title={`Click to view evidence for ${context.field}`}
      >
        {children}
      </Component>
    );
  };

  const toggleInsight = (insightId) => {
    setExpandedInsights(prev => {
      const newSet = new Set(prev);
      if (newSet.has(insightId)) {
        newSet.delete(insightId);
      } else {
        newSet.add(insightId);
      }
      return newSet;
    });
  };

  // Mock data based on LocalInsiderKnowledgeAgent structure - memoized for performance
  const localInsiderData = useMemo(() => ({
    paris: [
      {
        id: 'tourist-tells-1',
        category: 'Tourist Tells & How to Blend In',
        insight_title: 'Never Use Hotel Umbrellas',
        description: 'Locals in Paris never use umbrellas, even in heavy rain. They wear stylish rain coats and scarves instead. Using a hotel umbrella immediately marks you as a tourist and disrupts the aesthetic flow of Parisian streets.',
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
          'Invest in a chic French rain coat from local boutiques',
          'Observe how locals dress during rain - it\'s part of their style',
          'This is well-established local knowledge - you can rely on it'
        ],
        evidence_sources: [
          {
            title: 'Parisian Street Style in Rain',
            snippet: 'Fashion-conscious Parisians view umbrellas as tourist accessories that clash with their carefully curated street style',
            url: 'https://example.com/paris-rain-style',
            evidence_type: 'cultural_observation',
            confidence_score: 0.88,
            authority_score: 0.85
          }
        ]
      },
      {
        id: 'social-rules-1',
        category: 'Unwritten Social Rules',
        insight_title: 'Café Etiquette: Order Standing vs. Sitting',
        description: 'In Parisian cafés, there\'s a price difference between standing at the bar (comptoir) and sitting at a table. Locals often stand for quick coffee and only sit for longer social interactions. Tourists who immediately grab tables for quick coffee are easily spotted.',
        confidence_level: 'High',
        consensus_score: 0.89,
        provider_count: 3,
        cultural_analysis: {
          cultural_depth: 'deep',
          tourist_impact: 'moderate',
          local_importance: 'critical',
          universality: 'universal'
        },
        application_tips: [
          'Check the price difference between "comptoir" and "table" on the menu',
          'Stand at the bar for quick espresso, sit for longer conversations',
          'This is well-established local knowledge - you can rely on it'
        ],
        evidence_sources: [
          {
            title: 'French Café Culture Guide',
            snippet: 'Traditional pricing structure reflects the social function of different café spaces',
            url: 'https://example.com/cafe-culture',
            evidence_type: 'cultural_documentation',
            confidence_score: 0.92,
            authority_score: 0.90
          }
        ]
      },
      {
        id: 'communication-1',
        category: 'Local Slang & Communication',
        insight_title: 'Greeting Shopkeepers Properly',
        description: 'Always say "Bonjour Madame/Monsieur" when entering any shop, even if you\'re just browsing. Locals never enter a shop without greeting the owner. Failing to do this is considered extremely rude and marks you as an inconsiderate tourist.',
        confidence_level: 'High',
        consensus_score: 0.95,
        provider_count: 3,
        cultural_analysis: {
          cultural_depth: 'deep',
          tourist_impact: 'high',
          local_importance: 'critical',
          universality: 'universal'
        },
        application_tips: [
          'Practice the proper pronunciation of "Bonjour Madame/Monsieur"',
          'Make eye contact and smile when greeting',
          'This is well-established local knowledge - you can rely on it'
        ],
        evidence_sources: [
          {
            title: 'French Politeness Customs',
            snippet: 'Greeting shopkeepers is fundamental to French social interaction and commercial etiquette',
            url: 'https://example.com/french-politeness',
            evidence_type: 'cultural_norm',
            confidence_score: 0.96,
            authority_score: 0.94
          }
        ]
      },
      {
        id: 'neighborhood-1',
        category: 'Neighborhood Dynamics',
        insight_title: 'Arrondissement Social Hierarchies',
        description: 'Each arrondissement has its own social character. The 16th is old money conservative, the 11th is young and trendy, the 7th is political elite. Locals can instantly identify your social status by which arrondissement you mention staying in.',
        confidence_level: 'Medium',
        consensus_score: 0.78,
        provider_count: 2,
        cultural_analysis: {
          cultural_depth: 'deep',
          tourist_impact: 'moderate',
          local_importance: 'important',
          universality: 'situational'
        },
        application_tips: [
          'Research the character of your arrondissement before conversations',
          'Understand the social implications of where you\'re staying',
          'This may vary by specific area or demographic - verify locally'
        ],
        evidence_sources: [
          {
            title: 'Paris Arrondissement Social Geography',
            snippet: 'Historical development patterns created distinct social identities for each district',
            url: 'https://example.com/paris-social-geography',
            evidence_type: 'sociological_analysis',
            confidence_score: 0.82,
            authority_score: 0.75
          }
        ]
      },
      {
        id: 'food-culture-1',
        category: 'Food & Drink Culture Reality',
        insight_title: 'Lunch Timing and Duration',
        description: 'Parisians take lunch very seriously from 12:00-14:00. Many shops close, and it\'s considered rude to rush someone during lunch. Tourists who try to shop or conduct business during this time are met with resistance.',
        confidence_level: 'High',
        consensus_score: 0.91,
        provider_count: 3,
        cultural_analysis: {
          cultural_depth: 'deep',
          tourist_impact: 'high',
          local_importance: 'critical',
          universality: 'universal'
        },
        application_tips: [
          'Plan your day around the sacred lunch hours',
          'Use lunch time for your own meal, not shopping',
          'This is well-established local knowledge - you can rely on it'
        ],
        evidence_sources: [
          {
            title: 'French Work Culture and Meal Times',
            snippet: 'Lunch break is protected by labor laws and deeply ingrained in French culture',
            url: 'https://example.com/french-lunch-culture',
            evidence_type: 'cultural_practice',
            confidence_score: 0.93,
            authority_score: 0.91
          }
        ]
      },
      {
        id: 'transportation-1',
        category: 'Transportation Reality',
        insight_title: 'Metro Etiquette During Rush Hour',
        description: 'During rush hour (8-9 AM, 6-7 PM), Parisians have strict metro etiquette: let people exit before entering, move to the center of the car, remove backpacks. Tourists who block doors or don\'t follow these rules face visible frustration.',
        confidence_level: 'High',
        consensus_score: 0.87,
        provider_count: 3,
        cultural_analysis: {
          cultural_depth: 'moderate',
          tourist_impact: 'high',
          local_importance: 'important',
          universality: 'common'
        },
        application_tips: [
          'Observe local behavior during your first few metro rides',
          'Remove your backpack in crowded cars',
          'This is well-established local knowledge - you can rely on it'
        ],
        evidence_sources: [
          {
            title: 'Paris Metro Commuter Behavior Study',
            snippet: 'Unwritten rules developed to manage high-density urban transportation',
            url: 'https://example.com/metro-etiquette',
            evidence_type: 'behavioral_study',
            confidence_score: 0.89,
            authority_score: 0.83
          }
        ]
      },
      {
        id: 'work-life-1',
        category: 'Work & Daily Life Rhythms',
        insight_title: 'August Vacation Exodus',
        description: 'Many Parisians leave the city in August, and numerous local businesses close for 2-3 weeks. The city feels different - quieter, with more tourists than locals. Knowing this helps you understand why some neighborhoods feel "off" during this time.',
        confidence_level: 'High',
        consensus_score: 0.94,
        provider_count: 3,
        cultural_analysis: {
          cultural_depth: 'moderate',
          tourist_impact: 'moderate',
          local_importance: 'important',
          universality: 'universal'
        },
        application_tips: [
          'Check if your favorite local spots will be open in August',
          'Expect a different, more touristy atmosphere',
          'This is well-established local knowledge - you can rely on it'
        ],
        evidence_sources: [
          {
            title: 'French Vacation Patterns Analysis',
            snippet: 'August closures are a deeply rooted tradition in French work culture',
            url: 'https://example.com/august-vacation',
            evidence_type: 'cultural_tradition',
            confidence_score: 0.95,
            authority_score: 0.92
          }
        ]
      },
      {
        id: 'shopping-1',
        category: 'Shopping & Services Reality',
        insight_title: 'Market Day Protocols',
        description: 'At local markets, there\'s an unspoken order: regulars get priority, you don\'t touch produce until the vendor hands it to you, and you bring your own bags. Tourists who grab produce or expect plastic bags are immediately identified.',
        confidence_level: 'High',
        consensus_score: 0.86,
        provider_count: 3,
        cultural_analysis: {
          cultural_depth: 'moderate',
          tourist_impact: 'high',
          local_importance: 'important',
          universality: 'common'
        },
        application_tips: [
          'Bring a proper market bag or basket',
          'Wait for the vendor to select and hand you items',
          'This is well-established local knowledge - you can rely on it'
        ],
        evidence_sources: [
          {
            title: 'French Market Culture Guide',
            snippet: 'Traditional market protocols preserve quality and vendor-customer relationships',
            url: 'https://example.com/market-culture',
            evidence_type: 'cultural_practice',
            confidence_score: 0.88,
            authority_score: 0.84
          }
        ]
      }
    ],
    tokyo: [
      {
        id: 'tourist-tells-tokyo-1',
        category: 'Tourist Tells & How to Blend In',
        insight_title: 'Bowing Depth and Duration',
        description: 'Tourists often bow too deeply or hold bows too long. Locals use quick, shallow nods for casual interactions and save deeper bows for formal situations. Over-bowing marks you as a foreigner trying too hard.',
        confidence_level: 'High',
        consensus_score: 0.88,
        provider_count: 3,
        cultural_analysis: {
          cultural_depth: 'deep',
          tourist_impact: 'moderate',
          local_importance: 'important',
          universality: 'common'
        },
        application_tips: [
          'Observe the depth and duration of local bows',
          'A slight nod is often sufficient for casual interactions',
          'This is well-established local knowledge - you can rely on it'
        ],
        evidence_sources: [
          {
            title: 'Japanese Business Etiquette Guide',
            snippet: 'Proper bowing technique varies significantly by context and relationship',
            url: 'https://example.com/japanese-bowing',
            evidence_type: 'cultural_guide',
            confidence_score: 0.90,
            authority_score: 0.87
          }
        ]
      }
    ],
    london: [
      {
        id: 'tourist-tells-london-1',
        category: 'Tourist Tells & How to Blend In',
        insight_title: 'Tube Escalator Etiquette',
        description: 'Stand on the right, walk on the left. This is sacred on London escalators. Tourists who stand on the left or walk slowly cause visible frustration during rush hour.',
        confidence_level: 'High',
        consensus_score: 0.96,
        provider_count: 3,
        cultural_analysis: {
          cultural_depth: 'moderate',
          tourist_impact: 'high',
          local_importance: 'critical',
          universality: 'universal'
        },
        application_tips: [
          'Always check which side locals are standing on',
          'Move quickly if you choose to walk on the left',
          'This is well-established local knowledge - you can rely on it'
        ],
        evidence_sources: [
          {
            title: 'London Transport Etiquette',
            snippet: 'Escalator etiquette is enforced by social pressure and efficiency needs',
            url: 'https://example.com/tube-etiquette',
            evidence_type: 'transportation_culture',
            confidence_score: 0.97,
            authority_score: 0.95
          }
        ]
      }
    ]
  }), []); // Empty dependency array since this is static mock data

  const getCategoryIcon = (category) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('tourist') || categoryLower.includes('blend')) return <EyeIcon className="w-5 h-5 text-blue-500" />;
    if (categoryLower.includes('social') || categoryLower.includes('rules')) return <UsersIcon className="w-5 h-5 text-green-500" />;
    if (categoryLower.includes('communication') || categoryLower.includes('slang')) return <ChatBubbleLeftRightIcon className="w-5 h-5 text-purple-500" />;
    if (categoryLower.includes('neighborhood')) return <MapPinIcon className="w-5 h-5 text-red-500" />;
    if (categoryLower.includes('food') || categoryLower.includes('drink')) return <ClockIcon className="w-5 h-5 text-orange-500" />;
    if (categoryLower.includes('transport')) return <StarIcon className="w-5 h-5 text-indigo-500" />;
    if (categoryLower.includes('work') || categoryLower.includes('daily')) return <BuildingOfficeIcon className="w-5 h-5 text-gray-500" />;
    if (categoryLower.includes('shopping')) return <ShoppingBagIcon className="w-5 h-5 text-pink-500" />;
    if (categoryLower.includes('entertainment')) return <MusicalNoteIcon className="w-5 h-5 text-yellow-500" />;
    if (categoryLower.includes('historical') || categoryLower.includes('cultural')) return <BookOpenIcon className="w-5 h-5 text-teal-500" />;
    if (categoryLower.includes('current') || categoryLower.includes('issues')) return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
    return <HeartIcon className="w-5 h-5 text-gray-500" />;
  };

  const getConfidenceBadge = (confidence) => {
    const confidenceLower = confidence.toLowerCase();
    if (confidenceLower === 'high') return 'bg-green-100 text-green-800';
    if (confidenceLower === 'medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getCulturalDepthColor = (depth) => {
    if (depth === 'deep') return 'bg-green-100 text-green-700';
    if (depth === 'moderate') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getTouristImpactColor = (impact) => {
    if (impact === 'high') return 'bg-red-100 text-red-700';
    if (impact === 'moderate') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  // Get destination key for data lookup
  const getDestinationKey = (destination) => {
    if (!destination) return 'paris';
    const normalized = destination.toLowerCase().replace(/[^a-z]/g, '');
    if (normalized.includes('paris')) return 'paris';
    if (normalized.includes('tokyo')) return 'tokyo';
    if (normalized.includes('london')) return 'london';
    return 'paris'; // Default fallback
  };

  const destinationKey = getDestinationKey(selectedDestination);
  const insights = localInsiderData[destinationKey] || localInsiderData.paris;

  // Filter insights based on search term
  const filteredInsights = insights.filter(insight =>
    insight.insight_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insight.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insight.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics
  const stats = {
    totalInsights: insights.length,
    highConfidence: insights.filter(i => i.confidence_level === 'High').length,
    categories: new Set(insights.map(i => i.category)).size,
    avgConsensus: Math.round(insights.reduce((acc, i) => acc + i.consensus_score, 0) / insights.length * 100)
  };

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-2 border-l-2 border-cyan-400">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium text-gray-900">
            Discover authentic local culture, unwritten rules, and insider secrets that separate tourists from locals. Generated using multi-LLM consensus and validated with cultural evidence.
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
            <div className="flex items-center">
              <div className="text-sm font-bold text-cyan-600">{stats.totalInsights}</div>
              <div className="ml-1">
                <div className="text-xs font-medium text-gray-900">Insider Insights</div>
                <div className="text-xs text-gray-500">Available insights</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
            <div className="flex items-center">
              <div className="text-sm font-bold text-cyan-600">{stats.highConfidence}</div>
              <div className="ml-1">
                <div className="text-xs font-medium text-gray-900">High Confidence</div>
                <div className="text-xs text-gray-500">Validated insights</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
            <div className="flex items-center">
              <div className="text-sm font-bold text-cyan-600">{stats.categories}</div>
              <div className="ml-1">
                <div className="text-xs font-medium text-gray-900">Categories</div>
                <div className="text-xs text-gray-500">Cultural areas</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
            <div className="flex items-center">
              <div className="text-sm font-bold text-cyan-600">{stats.avgConsensus}%</div>
              <div className="ml-1">
                <div className="text-xs font-medium text-gray-900">Avg Consensus</div>
                <div className="text-xs text-gray-500">LLM agreement</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search local insights..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredInsights.map((insight) => (
          <div key={insight.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  {getCategoryIcon(insight.category)}
                  <div>
                    <ClickableInsight
                      as="h4"
                      context={{ field: 'Insight Title', value: insight.insight_title, insight: insight }}
                      className="text-lg font-semibold text-gray-900"
                    >
                      {insight.insight_title}
                    </ClickableInsight>
                    <p className="text-sm text-gray-600">{insight.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ClickableInsight
                    context={{ field: 'Confidence Level', value: insight.confidence_level, insight: insight }}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceBadge(insight.confidence_level)}`}
                  >
                    {insight.confidence_level}
                  </ClickableInsight>
                  <ClickableInsight
                    context={{ field: 'Consensus Score', value: insight.consensus_score, insight: insight }}
                    className="text-xs text-gray-500"
                  >
                    {Math.round(insight.consensus_score * 100)}% consensus
                  </ClickableInsight>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-4">{insight.description}</p>

              {/* Cultural Analysis Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCulturalDepthColor(insight.cultural_analysis.cultural_depth)}`}>
                  {insight.cultural_analysis.cultural_depth} cultural depth
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTouristImpactColor(insight.cultural_analysis.tourist_impact)}`}>
                  {insight.cultural_analysis.tourist_impact} tourist impact
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {insight.cultural_analysis.local_importance} to locals
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                  {insight.cultural_analysis.universality} applicability
                </span>
              </div>

              {/* Expandable Details */}
              <button
                onClick={() => toggleInsight(insight.id)}
                className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                <span>View Application Tips & Evidence</span>
                {expandedInsights.has(insight.id) ? (
                  <ChevronUpIcon className="w-4 h-4" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4" />
                )}
              </button>

              {/* Expanded Content */}
              {expandedInsights.has(insight.id) && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                  {/* Application Tips */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">💡 Application Tips</h5>
                    <ul className="space-y-1">
                      {insight.application_tips.map((tip, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-purple-500 mr-2 mt-1">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Evidence Sources */}
                  {insight.evidence_sources && insight.evidence_sources.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">🔍 Evidence Sources</h5>
                      <div className="space-y-2">
                        {insight.evidence_sources.map((source, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start mb-1">
                              <h6 className="text-sm font-medium text-gray-800">{source.title}</h6>
                              <div className="flex space-x-2">
                                <span className="text-xs text-gray-500">
                                  {Math.round(source.confidence_score * 100)}% confidence
                                </span>
                                <span className="text-xs text-gray-500">
                                  {Math.round(source.authority_score * 100)}% authority
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{source.snippet}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                                {source.evidence_type}
                              </span>
                              <button
                                onClick={() => onEvidenceClick && onEvidenceClick({
                                  type: 'local_insider',
                                  field: 'evidence_validation',
                                  source: source,
                                  insight: insight
                                })}
                                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                View Evidence
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Multi-LLM Process Info */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">🧠 Multi-LLM Consensus Process</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-lg font-bold text-blue-600 mb-1">Tier 1</div>
            <div className="text-sm font-medium text-gray-700 mb-1">Multi-LLM Generation</div>
            <div className="text-xs text-gray-500">3 LLM providers generate cultural insights</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-lg font-bold text-green-600 mb-1">Tier 2</div>
            <div className="text-sm font-medium text-gray-700 mb-1">Consensus Selection</div>
            <div className="text-xs text-gray-500">Select insights with 60%+ agreement</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-lg font-bold text-purple-600 mb-1">Tier 3</div>
            <div className="text-sm font-medium text-gray-700 mb-1">Evidence Validation</div>
            <div className="text-xs text-gray-500">Web search validation & cultural analysis</div>
          </div>
        </div>
      </div>

      {/* No Results */}
      {filteredInsights.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">🔍</div>
          <p className="text-gray-600">No insights found matching "{searchTerm}"</p>
          <button
            onClick={() => setSearchTerm('')}
            className="text-purple-600 hover:text-purple-800 text-sm mt-2"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
};

export default LocalInsiderTab;
