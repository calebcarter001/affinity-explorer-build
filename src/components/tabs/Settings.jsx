import React, { useState } from 'react';
import { FiSave, FiBell, FiEye, FiList } from 'react-icons/fi';
import SkeletonLoader from '../common/SkeletonLoader';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    defaultView: 'dashboard',
    resultsPerPage: '25',
    emailNotifications: true,
    darkMode: false,
    autoRefresh: true,
    refreshInterval: '5',
    language: 'en',
    timezone: 'UTC'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Show success message or handle error
    }, 1000);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-0">Settings</h2>
        <button 
          className="btn btn-primary flex items-center gap-2"
          onClick={handleSaveSettings}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <FiSave /> Save Changes
            </>
          )}
        </button>
      </div>
      
      {loading ? (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
          <SkeletonLoader type="card" count={3} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Preferences */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiEye /> User Preferences
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default View:</label>
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                  value={settings.defaultView}
                  onChange={(e) => handleSettingChange('defaultView', e.target.value)}
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="affinity-library">Affinity Library</option>
                  <option value="recently-viewed">Recently Viewed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Results Per Page:</label>
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                  value={settings.resultsPerPage}
                  onChange={(e) => handleSettingChange('resultsPerPage', e.target.value)}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language:</label>
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timezone:</label>
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                  <option value="GMT">GMT</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications & Display */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiBell /> Notifications & Display
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input 
                    type="checkbox" 
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-gray-700">Email Notifications</label>
                  <p className="text-gray-500">Receive updates when affinities change status</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input 
                    type="checkbox" 
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={settings.darkMode}
                    onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-gray-700">Dark Mode</label>
                  <p className="text-gray-500">Enable dark mode for better visibility in low-light conditions</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input 
                    type="checkbox" 
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    checked={settings.autoRefresh}
                    onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-gray-700">Auto Refresh</label>
                  <p className="text-gray-500">Automatically refresh data at specified intervals</p>
                </div>
              </div>

              {settings.autoRefresh && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Refresh Interval (minutes):</label>
                  <select 
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                    value={settings.refreshInterval}
                    onChange={(e) => handleSettingChange('refreshInterval', e.target.value)}
                  >
                    <option value="1">1 minute</option>
                    <option value="5">5 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;