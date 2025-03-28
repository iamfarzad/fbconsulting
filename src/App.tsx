
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="fixed top-0 w-full bg-background border-b z-50 px-4 py-2">
          <ul className="flex gap-4">
            <li>
              <Link 
                to="/" 
                className="text-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
            </li>
          </ul>
        </nav>

        <div className="pt-16"> {/* Add padding for fixed navbar */}
          <Routes>
            <Route path="/" element={
              <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold mb-4">Welcome</h1>
                <p className="mb-4">Select a demo from the navigation menu above.</p>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
