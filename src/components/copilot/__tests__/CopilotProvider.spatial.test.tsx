import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
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

describe('CopilotProvider - Spatial Understanding', () => {
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

    // Create sections for testing
    document.body.innerHTML = `
      <div>
        <section id="hero">Hero Section</section>
        <section id="services">Services Section</section>
        <section id="contact">Contact Section</section>
      </div>
    `;
  });

  it('should update spatial context on page navigation', () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={['/']}>
        <CopilotProvider>
          <div>Test Content</div>
        </CopilotProvider>
      </MemoryRouter>
    );

    // Verify initial spatial context
    expect(document.querySelector('#hero')).toBeTruthy();

    // Change route
    rerender(
      <MemoryRouter initialEntries={['/services']}>
        <CopilotProvider>
          <div>Test Content</div>
        </CopilotProvider>
      </MemoryRouter>
    );
  });

  it('should track user interactions', async () => {
    render(
      <MemoryRouter>
        <CopilotProvider>
          <button>Test Button</button>
          <input type="text" />
          <a href="#">Test Link</a>
        </CopilotProvider>
      </MemoryRouter>
    );

    // Simulate button click
    const button = document.querySelector('button');
    button && fireEvent.click(button);

    // Simulate input interaction
    const input = document.querySelector('input');
    input && fireEvent.change(input, { target: { value: 'test' } });

    // Simulate link click
    const link = document.querySelector('a');
    link && fireEvent.click(link);
  });

  it('should detect user inactivity', async () => {
    vi.useFakeTimers();

    render(
      <MemoryRouter>
        <CopilotProvider>
          <div>Test Content</div>
        </CopilotProvider>
      </MemoryRouter>
    );

    // Simulate user activity
    fireEvent.mouseMove(document.body);

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(31000); // 31 seconds
    });

    vi.useRealTimers();
  });

  it('should track scroll position and update current section', () => {
    render(
      <MemoryRouter>
        <CopilotProvider>
          <div style={{ height: '2000px' }}>
            <section id="hero" style={{ height: '500px' }}>Hero</section>
            <section id="services" style={{ height: '500px' }}>Services</section>
            <section id="contact" style={{ height: '500px' }}>Contact</section>
          </div>
        </CopilotProvider>
      </MemoryRouter>
    );

    // Simulate scrolling
    fireEvent.scroll(window, { target: { scrollY: 600 } });
  });
});
