import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "../lib/icons";

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

// Catches render-time errors anywhere in the routed views and shows a friendly
// fallback instead of a blank white screen.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("UI error boundary caught:", error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <div className="card reveal mx-auto mt-10 max-w-lg p-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-danger-soft text-danger-ink">
            <AlertTriangle className="h-6 w-6" strokeWidth={2} />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-ink">
            Something went wrong
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate">
            This view hit an unexpected error. You can retry — your saved
            estimates are safe.
          </p>
          <button
            type="button"
            onClick={this.reset}
            className="btn btn-primary mt-5"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
