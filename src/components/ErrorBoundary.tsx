import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-yellow-400 p-4 border-8 border-black">
          <h1 className="text-4xl font-black uppercase mb-4">System Malfunction</h1>
          <p className="font-bold mb-6">Something broke. It's not you, it's us.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-white px-6 py-3 border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none"
          >
            Reboot System
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;