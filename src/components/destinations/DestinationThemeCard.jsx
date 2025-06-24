import React, { useState } from 'react';
import CopyInsightButton from '../common/CopyInsightButton';

const DestinationThemeCard = ({ theme, selectedDestination, onEvidenceClick }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [showSubThemes, setShowSubThemes] = useState(false);
  const [showNanoThemes, setShowNanoThemes] = useState(false);
  const [showIntelligenceDetails, setShowIntelligenceDetails] = useState(false);

  const handleEvidenceClick = (context, event) => {
    event.stopPropagation();
    event.preventDefault();
    
    // Only use the passed onEvidenceClick handler, don't open our own modal
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

  // Clickable insight component
  const ClickableInsight = ({ children, context, className = "", as = "span", onClick, preventEvidence = false }) => {
    const Component = as;
    return (
      <Component
        className={`cursor-pointer hover:text-blue-600 hover:underline transition-colors ${className}`}
        onClick={(e) => {
          if (onClick) {
            onClick(e);
          } else if (!preventEvidence) {
            handleEvidenceClick(context, e);
          }
        }}
        title={onClick ? undefined : `Click to view evidence for ${context.field}`}
      >
        {children}
      </Component>
    );
  };

  // Text truncation component with proper event handling
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
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleSection(sectionId);
          }}
          className="ml-2 text-blue-600 hover:text-blue-800 text-xs underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
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
      
      if (emotions && emotions.length > 0) {
        const emotion = emotions[0].toLowerCase();
        badges.push(<span key="emotion" className="badge-contemplative text-white px-2 py-1 rounded-full text-xs">✨ {emotion}</span>);
      } else {
        badges.push(<span key="default-emotion" className="badge-contemplative text-white px-2 py-1 rounded-full text-xs">✨ inspiring</span>);
      }
    }
    
    return badges;
  };

  // Determine data format and extract values
  const isExportFormat = theme.dataType === 'export' || theme.sub_themes || theme.nano_themes || theme.comprehensive_attribute_evidence;
  const themeName = theme.name || theme.theme;
  const themeDescription = theme.description || theme.rationale;
  const confidence = theme.confidence || 0.5;
  const subThemes = theme.sub_themes || theme.subThemes || [];
  const nanoThemes = theme.nano_themes || theme.nanoThemes || [];
  const intelligenceBadges = theme.intelligenceBadges || [];

  // Extract enhanced attributes from export data
  const bestFor = theme.bestFor || (theme.contextual_info?.demographic_suitability?.join(', ')) || 'All travelers';
  const timeNeeded = theme.timeNeeded || theme.contextual_info?.time_commitment || 'Flexible';
  const intensity = theme.intensity || theme.experience_intensity?.overall_intensity || 'Moderate';
  const priceRange = theme.priceRange || theme.price_insights?.price_category || theme.price_point || 'Mid';
  // Handle emotions data - could be array, object, or string
  const getEmotionsArray = () => {
    const emotionsData = theme.emotions || theme.emotional_profile?.primary_emotions;
    
    if (!emotionsData) return ['contemplative'];
    
    if (Array.isArray(emotionsData)) {
      return emotionsData;
    }
    
    if (typeof emotionsData === 'object') {
      // If it's an object, extract the keys or values
      return Object.keys(emotionsData);
    }
    
    if (typeof emotionsData === 'string') {
      return [emotionsData];
    }
    
    return ['contemplative'];
  };
  
  const emotions = getEmotionsArray();
  const bestSeason = theme.bestSeason || (theme.seasonality?.peak?.join(', ')) || 'Year-round';

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-500 transition-all duration-200">
        {/* Theme Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <ClickableInsight
                as="h3"
                className="text-lg font-semibold text-gray-900"
                context={{
                  type: 'theme',
                  field: 'Theme Name',
                  value: themeName,
                  themeId: themeName,
                  theme: theme
                }}
              >
                {themeName}
              </ClickableInsight>
              <CopyInsightButton
                insight={{ 
                  label: 'Complete Theme', 
                  value: themeName,
                  theme: theme
                }}
                context={{ field: 'Complete Theme', type: 'complete', source: 'Destination Themes' }}
                format="detailed"
                size="sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <ClickableInsight
                as="p"
                className="text-sm text-gray-600"
                context={{
                  type: 'theme',
                  field: 'Category',
                  value: theme.category,
                  themeId: theme.id || theme.theme
                }}
              >
                {theme.category || 'experience'}
              </ClickableInsight>
            </div>
          </div>
          <div className="text-right ml-4">
            <div className="flex items-center justify-end gap-2">
              <ClickableInsight
                className={`text-lg font-bold ${getConfidenceClass(confidence)}`}
                context={{
                  type: 'theme',
                  field: 'Confidence Score',
                  value: confidence,
                  themeId: themeName,
                  theme: theme
                }}
              >
                {Math.round(confidence * 100)}%
              </ClickableInsight>

            </div>
            <div className="text-xs text-gray-500">confidence</div>
          </div>
        </div>
        
        {/* Intelligence Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <ClickableInsight
            className="flex flex-wrap gap-2"
            context={{
              type: 'theme',
              field: 'Intelligence Badges',
              value: theme.intelligenceBadges || 'Generated badges',
              themeId: theme.id || theme.theme
            }}
          >
            {renderIntelligenceBadges()}
          </ClickableInsight>
        </div>

        {/* Description */}
        <div className="mb-4">
          <ClickableInsight
            as="p"
            className="text-gray-700 text-sm"
            context={{
              type: 'theme',
              field: 'Description',
              value: themeDescription,
              themeId: themeName,
              theme: theme
            }}
          >
            <TruncatedText 
              text={themeDescription || 'Enhanced destination theme with comprehensive analysis and cultural insights.'}
              maxLength={120}
              sectionId="description"
            />
          </ClickableInsight>
        </div>
        
        {/* Sub-themes and Nano Themes */}
        <div className="space-y-3 mb-4">
          {/* Sub-themes */}
          {(theme.subThemes || theme.sub_themes) && (theme.subThemes || theme.sub_themes).length > 0 && (
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm">
                  🎯 Sub-themes:
                </h4>
                <CopyInsightButton
                  insight={{ 
                    label: 'Sub-themes', 
                    value: (theme.subThemes || theme.sub_themes).join(', '),
                    type: 'list'
                  }}
                  context={{ field: 'Sub-themes', type: 'content', source: `${themeName} Theme` }}
                  format="detailed"
                  size="sm"
                  variant="default"
                  showLabel={true}
                />
              </div>
              <ClickableInsight
                as="p"
                className="text-xs text-gray-600"
                  context={{
                    type: 'theme',
                    field: 'Sub-themes',
                    value: theme.subThemes || theme.sub_themes,
                    themeId: theme.id || theme.theme
                  }}
              >
                <TruncatedText 
                  text={(theme.subThemes || theme.sub_themes).join(', ')}
                  maxLength={100}
                  sectionId="subthemes"
                />
              </ClickableInsight>
            </div>
          )}

          {/* Nano Themes */}
          {(theme.nanoThemes || theme.nano_themes) && (theme.nanoThemes || theme.nano_themes).length > 0 && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 text-sm">
                  🔬 Nano Themes:
                </h4>
                <CopyInsightButton
                  insight={{ 
                    label: 'Nano Themes', 
                    value: (theme.nanoThemes || theme.nano_themes).join(', '),
                    type: 'list'
                  }}
                  context={{ field: 'Nano Themes', type: 'content', source: `${themeName} Theme` }}
                  format="detailed"
                  size="sm"
                  variant="default"
                  showLabel={true}
                />
              </div>
              <ClickableInsight
                as="p"
                className="text-xs text-gray-600"
                  context={{
                    type: 'theme',
                    field: 'Nano Themes',
                    value: theme.nanoThemes || theme.nano_themes,
                    themeId: theme.id || theme.theme
                  }}
              >
                <TruncatedText 
                  text={(theme.nanoThemes || theme.nano_themes).join(', ')}
                  maxLength={100}
                  sectionId="nanothemes"
                />
              </ClickableInsight>
            </div>
          )}
        </div>
          
        {/* Attributes Grid - Clean aligned layout with proper text wrapping */}
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 text-sm mb-3">📊 Key Insights</h4>
          <div className="space-y-3">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start">
                <span className="text-gray-600 text-sm mr-2 mt-0.5">👥</span>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm text-gray-700 block">Best For:</span>
                  <ClickableInsight
                    className="text-sm text-gray-900 block break-words"
                  context={{
                    type: 'attribute',
                    field: 'Best For',
                      value: bestFor,
                      themeId: themeName,
                      theme: theme
                  }}
                  >
                    {bestFor}
                  </ClickableInsight>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-gray-600 text-sm mr-2 mt-0.5">⏰</span>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm text-gray-700 block">Time:</span>
                  <ClickableInsight
                    className="text-sm text-gray-900 block break-words"
                  context={{
                    type: 'attribute',
                    field: 'Time Needed',
                      value: timeNeeded,
                      themeId: themeName,
                      theme: theme
                  }}
                  >
                    {timeNeeded}
                  </ClickableInsight>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start">
                <span className="text-gray-600 text-sm mr-2 mt-0.5">⚡</span>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm text-gray-700 block">Intensity:</span>
                  <ClickableInsight
                    className="text-sm text-gray-900 block break-words"
                  context={{
                    type: 'attribute',
                    field: 'Intensity',
                      value: intensity,
                      themeId: themeName,
                      theme: theme
                  }}
                  >
                    {intensity}
                  </ClickableInsight>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-gray-600 text-sm mr-2 mt-0.5">💰</span>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm text-gray-700 block">Price:</span>
                  <ClickableInsight
                    className="text-sm text-gray-900 block break-words"
                  context={{
                    type: 'attribute',
                    field: 'Price Range',
                      value: priceRange,
                      themeId: themeName,
                      theme: theme
                  }}
                  >
                    {priceRange}
                  </ClickableInsight>
                </div>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start">
                <span className="text-gray-600 text-sm mr-2 mt-0.5">✨</span>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm text-gray-700 block">Emotions:</span>
                  <ClickableInsight
                    className="text-sm text-gray-900 block break-words"
                  context={{
                    type: 'attribute',
                    field: 'Emotions',
                      value: emotions,
                      themeId: themeName,
                      theme: theme
                  }}
                  >
                    {emotions.join(', ')}
                  </ClickableInsight>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-gray-600 text-sm mr-2 mt-0.5">🌟</span>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm text-gray-700 block">Season:</span>
                  <ClickableInsight
                    className="text-sm text-gray-900 block break-words"
                  context={{
                    type: 'attribute',
                    field: 'Best Season',
                      value: bestSeason,
                      themeId: themeName,
                      theme: theme
                  }}
                  >
                    {bestSeason}
                  </ClickableInsight>
                </div>
              </div>
            </div>

            {/* Cultural Sensitivity - Full width if present */}
            {(theme.culturalSensitivity || theme.cultural_sensitivity) && (
              <div className="flex items-start pt-3 border-t border-gray-200">
                <span className="text-gray-600 text-sm mr-2 mt-0.5">🏛️</span>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm text-gray-700 block">Cultural:</span>
                  <ClickableInsight
                    className="text-sm text-gray-900 block break-words"
                  context={{
                    type: 'attribute',
                    field: 'Cultural Sensitivity',
                    value: theme.culturalSensitivity || theme.cultural_sensitivity,
                    themeId: theme.id || theme.theme
                  }}
                  >
                    {theme.culturalSensitivity || 
                      (theme.cultural_sensitivity?.considerations ? theme.cultural_sensitivity.considerations.join(', ') : '')}
                  </ClickableInsight>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Metadata - Collapsible */}
        {theme.sourceQuality && (
          <div className="mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toggleSection('sourceQuality');
              }}
              className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 mb-2"
            >
              📊 Source Quality
              <span className="ml-1">{expandedSections.sourceQuality ? '−' : '+'}</span>
            </button>
                         {expandedSections.sourceQuality && (
               <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                 <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span>Authority</span>
                    <ClickableInsight
                      className="font-medium"
                        context={{
                          type: 'metadata',
                          field: 'Source Authority',
                          value: theme.sourceQuality.authority,
                          themeId: theme.id || theme.theme
                        }}
                    >
                      {Math.round(theme.sourceQuality.authority * 100)}%
                    </ClickableInsight>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Relevance</span>
                    <ClickableInsight
                      className="font-medium"
                        context={{
                          type: 'metadata',
                          field: 'Source Relevance',
                          value: theme.sourceQuality.relevance,
                          themeId: theme.id || theme.theme
                        }}
                    >
                      {Math.round(theme.sourceQuality.relevance * 100)}%
                    </ClickableInsight>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Recency</span>
                    <ClickableInsight
                      className="font-medium"
                        context={{
                          type: 'metadata',
                          field: 'Source Recency',
                          value: theme.sourceQuality.recency,
                          themeId: theme.id || theme.theme
                        }}
                    >
                      {Math.round(theme.sourceQuality.recency * 100)}%
                    </ClickableInsight>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Emotional Profile - Collapsible */}
        {(theme.emotionalProfile || theme.emotional_profile) && (
          <div className="mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toggleSection('emotionalProfile');
              }}
              className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
            >
              💝 Emotional Profile
              <span className="ml-1">{expandedSections.emotionalProfile ? '−' : '+'}</span>
            </button>
                         {expandedSections.emotionalProfile && (
               <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {Object.entries(theme.emotionalProfile || theme.emotional_profile || {}).map(([emotion, intensity]) => (
                    <div key={emotion} className="flex justify-between items-center">
                      <ClickableInsight
                        className="text-gray-700 capitalize"
                          context={{
                            type: 'metadata',
                            field: `Emotion: ${emotion}`,
                            value: intensity,
                            themeId: theme.id || theme.theme
                          }}
                      >
                        {emotion}
                      </ClickableInsight>
                      <span className="font-medium text-purple-600">
                        {typeof intensity === 'object' ? JSON.stringify(intensity) : intensity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default DestinationThemeCard; 