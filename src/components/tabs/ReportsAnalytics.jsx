import React, { useState, useEffect } from 'react';
import { FiDownload, FiFilter, FiCalendar, FiBarChart2 } from 'react-icons/fi';
import { getDashboardStats, getAffinities, getAffinityPerformance } from '../../services/apiService';
import SkeletonLoader from '../common/SkeletonLoader';
import EmptyStateStyled from '../common/EmptyStateStyled';
import SearchableDropdown from '../common/SearchableDropdown';

const ReportsAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('affinity-performance');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [affinityFilter, setAffinityFilter] = useState('all');
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [availableAffinities, setAvailableAffinities] = useState([]);

  // Load available affinities for filtering
  useEffect(() => {
    const loadAffinities = async () => {
      try {
        const response = await getAffinities();
        setAvailableAffinities(response.data);
      } catch (err) {
        setError('Failed to load affinities. Please try again.');
      }
    };
    loadAffinities();
  }, []);

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      let data = {};
      
      switch (reportType) {
        case 'affinity-performance': {
          const now = new Date();
          const currentYear = now.getFullYear();
          const currentQuarter = Math.floor(now.getMonth() / 3) + 1;
          
          const performanceResponse = await getAffinityPerformance(
            affinityFilter !== 'all' ? affinityFilter : null,
            currentYear,
            currentQuarter
          );
          
          const statsResponse = await getDashboardStats();
          
          data = {
            performance: performanceResponse.data,
            stats: statsResponse,
            generatedAt: new Date().toISOString(),
            type: 'Affinity Performance Report',
            period: `${currentYear} Q${currentQuarter}`
          };
          break;
        }
        
        case 'coverage-analysis': {
          const statsResponse = await getDashboardStats();
          data = {
            stats: statsResponse,
            generatedAt: new Date().toISOString(),
            type: 'Coverage Analysis Report',
            metrics: statsResponse.goals.completeness
          };
          break;
        }
        
        case 'implementation-impact': {
          const statsResponse = await getDashboardStats();
          data = {
            stats: statsResponse,
            generatedAt: new Date().toISOString(),
            type: 'Implementation Impact Report',
            metrics: statsResponse.goals.alignment
          };
          break;
        }
        
        case 'concept-adoption': {
          const statsResponse = await getDashboardStats();
          data = {
            stats: statsResponse,
            generatedAt: new Date().toISOString(),
            type: 'Concept Adoption Trends',
            metrics: statsResponse.goals.travelConcepts
          };
          break;
        }
        
        default:
          throw new Error('Invalid report type');
      }
      
      setReportData(data);
      setShowPreview(true);
    } catch (err) {
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <SearchableDropdown
            options={[
              { value: 'affinity-performance', label: 'Affinity Performance Report' },
              { value: 'coverage-analysis', label: 'Coverage Analysis' },
              { value: 'implementation-impact', label: 'Implementation Impact Report' },
              { value: 'concept-adoption', label: 'Concept Adoption Trends' }
            ]}
            value={{ value: reportType, label: reportType === 'affinity-performance' ? 'Affinity Performance Report' : reportType === 'coverage-analysis' ? 'Coverage Analysis' : reportType === 'implementation-impact' ? 'Implementation Impact Report' : 'Concept Adoption Trends' }}
            onChange={(option) => setReportType(option?.value || 'affinity-performance')}
            placeholder="Select report type..."
            className="w-48"
            noOptionsMessage="No report types found"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range:</label>
            <div className="relative">
              <SearchableDropdown
                options={[
                  { value: 'last-30-days', label: 'Last 30 days' },
                  { value: 'last-quarter', label: 'Last quarter' },
                  { value: 'last-6-months', label: 'Last 6 months' },
                  { value: 'year-to-date', label: 'Year to date' },
                  { value: 'custom-range', label: 'Custom range' }
                ]}
                value={{ value: dateRange, label: dateRange === 'last-30-days' ? 'Last 30 days' : dateRange === 'last-quarter' ? 'Last quarter' : dateRange === 'last-6-months' ? 'Last 6 months' : dateRange === 'year-to-date' ? 'Year to date' : 'Custom range' }}
                onChange={(option) => setDateRange(option?.value || 'last-30-days')}
                placeholder="Select date range..."
                className="w-48"
                noOptionsMessage="No date ranges found"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Include Affinities:</label>
            <SearchableDropdown
              options={[
                { value: 'all', label: 'All affinities' },
                { value: 'validated', label: 'Validated only' },
                { value: 'recently-updated', label: 'Recently updated' },
                { value: 'custom', label: 'Custom selection' }
              ]}
              value={{ value: affinityFilter, label: affinityFilter === 'all' ? 'All affinities' : affinityFilter === 'validated' ? 'Validated only' : affinityFilter === 'recently-updated' ? 'Recently updated' : 'Custom selection' }}
              onChange={(option) => setAffinityFilter(option?.value || 'all')}
              placeholder="Select affinity filter..."
              className="w-48"
              noOptionsMessage="No affinity filters found"
            />
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

      {/* Report Preview Section */}
      <div className="mt-8">
        {loading ? (
          <div className="space-y-4">
            <SkeletonLoader type="text" count={2} />
            <SkeletonLoader type="table" />
          </div>
        ) : error ? (
          <EmptyStateStyled
            type="ERROR"
            actionButton={
              <button
                onClick={() => {
                  setError(null);
                  handleGenerateReport();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            }
          />
        ) : !showPreview ? (
          <EmptyStateStyled
            type="NO_DATA"
            title="No Report Generated"
            description="Configure your report parameters and click 'Generate Report' to view the results"
            suggestions={[
              'Select a report type from the dropdown',
              'Choose a date range for your report',
              'Filter by specific affinities if needed'
            ]}
          />
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
              <div>
                <h3 className="text-xl font-semibold">{reportData.type}</h3>
                <p className="text-sm text-gray-500">Generated on {new Date(reportData.generatedAt).toLocaleString()}</p>
                {reportData.period && (
                  <p className="text-sm text-gray-500">Period: {reportData.period}</p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-2 md:mt-0">
                <button className="btn btn-outline text-sm">Save Report</button>
                <button className="btn btn-primary text-sm">Download PDF</button>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {reportType === 'affinity-performance' && (
                  <>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Total Affinities</h4>
                      <p className="text-2xl md:text-3xl font-bold text-expedia-blue">
                        {reportData.stats.totalAffinities}
                      </p>
                      <p className="text-sm text-gray-500">
                        +{reportData.stats.quarterlyGrowth}% from last quarter
                      </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Implementation Rate</h4>
                      <p className="text-2xl md:text-3xl font-bold text-green-600">
                        {reportData.stats.implementationRate}%
                      </p>
                      <p className="text-sm text-gray-500">
                        +{reportData.stats.quarterlyGrowthImplementation}% from last quarter
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Average Coverage</h4>
                      <p className="text-2xl md:text-3xl font-bold text-purple-600">
                        {reportData.stats.avgCoverage}%
                      </p>
                      <p className="text-sm text-gray-500">
                        +{reportData.stats.yearlyGrowthCoverage}% year over year
                      </p>
                    </div>
                  </>
                )}

                {reportType === 'coverage-analysis' && (
                  <>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Overall Completeness</h4>
                      <p className="text-2xl md:text-3xl font-bold text-expedia-blue">
                        {reportData.metrics.overall.percentage}%
                      </p>
                      <p className="text-sm text-gray-500">
                        {reportData.metrics.overall.complete} of {reportData.metrics.overall.total} complete
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">High Priority Items</h4>
                      <p className="text-2xl md:text-3xl font-bold text-yellow-600">
                        {reportData.metrics.priority.high}
                      </p>
                      <p className="text-sm text-gray-500">Need immediate attention</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Required Attributes</h4>
                      <p className="text-2xl md:text-3xl font-bold text-green-600">
                        {Math.round((reportData.metrics.subScores.attributes.complete / 
                          (reportData.metrics.subScores.attributes.complete + 
                           reportData.metrics.subScores.attributes.incomplete)) * 100)}%
                      </p>
                      <p className="text-sm text-gray-500">Completion rate</p>
                    </div>
                  </>
                )}

                {reportType === 'implementation-impact' && (
                  <>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Quarterly Target</h4>
                      <p className="text-2xl md:text-3xl font-bold text-expedia-blue">
                        {reportData.metrics.quarterly.current}%
                      </p>
                      <p className="text-sm text-gray-500">
                        Gap: {reportData.metrics.quarterly.gap}%
                      </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Yearly Projection</h4>
                      <p className="text-2xl md:text-3xl font-bold text-purple-600">
                        {reportData.metrics.yearly.projected}%
                      </p>
                      <p className="text-sm text-gray-500">
                        Target: {reportData.metrics.yearly.target}%
                      </p>
                </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Risk Level</h4>
                      <p className="text-2xl md:text-3xl font-bold text-yellow-600">
                        {reportData.metrics.yearly.riskLevel}
                      </p>
                      <p className="text-sm text-gray-500">Current assessment</p>
              </div>
                  </>
                )}

                {reportType === 'concept-adoption' && (
                  <>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Total Concepts</h4>
                      <p className="text-2xl md:text-3xl font-bold text-expedia-blue">
                        {reportData.metrics.total}
                      </p>
                      <p className="text-sm text-gray-500">
                        Target: {reportData.metrics.yearlyTarget}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Progress Rate</h4>
                      <p className="text-2xl md:text-3xl font-bold text-green-600">
                        {reportData.metrics.progressRate}%
                      </p>
                      <p className="text-sm text-gray-500">
                        {reportData.metrics.completed} completed
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Validation Status</h4>
                      <p className="text-2xl md:text-3xl font-bold text-purple-600">
                        {reportData.metrics.breakdown.validated}
                      </p>
                      <p className="text-sm text-gray-500">
                        {reportData.metrics.breakdown.inValidation} in validation
                      </p>
                </div>
                  </>
                )}
              </div>
              
              {/* Performance Trends */}
              {reportType === 'affinity-performance' && reportData.performance && (
              <div className="mt-6">
                  <h4 className="font-medium mb-3">Performance Details</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Affinity</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GP Net</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {reportData.performance.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.affinityId}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.clicks.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.impressions.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.transactions.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">${item.gpNet.toLocaleString()}</td>
                      </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Coverage Breakdown */}
              {reportType === 'coverage-analysis' && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Coverage Breakdown</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attribute</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complete</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incomplete</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                      </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries(reportData.metrics.subScores).map(([key, value]) => (
                          <tr key={key}>
                            <td className="px-4 py-3 text-sm text-gray-900 capitalize">{key}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{value.complete}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{value.incomplete}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{value.required ? 'Yes' : 'No'}</td>
                      </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsAnalytics;