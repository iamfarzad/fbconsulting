"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble"

interface Message {
  id: string | number
  content: string
  sender: "user" | "ai"
}

interface ChatMessagesProps {
  messages: Message[]
  className?: string
}

export function ChatMessages({ messages, className }: ChatMessagesProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  React.useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  return (
    <div className={cn("flex flex-col space-y-4 p-4", className)}>
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ChatBubble variant={message.sender === "user" ? "sent" : "received"}>
              <ChatBubbleAvatar
                fallback={message.sender === "user" ? "You" : "AI"}
                src={message.sender === "user" 
                  ? undefined 
                  : "/ai-avatar.png"} // You can add an AI avatar image
              />
              <ChatBubbleMessage 
                variant={message.sender === "user" ? "sent" : "received"}
              >
                {message.content}
              </ChatBubbleMessage>
            </ChatBubble>
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  )
}
