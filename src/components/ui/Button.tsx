import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'gradient' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  loading?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-pink-400 to-rose-400 text-white hover:from-pink-500 hover:to-rose-500 shadow-candy active:scale-95',
  secondary:
    'bg-white text-pink-500 border-2 border-pink-200 hover:bg-pink-50 shadow-soft active:scale-95',
  ghost:
    'bg-transparent text-gray-600 hover:bg-gray-100 active:scale-95',
  gradient:
    'bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white shadow-dreamy hover:shadow-float active:scale-95',
  outline:
    'bg-white/70 backdrop-blur-sm border-2 border-white text-gray-700 hover:bg-white hover:shadow-soft active:scale-95',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-full',
  md: 'px-5 py-2.5 text-base rounded-full',
  lg: 'px-7 py-3.5 text-lg rounded-full',
  xl: 'px-10 py-5 text-xl rounded-full font-bold',
  icon: 'w-12 h-12 rounded-full flex items-center justify-center text-xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
