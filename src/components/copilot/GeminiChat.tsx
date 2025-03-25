"use client"

import * as React from "react"
import { useGeminiCopilot } from "./GeminiCopilotProvider"
import { ChatMessages } from "@/components/chat/ChatMessages"
import { ChatSuggestions } from "@/components/chat/ChatSuggestions"
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

  return (
    <div className={cn("relative w-full h-full", className)}>
      <HeroChat
        expanded={expanded}
        onExpand={onExpand}
        messages={safeMessages.map((msg, index) => ({
          id: index.toString(),
          content: msg.content,
          sender: msg.role === "user" ? "user" : "ai",
        }))}
        onSend={sendMessage}
        onVoice={handleVoiceInput}
        loading={isLoading || isListening}
      />

      {(!expanded || messages.length === 0) && (
        <ChatSuggestions
          suggestions={suggestions}
          onSuggestionClick={handleSuggestionClick}
          className="mt-4"
        />
      )}
    </div>
  )
}
