
import React, { useEffect, useState, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThemeProvider from "./components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import TestPage from "./pages/TestPage";
import { AnimatePresence } from "framer-motion";
import ChatButton from "./components/ChatButton";
import TestMCP from "./pages/TestMCP";
import { LanguageProvider } from "./contexts/LanguageContext";
import { GeminiProvider } from "./components/copilot/GeminiProvider";
import { toast } from "sonner";

// Load Gemini API Key from environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Create a Context for Gemini API
const GeminiAPIContext = createContext<{ apiKey: string | null }>({ apiKey: null });

// Custom hook to access the Gemini API Key
export const useGeminiAPI = () => {
  return useContext(GeminiAPIContext);
};

const GeminiAPIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    if (!GEMINI_API_KEY) {
      console.error("⚠️ Missing VITE_GEMINI_API_KEY in .env file");
      toast.error("Missing Gemini API Key", {
        description: "Please add a VITE_GEMINI_API_KEY to your .env file for AI chat to work."
      });
    } else {
      setApiKey(GEMINI_API_KEY);
      console.log("✅ Google Gemini API Key Loaded");
      toast.success("AI Services Connected", {
        description: "Gemini API is ready to use for chat functionality."
      });
    }
  }, []);

  return <GeminiAPIContext.Provider value={{ apiKey }}>{children}</GeminiAPIContext.Provider>;
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <LanguageProvider>
            <GeminiAPIProvider>
              <GeminiProvider>
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
              </GeminiProvider>
            </GeminiAPIProvider>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;
