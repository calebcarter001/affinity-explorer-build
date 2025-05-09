import React from 'react';
import PropTypes from 'prop-types';
import { FiCheck, FiAlertCircle } from 'react-icons/fi';
import { affinityShape } from '../../types/affinityTypes';

const getScoreClass = (score) => {
  if (score >= 0.8) return 'text-green-600';
  if (score >= 0.6) return 'text-yellow-600';
  return 'text-red-600';
};

const formatScore = (score) => {
  return score?.toFixed(2) || 'N/A';
};

const ScoreDisplay = ({ label, score }) => {
  const formattedScore = score === undefined || score === null ? 'N/A' : score.toFixed(2);
  
  return (
    <div className="text-center">
      <div className="text-sm text-gray-600">{label}</div>
      <div>{formattedScore}</div>
    </div>
  );
};

const AffinityDetailView = ({
  affinity,
  taggedPropertiesCount,
  propertiesWithScoreCount,
  showImplementation = true,
  showUsageGuidelines = true,
  className = ''
}) => {
  return (
    <div className={`bg-white p-4 md:p-6 rounded-lg shadow ${className}`}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-2">
        <div>
          <h3 className="text-xl font-bold">{affinity.name}</h3>
          <p className="text-gray-600">{affinity.definition}</p>
        </div>
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
          affinity.status === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {affinity.status === 'Active' ? <FiCheck className="w-3 h-3" /> : <FiAlertCircle className="w-3 h-3" />}
          {affinity.status}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-6 mt-4">
        {/* Metadata (top-left) */}
        <div>
          <h4 className="font-semibold mb-2">Metadata</h4>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <div className="font-medium">Category:</div>
                <div>{affinity.category}</div>
              </div>
              <div className="flex justify-between">
                <div className="font-medium">Type:</div>
                <div>{affinity.type}</div>
              </div>
              <div className="flex justify-between">
                <div className="font-medium">Applicable Entities:</div>
                <div>{affinity.applicableEntities?.join(', ') || 'N/A'}</div>
              </div>
              {affinity.scoreAvailable && (
                <div className="flex justify-between">
                  <div className="font-medium">Average Score:</div>
                  <div>
                    <ScoreDisplay score={affinity.averageScore} />
                  </div>
                </div>
              )}
              <div className="flex justify-between">
                <div className="font-medium">Created:</div>
                <div>{new Date(affinity.dateCreated).toLocaleDateString()}</div>
              </div>
              <div className="flex justify-between">
                <div className="font-medium">Last Updated:</div>
                <div>{new Date(affinity.lastUpdatedDate).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Guidelines (top-right) */}
        <div>
          {showUsageGuidelines && (
            <>
              <h4 className="font-semibold mb-2">Usage Guidelines</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm">
                  This affinity can be used to score {affinity.applicableEntities?.join(', ') || 'properties'}.
                  {affinity.scoreAvailable 
                    ? ' Scores are available and can be used for ranking and filtering.' 
                    : ' Scores are not yet available for this affinity.'}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Coverage (bottom-left) */}
        <div>
          <h4 className="font-semibold mb-2">Coverage</h4>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <div className="font-medium">Coverage:</div>
                <div>{typeof affinity.coverage === 'number' ? affinity.coverage.toFixed(1) : '0.0'}%</div>
              </div>
              {taggedPropertiesCount !== undefined && (
                <div className="flex justify-between">
                  <div className="font-medium">Tagged Properties:</div>
                  <div>{typeof taggedPropertiesCount === 'number' ? taggedPropertiesCount : 0}</div>
                </div>
              )}
              {propertiesWithScoreCount !== undefined && (
                <div className="flex justify-between">
                  <div className="font-medium">Properties with Score:</div>
                  <div>{typeof propertiesWithScoreCount === 'number' ? propertiesWithScoreCount : 0}</div>
                </div>
              )}
              {affinity.highestScore !== undefined && (
                <div className="flex justify-between">
                  <div className="font-medium">Highest Score:</div>
                  <div>
                    <ScoreDisplay score={affinity.highestScore} />
                  </div>
                </div>
              )}
              {affinity.lowestScore !== undefined && (
                <div className="flex justify-between">
                  <div className="font-medium">Lowest Score:</div>
                  <div>
                    <ScoreDisplay score={affinity.lowestScore} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Implementation (bottom-right) */}
        <div>
          {showImplementation && (
            <>
              <h4 className="font-semibold mb-2">Implementation</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm">
                  To implement this affinity in your application, use the API endpoint:
                </p>
                <code className="block bg-gray-100 p-2 rounded mt-2 text-sm font-mono overflow-x-auto">
                  /api/affinities/{affinity.id}/score
                </code>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

AffinityDetailView.propTypes = {
  affinity: affinityShape.isRequired,
  taggedPropertiesCount: PropTypes.number,
  propertiesWithScoreCount: PropTypes.number,
  showImplementation: PropTypes.bool,
  showUsageGuidelines: PropTypes.bool,
  className: PropTypes.string
};

export default AffinityDetailView; 