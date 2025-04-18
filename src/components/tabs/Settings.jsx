import React from 'react';

const Settings = () => {
  return (
    <div className="p-6">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Results Per Page:</label>
            <select className="border border-gray-300 rounded-lg px-3 py-2 w-full max-w-md focus:outline-none focus:border-blue-500">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input type="checkbox" className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" defaultChecked />
            </div>
            <div className="ml-3 text-sm">
              <label className="font-medium text-gray-700">Enable email notifications</label>
              <p className="text-gray-500">Receive updates when affinities change status</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;