import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { MysteryBox3D } from '@/components/mystery/MysteryBox3D'
import { FlipCard } from '@/components/mystery/FlipCard'
import { MysteryCard, PraiseTask, MysteryBoxRarity } from '@/types'
import {
  getInitialMysteryState,
  openMysteryBox,
  saveMysteryBoxResult,
  canOpenDailyFree,
  canOpenBox,
  consumeBox,
  getCollectionProgress,
  getAchievements,
  completeTask,
  incrementShareCount,
} from '@/utils/mysteryBox'
import { SERIES_CONFIG, RARITY_CONFIG } from '@/data/mysteryBox'
import { Button } from '@/components/ui/Button'
import { Share2, Trophy, Gift, Sparkles, Check, ArrowLeft, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { shareContent } from '@/utils/share'

type BoxState = 'idle' | 'shaking' | 'opening' | 'opened'
type BoxType = 'daily' | 'normal' | 'rare'

export default function MysteryBoxPage() {
  const navigate = useNavigate()
  const [boxState, setBoxState] = useState<BoxState>('idle')
  const [currentCard, setCurrentCard] = useState<MysteryCard | null>(null)
  const [currentTask, setCurrentTask] = useState<PraiseTask | null>(null)
  const [isNewCard, setIsNewCard] = useState(false)
  const [state, setState] = useState(getInitialMysteryState())
  const [showTask, setShowTask] = useState(false)
  const [showCollection, setShowCollection] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)

  const canOpenFree = canOpenDailyFree()
  const canOpenNormal = canOpenBox('normal')
  const canOpenRare = canOpenBox('rare')

  const openBox = (type: BoxType) => {
    if (boxState !== 'idle') return

    if (type === 'daily' && !canOpenFree) return
    if (type === 'normal' && !canOpenNormal) return
    if (type === 'rare' && !canOpenRare) return

    setBoxState('shaking')

    setTimeout(() => {
      setBoxState('opening')

      const { card, task, isNew } = openMysteryBox(type === 'rare')
      saveMysteryBoxResult(card, task, isNew)

      if (type !== 'daily') {
        consumeBox(type)
      }

      setTimeout(() => {
        setCurrentCard(card)
        setCurrentTask(task)
        setIsNewCard(isNew)
        setBoxState('opened')
        setState(getInitialMysteryState())
        setShowTask(!!task)
      }, 800)
    }, 1500)
  }

  const resetBox = () => {
    setBoxState('idle')
    setCurrentCard(null)
    setCurrentTask(null)
    setIsNewCard(false)
  }

  const handleCompleteTask = () => {
    completeTask()
    setState(getInitialMysteryState())
    setShowTask(false)
  }

  const handleShare = async () => {
    if (!currentCard) return
    try {
      await shareContent({
        title: '我开出了夸夸盲盒！',
        text: currentCard.text,
      })
      incrementShareCount()
      setState(getInitialMysteryState())
    } catch {}
  }

  const progress = getCollectionProgress()
  const achievements = getAchievements()

  const isHidden =
    currentCard &&
    (currentCard.rarity === MysteryBoxRarity.HIDDEN || currentCard.rarity === MysteryBoxRarity.EGG)

  return (
    <PageContainer
      title="夸夸盲盒"
      subtitle="🎁 拆开神秘礼物，收获限定夸夸"
      showBack
    >
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-3 text-center shadow-soft">
            <div className="text-2xl mb-1">📦</div>
            <div className="text-lg font-bold text-gray-800">{state.stats.totalOpened}</div>
            <div className="text-xs text-gray-500">已开启</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-3 text-center shadow-soft">
            <div className="text-2xl mb-1">🃏</div>
            <div className="text-lg font-bold text-gray-800">{state.collectedCards.length}</div>
            <div className="text-xs text-gray-500">已收集</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-3 text-center shadow-soft">
            <div className="text-2xl mb-1">👑</div>
            <div className="text-lg font-bold text-yellow-600">{state.stats.hiddenCount}</div>
            <div className="text-xs text-gray-500">隐藏款</div>
          </div>
        </div>

        {isHidden && boxState === 'opened' && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-bounce-in">
            <div className="w-full max-w-sm text-center">
              <div className="text-6xl mb-4 animate-bounce-in">🎉✨🎊</div>
              <div className="text-2xl font-bold text-white mb-2 font-kuaile animate-rainbow-shine bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_200%]">
                恭喜获得隐藏款！
              </div>
              <div className="text-white/80 text-sm mb-6">欧气爆棚！你开出了超稀有限定卡～</div>
              <Button
                variant="gradient"
                onClick={() => {}}
                className="w-full"
              >
                太棒了！
              </Button>
            </div>
          </div>
        )}

        {boxState !== 'opened' ? (
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 rounded-3xl p-8 shadow-dreamy border border-white/50">
            <div className="flex flex-col items-center">
              <div className="mb-8 mt-4">
                <MysteryBox3D
                  state={boxState}
                  onClick={() => {
                    if (canOpenFree) openBox('daily')
                    else if (canOpenNormal) openBox('normal')
                    else if (canOpenRare) openBox('rare')
                  }}
                  isRare={!canOpenFree && canOpenRare && !canOpenNormal}
                  disabled={!canOpenFree && !canOpenNormal && !canOpenRare}
                />
              </div>

              <div className="w-full space-y-3">
                {canOpenFree && (
                  <Button
                    variant="gradient"
                    size="lg"
                    onClick={() => openBox('daily')}
                    disabled={boxState !== 'idle'}
                    className="w-full"
                  >
                    <Gift className="mr-2" size={20} />
                    开启今日免费盲盒
                  </Button>
                )}

                {canOpenNormal && (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => openBox('normal')}
                    disabled={boxState !== 'idle'}
                    className="w-full"
                  >
                    <Sparkles className="mr-2" size={18} />
                    开普通盲盒（剩余 {state.normalBoxCount}）
                  </Button>
                )}

                {canOpenRare && (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => openBox('rare')}
                    disabled={boxState !== 'idle'}
                    className="w-full"
                  >
                    <Trophy className="mr-2" size={18} />
                    开稀有盲盒（剩余 {state.rareBoxCount}）
                  </Button>
                )}

                {!canOpenFree && !canOpenNormal && !canOpenRare && (
                  <div className="text-center text-gray-500 py-4">
                    <p className="mb-2">今天的盲盒都开完啦～</p>
                    <p className="text-sm">完成夸夸任务可获得更多盲盒哦！</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          currentCard && (
            <div className="animate-fade-in-up">
              <div className="flex justify-center mb-6">
                <div className="animate-card-fly">
                  <FlipCard card={currentCard} isNew={isNewCard} size="lg" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" onClick={resetBox} size="lg">
                  <ArrowLeft className="mr-2" size={18} />
                  再开一个
                </Button>
                <Button variant="gradient" onClick={handleShare} size="lg">
                  <Share2 className="mr-2" size={18} />
                  炫耀一下
                </Button>
              </div>
            </div>
          )
        )}

        {state.currentTask && !state.taskCompleted && (
          <div
            className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-5 shadow-soft border-2 border-dashed border-orange-200 cursor-pointer hover:border-orange-300 transition-all"
            onClick={() => setShowTask(true)}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center text-2xl shadow-soft">
                {state.currentTask.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-orange-700 flex items-center gap-2">
                  当前夸夸任务
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600">
                    完成得盲盒
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1 truncate">
                  {state.currentTask.title}
                </div>
              </div>
              <span className="text-orange-400">→</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowCollection(true)}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-left shadow-soft hover:shadow-dreamy transition-all active:scale-95"
          >
            <div className="text-2xl mb-1">🃏</div>
            <div className="font-bold text-gray-800">收藏夹</div>
            <div className="text-xs text-gray-500 mt-1">
              查看收集的夸夸卡
            </div>
          </button>
          <button
            onClick={() => setShowAchievements(true)}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-left shadow-soft hover:shadow-dreamy transition-all active:scale-95"
          >
            <div className="text-2xl mb-1">🏆</div>
            <div className="font-bold text-gray-800">成就徽章</div>
            <div className="text-xs text-gray-500 mt-1">
              {achievements.filter((a) => a.unlocked).length}/{achievements.length} 已解锁
            </div>
          </button>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-soft">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span>📚</span>
            <span>收集进度</span>
          </h3>
          <div className="space-y-3">
            {Object.entries(progress).map(([series, p]) => {
              const config = SERIES_CONFIG[series as keyof typeof SERIES_CONFIG]
              const percent = Math.round((p.collected / p.total) * 100)
              return (
                <div key={series}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600 flex items-center gap-1">
                      <span>{config.icon}</span>
                      <span>{config.name}</span>
                    </span>
                    <span className="text-gray-500">
                      {p.collected}/{p.total}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full bg-gradient-to-r', config.color)}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {showTask && currentTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 animate-bounce-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">夸夸任务</h3>
              <button
                onClick={() => setShowTask(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <X size={16} />
              </button>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-5 mb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center text-3xl shadow-soft">
                  {currentTask.emoji}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-800 text-lg">{currentTask.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{currentTask.description}</div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-2xl p-4 mb-5">
              <div className="text-sm text-purple-700 flex items-center gap-2">
                <span className="text-lg">🎁</span>
                <span>
                  完成奖励：
                  <span className="font-bold">
                    {currentTask.reward === 'rare_box' ? '稀有盲盒' : '普通盲盒'}×1
                  </span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => setShowTask(false)}>
                稍后再说
              </Button>
              <Button variant="gradient" onClick={handleCompleteTask}>
                <Check className="mr-1" size={16} />
                标记完成
              </Button>
            </div>
          </div>
        </div>
      )}

      {showCollection && (
        <CollectionModal onClose={() => setShowCollection(false)} />
      )}

      {showAchievements && (
        <AchievementsModal
          achievements={achievements}
          onClose={() => setShowAchievements(false)}
        />
      )}
    </PageContainer>
  )
}

function CollectionModal({ onClose }: { onClose: () => void }) {
  const [selectedCard, setSelectedCard] = useState<MysteryCard | null>(null)
  const collectedCards = getInitialMysteryState().collectedCards
  const progress = getCollectionProgress()

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full sm:max-w-lg max-h-[90vh] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden animate-bounce-in flex flex-col">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span>🃏</span>
            <span>夸夸收藏夹</span>
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-5">
            {Object.entries(SERIES_CONFIG).map(([series, config]) => {
              const p = progress[series] || { collected: 0, total: 0 }
              const cardsInSeries = MYSTERY_CARDS.filter((c) => c.series === series)
              return (
                <div key={series}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{config.icon}</span>
                      <span className="font-bold text-gray-700">{config.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {p.collected}/{p.total}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {cardsInSeries.map((card) => {
                      const owned = collectedCards.includes(card.id)
                      const rarityConf = RARITY_CONFIG[card.rarity]
                      return (
                        <div
                          key={card.id}
                          className={cn(
                            'aspect-[3/4] rounded-xl flex items-center justify-center cursor-pointer transition-all hover:scale-105',
                            owned
                              ? 'shadow-md'
                              : 'bg-gray-100 border-2 border-dashed border-gray-200'
                          )}
                          style={owned ? { background: card.background } : undefined}
                          onClick={() => owned && setSelectedCard(card)}
                        >
                          {owned ? (
                            <div className="text-center">
                              <div className="text-2xl mb-1">{card.emoji}</div>
                              <span
                                className={cn(
                                  'text-[9px] px-1.5 py-0.5 rounded-full text-white bg-gradient-to-r',
                                  rarityConf.color
                                )}
                              >
                                {rarityConf.badge}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-300 text-2xl">?</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {selectedCard && (
        <div
          className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-6"
          onClick={() => setSelectedCard(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <FlipCard card={selectedCard} size="lg" />
          </div>
        </div>
      )}
    </div>
  )
}

import { MYSTERY_CARDS } from '@/data/mysteryBox'

function AchievementsModal({
  achievements,
  onClose,
}: {
  achievements: ReturnType<typeof getAchievements>
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full sm:max-w-md max-h-[80vh] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden animate-bounce-in flex flex-col">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span>🏆</span>
            <span>成就徽章</span>
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-3">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={cn(
                  'rounded-2xl p-4 flex items-center gap-4 transition-all',
                  ach.unlocked
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 shadow-soft'
                    : 'bg-gray-50 border border-gray-100'
                )}
              >
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
                    ach.unlocked
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-400 shadow-md'
                      : 'bg-gray-200 grayscale opacity-50'
                  )}
                >
                  {ach.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      'font-bold',
                      ach.unlocked ? 'text-gray-800' : 'text-gray-400'
                    )}
                  >
                    {ach.name}
                  </div>
                  <div
                    className={cn(
                      'text-xs mt-0.5',
                      ach.unlocked ? 'text-gray-600' : 'text-gray-400'
                    )}
                  >
                    {ach.description}
                  </div>
                  <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        ach.unlocked
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                          : 'bg-gray-400'
                      )}
                      style={{ width: `${(ach.progress / ach.total) * 100}%` }}
                    />
                  </div>
                </div>
                <div
                  className={cn(
                    'text-xs font-medium',
                    ach.unlocked ? 'text-orange-600' : 'text-gray-400'
                  )}
                >
                  {ach.progress}/{ach.total}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
