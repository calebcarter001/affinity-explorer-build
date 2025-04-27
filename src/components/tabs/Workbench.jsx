import React, { useState, useEffect } from 'react';
import { FiBarChart2, FiLayers, FiTrendingUp, FiRefreshCw, FiSettings } from 'react-icons/fi';
import { getAffinities } from '../../services/apiService';
import { useSearchParams } from 'react-router-dom';
import PerformanceTab from './workbench/PerformanceTab';
import CompareTab from './workbench/CompareTab';
import PrepareTab from './workbench/PrepareTab';
import { useAffinityData } from '../../contexts/AffinityDataContext';
import SkeletonLoader from '../common/SkeletonLoader';
import EmptyStateStyled from '../common/EmptyStateStyled';

const Workbench = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'performance';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [periodState, setPeriodState] = useState({
    mode: 'quarter',
    year: new Date().getFullYear(),
    quarter: 1
  });

  // Use global affinities state
  const {
    affinities,
    affinitiesLoading: loading,
    affinitiesError: error,
    fetchAffinities
  } = useAffinityData();

  // Update URL when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  useEffect(() => {
    if (activeTab === 'compare') {
      fetchAffinities();
    }
  }, [activeTab, fetchAffinities]);

  const tabs = [
    { id: 'performance', label: 'Performance', icon: <FiBarChart2 /> },
    { id: 'compare', label: 'Compare', icon: <FiLayers /> },
    { id: 'prepare', label: 'Prepare', icon: <FiSettings /> },
    { id: 'forecast', label: 'Forecast', icon: <FiTrendingUp /> },
  ];

  return (
    <div className="p-4">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Workbench</h1>
        <p className="text-gray-600">Analyze, compare, and forecast affinity performance</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-2">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-2">
        {activeTab === 'performance' && <PerformanceTab />}
        {activeTab === 'compare' && (
          loading ? (
            <SkeletonLoader count={3} />
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-8">
              <EmptyStateStyled
                type="ERROR"
                title="Failed to load affinities"
                description={error}
                actionButton={
                  <button
                    onClick={() => fetchAffinities(true)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <FiRefreshCw className="mr-2" /> Retry
                  </button>
                }
              />
            </div>
          ) : (
            <CompareTab
              affinities={affinities}
              loading={loading}
              error={error}
              periodState={periodState}
              onPeriodChange={setPeriodState}
            />
          )
        )}
        {activeTab === 'prepare' && <PrepareTab />}
        {activeTab === 'forecast' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Forecast Analysis</h2>
            <p className="text-gray-600">Forecast tab content will be implemented here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workbench; 