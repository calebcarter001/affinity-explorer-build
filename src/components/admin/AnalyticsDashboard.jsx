import React, { useState, useEffect } from 'react';
import { FiBarChart2, FiUsers, FiActivity, FiAlertTriangle, FiClock } from 'react-icons/fi';
import { getAnalyticsData } from '../../utils/analytics';
import { getPerformanceData } from '../../utils/performance';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    // Check if user has admin permission
    if (!hasPermission('admin')) {
      showToast('You do not have permission to view analytics', 'error');
      return;
    }

    const fetchData = () => {
      try {
        const analytics = getAnalyticsData();
        const performance = getPerformanceData();
        
        setAnalyticsData(analytics);
        setPerformanceData(performance);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        showToast('Failed to load analytics data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, [hasPermission, showToast]);

  if (loading) {
    return <div className="text-center py-8">Loading analytics data...</div>;
  }

  if (!analyticsData || !performanceData) {
    return <div className="text-center py-8">No analytics data available</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiBarChart2 className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Events</p>
              <p className="text-lg font-semibold text-gray-900">{analyticsData.summary.totalEvents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FiUsers className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Page Views</p>
              <p className="text-lg font-semibold text-gray-900">{analyticsData.summary.totalPageViews}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FiActivity className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Feature Uses</p>
              <p className="text-lg font-semibold text-gray-900">{analyticsData.summary.totalFeatureUses}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <FiAlertTriangle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Errors</p>
              <p className="text-lg font-semibold text-gray-900">{analyticsData.summary.totalErrors}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Page Views */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Page Views</h2>
        </div>
        <div className="p-6">
          {Object.keys(analyticsData.pageViews).length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Page
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(analyticsData.pageViews).map(([page, count]) => (
                    <tr key={page}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {page}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No page view data available</p>
          )}
        </div>
      </div>
      
      {/* Feature Usage */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Feature Usage</h2>
        </div>
        <div className="p-6">
          {Object.keys(analyticsData.featureUsage).length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Feature
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uses
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(analyticsData.featureUsage).map(([feature, count]) => (
                    <tr key={feature}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {feature}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No feature usage data available</p>
          )}
        </div>
      </div>
      
      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Performance Metrics</h2>
        </div>
        <div className="p-6">
          {Object.keys(performanceData.summary).length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Metric
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Count
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg (ms)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Min (ms)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Max (ms)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(performanceData.summary).map(([metric, data]) => (
                    <tr key={metric}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {metric}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {data.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {data.avg.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {data.min.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {data.max.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No performance data available</p>
          )}
        </div>
      </div>
      
      {/* Recent Errors */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Errors</h2>
        </div>
        <div className="p-6">
          {analyticsData.errors.length > 0 ? (
            <div className="space-y-4">
              {analyticsData.errors.slice(0, 5).map((error, index) => (
                <div key={index} className="border-l-4 border-red-500 bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FiAlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error.error}</p>
                      <p className="mt-1 text-xs text-red-500">
                        {new Date(error.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No error data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 