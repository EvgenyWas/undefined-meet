import { Component, type ReactNode } from 'react';

interface IProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface IState {
  hasError: boolean;
  error: unknown;
}

export class ErrorBoundary extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
