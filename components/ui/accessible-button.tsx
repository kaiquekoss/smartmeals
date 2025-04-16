"use client"

import { forwardRef } from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface AccessibleButtonProps extends ButtonProps {
  ariaLabel?: string
  ariaDescribedBy?: string
  ariaExpanded?: boolean
  ariaControls?: string
  ariaHaspopup?: boolean | "dialog" | "menu" | "listbox" | "tree"
  role?: string
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ 
    className, 
    children, 
    ariaLabel, 
    ariaDescribedBy, 
    ariaExpanded, 
    ariaControls, 
    ariaHaspopup,
    role,
    ...props 
  }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(className)}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        aria-haspopup={ariaHaspopup}
        role={role}
        {...props}
      >
        {children}
      </Button>
    )
  }
)

AccessibleButton.displayName = "AccessibleButton" 