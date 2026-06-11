import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { TargetSelector } from '@/components/praise/TargetSelector'
import { StyleSelector } from '@/components/praise/StyleSelector'
import { PraiseCard } from '@/components/praise/PraiseCard'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/store'
import { generatePraiseWithKeyword } from '@/utils/generator'
import { Wand2 } from 'lucide-react'

const KEYWORD_SUGGESTIONS = [
  '做饭好吃',
  '今天穿搭',
  '唱歌好听',
  '工作认真',
  '跳舞超棒',
  '拍照好看',
  '游戏带飞',
  '脾气超好',
]

export default function DiyPage() {
  const navigate = useNavigate()
  const { currentTarget, currentStyle, setCurrentTarget, setCurrentStyle, setCurrentPraise, addHistory } = useAppStore()

  const [keyword, setKeyword] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [displayPraise, setDisplayPraise] = useState<ReturnType<typeof generatePraiseWithKeyword> | null>(null)

  const handleGenerate = () => {
    if (!keyword.trim()) return
    setIsGenerating(true)
    setTimeout(() => {
      const praise = generatePraiseWithKeyword(keyword.trim(), currentTarget, currentStyle)
      setDisplayPraise(praise)
      setCurrentPraise(praise)
      addHistory(praise)
      setIsGenerating(false)
    }, 800)
  }

  const handlePoster = () => {
    if (displayPraise) {
      navigate('/poster', { state: { praiseId: displayPraise.id, text: displayPraise.text } })
    }
  }

  const handleRegenerate = () => {
    if (keyword.trim()) handleGenerate()
  }

  return (
    <PageContainer
      title="DIY夸夸"
      subtitle="✨ 定制专属彩虹屁"
      showBack
      onBack={() => navigate(-1)}
    >
      <div className="space-y-5 animate-fade-in-up">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 shadow-soft">
          <label className="block text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
            <Wand2 size={16} className="text-pink-500" />
            <span>输入夸赞关键词</span>
          </label>
          <div className="relative">
            <textarea
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="例如：做饭好吃、今天穿搭、唱歌超好听..."
              rows={3}
              maxLength={50}
              className="w-full px-4 py-3 rounded-2xl border-2 border-pink-100 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none resize-none text-gray-700 placeholder-gray-400 bg-white/50 backdrop-blur-sm transition-all duration-200"
            />
            <span className="absolute bottom-3 right-4 text-xs text-gray-400">
              {keyword.length}/50
            </span>
          </div>

          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">💡 试试这些关键词：</p>
            <div className="flex flex-wrap gap-2">
              {KEYWORD_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setKeyword(suggestion)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    keyword === suggestion
                      ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-soft'
                      : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        <TargetSelector value={currentTarget} onChange={setCurrentTarget} />
        <StyleSelector value={currentStyle} onChange={setCurrentStyle} />

        <div className="flex justify-center">
          <Button
            size="xl"
            variant="gradient"
            onClick={handleGenerate}
            loading={isGenerating}
            disabled={!keyword.trim()}
            className="px-12"
          >
            ✨ 生成专属夸夸
          </Button>
        </div>

        {displayPraise && (
          <PraiseCard
            praise={displayPraise}
            isLoading={isGenerating}
            onRegenerate={handleRegenerate}
            onPoster={handlePoster}
          />
        )}
      </div>
    </PageContainer>
  )
}
