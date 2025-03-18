import React, { useEffect, useState, createContext, useContext, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import ThemeProvider from "./components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";

// Lazy load components to reduce initial load time
const Index = lazy(() => import("./pages/Index"));
const Services = lazy(() => import("./pages/Services"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const NotFound = lazy(() => import("./pages/NotFound"));
const TestPage = lazy(() => import("./pages/TestPage"));
const TestMCP = lazy(() => import("./pages/TestMCP"));
const TestGoogleAI = lazy(() => import("./pages/TestGoogleAI"));
const TestUnifiedChat = lazy(() => import("./pages/TestUnifiedChat"));
const ChatButton = lazy(() => import("./components/ChatButton"));

// Import providers
import { LanguageProvider } from "./contexts/LanguageContext";
import { CopilotProvider } from "./components/copilot/CopilotProvider";

// Load Gemini API Key from environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Create a Context for Gemini API
const GeminiAPIContext = createContext<{ apiKey: string | null }>({ apiKey: null });

// Custom hook to access the Gemini API Key
const useGeminiAPI = () => {
  const context = useContext(GeminiAPIContext);
  if (context === undefined) {
    throw new Error('useGeminiAPI must be used within a GeminiAPIProvider');
  }
  return context;
};

// Export the hook
export { useGeminiAPI };

// Simple loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const GeminiAPIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKeyValue, setApiKeyValue] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Get API key from environment
      const rawApiKey = import.meta.env.VITE_GEMINI_API_KEY;
      console.log('Environment variables loaded:', {
        hasApiKey: !!rawApiKey,
        mode: import.meta.env.MODE,
        isDev: import.meta.env.DEV
      });

      if (!rawApiKey) {
        throw new Error('VITE_GEMINI_API_KEY is not set in environment');
      }

      // Trim and validate API key
      const trimmedKey = rawApiKey.trim();
      if (!trimmedKey) {
        throw new Error('VITE_GEMINI_API_KEY is empty after trimming');
      }

      // Set the API key
      setApiKeyValue(trimmedKey);
      console.log('✅ Gemini API Key loaded successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading API key';
      console.error('⚠️ API Key Error:', errorMessage);
      setError(errorMessage);
      setApiKeyValue(null);
    }
  }, []);

  // Show error in UI if API key is missing in development
  if (error && import.meta.env.DEV) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-4 text-center">
        <p>Error: {error}</p>
        <p className="text-sm">Please check your .env file and ensure VITE_GEMINI_API_KEY is set correctly.</p>
      </div>
    );
  }

  return (
    <GeminiAPIContext.Provider value={{ apiKey: apiKeyValue }}>
      {children}
    </GeminiAPIContext.Provider>
  );
};

const SafeApp: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ErrorBoundary>
          <ThemeProvider>
            <ErrorBoundary>
              <LanguageProvider>
                <ErrorBoundary>
                  <CopilotProvider>
                    <ErrorBoundary>
                      <GeminiAPIProvider>
                        <ErrorBoundary>
                          <Suspense fallback={<LoadingFallback />}>
                            <Toaster key="toaster" />
                            
                            <ErrorBoundary fallback={
                              <div className="fixed bottom-4 right-4 bg-red-100 p-2 rounded-full">
                                <span className="sr-only">Chat unavailable</span>
                              </div>
                            }>
                              <Suspense fallback={<div />}>
                                <ChatButton key="chat-button" />
                              </Suspense>
                            </ErrorBoundary>
                            
                            <Routes key="routes">
                              <Route path="/" element={
                                <ErrorBoundary>
                                  <Suspense fallback={<LoadingFallback />}>
                                    <Index />
                                  </Suspense>
                                </ErrorBoundary>
                              } />
                              <Route path="/services" element={
                                <ErrorBoundary>
                                  <Suspense fallback={<LoadingFallback />}>
                                    <Services />
                                  </Suspense>
                                </ErrorBoundary>
                              } />
                              <Route path="/about" element={
                                <ErrorBoundary>
                                  <Suspense fallback={<LoadingFallback />}>
                                    <About />
                                  </Suspense>
                                </ErrorBoundary>
                              } />
                              <Route path="/contact" element={
                                <ErrorBoundary>
                                  <Suspense fallback={<LoadingFallback />}>
                                    <Contact />
                                  </Suspense>
                                </ErrorBoundary>
                              } />
                              <Route path="/blog" element={
                                <ErrorBoundary>
                                  <Suspense fallback={<LoadingFallback />}>
                                    <Blog />
                                  </Suspense>
                                </ErrorBoundary>
                              } />
                              <Route path="/blog/:slug" element={
                                <ErrorBoundary>
                                  <Suspense fallback={<LoadingFallback />}>
                                    <BlogPost />
                                  </Suspense>
                                </ErrorBoundary>
                              } />
                              <Route path="/test" element={
                                <ErrorBoundary>
                                  <Suspense fallback={<LoadingFallback />}>
                                    <TestPage />
                                  </Suspense>
                                </ErrorBoundary>
                              } />
                              <Route path="/test-mcp" element={
                                <ErrorBoundary>
                                  <Suspense fallback={<LoadingFallback />}>
                                    <TestMCP />
                                  </Suspense>
                                </ErrorBoundary>
                              } />
                              <Route path="/test-google-ai" element={
                                <ErrorBoundary>
                                  <Suspense fallback={<LoadingFallback />}>
                                    <TestGoogleAI />
                                  </Suspense>
                                </ErrorBoundary>
                              } />
                              <Route path="/test-unified-chat" element={
                                <ErrorBoundary>
                                  <Suspense fallback={<LoadingFallback />}>
                                    <TestUnifiedChat />
                                  </Suspense>
                                </ErrorBoundary>
                              } />
                              <Route path="*" element={
                                <ErrorBoundary>
                                  <Suspense fallback={<LoadingFallback />}>
                                    <NotFound />
                                  </Suspense>
                                </ErrorBoundary>
                              } />
                            </Routes>
                          </Suspense>
                        </ErrorBoundary>
                      </GeminiAPIProvider>
                    </ErrorBoundary>
                  </CopilotProvider>
                </ErrorBoundary>
              </LanguageProvider>
            </ErrorBoundary>
          </ThemeProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default SafeApp;
