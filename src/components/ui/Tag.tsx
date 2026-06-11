import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

type TagVariant = 'default' | 'primary' | 'gradient' | 'outline' | 'soft'

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant
  active?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const variantStyles: Record<TagVariant, { base: string; active: string }> = {
  default: {
    base: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    active: 'bg-pink-500 text-white shadow-soft',
  },
  primary: {
    base: 'bg-pink-50 text-pink-600 hover:bg-pink-100',
    active: 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-candy',
  },
  gradient: {
    base: 'bg-white text-gray-600 border border-gray-200 hover:border-pink-200',
    active: 'bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 text-white shadow-dreamy',
  },
  outline: {
    base: 'bg-transparent text-gray-500 border border-gray-200 hover:border-pink-300 hover:text-pink-500',
    active: 'border-2 border-pink-400 text-pink-500 bg-pink-50',
  },
  soft: {
    base: 'bg-white/60 backdrop-blur-sm text-gray-600 hover:bg-white',
    active: 'bg-white text-pink-500 shadow-soft border border-pink-100',
  },
}

const sizeStyles = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant = 'default', active, size = 'md', children, ...props }, ref) => {
    const styles = variantStyles[variant]
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-1 font-medium rounded-full cursor-pointer select-none',
          'transition-all duration-200 ease-out',
          'active:scale-95',
          sizeStyles[size],
          active ? styles.active : styles.base,
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Tag.displayName = 'Tag'
