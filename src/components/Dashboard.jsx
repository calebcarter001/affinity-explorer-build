import React, { useEffect, useState, useMemo, useCallback } from 'react';
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
import { getDashboardStats, updateFavorites, updateRecentlyViewed, getCollections, updateCollection, clearCollectionsCache, getDashboardConfig } from '../services/apiService';
import SkeletonLoader from './common/SkeletonLoader';
import { useToast } from '../contexts/ToastContext';
import { layout, card, typography, spacing, badge, button } from '../styles/design-system';
import { useAuth } from '../contexts/AuthContext';
import AffinityCard from './common/AffinityCard';
import DashboardSummaryCard from './common/DashboardSummaryCard';
import { useAppContext } from '../contexts/AppContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const getStatusColor = (progress) => {
  if (progress >= 75) return 'bg-green-500';
  if (progress >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

// Card for Recently Viewed Affinity
const RecentlyViewedCard = React.memo(({ 
  item, 
  onClick, 
  userCollections, 
  onAddToCollection 
}) => {
  console.log('RecentlyViewedCard item:', item);
  return (
    <AffinityCard
      affinity={item}
      onClick={() => onClick(item)}
      userCollections={userCollections}
      onAddToCollection={onAddToCollection}
    />
  );
});

// Card for Favorite Collection
const FavoriteCollectionCard = React.memo(({ collection, onClick }) => (
  <div
    onClick={() => onClick(collection)}
    className={`${card.base} ${card.body} ${card.interactive} ${card.hover} border border-gray-200 hover:border-blue-500 hover:-translate-y-1 cursor-pointer h-[120px] flex flex-col justify-between`}
    tabIndex={0}
    role="button"
    aria-label={`View collection ${collection.name}`}
    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick(collection); }}
  >
    <div className="flex items-center justify-between w-full mb-4">
      <h4 className={typography.h4}>{collection.name}</h4>
    </div>
    <div className="flex justify-between items-end">
      <div className="flex flex-wrap gap-2">
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
      <span className="text-xs text-gray-500 ml-2">{collection.affinities.length}</span>
    </div>
  </div>
));

const statMeta = {
  expansion: {
    title: 'Expansion Goal',
    icon: <FiTrendingUp className="text-green-600 mr-2" size={22} />,
  },
  accuracy: {
    title: 'Accuracy Goal',
    icon: <FiTarget className="text-blue-600 mr-2" size={22} />,
  },
  completeness: {
    title: 'Completeness Score',
    icon: <FiActivity className="text-purple-600 mr-2" size={22} />,
  },
  overall: {
    title: 'Overall Progress',
    icon: <FiPieChart className="text-red-600 mr-2" size={22} />,
  },
};

