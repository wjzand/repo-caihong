import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { Gift } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getInitialMysteryState, canOpenDailyFree } from '@/utils/mysteryBox'

interface MysteryBoxEntryProps {
  className?: string
}

export function MysteryBoxEntry({ className }: MysteryBoxEntryProps) {
  const navigate = useNavigate()
  const state = getInitialMysteryState()

  const canOpenFree = useMemo(() => canOpenDailyFree(), [])
  const totalBoxes = state.normalBoxCount + state.rareBoxCount
  const hasBoxes = totalBoxes > 0 || canOpenFree

  return (
    <div
      onClick={() => navigate('/mystery')}
      className={cn(
        'group cursor-pointer relative overflow-hidden rounded-3xl p-5 shadow-soft hover:shadow-dreamy transition-all duration-300',
        'bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 border-2 border-dashed border-purple-200 hover:border-purple-300',
        className
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-200/40 to-pink-200/40 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative flex items-center gap-4">
        <div className="relative w-14 h-14 flex-shrink-0">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 animate-pulse-slow" />
          <div className="absolute inset-0.5 rounded-xl bg-gradient-to-br from-purple-300 via-pink-300 to-orange-300 flex items-center justify-center">
            <Gift size={28} className="text-white drop-shadow-md" />
          </div>
          {hasBoxes && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow-md animate-bounce-in">
              {(canOpenFree ? 1 : 0) + totalBoxes}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            夸夸盲盒
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white">
              NEW
            </span>
          </h3>
          <p className="text-sm text-gray-500 mt-1 truncate">
            {canOpenFree
              ? '今日免费盲盒待开启！'
              : totalBoxes > 0
              ? `还有 ${totalBoxes} 个盲盒等你拆开～`
              : '每天来开盲盒，收集限定夸夸卡！'}
          </p>
          <div className="flex gap-1.5 mt-2">
            {canOpenFree && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-600 font-medium">
                🆓 每日免费
              </span>
            )}
            {state.normalBoxCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 font-medium">
                📦 普通×{state.normalBoxCount}
              </span>
            )}
            {state.rareBoxCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 font-medium">
                ✨ 稀有×{state.rareBoxCount}
              </span>
            )}
          </div>
        </div>

        <div className="text-purple-400 group-hover:translate-x-1 transition-transform flex-shrink-0">
          <span className="text-2xl">→</span>
        </div>
      </div>
    </div>
  )
}
