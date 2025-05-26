import { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorBoundaryFallback } from './ErrorBoundaryFallback';

interface Props {
  children: ReactNode;
  fallback?: (props: { error: Error | null; resetError: () => void }) => ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error in component:', this.props.componentName || 'Unknown', error, errorInfo);
  }

  private resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback({ 
          error: this.state.error, 
          resetError: this.resetError 
        });
      }
      
      return (
        <ErrorBoundaryFallback
          error={this.state.error}
          resetError={this.resetError}
          componentName={this.props.componentName || 'Component'}
        />
      );
    }

    return this.props.children;
  }
}
