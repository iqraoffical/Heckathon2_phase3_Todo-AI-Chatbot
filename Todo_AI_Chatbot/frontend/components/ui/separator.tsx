import * as React from "react";
import { cn } from "@/lib/utils";

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {}

const Separator = React.forwardRef<
  HTMLHRElement,
  DividerProps
>(({ className, ...props }, ref) => (
  <hr
    ref={ref}
    className={cn(
      "shrink-0 border-t border-border",
      className
    )}
    {...props}
  />
));
Separator.displayName = "Separator";

export { Separator };