
import { useReducer, useCallback } from 'react';
import { Model, Message, Protocol, Context, update } from '../core/types';

/**
 * Custom hook for using MCP (Model Context Protocol) in React components
 */
export function useMCP<M, C extends Context = Context>(
  protocol: Protocol<M, C>
): [Model<M>, (message: Message) => void] {
  // Use reducer to handle model updates
  const [model, dispatch] = useReducer(
    (currentModel: Model<M>, message: Message) => 
      update(protocol, currentModel, message),
    protocol.initialModel
  );

  // Create a stable dispatch function
  const sendMessage = useCallback((message: Message) => {
    dispatch(message);
  }, []);

  return [model, sendMessage];
}
