import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[color:var(--brand-primary)] text-[color:var(--text-on-primary)] hover:bg-[color:var(--brand-primary-light)] shadow-[var(--shadow-sm)] rounded-[var(--radius-sm)] focus-visible:ring-[color:var(--brand-primary)]",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 rounded-[var(--radius-sm)] shadow-[var(--shadow-sm)]",
        outline:
          "border border-[color:var(--border-primary)] bg-[color:var(--bg-surface-elevated)] hover:bg-[color:var(--bg-surface)] text-[color:var(--text-base)] rounded-[var(--radius-sm)] shadow-[var(--shadow-sm)]",
        secondary:
          "bg-[color:var(--bg-surface)] text-[color:var(--text-base)] hover:bg-[color:var(--bg-surface-elevated)] border-2 border-[color:var(--border-default)] rounded-[var(--radius-sm)] shadow-[var(--shadow-sm)]",
        ghost: "hover:bg-[color:var(--bg-surface)] text-[color:var(--text-muted)] hover:text-[color:var(--text-base)] rounded-[var(--radius-sm)]",
        link: "text-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary-light)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }