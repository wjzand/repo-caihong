import { useState, useEffect } from 'react'
import { PraiseContent } from '@/types'
import { Typewriter } from './Typewriter'
import { STYLE_CONFIG, TARGET_CONFIG } from '@/data/vocabulary'
import { useAppStore } from '@/store'
import { useSpeech } from '@/hooks/useSpeech'
import { copyToClipboard } from '@/utils/share'
import { cn } from '@/lib/utils'

interface PraiseCardProps {
  praise: PraiseContent | null
  isLoading?: boolean
  onRegenerate?: () => void
  onPoster?: () => void
  className?: string
}

export function PraiseCard({ praise, isLoading, onRegenerate, onPoster, className }: PraiseCardProps) {
  const [copied, setCopied] = useState(false)
  const [showFull, setShowFull] = useState(false)
  const { addFavorite, removeFavorite, isFavorite } = useAppStore()
  const { supported, speaking, play, stop } = useSpeech()

  const isFav = praise ? isFavorite(praise.id) : false

  const targetConfig = praise ? TARGET_CONFIG[praise.target] : null
  const styleConfig = praise ? STYLE_CONFIG[praise.style] : null

  const handleCopy = async () => {
    if (!praise) return
    const success = await copyToClipboard(praise.text)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleFavorite = () => {
    if (!praise) return
    if (isFav) {
      const favorites = useAppStore.getState().favorites
      const fav = favorites.find((f) => f.contentId === praise.id)
      if (fav) removeFavorite(fav.id)
    } else {
      addFavorite(praise)
    }
  }

  const handleSpeech = () => {
    if (!praise) return
    if (speaking) {
      stop()
    } else {
      play(praise.text)
    }
  }

  useEffect(() => {
    return () => stop()
  }, [stop, praise?.id])

  return (
    <div
      className={cn(
        'relative w-full rounded-3xl p-1 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 shadow-dreamy',
        className
      )}
    >
      <div className="relative rounded-3xl bg-white/90 backdrop-blur-md overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400" />

        {targetConfig && styleConfig && (
          <div className="flex items-center gap-2 px-5 pt-5 pb-3">
            <span className="text-2xl">{targetConfig.icon}</span>
            <span className="text-sm font-medium text-gray-600">{targetConfig.name}</span>
            <span className="text-gray-300">·</span>
            <span
              className={cn(
                'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r',
                styleConfig.color
              )}
            >
              <span>{styleConfig.emoji}</span>
              <span>{styleConfig.name}</span>
            </span>
          </div>
        )}

        <div
          className="relative px-6 py-6 min-h-[180px] flex items-center justify-center cursor-pointer"
          onClick={() => setShowFull(!showFull)}
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-pink-400 animate-wave" />
                <span className="w-3 h-3 rounded-full bg-purple-400 animate-wave-delay" />
                <span className="w-3 h-3 rounded-full bg-blue-400 animate-wave-delay-2" />
              </div>
              <span className="text-sm text-gray-400">正在酝酿彩虹屁...</span>
            </div>
          ) : praise ? (
            <div className="w-full">
              <p className="text-lg md:text-xl leading-relaxed text-gray-800 font-mashan text-center">
                <Typewriter text={praise.text} speed={50} />
              </p>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <div className="text-5xl mb-3">🌈</div>
              <p className="text-base">选择对象和风格</p>
              <p className="text-sm">点击下方按钮生成专属夸夸</p>
            </div>
          )}

          {speaking && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="w-1 rounded-full bg-gradient-to-t from-pink-400 to-purple-400 animate-wave"
                  style={{
                    height: `${12 + Math.random() * 16}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {praise && (
          <div className="px-4 pb-4 pt-2 border-t border-gray-100/50">
            <div className="grid grid-cols-4 gap-2">
              <ActionButton
                icon="🔄"
                label="换一句"
                onClick={onRegenerate}
                disabled={!onRegenerate}
              />
              <ActionButton
                icon={speaking ? '⏸️' : '🔊'}
                label={speaking ? '停止' : '语音'}
                onClick={handleSpeech}
                disabled={!supported}
              />
              <ActionButton
                icon="🎨"
                label="海报"
                onClick={onPoster}
                disabled={!onPoster}
              />
              <ActionButton
                icon={isFav ? '❤️' : '🤍'}
                label={isFav ? '已收藏' : '收藏'}
                onClick={handleFavorite}
                highlight={isFav}
              />
            </div>
            <button
              onClick={handleCopy}
              className={cn(
                'w-full mt-3 py-3 rounded-2xl font-medium text-sm transition-all duration-200',
                copied
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gradient-to-r from-pink-50 to-purple-50 text-gray-600 hover:from-pink-100 hover:to-purple-100 active:scale-[0.98]'
              )}
            >
              {copied ? '✅ 已复制到剪贴板' : '📋 复制夸夸文案'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

interface ActionButtonProps {
  icon: string
  label: string
  onClick?: () => void
  disabled?: boolean
  highlight?: boolean
}

function ActionButton({ icon, label, onClick, disabled, highlight }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all duration-200',
        'active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-200',
        disabled
          ? 'opacity-40 cursor-not-allowed'
          : highlight
          ? 'bg-pink-50 hover:bg-pink-100'
          : 'hover:bg-gray-50'
      )}
    >
      <span className="text-xl">{icon}</span>
      <span className={cn('text-xs', highlight ? 'text-pink-500 font-medium' : 'text-gray-500')}>
        {label}
      </span>
    </button>
  )
}
