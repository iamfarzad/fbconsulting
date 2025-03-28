
import React, { Suspense } from 'react';
import SafeApp from './SafeApp';
import LoadingFallback from './components/LoadingFallback';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong. Please refresh the page.</div>}>
      <Suspense fallback={<LoadingFallback />}>
        <SafeApp />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
