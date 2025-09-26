import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Filter out common browser extension and DOM resolution errors
    const isExtensionError = error.message?.includes('Could not establish connection') ||
                            error.message?.includes('Receiving end does not exist') ||
                            error.message?.includes('deferred DOM Node');
    
    if (!isExtensionError) {
      this.props.onError?.(error, errorInfo);
    }
    
    this.setState({ errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Check if it's a browser extension or DOM-related error that we should ignore
      const shouldIgnore = this.state.error?.message?.includes('Could not establish connection') ||
                          this.state.error?.message?.includes('Receiving end does not exist') ||
                          this.state.error?.message?.includes('deferred DOM Node');
      
      if (shouldIgnore) {
        // Return children normally for browser extension errors
        return this.props.children;
      }

      // Custom fallback component
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert className="border-destructive/50 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="mt-2">
                <div className="space-y-2">
                  <p className="font-medium">Something went wrong</p>
                  <p className="text-sm text-muted-foreground">
                    An unexpected error occurred. Please try refreshing the page.
                  </p>
                  {process.env.NODE_ENV === 'development' && this.state.error && (
                    <details className="mt-2 text-xs">
                      <summary className="cursor-pointer">Error details</summary>
                      <pre className="mt-2 whitespace-pre-wrap break-words">
                        {this.state.error.toString()}
                      </pre>
                    </details>
                  )}
                </div>
              </AlertDescription>
            </Alert>
            <div className="mt-4 flex gap-2">
              <Button onClick={this.resetError} variant="outline" size="sm">
                Try Again
              </Button>
              <Button onClick={() => window.location.reload()} size="sm">
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      // Filter out browser extension errors
      const isExtensionError = error.message?.includes('Could not establish connection') ||
                              error.message?.includes('Receiving end does not exist') ||
                              error.message?.includes('deferred DOM Node');
      
      if (isExtensionError) {
        // Clear the error for extension-related issues
        setError(null);
      }
    }
  }, [error]);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  if (error) {
    throw error; // Let ErrorBoundary handle it
  }

  return { handleError, resetError };
}