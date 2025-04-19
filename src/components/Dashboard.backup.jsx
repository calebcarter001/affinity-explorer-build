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
import { getDashboardStats, updateFavorites, updateRecentlyViewed } from '../services/apiService';
import SkeletonLoader from './common/SkeletonLoader';
import { useToast } from '../contexts/ToastContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const getStatusColor = (progress) => {
  if (progress >= 75) return 'bg-green-500';
  if (progress >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentlyViewedItems, setRecentlyViewedItems] = useState([
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
  ]);
  const [favoriteCollections, setFavoriteCollections] = useState([
    {
      name: 'Summer Getaway Collection',
      affinities: [
        { name: 'Beach Access', description: 'Properties with direct or convenient access to beaches' },
        { name: 'Family-Friendly', description: 'Properties that cater to families with children' },
        { name: 'Pet-Friendly', description: 'Properties that welcome pets' },
        { name: 'Luxury', description: 'High-end properties offering premium amenities' },
        { name: 'Nature Retreat', description: 'Properties situated in natural surroundings' }
      ],
      isFavorite: true
    },
    {
      name: 'Urban Exploration Bundle',
      affinities: [
        { name: 'Historical', description: 'Properties with historical significance' },
        { name: 'Luxury', description: 'High-end properties offering premium amenities' },
        { name: 'Romantic', description: 'Properties suitable for couples' }
      ],
      isFavorite: true
    },
    {
      name: 'Family Trip Essentials',
      affinities: [
        { name: 'Family-Friendly', description: 'Properties that cater to families with children' },
        { name: 'Pet-Friendly', description: 'Properties that welcome pets' },
        { name: 'Nature Retreat', description: 'Properties situated in natural surroundings' },
        { name: 'Beach Access', description: 'Properties with direct or convenient access to beaches' }
      ],
      isFavorite: true
    }
  ]);
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        showToast('error', 'Failed to fetch dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [showToast]);

  const handleAffinityClick = async (affinity) => {
    try {
      // Optimistically update recently viewed items
      const updatedItems = [affinity, ...recentlyViewedItems.filter(item => item.name !== affinity.name)].slice(0, 4);
      setRecentlyViewedItems(updatedItems);

      // Navigate to the affinity
      navigate('/affinities', { 
        state: { 
          selectedAffinity: affinity.name,
          source: 'dashboard'
        } 
      });

      // Update the backend
      await updateRecentlyViewed(affinity.name);
    } catch (error) {
      // Revert on failure
      setRecentlyViewedItems(recentlyViewedItems);
      showToast('error', 'Failed to update recently viewed items');
    }
  };

  const handleCollectionClick = async (collection) => {
    try {
      // Navigate to the collection
      navigate('/affinities', { 
        state: { 
          view: 'collections',
          selectedCollection: collection.name
        } 
      });
    } catch (error) {
      showToast('error', 'Failed to navigate to collection');
    }
  };

  const handleFavoriteClick = async (collection, e) => {
    e.stopPropagation(); // Prevent collection click from firing
    try {
      // Optimistically update UI
      const updatedCollections = favoriteCollections.map(c => 
        c.name === collection.name ? { ...c, isFavorite: !c.isFavorite } : c
      );
      setFavoriteCollections(updatedCollections);

      // Update backend
      await updateFavorites(collection.name, !collection.isFavorite);
      showToast('success', `Collection ${!collection.isFavorite ? 'added to' : 'removed from'} favorites`);
    } catch (error) {
      // Revert on failure
      setFavoriteCollections(favoriteCollections);
      showToast('error', 'Failed to update favorites');
    }
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

  if (!stats) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="text-center">
          <FiAlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Error loading dashboard data</h3>
          <p className="mt-1 text-sm text-gray-500">Please try again later or contact support if the issue persists.</p>
          <div className="mt-6">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiRefreshCw className="mr-2" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stats.total === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="text-center">
          <FiLayers className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No affinities found</h3>
          <p className="mt-1 text-sm text-gray-500">Start by creating your first affinity to begin tracking metrics.</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/affinities/new')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Affinity
            </button>
          </div>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Affinity Expansion Goal */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiTrendingUp className="text-green-500 mr-2" />
              <h3 className="font-medium">Affinity Expansion Goal</h3>
            </div>
            <span className="text-sm text-green-600">+8%</span>
          </div>
          <p className="text-3xl font-bold mt-2">{goalData.affinityExpansion.current}%</p>
          <p className="text-sm text-gray-500 mt-1">{goalData.affinityExpansion.current} of {goalData.affinityExpansion.target} completed</p>
        </div>

        {/* Accuracy Goal */}
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

        {/* Completeness Score */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiActivity className="text-purple-500 mr-2" />
              <h3 className="font-medium">Completeness Score</h3>
            </div>
            <span className="text-sm text-purple-600">+5%</span>
          </div>
          <p className="text-3xl font-bold mt-2">{goalData.completeness.current}%</p>
          <p className="text-sm text-gray-500 mt-1">Target: {goalData.completeness.target}%</p>
        </div>

        {/* Overall Progress */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiPieChart className="text-indigo-500 mr-2" />
              <h3 className="font-medium">Overall Progress</h3>
            </div>
            <span className="text-sm text-indigo-600">+6%</span>
          </div>
          <p className="text-3xl font-bold mt-2">{calculateOverallProgress()}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className={`h-2.5 rounded-full ${getStatusColor(calculateOverallProgress())}`}
              style={{ width: `${calculateOverallProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Tracking */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Progress Tracking</h3>
          <ProgressTracker goalData={goalData} />
        </div>

        {/* Accuracy Metrics */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Accuracy Metrics</h3>
          <AccuracyMetrics goalData={goalData} />
        </div>

        {/* Recently Viewed */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Recently Viewed</h3>
          <div className="space-y-4">
            {recentlyViewedItems.map((item, index) => (
              <div 
                key={index}
                onClick={() => handleAffinityClick(item)}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{item.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <div className="flex justify-between text-sm">
                  <span>Score: {item.score}</span>
                  <span>Coverage: {item.coverage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Favorite Collections */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Favorite Collections</h3>
          <div className="space-y-4">
            {favoriteCollections.map((collection, index) => (
              <div 
                key={index}
                onClick={() => handleCollectionClick(collection)}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{collection.name}</h4>
                  <button
                    onClick={(e) => handleFavoriteClick(collection, e)}
                    className={`p-1 rounded-full ${
                      collection.isFavorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-gray-500'
                    }`}
                  >
                    <FiStar className={collection.isFavorite ? 'fill-current' : ''} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {collection.affinities.map((affinity, i) => (
                    <span 
                      key={i}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                      title={affinity.description}
                    >
                      {affinity.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Celebration Modal for 100% completion */}
      {stats.completed === stats.total && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 max-w-md text-center">
            <FiCheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold mt-4">Congratulations!</h2>
            <p className="text-gray-600 mt-2">
              All affinities have been completed. Great job on reaching this milestone!
            </p>
            <button
              onClick={() => navigate('/reports')}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Detailed Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 