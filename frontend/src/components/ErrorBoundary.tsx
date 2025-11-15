import React from "react";

type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<{}, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: any) {
    // tu peux logger l'erreur ailleurs
    console.error("Captured by ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8">
          <h1 className="text-xl font-bold">Une erreur est survenue</h1>
          <p>Regarde la console pour la stack trace.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
