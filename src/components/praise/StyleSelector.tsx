import { PraiseStyle } from '@/types'
import { STYLE_CONFIG } from '@/data/vocabulary'
import { cn } from '@/lib/utils'

interface StyleSelectorProps {
  value: PraiseStyle
  onChange: (style: PraiseStyle) => void
  className?: string
}

export function StyleSelector({ value, onChange, className }: StyleSelectorProps) {
  const styles = Object.entries(STYLE_CONFIG) as [PraiseStyle, typeof STYLE_CONFIG[PraiseStyle]][]

  return (
    <div className={cn('w-full', className)}>
      <div className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
        <span>🎨</span>
        <span>选择夸赞风格</span>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {styles.map(([key, config]) => {
          const isActive = value === key
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={cn(
                'inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-sm',
                'transition-all duration-200 ease-out active:scale-95',
                'focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-1',
                isActive
                  ? `bg-gradient-to-r ${config.color} text-white shadow-md`
                  : 'bg-white/80 text-gray-600 border border-gray-100 hover:bg-white hover:border-pink-200'
              )}
            >
              <span className="text-base">{config.emoji}</span>
              <span>{config.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
