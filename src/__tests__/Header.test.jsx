import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastContext';
import Header from '../components/Header';

// Mock the auth context values
vi.mock('../contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    user: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    logout: vi.fn()
  })
}));

// Mock the toast context values
vi.mock('../contexts/ToastContext', () => ({
  ToastProvider: ({ children }) => children,
  useToast: () => ({
    showToast: vi.fn()
  })
}));

const renderHeader = () => {
  return render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ToastProvider>
          <Header />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  it('renders navigation links', () => {
    renderHeader();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Affinities')).toBeInTheDocument();
    expect(screen.getByText('Affinity Scores')).toBeInTheDocument();
    expect(screen.getByText('Affinity Agents')).toBeInTheDocument();
  });

  it('renders user menu when profile button is clicked', () => {
    renderHeader();
    const profileButton = screen.getByRole('button', { name: /open user menu/i });
    fireEvent.click(profileButton);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('renders notification and help buttons', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: /view notifications/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view help/i })).toBeInTheDocument();
  });
}); 