import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiTrendingUp, 
  FiPieChart, 
  FiActivity, 
  FiTarget, 
  FiCheckCircle, 
  FiAlertTriangle,
  FiClock,
  FiBarChart2,
  FiStar,
  FiLayers,
  FiRefreshCw
} from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ProgressTracker from './goals/ProgressTracker';
import AccuracyMetrics from './goals/AccuracyMetrics';
import { getDashboardStats } from '../services/apiService';
import SkeletonLoader from './common/SkeletonLoader';

ChartJS.register(ArcElement, Tooltip, Legend);

const getStatusColor = (progress) => {
  if (progress >= 75) return 'bg-green-500';
  if (progress >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [goalData, setGoalData] = useState({
    affinityExpansion: {
      current: 10,
      target: 50,
      status: 'in_progress',
      lastUpdated: '2024-03-20'
    },
    accuracy: {
      current: 20,
      target: 95,
      status: 'needs_improvement',
      lastUpdated: '2024-03-20',
      validationStrategies: [
        { name: 'Automated Validation', contribution: 8 },
        { name: 'Manual Review', contribution: 7 },
        { name: 'User Feedback', contribution: 5 }
      ]
    },
    completeness: {
      current: 45,
      target: 100,
      status: 'in_progress',
      lastUpdated: '2024-03-20',
      subScores: [
        { name: 'Data Quality', score: 40 },
        { name: 'Coverage', score: 50 },
        { name: 'Consistency', score: 45 }
      ]
    }
  });

  const recentlyViewed = [
    {
      name: 'Pet-Friendly',
      description: 'Properties that welcome pets with amenities or policies that accommodate animals.',
      score: '7.2/10',
      coverage: '72%',
      status: 'Active'
    },
    {
      name: 'Romantic',
      description: 'Properties suitable for couples seeking a romantic experience.',
      score: '6.8/10',
      coverage: '65%',
      status: 'Active'
    },
    {
      name: 'Family-Friendly',
      description: 'Properties that cater to families with children offering suitable amenities and activities.',
      score: '7.9/10',
      coverage: '81%',
      status: 'Active'
    },
    {
      name: 'Luxury',
      description: 'High-end properties offering premium amenities, services, and experiences.',
      score: '8.2/10',
      coverage: '45%',
      status: 'Active'
    }
  ];

  const favorites = [
    {
      name: 'Summer Getaway Collection',
      affinities: 5
    },
    {
      name: 'Urban Exploration Bundle',
      affinities: 3
    },
    {
      name: 'Family Trip Essentials',
      affinities: 4
    }
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const handleAffinityClick = (affinityName) => {
    navigate('/affinity-library', { 
      state: { 
        selectedAffinity: affinityName,
        source: 'dashboard'
      } 
    });
  };

  const handleCollectionClick = (collectionName) => {
    navigate('/affinity-library', { 
      state: { 
        view: 'collections',
        selectedCollection: collectionName
      } 
    });
  };

  // Calculate overall progress
  const calculateOverallProgress = () => {
    const weights = {
      affinityExpansion: 0.4,
      accuracy: 0.3,
      completeness: 0.3
    };

    const progress = {
      affinityExpansion: (goalData.affinityExpansion.current / goalData.affinityExpansion.target) * 100,
      accuracy: (goalData.accuracy.current / goalData.accuracy.target) * 100,
      completeness: (goalData.completeness.current / goalData.completeness.target) * 100
    };

    return Math.round(
      progress.affinityExpansion * weights.affinityExpansion +
      progress.accuracy * weights.accuracy +
      progress.completeness * weights.completeness
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SkeletonLoader type="stats" count={4} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonLoader type="chart" count={2} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 space-y-6 bg-gray-50">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">Overview of goals, metrics, and performance</p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-500">Last updated:</span>
          <span className="font-medium">{goalData.affinityExpansion.lastUpdated}</span>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiCheckCircle className="text-green-500 mr-2" />
              <h3 className="font-medium">Affinity Expansion Goal</h3>
            </div>
            <span className="text-sm text-green-600">+8%</span>
          </div>
          <p className="text-3xl font-bold mt-2">
            {Math.round((goalData.affinityExpansion.current / goalData.affinityExpansion.target) * 100)}%
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {goalData.affinityExpansion.current} of {goalData.affinityExpansion.target} completed
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiTarget className="text-blue-500 mr-2" />
              <h3 className="font-medium">Accuracy Goal Tracking</h3>
            </div>
            <span className="text-sm text-blue-600">+3%</span>
          </div>
          <p className="text-3xl font-bold mt-2">{goalData.accuracy.current}%</p>
          <p className="text-sm text-gray-500 mt-1">Target: {goalData.accuracy.target}%</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiActivity className="text-purple-500 mr-2" />
              <h3 className="font-medium">Completeness Goal</h3>
            </div>
            <span className="text-sm text-purple-600">+5%</span>
          </div>
          <p className="text-3xl font-bold mt-2">{Math.round((goalData.completeness.current / goalData.completeness.target) * 100)}%</p>
          <p className="text-sm text-gray-500 mt-1">
            {goalData.completeness.current} of {goalData.completeness.target}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiBarChart2 className="text-orange-500 mr-2" />
              <h3 className="font-medium">Overall Goal Tracker</h3>
            </div>
            <span className="text-sm text-orange-600">On Track</span>
          </div>
          <p className="text-3xl font-bold mt-2">{calculateOverallProgress()}%</p>
          <p className="text-sm text-gray-500 mt-1">Combined Goals</p>
        </div>
      </div>

      {/* Goals & Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Affinity Completion Tracking</h3>
              <span className="text-sm text-gray-500">Last updated: {goalData.affinityExpansion.lastUpdated}</span>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-medium">{goalData.affinityExpansion.current}/{goalData.affinityExpansion.target}</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${getStatusColor(Math.round((goalData.affinityExpansion.current / goalData.affinityExpansion.target) * 100))}`}
                  style={{ width: `${Math.round((goalData.affinityExpansion.current / goalData.affinityExpansion.target) * 100)}%` }}
                />
              </div>
            </div>

            {/* Status Indicators */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <FiCheckCircle className="text-green-500 text-xl mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-xl font-semibold">{goalData.affinityExpansion.current}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <FiClock className="text-blue-500 text-xl mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Remaining</p>
                  <p className="text-xl font-semibold">{goalData.affinityExpansion.target - goalData.affinityExpansion.current}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <FiAlertTriangle className="text-red-500 text-xl mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-xl font-semibold">{goalData.affinityExpansion.target}</p>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="mt-6 pt-6 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-lg font-semibold">{Math.round((goalData.affinityExpansion.current / goalData.affinityExpansion.target) * 100)}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Remaining</p>
                  <p className="text-lg font-semibold">{goalData.affinityExpansion.target - goalData.affinityExpansion.current}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          {/* Accuracy Goal Tracking */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Accuracy Goal Tracking</h3>
              <div className="flex items-center">
                <span className={`text-sm font-medium ${goalData.accuracy.current >= goalData.accuracy.target ? 'text-green-600' : 'text-yellow-600'}`}>
                  {goalData.accuracy.current}%
                </span>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-medium">{goalData.accuracy.current}% / {goalData.accuracy.target}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    goalData.accuracy.current >= goalData.accuracy.target ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${(goalData.accuracy.current / goalData.accuracy.target) * 100}%` }}
                />
              </div>
            </div>

            {/* Validation Strategy Breakdown with Pie Chart */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">Validation Strategy Contributors</h4>
              <div className="flex flex-col items-center space-y-6">
                <div className="w-48 h-48">
                  <Pie
                    data={{
                      labels: goalData.accuracy.validationStrategies.map(strategy => strategy.name),
                      datasets: [
                        {
                          data: goalData.accuracy.validationStrategies.map(strategy => strategy.contribution),
                          backgroundColor: [
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(75, 192, 192, 0.8)',
                            'rgba(153, 102, 255, 0.8)',
                          ],
                          borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `${context.label}: ${context.raw}%`;
                            }
                          }
                        }
                      },
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
                <div className="flex justify-center items-center space-x-6">
                  {goalData.accuracy.validationStrategies.map((strategy, index) => (
                    <div key={index} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{
                          backgroundColor: [
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(75, 192, 192, 0.8)',
                            'rgba(153, 102, 255, 0.8)',
                          ][index]
                        }}
                      />
                      <span className="text-sm text-gray-600">{strategy.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Remaining Progress */}
            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Remaining to Target</span>
                <span className="text-sm font-medium text-yellow-600">{goalData.accuracy.target - goalData.accuracy.current}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Viewed Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recently Viewed</h2>
          <button className="text-gray-500 hover:text-gray-700">
            <FiRefreshCw className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentlyViewed.map((item, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" 
              onClick={() => handleAffinityClick(item.name)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleAffinityClick(item.name);
                }
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full">
                  {item.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Average Score: {item.score}</span>
                <span>Coverage: {item.coverage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Favorites Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">My Favorites</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {favorites.map((collection, index) => (
            <div
              key={index}
              onClick={() => handleCollectionClick(collection.name)}
              className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <FiLayers className="w-5 h-5 text-blue-500 mr-2" />
                  <h3 className="font-semibold text-gray-900">{collection.name}</h3>
                </div>
                <button className="text-amber-500 hover:text-amber-600">
                  <FiStar className="w-5 h-5" />
                </button>
              </div>
              <div className="text-sm text-gray-500">
                {collection.affinities} affinities
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 