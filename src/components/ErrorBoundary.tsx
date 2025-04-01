import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="p-8 text-center">
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
              Произошла ошибка при загрузке компонента
            </h3>
            <p className="text-red-700 dark:text-red-300 mb-4">
              Возможно, отсутствуют необходимые зависимости или компонент содержит ошибки.
              Попробуйте обновить страницу или проверьте консоль браузера для получения дополнительной информации.
            </p>
            <details className="text-left mt-4 text-sm">
              <summary className="cursor-pointer text-red-600 dark:text-red-400">
                Детали ошибки
              </summary>
              <pre className="mt-2 p-2 bg-red-100 dark:bg-red-900/40 overflow-auto rounded">
                {this.state.error?.toString()}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 