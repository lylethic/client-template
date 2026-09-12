"use client";

import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

/**
 * React class-based Error Boundary component.
 *
 * Catches unhandled errors in the React component tree and renders a
 * fallback UI instead of crashing the entire page.
 *
 * @example
 * <ErrorBoundary fallback={({ error, reset }) => (
 *   <div>
 *     <p>Something went wrong: {error.message}</p>
 *     <button onClick={reset}>Try again</button>
 *   </div>
 * )}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // TODO: Send to error monitoring service (e.g., Sentry)
    console.error("[ErrorBoundary] Uncaught error:", error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const Fallback = this.props.fallback;

      if (Fallback) {
        return <Fallback error={this.state.error} reset={this.reset} />;
      }

      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center min-h-[200px] gap-4 p-6 text-center"
        >
          <p className="text-sm text-muted-foreground">Something went wrong.</p>
          <button
            onClick={this.reset}
            className="text-sm underline text-primary hover:text-primary/80"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
