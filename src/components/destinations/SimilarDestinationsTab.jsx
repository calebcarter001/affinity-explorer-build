import React, { useState } from 'react';
import { MagnifyingGlassIcon, LinkIcon } from '@heroicons/react/24/outline';

const SimilarDestinationsTab = ({ similarDestinations, onEvidenceClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('similarity_score');
  const [filterBy, setFilterBy] = useState('all');

  if (!similarDestinations || !similarDestinations.similarDestinations) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">
          Similar destinations data not available for this location
        </div>
        <p className="text-gray-400 text-sm mt-2">
          This feature requires complete export data format
        </p>
      </div>
    );
  }

  const { similarDestinations: destinations, qualityScore, processingMetadata, statistics } = similarDestinations;

  // Filter and sort destinations
  const filteredDestinations = destinations
    .filter(dest => {
      const matchesSearch = dest.destination.toLowerCase().includes(searchTerm.toLowerCase());
      if (filterBy === 'all') return matchesSearch;
      if (filterBy === 'geographic') return matchesSearch && dest.geographicProximity >= 0.6;
      if (filterBy === 'cultural') return matchesSearch && dest.culturalSimilarity >= 0.6;
      if (filterBy === 'experience') return matchesSearch && dest.experienceSimilarity >= 0.6;
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'similarity_score') return b.similarityScore - a.similarityScore;
      if (sortBy === 'confidence') return b.confidence - a.confidence;
      if (sortBy === 'name') return a.destination.localeCompare(b.destination);
      return 0;
    });

  // Get confidence color based on score
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.85) return 'text-green-600 bg-green-100';
    if (confidence >= 0.70) return 'text-blue-600 bg-blue-100';
    if (confidence >= 0.50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // Get similarity score color
  const getSimilarityColor = (score) => {
    if (score >= 0.85) return 'bg-green-500';
    if (score >= 0.70) return 'bg-blue-500';
    if (score >= 0.50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Get rank styling
  const getRankStyling = (index) => {
    if (index === 0) return 'border-l-4 border-yellow-400 bg-yellow-50'; // Gold
    if (index === 1) return 'border-l-4 border-gray-400 bg-gray-50'; // Silver
    if (index === 2) return 'border-l-4 border-orange-400 bg-orange-50'; // Bronze
    return 'border-l-4 border-transparent';
  };

  const getRankBadge = (index) => {
    if (index === 0) return { text: '#1', color: 'bg-yellow-500 text-white' };
    if (index === 1) return { text: '#2', color: 'bg-gray-500 text-white' };
    if (index === 2) return { text: '#3', color: 'bg-orange-500 text-white' };
    return { text: `#${index + 1}`, color: 'bg-gray-300 text-gray-700' };
  };

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-2 border-l-2 border-cyan-400">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium text-gray-900">
            Destinations with similar travel experiences, cultural atmosphere, and visitor appeal based on multi-LLM analysis and evidence validation.
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
            <div className="flex items-center">
              <div className="text-sm font-bold text-cyan-600">{destinations.length}</div>
              <div className="ml-1">
                <div className="text-xs font-medium text-gray-900">Similar Destinations Found</div>
                <div className="text-xs text-gray-500">Available insights</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
            <div className="flex items-center">
              <div className="text-sm font-bold text-cyan-600">{(qualityScore * 100).toFixed(1)}%</div>
              <div className="ml-1">
                <div className="text-xs font-medium text-gray-900">Overall Quality Score</div>
                <div className="text-xs text-gray-500">Analysis confidence</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
            <div className="flex items-center">
              <div className="text-sm font-bold text-cyan-600">{processingMetadata?.processing_time ? `${Math.round(processingMetadata.processing_time)}s` : 'N/A'}</div>
              <div className="ml-1">
                <div className="text-xs font-medium text-gray-900">Processing Time</div>
                <div className="text-xs text-gray-500">Computation work</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
            <div className="flex items-center">
              <div className="text-sm font-bold text-cyan-600">{statistics?.models_used || 3}</div>
              <div className="ml-1">
                <div className="text-xs font-medium text-gray-900">Models Used</div>
                <div className="text-xs text-gray-500">LLM contributors</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="similarity_score">Sort by Similarity</option>
            <option value="confidence">Sort by Confidence</option>
            <option value="name">Sort by Name</option>
          </select>
          
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Similarities</option>
            <option value="geographic">Geographic Focus</option>
            <option value="cultural">Cultural Focus</option>
            <option value="experience">Experience Focus</option>
          </select>
        </div>
      </div>

      {/* Similar Destinations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDestinations.map((destination, index) => {
          const rankBadge = getRankBadge(index);
          const rankStyling = getRankStyling(index);
          
          return (
            <div
              key={destination.destination}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${rankStyling} hover:shadow-md transition-shadow`}
            >
              {/* Rank Badge and Destination Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${rankBadge.color}`}>
                    {rankBadge.text}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{destination.destination}</h3>
                </div>
                
                {destination.sourceUrls && destination.sourceUrls.length > 0 && (
                  <button
                    onClick={() => onEvidenceClick && onEvidenceClick({
                      type: 'similar_destination',
                      destination: destination.destination,
                      sourceUrls: destination.sourceUrls,
                      validationData: destination.validationData,
                      similarityReasons: destination.similarityReasons
                    })}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="View Evidence"
                  >
                    <LinkIcon className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Similarity and Confidence Scores */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Similarity:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getSimilarityColor(destination.similarityScore)}`}
                        style={{ width: `${destination.similarityScore * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-cyan-600">
                      {(destination.similarityScore * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Confidence:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(destination.confidence)}`}>
                    {(destination.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Similarity Breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">🌍 Geographic</span>
                  <span className="font-medium">{(destination.geographicProximity * 100).toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">🎭 Cultural</span>
                  <span className="font-medium">{(destination.culturalSimilarity * 100).toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">⭐ Experience</span>
                  <span className="font-medium">{(destination.experienceSimilarity * 100).toFixed(1)}%</span>
                </div>
              </div>

              {/* Why Similar Section */}
              {destination.similarityReasons && destination.similarityReasons.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Why Similar:</h4>
                  <ul className="space-y-1">
                    {destination.similarityReasons.slice(0, 3).map((reason, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start">
                        <span className="text-cyan-500 mr-1">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contributing Models */}
              {destination.contributingModels && destination.contributingModels.length > 0 && (
                <div className="flex items-center text-xs text-gray-500">
                  <span className="mr-1">🤖</span>
                  <span>{destination.contributingModels.length} LLM model{destination.contributingModels.length !== 1 ? 's' : ''} contributed</span>
                </div>
              )}

              {/* View Evidence Button */}
              {destination.sourceUrls && destination.sourceUrls.length > 0 && (
                <button
                  onClick={() => onEvidenceClick && onEvidenceClick({
                    type: 'similar_destination',
                    destination: destination.destination,
                    sourceUrls: destination.sourceUrls,
                    validationData: destination.validationData,
                    similarityReasons: destination.similarityReasons
                  })}
                  className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  View Evidence
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* No Results Message */}
      {filteredDestinations.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500">No destinations match your search criteria</div>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterBy('all');
            }}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SimilarDestinationsTab; 