import React from 'react';

const Settings = () => (
  <div id="settings-tab" className="tab-content">
    <h2 className="text-2xl font-bold mb-6">Settings</h2>
    
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">User Preferences</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Default View:</label>
          <select className="border border-gray-300 rounded-lg px-3 py-2 w-full max-w-md focus:outline-none focus:border-blue-500">
            <option>Dashboard</option>
            <option>Affinity Library</option>
            <option>Recently Viewed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Theme:</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input type="radio" name="theme" className="mr-2" defaultChecked />
              <span>Light</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="theme" className="mr-2" />
              <span>Dark</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="theme" className="mr-2" />
              <span>System</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notifications:</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span>Email notifications for affinity updates</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span>In-app notifications</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Weekly digest</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold mb-4">API Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API Key:</label>
            <div className="flex gap-2">
              <input 
                type="password" 
                value="••••••••••••••••"
                readOnly
                className="border border-gray-300 rounded-lg px-3 py-2 w-full max-w-md focus:outline-none focus:border-blue-500 bg-gray-50"
              />
              <button className="px-4 py-2 text-expedia-blue hover:bg-gray-50 rounded-lg focus:outline-none">
                Show
              </button>
              <button className="px-4 py-2 text-expedia-blue hover:bg-gray-50 rounded-lg focus:outline-none">
                Copy
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rate Limit:</label>
            <select className="border border-gray-300 rounded-lg px-3 py-2 w-full max-w-md focus:outline-none focus:border-blue-500">
              <option>1,000 requests/minute</option>
              <option>5,000 requests/minute</option>
              <option>10,000 requests/minute</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="px-6 py-2 bg-expedia-blue text-white rounded-lg hover:bg-opacity-90 focus:outline-none">
          Save Changes
        </button>
      </div>
    </div>
  </div>
);

export default Settings;