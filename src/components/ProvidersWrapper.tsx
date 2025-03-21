
import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import ThemeProvider from "./ThemeProvider";
import { LanguageProvider } from "../contexts/LanguageContext";
import { CopilotProvider } from "./copilot/CopilotProvider";
import { GeminiAPIProvider } from "../providers/GeminiAPIProvider";

interface ProvidersWrapperProps {
  children: React.ReactNode;
}

const ProvidersWrapper: React.FC<ProvidersWrapperProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ErrorBoundary>
          <LanguageProvider>
            <ErrorBoundary>
              <CopilotProvider>
                <ErrorBoundary>
                  <GeminiAPIProvider>
                    <ErrorBoundary>
                      {children}
                    </ErrorBoundary>
                  </GeminiAPIProvider>
                </ErrorBoundary>
              </CopilotProvider>
            </ErrorBoundary>
          </LanguageProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default ProvidersWrapper;
