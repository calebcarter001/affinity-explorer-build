import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { trackPageView } from './utils/analytics';
import ErrorBoundary from './components/common/ErrorBoundary';
import Sidebar from './components/Sidebar';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Header';
import Login from './components/auth/Login';
import { AffinityDataProvider } from './contexts/AffinityDataContext';
import './styles/agents.css';

// Lazy load page components
const Dashboard = lazy(() => import('./components/Dashboard'));
const AffinityScorecard = lazy(() => import('./components/tabs/AffinityScorecard'));
const AgentView = lazy(() => import('./components/tabs/AgentView'));
const AffinityLibrary = lazy(() => import('./components/tabs/AffinityLibrary'));
const ScoringExplorer = lazy(() => import('./components/tabs/ScoringExplorer'));
const ContentStudio = lazy(() => import('./components/tabs/ContentStudio'));
const LifecycleTracker = lazy(() => import('./components/tabs/LifecycleTracker'));
const AffinityCombination = lazy(() => import('./components/tabs/AffinityCombination'));
const ImplementationGuide = lazy(() => import('./components/tabs/ImplementationGuide'));
const ReportsAnalytics = lazy(() => import('./components/tabs/ReportsAnalytics'));
const Settings = lazy(() => import('./pages/Settings'));
const HelpSupport = lazy(() => import('./components/tabs/HelpSupport'));
const AnalyticsDashboard = lazy(() => import('./components/admin/AnalyticsDashboard'));
const Workbench = lazy(() => import('./components/tabs/Workbench'));
const LastMileView = lazy(() => import('./components/tabs/LastMileView'));
const SentimentInsights = lazy(() => import('./components/tabs/SentimentInsights'));
const ConceptRelationshipInsights = lazy(() => import('./components/crp/ConceptRelationshipPanel'));
const AffinityConfigurationStudio = lazy(() => import('./components/tabs/AffinityConfigurationStudio'));
const DestinationInsightsPage = lazy(() => import('./pages/DestinationInsightsPage'));

// Simple loading fallback component - replace with your actual spinner if you have one
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <p>Loading page...</p>
    {/* Or use a spinner component: <LoadingSpinner /> */}
  </div>
);

// Protected route component
const ProtectedRoute = ({ children, requiredPermissions = [] }) => {
  const { user, loading, hasAllPermissions } = useAuth();
  
  if (loading) {
    return <div>Loading user...</div>; // Or a proper loading indicator
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
                  <Suspense fallback={<LoadingFallback />}>
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
                      
                      <Route path="/scorecard" element={
                        <ProtectedRoute requiredPermissions={['read']}>
                          <AppLayout>
                            <AffinityScorecard />
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
                      
                      <Route path="/destination-insights" element={
                        <ProtectedRoute requiredPermissions={['read']}>
                          <AppLayout>
                            <DestinationInsightsPage />
                          </AppLayout>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/content-studio" element={
                        <ProtectedRoute requiredPermissions={['read', 'write']}>
                          <AppLayout>
                            <ContentStudio />
                          </AppLayout>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/content-studio/concept-relationship-panel" element={
                        <ProtectedRoute requiredPermissions={['read', 'write']}>
                          <AppLayout>
                            <ConceptRelationshipInsights />
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
                      
                      <Route path="/last-mile" element={
                        <ProtectedRoute>
                          <AppLayout>
                            <LastMileView />
                          </AppLayout>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/sentiment-insights" element={
                        <ProtectedRoute requiredPermissions={['read']}>
                          <AppLayout>
                            <SentimentInsights />
                          </AppLayout>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/affinity-configuration-studio" element={
                        <ProtectedRoute requiredPermissions={['read']}>
                          <AppLayout>
                            <AffinityConfigurationStudio />
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
                  </Suspense>
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