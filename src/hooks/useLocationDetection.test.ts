import { renderHook } from '@testing-library/react';
import { useLocationDetection } from './useLocationDetection';

describe('useLocationDetection', () => {
  const mockNavigator = {
    language: 'en-US'
  };

  const mockIntl = {
    DateTimeFormat: () => ({
      resolvedOptions: () => ({
        timeZone: 'America/New_York'
      })
    })
  };

  beforeAll(() => {
    // Mock navigator
    Object.defineProperty(window, 'navigator', {
      value: mockNavigator,
      writable: true
    });

    // Mock Intl
    Object.defineProperty(window, 'Intl', {
      value: mockIntl,
      writable: true
    });
  });

  test('detects non-Norwegian location by default', () => {
    const { result } = renderHook(() => useLocationDetection());
    expect(result.current.isNorwegian).toBe(false);
  });

  test('detects Norwegian language', () => {
    mockNavigator.language = 'nb-NO';
    const { result } = renderHook(() => useLocationDetection());
    expect(result.current.isNorwegian).toBe(true);
  });

  test('detects Norwegian timezone', () => {
    mockNavigator.language = 'en-US';
    mockIntl.DateTimeFormat = () => ({
      resolvedOptions: () => ({
        timeZone: 'Europe/Oslo'
      })
    });
    const { result } = renderHook(() => useLocationDetection());
    expect(result.current.isNorwegian).toBe(true);
  });
});