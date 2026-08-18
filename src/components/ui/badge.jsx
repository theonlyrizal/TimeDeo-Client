import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors [&>svg]:size-3',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'border-border text-foreground',
        muted: 'border-transparent bg-muted text-muted-foreground',
        success:
          'border-transparent bg-success/12 text-success ring-1 ring-inset ring-success/25',
        warning:
          'border-transparent bg-warning/15 text-warning ring-1 ring-inset ring-warning/30',
        destructive:
          'border-transparent bg-destructive/12 text-destructive ring-1 ring-inset ring-destructive/25',
        brand: 'border-transparent bg-primary/12 text-primary ring-1 ring-inset ring-primary/25',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

function Badge({ className, variant, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'span'
  return <Comp className={cn(badgeVariants({ variant, className }))} {...props} />
}

export { Badge, badgeVariants }
