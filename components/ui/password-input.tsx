"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export interface PasswordInputProps extends React.ComponentProps<typeof Input> {
  toggleAriaLabel?: string
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, toggleAriaLabel = "Toggle password visibility", ...props }, ref) => {
    const [visible, setVisible] = React.useState(false)
    return (
      <div className="relative">
        <Input
          ref={ref}
          className={className}
          type={visible ? "text" : "password"}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={toggleAriaLabel}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground"
          onClick={() => setVisible((v) => !v)}
          tabIndex={0}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
    )
  }
)

PasswordInput.displayName = "PasswordInput"
