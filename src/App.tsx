
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import ThemeProvider from "./components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
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
import TestGoogleAI from "./pages/TestGoogleAI";
import TestUnifiedChat from "./pages/TestUnifiedChat";
import AIDemo from "./pages/AIDemo";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CopilotProvider } from "./components/copilot/CopilotProvider";
import { GeminiAPIProvider } from "./providers/GeminiAPIProvider";
import LoadingFallback from "./components/LoadingFallback";

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <BrowserRouter>
          <ThemeProvider>
            <LanguageProvider>
              <GeminiAPIProvider>
                <CopilotProvider>
                  <Suspense fallback={<LoadingFallback />}>
                    <AnimatePresence mode="wait">
                      <Toaster key="toaster" />
                      <ChatButton key="chat-button" />
                      <Routes key="routes">
                        <Route path="/" element={<Index />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:slug" element={<BlogPost />} />
                        <Route path="/test" element={<TestPage />} />
                        <Route path="/test-mcp" element={<TestMCP />} />
                        <Route path="/test-google-ai" element={<TestGoogleAI />} />
                        <Route path="/test-unified-chat" element={<TestUnifiedChat />} />
                        <Route path="/ai-demo" element={<AIDemo />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AnimatePresence>
                  </Suspense>
                </CopilotProvider>
              </GeminiAPIProvider>
            </LanguageProvider>
          </ThemeProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </div>
  );
}

export default App;
