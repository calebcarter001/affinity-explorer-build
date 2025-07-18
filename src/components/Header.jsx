import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBell, FiHelpCircle, FiUser, FiLogOut, FiSettings, FiDownload } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { trackFeatureUse } from '../utils/analytics';

const Header = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const handleLogout = () => {
    logout();
    showToast('You have been logged out', 'info');
    navigate('/login');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      trackFeatureUse('view_notifications');
    }
  };

  const handleNotificationClick = (notification) => {
    // Handle notification click based on type/content
    showToast(notification.message, 'info');
    // Remove the notification
    setNotifications(notifications.filter(n => n.id !== notification.id));
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/dashboard"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/affinities"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Affinities
              </Link>
              <Link
                to="/scoring"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Affinity Scores
              </Link>
              <Link
                to="/workbench"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Workbench
              </Link>
              <Link
                to="/agents"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Affinity Agents
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="relative">
                <button
                  type="button"
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={toggleNotifications}
                >
                  <span className="sr-only">View notifications</span>
                  <FiBell className="h-6 w-6" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {showNotifications && notifications.length > 0 && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="notifications-menu">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                        <div className="font-medium">Notifications</div>
                      </div>
                      {notifications.map((notification) => (
                        <button
                          key={notification.id}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-start"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex-1">
                            <p className="font-medium">{notification.message}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(notification.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {showNotifications && notifications.length === 0 && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="p-4 text-sm text-gray-700 text-center">
                      No new notifications
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="ml-3 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  trackFeatureUse('export_data_click');
                  navigate('/settings?tab=export');
                }}
                title="Export Data Configuration"
              >
                <span className="sr-only">Export data configuration</span>
                <FiDownload className="h-6 w-6" />
              </button>

              <button
                type="button"
                className="ml-3 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  trackFeatureUse('help_icon_click');
                  navigate('/help');
                }}
              >
                <span className="sr-only">View help</span>
                <FiHelpCircle className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={toggleUserMenu}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <FiUser className="h-5 w-5 text-blue-600" />
                    </div>
                  </button>
                </div>

                {showUserMenu && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                  >
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                      <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                      <div className="text-gray-500 truncate">{user?.email}</div>
                    </div>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      role="menuitem"
                      tabIndex="-1"
                      id="user-menu-item-0"
                    >
                      <FiSettings className="mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      role="menuitem"
                      tabIndex="-1"
                      id="user-menu-item-1"
                    >
                      <FiLogOut className="mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;