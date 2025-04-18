import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUp, FiCheck, FiBarChart2 } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useAppContext } from '../../contexts/AppContext';
import { getDashboardStats } from '../../services/apiService';
import SkeletonLoader from '../common/SkeletonLoader';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { recentlyViewed } = useAppContext();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
        setChartData({
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Coverage',
            data: [65, 59, 80, 81, 56, 55],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: (context) => `Coverage: ${context.raw} properties`
        }
      }
    },
    scales: {
      y: {
        min: 15,
        max: 55,
        ticks: {
          stepSize: 5,
          callback: (value) => `${value} properties`
        },
        title: {
          display: true,
          text: 'Properties with Affinity Scores'
        }
      },
      x: {
        title: {
          display: true,
          text: '2024'
        }
      }
    }
  };
  
  if (loading) {
    return (
      <div className="p-6">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SkeletonLoader type="stats" count={4} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Affinity Growth Chart */}
          <div className="lg:col-span-2">
            <SkeletonLoader type="chart" count={1} />
          </div>
          
          {/* My Favorites */}
          <div>
            <SkeletonLoader type="list" count={1} />
          </div>
        </div>
        
        {/* Recently Viewed */}
        <div className="mt-6">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
          <SkeletonLoader type="card" count={2} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-5xl font-bold text-blue-500 mb-2">{stats.totalAffinities}</div>
          <div className="text-gray-600">Total Affinities</div>
          <div className="text-green-500 text-sm mt-2">+4 in the last quarter</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-5xl font-bold text-blue-500 mb-2">{stats.avgCoverage}%</div>
          <div className="text-gray-600">Avg Coverage</div>
          <div className="text-green-500 text-sm mt-2">+12% vs last year</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-5xl font-bold text-blue-500 mb-2">{stats.implementationRate}%</div>
          <div className="text-gray-600">Implementation Rate</div>
          <div className="text-green-500 text-sm mt-2">+8% this quarter</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-5xl font-bold text-blue-500 mb-2">{stats.reuseRate}%</div>
          <div className="text-gray-600">Reuse Rate</div>
          <div className="text-green-500 text-sm mt-2">+5% vs target</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Affinity Growth Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Affinity Coverage</h2>
            <div className="h-80">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
        
        {/* My Favorites */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">My Favorites</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">Summer Getaway Collection</h3>
                <div className="text-sm text-gray-600">5 affinities</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">Urban Exploration Bundle</h3>
                <div className="text-sm text-gray-600">3 affinities</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">Family Trip Essentials</h3>
                <div className="text-sm text-gray-600">4 affinities</div>
              </div>
              <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                + Create New Collection
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recently Viewed */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Recently Viewed</h2>
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">Pet-Friendly</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Properties that welcome pets with amenities or policies that accommodate animals.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <span className="font-semibold">Score:</span> 7.2/10
                  </div>
                  <div>
                    <span className="font-semibold">Coverage:</span> 72%
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <FiCheck className="mr-1" /> Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">Family-Friendly</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Properties designed for families with child-friendly amenities and safety features.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <span className="font-semibold">Score:</span> 8.5/10
                  </div>
                  <div>
                    <span className="font-semibold">Coverage:</span> 85%
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <FiCheck className="mr-1" /> Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">Romantic</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Properties perfect for couples with intimate settings and romantic amenities.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <span className="font-semibold">Score:</span> 6.8/10
                  </div>
                  <div>
                    <span className="font-semibold">Coverage:</span> 64%
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <FiCheck className="mr-1" /> Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Quick Links</h2>
        <div className="space-y-2">
          <Link to="/library" className="block text-blue-500 hover:underline">→ Browse All Affinities</Link>
          <Link to="/scoring" className="block text-blue-500 hover:underline">→ Explore Property Scores</Link>
          <Link to="/guide" className="block text-blue-500 hover:underline">→ Implementation Guide</Link>
          <Link to="/reports" className="block text-blue-500 hover:underline">→ Generate Reports</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;