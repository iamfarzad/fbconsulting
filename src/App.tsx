
import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import LoadingFallback from './components/LoadingFallback';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong. Please refresh the page.</div>}>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
