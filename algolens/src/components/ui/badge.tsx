import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-violet-500/30 bg-violet-500/10 text-violet-300 font-medium",
        secondary:
          "border-white/[0.08] bg-zinc-900 text-zinc-300",
        outline:
          "border-white/[0.12] text-zinc-400 bg-transparent",
        compare:
          "border-amber-500/30 bg-amber-500/10 text-amber-300 font-mono",
        swap:
          "border-rose-500/30 bg-rose-500/10 text-rose-300 font-mono",
        sorted:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-mono",
        current:
          "border-sky-500/30 bg-sky-500/10 text-sky-300 font-mono",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
