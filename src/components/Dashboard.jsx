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
  FiPlus,
  FiEdit2
} from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ProgressTracker from './goals/ProgressTracker';
import AccuracyMetrics from './goals/AccuracyMetrics';
import { getDashboardStats, updateFavorites, updateRecentlyViewed } from '../services/apiService';
import SkeletonLoader from './common/SkeletonLoader';
import { useToast } from '../contexts/ToastContext';
import { layout, card, typography, spacing, badge, button } from '../styles/design-system';

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
      id: '1',
      name: 'Pet-Friendly',
      description: 'Properties that welcome pets with amenities or policies that accommodate animals.',
      score: '7.2/10',
      coverage: '72%',
      status: 'Active'
    },
    {
      id: '2',
      name: 'Romantic',
      description: 'Properties suitable for couples seeking a romantic experience.',
      score: '6.8/10',
      coverage: '65%',
      status: 'Active'
    },
    {
      id: '3',
      name: 'Family-Friendly',
      description: 'Properties that cater to families with children offering suitable amenities and activities.',
      score: '7.9/10',
      coverage: '81%',
      status: 'Active'
    },
    {
      id: '4',
      name: 'Luxury',
      description: 'High-end properties offering premium amenities, services, and experiences.',
      score: '8.2/10',
      coverage: '45%',
      status: 'Active'
    }
  ]);
  const [favoriteCollections, setFavoriteCollections] = useState([
    {
      id: 'summer-getaway',
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
      id: 'urban-exploration',
      name: 'Urban Exploration Bundle',
      affinities: [
        { name: 'Historical', description: 'Properties with historical significance' },
        { name: 'Luxury', description: 'High-end properties offering premium amenities' },
        { name: 'Romantic', description: 'Properties suitable for couples' }
      ],
      isFavorite: true
    },
    {
      id: 'family-trip',
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
      setLoading(true);
      try {
        const data = await getDashboardStats();
        if (!data) throw new Error('No data received');
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const handleAffinityClick = async (affinity) => {
    try {
      // Optimistically update recently viewed items
      const updatedItems = [affinity, ...recentlyViewedItems.filter(item => item.id !== affinity.id)].slice(0, 4);
      setRecentlyViewedItems(updatedItems);

      // Navigate to the affinity
      navigate('/affinities', { 
        state: { 
          selectedAffinityId: affinity.id,
          source: 'dashboard',
          view: 'library',  // Ensure library tab is active
          affinity: {  // Pass full affinity data to avoid loading delay
            id: affinity.id,
            name: affinity.name,
            description: affinity.description,
            score: parseFloat(affinity.score),
            coverage: parseInt(affinity.coverage),
            status: affinity.status
          }
        } 
      });

      // Update the backend
      await updateRecentlyViewed(affinity.id);
    } catch (error) {
      // Revert on failure
      setRecentlyViewedItems(recentlyViewedItems);
      showToast('error', 'Failed to update recently viewed items');
    }
  };

  const handleCollectionClick = (collection) => {
    try {
      console.log('Dashboard: Navigating to collection:', collection.name, 'ID:', collection.id);
      
      // Ensure the collection has an ID
      if (!collection.id) {
        console.error('Collection missing ID:', collection);
        showToast('error', 'Invalid collection data');
        return;
      }
      
      // Navigate to the collections view with the selected collection ID
      navigate('/affinities', { 
        state: { 
          view: 'collections',
          selectedCollectionId: collection.id 
        } 
      });
    } catch (error) {
      console.error('Error navigating to collection:', error);
      showToast('error', 'Failed to navigate to collection');
    }
  };

  const handleFavoriteClick = async (collection, e) => {
    e.stopPropagation(); // Prevent collection click from firing
    try {
      // Optimistically update UI
      const updatedCollections = favoriteCollections.map(c => 
        c.id === collection.id ? { ...c, isFavorite: !c.isFavorite } : c
      );
      setFavoriteCollections(updatedCollections);

      // Update backend
      await updateFavorites(collection.id, !collection.isFavorite);
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
      <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-50" data-testid="error-state">
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
          <FiTarget className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No affinities found</h3>
          <p className="mt-1 text-sm text-gray-500">Start by creating your first affinity</p>
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

  // Full completion state
  if (stats.total > 0 && stats.completed === stats.total) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="text-center">
          <FiCheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Congratulations!</h3>
          <p className="text-gray-600 mt-2">All affinities completed!</p>
          <div className="mt-4">
            <span className="text-3xl font-bold text-green-500">100%</span>
          </div>
        </div>
      </div>
    );
  }

  // Calculate completion percentage
  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className={`${layout.container} ${spacing.section}`}>
      {/* Header Section */}
      <div className={layout.flex.between}>
        <div>
          <h1 className={typography.h1}>Dashboard</h1>
          <p className={typography.small}>Overview of goals, metrics, and performance</p>
        </div>
        <div className={`${layout.flex.base} ${spacing.inline} ${typography.small}`}>
          <span className="text-gray-500">Last updated:</span>
          <span className="font-medium">{goalData.affinityExpansion.lastUpdated}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={`${layout.grid.base} ${layout.grid.cols4}`}>
        {/* Affinity Expansion Goal */}
        <div className={`${card.base} ${card.body}`}>
          <div className={layout.flex.between}>
            <div className={layout.flex.base}>
              <FiTrendingUp className="text-green-500 mr-2" />
              <h3 className={typography.h4}>Affinity Expansion Goal</h3>
            </div>
            <span className="text-sm text-green-600">+8%</span>
          </div>
          <p className="text-3xl font-bold mt-2">{goalData.affinityExpansion.current}%</p>
          <p className={typography.small}>Target: {goalData.affinityExpansion.target}%</p>
        </div>

        {/* Accuracy Goal */}
        <div className={`${card.base} ${card.body}`}>
          <div className={layout.flex.between}>
            <div className={layout.flex.base}>
              <FiTarget className="text-blue-500 mr-2" />
              <h3 className={typography.h4}>Accuracy Goal</h3>
            </div>
            <span className="text-sm text-blue-600">+3%</span>
          </div>
          <p className="text-3xl font-bold mt-2">{goalData.accuracy.current}%</p>
          <p className={typography.small}>Target: {goalData.accuracy.target}%</p>
        </div>

        {/* Completeness Score */}
        <div className={`${card.base} ${card.body}`}>
          <div className={layout.flex.between}>
            <div className={layout.flex.base}>
              <FiActivity className="text-purple-500 mr-2" />
              <h3 className={typography.h4}>Completeness Score</h3>
            </div>
            <span className="text-sm text-purple-600">+5%</span>
          </div>
          <p className="text-3xl font-bold mt-2">{goalData.completeness.current}%</p>
          <p className={typography.small}>Target: {goalData.completeness.target}%</p>
        </div>

        {/* Overall Progress */}
        <div className={`${card.base} ${card.body}`}>
          <div className={layout.flex.between}>
            <div className={layout.flex.base}>
              <FiPieChart className="text-indigo-500 mr-2" />
              <h3 className={typography.h4}>Overall Progress</h3>
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
      <div className={layout.grid.base}>
        {/* Progress Tracking */}
        <div className={`${card.base} ${card.body}`}>
          <h3 className={typography.h3}>Progress Tracking</h3>
          <ProgressTracker goal={goalData.affinityExpansion} />
        </div>

        {/* Accuracy Metrics */}
        <div className={`${card.base} ${card.body}`}>
          <h3 className={typography.h3}>Accuracy Metrics</h3>
          <AccuracyMetrics goal={goalData.accuracy} />
        </div>

        {/* Recently Viewed */}
        <div className={`${card.base} ${card.body}`}>
          <h3 className={typography.h3}>Recently Viewed</h3>
          <div className={`${layout.grid.base} ${layout.grid.cols4}`}>
            {recentlyViewedItems.map((item, index) => (
              <div 
                key={index}
                onClick={() => handleAffinityClick(item)}
                className={`${card.base} ${card.body} ${card.interactive} ${card.hover} border border-gray-200 hover:border-blue-500 hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between w-full">
                  <h4 className={typography.h4}>{item.name}</h4>
                  <span className={`${badge.base} ${badge.info}`}>
                    {item.status}
                  </span>
                </div>
                <p className={`${typography.body} mt-2`}>{item.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">
                    <span>Score: </span>
                    <span className="font-medium">{item.score}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span>Coverage: </span>
                    <span className="font-medium">{item.coverage}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Favorite Collections */}
        <div className={`${card.base} ${card.body}`}>
          <h3 className={typography.h3}>Favorite Collections</h3>
          <div className={`${layout.grid.base} ${layout.grid.cols4}`}>
            {favoriteCollections.map((collection, index) => (
              <div 
                key={index}
                onClick={() => handleCollectionClick(collection)}
                className={`${card.base} ${card.body} ${card.interactive} ${card.hover} border border-gray-200 hover:border-blue-500 hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between w-full">
                  <h4 className={typography.h4}>{collection.name}</h4>
                  <span className={`${badge.base} ${badge.info}`}>
                    Active
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {collection.affinities.map((affinity, i) => (
                    <span 
                      key={i}
                      className={`${badge.base} ${badge.neutral}`}
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
      {completionPercentage === 100 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 max-w-md text-center">
            <FiCheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold mt-4">Congratulations!</h2>
            <p className="text-gray-600 mt-2">All affinities completed!</p>
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