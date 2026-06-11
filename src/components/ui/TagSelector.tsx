import { useState, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TagOption<T extends string> {
  value: T
  label: string
  icon?: string
  emoji?: ReactNode
}

interface TagSelectorProps<T extends string> {
  options: TagOption<T>[]
  value: T
  onChange: (value: T) => void
  variant?: 'default' | 'primary' | 'gradient' | 'outline' | 'soft'
  size?: 'sm' | 'md' | 'lg'
  scrollable?: boolean
  className?: string
}

export function TagSelector<T extends string>({
  options,
  value,
  onChange,
  variant = 'primary',
  size = 'md',
  scrollable = false,
  className,
}: TagSelectorProps<T>) {
  const variantStyles = {
    default: {
      base: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
      active: 'bg-pink-500 text-white shadow-soft',
    },
    primary: {
      base: 'bg-pink-50 text-pink-600 hover:bg-pink-100 border border-pink-100',
      active: 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-candy border-transparent',
    },
    gradient: {
      base: 'bg-white text-gray-600 border border-gray-200 hover:border-pink-200',
      active: 'bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 text-white shadow-dreamy border-transparent',
    },
    outline: {
      base: 'bg-transparent text-gray-500 border border-gray-200 hover:border-pink-300 hover:text-pink-500',
      active: 'border-2 border-pink-400 text-pink-500 bg-pink-50',
    },
    soft: {
      base: 'bg-white/60 backdrop-blur-sm text-gray-600 hover:bg-white border border-white/30',
      active: 'bg-white text-pink-500 shadow-soft border border-pink-100',
    },
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const [pressedIndex, setPressedIndex] = useState<number | null>(null)

  const containerClass = scrollable
    ? 'flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide'
    : 'flex flex-wrap gap-3'

  return (
    <div className={cn(containerClass, className)}>
      {options.map((option, index) => {
        const isActive = value === option.value
        const isPressed = pressedIndex === index
        const styles = variantStyles[variant]

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            onMouseDown={() => setPressedIndex(index)}
            onMouseUp={() => setPressedIndex(null)}
            onMouseLeave={() => setPressedIndex(null)}
            onTouchStart={() => setPressedIndex(index)}
            onTouchEnd={() => setPressedIndex(null)}
            className={cn(
              'inline-flex items-center gap-2 font-medium rounded-full whitespace-nowrap',
              'transition-all duration-200 ease-out select-none shrink-0',
              'focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-1',
              sizeStyles[size],
              isActive ? styles.active : styles.base,
              isPressed && 'scale-95'
            )}
          >
            {(option.icon || option.emoji) && (
              <span className="text-base leading-none">{option.emoji || option.icon}</span>
            )}
            <span>{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
