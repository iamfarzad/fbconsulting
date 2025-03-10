
"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-black dark:text-white" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName,
  titleClassName,
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-auto min-h-[180px] w-full select-none flex-col justify-between rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black px-5 py-4 transition-all duration-300",
        "hover:shadow-sm",
        "[&>*]:flex [&>*]:items-center [&>*]:gap-2",
        className
      )}
    >
      <div>
        <span className={cn("relative inline-block rounded-full bg-black/5 dark:bg-white/5 p-2", iconClassName)}>
          {icon}
        </span>
        <p className={cn("text-lg font-medium text-black dark:text-white", titleClassName)}>
          {title}
        </p>
      </div>
      <p className="text-base text-black/80 dark:text-white/80">{description}</p>
      <p className="text-sm text-black/60 dark:text-white/60">{date}</p>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards = [
    {
      className: "bg-white dark:bg-black hover:-translate-y-1",
    },
    {
      className: "bg-white dark:bg-black hover:-translate-y-1",
    },
    {
      className: "bg-white dark:bg-black hover:-translate-y-1",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
