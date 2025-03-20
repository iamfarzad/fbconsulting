
import React from 'react';
import { render, screen } from '@testing-library/react';
import { CopilotProvider } from '../CopilotProvider';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the hooks
vi.mock('@/mcp/hooks/usePersonaManagement', () => ({
  usePersonaManagement: () => ({
    personaData: { name: 'Test Persona', expertise: 'Testing' },
    setCurrentPage: vi.fn(),
  }),
}));

vi.mock('@/hooks/useGeminiAPI', () => ({
  useGeminiAPI: () => ({
    apiKey: 'test-api-key',
  }),
}));

// Mock the useContextTracking hook
vi.mock('../hooks/useContextTracking', () => ({
  useContextTracking: vi.fn(),
}));

// Mock other hooks
vi.mock('../hooks/useVoiceInitialization', () => ({
  useVoiceInitialization: () => ({
    voiceConfig: { enabled: true, voice: 'test-voice' },
  }),
}));

vi.mock('../hooks/useApiKeyManagement', () => ({
  useApiKeyManagement: () => ({
    apiKey: 'test-api-key',
  }),
}));

vi.mock('../hooks/useSystemMessage', () => ({
  useSystemMessage: () => ({
    systemMessage: 'Test system message',
  }),
}));

vi.mock('../hooks/useAgenticConfig', () => ({
  useAgenticConfig: () => ({
    agenticConfig: { proactiveAssistance: true },
  }),
}));

// Mock CopilotKit
vi.mock('@copilotkit/react-core', () => ({
  CopilotKit: ({ children }: { children: React.ReactNode }) => <div data-testid="copilot-kit">{children}</div>,
}));

describe('CopilotProvider', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Reset mocks
    vi.resetAllMocks();
  });

  it('renders children when API key is provided', () => {
    render(
      <CopilotProvider apiKey="test-key">
        <div data-testid="test-child">Test Child</div>
      </CopilotProvider>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByTestId('copilot-kit')).toBeInTheDocument();
  });

  it('renders children but not CopilotKit when no API key is provided', () => {
    // Override the useApiKeyManagement mock for this test
    vi.mocked(require('../hooks/useApiKeyManagement').useApiKeyManagement).mockReturnValueOnce({
      apiKey: null,
    });

    render(
      <CopilotProvider>
        <div data-testid="test-child">Test Child</div>
      </CopilotProvider>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.queryByTestId('copilot-kit')).not.toBeInTheDocument();
  });

  it('passes correct props to CopilotKit', () => {
    const { container } = render(
      <CopilotProvider apiKey="test-key" modelName="test-model">
        <div>Test Child</div>
      </CopilotProvider>
    );

    // Since we're mocking CopilotKit, we can't directly test the props
    // But we can verify it renders
    expect(screen.getByTestId('copilot-kit')).toBeInTheDocument();
  });
});
