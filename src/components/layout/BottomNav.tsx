import { NavLink } from 'react-router-dom'
import { useAppStore } from '@/store'
import { Sparkles, CalendarCheck, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomNavProps {
  className?: string
}

export function BottomNav({ className }: BottomNavProps) {
  const { activeTab, setActiveTab } = useAppStore()

  const navItems = [
    { id: 'home' as const, label: '制造机', icon: Sparkles, to: '/' },
    { id: 'daily' as const, label: '夸夸签', icon: CalendarCheck, to: '/daily' },
    { id: 'mine' as const, label: '我的', icon: User, to: '/mine' },
  ]

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-pink-100',
        'pb-safe pt-2 px-2',
        className
      )}
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id
          const Icon = item.icon

          return (
            <NavLink
              key={item.id}
              to={item.to}
              onClick={() => setActiveTab(item.id)}
              className={({ isActive: routeActive }) =>
                cn(
                  'relative flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-all duration-300',
                  (isActive || routeActive)
                    ? 'text-pink-500'
                    : 'text-gray-400 hover:text-gray-600'
                )
              }
            >
              {({ isActive: routeActive }) => (
                <>
                  <div
                    className={cn(
                      'relative transition-all duration-300',
                      (isActive || routeActive) && 'scale-110 -translate-y-1'
                    )}
                  >
                    <Icon
                      size={22}
                      strokeWidth={(isActive || routeActive) ? 2.5 : 1.8}
                      className={cn(
                        (isActive || routeActive) && 'drop-shadow-[0_0_8px_rgba(236,72,153,0.4)]'
                      )}
                    />
                    {(isActive || routeActive) && (
                      <span className="absolute -top-1 -right-1 text-xs">✨</span>
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium transition-all duration-300',
                      (isActive || routeActive) && 'text-pink-500'
                    )}
                  >
                    {item.label}
                  </span>
                  {(isActive || routeActive) && (
                    <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-gradient-to-r from-pink-400 to-purple-400" />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </div>
      <div className="h-safe" />
    </nav>
  )
}
