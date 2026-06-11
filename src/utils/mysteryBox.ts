import { MysteryCard, PraiseTask, MysteryBoxRarity, MysteryBoxState, Achievement } from '@/types'
import { MYSTERY_CARDS, PRAISE_TASKS, ACHIEVEMENTS } from '@/data/mysteryBox'
import { storage } from './storage'

const RARITY_WEIGHTS: Record<MysteryBoxRarity, number> = {
  [MysteryBoxRarity.NORMAL]: 70,
  [MysteryBoxRarity.RARE]: 20,
  [MysteryBoxRarity.HIDDEN]: 5,
  [MysteryBoxRarity.EGG]: 5,
}

function getTodayString(): string {
  return new Date().toDateString()
}

export function getInitialMysteryState(): MysteryBoxState {
  const today = getTodayString()
  const saved = storage.getMysteryBoxState()
  if (saved) {
    if (saved.lastOpenDate !== today) {
      return {
        ...saved,
        lastOpenDate: today,
        dailyFreeUsed: false,
        currentTask: null,
        taskCompleted: false,
      }
    }
    return saved
  }
  return {
    lastOpenDate: today,
    dailyFreeUsed: false,
    normalBoxCount: 0,
    rareBoxCount: 0,
    currentTask: null,
    taskCompleted: false,
    collectedCards: [],
    openHistory: [],
    stats: {
      totalOpened: 0,
      hiddenCount: 0,
      taskCompleted: 0,
      sharedCount: 0,
    },
  }
}

function weightedRandomRarity(isRareBox: boolean): MysteryBoxRarity {
  const weights = isRareBox
    ? { ...RARITY_WEIGHTS, normal: 50, rare: 35, hidden: 10, egg: 5 }
    : RARITY_WEIGHTS

  const total = Object.values(weights).reduce((a, b) => a + b, 0)
  let random = Math.random() * total

  for (const [rarity, weight] of Object.entries(weights)) {
    random -= weight
    if (random <= 0) {
      return rarity as MysteryBoxRarity
    }
  }
  return MysteryBoxRarity.NORMAL
}

export function openMysteryBox(isRareBox: boolean = false): {
  card: MysteryCard
  task: PraiseTask | null
  isNew: boolean
} {
  const state = getInitialMysteryState()
  const rarity = weightedRandomRarity(isRareBox)

  const availableCards = MYSTERY_CARDS.filter((c) => c.rarity === rarity)
  const pool = availableCards.length > 0 ? availableCards : MYSTERY_CARDS

  const randomCard = pool[Math.floor(Math.random() * pool.length)]
  const isNew = !state.collectedCards.includes(randomCard.id)

  const shouldGetTask = Math.random() < 0.5 && !state.currentTask && !state.taskCompleted
  const task = shouldGetTask ? PRAISE_TASKS[Math.floor(Math.random() * PRAISE_TASKS.length)] : null

  return {
    card: randomCard,
    task,
    isNew,
  }
}

export function saveMysteryBoxResult(
  card: MysteryCard,
  task: PraiseTask | null,
  isNew: boolean
): MysteryBoxState {
  const state = getInitialMysteryState()

  const newCollected = isNew ? [...state.collectedCards, card.id] : state.collectedCards
  const newHistory = [
    { cardId: card.id, openedAt: Date.now(), isNew },
    ...state.openHistory,
  ].slice(0, 100)

  const newStats = {
    ...state.stats,
    totalOpened: state.stats.totalOpened + 1,
    hiddenCount:
      card.rarity === MysteryBoxRarity.HIDDEN || card.rarity === MysteryBoxRarity.EGG
        ? state.stats.hiddenCount + 1
        : state.stats.hiddenCount,
  }

  const newState: MysteryBoxState = {
    ...state,
    dailyFreeUsed: true,
    collectedCards: newCollected,
    openHistory: newHistory,
    stats: newStats,
    currentTask: task || state.currentTask,
  }

  storage.saveMysteryBoxState(newState)
  return newState
}

export function consumeBox(type: 'normal' | 'rare'): MysteryBoxState {
  const state = getInitialMysteryState()
  if (type === 'normal') {
    state.normalBoxCount = Math.max(0, state.normalBoxCount - 1)
  } else {
    state.rareBoxCount = Math.max(0, state.rareBoxCount - 1)
  }
  storage.saveMysteryBoxState(state)
  return state
}

export function addBox(type: 'normal' | 'rare', count: number = 1): MysteryBoxState {
  const state = getInitialMysteryState()
  if (type === 'normal') {
    state.normalBoxCount += count
  } else {
    state.rareBoxCount += count
  }
  storage.saveMysteryBoxState(state)
  return state
}

export function completeTask(): MysteryBoxState {
  const state = getInitialMysteryState()
  if (!state.currentTask || state.taskCompleted) return state

  const rewardType = state.currentTask.reward === 'rare_box' ? 'rare' : 'normal'
  const newState = addBox(rewardType, 1)

  newState.taskCompleted = true
  newState.stats.taskCompleted += 1
  storage.saveMysteryBoxState(newState)
  return newState
}

export function incrementShareCount(): MysteryBoxState {
  const state = getInitialMysteryState()
  state.stats.sharedCount += 1
  storage.saveMysteryBoxState(state)
  return state
}

export function canOpenDailyFree(): boolean {
  const state = getInitialMysteryState()
  return !state.dailyFreeUsed
}

export function canOpenBox(type: 'normal' | 'rare'): boolean {
  const state = getInitialMysteryState()
  return type === 'normal' ? state.normalBoxCount > 0 : state.rareBoxCount > 0
}

export function getCardById(id: string): MysteryCard | undefined {
  return MYSTERY_CARDS.find((c) => c.id === id)
}

export function getCollectionProgress(): Record<string, { collected: number; total: number }> {
  const state = getInitialMysteryState()
  const seriesMap: Record<string, MysteryCard[]> = {}

  for (const card of MYSTERY_CARDS) {
    if (!seriesMap[card.series]) seriesMap[card.series] = []
    seriesMap[card.series].push(card)
  }

  const progress: Record<string, { collected: number; total: number }> = {}
  for (const [series, cards] of Object.entries(seriesMap)) {
    const collected = cards.filter((c) => state.collectedCards.includes(c.id)).length
    progress[series] = { collected, total: cards.length }
  }
  return progress
}

export function getAchievements(): Achievement[] {
  const state = getInitialMysteryState()
  const progress = getCollectionProgress()

  return ACHIEVEMENTS.map((ach) => {
    let currentValue = 0
    switch (ach.condition) {
      case 'totalOpened':
        currentValue = state.stats.totalOpened
        break
      case 'hiddenCount':
        currentValue = state.stats.hiddenCount
        break
      case 'taskCompleted':
        currentValue = state.stats.taskCompleted
        break
      case 'sharedCount':
        currentValue = state.stats.sharedCount
        break
      case 'collected':
        currentValue = state.collectedCards.length
        break
    }
    return {
      ...ach,
      unlocked: currentValue >= ach.total,
      progress: Math.min(currentValue, ach.total),
    }
  })
}

export function getCollectedCards(): MysteryCard[] {
  const state = getInitialMysteryState()
  return state.collectedCards
    .map((id) => MYSTERY_CARDS.find((c) => c.id === id))
    .filter(Boolean) as MysteryCard[]
}
