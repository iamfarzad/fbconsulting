import React from "react";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundaryWrapper from "./ErrorBoundaryWrapper";
import ThemeProvider from "./ThemeProvider";
import { LanguageProvider } from "../contexts/LanguageContext";
import { CopilotProvider } from "@/components/copilot/CopilotProvider";
import { GeminiAPIProvider } from "../providers/GeminiAPIProvider";

interface ProvidersWrapperProps {
  children: React.ReactNode;
}

/**
 * Wraps the application with all required providers in the correct order.
 * Each provider is wrapped in an ErrorBoundaryWrapper to isolate failures.
 */
const ProvidersWrapper: React.FC<ProvidersWrapperProps> = ({ children }) => {
  return (
    <ErrorBoundaryWrapper>
      <HelmetProvider>
        <ThemeProvider>
          <ErrorBoundaryWrapper>
            <LanguageProvider>
              <ErrorBoundaryWrapper>
                <CopilotProvider>
                  <ErrorBoundaryWrapper>
                    <GeminiAPIProvider>
                      <ErrorBoundaryWrapper>
                        {children}
                      </ErrorBoundaryWrapper>
                    </GeminiAPIProvider>
                  </ErrorBoundaryWrapper>
                </CopilotProvider>
              </ErrorBoundaryWrapper>
            </LanguageProvider>
          </ErrorBoundaryWrapper>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundaryWrapper>
  );
};

export default ProvidersWrapper;
