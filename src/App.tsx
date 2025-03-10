
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import { initializeAnalytics, trackPageView } from "@/services/analyticsService";
import Index from "./pages/Index";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import TestPage from "./pages/TestPage";
import AnimatedChatDemo from "./pages/AnimatedChatDemo";
import ChatButton from "./components/ChatButton";

// CopilotKit integration with dummy config
import { CopilotKit } from "@copilotkit/react-core";

const queryClient = new QueryClient();

// Google Analytics measurement ID
const GA_MEASUREMENT_ID = "G-XXXXXXXXXX"; // Replace with your actual GA4 measurement ID

// Analytics tracker component that listens for route changes
const AnalyticsTracker = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Initialize analytics only once
    console.log("Trying to initialize analytics with ID:", GA_MEASUREMENT_ID);
    initializeAnalytics(GA_MEASUREMENT_ID);
  }, []);

  useEffect(() => {
    // Track page views when the location changes
    console.log("Tracking page view for:", location.pathname);
    trackPageView({
      path: location.pathname,
      search: location.search,
    });
  }, [location]);

  return null;
};

const App = () => {
  console.log("App component rendering");
  
  return (
    <QueryClientProvider client={queryClient}>
      <CopilotKit publicApiKey="dummy-key">
        <HelmetProvider>
          <TooltipProvider>
            <BrowserRouter>
              <AnalyticsTracker />
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/animated-chat" element={<AnimatedChatDemo />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ChatButton />
            </BrowserRouter>
          </TooltipProvider>
        </HelmetProvider>
      </CopilotKit>
    </QueryClientProvider>
  );
};

export default App;
