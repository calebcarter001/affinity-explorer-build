import React from 'react';

const LifecycleCardGrid = ({ lifecycles, selectedLifecycle, onSelect, getProgressStats, getProgressColor }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
    {lifecycles.map(lifecycle => {
      const progress = getProgressStats(lifecycle);
      return (
        <div
          key={lifecycle.id}
          className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${
            selectedLifecycle?.id === lifecycle.id ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => onSelect(lifecycle)}
        >
          <h3 className="text-xl font-bold mb-4">{lifecycle.name}</h3>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full ${getProgressColor(lifecycle)}`}
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <div className="text-sm text-gray-600">
            {progress.completed} of {progress.total} stages complete ({progress.percentage}%)
          </div>
        </div>
      );
    })}
  </div>
);

export default LifecycleCardGrid; 