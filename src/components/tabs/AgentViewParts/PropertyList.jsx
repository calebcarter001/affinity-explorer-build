import React from 'react';
import SkeletonLoader from '../../common/SkeletonLoader';
import EmptyStateStyled from '../../common/EmptyStateStyled';
import PropertyCard from '../../common/PropertyCard';

const PropertyList = ({ properties, selectedProperty, onSelect, loading, error, renderPagination }) => {
  if (loading) {
    return <SkeletonLoader count={3} height={100} />;
  }
  if (error) {
    return (
      <EmptyStateStyled
        type="ERROR"
        description={error}
        actionButton={{
          label: 'Try Again',
          onClick: () => window.location.reload()
        }}
      />
    );
  }
  if (!properties.length) {
    return (
      <EmptyStateStyled
        type="NO_PROPERTIES"
        description="No properties available. Add properties to get started."
        actionButton={{
          label: 'Add Properties',
          onClick: () => {/* TODO: Implement add properties */}
        }}
      />
    );
  }
  return (
    <>
      <div className="space-y-4">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            isSelected={selectedProperty?.id === property.id}
            onClick={onSelect}
            className="w-full"
          />
        ))}
      </div>
      {renderPagination && renderPagination()}
    </>
  );
};

export default PropertyList; 