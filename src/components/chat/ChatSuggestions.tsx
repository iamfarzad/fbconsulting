"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ChatSuggestion {
  id: string | number
  text: string
}

interface ChatSuggestionsProps {
  suggestions: ChatSuggestion[]
  onSuggestionClick: (text: string) => void
  className?: string
}

export function ChatSuggestions({
  suggestions,
  onSuggestionClick,
  className,
}: ChatSuggestionsProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [showLeftShadow, setShowLeftShadow] = React.useState(false)
  const [showRightShadow, setShowRightShadow] = React.useState(false)

  const checkScroll = React.useCallback(() => {
    if (!containerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
    setShowLeftShadow(scrollLeft > 0)
    setShowRightShadow(scrollLeft < scrollWidth - clientWidth - 1) // -1 for rounding
  }, [])

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    checkScroll()
    container.addEventListener("scroll", checkScroll)
    window.addEventListener("resize", checkScroll)

    return () => {
      container.removeEventListener("scroll", checkScroll)
      window.removeEventListener("resize", checkScroll)
    }
  }, [checkScroll])

  // Ensure suggestions are always an array
  const safeSuggestions = Array.isArray(suggestions) ? suggestions : []

  return (
    <div className={cn("relative", className)}>
      {/* Left shadow */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-12 pointer-events-none",
          "bg-gradient-to-r from-background to-transparent",
          "transition-opacity duration-200",
          showLeftShadow ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Right shadow */}
      <div
        className={cn(
          "absolute right-0 top-0 bottom-0 w-12 pointer-events-none",
          "bg-gradient-to-l from-background to-transparent",
          "transition-opacity duration-200",
          showRightShadow ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Suggestions container */}
      <div
        ref={containerRef}
        className="overflow-x-auto scrollbar-none -mx-4 px-4"
      >
        <div className="flex gap-2 py-2 min-w-max">
          {safeSuggestions.map((suggestion) => (
            <motion.button
              key={suggestion.id}
              onClick={() => onSuggestionClick(suggestion.text)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "px-4 py-2 text-sm rounded-full border",
                "bg-background hover:bg-accent transition-colors",
                "whitespace-nowrap"
              )}
            >
              {suggestion.text}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
