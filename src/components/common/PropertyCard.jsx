import React from 'react';
import { FiMapPin, FiHome, FiHash, FiStar } from 'react-icons/fi';

const PropertyCard = ({
  property,
  isSelected,
  onClick,
  showMetrics = false,
  className = '',
  affinityDetails = null
}) => {
  const {
    id,
    name,
    location,
    address,
    propertyType,
    metrics,
    type, // CL or VR
    icon,
    secondary_icons,
    property_type,
    starRating,
    rating,
    price,
    price_usd_per_night
  } = property;

  // Use address if available, otherwise fall back to location
  const displayAddress = address || location || 'No address available';
  
  // Get the main icon (prefer new icon field, fallback to type-based)
  const mainIcon = icon || (property_type === 'Villa' ? '🏡' : '🏨');
  const secondaryIcons = secondary_icons || [];
  
  // Get property type display
  const displayPropertyType = property_type || propertyType || 'Property';
  
  // Get rating display
  const displayRating = rating || (property.review_family_score ? property.review_family_score.toFixed(1) : null);
  const displayStarRating = starRating || property.star_rating;
  
  // Get price display
  const displayPrice = price_usd_per_night || price;

  return (
    <div
      key={id}
      className={`card-prominent ${isSelected ? 'border-2 border-blue-500 ring-2 ring-blue-200' : ''} ${className}`}
      onClick={() => onClick(property)}
    >
      <div className="flex flex-col gap-4">
        {/* Header with Icon and Title */}
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3 flex-1">
            <div className="text-3xl flex-shrink-0" title={`${displayPropertyType} icon`}>
              {mainIcon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 leading-tight">{name}</h3>
              <div className="flex items-center gap-1 mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  type === 'VR' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {displayPropertyType}
                </span>
                {displayStarRating && (
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <FiStar className="w-3 h-3 fill-current" />
                    <span>{displayStarRating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Secondary Icons */}
          {secondaryIcons.length > 0 && (
            <div className="flex gap-1 ml-2">
              {secondaryIcons.slice(0, 3).map((secIcon, index) => (
                <span key={index} className="text-lg" title="Property feature">
                  {secIcon}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Location and Rating */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <FiMapPin className="mr-1 flex-shrink-0" />
            <span className="truncate">{displayAddress}</span>
          </div>
          
          {displayRating && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Rating:</span>
              <span className="font-medium text-amber-600">{displayRating}/5.0</span>
            </div>
          )}
        </div>

        {/* Price */}
        {displayPrice && (
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-green-600">
              ${displayPrice}
              <span className="text-sm text-gray-500 font-normal">/night</span>
            </span>
            <div className="flex items-center text-xs text-gray-500">
              <FiHash className="mr-1" />
              <span>ID: {id}</span>
            </div>
          </div>
        )}

        {/* Property Type and ID (fallback if no price) */}
        {!displayPrice && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <FiHome className="mr-1" />
              <span>{displayPropertyType}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <FiHash className="mr-1" />
              <span>ID: {id}</span>
            </div>
          </div>
        )}

        {showMetrics && metrics && (
          <div className="grid grid-cols-2 gap-4 mt-2">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{metric.label}</div>
                <div className="text-sm font-semibold">{metric.value}</div>
              </div>
            ))}
          </div>
        )}

        {affinityDetails && (
          <div className="border-t pt-4 mt-4">
            {affinityDetails}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard; 