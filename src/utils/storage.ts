import { FavoriteItem, HistoryItem, BattleRecord, PraiseContent, UserConfig, PraiseTarget, PraiseStyle, MysteryBoxState } from '@/types'

const STORAGE_KEYS = {
  FAVORITES: 'kuakua_favorites',
  HISTORY: 'kuakua_history',
  BATTLES: 'kuakua_battles',
  CONFIG: 'kuakua_config',
  MYSTERY_BOX: 'kuakua_mystery_box',
} as const

const DEFAULT_CONFIG: UserConfig = {
  defaultTarget: PraiseTarget.BESTIE,
  defaultStyle: PraiseStyle.SWEET,
  autoCopy: false,
  theme: 'light',
  language: 'zh-CN',
}

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Storage set failed:', e)
  }
}

export const storage = {
  getFavorites(): FavoriteItem[] {
    return safeGet<FavoriteItem[]>(STORAGE_KEYS.FAVORITES, [])
  },

  addFavorite(content: PraiseContent): FavoriteItem {
    const favorites = this.getFavorites()
    const exists = favorites.find((f) => f.contentId === content.id)
    if (exists) return exists

    const item: FavoriteItem = {
      id: `fav_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      contentId: content.id,
      content,
      createdAt: Date.now(),
    }
    favorites.unshift(item)
    safeSet(STORAGE_KEYS.FAVORITES, favorites)
    return item
  },

  removeFavorite(favoriteId: string): void {
    const favorites = this.getFavorites().filter((f) => f.id !== favoriteId)
    safeSet(STORAGE_KEYS.FAVORITES, favorites)
  },

  isFavorite(contentId: string): boolean {
    return this.getFavorites().some((f) => f.contentId === contentId)
  },

  getHistory(): HistoryItem[] {
    return safeGet<HistoryItem[]>(STORAGE_KEYS.HISTORY, [])
  },

  addHistory(content: PraiseContent): void {
    const history = this.getHistory()
    const exists = history.find((h) => h.content.id === content.id)
    if (exists) return

    history.unshift({
      id: `hist_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      content,
      generatedAt: Date.now(),
    })

    if (history.length > 100) {
      history.splice(100)
    }
    safeSet(STORAGE_KEYS.HISTORY, history)
  },

  clearHistory(): void {
    safeSet(STORAGE_KEYS.HISTORY, [])
  },

  getBattles(): BattleRecord[] {
    return safeGet<BattleRecord[]>(STORAGE_KEYS.BATTLES, [])
  },

  addBattle(record: Omit<BattleRecord, 'id' | 'playedAt'>): BattleRecord {
    const battles = this.getBattles()
    const fullRecord: BattleRecord = {
      ...record,
      id: `battle_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      playedAt: Date.now(),
    }
    battles.unshift(fullRecord)
    if (battles.length > 50) battles.splice(50)
    safeSet(STORAGE_KEYS.BATTLES, battles)
    return fullRecord
  },

  getConfig(): UserConfig {
    return { ...DEFAULT_CONFIG, ...safeGet<Partial<UserConfig>>(STORAGE_KEYS.CONFIG, {}) }
  },

  updateConfig(partial: Partial<UserConfig>): UserConfig {
    const config = { ...this.getConfig(), ...partial }
    safeSet(STORAGE_KEYS.CONFIG, config)
    return config
  },

  getMysteryBoxState(): MysteryBoxState | null {
    return safeGet<MysteryBoxState | null>(STORAGE_KEYS.MYSTERY_BOX, null)
  },

  saveMysteryBoxState(state: MysteryBoxState): void {
    safeSet(STORAGE_KEYS.MYSTERY_BOX, state)
  },
}
