import { useState, useCallback } from 'react'
import { PraiseTarget, PraiseStyle, PraiseContent } from '@/types'
import { generatePraise, generatePraiseWithKeyword } from '@/utils/generator'
import { storage } from '@/utils/storage'

export function usePraiseGenerator() {
  const [currentPraise, setCurrentPraise] = useState<PraiseContent | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const generate = useCallback((target: PraiseTarget, style: PraiseStyle) => {
    setIsGenerating(true)
    setTimeout(() => {
      const praise = generatePraise(target, style)
      setCurrentPraise(praise)
      storage.addHistory(praise)
      setIsGenerating(false)
    }, 300)
  }, [])

  const generateWithKeyword = useCallback(
    (keyword: string, target?: PraiseTarget, style?: PraiseStyle) => {
      setIsGenerating(true)
      setTimeout(() => {
        const praise = generatePraiseWithKeyword(keyword, target, style)
        setCurrentPraise(praise)
        storage.addHistory(praise)
        setIsGenerating(false)
      }, 500)
    },
    []
  )

  const regenerate = useCallback(() => {
    if (currentPraise) {
      generate(currentPraise.target, currentPraise.style)
    }
  }, [currentPraise, generate])

  return {
    currentPraise,
    isGenerating,
    generate,
    generateWithKeyword,
    regenerate,
    setCurrentPraise,
  }
}
