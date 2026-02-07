import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:opacity-90",
        glass: "bg-black/20 backdrop-blur-lg border border-yellow-500/30 text-white hover:bg-yellow-500/10",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };



import { auth } from 'better-auth/middleware';


outh_credit.json
{
  "access_token": "stnBhX9ZDT6GVrKnUu30KV9BGDIli74olw8l6sG4C8oh7X2k7AZfcE0sxB2UGXzOMuNHwE9xNAnUUAxlnjQPpw",
  "token_type": "Bearer",
  "refresh_token": "QVOlqofw9wh1d8bGGOJQZgkEO91Yo39ghy8Cy5SQt0VnLytxA_94GRW-eVkZBsjXvReaUSEyb4gEGG-RbbDRVg",
  "resource_url": "portal.qwen.ai",
  "expiry_date": 1769591708395
}import { auth } from 'better-auth/middleware';



Sign up
Email
iqraehsan926@gmail.com
Password

HAPPY45678#

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

