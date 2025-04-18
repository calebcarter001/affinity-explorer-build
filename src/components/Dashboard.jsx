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
  FiRefreshCw,
  FiPlusCircle
} from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ProgressTracker from './goals/ProgressTracker';
import AccuracyMetrics from './goals/AccuracyMetrics';
import { getDashboardStats, getAffinityStats, getRecentActivity } from '../services/apiService';
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
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
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

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, activityData] = await Promise.all([
        getAffinityStats(),
        getRecentActivity()
      ]);
      setStats(statsData);
      setRecentActivity(activityData);
    } catch (err) {
      setError('Error loading dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAffinityClick = (affinity) => {
    navigate('/affinity-library', { 
      state: { 
        selectedAffinity: affinity.name,
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

  const handleCreateAffinity = () => {
    navigate('/affinity-library/create');
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
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <FiAlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Error loading dashboard data</h3>
          <button
            onClick={fetchDashboardData}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <FiRefreshCw className="mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <div className="p-6">
        <div className="text-center">
          <FiAlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No affinities found</h3>
          <p className="mt-1 text-sm text-gray-500">Start by creating your first affinity</p>
          <button
            onClick={handleCreateAffinity}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <FiPlusCircle className="mr-2" />
            Create Affinity
          </button>
        </div>
      </div>
    );
  }

  const completionPercentage = Math.round((stats.completed / stats.total) * 100);
  const isFullyCompleted = completionPercentage === 100;

  return (
    <div className="h-full flex flex-col p-6 space-y-6 bg-gray-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">Overview of goals, metrics, and performance</p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-500">Last updated:</span>
          <span className="font-medium">2024-03-20</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiTrendingUp className="text-green-500 mr-2" />
              <h3 className="font-medium">Affinity Expansion Goal</h3>
            </div>
            <span className="text-sm text-green-600">+8%</span>
          </div>
          <p className="text-3xl font-bold mt-2">{completionPercentage}%</p>
          <p className="text-sm text-gray-500 mt-1">
            {stats.completed} of {stats.total} completed
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiPieChart className="text-blue-500 mr-2" />
              <h3 className="font-medium">Accuracy Goal Tracking</h3>
            </div>
            <span className="text-sm text-blue-600">+3%</span>
          </div>
          <p className="text-3xl font-bold mt-2">{goalData.accuracy.current}%</p>
          <p className="text-sm text-gray-500 mt-1">
            Target: {goalData.accuracy.target}%
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiTarget className="text-purple-500 mr-2" />
              <h3 className="font-medium">Completeness Goal</h3>
            </div>
            <span className="text-sm text-purple-600">+5%</span>
          </div>
          <p className="text-3xl font-bold mt-2">{goalData.completeness.current}%</p>
          <p className="text-sm text-gray-500 mt-1">
            Target: {goalData.completeness.target}%
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiActivity className="text-orange-500 mr-2" />
              <h3 className="font-medium">Overall Progress</h3>
            </div>
            <span className="text-sm text-orange-600">+4%</span>
          </div>
          <p className="text-3xl font-bold mt-2">{calculateOverallProgress()}%</p>
          <p className="text-sm text-gray-500 mt-1">
            {stats.inProgress} in progress, {stats.pending} pending
          </p>
        </div>
      </div>

      {isFullyCompleted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <FiCheckCircle className="text-green-500 mr-2" />
            <h3 className="text-lg font-medium text-green-800">Congratulations!</h3>
          </div>
          <p className="mt-1 text-sm text-green-700">All affinities completed</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
          {recentActivity.length > 0 ? (
            <ul className="space-y-4">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="flex items-start">
                  <div className="flex-shrink-0">
                    <FiClock className="text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">
                      {activity.type === 'affinity_created' && 'New affinity created'}
                      {activity.type === 'affinity_updated' && 'Affinity updated'}
                      {activity.type === 'affinity_completed' && 'Affinity completed'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No recent activity</p>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">My Favorites</h3>
          {favorites.length > 0 ? (
            <ul className="space-y-4">
              {favorites.map((favorite) => (
                <li
                  key={favorite.name}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => handleCollectionClick(favorite.name)}
                >
                  <div className="flex items-center">
                    <FiStar className="text-yellow-400 mr-2" />
                    <span className="text-sm font-medium">{favorite.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{favorite.affinities} affinities</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No favorites yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 