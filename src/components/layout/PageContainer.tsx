import { ReactNode } from 'react'
import { FloatingBubbles } from '@/components/ui/FloatingBubbles'
import { Header } from './Header'
import { BottomNav } from './BottomNav'
import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: ReactNode
  showHeader?: boolean
  showBottomNav?: boolean
  title?: string
  subtitle?: string
  showBack?: boolean
  onBack?: () => void
  headerRight?: React.ReactNode
  className?: string
  showBubbles?: boolean
}

export function PageContainer({
  children,
  showHeader = true,
  showBottomNav = true,
  title,
  subtitle,
  showBack,
  onBack,
  headerRight,
  className,
  showBubbles = true,
}: PageContainerProps) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 overflow-hidden">
      <div
        className="fixed inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(255,182,193,0.4) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(173,216,230,0.4) 0%, transparent 40%), radial-gradient(circle at 50% 50%, rgba(230,230,250,0.3) 0%, transparent 60%)',
        }}
      />

      {showBubbles && <FloatingBubbles count={12} />}

      <div className="relative z-10 max-w-md mx-auto min-h-screen flex flex-col">
        {showHeader && (
          <Header
            title={title}
            subtitle={subtitle}
            showBack={showBack}
            onBack={onBack}
            rightContent={headerRight}
          />
        )}

        <main
          className={cn(
            'flex-1 px-4 pb-28 overflow-y-auto',
            showBottomNav && 'pb-32',
            className
          )}
        >
          {children}
        </main>

        {showBottomNav && <BottomNav />}
      </div>
    </div>
  )
}
