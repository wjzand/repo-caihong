import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface Bubble {
  id: number
  emoji: string
  left: number
  size: number
  delay: number
  duration: number
  opacity: number
}

interface FloatingBubblesProps {
  count?: number
  emojis?: string[]
  className?: string
}

const DEFAULT_EMOJIS = ['💕', '✨', '🌸', '⭐', '💫', '🌟', '🦋', '🌈', '🎀', '💗', '🍬', '🎈']

export function FloatingBubbles({
  count = 15,
  emojis = DEFAULT_EMOJIS,
  className,
}: FloatingBubblesProps) {
  const bubbles = useMemo<Bubble[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 100,
      size: 16 + Math.random() * 28,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 8,
      opacity: 0.3 + Math.random() * 0.5,
    }))
  }, [count, emojis])

  return (
    <div
      className={cn(
        'fixed inset-0 overflow-hidden pointer-events-none z-0',
        className
      )}
      aria-hidden="true"
    >
      {bubbles.map((bubble) => (
        <span
          key={bubble.id}
          className="absolute animate-float select-none"
          style={{
            left: `${bubble.left}%`,
            bottom: `-${bubble.size}px`,
            fontSize: `${bubble.size}px`,
            opacity: bubble.opacity,
            animationDelay: `${bubble.delay}s`,
            animationDuration: `${bubble.duration}s`,
          }}
        >
          {bubble.emoji}
        </span>
      ))}
    </div>
  )
}

interface SparkleEffectProps {
  className?: string
}

export function SparkleEffect({ className }: SparkleEffectProps) {
  const sparkles = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 4 + Math.random() * 8,
      delay: Math.random() * 3,
    }))
  }, [])

  return (
    <div className={cn('absolute inset-0 pointer-events-none overflow-hidden', className)}>
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white animate-pulse-slow"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            boxShadow: '0 0 10px rgba(255,255,255,0.8)',
          }}
        />
      ))}
    </div>
  )
}
