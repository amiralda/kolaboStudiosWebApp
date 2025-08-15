// components/ui/dialog.tsx
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogPortal = DialogPrimitive.Portal
export const DialogOverlay = DialogPrimitive.Overlay
export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description
export const DialogClose = DialogPrimitive.Close

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
  )
}

type ContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  /** Set to true to hide the built-in (default) close button */
  hideCloseButton?: boolean
}

export function DialogContent({
  className,
  children,
  hideCloseButton = false,
  ...props
}: ContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-6 shadow-lg outline-none",
          className
        )}
        {...props}
      >
        {children}

        {/* Show default close ONLY if not hidden */}
        {!hideCloseButton && (
          <DialogPrimitive.Close
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md opacity-70 transition hover:opacity-100 focus:outline-none"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
