import React, { useState } from 'react';
import { 
  StarIcon, 
  ShieldCheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  SparklesIcon,
  ClockIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

const KnownForAttributeCard = ({ attribute, onEvidenceClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
              type: 'known_for_attribute',
              attribute: attribute,
              name: attribute.attribute_name,
              evidence: attribute.evidence_validation,
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

  // Helper function to get confidence level styling
  const getConfidenceStyle = (score) => {
    if (score >= 0.9) return { bg: 'bg-green-100', text: 'text-green-800', label: 'PREMIUM', icon: '🏆' };
    if (score >= 0.8) return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'HIGH', icon: '⭐' };
    if (score >= 0.7) return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'STANDARD', icon: '✓' };
    return { bg: 'bg-gray-100', text: 'text-gray-800', label: 'BASIC', icon: '○' };
  };

  // Helper function to get category icon based on attribute name/description
  const getCategoryIcon = (name, description) => {
    const text = (name + ' ' + description).toLowerCase();
    
    if (text.includes('food') || text.includes('cuisine') || text.includes('culinary')) return '🍽️';
    if (text.includes('art') || text.includes('music') || text.includes('culture')) return '🎨';
    if (text.includes('history') || text.includes('historical') || text.includes('ancient')) return '🏛️';
    if (text.includes('nature') || text.includes('landscape') || text.includes('natural')) return '🌿';
    if (text.includes('architecture') || text.includes('building') || text.includes('monument')) return '🏗️';
    if (text.includes('festival') || text.includes('celebration') || text.includes('event')) return '🎉';
    if (text.includes('craft') || text.includes('artisan') || text.includes('handmade')) return '🎭';
    if (text.includes('religion') || text.includes('spiritual') || text.includes('sacred')) return '⛪';
    if (text.includes('beach') || text.includes('coast') || text.includes('ocean')) return '🏖️';
    if (text.includes('mountain') || text.includes('peak') || text.includes('alpine')) return '⛰️';
    
    return '✨'; // Default icon
  };

  // Helper function to get authority score display
  const getAuthorityDisplay = (score) => {
    if (score >= 0.8) return { label: 'Authoritative', color: 'text-green-600' };
    if (score >= 0.6) return { label: 'Well-documented', color: 'text-blue-600' };
    if (score >= 0.4) return { label: 'Documented', color: 'text-yellow-600' };
    return { label: 'Limited sources', color: 'text-gray-600' };
  };

  const confidenceStyle = getConfidenceStyle(attribute.confidence_score);
  const categoryIcon = getCategoryIcon(attribute.attribute_name, attribute.attribute_description);
  const authorityDisplay = getAuthorityDisplay(attribute.authority_score || 0.7);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{categoryIcon}</div>
            <div>
              <ClickableInsight
                as="h3"
                context={{ field: 'Attribute Name', value: attribute.attribute_name }}
                className="text-lg font-semibold text-gray-900 mb-1"
              >
                {attribute.attribute_name}
              </ClickableInsight>
              <div className="flex items-center space-x-2">
                <ClickableInsight
                  context={{ field: 'Confidence Level', value: attribute.confidence_score }}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${confidenceStyle.bg} ${confidenceStyle.text}`}
                >
                  {confidenceStyle.icon} {confidenceStyle.label}
                </ClickableInsight>
                <ClickableInsight
                  context={{ field: 'Confidence Score', value: attribute.confidence_score }}
                  className="text-sm text-gray-500"
                >
                  {(attribute.confidence_score * 100).toFixed(0)}% confidence
                </ClickableInsight>
              </div>
            </div>
          </div>
          
          {/* Confidence Score and Evidence Trigger */}
          <div className="text-right flex flex-col items-end space-y-2">
            <ClickableInsight
              context={{ field: 'Quality Score', value: attribute.confidence_score }}
              className="text-2xl font-bold text-blue-600"
            >
              {(attribute.confidence_score * 100).toFixed(0)}%
            </ClickableInsight>
            <div className="text-xs text-gray-500">Quality Score</div>
            
            {/* Evidence Trigger Button */}
            <button
              onClick={() => onEvidenceClick && onEvidenceClick('known_for', attribute)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
              title="View Evidence"
            >
              <LinkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed mb-4">
          {attribute.attribute_description}
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-sm text-gray-600">
            <ShieldCheckIcon className="h-4 w-4 mr-2" />
            <span className="font-medium">Authority:</span>
            <span className={`ml-1 ${authorityDisplay.color}`}>
              {authorityDisplay.label}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <GlobeAltIcon className="h-4 w-4 mr-2" />
            <span className="font-medium">Sources:</span>
            <span className="ml-1">
              {attribute.evidence_sources?.length || 0} references
            </span>
          </div>
          
          {attribute.contributing_models && (
            <div className="flex items-center text-sm text-gray-600">
              <AcademicCapIcon className="h-4 w-4 mr-2" />
              <span className="font-medium">Models:</span>
              <span className="ml-1">
                {attribute.contributing_models.length} consensus
              </span>
            </div>
          )}
          
          {attribute.validation_metadata?.consensus_count && (
            <div className="flex items-center text-sm text-gray-600">
              <SparklesIcon className="h-4 w-4 mr-2" />
              <span className="font-medium">Consensus:</span>
              <span className="ml-1">
                {attribute.validation_metadata.consensus_count}x validated
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Expandable Content */}
      <div className="px-6 py-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span className="font-medium">
            {isExpanded ? 'Hide Cultural & Historical Context' : 'Show Cultural & Historical Context'}
          </span>
          {isExpanded ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            {/* Cultural/Historical Significance */}
            {attribute.cultural_historical_significance && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-medium text-amber-900 mb-2 flex items-center">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  Cultural & Historical Significance
                </h4>
                <p className="text-amber-800 text-sm leading-relaxed">
                  {attribute.cultural_historical_significance}
                </p>
              </div>
            )}

            {/* Authority & Evidence Details */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                <ShieldCheckIcon className="h-4 w-4 mr-2" />
                Evidence & Validation
              </h4>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Authority Score:</span>
                  <span className="font-medium text-blue-900">
                    {((attribute.authority_score || 0.7) * 100).toFixed(0)}%
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Uniqueness Score:</span>
                  <span className="font-medium text-blue-900">
                    {((attribute.uniqueness_score || 0.8) * 100).toFixed(0)}%
                  </span>
                </div>
                
                {attribute.evidence_sources && attribute.evidence_sources.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm text-blue-700 mb-2">Top Evidence Sources:</div>
                    <div className="space-y-1">
                      {attribute.evidence_sources.slice(0, 3).map((source, index) => (
                        <div key={index} className="text-xs text-blue-600 truncate">
                          • {source}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contributing Models */}
            {attribute.contributing_models && attribute.contributing_models.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2 flex items-center">
                  <AcademicCapIcon className="h-4 w-4 mr-2" />
                  Multi-LLM Consensus
                </h4>
                <div className="flex flex-wrap gap-2">
                  {attribute.contributing_models.map((model, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Evidence Button */}
            <button
              onClick={() => onEvidenceClick && onEvidenceClick('known_for', attribute)}
              className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <GlobeAltIcon className="h-4 w-4 mr-2" />
              View Detailed Evidence & Sources
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnownForAttributeCard;
