import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConnectionStatus } from '../../../components/ui/ai-chat/ConnectionStatus';
import { TestProvider } from '../../TestProvider';

describe('ConnectionStatus', () => {
  describe('Display States', () => {
    it('shows connected state correctly', () => {
      render(
        <TestProvider>
          <ConnectionStatus isConnected={true} />
        </TestProvider>
      );

      expect(screen.getByTestId('connection-status')).toHaveClass('connected');
      expect(screen.getByText(/connected/i)).toBeInTheDocument();
    });

    it('shows disconnected state correctly', () => {
      render(
        <TestProvider>
          <ConnectionStatus isConnected={false} />
        </TestProvider>
      );

      expect(screen.getByTestId('connection-status')).toHaveClass('disconnected');
      expect(screen.getByText(/disconnected/i)).toBeInTheDocument();
    });

    it('shows loading state while connecting', () => {
      render(
        <TestProvider>
          <ConnectionStatus isConnected={false} isConnecting={true} />
        </TestProvider>
      );

      expect(screen.getByTestId('connecting-indicator')).toBeInTheDocument();
      expect(screen.getByText(/connecting/i)).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls retry callback when retry button clicked', () => {
      const onRetry = vi.fn();
      render(
        <TestProvider>
          <ConnectionStatus 
            isConnected={false} 
            error={new Error('Test error')}
            onRetry={onRetry}
          />
        </TestProvider>
      );

      const retryButton = screen.getByRole('button', { name: /retry/i });
      fireEvent.click(retryButton);

      expect(onRetry).toHaveBeenCalled();
    });

    it('disables retry button while connecting', () => {
      render(
        <TestProvider>
          <ConnectionStatus 
            isConnected={false} 
            isConnecting={true}
            onRetry={() => {}}
          />
        </TestProvider>
      );

      const retryButton = screen.getByRole('button', { name: /retry/i });
      expect(retryButton).toBeDisabled();
    });
  });

  describe('Error States', () => {
    it('shows error message when provided', () => {
      const errorMessage = 'Connection failed';
      render(
        <TestProvider>
          <ConnectionStatus 
            isConnected={false} 
            error={new Error(errorMessage)}
          />
        </TestProvider>
      );

      expect(screen.getByTestId('connection-status')).toHaveClass('error');
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('clears error when connection is restored', () => {
      const { rerender } = render(
        <TestProvider>
          <ConnectionStatus 
            isConnected={false} 
            error={new Error('Test error')}
          />
        </TestProvider>
      );

      expect(screen.getByText(/test error/i)).toBeInTheDocument();

      rerender(
        <TestProvider>
          <ConnectionStatus isConnected={true} />
        </TestProvider>
      );

      expect(screen.queryByText(/test error/i)).not.toBeInTheDocument();
    });
  });
});
