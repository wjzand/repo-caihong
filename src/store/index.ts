import { create } from 'zustand'
import { PraiseTarget, PraiseStyle, PraiseContent, FavoriteItem, HistoryItem, UserConfig, BattleRecord } from '@/types'
import { storage } from '@/utils/storage'

interface AppState {
  currentTarget: PraiseTarget
  currentStyle: PraiseStyle
  currentPraise: PraiseContent | null
  favorites: FavoriteItem[]
  history: HistoryItem[]
  battles: BattleRecord[]
  config: UserConfig
  activeTab: 'home' | 'daily' | 'mine'

  setCurrentTarget: (target: PraiseTarget) => void
  setCurrentStyle: (style: PraiseStyle) => void
  setCurrentPraise: (praise: PraiseContent | null) => void
  setActiveTab: (tab: 'home' | 'daily' | 'mine') => void

  addFavorite: (content: PraiseContent) => void
  removeFavorite: (favoriteId: string) => void
  isFavorite: (contentId: string) => boolean

  addHistory: (content: PraiseContent) => void
  clearHistory: () => void

  addBattle: (record: Omit<BattleRecord, 'id' | 'playedAt'>) => BattleRecord

  updateConfig: (partial: Partial<UserConfig>) => void

  refreshAll: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  currentTarget: PraiseTarget.BESTIE,
  currentStyle: PraiseStyle.SWEET,
  currentPraise: null,
  favorites: storage.getFavorites(),
  history: storage.getHistory(),
  battles: storage.getBattles(),
  config: storage.getConfig(),
  activeTab: 'home',

  setCurrentTarget: (target) => set({ currentTarget: target }),
  setCurrentStyle: (style) => set({ currentStyle: style }),
  setCurrentPraise: (praise) => set({ currentPraise: praise }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  addFavorite: (content) => {
    const item = storage.addFavorite(content)
    set({ favorites: storage.getFavorites() })
    return item
  },
  removeFavorite: (favoriteId) => {
    storage.removeFavorite(favoriteId)
    set({ favorites: storage.getFavorites() })
  },
  isFavorite: (contentId) => {
    return storage.isFavorite(contentId)
  },

  addHistory: (content) => {
    storage.addHistory(content)
    set({ history: storage.getHistory() })
  },
  clearHistory: () => {
    storage.clearHistory()
    set({ history: [] })
  },

  addBattle: (record) => {
    const fullRecord = storage.addBattle(record)
    set({ battles: storage.getBattles() })
    return fullRecord
  },

  updateConfig: (partial) => {
    const config = storage.updateConfig(partial)
    set({ config })
  },

  refreshAll: () => {
    set({
      favorites: storage.getFavorites(),
      history: storage.getHistory(),
      battles: storage.getBattles(),
      config: storage.getConfig(),
    })
  },
}))
