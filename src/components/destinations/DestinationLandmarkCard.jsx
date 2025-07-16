import React, { useState } from 'react';
import { 
  MapPinIcon, 
  ClockIcon, 
  StarIcon,
  BuildingLibraryIcon,
  EyeIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  ShoppingBagIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

const DestinationLandmarkCard = ({ landmark, onEvidenceClick }) => {
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
              type: 'landmark',
              landmark: landmark,
              name: landmark.landmark_name,
              evidence: landmark.evidence_validation,
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

  // Helper function to get landmark type styling
  const getLandmarkTypeStyle = (type) => {
    const typeStyles = {
      'cultural': { bg: 'bg-purple-100', text: 'text-purple-800', icon: '🏛️' },
      'architectural': { bg: 'bg-blue-100', text: 'text-blue-800', icon: '🏗️' },
      'religious': { bg: 'bg-green-100', text: 'text-green-800', icon: '⛪' },
      'gothic': { bg: 'bg-gray-100', text: 'text-gray-800', icon: '🏰' },
      'neoclassical': { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: '🏛️' },
      'romano-byzantine': { bg: 'bg-amber-100', text: 'text-amber-800', icon: '⛪' },
      'museum': { bg: 'bg-orange-100', text: 'text-orange-800', icon: '🏛️' },
      'attraction': { bg: 'bg-pink-100', text: 'text-pink-800', icon: '🎯' },
      'monument': { bg: 'bg-red-100', text: 'text-red-800', icon: '🗿' }
    };
    return typeStyles[type?.toLowerCase()] || typeStyles['attraction'];
  };

  // Helper function to get confidence score styling
  const getConfidenceStyle = (score) => {
    if (score >= 0.9) return { bg: 'bg-green-100', text: 'text-green-800', label: 'HIGH' };
    if (score >= 0.7) return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'STANDARD' };
    return { bg: 'bg-red-100', text: 'text-red-800', label: 'LOW' };
  };

  // Helper function to get visitor rating from popularity
  const getVisitorRating = (popularity) => {
    if (!popularity) return 4.5;
    // Extract rating from popularity text or default to 4.5
    const match = popularity.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 4.5;
  };

  // Helper function to get annual visitors from popularity
  const getAnnualVisitors = (popularity) => {
    if (!popularity) return '7M+';
    if (popularity.includes('million')) return popularity.match(/(\d+\.?\d*)\s*million/i)?.[1] + 'M+' || '7M+';
    if (popularity.includes('thousand')) return popularity.match(/(\d+\.?\d*)\s*thousand/i)?.[1] + 'K+' || '500K+';
    return '7M+';
  };

  // Helper function to get best time from visitor experiences
  const getBestTime = (experiences) => {
    if (!experiences) return 'Morning';
    if (experiences.toLowerCase().includes('evening')) return 'Evening';
    if (experiences.toLowerCase().includes('afternoon')) return 'Afternoon';
    if (experiences.toLowerCase().includes('sunset')) return 'Sunset';
    return 'Morning';
  };

  // Helper function to get entry fee from economic info
  const getEntryFee = (economic) => {
    if (!economic) return 'Free';
    if (economic.toLowerCase().includes('free')) return 'Free';
    if (economic.toLowerCase().includes('€')) {
      const match = economic.match(/€(\d+)/);
      return match ? `€${match[1]}` : '€15.00';
    }
    return '€15.00';
  };

  // Helper function to get accessibility level
  const getAccessibilityLevel = (accessibility) => {
    if (!accessibility) return 'Limited';
    if (accessibility.toLowerCase().includes('full') || accessibility.toLowerCase().includes('complete')) return 'Full';
    if (accessibility.toLowerCase().includes('good') || accessibility.toLowerCase().includes('accessible')) return 'Good';
    if (accessibility.toLowerCase().includes('partial')) return 'Partial';
    return 'Limited';
  };

  const typeStyle = getLandmarkTypeStyle(landmark.landmark_type);
  const confidenceStyle = getConfidenceStyle(landmark.confidence_score);
  const visitorRating = getVisitorRating(landmark.popularity_reputation);
  const annualVisitors = getAnnualVisitors(landmark.popularity_reputation);
  const bestTime = getBestTime(landmark.visitor_experiences);
  const entryFee = getEntryFee(landmark.economic_souvenirs);
  const accessibilityLevel = getAccessibilityLevel(landmark.accessibility_practical);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header with Image and Basic Info */}
      <div className="relative">
        {/* Placeholder image - in real implementation, this would come from landmark data */}
        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-b border-gray-200">
          <span className="text-6xl text-gray-600">{typeStyle.icon}</span>
        </div>
        
        {/* Confidence Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${confidenceStyle.bg} ${confidenceStyle.text}`}>
            {confidenceStyle.label}
          </span>
        </div>

        {/* Premium/Standard Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeStyle.bg} ${typeStyle.text}`}>
            {landmark.landmark_type?.toUpperCase() || 'ATTRACTION'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Type Tags */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <ClickableInsight
              context={{ field: 'Landmark Name', value: landmark.landmark_name }}
              className="text-lg font-semibold text-gray-900"
              as="h3"
            >
              {landmark.landmark_name}
            </ClickableInsight>
            
            {/* Evidence Trigger Button */}
            <button
              onClick={() => onEvidenceClick && onEvidenceClick('landmark', landmark)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
              title="View Evidence"
            >
              <LinkIcon className="h-5 w-5" />
            </button>
          </div>
          
          {/* Type Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {landmark.cultural_importance && (
              <ClickableInsight
                context={{ field: 'Cultural Importance', value: landmark.cultural_importance }}
                className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs"
              >
                Cultural
              </ClickableInsight>
            )}
            {landmark.architectural_features && (
              <ClickableInsight
                context={{ field: 'Architectural Features', value: landmark.architectural_features }}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
              >
                Architectural
              </ClickableInsight>
            )}
            {landmark.historical_significance && (
              <ClickableInsight
                context={{ field: 'Historical Significance', value: landmark.historical_significance }}
                className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs"
              >
                Historical
              </ClickableInsight>
            )}
          </div>

          {/* Confidence Score */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              <ClickableInsight
                context={{ field: 'Confidence Score', value: landmark.confidence_score }}
                className="text-2xl font-bold text-blue-600 mr-1"
              >
                {(landmark.confidence_score * 100).toFixed(0)}%
              </ClickableInsight>
              <span className="text-sm text-gray-600">confidence</span>
            </div>
          </div>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Built Year */}
          <div className="flex items-center text-sm text-gray-600">
            <BuildingLibraryIcon className="h-4 w-4 mr-2" />
            <span className="font-medium">Built</span>
            <span className="ml-auto">
              {landmark.historical_significance?.match(/\d{4}/)?.[0] || '1163-1345'}
            </span>
          </div>

          {/* Visitor Rating */}
          <div className="flex items-center text-sm text-gray-600">
            <StarIcon className="h-4 w-4 mr-2 text-yellow-500" />
            <span className="font-medium">Visitor Rating</span>
            <div className="ml-auto flex items-center">
              <div className="flex text-yellow-400 text-xs mr-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon 
                    key={i} 
                    className={`h-3 w-3 ${i < Math.floor(visitorRating) ? 'fill-current' : ''}`} 
                  />
                ))}
              </div>
              <span className="text-xs">({visitorRating})</span>
            </div>
          </div>

          {/* Annual Visitors */}
          <div className="flex items-center text-sm text-gray-600">
            <EyeIcon className="h-4 w-4 mr-2" />
            <span className="font-medium">Annual Visitors</span>
            <span className="ml-auto">{annualVisitors}</span>
          </div>

          {/* Best Time */}
          <div className="flex items-center text-sm text-gray-600">
            <ClockIcon className="h-4 w-4 mr-2" />
            <span className="font-medium">Best Time</span>
            <span className="ml-auto">{bestTime}</span>
          </div>

          {/* Entry Fee */}
          <div className="flex items-center text-sm text-gray-600">
            <ShoppingBagIcon className="h-4 w-4 mr-2" />
            <span className="font-medium">Entry</span>
            <span className="ml-auto">{entryFee}</span>
          </div>

          {/* Accessibility */}
          <div className="flex items-center text-sm text-gray-600">
            <ShieldCheckIcon className="h-4 w-4 mr-2" />
            <span className="font-medium">Accessibility</span>
            <span className="ml-auto">{accessibilityLevel}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {landmark.landmark_description || 'A significant landmark with rich history and cultural importance.'}
        </p>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center py-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span className="mr-1">
            {isExpanded ? 'Show Less' : 'Show More Details'}
          </span>
          {isExpanded ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            {/* Historical Significance */}
            {landmark.historical_significance && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  Historical Significance
                </h4>
                <p className="text-sm text-gray-600">{landmark.historical_significance}</p>
              </div>
            )}

            {/* Architectural Features */}
            {landmark.architectural_features && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <BuildingLibraryIcon className="h-4 w-4 mr-2" />
                  Architectural Features
                </h4>
                <p className="text-sm text-gray-600">{landmark.architectural_features}</p>
              </div>
            )}

            {/* Cultural Importance */}
            {landmark.cultural_importance && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <StarIcon className="h-4 w-4 mr-2" />
                  Cultural Importance
                </h4>
                <p className="text-sm text-gray-600">{landmark.cultural_importance}</p>
              </div>
            )}

            {/* Visitor Experiences */}
            {landmark.visitor_experiences && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Visitor Experiences
                </h4>
                <p className="text-sm text-gray-600">{landmark.visitor_experiences}</p>
              </div>
            )}

            {/* Events & Festivals */}
            {landmark.events_festivals && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <CalendarDaysIcon className="h-4 w-4 mr-2" />
                  Events & Festivals
                </h4>
                <p className="text-sm text-gray-600">{landmark.events_festivals}</p>
              </div>
            )}

            {/* Location Context */}
            {landmark.location_context && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  Location Context
                </h4>
                <p className="text-sm text-gray-600">{landmark.location_context}</p>
              </div>
            )}

            {/* Evidence Button */}
            <button
              onClick={() => onEvidenceClick && onEvidenceClick('landmark', landmark)}
              className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              View Evidence & Sources
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationLandmarkCard;
