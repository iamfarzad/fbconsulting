
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <div className="min-h-screen bg-background text-foreground">
          <AppRoutes />
        </div>
      </div>
    </Router>
  );
}

export default App;
