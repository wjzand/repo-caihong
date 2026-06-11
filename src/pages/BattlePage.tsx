import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/Button'
import { scorePraise, ScoringResult } from '@/utils/scoring'
import { useAppStore } from '@/store'
import { Swords, User, Bot, Trophy, RotateCcw, Play, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type GameMode = 'menu' | 'practice' | 'battle'
type Turn = 'player1' | 'player2' | 'system'

interface Message {
  id: string
  sender: Turn
  text: string
  score?: ScoringResult
  name?: string
}

const PLAYER1_DEFAULT = '我'
const PLAYER2_DEFAULT = '对手'
const SYSTEM_PROMPTS = [
  '来吧，夸夸我今天的穿搭！👗',
  '夸夸我做的饭有多好吃～🍳',
  '我今天工作超努力的，快夸我！💪',
  '我新买的发型怎么样？💇',
  '我刚刚健身完，夸夸我的毅力！🏋️',
  '我学了一首新歌，快夸我！🎵',
  '我帮朋友解决了大问题，快夸我！🌟',
]

export default function BattlePage() {
  const navigate = useNavigate()
  const { addBattle } = useAppStore()

  const [mode, setMode] = useState<GameMode>('menu')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [turn, setTurn] = useState<Turn>('player1')
  const [round, setRound] = useState(1)
  const [player1Score, setPlayer1Score] = useState(0)
  const [player2Score, setPlayer2Score] = useState(0)
  const [maxRounds] = useState(5)
  const [gameOver, setGameOver] = useState(false)
  const [player1Name, setPlayer1Name] = useState(PLAYER1_DEFAULT)
  const [player2Name, setPlayer2Name] = useState(PLAYER2_DEFAULT)
  const [systemPrompt, setSystemPrompt] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startPractice = () => {
    setMode('practice')
    setPlayer1Name('我')
    setPlayer2Name('AI小夸')
    resetGame('system')
  }

  const startBattle = () => {
    setMode('battle')
    setPlayer2Name('对手')
    resetGame('player1')
  }

  const resetGame = (firstTurn: Turn = 'player1') => {
    const prompt = SYSTEM_PROMPTS[Math.floor(Math.random() * SYSTEM_PROMPTS.length)]
    setSystemPrompt(prompt)
    setMessages(
      firstTurn === 'system'
        ? [
            {
              id: 'sys-0',
              sender: 'system',
              text: prompt,
              name: 'AI小夸',
            },
          ]
        : []
    )
    setInput('')
    setTurn(firstTurn === 'system' ? 'player1' : firstTurn)
    setRound(1)
    setPlayer1Score(0)
    setPlayer2Score(0)
    setGameOver(false)
  }

  const sendMessage = () => {
    if (!input.trim() || gameOver) return

    const isPlayer1 = turn === 'player1'
    const score = scorePraise(input.trim())
    const msg: Message = {
      id: `msg-${Date.now()}`,
      sender: turn,
      text: input.trim(),
      score,
      name: isPlayer1 ? player1Name : player2Name,
    }

    setMessages((prev) => [...prev, msg])

    if (isPlayer1) {
      setPlayer1Score((s) => s + score.score)
    } else {
      setPlayer2Score((s) => s + score.score)
    }

    setInput('')

    const nextRound = round + 1
    if (nextRound > maxRounds * 2) {
      setGameOver(true)
      const winner =
        player1Score + (isPlayer1 ? score.score : 0) > player2Score + (isPlayer1 ? 0 : score.score)
          ? 'player1'
          : player1Score + (isPlayer1 ? score.score : 0) < player2Score + (isPlayer1 ? 0 : score.score)
          ? 'player2'
          : 'draw'
      addBattle({
        player1Name,
        player2Name,
        player1Score: player1Score + (isPlayer1 ? score.score : 0),
        player2Score: player2Score + (isPlayer1 ? 0 : score.score),
        rounds: maxRounds,
        winner: winner === 'draw' ? 'draw' : (winner as 'player1' | 'player2'),
      })
      return
    }

    setRound(nextRound)

    if (mode === 'practice' && isPlayer1) {
      setTurn('system')
      setTimeout(() => {
        const aiResponses = [
          '哇，你也太会夸了吧！💕 那我也来夸夸你：你今天的笑容简直比阳光还灿烂，温柔到让人心都化了～',
          '哈哈哈，这波夸得我心花怒放！🌹 我也要回夸：你不仅聪明可爱，还特别会说话，跟你聊天太开心了！',
          '谢谢谢谢～感动ing 😭 回夸一下：你这人能处，有彩虹屁是真会放啊！太有才了！',
          '哎哟不错哦～ 🌟 回夸：你就是传说中夸夸界的天花板吧？这水平简直可以开班教学了！',
        ]
        const aiText = aiResponses[Math.floor(Math.random() * aiResponses.length)]
        const aiScore = scorePraise(aiText)
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'system',
            text: aiText,
            score: aiScore,
            name: 'AI小夸',
          },
        ])
        setPlayer2Score((s) => s + aiScore.score)
        setTurn('player1')
        setRound((r) => {
          const nr = r + 1
          if (nr > maxRounds * 2) setGameOver(true)
          return nr
        })
      }, 1200)
    } else {
      setTurn(isPlayer1 ? 'player2' : 'player1')
    }
  }

  const getWinnerName = () => {
    if (player1Score > player2Score) return player1Name
    if (player1Score < player2Score) return player2Name
    return null
  }

  if (mode === 'menu') {
    return (
      <PageContainer title="夸夸对战" subtitle="⚔️ 互夸比拼，快乐加倍" showBack onBack={() => navigate(-1)} showBottomNav={false}>
        <div className="space-y-5 animate-fade-in-up">
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 shadow-dreamy mb-4">
              <Swords size={40} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">准备好开启夸夸大战了吗？</h2>
            <p className="text-sm text-gray-500">轮流用彩虹屁轰炸对方，系统打分决胜负！</p>
          </div>

          <button
            onClick={startPractice}
            className="w-full p-5 rounded-3xl bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 shadow-soft hover:shadow-dreamy transition-all duration-300 active:scale-[0.98] text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white shadow-soft">
                <Bot size={26} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg">单人练习模式</h3>
                <p className="text-sm text-gray-500 mt-1">和AI小夸互夸，练习夸夸技巧</p>
              </div>
              <ArrowRight size={20} className="text-gray-400" />
            </div>
          </button>

          <button
            onClick={startBattle}
            className="w-full p-5 rounded-3xl bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 shadow-soft hover:shadow-dreamy transition-all duration-300 active:scale-[0.98] text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white shadow-soft">
                <User size={26} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg">双人对战模式</h3>
                <p className="text-sm text-gray-500 mt-1">和朋友面对面PK，看谁更会夸</p>
              </div>
              <ArrowRight size={20} className="text-gray-400" />
            </div>
          </button>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
            <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
              <span>📋</span>
              <span>对战规则</span>
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="text-pink-500">•</span>
                <span>双方轮流输入夸赞对方的话</span>
              </li>
              <li className="flex gap-2">
                <span className="text-pink-500">•</span>
                <span>共 {maxRounds} 轮，系统根据内容创意打分</span>
              </li>
              <li className="flex gap-2">
                <span className="text-pink-500">•</span>
                <span>包含高分关键词、长度适中得分更高</span>
              </li>
              <li className="flex gap-2">
                <span className="text-pink-500">•</span>
                <span>总分最高者获得「夸夸之王」称号 👑</span>
              </li>
            </ul>
          </div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title={mode === 'practice' ? '单人练习' : '双人对战'}
      subtitle="⚔️ 夸夸Battle进行中"
      showBack
      onBack={() => (gameOver ? setMode('menu') : setMode('menu'))}
      showBottomNav={false}
    >
      <div className="flex flex-col h-[calc(100vh-180px)]">
        <div className="grid grid-cols-3 gap-2 mb-3 bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-soft">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">{player1Name}</div>
            <div className="text-2xl font-bold text-pink-500">{player1Score}</div>
          </div>
          <div className="text-center border-x border-gray-100">
            <div className="text-xs text-gray-500 mb-1">
              第 {Math.min(Math.ceil(round / 2), maxRounds)}/{maxRounds} 轮
            </div>
            <div className="text-sm font-medium text-gray-600">
              {gameOver ? '已结束' : turn === 'player1' ? `${player1Name}回合` : turn === 'player2' ? `${player2Name}回合` : 'AI回合'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">{player2Name}</div>
            <div className="text-2xl font-bold text-purple-500">{player2Score}</div>
          </div>
        </div>

        <div className="flex-1 bg-white/60 backdrop-blur-sm rounded-3xl p-4 overflow-y-auto space-y-3 shadow-soft">
          {messages.map((msg) => {
            const isLeft = msg.sender !== 'player1'
            return (
              <div
                key={msg.id}
                className={cn('flex gap-2 animate-pop-in', isLeft ? 'justify-start' : 'justify-end')}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl p-3 shadow-sm',
                    isLeft
                      ? 'bg-white rounded-tl-sm text-gray-700'
                      : 'bg-gradient-to-br from-pink-400 to-rose-400 text-white rounded-tr-sm'
                  )}
                >
                  <div className={cn('text-xs mb-1', isLeft ? 'text-gray-400' : 'text-pink-100')}>
                    {msg.name}
                  </div>
                  <div className="text-sm leading-relaxed">{msg.text}</div>
                  {msg.score && (
                    <div
                      className={cn(
                        'mt-2 flex items-center gap-2 text-xs',
                        isLeft ? 'text-purple-500' : 'text-yellow-100'
                      )}
                    >
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < msg.score.stars ? '' : 'opacity-30'}>
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="font-bold">+{msg.score.score}</span>
                      <span>·</span>
                      <span>{msg.score.comment}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {gameOver && (
            <div className="text-center py-6 animate-bounce-in">
              <div className="inline-flex flex-col items-center p-6 rounded-3xl bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 shadow-dreamy">
                <Trophy size={48} className="text-yellow-500 mb-2" />
                <div className="text-lg font-bold text-gray-800 mb-1">
                  {getWinnerName() ? `🎉 ${getWinnerName()} 获胜！` : '🤝 平局！'}
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  {getWinnerName() ? '恭喜获得「夸夸之王」称号 👑' : '两位都是夸夸高手！'}
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" size="sm" onClick={() => setMode('menu')}>
                    <RotateCcw size={14} />
                    返回菜单
                  </Button>
                  <Button variant="gradient" size="sm" onClick={() => resetGame()}>
                    <Play size={14} />
                    再来一局
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {!gameOver && turn !== 'system' && (
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={`${turn === 'player1' ? player1Name : player2Name}，快夸对方...`}
              className="flex-1 px-4 py-3 rounded-full bg-white shadow-soft focus:ring-2 focus:ring-pink-200 outline-none text-sm"
            />
            <Button variant="gradient" onClick={sendMessage} disabled={!input.trim()}>
              发送
            </Button>
          </div>
        )}

        {turn === 'system' && (
          <div className="mt-3 flex items-center justify-center gap-2 py-3 text-sm text-gray-500">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-wave" />
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-wave-delay" />
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-wave-delay-2" />
            </div>
            <span>AI小夸正在思考中...</span>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
