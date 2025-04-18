import React, { useState } from 'react';
import { FiDownload, FiFilter, FiCalendar, FiBarChart2 } from 'react-icons/fi';
import SkeletonLoader from '../common/SkeletonLoader';
import EmptyState from '../common/EmptyState';

const ReportsAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('affinity-performance');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [affinityFilter, setAffinityFilter] = useState('all');
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerateReport = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setShowPreview(true);
    }, 1500);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-0">Reports & Analytics</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <button className="btn btn-outline flex items-center gap-2">
            <FiFilter /> Filter Reports
          </button>
          <button className="btn btn-primary flex items-center gap-2">
            <FiDownload /> Export Data
          </button>
        </div>
      </div>
      
      <div className="bg-white p-4 md:p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Custom Report Builder</h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Report Type:</label>
          <select 
            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="affinity-performance">Affinity Performance Report</option>
            <option value="coverage-analysis">Coverage Analysis</option>
            <option value="implementation-impact">Implementation Impact Report</option>
            <option value="concept-adoption">Concept Adoption Trends</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range:</label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-2.5 text-gray-400" />
              <select 
                className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:border-blue-500"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="last-30-days">Last 30 days</option>
                <option value="last-quarter">Last quarter</option>
                <option value="last-6-months">Last 6 months</option>
                <option value="year-to-date">Year to date</option>
                <option value="custom-range">Custom range</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Include Affinities:</label>
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              value={affinityFilter}
              onChange={(e) => setAffinityFilter(e.target.value)}
            >
              <option value="all">All affinities</option>
              <option value="validated">Validated only</option>
              <option value="recently-updated">Recently updated</option>
              <option value="custom">Custom selection</option>
            </select>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="text-sm text-gray-500">
            <p>This report will analyze data based on your selected criteria.</p>
            <p>Estimated processing time: 30-60 seconds</p>
          </div>
          <button 
            className="btn btn-primary flex items-center gap-2"
            onClick={handleGenerateReport}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <FiBarChart2 /> Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Report Preview */}
      {loading ? (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Report Preview</h3>
          <SkeletonLoader type="card" count={3} />
        </div>
      ) : showPreview ? (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
            <h3 className="text-lg font-semibold">Report Preview</h3>
            <div className="flex flex-col sm:flex-row gap-2 mt-2 md:mt-0">
              <button className="btn btn-outline text-sm">Save Report</button>
              <button className="btn btn-primary text-sm">Download PDF</button>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Total Affinities</h4>
                <p className="text-2xl md:text-3xl font-bold text-expedia-blue">248</p>
                <p className="text-sm text-gray-500">+12% from last month</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Implementation Rate</h4>
                <p className="text-2xl md:text-3xl font-bold text-green-600">78%</p>
                <p className="text-sm text-gray-500">+5% from last month</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">API Calls</h4>
                <p className="text-2xl md:text-3xl font-bold text-purple-600">1.2M</p>
                <p className="text-sm text-gray-500">Last 30 days</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-3">Performance Trends</h4>
              <div className="bg-gray-50 p-4 rounded-lg h-64 flex items-center justify-center">
                <p className="text-gray-500">Chart visualization would appear here</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-3">Top Performing Affinities</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Affinity</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Luxury</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Premium</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">9.2</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600">+0.3</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Family-Friendly</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Family</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">8.7</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600">+0.2</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Beachfront</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Location</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">8.5</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600">-0.1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow flex items-center justify-center h-64">
          <EmptyState 
            icon="inbox"
            title="No Report Generated"
            description="Select your report criteria and click 'Generate Report' to create a new report."
          />
        </div>
      )}
    </div>
  );
};

export default ReportsAnalytics;