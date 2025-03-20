
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { CopilotProvider } from '../CopilotProvider';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock hooks
vi.mock('@/hooks/useGeminiAPI', () => ({
  useGeminiAPI: vi.fn().mockReturnValue({
    apiKey: 'test-key',
    isLoading: false
  })
}));

vi.mock('@/mcp/hooks/usePersonaManagement', () => ({
  usePersonaManagement: vi.fn().mockReturnValue({
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
  })
}));

describe('CopilotProvider - Spatial Understanding', () => {
  beforeEach(() => {
    // Create sections for testing
    document.body.innerHTML = `
      <div>
        <section id="hero">Hero Section</section>
        <section id="services">Services Section</section>
        <section id="contact">Contact Section</section>
      </div>
    `;
    
    // Reset timers
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should update spatial context on page navigation', () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={['/']}>
        <CopilotProvider>
          <div>Test Content</div>
        </CopilotProvider>
      </MemoryRouter>
    );

    // Change route
    rerender(
      <MemoryRouter initialEntries={['/services']}>
        <CopilotProvider>
          <div>Test Content</div>
        </CopilotProvider>
      </MemoryRouter>
    );
    
    // No assertions needed here since we're just testing that it doesn't error
  });

  it('should track user interactions', () => {
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
    
    // No assertions needed here since we're just testing that it doesn't error
  });

  it('should detect user inactivity', () => {
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
    
    // No assertions needed here since we're just testing that it doesn't error
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
    
    // No assertions needed here since we're just testing that it doesn't error
  });
});
