
// Re-export only hooks intended for public use after refactoring.

// Assuming useWebSocketClient MIGHT still be used somewhere, keep for now.
// If confirmed unused later, remove these lines.
export * from "./useWebSocketClient"; 
export { default as useWebSocketClient } from "./useWebSocketClient";

// Remove exports for deleted/refactored hooks
// export * from "./useWebSocketChat";
// export { default as useWebSocketChat } from "./useWebSocketChat";
// export * from "./useGeminiWebSocketRefactored";
// export { default as useGeminiWebSocketRefactored } from "./useGeminiWebSocketRefactored";

// Export newly introduced hooks (assuming they exist and are needed)
export * from "./useWebSocketMessageHandlers"; 
export { default as useWebSocketMessageHandlers } from "./useWebSocketMessageHandlers";
export * from "./useWebSocketPingPong"; 
export { default as useWebSocketPingPong } from "./useWebSocketPingPong";
export * from "./useAudioHandler"; 
export { default as useAudioHandler } from "./useAudioHandler";

// Export other potentially relevant hooks from this feature slice
export * from "./useGeminiAudioPlayback";
export { default as useGeminiAudioPlayback } from "./useGeminiAudioPlayback";
export * from "./useGeminiInitialization";
export { default as useGeminiInitialization } from "./useGeminiInitialization";
export * from "./useGeminiMessageSubmission";
export { default as useGeminiMessageSubmission } from "./useGeminiMessageSubmission";


