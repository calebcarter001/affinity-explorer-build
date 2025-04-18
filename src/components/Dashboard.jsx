import React from 'react';
import { FiTrendingUp, FiPieChart, FiActivity, FiTarget } from 'react-icons/fi';

const Dashboard = () => {
  return (
    <div className="h-full flex flex-col p-3">
      {/* Header - Fixed height */}
      <div className="flex-shrink-0 mb-3">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-600">Overview of affinity metrics and performance</p>
      </div>

      {/* Main content - Flexible height */}
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3 min-h-0">
        {/* Stats Cards - Auto height */}
        <div className="bg-white rounded-lg p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Total Affinities</h3>
              <FiPieChart className="text-blue-500" />
            </div>
            <p className="text-2xl font-semibold mt-1">248</p>
          </div>
          <div className="text-xs text-green-600 mt-2">
            +12% from last quarter
          </div>
        </div>

        {/* Repeat similar pattern for other stat cards */}
        
        {/* Charts Section - Remaining height */}
        <div className="col-span-2 lg:col-span-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Affinity Growth</h3>
            {/* Chart component would go here */}
            <div className="h-40 bg-gray-50 rounded"></div>
          </div>
          
          <div className="bg-white rounded-lg p-3">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Coverage Trends</h3>
            {/* Chart component would go here */}
            <div className="h-40 bg-gray-50 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 