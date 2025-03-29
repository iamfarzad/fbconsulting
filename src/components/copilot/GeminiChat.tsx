
"use client"

import * as React from "react"
import { useGeminiCopilot } from "./GeminiCopilotProvider"
import { HeroChat } from "@/components/hero/HeroChat"
import { cn } from "@/lib/utils"

const suggestions = [
  { id: 1, text: "Tell me about your services" },
  { id: 2, text: "What technologies do you use?" },
  { id: 3, text: "How can you help my business?" },
  { id: 4, text: "What's your development process?" },
]

interface GeminiChatProps {
  expanded?: boolean
  onExpand?: () => void
  className?: string
}

export function GeminiChat({ expanded = false, onExpand, className }: GeminiChatProps) {
  const {
    messages,
    sendMessage,
    isLoading,
    transcript,
    isListening,
    toggleListening,
    generateAndPlayAudio,
  } = useGeminiCopilot()

  const handleSuggestionClick = React.useCallback(
    (text: string) => {
      sendMessage(text)
    },
    [sendMessage]
  )

  const handleVoiceInput = React.useCallback(() => {
    toggleListening()
  }, [toggleListening])

  // Send transcript when voice input is received
  React.useEffect(() => {
    if (transcript && !isListening) {
      sendMessage(transcript)
    }
  }, [transcript, isListening, sendMessage])

  // Generate and play audio for AI messages
  React.useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role === "assistant") {
      generateAndPlayAudio(lastMessage.content)
    }
  }, [messages, generateAndPlayAudio])

  // Ensure messages are always an array
  const safeMessages = Array.isArray(messages) ? messages : []

  // Transform messages to the format expected by HeroChat
  const formattedMessages = safeMessages.map((msg, index) => ({
    id: index.toString(),
    content: msg.content,
    sender: msg.role === "user" ? "user" : "ai",
  }))

  return (
    <div className={cn("relative w-full h-full", className)}>
      {/* We need to modify HeroChat to accept our message format */}
      <div className="w-full">
        {expanded ? (
          <div className="chat-expanded">
            {formattedMessages.map((msg) => (
              <div key={msg.id} className={`p-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-3 rounded-lg ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="p-3 text-left">
                <div className="inline-block p-3 rounded-lg bg-muted">
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            )}
            <div className="mt-4">
              <input
                type="text"
                className="w-full p-3 border rounded-lg"
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(e.currentTarget.value)}
              />
              <button 
                onClick={handleVoiceInput}
                className="mt-2 p-2 rounded-full bg-primary text-primary-foreground"
              >
                {isListening ? 'Stop' : 'Voice'}
              </button>
            </div>
          </div>
        ) : (
          <div className="chat-preview">
            <p className="mb-4">How can I help you today?</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="p-2 text-sm bg-muted rounded-lg hover:bg-primary/10"
                >
                  {suggestion.text}
                </button>
              ))}
            </div>
            {onExpand && (
              <button 
                onClick={onExpand}
                className="mt-4 text-sm text-primary hover:underline"
              >
                Expand chat
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
