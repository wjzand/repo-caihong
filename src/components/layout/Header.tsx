import { cn } from '@/lib/utils'

interface HeaderProps {
  title?: string
  subtitle?: string
  showBack?: boolean
  onBack?: () => void
  rightContent?: React.ReactNode
  className?: string
}

export function Header({
  title = '夸夸语录',
  subtitle = '彩虹屁制造机',
  showBack,
  onBack,
  rightContent,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        'relative pt-safe pb-4 px-4 text-center',
        className
      )}
    >
      {showBack && (
        <button
          onClick={onBack}
          className="absolute left-4 top-safe mt-2 w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-soft transition-all duration-200 active:scale-95"
        >
          <span className="text-lg">←</span>
        </button>
      )}

      {rightContent && (
        <div className="absolute right-4 top-safe mt-2">{rightContent}</div>
      )}

      <div className="pt-4">
        <h1 className="font-kuaile text-3xl md:text-4xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500 font-medium tracking-wider">
            {subtitle}
          </p>
        )}
      </div>

      <div className="absolute top-safe left-4 text-2xl opacity-60 animate-float" style={{ animationDelay: '0s' }}>
        💖
      </div>
      <div className="absolute top-safe right-6 text-xl opacity-60 animate-float-slow" style={{ animationDelay: '1s' }}>
        ✨
      </div>
      <div className="absolute top-10 left-1/4 text-lg opacity-40 animate-float" style={{ animationDelay: '2s' }}>
        🌸
      </div>
    </header>
  )
}
