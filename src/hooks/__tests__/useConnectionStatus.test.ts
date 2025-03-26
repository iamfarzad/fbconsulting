import { renderHook, act } from '@testing-library/react-hooks';
import { useConnectionStatus } from '../useConnectionStatus';

describe('useConnectionStatus', () => {
  beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
      })
    );
  });

  afterAll(() => {
    global.fetch.mockClear();
  });

  it('should return initial connection status as false', () => {
    const { result } = renderHook(() => useConnectionStatus());
    expect(result.current.isConnected).toBe(false);
  });

  it('should return connection status as true if API key is present', () => {
    const mockApiKey = 'mock-api-key';
    jest.spyOn(require('@/config/api'), 'apiConfig', 'get').mockReturnValue({ geminiApiKey: mockApiKey });

    const { result } = renderHook(() => useConnectionStatus());
    expect(result.current.isConnected).toBe(true);
  });

  it('should check health status if API key is not present', async () => {
    jest.spyOn(require('@/config/api'), 'apiConfig', 'get').mockReturnValue({ geminiApiKey: null });

    const { result, waitForNextUpdate } = renderHook(() => useConnectionStatus());

    await waitForNextUpdate();

    expect(global.fetch).toHaveBeenCalledWith('/api/health');
    expect(result.current.isConnected).toBe(true);
  });

  it('should update connection status based on health check response', async () => {
    jest.spyOn(require('@/config/api'), 'apiConfig', 'get').mockReturnValue({ geminiApiKey: null });

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
      })
    );

    const { result, waitForNextUpdate } = renderHook(() => useConnectionStatus());

    await waitForNextUpdate();

    expect(result.current.isConnected).toBe(false);

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
      })
    );

    await act(async () => {
      await waitForNextUpdate();
    });

    expect(result.current.isConnected).toBe(true);
  });
});
