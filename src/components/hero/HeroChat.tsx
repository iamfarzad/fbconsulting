"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { ChatMessages } from "@/components/chat/ChatMessages"
import { HeroInput } from "@/components/hero/HeroInput"

interface HeroChatProps {
  className?: string
  expanded?: boolean
  onExpand?: () => void
  messages: Array<{
    id: string | number
    content: string
    sender: "user" | "ai"
  }>
  onSend: (message: string) => void
  onVoice?: () => void
  loading?: boolean
}

export function HeroChat({
  className,
  expanded = false,
  onExpand,
  messages,
  onSend,
  onVoice,
  loading
}: HeroChatProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  
  // Auto-focus on mobile when expanded
  React.useEffect(() => {
    if (expanded && containerRef.current) {
      const input = containerRef.current.querySelector("textarea")
      if (input && window.innerWidth < 640) {
        input.focus()
      }
    }
  }, [expanded])

  const containerVariants = {
    collapsed: {
      height: "auto",
      maxHeight: "144px" // Matches 3 lines of text + padding
    },
    expanded: {
      height: "100dvh",
      maxHeight: "100dvh"
    }
  }

  return (
    <motion.div
      ref={containerRef}
      variants={containerVariants}
      initial="collapsed"
      animate={expanded ? "expanded" : "collapsed"}
      className={cn(
        "relative w-full bg-background",
        expanded ? "fixed inset-0 z-50" : "rounded-lg border",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 flex flex-col",
          expanded ? "pb-0" : "pb-4"
        )}
      >
        <div 
          className={cn(
            "flex-1 overflow-hidden",
            !expanded && "cursor-pointer"
          )}
          onClick={() => !expanded && onExpand?.()}
        >
          <AnimatePresence mode="wait">
            {(expanded || messages.length > 0) ? (
              <ChatMessages 
                messages={messages}
                className={cn(
                  "h-full",
                  !expanded && "max-h-[144px]"
                )}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-full p-4 text-sm text-muted-foreground"
              >
                Click to start a conversation
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <HeroInput
          onSend={onSend}
          onVoice={onVoice}
          loading={loading}
          className={cn(
            !expanded && "pointer-events-none opacity-60",
            "transition-opacity"
          )}
          disabled={!expanded}
        />
      </div>
    </motion.div>
  )
}
