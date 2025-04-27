import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { trackPageView } from './utils/analytics';
import ErrorBoundary from './components/common/ErrorBoundary';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AgentView from './components/tabs/AgentView';
import AffinityLibrary from './components/tabs/AffinityLibrary';
import ScoringExplorer from './components/tabs/ScoringExplorer';
import LifecycleTracker from './components/tabs/LifecycleTracker';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Header';
import AffinityCombination from './components/tabs/AffinityCombination';
import ImplementationGuide from './components/tabs/ImplementationGuide';
import ReportsAnalytics from './components/tabs/ReportsAnalytics';
import Settings from './components/tabs/Settings';
import HelpSupport from './components/tabs/HelpSupport';
import Login from './components/auth/Login';
import AnalyticsDashboard from './components/admin/AnalyticsDashboard';
import Workbench from './components/tabs/Workbench';
import { AffinityDataProvider } from './contexts/AffinityDataContext';
import './styles/agents.css';

// Protected route component
const ProtectedRoute = ({ children, requiredPermissions = [] }) => {
  const { user, loading, hasAllPermissions } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (requiredPermissions.length > 0 && !hasAllPermissions(requiredPermissions)) {
    return <div>You don't have permission to access this page.</div>;
  }
  
  return children;
};

// App layout component
const AppLayout = ({ children }) => {
  const { user, refreshSession } = useAuth();
  
  // Track page views
  useEffect(() => {
    const path = window.location.pathname;
    trackPageView(path);
  }, []);
  
  // Refresh session on user activity
  useEffect(() => {
    const handleActivity = () => {
      refreshSession();
    };
    
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [refreshSession]);
  
  return (
    <div className="min-h-screen bg-gray-100">
      {user && <Header />}
      <main className="container mx-auto px-4 pt-2 pb-8">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
    </div>
  );
};

// App component
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <AffinityDataProvider>
            <AppProvider>
              <div className="flex min-h-screen bg-gray-100">
                <div className="fixed inset-y-0 left-0 z-30 w-64 transition duration-300 transform bg-[#00355F] overflow-y-auto">
                  <Sidebar />
                </div>
                <div className="flex-1 ml-64">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    
                    <Route path="/" element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Dashboard />
                        </AppLayout>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Dashboard />
                        </AppLayout>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/affinities" element={
                      <ProtectedRoute requiredPermissions={['read']}>
                        <AppLayout>
                          <AffinityLibrary />
                        </AppLayout>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/scoring" element={
                      <ProtectedRoute requiredPermissions={['read']}>
                        <AppLayout>
                          <ScoringExplorer />
                        </AppLayout>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/agents" element={
                      <ProtectedRoute requiredPermissions={['read', 'write']}>
                        <AppLayout>
                          <AgentView />
                        </AppLayout>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/lifecycle-tracker" element={
                      <ProtectedRoute>
                        <AppLayout>
                          <LifecycleTracker />
                        </AppLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/combine" element={
                      <ProtectedRoute>
                        <AppLayout>
                          <AffinityCombination />
                        </AppLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/implementation" element={
                      <ProtectedRoute>
                        <AppLayout>
                          <ImplementationGuide />
                        </AppLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/reports" element={
                      <ProtectedRoute>
                        <AppLayout>
                          <ReportsAnalytics />
                        </AppLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Settings />
                        </AppLayout>
                      </ProtectedRoute>
                    } />
                    <Route path="/help" element={
                      <ProtectedRoute>
                        <AppLayout>
                          <HelpSupport />
                        </AppLayout>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/workbench" element={
                      <ProtectedRoute>
                        <AppLayout>
                          <Workbench />
                        </AppLayout>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="/analytics" element={
                      <ProtectedRoute permissions={['admin']}>
                        <AppLayout>
                          <AnalyticsDashboard />
                        </AppLayout>
                      </ProtectedRoute>
                    } />
                    
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </div>
              </div>
            </AppProvider>
          </AffinityDataProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;