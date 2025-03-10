
import React from 'react';
import { useMCP } from '../hooks/useMCP';
import { 
  createCounterProtocol, 
  createIncrementMessage, 
  createDecrementMessage, 
  createResetMessage,
  createSetMessage
} from './counterProtocol';

interface CounterComponentProps {
  initialCount?: number;
  minValue?: number;
  maxValue?: number;
}

export const CounterComponent: React.FC<CounterComponentProps> = ({
  initialCount = 0,
  minValue = 0,
  maxValue = 100,
}) => {
  // Create protocol and use MCP hook
  const counterProtocol = createCounterProtocol(initialCount, minValue, maxValue);
  const [model, sendMessage] = useMCP(counterProtocol);

  // Input state for setting custom values
  const [inputValue, setInputValue] = React.useState(initialCount.toString());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSetValue = () => {
    const newValue = parseInt(inputValue, 10);
    if (!isNaN(newValue)) {
      sendMessage(createSetMessage(newValue));
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-black/80 rounded-lg shadow-md border border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-4">MCP Counter Example</h2>
      
      <div className="mb-6">
        <div className="text-4xl font-bold mb-2 text-center">{model.count}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Range: {minValue} to {maxValue}
        </div>
      </div>
      
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => sendMessage(createDecrementMessage())}
          className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          disabled={model.count <= minValue}
        >
          Decrement
        </button>
        <button
          onClick={() => sendMessage(createResetMessage())}
          className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={() => sendMessage(createIncrementMessage())}
          className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          disabled={model.count >= maxValue}
        >
          Increment
        </button>
      </div>
      
      <div className="flex space-x-2">
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          min={minValue}
          max={maxValue}
          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800"
        />
        <button
          onClick={handleSetValue}
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Set Value
        </button>
      </div>
    </div>
  );
};
