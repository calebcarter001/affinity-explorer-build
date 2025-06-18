import React from 'react';
import PropTypes from 'prop-types';

const MatchingPropertiesGrid = ({ matchingProperties, selectedAffinities, getScoreClass }) => {
  if (!Array.isArray(matchingProperties) || !Array.isArray(selectedAffinities)) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500 mb-2">
        Showing {matchingProperties.length} matching properties
      </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {matchingProperties.map(property => {
        if (!property?.id || !Array.isArray(property.relevantScores)) {
          return null;
        }

        return (
          <div key={property.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h4 className="font-medium text-gray-900">{property.name}</h4>
            <p className="text-sm text-gray-500 mb-3">{property.location}</p>
              
              {/* Individual Affinity Scores */}
            <div className="space-y-2">
              {property.relevantScores.map(score => {
                const affinity = selectedAffinities.find(aff => aff.id === score.affinityId);
                if (!affinity) return null;

                return (
                  <div key={score.affinityId} className="flex justify-between items-center">
                    <span className="text-sm">{affinity.name}</span>
                    <span className={`text-sm font-medium ${getScoreClass(score.score)}`}>
                      {typeof score.score === 'number' ? score.score.toFixed(2) : 'N/A'}
                    </span>
                  </div>
                );
              })}
            </div>

              {/* Blended Score Section */}
            <div className="mt-3 pt-3 border-t">
              <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Blended Score:</span>
                  <span className={`text-sm font-bold ${getScoreClass(property.blendedScore)}`}>
                    {typeof property.blendedScore === 'number' ? property.blendedScore.toFixed(2) : 'N/A'}
                </span>
              </div>
                <p className="text-xs text-gray-500 mt-1">
                  Weighted score based on affinity combinations
                </p>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};

MatchingPropertiesGrid.propTypes = {
  matchingProperties: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      location: PropTypes.string,
      relevantScores: PropTypes.arrayOf(
        PropTypes.shape({
          affinityId: PropTypes.string.isRequired,
          score: PropTypes.number.isRequired
        })
      ).isRequired,
      blendedScore: PropTypes.number.isRequired
    })
  ).isRequired,
  selectedAffinities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  getScoreClass: PropTypes.func.isRequired
};

export default MatchingPropertiesGrid; 