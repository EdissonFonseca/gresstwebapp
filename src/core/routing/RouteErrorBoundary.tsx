import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class RouteErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Route error:', error, errorInfo);
  }

  override render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      return (
        this.props.fallback ?? (
          <div style={{ padding: '1.5rem', color: '#b91c1c' }}>
            <h2>Something went wrong</h2>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
              {this.state.error.message}
            </pre>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
