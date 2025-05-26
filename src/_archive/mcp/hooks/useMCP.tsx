
import { useReducer, useCallback, useRef, useEffect } from 'react';
import { Model, Message, Protocol, Context } from '../core/types';

/**
 * Custom hook for using MCP (Model Context Protocol) in React components
 */
export function useMCP<M, C extends Context = Context>(
  protocol: Protocol<M, C>
): [Model<M>, (message: Message) => void] {
  // Store protocol in a ref to prevent it from causing re-renders
  const protocolRef = useRef(protocol);
  
  // Also store current model in a ref to avoid circular dependencies
  const modelRef = useRef<Model<M>>(protocol.initialModel);
  
  // Use reducer to handle model updates
  const [model, dispatch] = useReducer(
    (currentModel: Model<M>, action: Message) => {
      if (action.type === '__MODEL_UPDATE__' && action.payload) {
        // Special action type for async updates
        return action.payload as Model<M>;
      }
      // For other actions, just return the current model
      // The actual update will happen asynchronously
      return currentModel;
    },
    protocol.initialModel
  );
  
  // Update the ref whenever the model changes
  useEffect(() => {
    modelRef.current = model;
  }, [model]);
  
  // Create a stable dispatch function that doesn't recreate on every render
  const sendMessage = useCallback((message: Message) => {
    // Use the current protocol and model from refs to avoid dependencies
    const currentProtocol = protocolRef.current;
    const currentModel = modelRef.current;
    
    // Check if a handler exists for this message type
    const handler = currentProtocol.handlers[message.type];
    if (!handler) {
      console.warn(`No handler found for message type: ${message.type}`);
      return;
    }
    
    // Handle the async update
    Promise.resolve(handler(currentModel, currentProtocol.context, message))
      .then(newModel => {
        // Create a special message type to update the model with the result
        dispatch({
          type: '__MODEL_UPDATE__',
          payload: newModel
        });
      })
      .catch(error => {
        console.error('Error in MCP handler:', error);
      });
  }, []); // No dependencies to prevent recreation

  return [model, sendMessage];
}
