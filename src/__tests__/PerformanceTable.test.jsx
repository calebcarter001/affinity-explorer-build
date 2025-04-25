import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PerformanceTable from '../components/performance/PerformanceTable';

const mockPerformanceData = [
  {
    id: '1',
    affinityId: 'aff1',
    affinityName: 'High Value Customers',
    year: 2024,
    clicks: 1500,
    impressions: 25000,
    transactions: 750,
    gpNet: 150000,
    dateCreated: '2024-01-01T00:00:00Z',
    lastUpdatedDate: '2024-03-15T00:00:00Z'
  },
  {
    id: '2',
    affinityId: 'aff2',
    affinityName: 'Frequent Shoppers',
    year: 2024,
    clicks: 2000,
    impressions: 30000,
    transactions: 1000,
    gpNet: 200000,
    dateCreated: '2024-01-01T00:00:00Z',
    lastUpdatedDate: '2024-03-15T00:00:00Z'
  }
];

const defaultProps = {
  data: mockPerformanceData,
  sortConfig: {
    key: 'affinityName',
    direction: 'asc'
  },
  onSort: jest.fn(),
  onRowClick: jest.fn(),
  selectedRowIndex: null
};

describe('PerformanceTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all columns correctly', () => {
    render(<PerformanceTable {...defaultProps} />);
    
    expect(screen.getByText('Affinity Name')).toBeInTheDocument();
    expect(screen.getByText('Clicks')).toBeInTheDocument();
    expect(screen.getByText('Impressions')).toBeInTheDocument();
    expect(screen.getByText('Transactions')).toBeInTheDocument();
    expect(screen.getByText('GP (Net)')).toBeInTheDocument();
  });

  it('renders performance data correctly', () => {
    render(<PerformanceTable {...defaultProps} />);
    
    expect(screen.getByText('High Value Customers')).toBeInTheDocument();
    expect(screen.getByText('1,500')).toBeInTheDocument();
    expect(screen.getByText('25,000')).toBeInTheDocument();
    expect(screen.getByText('750')).toBeInTheDocument();
    expect(screen.getByText('$150,000')).toBeInTheDocument();
  });

  it('calls onSort when column headers are clicked', () => {
    render(<PerformanceTable {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Clicks'));
    expect(defaultProps.onSort).toHaveBeenCalledWith('clicks');

    fireEvent.click(screen.getByText('Impressions'));
    expect(defaultProps.onSort).toHaveBeenCalledWith('impressions');
  });

  it('calls onRowClick with correct index when row is clicked', () => {
    render(<PerformanceTable {...defaultProps} />);
    
    fireEvent.click(screen.getByText('High Value Customers'));
    expect(defaultProps.onRowClick).toHaveBeenCalledWith(0);

    fireEvent.click(screen.getByText('Frequent Shoppers'));
    expect(defaultProps.onRowClick).toHaveBeenCalledWith(1);
  });

  it('highlights selected row', () => {
    const props = {
      ...defaultProps,
      selectedRowIndex: 0
    };
    
    const { container } = render(<PerformanceTable {...props} />);
    const selectedRow = container.querySelector('.bg-blue-50');
    
    expect(selectedRow).toBeInTheDocument();
    expect(selectedRow).toHaveTextContent('High Value Customers');
  });

  it('displays correct sort icons based on sortConfig', () => {
    const props = {
      ...defaultProps,
      sortConfig: {
        key: 'clicks',
        direction: 'desc'
      }
    };
    
    render(<PerformanceTable {...props} />);
    
    // Verify that other columns show the default icon
    const headers = screen.getAllByRole('columnheader');
    headers.forEach(header => {
      if (!header.textContent.includes('Clicks')) {
        expect(header.querySelector('svg')).toHaveClass('w-4');
      }
    });
  });
}); 