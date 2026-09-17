import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('PyClass Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-6 p-12 text-center">
          <h1 className="text-stage-headline font-semibold">课堂出现异常</h1>
          <p className="text-stage-sub text-text-secondary max-w-xl">{this.state.message}</p>
          <Button variant="primary" size="lg" onClick={() => window.location.reload()}>
            刷新页面
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
