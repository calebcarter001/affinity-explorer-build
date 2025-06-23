import React from 'react';

const NuanceCard = ({ nuance, type, compact = false, onEvidenceClick }) => {
  // Clickable insight component
  const ClickableInsight = ({ children, context, className = "", as = "span" }) => {
    const Component = as;
    return (
      <Component
        className={`cursor-pointer hover:text-blue-600 hover:underline transition-colors ${className}`}
        onClick={(e) => {
          e.stopPropagation();
          if (onEvidenceClick) {
            onEvidenceClick(context);
          }
        }}
        title={`Click to view evidence for ${context.field}`}
      >
        {children}
      </Component>
    );
  };

  const getConfidenceClass = (confidence) => {
    if (confidence >= 0.85) return 'text-green-600';
    if (confidence >= 0.7) return 'text-blue-600';
    if (confidence >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const cardClass = compact 
    ? "bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md hover:border-blue-500 transition-all duration-200"
    : "bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-blue-500 transition-all duration-200";
    
  return (
    <div className={cardClass}>
      {/* Nuance Header */}
      <div className="flex items-start justify-between mb-2">
        <ClickableInsight
          as="h4"
          className={`font-medium text-gray-900 flex-1 ${compact ? 'text-sm' : 'text-base'}`}
          context={{
            type: 'nuance',
            field: 'Nuance Phrase',
            value: nuance.phrase,
            nuanceType: type,
            nuance: nuance
          }}
        >
          {nuance.phrase}
        </ClickableInsight>
        <div className="flex items-center gap-2 ml-2">
          <ClickableInsight
            className={`${compact ? 'text-sm' : 'text-base'} font-semibold text-blue-600`}
            context={{
              type: 'nuance',
              field: 'Nuance Score',
              value: nuance.score,
              nuance: nuance
            }}
          >
            {nuance.score?.toFixed(1) || '0.0'}
          </ClickableInsight>
        </div>
      </div>
      
      {/* Confidence & Evidence Indicators */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <span>Confidence:</span>
          <ClickableInsight
            className={`font-medium ${getConfidenceClass(nuance.confidence || 0.5)}`}
            context={{
              type: 'nuance',
              field: 'Confidence Level',
              value: nuance.confidence,
              nuance: nuance
            }}
          >
            {Math.round((nuance.confidence || 0.5) * 100)}%
          </ClickableInsight>
        </div>
        
        {nuance.source_urls && nuance.source_urls.length > 0 && (
          <div className="flex items-center gap-1">
            <ClickableInsight
              context={{
                type: 'nuance',
                field: 'Source URLs',
                value: nuance.source_urls,
                validationData: nuance.validation_data,
                nuance: nuance
              }}
            >
              {nuance.source_urls.length} source{nuance.source_urls.length !== 1 ? 's' : ''}
            </ClickableInsight>
          </div>
        )}
      </div>
      
      {/* Authority Validation (if available) */}
      {nuance.validation_data?.authority_validated && (
        <div className="mt-2 flex items-center gap-1 text-xs">
          <ClickableInsight
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
            context={{
              type: 'nuance',
              field: 'Authority Validation',
              value: nuance.validation_data,
              nuance: nuance
            }}
          >
            ✓ Authority Validated
          </ClickableInsight>
        </div>
      )}
      
      {/* Search Hits (if available) */}
      {nuance.search_hits > 0 && (
        <div className="mt-1 text-xs text-gray-500">
          {nuance.search_hits} search hit{nuance.search_hits !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default NuanceCard; 