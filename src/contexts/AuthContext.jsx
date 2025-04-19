import React, { createContext, useContext, useState, useEffect } from 'react';
import { trackFeatureUse } from '../utils/analytics';

// Create context
const AuthContext = createContext();

// Default user for development
const DEFAULT_USER = {
  id: '1',
  username: 'demo',
  email: 'demo@example.com',
  firstName: 'Demo',
  lastName: 'User',
  role: 'admin',
  permissions: ['read', 'write', 'admin']
};

// Mock roles and permissions
const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
  GUEST: 'guest'
};

const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  ADMIN: 'admin'
};

// Role-based permissions
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [PERMISSIONS.READ, PERMISSIONS.WRITE, PERMISSIONS.ADMIN],
  [ROLES.MANAGER]: [PERMISSIONS.READ, PERMISSIONS.WRITE],
  [ROLES.USER]: [PERMISSIONS.READ],
  [ROLES.GUEST]: []
};

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionExpiry, setSessionExpiry] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // In a real app, this would check for a stored token and validate it
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setSessionExpiry(Date.now() + SESSION_TIMEOUT);
        } else if (process.env.NODE_ENV === 'development') {
          // Use default user in development
          setUser(DEFAULT_USER);
          setSessionExpiry(Date.now() + SESSION_TIMEOUT);
        }
      } catch (err) {
        setError(err.message);
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Check session expiry
  useEffect(() => {
    if (!sessionExpiry) return;

    const checkSession = () => {
      if (Date.now() > sessionExpiry) {
        logout();
      }
    };

    const interval = setInterval(checkSession, 1000);
    return () => clearInterval(interval);
  }, [sessionExpiry]);

  // Login function
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would make an API call to authenticate
      // For now, we'll just simulate a delay and use the default user
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo purposes, accept any username/password
      const user = { ...DEFAULT_USER, username };
      setUser(user);
      setSessionExpiry(Date.now() + SESSION_TIMEOUT);
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      // Track login event
      trackFeatureUse('login', { username });
      
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setSessionExpiry(null);
    localStorage.removeItem('user');
    
    // Track logout event
    trackFeatureUse('logout');
  };

  // Refresh session
  const refreshSession = () => {
    if (user) {
      setSessionExpiry(Date.now() + SESSION_TIMEOUT);
    }
  };

  // Check if user has a specific permission
  const hasPermission = (permission) => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissions) => {
    if (!user) return false;
    return permissions.some(permission => user.permissions.includes(permission));
  };

  // Check if user has all of the specified permissions
  const hasAllPermissions = (permissions) => {
    if (!user) return false;
    return permissions.every(permission => user.permissions.includes(permission));
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    refreshSession,
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
    ROLES,
    PERMISSIONS
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component to protect routes based on permissions
export const withPermission = (WrappedComponent, requiredPermissions) => {
  return function WithPermissionComponent(props) {
    const { hasAllPermissions, user } = useAuth();
    
    if (!user) {
      return <div>Please log in to access this page.</div>;
    }
    
    if (!hasAllPermissions(requiredPermissions)) {
      return <div>You don't have permission to access this page.</div>;
    }
    
    return <WrappedComponent {...props} />;
  };
};

// Higher-order component to protect routes based on roles
export const withRole = (WrappedComponent, requiredRole) => {
  return function WithRoleComponent(props) {
    const { hasRole, user } = useAuth();
    
    if (!user) {
      return <div>Please log in to access this page.</div>;
    }
    
    if (!hasRole(requiredRole)) {
      return <div>You don't have the required role to access this page.</div>;
    }
    
    return <WrappedComponent {...props} />;
  };
}; 