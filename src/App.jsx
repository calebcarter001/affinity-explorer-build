import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AgentView from './components/tabs/AgentView';
import AffinityLibrary from './components/tabs/AffinityLibrary';
import ScoringExplorer from './components/tabs/ScoringExplorer';
import LifecycleTracker from './components/tabs/LifecycleTracker';
import { AppProvider } from './contexts/AppContext';
import './styles/custom.css';
import Header from './components/Header';
import AffinityCombination from './components/tabs/AffinityCombination';
import ImplementationGuide from './components/tabs/ImplementationGuide';
import ReportsAnalytics from './components/tabs/ReportsAnalytics';
import Settings from './components/tabs/Settings';
import HelpSupport from './components/tabs/HelpSupport';

const App = () => {
  return (
    <AppProvider>
      <Router>
        <div className="flex min-h-screen bg-gray-100">
          <div className="fixed inset-y-0 left-0 z-30 w-64 transition duration-300 transform bg-[#00355F] overflow-y-auto">
            <Sidebar />
          </div>
          <div className="flex-1 ml-64">
            <Header />
            <main className="p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/agent-view" element={<AgentView />} />
                <Route path="/affinity-library" element={<AffinityLibrary />} />
                <Route path="/scoring-explorer" element={<ScoringExplorer />} />
                <Route path="/lifecycle-tracker" element={<LifecycleTracker />} />
                <Route path="/combine" element={<AffinityCombination />} />
                <Route path="/implementation" element={<ImplementationGuide />} />
                <Route path="/reports" element={<ReportsAnalytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<HelpSupport />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;