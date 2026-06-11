import { useState, useCallback, useEffect } from 'react'
import { isSpeechSupported, speakWithVoice, stopSpeaking, isSpeaking, VoiceType } from '@/utils/speech'

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(false)
  const [currentVoice, setCurrentVoice] = useState<VoiceType>('default')

  useEffect(() => {
    setSupported(isSpeechSupported())
  }, [])

  useEffect(() => {
    if (!supported) return

    const checkInterval = setInterval(() => {
      setSpeaking(isSpeaking())
    }, 100)

    return () => clearInterval(checkInterval)
  }, [supported])

  const play = useCallback(
    async (text: string, voiceType?: VoiceType) => {
      if (!supported) return false
      try {
        setSpeaking(true)
        await speakWithVoice(text, voiceType || currentVoice)
        return true
      } catch (error) {
        console.error('Speech play error:', error)
        return false
      } finally {
        setSpeaking(false)
      }
    },
    [supported, currentVoice]
  )

  const stop = useCallback(() => {
    stopSpeaking()
    setSpeaking(false)
  }, [])

  return {
    supported,
    speaking,
    currentVoice,
    setCurrentVoice,
    play,
    stop,
  }
}
