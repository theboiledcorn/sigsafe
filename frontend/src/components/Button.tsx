import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
    {
        variants: {
            variant: {
                default: "bg-bright-purple text-white hover:bg-vivid-lavender",
                secondary:
                    "bg-soft-lilac text-bright-purple hover:bg-vivid-lavender hover:text-white",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                approve: "bg-green-500 text-white hover:bg-green-600",
                reject: "bg-red-500 text-white hover:bg-red-600",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
            fullWidth: {
                true: "w-full",
            },
            rounded: {
                default: "rounded-md",
                full: "rounded-full",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            fullWidth: false,
            rounded: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, fullWidth, rounded, asChild = false, ...props }, ref) => {
        const Comp = asChild ? React.Fragment : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, fullWidth, rounded, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
