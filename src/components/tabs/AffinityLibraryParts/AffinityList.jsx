import React from 'react';
import AffinityCard from '../../common/AffinityCard';

const AffinityList = ({ affinities, selectedAffinity, onSelect, userCollections = [], onAddToCollection }) => (
  <div className="space-y-2 overflow-y-auto">
    {affinities.map(affinity => (
      <AffinityCard
        key={affinity.id}
        affinity={affinity}
        userCollections={userCollections}
        onAddToCollection={onAddToCollection}
        onClick={() => onSelect(affinity)}
        selected={selectedAffinity?.id === affinity.id}
      />
    ))}
  </div>
);

export default AffinityList; 