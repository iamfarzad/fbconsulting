
import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import LoadingFallback from "./components/LoadingFallback";
import AppRoutes from "./routes/AppRoutes";
import ChatButtonWrapper from "./components/ChatButtonWrapper";
import ProvidersWrapper from "./components/ProvidersWrapper";

const SafeApp: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ProvidersWrapper>
          <Suspense fallback={<LoadingFallback />}>
            <Toaster key="toaster" />
            <ChatButtonWrapper key="chat-button" />
            <AppRoutes />
          </Suspense>
        </ProvidersWrapper>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default SafeApp;
