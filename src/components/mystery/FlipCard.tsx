import { useState } from 'react'
import { MysteryCard, MysteryBoxRarity, CardSeries } from '@/types'
import { RARITY_CONFIG, SERIES_CONFIG } from '@/data/mysteryBox'
import { cn } from '@/lib/utils'

interface FlipCardProps {
  card: MysteryCard
  isNew?: boolean
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
}

export function FlipCard({ card, isNew, onClick, size = 'md' }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const rarityConfig = RARITY_CONFIG[card.rarity]
  const seriesConfig = SERIES_CONFIG[card.series]

  const sizeClasses = {
    sm: 'w-32 h-44',
    md: 'w-48 h-64',
    lg: 'w-64 h-80',
  }

  const emojiSizeClasses = {
    sm: 'text-4xl',
    md: 'text-6xl',
    lg: 'text-7xl',
  }

  const handleClick = () => {
    setIsFlipped((f) => !f)
    onClick?.()
  }

  const isHidden = card.rarity === MysteryBoxRarity.HIDDEN || card.rarity === MysteryBoxRarity.EGG

  return (
    <div
      className={cn(
        'relative cursor-pointer select-none',
        sizeClasses[size]
      )}
      style={{ perspective: '1000px' }}
      onClick={handleClick}
    >
      {isNew && (
        <div className="absolute -top-2 -right-2 z-20 px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-md animate-bounce-in">
          NEW!
        </div>
      )}

      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <div
          className={cn(
            'absolute inset-0 rounded-2xl overflow-hidden',
            'shadow-xl flex flex-col items-center justify-center',
            isHidden && 'animate-rainbow-shine'
          )}
          style={{
            backfaceVisibility: 'hidden',
            background: card.background,
            boxShadow: isHidden
              ? `0 0 30px rgba(251, 191, 36, 0.5), 0 0 60px rgba(251, 191, 36, 0.3)`
              : undefined,
            backgroundSize: isHidden ? '200% 200%' : undefined,
          }}
        >
          {card.effect === 'sparkle' && (
            <>
              <span className="absolute top-4 left-4 text-xl animate-bounce-in">✨</span>
              <span className="absolute top-6 right-6 text-lg animate-bounce-in-delay">⭐</span>
              <span className="absolute bottom-8 left-8 text-base animate-bounce-in-delay-2">✨</span>
            </>
          )}
          {card.effect === 'float' && (
            <>
              <span className="absolute top-4 left-6 text-lg animate-float">💫</span>
              <span className="absolute bottom-6 right-4 text-xl animate-float-slow">🌙</span>
            </>
          )}
          {card.effect === 'glow' && (
            <div className="absolute inset-0 bg-white/20 animate-pulse-slow" />
          )}

          <div
            className={cn(
              'absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-bold text-white bg-gradient-to-r shadow-sm',
              rarityConfig.color
            )}
          >
            {rarityConfig.badge} · {rarityConfig.name}
          </div>

          <div className="absolute top-3 right-3 text-lg opacity-70">
            {seriesConfig.icon}
          </div>

          <div className={cn(emojiSizeClasses[size], 'mb-3 drop-shadow-lg')}>
            {card.emoji}
          </div>

          {card.title && size !== 'sm' && (
            <div
              className={cn(
                'text-center font-bold px-4',
                size === 'lg' ? 'text-xl' : 'text-base'
              )}
              style={{ color: card.textColor }}
            >
              {card.title}
            </div>
          )}

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs opacity-60 flex items-center gap-1">
            <span>👆</span>
            <span style={{ color: card.textColor }}>点击翻转查看</span>
          </div>
        </div>

        <div
          className={cn(
            'absolute inset-0 rounded-2xl overflow-hidden p-4',
            'shadow-xl flex flex-col bg-white'
          )}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className={cn(
                'px-2 py-1 rounded-full text-[10px] font-bold text-white bg-gradient-to-r',
                rarityConfig.color
              )}
            >
              {rarityConfig.badge}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              {seriesConfig.icon}
              {seriesConfig.name}
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <p
              className={cn(
                'text-center font-mashan leading-relaxed px-2',
                size === 'lg' ? 'text-lg' : size === 'md' ? 'text-base' : 'text-sm'
              )}
              style={{ color: card.textColor }}
            >
              {card.text}
            </p>
          </div>

          <div className="text-center mt-3">
            <div className="inline-block text-2xl">{card.emoji}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
