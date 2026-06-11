import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

type CardVariant = 'default' | 'glass' | 'paper' | 'bubble' | 'gradient'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white shadow-soft rounded-3xl',
  glass: 'bg-white/70 backdrop-blur-md shadow-dreamy rounded-3xl border border-white/50',
  paper: 'bg-gradient-to-br from-amber-50 to-orange-50 shadow-warm rounded-2xl border border-amber-100',
  bubble: 'bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 shadow-candy rounded-3xl',
  gradient: 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 shadow-dreamy rounded-3xl',
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-6 transition-all duration-300', variantStyles[variant], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export const CardHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mb-4', className)} {...props} />
)

export const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('text-lg font-bold text-gray-800', className)} {...props} />
)

export const CardContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('', className)} {...props} />
)

export const CardFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mt-4 pt-4 border-t border-gray-100', className)} {...props} />
)
