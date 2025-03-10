
import { Protocol, Message } from '../core/types';

// Define the model shape
export interface CounterModel {
  count: number;
}

// Define context with dependencies
export interface CounterContext {
  minValue: number;
  maxValue: number;
}

// Define message types
export enum CounterMessageTypes {
  INCREMENT = 'counter/increment',
  DECREMENT = 'counter/decrement',
  RESET = 'counter/reset',
  SET = 'counter/set',
}

// Message type helpers
export const createIncrementMessage = (amount = 1): Message => ({
  type: CounterMessageTypes.INCREMENT,
  payload: amount,
});

export const createDecrementMessage = (amount = 1): Message => ({
  type: CounterMessageTypes.DECREMENT,
  payload: amount,
});

export const createResetMessage = (): Message => ({
  type: CounterMessageTypes.RESET,
});

export const createSetMessage = (value: number): Message => ({
  type: CounterMessageTypes.SET,
  payload: value,
});

// Create the counter protocol
export const createCounterProtocol = (
  initialCount = 0,
  minValue = Number.MIN_SAFE_INTEGER,
  maxValue = Number.MAX_SAFE_INTEGER
): Protocol<CounterModel, CounterContext> => ({
  initialModel: { count: initialCount },
  context: { minValue, maxValue },
  handlers: {
    [CounterMessageTypes.INCREMENT]: (model, context, message) => {
      const amount = typeof message.payload === 'number' ? message.payload : 1;
      const newCount = Math.min(model.count + amount, context.maxValue);
      return { ...model, count: newCount };
    },
    [CounterMessageTypes.DECREMENT]: (model, context, message) => {
      const amount = typeof message.payload === 'number' ? message.payload : 1;
      const newCount = Math.max(model.count - amount, context.minValue);
      return { ...model, count: newCount };
    },
    [CounterMessageTypes.RESET]: (model) => {
      return { ...model, count: 0 };
    },
    [CounterMessageTypes.SET]: (model, context, message) => {
      if (typeof message.payload !== 'number') {
        return model;
      }
      const newCount = Math.max(
        context.minValue,
        Math.min(message.payload, context.maxValue)
      );
      return { ...model, count: newCount };
    },
  },
});