function calculateOverallProgress(dashboardConfig) {
  const weights = {
    affinityExpansion: 0.4,
    accuracy: 0.3,
    completeness: 0.3
  };
  const progress = {
    affinityExpansion: (dashboardConfig.affinityExpansion.current / dashboardConfig.affinityExpansion.target) * 100,
    accuracy: (dashboardConfig.accuracy.current / dashboardConfig.accuracy.target) * 100,
    completeness: (dashboardConfig.completeness.current / dashboardConfig.completeness.target) * 100
  };
  return Math.round(
    progress.affinityExpansion * weights.affinityExpansion +
    progress.accuracy * weights.accuracy +
    progress.completeness * weights.completeness
  );
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const { recentlyViewed, addToRecentlyViewed, affinities } = useAppContext();
  // Helper to get canonical affinity by ID
  const getCanonicalAffinity = (id) => {
    // Normalize the ID to ensure consistent format
    const normalizedId = id.startsWith('aff') ? id : `aff${id}`;
    return (affinities || []).find(a => String(a.id) === String(normalizedId));
  };
  const [loading, setLoading] = useState(true);
  const [dashboardConfig, setDashboardConfig] = useState(null);
  const [userCollections, setUserCollections] = useState([]);
  const [selectedStat, setSelectedStat] = useState('expansion'); // 'expansion', 'accuracy', 'completeness', 'overall'
  const RECENTLY_VIEWED_PER_PAGE = 4;
  const [recentlyViewedPage, setRecentlyViewedPage] = useState(1);
  const recentlyViewedTotalPages = Math.ceil(recentlyViewed.length / RECENTLY_VIEWED_PER_PAGE);
  const paginatedRecentlyViewed = recentlyViewed.slice(
    (recentlyViewedPage - 1) * RECENTLY_VIEWED_PER_PAGE,
    recentlyViewedPage * RECENTLY_VIEWED_PER_PAGE
  );

  // Pagination for Your Collections
  const COLLECTIONS_PER_PAGE = 4;
  const [collectionsPage, setCollectionsPage] = useState(1);
  const collectionsTotalPages = Math.ceil(userCollections.length / COLLECTIONS_PER_PAGE);
  const paginatedUserCollections = userCollections.slice(
    (collectionsPage - 1) * COLLECTIONS_PER_PAGE,
    collectionsPage * COLLECTIONS_PER_PAGE
  );

  useEffect(() => {
    const fetchDashboardConfig = async () => {
      setLoading(true);
      try {
        const config = await getDashboardConfig();
        // Type and error checking
        if (!config || typeof config !== 'object') throw new Error('Invalid dashboard config');
        if (!config.affinityExpansion || !config.accuracy || !config.completeness) throw new Error('Missing goal data');
        setDashboardConfig(config);
      } catch (err) {
        console.error('Failed to fetch dashboard config:', err);
        setDashboardConfig(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardConfig();
  }, []);

  useEffect(() => {
    const fetchUserCollections = async () => {
      if (!user?.email) return;
      try {
        const collections = await getCollections(user.email);
        console.log('Fetched collections:', collections);
        setUserCollections(collections);
      } catch (err) {
        showToast.error('Failed to load collections');
        console.error('Error loading collections:', err);
      }
    };
    fetchUserCollections();
  }, [user, showToast]);

  const handleAffinityClick = (affinity) => {
    addToRecentlyViewed(affinity);
    
    // Ensure consistent ID format
    const normalizedId = affinity.id.startsWith('aff') ? affinity.id : `aff${affinity.id}`;
    
    navigate('/affinities', {
      state: {
        view: 'library',
        selectedAffinityId: normalizedId
      }
    });
  };

  const handleCollectionClick = (collection) => {
    try {
      if (!collection.id) {
        showToast('error', 'Invalid collection data');
        return;
      }
      
      navigate('/affinities', { 
        state: { 
          view: 'collections',
          selectedCollectionId: collection.id 
        } 
      });
    } catch (error) {
      showToast('error', 'Failed to navigate to collection');
    }
  };

  const handleAddToCollection = async (collection, affinity) => {
    setUserCollections(prev => prev.map(c =>
      c.id === collection.id && !c.affinities.some(a => a.id === affinity.id)
        ? { ...c, affinities: [...c.affinities, affinity] }
        : c
    ));
    try {
      const updatedAffinityIds = [...collection.affinities.map(a => a.id), affinity.id];
      await updateCollection(collection.id, { affinityIds: updatedAffinityIds }, user.email);
      showToast.success(`Added to collection: ${collection.name}`);
      clearCollectionsCache();
    } catch (err) {
      setUserCollections(prev => prev.map(c =>
        c.id === collection.id
          ? { ...c, affinities: c.affinities.filter(a => a.id !== affinity.id) }
          : c
      ));
      showToast.error('Failed to add to collection');
    }
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

  if (!dashboardConfig) {
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

  if (dashboardConfig.total === 0) {
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
  if (dashboardConfig.total > 0 && dashboardConfig.completed === dashboardConfig.total) {
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
  const completionPercentage = dashboardConfig.total > 0 ? Math.round((dashboardConfig.completed / dashboardConfig.total) * 100) : 0;

  console.log('Recently Viewed Items:', recentlyViewed);
  console.log('User Collections:', userCollections);

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
          <span className="font-medium">{dashboardConfig.affinityExpansion.lastUpdated}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid
        dashboardConfig={dashboardConfig}
        calculateOverallProgress={() => calculateOverallProgress(dashboardConfig)}
        selectedStat={selectedStat}
        setSelectedStat={setSelectedStat}
      />

      {/* Main Content Grid */}
      <div className="mt-6">
        <div className="flex items-center mb-3">
          {statMeta[selectedStat].icon}
          <h2 className="text-xl font-bold text-gray-900">{statMeta[selectedStat].title}</h2>
        </div>
        {selectedStat === 'accuracy' ? (
          <AccuracyMetrics goal={dashboardConfig.accuracy} />
        ) : (
          <ProgressTracker
            goal={
              selectedStat === 'expansion'
                ? dashboardConfig.affinityExpansion
                : selectedStat === 'completeness'
                ? dashboardConfig.completeness
                : dashboardConfig.affinityExpansion // fallback for 'overall', can be customized
            }
          />
        )}
      </div>
      <div className={layout.grid.base}>
        {/* Recently Viewed */}
        <div className={`${card.base} compact ${card.body} py-3 px-3`}>
          <h3 className="text-base font-semibold mb-2">Recently Viewed</h3>
          <div className={`${layout.grid.base} ${layout.grid.cols4} gap-2`}>
            {paginatedRecentlyViewed.map((item, index) => {
              const canonical = getCanonicalAffinity(item.id);
              if (!canonical) return null; // skip if not found
              return (
                <RecentlyViewedCard
                  key={canonical.id || index}
                  item={canonical}
                  onClick={handleAffinityClick}
                  userCollections={userCollections}
                  onAddToCollection={handleAddToCollection}
                />
              );
            })}
          </div>
          {/* Pagination controls for recently viewed */}
          {recentlyViewed.length > RECENTLY_VIEWED_PER_PAGE && (
            <div className="flex justify-center mt-2">
              <button onClick={() => setRecentlyViewedPage(p => Math.max(1, p-1))} disabled={recentlyViewedPage === 1} className="px-2 py-1 mx-1 rounded bg-gray-100">Prev</button>
              <span className="px-2">Page {recentlyViewedPage} of {recentlyViewedTotalPages}</span>
              <button onClick={() => setRecentlyViewedPage(p => Math.min(recentlyViewedTotalPages, p+1))} disabled={recentlyViewedPage === recentlyViewedTotalPages} className="px-2 py-1 mx-1 rounded bg-gray-100">Next</button>
            </div>
          )}
        </div>
        {/* Your Collections */}
        <div className={`${card.base} compact ${card.body} py-3 px-3`}>
          <h3 className="text-base font-semibold mb-2">Your Collections</h3>
          <div className={`${layout.grid.base} ${layout.grid.cols4}`}> 
            {paginatedUserCollections.length === 0 ? (
              <div className="text-gray-500 col-span-4">No collections found.</div>
            ) : (
              paginatedUserCollections.map((collection, index) => (
                <FavoriteCollectionCard
                  key={collection.id || index}
                  collection={{
                    ...collection,
                    affinities: (collection.affinities || []).map(a => getCanonicalAffinity(a.id)).filter(Boolean)
                  }}
                  onClick={handleCollectionClick}
                  compact
                />
              ))
            )}
          </div>
          {/* Pagination controls for collections */}
          {userCollections.length > COLLECTIONS_PER_PAGE && (
            <div className="flex justify-center mt-2">
              <button onClick={() => setCollectionsPage(p => Math.max(1, p-1))} disabled={collectionsPage === 1} className="px-2 py-1 mx-1 rounded bg-gray-100">Prev</button>
              <span className="px-2">Page {collectionsPage} of {collectionsTotalPages}</span>
              <button onClick={() => setCollectionsPage(p => Math.min(collectionsTotalPages, p+1))} disabled={collectionsPage === collectionsTotalPages} className="px-2 py-1 mx-1 rounded bg-gray-100">Next</button>
            </div>
          )}
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

// Stats Grid Subcomponent
const StatsGrid = React.memo(({ dashboardConfig, calculateOverallProgress, selectedStat, setSelectedStat }) => (
  <div className="flex flex-row gap-4 w-full justify-center items-center">
    <DashboardSummaryCard
      icon={<FiTrendingUp />}
      title="Expansion Goal"
      percentChange={8}
      currentValue={dashboardConfig.affinityExpansion.current}
      targetValue={50}
      targetLabel="Target: 50 Affinities"
      color="green"
      selected={selectedStat === 'expansion'}
      onClick={() => setSelectedStat('expansion')}
      percentChangeSmall
    />
    <DashboardSummaryCard
      icon={<FiTarget />}
      title="Accuracy Goal"
      percentChange={3}
      currentValue={dashboardConfig.accuracy.current}
      targetValue={75}
      targetLabel="Target: 75%"
      color="blue"
      selected={selectedStat === 'accuracy'}
      onClick={() => setSelectedStat('accuracy')}
      percentChangeSmall
    />
    <DashboardSummaryCard
      icon={<FiActivity />}
      title="Completeness Score"
      percentChange={5}
      currentValue={dashboardConfig.completeness.current}
      targetValue={85}
      targetLabel="Target: 85%"
      color="purple"
      selected={selectedStat === 'completeness'}
      onClick={() => setSelectedStat('completeness')}
      percentChangeSmall
    />
    <DashboardSummaryCard
      icon={<FiPieChart />}
      title="Overall Progress"
      percentChange={6}
      currentValue={calculateOverallProgress(dashboardConfig)}
      targetValue={100}
      targetLabel="Target: 100"
      color="red"
      selected={selectedStat === 'overall'}
      onClick={() => setSelectedStat('overall')}
      percentChangeSmall
    />
  </div>
));

// Main Content Grid Subcomponent
const MainContentGrid = React.memo(({
  layout, card, typography, ProgressTracker, dashboardConfig, AccuracyMetrics, recentlyViewedItems, handleAffinityClick, handleCollectionClick, userCollections, handleAddToCollection
}) => (
  <div className={layout.grid.base}>
    {/* Progress Tracking */}
    <div className={`${card.base} compact ${card.body} py-3 px-3`}>
      <h3 className="text-base font-semibold mb-2">Progress Tracking</h3>
      <ProgressTracker goal={dashboardConfig.affinityExpansion} compact />
    </div>
    {/* Accuracy Metrics */}
    <div className={`${card.base} compact ${card.body} py-2 px-3`} style={{ minHeight: 100 }}>
      <AccuracyMetrics goal={dashboardConfig.accuracy} compact />
    </div>
    {/* Recently Viewed */}
    <div className={`${card.base} compact ${card.body} py-3 px-3`}>
      <h3 className="text-base font-semibold mb-2">Recently Viewed</h3>
      <div className={`${layout.grid.base} ${layout.grid.cols4}`}>
        {recentlyViewedItems.map((item, index) => {
          const score = typeof item.score === 'string' ? parseFloat(item.score) : item.score;
          const coverage = typeof item.coverage === 'string' ? parseFloat(item.coverage) : item.coverage;
          const affinity = { ...item, score, coverage };
          return (
            <AffinityCard
              key={item.id || index}
              affinity={affinity}
              userCollections={userCollections}
              onAddToCollection={handleAddToCollection}
              onClick={() => handleAffinityClick(affinity)}
              compact
            />
          );
        })}
      </div>
    </div>
    {/* Your Collections */}
    <div className={`${card.base} compact ${card.body} py-3 px-3`}>
      <h3 className="text-base font-semibold mb-2">Your Collections</h3>
      <div className={`${layout.grid.base} ${layout.grid.cols4}`}>
        {userCollections.length === 0 ? (
          <div className="text-gray-500 col-span-4">No collections found.</div>
        ) : (
          userCollections.map((collection, index) => (
            <FavoriteCollectionCard
              key={collection.id || index}
              collection={{
                ...collection,
                affinities: (collection.affinities || []).map(a => getCanonicalAffinity(a.id)).filter(Boolean)
              }}
              onClick={handleCollectionClick}
              compact
            />
          ))
        )}
      </div>
    </div>
  </div>
));

export default Dashboard; 