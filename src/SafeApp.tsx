
import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundaryWrapper from "./components/ErrorBoundaryWrapper";
import { Toaster } from "@/components/ui/toaster";
import LoadingFallback from "./components/LoadingFallback";
import AppRoutes from "./routes/AppRoutes";
import ChatButtonWrapper from "./components/ChatButtonWrapper";
import ProvidersWrapper from "./components/ProvidersWrapper";

/**
 * Main application component with error boundaries and providers.
 */
const SafeApp: React.FC = () => {
  return (
    <ErrorBoundaryWrapper>
      <BrowserRouter>
        <ProvidersWrapper>
          <Suspense fallback={<LoadingFallback />}>
            <Toaster key="toaster" />
            <ChatButtonWrapper key="chat-button" />
            <AppRoutes />
          </Suspense>
        </ProvidersWrapper>
      </BrowserRouter>
    </ErrorBoundaryWrapper>
  );
};

export default SafeApp;
