import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface TypewriterProps {
  text: string
  speed?: number
  delay?: number
  className?: string
  showCursor?: boolean
  onComplete?: () => void
}

export function Typewriter({
  text,
  speed = 60,
  delay = 0,
  className,
  showCursor = true,
  onComplete,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setDisplayText('')
    setIsComplete(false)

    let index = 0
    let timeoutId: number

    const startTyping = () => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1))
        index++
        timeoutId = window.setTimeout(startTyping, speed)
      } else {
        setIsComplete(true)
        onComplete?.()
      }
    }

    timeoutId = window.setTimeout(startTyping, delay)

    return () => clearTimeout(timeoutId)
  }, [text, speed, delay, onComplete])

  return (
    <span className={cn('whitespace-pre-wrap break-words', className)}>
      {displayText}
      {showCursor && !isComplete && (
        <span className="inline-block w-0.5 h-5 bg-pink-400 ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  )
}
