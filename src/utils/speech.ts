export type VoiceType = 'default' | 'loli' | 'yujie' | 'cartoon'

export interface SpeechOptions {
  rate?: number
  pitch?: number
  volume?: number
  lang?: string
  voiceIndex?: number
}

export function isSpeechSupported(): boolean {
  return 'speechSynthesis' in window
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSupported()) return []
  return window.speechSynthesis.getVoices()
}

export function speak(
  text: string,
  options: SpeechOptions = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isSpeechSupported()) {
      reject(new Error('Speech synthesis not supported'))
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = options.rate ?? 1
    utterance.pitch = options.pitch ?? 1
    utterance.volume = options.volume ?? 1
    utterance.lang = options.lang ?? 'zh-CN'

    const voices = getAvailableVoices()
    if (voices.length > 0) {
      const zhVoice =
        voices.find((v) => v.lang.includes('zh')) ||
        voices[options.voiceIndex ?? 0]
      if (zhVoice) utterance.voice = zhVoice
    }

    utterance.onend = () => resolve()
    utterance.onerror = (e) => reject(e)

    window.speechSynthesis.speak(utterance)
  })
}

export function speakWithVoice(
  text: string,
  voiceType: VoiceType = 'default'
): Promise<void> {
  const voiceSettings: Record<VoiceType, SpeechOptions> = {
    default: { rate: 1, pitch: 1 },
    loli: { rate: 1.1, pitch: 1.8 },
    yujie: { rate: 0.9, pitch: 0.7 },
    cartoon: { rate: 1.2, pitch: 1.5 },
  }
  return speak(text, voiceSettings[voiceType])
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel()
  }
}

export function isSpeaking(): boolean {
  return isSpeechSupported() && window.speechSynthesis.speaking
}
