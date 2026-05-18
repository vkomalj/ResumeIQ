'use client';

import React, { ReactNode, ReactElement } from 'react';
import { motion } from 'framer-motion';
import { AnimatedButton } from './AnimatedButton';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactElement;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex items-center justify-center px-4"
          >
            <div className="glass rounded-2xl p-8 max-w-md text-center space-y-6">
              <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Something went wrong</h1>
                <p className="text-muted-foreground text-sm">
                  {this.state.error?.message || 'An unexpected error occurred'}
                </p>
              </div>
              <AnimatedButton onClick={this.resetError} fullWidth>
                Try Again
              </AnimatedButton>
            </div>
          </motion.div>
        )
      );
    }

    return this.props.children;
  }
}
