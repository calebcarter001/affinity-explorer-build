import PropTypes from 'prop-types';

// PropTypes for performance data
export const performanceDataShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  affinityId: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  clicks: PropTypes.number.isRequired,
  impressions: PropTypes.number.isRequired,
  transactions: PropTypes.number.isRequired,
  gpNet: PropTypes.number.isRequired,
  dateCreated: PropTypes.string.isRequired,
  lastUpdatedDate: PropTypes.string.isRequired
});

// Base affinity shape without performance data
export const affinityShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  definition: PropTypes.string,
  type: PropTypes.string,
  category: PropTypes.string,
  status: PropTypes.string,
  applicableEntities: PropTypes.arrayOf(PropTypes.string),
  scoreAvailable: PropTypes.bool,
  averageScore: PropTypes.number,
  highestScore: PropTypes.number,
  lowestScore: PropTypes.number,
  coverage: PropTypes.number,
  propertiesTagged: PropTypes.number,
  propertiesWithScore: PropTypes.number,
  dateCreated: PropTypes.string,
  lastUpdatedDate: PropTypes.string
});

// Affinity shape with embedded performance data
export const affinityWithPerformanceShape = PropTypes.shape({
  ...affinityShape.isRequired,
  performance: performanceDataShape
}); 