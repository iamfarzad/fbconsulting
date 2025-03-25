import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import ThemeProvider from "./components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import ChatButtonWrapper from "./components/ChatButtonWrapper";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CopilotProvider } from "@/features/gemini/config/CopilotProvider";

// Lazy load components to reduce initial load time
const Index = lazy(() => import("./pages/Index"));
const Services = lazy(() => import("./pages/Services"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ChatButton = lazy(() => import("./components/ChatButton"));

// Simple loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

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
