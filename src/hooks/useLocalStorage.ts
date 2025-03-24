import { useEffect, useCallback } from 'react';
import { GeminiState, GeminiAction } from '@/types';

const STORAGE_KEY = 'gemini-state';
const STATE_VERSION = '1'; // Increment when making breaking changes to state structure

interface StoredState {
  version: string;
  data: GeminiState;
  timestamp: number;
}

export function useLocalStorage(
  state: GeminiState,
  dispatch: React.Dispatch<GeminiAction>
) {
  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const stored = JSON.parse(savedState) as StoredState;
        
        // Version check
        if (stored.version !== STATE_VERSION) {
          console.log('State version mismatch, resetting to defaults');
          localStorage.removeItem(STORAGE_KEY);
          return;
        }

        // Age check (24 hours)
        const age = Date.now() - stored.timestamp;
        if (age > 24 * 60 * 60 * 1000) {
          console.log('Stored state too old, resetting to defaults');
          localStorage.removeItem(STORAGE_KEY);
          return;
        }

        dispatch({ type: 'RESTORE_STATE', payload: stored.data });
      } catch (error) {
        console.error('Failed to parse saved state:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [dispatch]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      const storedState: StoredState = {
        version: STATE_VERSION,
        data: state,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedState));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  }, [state]);

  // Function to clear localStorage
  const clearStorage = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      dispatch({ type: 'RESET_STATE' });
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }, [dispatch]);

  // Function to check if we have stored state
  const hasStoredState = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return false;

    try {
      const stored = JSON.parse(saved) as StoredState;
      return stored.version === STATE_VERSION 
        && (Date.now() - stored.timestamp) <= 24 * 60 * 60 * 1000;
    } catch {
      return false;
    }
  }, []);

  return { clearStorage, hasStoredState };
}
