import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap font-display text-sm font-semibold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ion disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // cut-corner neon button
        primary:
          "bg-ion text-void [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)] shadow-[0_0_30px_-6px_hsl(var(--ion))] hover:shadow-[0_0_44px_-4px_hsl(var(--ion))] hover:brightness-110",
        ghost: "text-star hover:bg-white/5",
        outline: "border border-white/15 bg-white/[0.03] text-star backdrop-blur hover:border-ion/60 hover:bg-ion/10 hover:text-ion",
        plasma:
          "bg-plasma text-white [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)] shadow-[0_0_30px_-6px_hsl(var(--plasma))] hover:brightness-110",
      },
      size: { default: "h-11 px-6", sm: "h-9 px-4 text-xs", lg: "h-13 px-8 py-3.5 text-base", icon: "h-10 w-10" },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});
Button.displayName = "Button";
export { buttonVariants };
