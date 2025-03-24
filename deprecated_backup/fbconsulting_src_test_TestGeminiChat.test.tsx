import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TestWrapper } from '@/utils/test-utils'; // Assuming you have a test wrapper for context
import TestGeminiChat from '@/pages/TestGeminiChat'; // Import your test component

describe('TestGeminiChat', () => {
  beforeEach(() => {
    render(
      <TestWrapper>
        <TestGeminiChat />
      </TestWrapper>
    );
  });

  it('renders chat interface', () => {
    expect(screen.getByText(/Google GenAI Chat/i)).toBeInTheDocument();
  });

  it('should handle voice commands', async () => {
    // Simulate starting voice recognition
    const microphoneButton = screen.getByRole('button', { name: /Start Listening/i });
    fireEvent.click(microphoneButton);

    // Simulate receiving a voice command
    // You can mock the voice recognition response here
    // For example, using jest.fn() to simulate the command

    expect(screen.getByText(/Final voice transcript:/i)).toBeInTheDocument();
  });

  it('shows error on voice recognition failure', async () => {
    // Simulate a voice recognition error
    // You can mock the error response here

    expect(await screen.findByText(/Voice Recognition Error/i)).toBeInTheDocument();
  });
});
