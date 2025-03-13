
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
    (currentModel: Model<M>, message: Message) => {
      // Create a temporary placeholder state
      // The actual state will be updated in the effect inside sendMessage
      return currentModel;
    },
    protocol.initialModel
  );

  // Create a stable dispatch function
  const sendMessage = useCallback((message: Message) => {
    // Immediately dispatch to current model to start
    dispatch(message);
    
    // Handle the async update
    update(protocol, model, message).then(newModel => {
      // Create a special message type to update the model with the result
      dispatch({
        type: '__MODEL_UPDATE__',
        payload: newModel
      });
    }).catch(error => {
      console.error('Error in MCP handler:', error);
    });
  }, [model, protocol]);

  return [model, sendMessage];
}
