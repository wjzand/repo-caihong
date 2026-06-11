import { cn } from '@/lib/utils'

interface MysteryBox3DProps {
  state: 'idle' | 'shaking' | 'opening' | 'opened'
  onClick?: () => void
  isRare?: boolean
  disabled?: boolean
}

export function MysteryBox3D({ state, onClick, isRare, disabled }: MysteryBox3DProps) {
  const boxGradient = isRare
    ? 'from-purple-500 via-pink-500 to-yellow-400'
    : 'from-pink-400 via-rose-400 to-orange-400'

  const ribbonGradient = isRare
    ? 'from-yellow-400 to-amber-500'
    : 'from-yellow-300 to-amber-400'

  return (
    <div
      className={cn(
        'relative w-48 h-44 cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={disabled ? undefined : onClick}
      style={{ perspective: '800px' }}
    >
      {state !== 'idle' && (
        <div className="absolute -inset-8 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="absolute text-xl"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `sparkle 1.5s ease-in-out ${i * 0.1}s infinite`,
              }}
            >
              {['✨', '⭐', '💫', '🌟'][i % 4]}
            </span>
          ))}
        </div>
      )}

      <div
        className={cn(
          'relative w-full h-36 bottom-0 mt-8 rounded-xl shadow-2xl overflow-hidden',
          'bg-gradient-to-br',
          boxGradient,
          state === 'shaking' && 'animate-box-shake',
          state === 'opening' && 'animate-box-open'
        )}
      >
        <div className="absolute inset-0 bg-white/10" />

        <div
          className={cn(
            'absolute left-1/2 -translate-x-1/2 w-8 h-full bg-gradient-to-b shadow-lg',
            ribbonGradient
          )}
        />
        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 left-0 w-full h-8 bg-gradient-to-r shadow-lg',
            ribbonGradient
          )}
        />

        <div className="absolute bottom-3 left-3 text-3xl drop-shadow-lg">🎁</div>
        <div className="absolute bottom-3 right-3 text-xl opacity-80">✨</div>
      </div>

      <div
        className={cn(
          'absolute top-0 left-1/2 -translate-x-1/2 w-52 h-10 rounded-t-xl origin-bottom shadow-xl',
          'bg-gradient-to-b',
          boxGradient,
          state === 'opening' && 'animate-lid-flip'
        )}
        style={{
          transformOrigin: 'bottom center',
        }}
      >
        <div className="absolute inset-0 bg-white/10 rounded-t-xl" />
        <div
          className={cn(
            'absolute left-1/2 -translate-x-1/2 top-0 w-8 h-6 rounded-b-xl bg-gradient-to-b shadow-md',
            ribbonGradient
          )}
        />
        <div
          className={cn(
            'absolute left-1/2 -translate-x-1/2 -top-4 w-16 h-8',
            'flex items-center justify-center'
          )}
        >
          <span className="text-3xl drop-shadow-lg">🎀</span>
        </div>
      </div>

      {state === 'opened' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-yellow-300/60 animate-ping" />
        </div>
      )}
    </div>
  )
}
