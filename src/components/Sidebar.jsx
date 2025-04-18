import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: 'tachometer-alt', text: 'Dashboard' },
    { path: '/affinity-library', icon: 'book', text: 'Affinity Library' },
    { path: '/scoring-explorer', icon: 'chart-bar', text: 'Affinity Scores' },
    { path: '/lifecycle-tracker', icon: 'project-diagram', text: 'Lifecycle Tracker' },
    { path: '/agent-view', icon: 'brain', text: 'Agent View' },
    { path: '/combine', icon: 'layer-group', text: 'Affinity Combination' },
    { path: '/implementation', icon: 'code', text: 'Implementation Guide' },
    { path: '/reports', icon: 'file-alt', text: 'Reports & Analytics' },
  ];

  const bottomNavItems = [
    { path: '/settings', icon: 'cog', text: 'Settings' },
    { path: '/help', icon: 'question-circle', text: 'Help & Support' },
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
            <i className={`fas fa-${item.icon} w-5`}></i>
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
            <i className={`fas fa-${item.icon} w-5`}></i>
            <span>{item.text}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;