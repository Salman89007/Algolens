import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-xs sm:text-sm font-medium transition-all duration-180 ease-spring active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-violet-600 text-white hover:bg-violet-500 border border-violet-500/50 shadow-[0_1px_2px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)]",
        secondary:
          "bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white border border-white/[0.08] hover:border-white/[0.16] shadow-sm",
        outline:
          "border border-white/[0.1] bg-transparent text-zinc-300 hover:bg-white/[0.05] hover:border-white/[0.2] hover:text-white",
        ghost:
          "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05]",
        destructive:
          "bg-rose-600/90 text-white hover:bg-rose-500 border border-rose-500/40 shadow-sm",
        link:
          "text-violet-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-3.5 py-1.5 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-2.5 text-xs has-[>svg]:px-2",
        lg: "h-10 rounded-lg px-5 text-sm has-[>svg]:px-3.5",
        icon: "size-9 rounded-lg",
        "icon-sm": "size-8 rounded-md",
        "icon-lg": "size-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
