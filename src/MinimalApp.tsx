import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Minimal component for testing
const MinimalPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Minimal Test Page</h1>
        <p className="text-lg">If you can see this, the app is working correctly.</p>
      </div>
    </div>
  );
};

// Minimal app without any potentially problematic components
const MinimalApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<MinimalPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default MinimalApp;
