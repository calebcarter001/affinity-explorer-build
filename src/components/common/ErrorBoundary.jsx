import React from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import { trackError } from '../../utils/analytics';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Track the error using our analytics system
    trackError(error, {
      componentStack: errorInfo.componentStack,
      componentName: this.props.componentName || 'Unknown Component'
    });
    
    // Log the error to console for development
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // In a production environment, you would send this to an error tracking service
    // like Sentry, LogRocket, etc.
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <FiAlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
              <p className="text-gray-600 mb-6">
                We apologize for the inconvenience. An unexpected error has occurred.
              </p>
              <button
                onClick={this.handleRetry}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FiRefreshCw className="mr-2" />
                Retry
              </button>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-6 w-full">
                  <details className="text-left">
                    <summary className="cursor-pointer text-sm text-gray-500">Error details</summary>
                    <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                      {this.state.error.toString()}
                      {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 