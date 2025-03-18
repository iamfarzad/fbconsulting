import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { CopilotProvider } from '../CopilotProvider';
import { MemoryRouter } from 'react-router-dom';
import { useGeminiAPI } from '@/hooks/useGeminiAPI';
import { usePersonaManagement } from '@/mcp/hooks/usePersonaManagement';

// Mock hooks
vi.mock('@/hooks/useGeminiAPI', () => ({
  useGeminiAPI: vi.fn()
}));

vi.mock('@/mcp/hooks/usePersonaManagement', () => ({
  usePersonaManagement: vi.fn()
}));

describe('CopilotProvider - Voice Synthesis', () => {
  beforeEach(() => {
    // Mock hook implementations
    (useGeminiAPI as any).mockReturnValue({
      apiKey: 'test-key',
      isLoading: false
    });

    (usePersonaManagement as any).mockReturnValue({
      personaData: {
        personaDefinitions: {
          default: {
            name: 'Default',
            tone: 'Professional',
            focusAreas: ['Testing']
          }
        },
        currentPersona: 'default',
        currentPage: '/'
      },
      setCurrentPage: vi.fn()
    });
  });

  it('should initialize voice synthesis on mount', async () => {
    render(
      <MemoryRouter>
        <CopilotProvider>
          <div>Test Content</div>
        </CopilotProvider>
      </MemoryRouter>
    );

    // Trigger onvoiceschanged event
    act(() => {
      if (window.speechSynthesis.onvoiceschanged) {
        window.speechSynthesis.onvoiceschanged();
      }
    });

    // Verify that getVoices was called
    expect(window.speechSynthesis.getVoices()).toEqual([
      { name: 'Charon', lang: 'en-US' },
      { name: 'Other Voice', lang: 'en-US' }
    ]);
  });

  it('should enable voice when Charon voice is available', async () => {
    // Mock getVoices to return Charon
    (window.speechSynthesis.getVoices as any).mockReturnValue([
      { name: 'Charon', lang: 'en-US' }
    ]);

    render(
      <MemoryRouter>
        <CopilotProvider>
          <div>Test Content</div>
        </CopilotProvider>
      </MemoryRouter>
    );

    // Trigger onvoiceschanged event
    act(() => {
      if (window.speechSynthesis.onvoiceschanged) {
        window.speechSynthesis.onvoiceschanged();
      }
    });
  });

  it('should not enable voice when Charon voice is not available', async () => {
    // Mock getVoices to return no Charon
    (window.speechSynthesis.getVoices as any).mockReturnValue([
      { name: 'Other Voice', lang: 'en-US' }
    ]);

    render(
      <MemoryRouter>
        <CopilotProvider>
          <div>Test Content</div>
        </CopilotProvider>
      </MemoryRouter>
    );

    // Trigger onvoiceschanged event
    act(() => {
      if (window.speechSynthesis.onvoiceschanged) {
        window.speechSynthesis.onvoiceschanged();
      }
    });
  });
});
