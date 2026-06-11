import { useState, useEffect, useRef, useCallback } from 'react'

interface UseTypewriterOptions {
  speed?: number
  delay?: number
  onComplete?: () => void
}

export function useTypewriter(text: string, options: UseTypewriterOptions = {}) {
  const { speed = 60, delay = 0, onComplete } = options
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const indexRef = useRef(0)
  const timerRef = useRef<number | null>(null)

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    clearTimers()
    setDisplayText('')
    setIsTyping(true)
    setIsComplete(false)
    indexRef.current = 0

    const typeNext = () => {
      if (indexRef.current < text.length) {
        setDisplayText(text.slice(0, indexRef.current + 1))
        indexRef.current++
        timerRef.current = window.setTimeout(typeNext, speed)
      } else {
        setIsTyping(false)
        setIsComplete(true)
        onComplete?.()
      }
    }

    if (delay > 0) {
      timerRef.current = window.setTimeout(typeNext, delay)
    } else {
      typeNext()
    }
  }, [text, speed, delay, onComplete, clearTimers])

  const skip = useCallback(() => {
    clearTimers()
    setDisplayText(text)
    setIsTyping(false)
    setIsComplete(true)
    onComplete?.()
  }, [text, onComplete, clearTimers])

  const reset = useCallback(() => {
    clearTimers()
    setDisplayText('')
    setIsTyping(false)
    setIsComplete(false)
    indexRef.current = 0
  }, [clearTimers])

  useEffect(() => {
    if (text) {
      start()
    }
    return clearTimers
  }, [text, start, clearTimers])

  return {
    displayText,
    isTyping,
    isComplete,
    start,
    skip,
    reset,
  }
}
