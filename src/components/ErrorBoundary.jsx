
import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)' }}>
          <h2>Something went wrong.</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
            {this.state.error && this.state.error.toString()}
          </p>
          <button 
            className="primary-btn" 
            style={{ marginTop: '1rem' }}
            onClick={() => window.location.reload()}
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}
