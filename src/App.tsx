import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from "@/components/ui/toaster"
import Index from './pages/Index';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';
import TestPage from './pages/TestPage';
import { AnimatePresence } from 'framer-motion';
import ChatButton from './components/ChatButton';
import TestMCP from './pages/TestMCP';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AnimatePresence mode="wait">
          <Toaster />
          <ChatButton />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/test-mcp" element={<TestMCP />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
