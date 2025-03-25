"use client"

import * as React from "react"
import { Mic, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeroInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onSend: (message: string) => void
  onVoice?: () => void
  className?: string
  loading?: boolean
}

export function HeroInput({ onSend, onVoice, className, loading, ...props }: HeroInputProps) {
  const [message, setMessage] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
      // Reset height to auto to properly calculate new height
      textareaRef.current.style.height = "auto"
      // Set new height based on scrollHeight
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || loading) return
    
    onSend(message)
    setMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-4",
        "sm:static sm:bg-transparent sm:border-t-0",
        className
      )}
    >
      <div className="max-w-4xl mx-auto flex items-end gap-2">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Type a message..."
            className={cn(
              "w-full resize-none bg-background rounded-lg border px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "min-h-[52px] max-h-[200px] sm:text-sm"
            )}
            {...props}
          />
        </div>
        
        {onVoice && (
          <button
            type="button"
            onClick={onVoice}
            aria-label="Start voice input"
            className={cn(
              "flex items-center justify-center h-[52px] w-[52px] rounded-lg",
              "bg-background border hover:bg-accent transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            disabled={loading}
          >
            <Mic className="h-5 w-5" />
          </button>
        )}

        <button
          type="submit"
          aria-label="Send message"
          className={cn(
            "flex items-center justify-center h-[52px] w-[52px] rounded-lg",
            "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          disabled={!message.trim() || loading}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  )
}
