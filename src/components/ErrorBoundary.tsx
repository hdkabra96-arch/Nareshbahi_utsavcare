import React, { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error inside ErrorBoundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleClearCacheAndReset = () => {
    if (confirm("Would you like to clear your local website content cache and restore default values? This can resolve rendering crashes caused by corrupted data.")) {
      localStorage.removeItem("railconstruct_data");
      localStorage.removeItem("railconstruct_messages");
      sessionStorage.removeItem("railconstruct_admin");
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-6 text-white font-sans">
          <div className="max-w-2xl w-full bg-neutral-950 border border-neutral-800 rounded-2xl p-8 shadow-2xl space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20">
                <AlertTriangle className="h-6 w-6 stroke-[2]" />
              </div>
              <div className="space-y-1">
                <h1 className="font-serif text-2xl font-bold tracking-tight text-white">
                  Application Encountered an Error
                </h1>
                <p className="text-sm text-neutral-400">
                  A rendering error has occurred in the component tree. You can inspect the error details below or perform a system reset.
                </p>
              </div>
            </div>

            <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
              <div className="text-sm font-bold text-red-400">
                {this.state.error && this.state.error.toString()}
              </div>
              {this.state.errorInfo && (
                <div className="max-h-48 overflow-auto rounded text-[11px] font-mono text-neutral-500 leading-normal whitespace-pre-wrap bg-neutral-950 p-3 border border-neutral-800">
                  {this.state.errorInfo.componentStack}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center space-x-2 bg-neutral-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-neutral-700 transition-all cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleClearCacheAndReset}
                className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer shadow-md"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset to Default Values</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
