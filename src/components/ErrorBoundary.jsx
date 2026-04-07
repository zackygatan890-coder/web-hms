import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center px-6 py-24 text-center bg-white">
          <div className="bg-red-50 p-6 rounded-full mb-8 text-red-500">
            <AlertTriangle size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-neutral-900 mb-4">
            Oops! Terjadi Kesalahan
          </h2>
          <p className="text-gray-500 font-medium max-w-md mb-10 leading-relaxed">
            Bagian ini tidak dapat dimuat. Coba refresh halaman atau kembali ke beranda.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-500 transition active:scale-95"
            >
              <RefreshCw size={16} /> Coba Lagi
            </button>
            <a
              href="/"
              className="flex items-center gap-2 bg-neutral-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-neutral-700 transition active:scale-95"
            >
              <Home size={16} /> Beranda
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
