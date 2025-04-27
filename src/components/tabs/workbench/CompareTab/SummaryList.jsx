import React from 'react';
import PropTypes from 'prop-types';

const SummaryList = ({ affinities, periodState }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4">Key Findings</h2>
    {affinities.length === 0 ? (
      <p className="text-gray-500">No affinities to summarize.</p>
    ) : (
      <ul className="list-disc pl-5 text-gray-700">
        {affinities.map(affinity => (
          <li key={affinity.id}>
            {affinity.name}: Average score of {affinity.averageScore?.toFixed(2) || 'N/A'} with{' '}
            {affinity.propertiesTagged?.toLocaleString() || 'N/A'} total properties
          </li>
        ))}
      </ul>
    )}
  </div>
);

SummaryList.propTypes = {
  affinities: PropTypes.array.isRequired,
  periodState: PropTypes.object.isRequired
};

export default SummaryList; 