import { describe, it, expect } from 'vitest';
import { geminiReducer, initialGeminiState } from '../geminiReducer';
import type { GeminiState, GeminiAction } from '../types';

describe('geminiReducer', () => {
  it('should return the initial state', () => {
    expect(geminiReducer(undefined, {} as GeminiAction)).toEqual(initialGeminiState);
  });

  it('should handle SET_USER_INFO', () => {
    const userInfo = { name: 'Test User', company: 'Test Company' };
    const action: GeminiAction = { type: 'SET_USER_INFO', payload: userInfo };
    const newState = geminiReducer(initialGeminiState, action);
    
    expect(newState.userInfo).toEqual(userInfo);
  });

  it('should handle SET_PROPOSAL', () => {
    const proposal = { title: 'Test Proposal', description: 'Test Description' };
    const action: GeminiAction = { type: 'SET_PROPOSAL', payload: proposal };
    const newState = geminiReducer(initialGeminiState, action);
    
    expect(newState.proposal).toEqual(proposal);
  });

  it('should handle RESET_STATE', () => {
    // Start with a modified state
    const modifiedState: GeminiState = {
      ...initialGeminiState,
      userInfo: { name: 'Test User', company: 'Test Company' },
      proposal: { title: 'Test Proposal', description: 'Test Description' }
    };
    
    const action: GeminiAction = { type: 'RESET_STATE' };
    const newState = geminiReducer(modifiedState, action);
    
    expect(newState).toEqual(initialGeminiState);
  });
});
