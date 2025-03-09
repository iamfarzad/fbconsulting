
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface TiltedScrollItem {
  id: string;
  text: string;
  icon?: React.ReactNode;
}

interface TiltedScrollProps {
  items?: TiltedScrollItem[];
  className?: string;
  itemClassName?: string;
  iconComponent?: React.ReactNode;
}

export function TiltedScroll({ 
  items = [],
  className,
  itemClassName,
  iconComponent
}: TiltedScrollProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative overflow-hidden [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,black_5rem),linear-gradient(to_left,transparent,black_5rem),linear-gradient(to_bottom,transparent,black_5rem),linear-gradient(to_top,transparent,black_5rem)]">
        <div className="grid h-[400px] w-[350px] gap-5 animate-skew-scroll grid-cols-1">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "group flex items-center gap-2 cursor-pointer rounded-md bg-white/5 p-4 shadow-sm transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-x-1 hover:-translate-y-1 hover:bg-white/10",
                itemClassName
              )}
            >
              {item.icon || iconComponent || <CheckCircleIcon className="h-6 w-6 mr-2 stroke-teal group-hover:stroke-teal/100" />}
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
