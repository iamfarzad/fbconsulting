import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatBubbleProps {
  variant?: "sent" | "received";
  className?: string;
  children: React.ReactNode;
}

export function ChatBubble({
  variant = "received",
  className,
  children,
}: ChatBubbleProps) {
  const safeBubble = children || {};
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-start gap-2 mb-4",
        variant === "sent" && "flex-row-reverse",
        className,
      )}
    >
      {safeBubble}
    </motion.div>
  );
}

interface ChatBubbleMessageProps {
  variant?: "sent" | "received";
  className?: string;
  children?: React.ReactNode;
}

export function ChatBubbleMessage({
  variant = "received",
  className,
  children,
}: ChatBubbleMessageProps) {
  const safeBubble = children || {};
  return (
    <div
      className={cn(
        "rounded-lg p-3 max-w-[80%]",
        variant === "sent" 
          ? "bg-gray-200 text-gray-900 ml-auto" 
          : "bg-white border text-gray-900",
        className
      )}
    >
      {safeBubble}
    </div>
  );
}

interface ChatBubbleAvatarProps {
  src?: string;
  fallback?: string;
  className?: string;
}

export function ChatBubbleAvatar({
  src,
  fallback = "AI",
  className,
}: ChatBubbleAvatarProps) {
  const safeBubble = src || {};
  return (
    <Avatar className={cn("h-8 w-8", className)}>
      {safeBubble && <AvatarImage src={safeBubble} />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
