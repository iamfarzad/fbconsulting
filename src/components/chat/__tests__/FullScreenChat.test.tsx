import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FullScreenChat from '../FullScreenChat';
import { AIMessage } from '@/services/copilotService';
import { UploadedFile } from '@/hooks/useFileUpload';

const initialMessages: AIMessage[] = [
  { role: 'assistant', content: 'Hello! How can I assist you today?', id: '1' },
  { role: 'user', content: 'Tell me about your AI services.', id: '2' },
];

const mockOnMinimize = jest.fn();
const mockOnSendMessage = jest.fn();
const mockSetInputValue = jest.fn();
const mockOnClear = jest.fn();
const mockUploadFile = jest.fn();
const mockRemoveFile = jest.fn();

describe('FullScreenChat', () => {
  it('renders initial messages', () => {
    render(
      <FullScreenChat
        onMinimize={mockOnMinimize}
        initialMessages={initialMessages}
        onSendMessage={mockOnSendMessage}
        inputValue=""
        setInputValue={mockSetInputValue}
        isLoading={false}
        suggestedResponse={null}
        onClear={mockOnClear}
        files={[]}
        uploadFile={mockUploadFile}
        removeFile={mockRemoveFile}
        isUploading={false}
      />
    );

    expect(screen.getByText('Hello! How can I assist you today?')).toBeInTheDocument();
    expect(screen.getByText('Tell me about your AI services.')).toBeInTheDocument();
  });

  it('calls onMinimize when minimize button is clicked', () => {
    render(
      <FullScreenChat
        onMinimize={mockOnMinimize}
        initialMessages={initialMessages}
        onSendMessage={mockOnSendMessage}
        inputValue=""
        setInputValue={mockSetInputValue}
        isLoading={false}
        suggestedResponse={null}
        onClear={mockOnClear}
        files={[]}
        uploadFile={mockUploadFile}
        removeFile={mockRemoveFile}
        isUploading={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /minimize/i }));
    expect(mockOnMinimize).toHaveBeenCalled();
  });

  it('calls onSendMessage when send button is clicked', () => {
    render(
      <FullScreenChat
        onMinimize={mockOnMinimize}
        initialMessages={initialMessages}
        onSendMessage={mockOnSendMessage}
        inputValue="Test message"
        setInputValue={mockSetInputValue}
        isLoading={false}
        suggestedResponse={null}
        onClear={mockOnClear}
        files={[]}
        uploadFile={mockUploadFile}
        removeFile={mockRemoveFile}
        isUploading={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(mockOnSendMessage).toHaveBeenCalledWith([]);
  });

  it('calls setInputValue when input value changes', () => {
    render(
      <FullScreenChat
        onMinimize={mockOnMinimize}
        initialMessages={initialMessages}
        onSendMessage={mockOnSendMessage}
        inputValue=""
        setInputValue={mockSetInputValue}
        isLoading={false}
        suggestedResponse={null}
        onClear={mockOnClear}
        files={[]}
        uploadFile={mockUploadFile}
        removeFile={mockRemoveFile}
        isUploading={false}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/ask about our ai services/i), {
      target: { value: 'New message' },
    });
    expect(mockSetInputValue).toHaveBeenCalledWith('New message');
  });

  it('calls onClear when clear button is clicked', () => {
    render(
      <FullScreenChat
        onMinimize={mockOnMinimize}
        initialMessages={initialMessages}
        onSendMessage={mockOnSendMessage}
        inputValue=""
        setInputValue={mockSetInputValue}
        isLoading={false}
        suggestedResponse={null}
        onClear={mockOnClear}
        files={[]}
        uploadFile={mockUploadFile}
        removeFile={mockRemoveFile}
        isUploading={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(mockOnClear).toHaveBeenCalled();
  });

  it('displays suggested response when provided', () => {
    render(
      <FullScreenChat
        onMinimize={mockOnMinimize}
        initialMessages={initialMessages}
        onSendMessage={mockOnSendMessage}
        inputValue=""
        setInputValue={mockSetInputValue}
        isLoading={false}
        suggestedResponse="This is a suggested response."
        onClear={mockOnClear}
        files={[]}
        uploadFile={mockUploadFile}
        removeFile={mockRemoveFile}
        isUploading={false}
      />
    );

    expect(screen.getByText('This is a suggested response.')).toBeInTheDocument();
  });

  it('handles file upload and removal', () => {
    const files: UploadedFile[] = [
      { name: 'file1.txt', type: 'text/plain', data: 'data1', mimeType: 'text/plain' },
      { name: 'file2.jpg', type: 'image/jpeg', data: 'data2', mimeType: 'image/jpeg' },
    ];

    render(
      <FullScreenChat
        onMinimize={mockOnMinimize}
        initialMessages={initialMessages}
        onSendMessage={mockOnSendMessage}
        inputValue=""
        setInputValue={mockSetInputValue}
        isLoading={false}
        suggestedResponse={null}
        onClear={mockOnClear}
        files={files}
        uploadFile={mockUploadFile}
        removeFile={mockRemoveFile}
        isUploading={false}
      />
    );

    expect(screen.getByText('file1.txt')).toBeInTheDocument();
    expect(screen.getByText('file2.jpg')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /remove file1.txt/i }));
    expect(mockRemoveFile).toHaveBeenCalledWith(0);

    fireEvent.click(screen.getByRole('button', { name: /remove file2.jpg/i }));
    expect(mockRemoveFile).toHaveBeenCalledWith(1);
  });
});
