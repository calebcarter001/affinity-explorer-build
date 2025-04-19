import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiBook, 
  FiBarChart2, 
  FiActivity, 
  FiCpu, 
  FiLayers, 
  FiCode, 
  FiFileText,
  FiSettings,
  FiHelpCircle
} from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: <FiHome size={20} />, text: 'Dashboard' },
    { path: '/affinities', icon: <FiBook size={20} />, text: 'Affinity Library' },
    { path: '/scoring', icon: <FiBarChart2 size={20} />, text: 'Property Affinity Scores' },
    { path: '/lifecycle-tracker', icon: <FiActivity size={20} />, text: 'Lifecycle Tracker' },
    { path: '/agents', icon: <FiCpu size={20} />, text: 'Agent View' },
    { path: '/combine', icon: <FiLayers size={20} />, text: 'Affinity Combination' },
    { path: '/implementation', icon: <FiCode size={20} />, text: 'Implementation Guide' },
    { path: '/reports', icon: <FiFileText size={20} />, text: 'Reports & Analytics' },
  ];

  const bottomNavItems = [
    { path: '/settings', icon: <FiSettings size={20} />, text: 'Settings' },
    { path: '/help', icon: <FiHelpCircle size={20} />, text: 'Help & Support' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-6">
        <h1 className="text-white text-xl font-bold">Affinity Explorer</h1>
      </div>
      
      <nav className="flex-1 px-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-white/10 rounded-lg transition-colors ${
              location.pathname === item.path ? 'bg-white/20 text-white' : ''
            }`}
          >
            <span className="text-white">{item.icon}</span>
            <span>{item.text}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        {bottomNavItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-white/10 rounded-lg transition-colors ${
              location.pathname === item.path ? 'bg-white/20 text-white' : ''
            }`}
          >
            <span className="text-white">{item.icon}</span>
            <span>{item.text}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;