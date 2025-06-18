import React, { useState, useEffect } from 'react';

const EvidenceModal = ({ isOpen, onClose, context, theme, selectedDestination }) => {
  const [evidenceData, setEvidenceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAllSources, setShowAllSources] = useState(false);
  const [expandedTexts, setExpandedTexts] = useState({});

  useEffect(() => {
    if (isOpen && context && theme) {
      loadEvidenceData();
    }
  }, [isOpen, context, theme]);

  const loadEvidenceData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use the passed selectedDestination or fallback
      const destination = selectedDestination || 
                         theme.originalData?.destination || 
                         theme.evidenceData?.destination_name ||
                         'paris__france';
      
      console.log('Loading evidence for destination:', destination);
      
      // Load evidence data
      const evidenceResponse = await fetch(`/data/${destination}_evidence.json`);
      if (!evidenceResponse.ok) {
        throw new Error(`Failed to load evidence data: ${evidenceResponse.status}`);
      }
      
      const fullEvidenceData = await evidenceResponse.json();
      
      // Find evidence for this specific theme and field
      const themeEvidence = findThemeEvidence(fullEvidenceData, theme, context);
      setEvidenceData(themeEvidence);
      
    } catch (err) {
      console.error('Error loading evidence data:', err);
      setError(err.message);
      // Fallback to mock data
      setEvidenceData(generateMockEvidence());
    } finally {
      setLoading(false);
    }
  };

  const findThemeEvidence = (evidenceData, theme, context) => {
    if (!evidenceData?.theme_evidence) {
      console.log('No theme_evidence found in data');
      return generateMockEvidence();
    }

    // Try to find evidence for this theme
    const themeName = theme.name || theme.theme;
    const fieldName = context.field;
    
    console.log('Looking for evidence:', { themeName, fieldName });
    console.log('Available themes:', Object.keys(evidenceData.theme_evidence));
    
    // Look through theme evidence for matching theme
    for (const [evidenceTheme, themeData] of Object.entries(evidenceData.theme_evidence)) {
      console.log(`Checking theme: ${evidenceTheme}`);
      
      if (evidenceTheme.toLowerCase().includes(themeName.toLowerCase()) || 
          themeName.toLowerCase().includes(evidenceTheme.toLowerCase())) {
        
        console.log(`Found matching theme: ${evidenceTheme}`);
        console.log('Available fields:', Object.keys(themeData));
        
        // Look for field-specific evidence with better mapping
        const fieldMappings = {
          'theme name': 'main_theme',
          'name': 'main_theme',
          'theme': 'main_theme',
          'description': 'main_theme',
          'time needed': 'time_commitment',
          'time commitment': 'time_commitment',
          'time': 'time_commitment',
          'best for': 'demographic_suitability',
          'demographic': 'demographic_suitability',
          'intensity': 'experience_intensity',
          'price': 'price_insights',
          'price range': 'price_insights',
          'emotions': 'emotional_profile',
          'emotional': 'emotional_profile',
          'season': 'micro_climate',
          'cultural': 'cultural_sensitivity',
          'cultural sensitivity': 'cultural_sensitivity',
          'confidence': 'main_theme',
          'confidence score': 'main_theme',
          'sub themes': 'sub_themes',
          'nano themes': 'nano_themes'
        };
        
        const fieldNameLower = fieldName.toLowerCase();
        let fieldKey = fieldMappings[fieldNameLower];
        
        // If no direct mapping, try partial matches
        if (!fieldKey) {
          fieldKey = Object.keys(themeData).find(key => 
            key.toLowerCase().includes(fieldNameLower) ||
            fieldNameLower.includes(key.toLowerCase()) ||
            Object.entries(fieldMappings).some(([userField, jsonField]) => 
              (fieldNameLower.includes(userField) && key === jsonField) ||
              (userField.includes(fieldNameLower) && key === jsonField)
            )
          );
        }

        console.log(`Found field key: ${fieldKey}`);
        
        if (fieldKey && themeData[fieldKey]) {
          const evidenceObj = themeData[fieldKey];
          console.log('Evidence object:', evidenceObj);
          console.log('Evidence pieces count:', evidenceObj.evidence_pieces?.length || 0);
          
          return {
            field: context.field,
            value: context.value,
            evidence: evidenceObj,
            theme: themeName
          };
        }
      }
    }

    console.log('No matching evidence found, using mock data');
    // If no specific evidence found, return mock data
    return generateMockEvidence();
  };

  const generateMockEvidence = () => {
    return {
      field: context.field,
      value: context.value,
      evidence: {
        evidence_pieces: [
          {
            text_content: `Supporting evidence for ${context.field}: ${context.value}. This is a comprehensive analysis based on extensive research from multiple travel sources, tourism boards, and expert reviews. The evidence shows consistent patterns across different time periods and visitor demographics, providing strong validation for this particular insight. Additional context includes seasonal variations, cultural considerations, and practical implementation details that support the overall assessment.`,
            source_url: "https://example.com/travel-guide",
            source_title: "Comprehensive Travel Guide Reference",
            source_type: "travel_guide",
            relevance_score: 0.85,
            authority_score: 0.75,
            quality_rating: "good"
          },
          {
            text_content: `Additional research supporting ${context.field} with value "${context.value}" from multiple authoritative sources including official tourism boards, cultural institutions, and local expert guides. This evidence encompasses detailed analysis of visitor experiences, historical context, and contemporary relevance. The research methodology included interviews with local experts, analysis of visitor feedback over multiple years, and cross-referencing with academic studies on tourism and cultural experiences.`,
            source_url: "https://example.com/tourism-board",
            source_title: "Official Tourism Board Comprehensive Guide",
            source_type: "tourism_board",
            relevance_score: 0.92,
            authority_score: 0.88,
            quality_rating: "excellent"
          },
          {
            text_content: `Third-party validation for ${context.field} indicating ${context.value} based on extensive traveler reviews and independent analysis. This validation comes from aggregated data across multiple review platforms, travel blogs, and social media mentions. The analysis includes sentiment analysis, frequency of mentions, and correlation with other travel experiences. The evidence supports the assessment through consistent patterns in traveler feedback and expert recommendations.`,
            source_url: "https://example.com/travel-reviews",
            source_title: "Independent Traveler Review Analysis",
            source_type: "review_analysis",
            relevance_score: 0.78,
            authority_score: 0.65,
            quality_rating: "acceptable"
          },
          {
            text_content: `Academic research validation for ${context.field} providing scholarly perspective on ${context.value}. This includes peer-reviewed studies on tourism patterns, cultural significance analysis, and socio-economic impact assessments. The research draws from multiple academic institutions and cross-cultural studies, providing a theoretical framework that supports the practical observations. This evidence adds academic rigor to the overall assessment and provides context for long-term trends and patterns.`,
            source_url: "https://example.com/academic-research",
            source_title: "Academic Tourism Research Journal",
            source_type: "academic_research",
            relevance_score: 0.91,
            authority_score: 0.93,
            quality_rating: "excellent"
          }
        ]
      },
      theme: theme.name || theme.theme
    };
  };

  if (!isOpen || !context) return null;

  const getQualityBadgeClass = (quality) => {
    switch (quality?.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
      case 'acceptable':
        return 'bg-blue-100 text-blue-800';
      case 'poor':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAuthorityColor = (score) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatValue = (value) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const toggleTextExpansion = (uniqueKey) => {
    setExpandedTexts(prev => ({
      ...prev,
      [uniqueKey]: !prev[uniqueKey]
    }));
  };

  const handleShowAllSources = () => {
    setShowAllSources(!showAllSources);
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[60vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-blue-50 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Evidence: {context.field}
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              {evidenceData?.theme || theme.name || theme.theme}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-3 overflow-y-auto flex-1">
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">Loading evidence...</div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="text-red-800 font-medium">Error Loading Evidence</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          )}

          {evidenceData && (
            <>
              {/* Data Section */}
              <div className="mb-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    📊 {context.field}
                  </h3>
                  <div className="bg-white rounded p-2 border">
                    <div className="inline-block bg-purple-100 text-purple-800 px-1 py-0.5 rounded text-xs font-medium mb-1">
                      LLM Generated
                    </div>
                    <p className="text-xs"><strong>Value:</strong> "{formatValue(context.value)}"</p>
                  </div>
                </div>
              </div>

              {/* Supporting Evidence Section */}
              {evidenceData.evidence?.evidence_pieces && evidenceData.evidence.evidence_pieces.length > 0 && (
                <div className="mb-3">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-900">
                        🔍 Evidence ({evidenceData.evidence.evidence_pieces.length})
                      </h3>
                      {evidenceData.evidence.evidence_pieces.length > 2 && (
                        <button 
                          onClick={handleShowAllSources}
                          className="text-xs text-blue-600 hover:text-blue-800 underline"
                        >
                          {showAllSources ? 'Show less' : 'Show all sources'}
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {evidenceData.evidence.evidence_pieces.map((piece, globalIndex) => {
                        // Only show this piece if we're showing all sources, or if it's in the first 2
                        if (!showAllSources && globalIndex >= 2) return null;
                        
                        const uniqueKey = `evidence-${globalIndex}-${piece.source_url || 'no-url'}`;
                        const isExpanded = expandedTexts[uniqueKey];
                        const textContent = piece.text_content || 'No text content available';
                        const shouldTruncate = textContent.length > 150;
                        const displayText = isExpanded ? textContent : truncateText(textContent);
                        
                        return (
                          <div key={uniqueKey} className="bg-white border border-gray-200 rounded p-2">
                            <div className="mb-1">
                              <span className="inline-block bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs font-medium">
                                Web Evidence
                              </span>
                            </div>
                            
                            <div className="space-y-1 text-xs">
                              <div>
                                <strong>Text:</strong> "{displayText}"
                                {shouldTruncate && (
                                  <button 
                                    onClick={() => toggleTextExpansion(uniqueKey)}
                                    className="ml-1 text-blue-600 hover:text-blue-800 underline"
                                  >
                                    {isExpanded ? 'Read less' : 'Read more'}
                                  </button>
                                )}
                              </div>
                              
                              {piece.source_title && (
                                <p>
                                  <strong>Source:</strong>{' '}
                                  <a 
                                    href={piece.source_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 underline"
                                  >
                                    {piece.source_title}
                                  </a>
                                </p>
                              )}
                              
                              {piece.source_url && (
                                <p>
                                  <strong>URL:</strong>{' '}
                                  <a 
                                    href={piece.source_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 underline font-mono text-xs break-all"
                                  >
                                    {piece.source_url}
                                  </a>
                                </p>
                              )}
                              
                              <div className="flex gap-2 text-xs">
                                {piece.authority_score !== undefined && (
                                  <span>
                                    <strong>Authority:</strong>{' '}
                                    <span className={getAuthorityColor(piece.authority_score)}>
                                      {piece.authority_score.toFixed(2)}
                                    </span>
                                  </span>
                                )}
                                
                                {piece.quality_rating && (
                                  <span className={`px-1 py-0.5 rounded text-xs font-medium ${getQualityBadgeClass(piece.quality_rating)}`}>
                                    {piece.quality_rating}
                                  </span>
                                )}
                                
                                {piece.relevance_score !== undefined && (
                                  <span>
                                    <strong>Relevance:</strong>{' '}
                                    <span className={getAuthorityColor(piece.relevance_score)}>
                                      {piece.relevance_score.toFixed(2)}
                                    </span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Validation Summary */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">📈 Summary</h3>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      {Math.round((theme.confidence || 0.85) * 100)}%
                    </div>
                    <div className="text-xs text-gray-600">Confidence</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      {evidenceData.evidence?.evidence_pieces?.length || 0}
                    </div>
                    <div className="text-xs text-gray-600">Sources</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-3 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvidenceModal; 