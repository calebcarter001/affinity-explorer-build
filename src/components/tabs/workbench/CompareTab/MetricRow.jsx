import React from 'react';
import PropTypes from 'prop-types';

const MetricRow = ({ metric, affinities, formatScore, formatNumber }) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      {metric.label}
    </td>
    {affinities.map(affinity => (
      <td key={affinity.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {metric.format === 'score'
          ? formatScore(affinity[metric.key])
          : formatNumber(affinity[metric.key])}
      </td>
    ))}
  </tr>
);

MetricRow.propTypes = {
  metric: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    format: PropTypes.string
  }).isRequired,
  affinities: PropTypes.array.isRequired,
  formatScore: PropTypes.func.isRequired,
  formatNumber: PropTypes.func.isRequired
};

export default MetricRow; 