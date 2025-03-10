
/**
 * Core MCP (Model Context Protocol) type definitions
 * Based on https://glama.ai/blog/2024-11-25-model-context-protocol-quickstart
 */

// Model: represents the application state
export type Model<T> = T;

// Context: represents the environment and dependencies
export interface Context {
  [key: string]: unknown;
}

// Message: represents data flowing through the system
export interface Message<T = unknown> {
  type: string;
  payload?: T;
}

// Handler: processes messages and produces updated models
export type Handler<M, C extends Context = Context> = (
  model: Model<M>,
  context: C,
  message: Message
) => Model<M>;

// Protocol: defines the contract between components
export interface Protocol<M, C extends Context = Context> {
  initialModel: Model<M>;
  context: C;
  handlers: Record<string, Handler<M, C>>;
}

// Update function: processes a message through the protocol
export function update<M, C extends Context = Context>(
  protocol: Protocol<M, C>,
  model: Model<M>,
  message: Message
): Model<M> {
  const handler = protocol.handlers[message.type];
  if (!handler) {
    console.warn(`No handler found for message type: ${message.type}`);
    return model;
  }
  return handler(model, protocol.context, message);
}
