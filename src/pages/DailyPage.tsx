import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/Button'
import { TagSelector } from '@/components/ui/TagSelector'
import { PraiseStyle } from '@/types'
import { generatePraise, generateDailyPraise } from '@/utils/generator'
import { STYLE_CONFIG, TARGET_CONFIG } from '@/data/vocabulary'
import { useSpeech } from '@/hooks/useSpeech'
import { Typewriter } from '@/components/praise/Typewriter'
import { Download, Share2, Volume2, VolumeX, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

const YIJI_OPTIONS = [
  { label: '宜夸人', value: 'praise' },
  { label: '宜表白', value: 'confess' },
  { label: '宜甜蜜', value: 'sweet' },
  { label: '宜搞怪', value: 'funny' },
  { label: '宜自恋', value: 'narcissistic' },
]

const JI_OPTIONS = [
  { label: '忌毒舌', value: 'mean' },
  { label: '忌谦虚', value: 'humble' },
  { label: '忌低调', value: 'lowkey' },
  { label: '忌社恐', value: 'shy' },
]

function getLunarDate(): string {
  return '癸卯年'
}

export default function DailyPage() {
  const navigate = useNavigate()
  const [praise, setPraise] = useState(generateDailyPraise())
  const [selectedStyle, setSelectedStyle] = useState<PraiseStyle>(praise.style)
  const { supported, speaking, play, stop } = useSpeech()
  const cardRef = useRef<HTMLDivElement>(null)

  const today = useMemo(() => {
    const d = new Date()
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      weekday: ['日', '一', '二', '三', '四', '五', '六'][d.getDay()],
      lunar: getLunarDate(),
    }
  }, [])

  const yiJi = useMemo(() => {
    const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5)
    return {
      yi: shuffle(YIJI_OPTIONS).slice(0, 3),
      ji: shuffle(JI_OPTIONS).slice(0, 2),
    }
  }, [praise.id])

  useEffect(() => {
    return () => stop()
  }, [stop])

  const handleRegenerate = () => {
    stop()
    const newPraise = generatePraise(praise.target, selectedStyle)
    setPraise(newPraise)
  }

  const handleStyleChange = (style: PraiseStyle) => {
    stop()
    setSelectedStyle(style)
    const newPraise = generatePraise(praise.target, style)
    setPraise(newPraise)
  }

  const handleSpeech = () => {
    if (speaking) stop()
    else play(praise.text)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `今日夸夸签 - ${today.month}月${today.day}日`,
          text: praise.text,
        })
      } catch {}
    }
  }

  const handleSave = async () => {
    navigate('/poster', { 
      state: { 
        praiseId: praise.id, 
        text: praise.text,
        isDaily: true 
      } 
    })
  }

  const targetConfig = TARGET_CONFIG[praise.target]
  const styleConfig = STYLE_CONFIG[praise.style]

  return (
    <PageContainer title="夸夸签" subtitle="📅 每日一签，元气满满">
      <div className="space-y-5 animate-fade-in-up">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-400 via-orange-300 to-red-400 rounded-3xl opacity-30 blur-sm" />

          <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 rounded-3xl overflow-hidden shadow-dreamy border-2 border-amber-200">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-orange-400 to-red-500" />
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-2 rounded-full bg-amber-200/60" />

            <div className="pt-10 pb-6 px-6">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-400 to-orange-400 text-white text-sm font-bold shadow-soft">
                  <span>📜</span>
                  <span>今日夸夸签</span>
                </div>
              </div>

              <div className="text-center mb-5">
                <div className="text-5xl font-bold text-red-600 font-kuaile leading-none">
                  {today.day}
                </div>
                <div className="text-sm text-amber-700 mt-1">
                  {today.year}年{today.month}月 · 星期{today.weekday}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-white/60 rounded-2xl p-3">
                  <div className="text-xs font-bold text-green-600 mb-1.5 flex items-center gap-1">
                    <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">宜</span>
                    <span>今日宜</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {yiJi.yi.map((item) => (
                      <span key={item.value} className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700">
                        {item.label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-white/60 rounded-2xl p-3">
                  <div className="text-xs font-bold text-red-600 mb-1.5 flex items-center gap-1">
                    <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">忌</span>
                    <span>今日忌</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {yiJi.ji.map((item) => (
                      <span key={item.value} className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-700">
                        {item.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white/70 rounded-2xl p-5 border border-amber-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{targetConfig.icon}</span>
                  <span className="text-sm font-medium text-amber-700">今日宜夸{targetConfig.name}</span>
                  <span
                    className={cn(
                      'ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white bg-gradient-to-r',
                      styleConfig.color
                    )}
                  >
                    <span>{styleConfig.emoji}</span>
                    <span>{styleConfig.name}</span>
                  </span>
                </div>
                <p className="text-lg text-gray-800 font-mashan leading-relaxed text-center">
                  <Typewriter text={praise.text} speed={50} />
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 mt-5">
                <button
                  onClick={handleSpeech}
                  disabled={!supported}
                  className="w-11 h-11 rounded-full bg-white shadow-soft flex items-center justify-center text-lg hover:shadow-dreamy transition-all active:scale-95 disabled:opacity-40"
                >
                  {speaking ? <VolumeX size={20} className="text-pink-500" /> : <Volume2 size={20} className="text-pink-500" />}
                </button>
                <button
                  onClick={handleRegenerate}
                  className="w-11 h-11 rounded-full bg-white shadow-soft flex items-center justify-center text-lg hover:shadow-dreamy transition-all active:scale-95"
                >
                  <RefreshCw size={20} className="text-purple-500" />
                </button>
                <button
                  onClick={handleShare}
                  className="w-11 h-11 rounded-full bg-white shadow-soft flex items-center justify-center text-lg hover:shadow-dreamy transition-all active:scale-95"
                >
                  <Share2 size={20} className="text-blue-500" />
                </button>
                <button
                  onClick={handleSave}
                  className="w-11 h-11 rounded-full bg-white shadow-soft flex items-center justify-center text-lg hover:shadow-dreamy transition-all active:scale-95"
                >
                  <Download size={20} className="text-green-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-soft">
          <h3 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
            <span>🎨</span>
            <span>换个风格试试</span>
          </h3>
          <TagSelector
            options={Object.entries(STYLE_CONFIG).map(([k, v]) => ({
              value: k as PraiseStyle,
              label: v.name,
              emoji: v.emoji,
            }))}
            value={selectedStyle}
            onChange={handleStyleChange}
            variant="gradient"
            scrollable
          />
        </div>

        <p className="text-center text-xs text-gray-400">
          🌟 每天一张夸夸签，开启元气满满的一天！
        </p>
      </div>
    </PageContainer>
  )
}


