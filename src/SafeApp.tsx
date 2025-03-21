
import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import ThemeProvider from "./components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import LoadingFallback from "./components/LoadingFallback";
import AppRoutes from "./routes/AppRoutes";
import ChatButtonWrapper from "./components/ChatButtonWrapper";

// Import providers
import { LanguageProvider } from "./contexts/LanguageContext";
import { CopilotProvider } from "./components/copilot/CopilotProvider";
import { GeminiAPIProvider } from "./providers/GeminiAPIProvider";

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
                            <ChatButtonWrapper key="chat-button" />
                            <AppRoutes />
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
