import React, { useState } from 'react';
import { FiCheck, FiClock, FiAlertCircle } from 'react-icons/fi';

const mockLifecycles = [
  {
    id: "1",
    name: 'Pet-Friendly',
    status: 'complete',
    stages: [
      { name: 'Definition', status: 'complete', lastUpdated: '2024-03-15', owner: 'Sarah Chen' },
      { name: 'Data Collection', status: 'complete', lastUpdated: '2024-03-18', owner: 'Mike Johnson' },
      { name: 'Model Training', status: 'complete', lastUpdated: '2024-03-20', owner: 'David Lee' },
      { name: 'Validation', status: 'complete', lastUpdated: '2024-03-22', owner: 'Emma Wilson' },
      { name: 'Deployment', status: 'complete', lastUpdated: '2024-03-25', owner: 'James Taylor' }
    ]
  },
  {
    id: "2",
    name: 'Family-Friendly',
    status: 'in-progress',
    stages: [
      { name: 'Definition', status: 'complete', lastUpdated: '2024-03-10', owner: 'Sarah Chen' },
      { name: 'Data Collection', status: 'complete', lastUpdated: '2024-03-12', owner: 'Mike Johnson' },
      { name: 'Model Training', status: 'in-progress', lastUpdated: '2024-03-15', owner: 'David Lee' },
      { name: 'Validation', status: 'not-started', lastUpdated: '-', owner: 'Emma Wilson' },
      { name: 'Deployment', status: 'not-started', lastUpdated: '-', owner: 'James Taylor' }
    ]
  },
  {
    id: "3",
    name: 'Romantic',
    status: 'not-started',
    stages: [
      { name: 'Definition', status: 'not-started', lastUpdated: '-', owner: 'Sarah Chen' },
      { name: 'Data Collection', status: 'not-started', lastUpdated: '-', owner: 'Mike Johnson' },
      { name: 'Model Training', status: 'not-started', lastUpdated: '-', owner: 'David Lee' },
      { name: 'Validation', status: 'not-started', lastUpdated: '-', owner: 'Emma Wilson' },
      { name: 'Deployment', status: 'not-started', lastUpdated: '-', owner: 'James Taylor' }
    ]
  },
  {
    id: "4",
    name: 'Luxury',
    status: 'in-progress',
    stages: [
      { name: 'Definition', status: 'complete', lastUpdated: '2024-03-01', owner: 'Sarah Chen' },
      { name: 'Data Collection', status: 'complete', lastUpdated: '2024-03-05', owner: 'Mike Johnson' },
      { name: 'Model Training', status: 'complete', lastUpdated: '2024-03-08', owner: 'David Lee' },
      { name: 'Validation', status: 'complete', lastUpdated: '2024-03-10', owner: 'Emma Wilson' },
      { name: 'Deployment', status: 'complete', lastUpdated: '2024-03-12', owner: 'James Taylor' },
      { name: 'Review', status: 'in-progress', lastUpdated: '2024-03-15', owner: 'Sarah Chen' }
    ]
  }
];

const LifecycleTracker = () => {
  const [filter, setFilter] = useState('all');
  const [selectedLifecycle, setSelectedLifecycle] = useState(null);

  const getProgressColor = (lifecycle) => {
    const completedStages = lifecycle.stages.filter(stage => stage.status === 'complete').length;
    const totalStages = lifecycle.stages.length;
    const progress = completedStages / totalStages;

    if (progress === 1) return 'bg-green-500';
    if (progress > 0) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  const getProgressStats = (lifecycle) => {
    const completedStages = lifecycle.stages.filter(stage => stage.status === 'complete').length;
    const totalStages = lifecycle.stages.length;
    const percentage = Math.round((completedStages / totalStages) * 100);
    return {
      completed: completedStages,
      total: totalStages,
      percentage
    };
  };

  const filteredLifecycles = mockLifecycles.filter(lifecycle => 
    filter === 'all' || lifecycle.status === filter
  );

  const handleExportJSON = () => {
    if (selectedLifecycle) {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedLifecycle, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `lifecycle_${selectedLifecycle.name.toLowerCase()}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Lifecycle Tracker</h2>
      
      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap items-center">
          <label className="mr-2 text-gray-700">Filter by Status:</label>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Concepts</option>
            <option value="complete">Complete</option>
            <option value="in-progress">In Progress</option>
            <option value="not-started">Not Started</option>
          </select>
        </div>
      </div>
      
      {/* Concept Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filteredLifecycles.map(lifecycle => {
          const progress = getProgressStats(lifecycle);
          return (
            <div 
              key={lifecycle.id}
              className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${
                selectedLifecycle?.id === lifecycle.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedLifecycle(lifecycle)}
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
      
      {/* Selected Lifecycle Details */}
      {selectedLifecycle && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">
            Lifecycle Stages: {selectedLifecycle.name}
          </h3>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stage</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Last Updated</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Owner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedLifecycle.stages.map((stage, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{stage.name}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          stage.status === 'complete' ? 'bg-green-100 text-green-800' :
                          stage.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          <span className="mr-1">
                            {stage.status === 'complete' ? <FiCheck /> :
                             stage.status === 'in-progress' ? <FiClock /> :
                             <FiAlertCircle />}
                          </span>
                          {stage.status === 'complete' ? 'Complete' : 
                           stage.status === 'in-progress' ? 'In Progress' : 
                           'Not Started'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{stage.lastUpdated}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{stage.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
              <button 
                onClick={handleExportJSON}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white focus:outline-none"
              >
                Export JSON
              </button>
              <button 
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white focus:outline-none"
              >
                Export to Confluence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LifecycleTracker;