import { useNavigate } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { TargetSelector } from '@/components/praise/TargetSelector'
import { StyleSelector } from '@/components/praise/StyleSelector'
import { PraiseCard } from '@/components/praise/PraiseCard'
import { MysteryBoxEntry } from '@/components/mystery/MysteryBoxEntry'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/store'
import { generatePraise } from '@/utils/generator'
import { useState } from 'react'
import { Sparkles, Wand2 } from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()
  const { currentTarget, currentStyle, setCurrentTarget, setCurrentStyle, setCurrentPraise, addHistory } = useAppStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [displayPraise, setDisplayPraise] = useState<ReturnType<typeof generatePraise> | null>(null)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const praise = generatePraise(currentTarget, currentStyle)
      setDisplayPraise(praise)
      setCurrentPraise(praise)
      addHistory(praise)
      setIsGenerating(false)
    }, 600)
  }

  const handleRegenerate = () => {
    handleGenerate()
  }

  const handlePoster = () => {
    if (displayPraise) {
      navigate('/poster', { state: { praiseId: displayPraise.id, text: displayPraise.text } })
    }
  }

  return (
    <PageContainer title="夸夸语录" subtitle="🌈 彩虹屁制造机">
      <div className="space-y-6 animate-fade-in-up">
        <TargetSelector
          value={currentTarget}
          onChange={(t) => {
            setCurrentTarget(t)
            setDisplayPraise(null)
          }}
        />

        <StyleSelector
          value={currentStyle}
          onChange={(s) => {
            setCurrentStyle(s)
            setDisplayPraise(null)
          }}
        />

        <div className="flex justify-center pt-4 pb-2 px-4">
          <div className="relative">
            <div className="absolute -top-1 -right-1 text-3xl animate-bounce-in z-10">🌈</div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="group relative w-28 h-28 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 shadow-dreamy hover:shadow-float transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:cursor-wait"
            >
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 opacity-50 group-hover:opacity-70 transition-opacity animate-pulse-slow" />
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                {isGenerating ? (
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-white animate-wave" />
                    <span className="w-2 h-2 rounded-full bg-white animate-wave-delay" />
                    <span className="w-2 h-2 rounded-full bg-white animate-wave-delay-2" />
                  </div>
                ) : (
                  <>
                    <Sparkles size={32} className="mb-1 drop-shadow-lg" />
                    <span className="text-xs font-bold tracking-wide">生成彩虹屁</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        <PraiseCard
          praise={displayPraise}
          isLoading={isGenerating}
          onRegenerate={displayPraise ? handleRegenerate : undefined}
          onPoster={displayPraise ? handlePoster : undefined}
        />

        <div
          onClick={() => navigate('/diy')}
          className="group cursor-pointer bg-gradient-to-r from-yellow-100 via-orange-50 to-pink-100 rounded-3xl p-5 shadow-soft hover:shadow-dreamy transition-all duration-300 border-2 border-dashed border-orange-200 hover:border-orange-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white shadow-soft group-hover:scale-110 transition-transform">
              <Wand2 size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                DIY夸夸
                <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                  专属定制
                </span>
              </h3>
              <p className="text-sm text-gray-500 mt-1">输入关键词，生成更懂你的夸夸～</p>
            </div>
            <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>

        <MysteryBoxEntry />

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/battle')}
            className="p-4 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 hover:shadow-soft transition-all duration-200 active:scale-98 text-left"
          >
            <div className="text-2xl mb-1">⚔️</div>
            <div className="font-bold text-gray-700 text-sm">夸夸对战</div>
            <div className="text-xs text-gray-500 mt-0.5">和朋友互夸比拼</div>
          </button>
          <button
            onClick={() => navigate('/daily')}
            className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 hover:shadow-soft transition-all duration-200 active:scale-98 text-left"
          >
            <div className="text-2xl mb-1">📅</div>
            <div className="font-bold text-gray-700 text-sm">今日夸夸签</div>
            <div className="text-xs text-gray-500 mt-0.5">领取今日赞美签</div>
          </button>
        </div>
      </div>
    </PageContainer>
  )
}
