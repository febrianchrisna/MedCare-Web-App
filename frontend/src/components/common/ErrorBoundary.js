import React, { Component } from 'react';
import { Container, Alert, Button } from 'react-bootstrap';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('Error caught by error boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Reload the page to start fresh
    window.location.href = '/';
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Container className="py-5 text-center">
          <Alert variant="danger">
            <h2>Something went wrong</h2>
            <p>We're sorry, but an unexpected error has occurred.</p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-3 text-start">
                <summary>Technical Details</summary>
                <pre className="mt-2 p-3 bg-light">
                  {this.state.error.toString()}
                  <br />
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </Alert>
          <Button variant="primary" onClick={this.handleReset}>
            Return to Home Page
          </Button>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
