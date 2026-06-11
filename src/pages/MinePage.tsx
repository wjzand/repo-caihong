import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/store'
import { TARGET_CONFIG, STYLE_CONFIG } from '@/data/vocabulary'
import { Heart, History, Trash2, Share2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

type TabType = 'favorites' | 'history'

export default function MinePage() {
  const navigate = useNavigate()
  const { favorites, history, removeFavorite, clearHistory, battles } = useAppStore()
  const [activeTab, setActiveTab] = useState<TabType>('favorites')

  const handleSharePoster = (text: string, id: string) => {
    navigate('/poster', { state: { praiseId: id, text } })
  }

  const stats = {
    favorites: favorites.length,
    history: history.length,
    battles: battles.length,
  }

  return (
    <PageContainer title="我的" subtitle="💝 收藏与历史">
      <div className="space-y-5 animate-fade-in-up">
        <div className="bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-3xl p-5 text-white shadow-dreamy relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-3xl shadow-inner">
              😊
            </div>
            <div>
              <h2 className="text-lg font-bold">夸夸小能手</h2>
              <p className="text-xs text-white/80 mt-0.5">已用彩虹屁温暖 {stats.history} 次心灵</p>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-3 mt-5">
            <StatCard icon={Heart} label="收藏" value={stats.favorites} />
            <StatCard icon={History} label="历史" value={stats.history} />
            <StatCard icon={Sparkles} label="对战" value={stats.battles} />
          </div>
        </div>

        <div className="flex gap-2 bg-white/70 backdrop-blur-sm rounded-full p-1.5">
          <TabButton
            active={activeTab === 'favorites'}
            onClick={() => setActiveTab('favorites')}
            icon={<Heart size={16} />}
            label={`收藏 (${stats.favorites})`}
          />
          <TabButton
            active={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
            icon={<History size={16} />}
            label={`历史 (${stats.history})`}
          />
        </div>

        {activeTab === 'favorites' && (
          <div className="space-y-3">
            {favorites.length === 0 ? (
              <EmptyState
                icon="💝"
                title="还没有收藏的夸夸"
                description="生成夸夸时点击❤️即可收藏"
              />
            ) : (
              favorites.map((item) => {
                const targetConfig = TARGET_CONFIG[item.content.target]
                const styleConfig = STYLE_CONFIG[item.content.style]
                return (
                  <Card key={item.id} variant="default" className="animate-fade-in-up">
                    <CardContent className="p-0">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">{targetConfig.icon}</span>
                        <span className="text-xs font-medium text-gray-600">{targetConfig.name}</span>
                        <span
                          className={cn(
                            'ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-white bg-gradient-to-r',
                            styleConfig.color
                          )}
                        >
                          <span>{styleConfig.emoji}</span>
                          <span>{styleConfig.name}</span>
                        </span>
                      </div>
                      <p className="text-gray-700 font-mashan text-base leading-relaxed mb-3">
                        {item.content.text}
                      </p>
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <div className="ml-auto flex gap-2">
                          <button
                            onClick={() => handleSharePoster(item.content.text, item.content.id)}
                            className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors"
                          >
                            <Share2 size={14} />
                          </button>
                          <button
                            onClick={() => removeFavorite(item.id)}
                            className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            {history.length === 0 ? (
              <EmptyState
                icon="📜"
                title="还没有历史记录"
                description="快去首页生成你的第一条彩虹屁吧！"
              />
            ) : (
              <>
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="text-xs text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={12} />
                    清空历史
                  </Button>
                </div>
                {history.map((item) => {
                  const targetConfig = TARGET_CONFIG[item.content.target]
                  const styleConfig = STYLE_CONFIG[item.content.style]
                  return (
                    <Card key={item.id} variant="default" className="animate-fade-in-up">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm">{targetConfig.icon}</span>
                          <span className="text-xs text-gray-500">{targetConfig.name}</span>
                          <span className="text-xs text-gray-400">·</span>
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] text-white bg-gradient-to-r',
                              styleConfig.color
                            )}
                          >
                            {styleConfig.emoji} {styleConfig.name}
                          </span>
                          <span className="ml-auto text-xs text-gray-400">
                            {formatTime(item.generatedAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {item.content.text}
                        </p>
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => handleSharePoster(item.content.text, item.content.id)}
                            className="text-xs text-pink-500 hover:text-pink-600 flex items-center gap-1"
                          >
                            <Share2 size={12} />
                            生成海报
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any
  label: string
  value: number
}) {
  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
      <Icon size={18} className="mx-auto mb-1 opacity-90" />
      <div className="text-xl font-bold">{value}</div>
      <div className="text-[10px] opacity-80">{label}</div>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-medium transition-all duration-200',
        active
          ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-soft'
          : 'text-gray-500 hover:text-gray-700'
      )}
    >
      {icon}
      {label}
    </button>
  )
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="text-center py-12">
      <div className="text-5xl mb-3">{icon}</div>
      <h3 className="text-gray-700 font-medium mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  )
}

function formatTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp

  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`

  const date = new Date(timestamp)
  return `${date.getMonth() + 1}/${date.getDate()}`
}
