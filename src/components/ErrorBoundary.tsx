import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
          <p className="font-mono text-label tracking-wide uppercase text-gray-muted">
            Something went wrong loading this content.
          </p>
          <span className="btn-brutalist-wrap">
            <button
              onClick={() => this.setState({ hasError: false })}
              className="btn-brutalist font-grotesk text-caption text-green-deep border border-green-deep px-4 py-1.5 bg-card cursor-pointer"
            >
              retry
            </button>
          </span>
        </div>
      );
    }
    return this.props.children;
  }
}
