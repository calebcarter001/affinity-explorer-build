import React, { useState } from 'react';
import { 
  CameraIcon,
  ClockIcon, 
  StarIcon,
  SunIcon,
  DevicePhoneMobileIcon,
  MapPinIcon,
  LightBulbIcon,
  UserGroupIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PhotoIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

const PhotogenicHotspotCard = ({ hotspot, onEvidenceClick }) => {
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
              type: 'photogenic_hotspot',
              hotspot: hotspot,
              location: hotspot.location_name?.primary_name || hotspot.location_name,
              evidence: hotspot.evidence_validation,
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

  // Helper function to get photogenic score styling
  const getPhotogenicScoreStyle = (score) => {
    if (score >= 0.9) return { bg: 'bg-pink-100', text: 'text-pink-800', label: 'STUNNING' };
    if (score >= 0.8) return { bg: 'bg-purple-100', text: 'text-purple-800', label: 'EXCELLENT' };
    if (score >= 0.7) return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'VERY GOOD' };
    if (score >= 0.6) return { bg: 'bg-green-100', text: 'text-green-800', label: 'GOOD' };
    return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'MODERATE' };
  };

  // Helper function to get confidence score styling
  const getConfidenceStyle = (score) => {
    if (score >= 0.9) return { bg: 'bg-green-100', text: 'text-green-800', label: 'HIGH' };
    if (score >= 0.7) return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'STANDARD' };
    return { bg: 'bg-red-100', text: 'text-red-800', label: 'LOW' };
  };

  // Helper function to get evidence score styling
  const getEvidenceStyle = (score) => {
    if (score >= 0.8) return { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'VERIFIED' };
    if (score >= 0.6) return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'SUPPORTED' };
    return { bg: 'bg-gray-100', text: 'text-gray-800', label: 'BASIC' };
  };

  // Helper function to render star rating
  const renderStarRating = (score) => {
    const stars = Math.round(score * 5);
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-4 w-4 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({score.toFixed(1)})</span>
      </div>
    );
  };

  const photogenicStyle = getPhotogenicScoreStyle(hotspot.photogenic_score);
  const confidenceStyle = getConfidenceStyle(hotspot.confidence_score);
  const evidenceStyle = getEvidenceStyle(hotspot.evidence_score);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <ClickableInsight
                  as="h3"
                  context={{ field: 'Hotspot Name', value: hotspot.location_name?.primary_name || hotspot.location_name }}
                  className="text-lg font-semibold text-gray-900 mb-1"
                >
                  #{hotspot.rank} {hotspot.location_name?.primary_name || hotspot.location_name}
                </ClickableInsight>
              </div>
              
              {/* Evidence Trigger Button */}
              <button
                onClick={() => onEvidenceClick && onEvidenceClick({
                  type: 'photogenic_hotspot',
                  hotspot: hotspot,
                  location: hotspot.location_name?.primary_name || hotspot.location_name,
                  evidence: hotspot.evidence_validation
                })}
                className="text-blue-600 hover:text-blue-800 transition-colors"
                title="View Evidence"
              >
                <LinkIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Scores Row */}
            <div className="flex items-center space-x-4 mb-3">
              <ClickableInsight
                context={{ field: 'Photogenic Score', value: hotspot.photogenic_score }}
                className={`px-3 py-1 rounded-full text-xs font-medium ${photogenicStyle.bg} ${photogenicStyle.text}`}
              >
                📸 {photogenicStyle.label}
              </ClickableInsight>
              <ClickableInsight
                context={{ field: 'Confidence Score', value: hotspot.confidence_score }}
                className={`px-3 py-1 rounded-full text-xs font-medium ${confidenceStyle.bg} ${confidenceStyle.text}`}
              >
                🎯 {confidenceStyle.label}
              </ClickableInsight>
              <ClickableInsight
                context={{ field: 'Evidence Score', value: hotspot.evidence_score }}
                className={`px-3 py-1 rounded-full text-xs font-medium ${evidenceStyle.bg} ${evidenceStyle.text}`}
              >
                ✓ {evidenceStyle.label}
              </ClickableInsight>
            </div>

            {/* Star Rating */}
            <div className="mb-3">
              {renderStarRating(hotspot.photogenic_score)}
            </div>

            {/* Photo Worthiness */}
            <p className="text-gray-700 text-sm leading-relaxed">
              {hotspot.photo_worthiness?.why_instagram_worthy || 'A stunning photogenic location perfect for capturing memorable shots.'}
            </p>
          </div>

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isExpanded ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Quick Info Bar */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-gray-600">
              <SunIcon className="h-4 w-4" />
              <span>{hotspot.timing_conditions?.optimal_time_of_day || 'Golden hour recommended'}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <MapPinIcon className="h-4 w-4" />
              <span>{hotspot.travel_logistics?.how_easy_to_reach ? 'Easy access' : 'Check accessibility'}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <CameraIcon className="h-4 w-4" />
            <span>Smartphone friendly</span>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Photo Opportunities */}
          <div>
            <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
              <PhotoIcon className="h-5 w-5 mr-2 text-pink-600" />
              Photo Opportunities
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-pink-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Best Shots</h5>
                <p className="text-sm text-gray-700">
                  {hotspot.photo_worthiness?.best_photo_opportunities || 'Perfect for selfies, group photos, and scenic backgrounds'}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Signature Views</h5>
                <p className="text-sm text-gray-700">
                  {hotspot.photo_worthiness?.signature_views || 'Iconic angles and classic compositions everyone captures here'}
                </p>
              </div>
            </div>
          </div>

          {/* Timing & Conditions */}
          <div>
            <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
              <ClockIcon className="h-5 w-5 mr-2 text-blue-600" />
              Best Times to Visit
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Time of Year</h5>
                <p className="text-sm text-gray-700">
                  {hotspot.timing_conditions?.best_time_of_year || 'Year-round with seasonal variations'}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Time of Day</h5>
                <p className="text-sm text-gray-700">
                  {hotspot.timing_conditions?.optimal_time_of_day || 'Golden hour for best lighting'}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Weather</h5>
                <p className="text-sm text-gray-700">
                  {hotspot.timing_conditions?.weather_considerations || 'Clear skies preferred for optimal shots'}
                </p>
              </div>
            </div>
          </div>

          {/* Equipment & Tips */}
          <div>
            <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
              <DevicePhoneMobileIcon className="h-5 w-5 mr-2 text-green-600" />
              Photography Tips
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Smartphone Tips</h5>
                <p className="text-sm text-gray-700">
                  {hotspot.equipment_recommendations?.smartphone_tips || 'Use portrait mode, clean your lens, and try different angles'}
                </p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Shooting Tips</h5>
                <p className="text-sm text-gray-700">
                  {hotspot.photo_tips?.easy_shooting_tips || 'Focus on composition, use natural lighting, and be patient'}
                </p>
              </div>
            </div>
          </div>

          {/* Travel Logistics */}
          <div>
            <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
              <MapPinIcon className="h-5 w-5 mr-2 text-orange-600" />
              Getting There & Logistics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Access & Time Needed</h5>
                <p className="text-sm text-gray-700">
                  {hotspot.travel_logistics?.time_needed || 'Plan 1-2 hours for photography and exploration'}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Practical Info</h5>
                <p className="text-sm text-gray-700">
                  {hotspot.practical_info?.nearby_conveniences || 'Check for nearby facilities and amenities'}
                </p>
              </div>
            </div>
          </div>

          {/* Local Context */}
          <div>
            <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
              <UserGroupIcon className="h-5 w-5 mr-2 text-purple-600" />
              Local Context & Etiquette
            </h4>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                {hotspot.local_context?.why_visit || 'Respect local customs and be mindful of other visitors when taking photos'}
              </p>
            </div>
          </div>

          {/* Evidence & Sources */}
          {hotspot.evidence_items && hotspot.evidence_items.length > 0 && (
            <div>
              <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                <LightBulbIcon className="h-5 w-5 mr-2 text-yellow-600" />
                Evidence & Sources
              </h4>
              <div className="space-y-2">
                {hotspot.evidence_items.slice(0, 3).map((evidence, index) => (
                  <div key={index} className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{evidence.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{evidence.snippet}</p>
                    {evidence.url && (
                      <button
                        onClick={() => onEvidenceClick && onEvidenceClick(evidence)}
                        className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                      >
                        View Source →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Photogenic Score: {hotspot.photogenic_score?.toFixed(2)}</span>
              <span>Confidence: {hotspot.confidence_score?.toFixed(2)}</span>
              <span>Evidence: {hotspot.evidence_score?.toFixed(2)}</span>
              {hotspot.source_model && <span>Source: {hotspot.source_model}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotogenicHotspotCard;
