import React from 'react';
import SkeletonLoader from '../../../common/SkeletonLoader';
import EmptyStateStyled from '../../../common/EmptyStateStyled';
import PerformanceMetrics from '../../../performance/PerformanceMetrics';

const AffinityDetailsPanel = ({ selectedAffinityDetails, loading, error, properties, metrics }) => {
  if (loading) {
    return <SkeletonLoader className="h-48 w-full" />;
  }
  if (error) {
    return <EmptyStateStyled message={error} icon="🚫" />;
  }
  if (!selectedAffinityDetails) {
    return <EmptyStateStyled message="Select an affinity to view details." icon="📊" />;
  }
  return (
    <div className="card-prominent p-6">
      <h2 className="text-xl font-bold mb-2">{selectedAffinityDetails.affinityName}</h2>
      <PerformanceMetrics performance={selectedAffinityDetails.performance} properties={properties} metrics={metrics} />
    </div>
  );
};

export default AffinityDetailsPanel; 