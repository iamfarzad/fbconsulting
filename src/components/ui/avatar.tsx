import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  fallback?: React.ReactNode;
}

export const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, src, fallback = "U", alt, ...props }, ref) => {
    const [error, setError] = React.useState(false);

    return (
      <div
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          className
        )}
      >
        {src && !error ? (
          <img
            ref={ref}
            src={src}
            alt={alt}
            className="aspect-square h-full w-full"
            onError={() => setError(true)}
            {...props}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
            <span className="text-sm font-medium text-muted-foreground">
              {fallback}
            </span>
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";
