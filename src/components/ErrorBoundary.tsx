import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 to-yellow-50">
          <div className="parchment-panel max-w-md p-8 text-center">
            <div className="text-6xl mb-4">📜</div>
            <h1 className="text-2xl font-bold text-[var(--burgundy)] mb-4" style={{ fontFamily: "'Cormorant Unicase', serif" }}>
              The Tome Has Encountered an Error
            </h1>
            <p className="text-sm opacity-70 mb-6" style={{ fontFamily: 'Spectral, serif' }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={this.handleReset}
              className="px-6 py-3 bg-[var(--gold)] text-[var(--parchment-dark)] rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Return to Safety
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
