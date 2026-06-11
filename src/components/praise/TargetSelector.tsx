import { PraiseTarget } from '@/types'
import { TARGET_CONFIG } from '@/data/vocabulary'
import { cn } from '@/lib/utils'

interface TargetSelectorProps {
  value: PraiseTarget
  onChange: (target: PraiseTarget) => void
  className?: string
}

export function TargetSelector({ value, onChange, className }: TargetSelectorProps) {
  const targets = Object.entries(TARGET_CONFIG) as [PraiseTarget, typeof TARGET_CONFIG[PraiseTarget]][]

  return (
    <div className={cn('w-full', className)}>
      <div className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
        <span>🎯</span>
        <span>选择夸赞对象</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory touch-pan-x">
        {targets.map(([key, config]) => {
          const isActive = value === key
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={cn(
                'snap-start shrink-0 flex flex-col items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 min-w-[80px]',
                'focus:outline-none focus:ring-2 focus:ring-pink-300 select-none',
                'touch-manipulation active:scale-95',
                isActive
                  ? 'bg-gradient-to-br from-pink-100 to-purple-100 shadow-soft scale-105'
                  : 'bg-white/70 backdrop-blur-sm hover:bg-white hover:shadow-soft'
              )}
            >
              <span
                className={cn(
                  'text-3xl transition-transform duration-300',
                  isActive && 'scale-110 animate-bounce-in'
                )}
              >
                {config.icon}
              </span>
              <span
                className={cn(
                  'text-xs font-medium transition-colors duration-200',
                  isActive ? 'text-pink-600' : 'text-gray-500'
                )}
              >
                {config.name}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-400 to-purple-400" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
