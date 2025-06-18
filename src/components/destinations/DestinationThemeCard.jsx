import React, { useState } from 'react';
import EvidenceModal from './EvidenceModal';

const DestinationThemeCard = ({ theme, selectedDestination, onEvidenceClick }) => {
  const [showEvidence, setShowEvidence] = useState(false);
  const [evidenceContext, setEvidenceContext] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  const handleEvidenceClick = (context, event) => {
    event.stopPropagation();
    setEvidenceContext(context);
    setShowEvidence(true);
    if (onEvidenceClick) {
      onEvidenceClick(context);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const EvidencePaperclip = ({ context, className = "", asSpan = false }) => {
    const commonProps = {
      className: `inline-flex items-center justify-center w-4 h-4 ml-1 text-xs text-blue-600 hover:text-blue-800 transition-colors cursor-pointer ${className}`,
      onClick: (e) => handleEvidenceClick(context, e),
      title: `View evidence for ${context.field}`,
    };

    if (asSpan) {
      return (
        <span {...commonProps} role="button" tabIndex={0}>
          📎
        </span>
      );
    }

    return (
      <button
        {...commonProps}
        aria-label={`View evidence for ${context.field}`}
      >
        📎
      </button>
    );
  };

  // Text truncation component
  const TruncatedText = ({ text, maxLength = 80, sectionId }) => {
    if (!text || text.length <= maxLength) {
      return <span>{text}</span>;
    }

    const isExpanded = expandedSections[sectionId];
    const displayText = isExpanded ? text : `${text.substring(0, maxLength)}...`;

    return (
      <span>
        {displayText}
        <button
          onClick={() => toggleSection(sectionId)}
          className="ml-2 text-blue-600 hover:text-blue-800 text-xs underline"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      </span>
    );
  };

  // Helper function for confidence styling
  const getConfidenceClass = (confidence) => {
    if (confidence >= 0.95) return 'confidence-perfect text-blue-600';
    if (confidence >= 0.8) return 'confidence-high text-green-600';
    if (confidence >= 0.6) return 'confidence-medium text-yellow-600';
    return 'confidence-low text-red-600';
  };

  // Helper function for intelligence badges
  const renderIntelligenceBadges = () => {
    const badges = [];
    
    // Add intelligence badges based on theme data
    if (theme.intelligenceBadges) {
      theme.intelligenceBadges.forEach((badge, index) => {
        let badgeClass = 'badge-nano'; // default
        
        if (badge.includes('balanced')) badgeClass = 'badge-balanced';
        else if (badge.includes('local')) badgeClass = 'badge-local';
        else if (badge.includes('moderate')) badgeClass = 'badge-moderate';
        else if (badge.includes('contemplative') || badge.includes('peaceful') || badge.includes('inspiring')) badgeClass = 'badge-contemplative';
        
        badges.push(
          <span key={index} className={`${badgeClass} text-white px-2 py-1 rounded-full text-xs`}>
            {badge}
          </span>
        );
      });
    } else {
      // Default badges based on theme properties
      badges.push(<span key="nano" className="badge-nano text-white px-2 py-1 rounded-full text-xs">📊 nano</span>);
      
      if (theme.category === 'culture') {
        badges.push(<span key="local" className="badge-local text-white px-2 py-1 rounded-full text-xs">🌟 local influenced</span>);
      } else {
        badges.push(<span key="balanced" className="badge-balanced text-white px-2 py-1 rounded-full text-xs">🌟 balanced</span>);
      }
      
      badges.push(<span key="path" className="badge-local text-white px-2 py-1 rounded-full text-xs">⭐ off beaten path</span>);
      
      if (theme.emotions && theme.emotions.length > 0) {
        const emotion = theme.emotions[0].toLowerCase();
        badges.push(<span key="emotion" className="badge-contemplative text-white px-2 py-1 rounded-full text-xs">✨ {emotion}</span>);
      } else {
        badges.push(<span key="default-emotion" className="badge-contemplative text-white px-2 py-1 rounded-full text-xs">✨ inspiring</span>);
      }
    }
    
    return badges;
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-500 transition-all duration-200">
        {/* Theme Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center">
              {theme.name || theme.theme}
              <EvidencePaperclip 
                context={{
                  type: 'theme',
                  field: 'Theme Name',
                  value: theme.name || theme.theme,
                  themeId: theme.id || theme.theme
                }}
              />
            </h3>
            <p className="text-sm text-gray-600 flex items-center">
              {theme.category || 'experience'}
              <EvidencePaperclip 
                context={{
                  type: 'theme',
                  field: 'Category',
                  value: theme.category,
                  themeId: theme.id || theme.theme
                }}
              />
            </p>
          </div>
          <div className="text-right ml-4">
            <div className={`text-lg font-bold ${getConfidenceClass(theme.confidence)}`}>
              {theme.confidence ? theme.confidence.toFixed(2) : '0.85'}
              <EvidencePaperclip 
                context={{
                  type: 'theme',
                  field: 'Confidence Score',
                  value: theme.confidence,
                  themeId: theme.id || theme.theme
                }}
                className="ml-1"
              />
            </div>
            <div className="text-xs text-gray-500">confidence</div>
          </div>
        </div>
        
        {/* Intelligence Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {renderIntelligenceBadges()}
          <EvidencePaperclip 
            context={{
              type: 'theme',
              field: 'Intelligence Badges',
              value: theme.intelligenceBadges || 'Generated badges',
              themeId: theme.id || theme.theme
            }}
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-gray-700 text-sm flex items-start">
            <TruncatedText 
              text={theme.description || theme.rationale || 'Enhanced destination theme with comprehensive analysis and cultural insights.'}
              maxLength={120}
              sectionId="description"
            />
            <EvidencePaperclip 
              context={{
                type: 'theme',
                field: 'Description',
                value: theme.description || theme.rationale,
                themeId: theme.id || theme.theme
              }}
              className="mt-0.5 flex-shrink-0 ml-1"
            />
          </p>
        </div>
        
        {/* Sub-themes and Nano Themes */}
        <div className="space-y-3 mb-4">
          {/* Sub-themes */}
          {(theme.subThemes || theme.sub_themes) && (theme.subThemes || theme.sub_themes).length > 0 && (
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
              <h4 className="font-medium text-gray-900 text-sm mb-2 flex items-center">
                🎯 Sub-themes:
                <EvidencePaperclip 
                  context={{
                    type: 'theme',
                    field: 'Sub-themes',
                    value: theme.subThemes || theme.sub_themes,
                    themeId: theme.id || theme.theme
                  }}
                />
              </h4>
              <p className="text-xs text-gray-600">
                <TruncatedText 
                  text={(theme.subThemes || theme.sub_themes).join(', ')}
                  maxLength={100}
                  sectionId="subthemes"
                />
              </p>
            </div>
          )}

          {/* Nano Themes */}
          {(theme.nanoThemes || theme.nano_themes) && (theme.nanoThemes || theme.nano_themes).length > 0 && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <h4 className="font-medium text-gray-900 text-sm mb-2 flex items-center">
                🔬 Nano Themes:
                <EvidencePaperclip 
                  context={{
                    type: 'theme',
                    field: 'Nano Themes',
                    value: theme.nanoThemes || theme.nano_themes,
                    themeId: theme.id || theme.theme
                  }}
                />
              </h4>
              <p className="text-xs text-gray-600">
                <TruncatedText 
                  text={(theme.nanoThemes || theme.nano_themes).join(', ')}
                  maxLength={100}
                  sectionId="nanothemes"
                />
              </p>
            </div>
          )}
        </div>
          
        {/* Attributes Grid - Clean aligned layout like screenshot */}
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 text-sm mb-3">📊 Key Insights</h4>
          <div className="space-y-2">
            {/* Row 1 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0 flex-1">
                <span className="text-gray-600 text-sm mr-2">👥</span>
                <span className="font-medium text-sm text-gray-700 mr-2">Best For:</span>
                <span className="text-sm text-gray-900 truncate">{theme.bestFor || theme.contextual_info?.demographic_suitability?.join(', ') || 'Solo travelers'}</span>
                <EvidencePaperclip 
                  context={{
                    type: 'attribute',
                    field: 'Best For',
                    value: theme.bestFor || theme.contextual_info?.demographic_suitability,
                    themeId: theme.id || theme.theme
                  }}
                />
              </div>
              <div className="flex items-center min-w-0 flex-1 ml-4">
                <span className="text-gray-600 text-sm mr-2">⏰</span>
                <span className="font-medium text-sm text-gray-700 mr-2">Time:</span>
                <span className="text-sm text-gray-900 truncate">{theme.timeNeeded || theme.contextual_info?.time_commitment || 'Flexible'}</span>
                <EvidencePaperclip 
                  context={{
                    type: 'attribute',
                    field: 'Time Needed',
                    value: theme.timeNeeded || theme.contextual_info?.time_commitment,
                    themeId: theme.id || theme.theme
                  }}
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0 flex-1">
                <span className="text-gray-600 text-sm mr-2">⚡</span>
                <span className="font-medium text-sm text-gray-700 mr-2">Intensity:</span>
                <span className="text-sm text-gray-900 truncate">{theme.intensity || theme.experience_intensity?.overall_intensity || 'Moderate'}</span>
                <EvidencePaperclip 
                  context={{
                    type: 'attribute',
                    field: 'Intensity',
                    value: theme.intensity || theme.experience_intensity?.overall_intensity,
                    themeId: theme.id || theme.theme
                  }}
                />
              </div>
              <div className="flex items-center min-w-0 flex-1 ml-4">
                <span className="text-gray-600 text-sm mr-2">💰</span>
                <span className="font-medium text-sm text-gray-700 mr-2">Price:</span>
                <span className="text-sm text-gray-900 truncate">{theme.priceRange || theme.price_point || 'Mid'}</span>
                <EvidencePaperclip 
                  context={{
                    type: 'attribute',
                    field: 'Price Range',
                    value: theme.priceRange || theme.price_point,
                    themeId: theme.id || theme.theme
                  }}
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0 flex-1">
                <span className="text-gray-600 text-sm mr-2">✨</span>
                <span className="font-medium text-sm text-gray-700 mr-2">Emotions:</span>
                <span className="text-sm text-gray-900 truncate">{
                  theme.emotions && theme.emotions.length > 0 
                    ? theme.emotions.join(', ')
                    : theme.emotional_profile?.primary_emotions?.join(', ') || 'Contemplative'
                }</span>
                <EvidencePaperclip 
                  context={{
                    type: 'attribute',
                    field: 'Emotions',
                    value: theme.emotions || theme.emotional_profile?.primary_emotions,
                    themeId: theme.id || theme.theme
                  }}
                />
              </div>
              <div className="flex items-center min-w-0 flex-1 ml-4">
                <span className="text-gray-600 text-sm mr-2">🌟</span>
                <span className="font-medium text-sm text-gray-700 mr-2">Season:</span>
                <span className="text-sm text-gray-900 truncate">{theme.bestSeason || theme.seasonality?.peak?.join(', ') || 'Mar-Apr, Oct-Nov'}</span>
                <EvidencePaperclip 
                  context={{
                    type: 'attribute',
                    field: 'Best Season',
                    value: theme.bestSeason || theme.seasonality?.peak,
                    themeId: theme.id || theme.theme
                  }}
                />
              </div>
            </div>

            {/* Cultural Sensitivity - Full width if present */}
            {(theme.culturalSensitivity || theme.cultural_sensitivity) && (
              <div className="flex items-center pt-1 border-t border-gray-200">
                <span className="text-gray-600 text-sm mr-2">🏛️</span>
                <span className="font-medium text-sm text-gray-700 mr-2">Cultural:</span>
                <span className="text-sm text-gray-900 flex-1">{
                  theme.culturalSensitivity || 
                  (theme.cultural_sensitivity?.considerations ? theme.cultural_sensitivity.considerations.join(', ') : '')
                }</span>
                <EvidencePaperclip 
                  context={{
                    type: 'attribute',
                    field: 'Cultural Sensitivity',
                    value: theme.culturalSensitivity || theme.cultural_sensitivity,
                    themeId: theme.id || theme.theme
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Additional Metadata with Paperclips - Collapsible */}
        {theme.sourceQuality && (
          <div className="mt-4">
            <button
              onClick={() => toggleSection('sourceQuality')}
              className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 mb-2"
            >
              📊 Source Quality
              <span className="ml-1">{expandedSections.sourceQuality ? '−' : '+'}</span>
              <EvidencePaperclip 
                context={{
                  type: 'metadata',
                  field: 'Source Quality',
                  value: theme.sourceQuality,
                  themeId: theme.id || theme.theme
                }}
                asSpan={true}
              />
            </button>
                         {expandedSections.sourceQuality && (
               <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                 <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span>Authority</span>
                    <div className="flex items-center">
                      <span className="font-medium">{Math.round(theme.sourceQuality.authority * 100)}%</span>
                      <EvidencePaperclip 
                        context={{
                          type: 'metadata',
                          field: 'Source Authority',
                          value: theme.sourceQuality.authority,
                          themeId: theme.id || theme.theme
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Relevance</span>
                    <div className="flex items-center">
                      <span className="font-medium">{Math.round(theme.sourceQuality.relevance * 100)}%</span>
                      <EvidencePaperclip 
                        context={{
                          type: 'metadata',
                          field: 'Source Relevance',
                          value: theme.sourceQuality.relevance,
                          themeId: theme.id || theme.theme
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Recency</span>
                    <div className="flex items-center">
                      <span className="font-medium">{Math.round(theme.sourceQuality.recency * 100)}%</span>
                      <EvidencePaperclip 
                        context={{
                          type: 'metadata',
                          field: 'Source Recency',
                          value: theme.sourceQuality.recency,
                          themeId: theme.id || theme.theme
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Emotional Profile with Paperclips - Collapsible */}
        {(theme.emotionalProfile || theme.emotional_profile) && (
          <div className="mt-4">
            <button
              onClick={() => toggleSection('emotionalProfile')}
              className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 mb-2"
            >
              💝 Emotional Profile
              <span className="ml-1">{expandedSections.emotionalProfile ? '−' : '+'}</span>
              <EvidencePaperclip 
                context={{
                  type: 'metadata',
                  field: 'Emotional Profile',
                  value: theme.emotionalProfile || theme.emotional_profile,
                  themeId: theme.id || theme.theme
                }}
                asSpan={true}
              />
            </button>
                         {expandedSections.emotionalProfile && (
               <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {Object.entries(theme.emotionalProfile || theme.emotional_profile || {}).map(([emotion, intensity]) => (
                    <div key={emotion} className="flex justify-between items-center">
                      <span className="text-gray-700 capitalize flex items-center">
                        {emotion}
                        <EvidencePaperclip 
                          context={{
                            type: 'metadata',
                            field: `Emotion: ${emotion}`,
                            value: intensity,
                            themeId: theme.id || theme.theme
                          }}
                        />
                      </span>
                      <div className="flex items-center">
                        <div className="w-12 h-2 bg-gray-200 rounded-full mr-1">
                          <div 
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${(typeof intensity === 'number' ? intensity : 0.5) * 100}%` }}
                          />
                        </div>
                        <span className="text-gray-600 text-xs">
                          {Math.round((typeof intensity === 'number' ? intensity : 0.5) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Evidence Modal */}
      {showEvidence && evidenceContext && (
        <EvidenceModal
          isOpen={showEvidence}
          onClose={() => setShowEvidence(false)}
          context={evidenceContext}
          theme={theme}
          selectedDestination={selectedDestination}
        />
      )}
    </>
  );
};

export default DestinationThemeCard; 