import React from 'react';
import SkeletonLoader from '../../common/SkeletonLoader';
import EmptyStateStyled from '../../common/EmptyStateStyled';

const PropertyDetails = ({ selectedProperty, loading, error }) => {
  if (loading) {
    return <SkeletonLoader className="h-64 w-full" />;
  }
  if (error) {
    return <EmptyStateStyled message={error} icon="🚫" />;
  }
  if (!selectedProperty) {
    return <EmptyStateStyled message="Select a property to view details." icon="🏠" />;
  }
  return (
    <div className="card-prominent p-6">
      <h2 className="text-xl font-bold mb-2">{selectedProperty.name}</h2>
      <div className="text-gray-600 mb-2">{selectedProperty.address}</div>
      <div className="mb-2">Type: {selectedProperty.type}</div>
      <div className="mb-2">Status: {selectedProperty.status}</div>
      {/* Add more property details as needed */}
    </div>
  );
};

export default PropertyDetails; 