
"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
  onClick?: () => void;
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-black dark:text-white" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName,
  titleClassName,
  onClick,
}: DisplayCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn(
        "relative overflow-hidden rounded-md border border-border h-full",
        "p-6 transition-all duration-300",
        "bg-white/90 dark:bg-black/90 backdrop-blur-sm",
        "hover:shadow-bento hover:border-foreground/20",
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-col h-full justify-between gap-4">
        <div>
          <div className={cn("relative inline-flex rounded-full p-3 bg-black/5 dark:bg-white/5 mb-3", iconClassName)}>
            {icon}
          </div>
          <h3 className={cn("text-lg font-medium mb-2", titleClassName)}>
            {title}
          </h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
        
        {date && (
          <div className="mt-auto pt-2">
            <span className="inline-flex text-sm font-medium text-muted-foreground bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full">
              {date}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
  className?: string;
}

export default function DisplayCards({ cards, className }: DisplayCardsProps) {
  const defaultCards = [
    {
      className: "bg-white dark:bg-black",
    },
    {
      className: "bg-white dark:bg-black",
    },
    {
      className: "bg-white dark:bg-black",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
