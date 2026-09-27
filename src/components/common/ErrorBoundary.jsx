import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white dark:bg-[#131c1a] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl space-y-5">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Ocurrió un inconveniente temporal
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                No te preocupes, estamos conectando los servicios de Urabá. Puedes recargar la página o volver al inicio.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs shadow-md flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Recargar Página
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" /> Ir al Inicio
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
