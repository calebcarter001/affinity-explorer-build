import React from 'react';

const ReportsAnalytics = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Reports & Analytics</h2>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Custom Report Builder</h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Report Type:</label>
          <select className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500">
            <option>Affinity Performance Report</option>
            <option>Coverage Analysis</option>
            <option>Implementation Impact Report</option>
            <option>Concept Adoption Trends</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range:</label>
            <select className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500">
              <option>Last 30 days</option>
              <option>Last quarter</option>
              <option>Last 6 months</option>
              <option>Year to date</option>
              <option>Custom range</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Include Affinities:</label>
            <select className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500">
              <option>All affinities</option>
              <option>Validated only</option>
              <option>Recently updated</option>
              <option>Custom selection</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none">
            Generate Report
          </button>
        </div>
      </div>

      {/* Sample Report Preview */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Report Preview</h3>
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Total Affinities</h4>
              <p className="text-3xl font-bold text-expedia-blue">248</p>
              <p className="text-sm text-gray-500">+12% from last month</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Implementation Rate</h4>
              <p className="text-3xl font-bold text-green-600">78%</p>
              <p className="text-sm text-gray-500">+5% from last month</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">API Calls</h4>
              <p className="text-3xl font-bold text-purple-600">1.2M</p>
              <p className="text-sm text-gray-500">Last 30 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;