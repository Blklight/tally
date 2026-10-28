import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/* ---------------- Button ---------------- */
export const chamferButtonVariants = cva(
  "chamfer inline-flex items-center justify-center gap-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        sm: "chamfer-sm h-8 px-3 text-xs",
        md: "chamfer-sm h-9 px-4",
        lg: "h-11 px-6",
      },
      corner: {
        tl: "chamfer-tl",
        tr: "chamfer-tr",
        br: "chamfer-br",
        bl: "chamfer-bl",
      },
    },
    defaultVariants: { variant: "default", size: "md", corner: "br" },
  },
);
export const ChamferButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof chamferButtonVariants>
>(({ className, variant, size, corner, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(chamferButtonVariants({ variant, size, corner }), className)}
    {...props}
  />
));
ChamferButton.displayName = "ChamferButton";
