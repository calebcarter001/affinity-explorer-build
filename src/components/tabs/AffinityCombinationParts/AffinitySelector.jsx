import React from 'react';
import { FiX } from 'react-icons/fi';
import { useAppContext } from '../../../contexts/AppContext';

const AffinitySelector = ({ availableAffinities, selectedAffinities, onAdd, onRemove, onClear }) => {
  const { addToRecentlyViewed } = useAppContext();

  return (
    <>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Available affinities:</label>
        <div className="flex flex-wrap gap-2">
          {availableAffinities.map(affinity => (
            <button
              key={affinity.id}
              onClick={() => { onAdd(affinity); addToRecentlyViewed(affinity); }}
              disabled={selectedAffinities.some(a => a.id === affinity.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedAffinities.some(a => a.id === affinity.id)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              {affinity.name}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Selected affinities:</label>
        {selectedAffinities.length === 0 ? (
          <div className="text-gray-500 text-sm">Select at least two affinities to find matching properties</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedAffinities.map(affinity => (
              <div
                key={affinity.id}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-medium"
              >
                {affinity.name}
                <button
                  onClick={() => onRemove(affinity)}
                  className="ml-1 text-white hover:text-gray-200"
                >
                  <FiX size={14} />
                </button>
              </div>
            ))}
            {selectedAffinities.length > 0 && (
              <button
                onClick={onClear}
                className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300"
              >
                Clear All
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AffinitySelector; 