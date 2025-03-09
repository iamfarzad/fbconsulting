
import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface TiltedScrollItem {
  id: string;
  text: string;
}

interface TiltedScrollProps {
  items?: TiltedScrollItem[];
  className?: string;
}

export function TiltedScroll({ 
  items = defaultItems,
  className 
}: TiltedScrollProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative overflow-hidden [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,black_5rem),linear-gradient(to_left,transparent,black_5rem),linear-gradient(to_bottom,transparent,black_5rem),linear-gradient(to_top,transparent,black_5rem)]">
        <div className="grid h-[400px] w-[350px] gap-5 animate-skew-scroll grid-cols-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="group flex items-center gap-2 cursor-pointer rounded-md border border-border/40 bg-gradient-to-b from-background/80 to-muted/80 p-4 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-xl dark:border-border"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Check size={18} />
              </div>
              <p className="text-foreground/80 transition-colors group-hover:text-foreground">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const defaultItems: TiltedScrollItem[] = [
  { id: "1", text: "Wasting hours on repetitive tasks" },
  { id: "2", text: "Struggling with manual data entry" },
  { id: "3", text: "Missing customer follow-ups" },
  { id: "4", text: "Dealing with communication silos" },
  { id: "5", text: "Losing track of leads and opportunities" },
  { id: "6", text: "Struggling to scale operations efficiently" },
  { id: "7", text: "Drowning in manual processes" },
  { id: "8", text: "Missing insights from your data" },
];
