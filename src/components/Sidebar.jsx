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
  FiHelpCircle,
  FiGrid,
  FiMap,
  FiEdit3,
  FiNavigation,
  FiAward,
  FiHeart,
  FiTool
} from 'react-icons/fi';
import { FEATURE_FLAGS } from '../config/appConfig';

const Sidebar = () => {
  const location = useLocation();

  const baseNavItems = [
    { path: '/', icon: <FiHome size={20} />, text: 'Dashboard' },
    { 
      path: '/affinities', 
      icon: <FiBook size={20} />, 
      text: 'Affinity Library',
      subItems: [
        { path: '/affinity-configuration-studio', icon: <FiTool size={18} />, text: 'Configuration Studio' }
      ]
    },
    { path: '/scoring', icon: <FiBarChart2 size={20} />, text: 'Property Affinity Scores' },
    { path: '/destination-insights', icon: <FiMap size={20} />, text: 'Destination Insights' },
    { path: '/last-mile', icon: <FiNavigation size={20} />, text: 'Last Mile Insights' },
    { path: '/sentiment-insights', icon: <FiHeart size={20} />, text: 'Sentiment Insights' },
    ...(FEATURE_FLAGS.CONTENT_STUDIO_ENABLED ? [{ 
      path: '/content-studio', 
      icon: <FiEdit3 size={20} />, 
      text: 'Content Studio',
      subItems: [
        { path: '/content-studio/concept-relationship-panel', icon: <FiLayers size={18} />, text: 'Concept Relationship Panel' }
      ]
    }] : []),
    { path: '/lifecycle-tracker', icon: <FiActivity size={20} />, text: 'Lifecycle Tracker' },
    { path: '/agents', icon: <FiCpu size={20} />, text: 'Agent View' },
    { path: '/combine', icon: <FiLayers size={20} />, text: 'Affinity Combination' },
    { path: '/workbench', icon: <FiGrid size={20} />, text: 'Workbench' },
    { path: '/scorecard', icon: <FiAward size={20} />, text: 'Affinity Scorecard' },
    { path: '/implementation', icon: <FiCode size={20} />, text: 'Implementation Guide' },
    { path: '/reports', icon: <FiFileText size={20} />, text: 'Reports & Analytics' },
  ];

  const navItems = baseNavItems;

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
          <div key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-white/10 rounded-lg transition-colors ${
                location.pathname === item.path ? 'bg-white/20 text-white' : ''
              }`}
            >
              <span className="text-white">{item.icon}</span>
              <span>{item.text}</span>
            </Link>
            {item.subItems && (
              <div className="ml-6 mt-1">
                {item.subItems.map((subItem) => (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    className={`flex items-center space-x-3 px-4 py-2 text-gray-400 hover:bg-white/10 rounded-lg transition-colors text-sm ${
                      location.pathname === subItem.path ? 'bg-white/20 text-white' : ''
                    }`}
                  >
                    <span className="text-white">{subItem.icon}</span>
                    <span>{subItem.text}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
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