
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from './components/ui/toaster';
import Index from './pages/Index';
import About from './pages/About';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme-preference">
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          {/* Temporarily disabled pages with import issues 
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} /> 
          */}
        </Routes>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
