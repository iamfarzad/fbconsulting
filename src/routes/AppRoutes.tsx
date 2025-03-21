
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingFallback from "@/components/LoadingFallback";

// Lazy load components to reduce initial load time
const Index = lazy(() => import("@/pages/Index"));
const Services = lazy(() => import("@/pages/Services"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const TestPage = lazy(() => import("@/pages/TestPage"));
const TestMCP = lazy(() => import("@/pages/TestMCP"));
const TestGoogleAI = lazy(() => import("@/pages/TestGoogleAI"));
const TestUnifiedChat = lazy(() => import("@/pages/TestUnifiedChat"));

const AppRoutes: React.FC = () => {
  return (
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
  );
};

export default AppRoutes;
