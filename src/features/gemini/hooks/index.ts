
// Re-export only hooks intended for public use after refactoring.

// Keep useWebSocketClient for now IF it's potentially used by something other than the deleted hooks.
// If not used, it should also be deleted.
export * from "./useWebSocketClient"; 
export { default as useWebSocketClient } from "./useWebSocketClient";

// Remove exports for deleted/refactored hooks
// export * from "./useWebSocketChat";
// export { default as useWebSocketChat } from "./useWebSocketChat";
// export * from "./useGeminiWebSocketRefactored";
// export { default as useGeminiWebSocketRefactored } from "./useGeminiWebSocketRefactored";

// Export newly introduced hooks from Lovable refactor (if intended for reuse)
export * from "./useWebSocketMessageHandlers"; 
export { default as useWebSocketMessageHandlers } from "./useWebSocketMessageHandlers";
export * from "./useWebSocketPingPong"; 
export { default as useWebSocketPingPong } from "./useWebSocketPingPong";

// Export audio related hook
export * from "./useAudioHandler";
export { default as useAudioHandler } from "./useAudioHandler"; 

