
import React, { Suspense, lazy } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

const ChatButton = lazy(() => import("@/components/ChatButton"));

const ChatButtonWrapper: React.FC = () => {
  return (
    <ErrorBoundary fallback={
      <div className="fixed bottom-4 right-4 bg-red-100 p-2 rounded-full">
        <span className="sr-only">Chat unavailable</span>
      </div>
    }>
      <Suspense fallback={<div />}>
        <ChatButton />
      </Suspense>
    </ErrorBoundary>
  );
};

export default ChatButtonWrapper;
