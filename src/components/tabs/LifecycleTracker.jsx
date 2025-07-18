import React, { useState } from 'react';
import { FiCheck, FiClock, FiAlertCircle } from 'react-icons/fi';
import LifecycleCardGrid from './LifecycleTrackerParts/LifecycleCardGrid';
import LifecycleDetailTable from './LifecycleTrackerParts/LifecycleDetailTable';
import { useAppContext } from '../../contexts/AppContext';
import SearchableDropdown from '../common/SearchableDropdown';

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
  const { addToRecentlyViewed } = useAppContext();

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

  const handleSelectLifecycle = (lifecycle) => {
    addToRecentlyViewed(lifecycle);
    setSelectedLifecycle(lifecycle);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Lifecycle Tracker</h2>
      
      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap items-center">
          <label className="mr-2 text-gray-700">Filter by Status:</label>
          <SearchableDropdown
            options={[
              { value: 'all', label: 'All Concepts' },
              { value: 'complete', label: 'Complete' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'not-started', label: 'Not Started' }
            ]}
            value={{ value: filter, label: filter === 'all' ? 'All Concepts' : filter === 'complete' ? 'Complete' : filter === 'in-progress' ? 'In Progress' : 'Not Started' }}
            onChange={(option) => setFilter(option?.value || 'all')}
            placeholder="Filter by status..."
            className="w-48"
            noOptionsMessage="No status options found"
          />
        </div>
      </div>
      
      {/* Concept Cards Grid */}
      {filteredLifecycles.length === 0 ? (
        <div className="p-8 text-center text-gray-500">No lifecycles found for this filter.</div>
      ) : (
        <LifecycleCardGrid
          lifecycles={filteredLifecycles}
          selectedLifecycle={selectedLifecycle}
          onSelect={handleSelectLifecycle}
          getProgressStats={getProgressStats}
          getProgressColor={getProgressColor}
        />
      )}
      
      {/* Selected Lifecycle Details */}
      {selectedLifecycle ? (
        <LifecycleDetailTable
          selectedLifecycle={selectedLifecycle}
          handleExportJSON={handleExportJSON}
        />
      ) : (
        <div className="text-center text-gray-500 mt-8">Select a lifecycle to view its details.</div>
      )}
    </div>
  );
};

export default LifecycleTracker;