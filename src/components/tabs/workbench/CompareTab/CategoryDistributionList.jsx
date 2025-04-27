import React from 'react';
import PropTypes from 'prop-types';

const CategoryDistributionList = ({ affinities }) => {
  const categories = Array.from(new Set(affinities.map(a => a.category)));
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Categories Distribution</h2>
      {affinities.length === 0 ? (
        <p className="text-gray-500">No affinities to display categories.</p>
      ) : (
        <ul className="list-disc pl-5 text-gray-700">
          {categories.map(category => (
            <li key={category}>
              {category}: {affinities.filter(a => a.category === category).length} affinities
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

CategoryDistributionList.propTypes = {
  affinities: PropTypes.array.isRequired
};

export default CategoryDistributionList; 