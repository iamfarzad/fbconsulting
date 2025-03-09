
import { cn } from "@/lib/utils"

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
              className="group flex items-center gap-2 cursor-pointer rounded-md bg-white/5 p-4 shadow-sm transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-x-1 hover:-translate-y-1 hover:bg-white/10"
            >
              <CheckCircleIcon className="h-6 w-6 mr-2 stroke-teal group-hover:stroke-teal/100" />
              <p className="text-foreground font-medium transition-colors group-hover:text-white">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
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
