
// Re-export only hooks intended for public use after refactoring.
// Assuming useWebSocketClient might still be used elsewhere for now.

export * from "./useWebSocketClient";
export { default as useWebSocketClient } from "./useWebSocketClient";

// Remove exports for deleted/refactored hooks
// export * from "./useWebSocketChat";
// export { default as useWebSocketChat } from "./useWebSocketChat";
// export * from "./useGeminiWebSocketRefactored";
// export { default as useGeminiWebSocketRefactored } from "./useGeminiWebSocketRefactored";

// Add exports for any new hooks if needed
export * from "./useWebSocketMessageHandlers"; // Assuming this is reusable
export { default as useWebSocketMessageHandlers } from "./useWebSocketMessageHandlers";
export * from "./useWebSocketPingPong"; // Assuming this is reusable
export { default as useWebSocketPingPong } from "./useWebSocketPingPong";

