
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import LoadingFallback from './components/LoadingFallback';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function SafeApp() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app">
          <div className="min-h-screen bg-background text-foreground">
            <AppRoutes />
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default SafeApp;
