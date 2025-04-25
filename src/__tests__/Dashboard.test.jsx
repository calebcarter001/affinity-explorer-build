import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import { AppProvider } from '../contexts/AppContext';
import { ToastProvider } from '../contexts/ToastContext';
import * as apiService from '../services/apiService';

// Mock Chart.js
vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn()
  },
  ArcElement: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn()
}));

// Mock react-chartjs-2
vi.mock('react-chartjs-2', () => ({
  Pie: () => null
}));

// Mock the API calls
vi.mock('../services/apiService', () => ({
  getAffinityStats: vi.fn(),
  getRecentActivity: vi.fn(),
  getDashboardStats: vi.fn()
}));

const renderDashboard = () => {
  return render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastProvider>
        <AppProvider>
          <Dashboard />
        </AppProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  describe('Empty State', () => {
    beforeEach(() => {
      // Mock successful API responses with empty data
      vi.mocked(apiService.getDashboardStats).mockResolvedValue({
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        recentActivity: []
      });
      vi.mocked(apiService.getRecentActivity).mockResolvedValue([]);
    });

    it('should display empty state message when no data is available', async () => {
      renderDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/No affinities found/i)).toBeInTheDocument();
        expect(screen.getByText(/Start by creating your first affinity/i)).toBeInTheDocument();
      });
    });

    it('should show create affinity button in empty state', async () => {
      renderDashboard();
      
      await waitFor(() => {
        const createButton = screen.getByRole('button', { name: /create affinity/i });
        expect(createButton).toBeInTheDocument();
        expect(createButton).toBeEnabled();
      });
    });
  });

  describe('Partial Completion State', () => {
    beforeEach(() => {
      vi.mocked(apiService.getDashboardStats).mockResolvedValue({
        total: 10,
        completed: 3,
        inProgress: 5,
        pending: 2,
        recentActivity: [
          { id: "1", type: 'affinity_created', timestamp: new Date().toISOString() },
          { id: "2", type: 'affinity_updated', timestamp: new Date().toISOString() }
        ]
      });
      vi.mocked(apiService.getRecentActivity).mockResolvedValue([]);
    });

    it('should display correct progress indicators for partial completion', async () => {
      renderDashboard();
      
      await waitFor(() => {
        expect(screen.getByText('30%')).toBeInTheDocument(); // Completion percentage
        expect(screen.getByText(/5 in progress/i)).toBeInTheDocument(); // In progress count
        expect(screen.getByText(/2 pending/i)).toBeInTheDocument(); // Pending count
      });
    });

    it('should show recent activity for partial state', async () => {
      renderDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Recent Activity/i)).toBeInTheDocument();
        const recentActivityList = screen.getByText(/Recent Activity/i).closest('div').querySelector('ul');
        expect(recentActivityList.children).toHaveLength(2);
      });
    });
  });

  describe('Full Completion State', () => {
    beforeEach(() => {
      vi.mocked(apiService.getDashboardStats).mockResolvedValue({
        total: 10,
        completed: 10,
        inProgress: 0,
        pending: 0,
        recentActivity: [
          { id: "1", type: 'affinity_completed', timestamp: new Date().toISOString() }
        ]
      });
      vi.mocked(apiService.getRecentActivity).mockResolvedValue([]);
    });

    it('should display 100% completion state', async () => {
      renderDashboard();
      
      await waitFor(() => {
        expect(screen.getByText('100%')).toBeInTheDocument();
        expect(screen.getByText(/All affinities completed/i)).toBeInTheDocument();
      });
    });

    it('should show celebration message for full completion', async () => {
      renderDashboard();
      
      await waitFor(() => {
        expect(screen.getByText(/Congratulations/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error State', () => {
    beforeEach(() => {
      vi.mocked(apiService.getDashboardStats).mockRejectedValue(new Error('Failed to fetch stats'));
      vi.mocked(apiService.getRecentActivity).mockRejectedValue(new Error('Failed to fetch activity'));
    });

    it('should display error message when data fetch fails', async () => {
      renderDashboard();
      
      await waitFor(() => {
        expect(screen.getByTestId('error-state')).toBeInTheDocument();
        expect(screen.getByText(/Error loading dashboard data/i)).toBeInTheDocument();
      });
    });

    it('should show retry button in error state', async () => {
      renderDashboard();
      
      await waitFor(() => {
        const retryButton = screen.getByRole('button', { name: /retry/i });
        expect(retryButton).toBeInTheDocument();
        expect(retryButton).toBeEnabled();
      });
    });
  });
}); 