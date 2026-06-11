export enum PraiseTarget {
  BESTIE = 'bestie',
  LOVER = 'lover',
  FAMILY = 'family',
  COLLEAGUE = 'colleague',
  TEACHER = 'teacher',
  IDOL = 'idol',
  SELF = 'self',
  PET = 'pet',
}

export enum PraiseStyle {
  SWEET = 'sweet',
  LITERARY = 'literary',
  FUNNY = 'funny',
  SINCERE = 'sincere',
  ANCIENT = 'ancient',
  WORKPLACE = 'workplace',
  ENGLISH = 'english',
  ULTIMATE = 'ultimate',
  EARTHLY = 'earthly',
  CREATIVE = 'creative',
}

export interface PraiseContent {
  id: string;
  target: PraiseTarget;
  style: PraiseStyle;
  text: string;
  keywords?: string[];
  createdAt: number;
}

export interface FavoriteItem {
  id: string;
  contentId: string;
  content: PraiseContent;
  createdAt: number;
}

export interface HistoryItem {
  id: string;
  content: PraiseContent;
  generatedAt: number;
}

export interface UserConfig {
  defaultTarget: PraiseTarget;
  defaultStyle: PraiseStyle;
  autoCopy: boolean;
  theme: 'light' | 'dark';
  language: 'zh-CN' | 'en-US';
}

export interface BattleRecord {
  id: string;
  player1Name: string;
  player2Name: string;
  player1Score: number;
  player2Score: number;
  rounds: number;
  winner: 'player1' | 'player2' | 'draw';
  playedAt: number;
}

export interface PosterTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  background: {
    type: 'color' | 'gradient' | 'image' | 'pattern';
    value: string;
    gradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl';
    patternColor?: string;
  };
  textStyle: {
    fontFamily: string;
    color: string;
    fontSize: number;
    lineHeight: number;
    letterSpacing: number;
    textAlign: 'left' | 'center' | 'right';
    fontWeight: 'normal' | 'bold' | 'lighter';
    textShadow?: string;
  };
  decoration: {
    borderStyle: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    padding: number;
    elements?: PosterDecorationElement[];
  };
  layout: {
    titlePosition?: 'top' | 'bottom' | 'none';
    contentPosition: 'top' | 'center' | 'bottom';
    orientation: 'portrait' | 'landscape' | 'square';
  };
}

export interface PosterDecorationElement {
  type: 'emoji' | 'shape' | 'image' | 'text';
  content: string;
  position: {
    x: number;
    y: number;
  };
  size: number;
  opacity: number;
  rotation?: number;
}

export interface VocabularyData {
  targetNames: Record<PraiseTarget, string[]>;
  adjectives: Record<PraiseStyle, string[]>;
  metaphors: Record<PraiseStyle, string[]>;
  descriptions: Record<PraiseStyle, string[]>;
}

export enum MysteryBoxRarity {
  NORMAL = 'normal',
  RARE = 'rare',
  HIDDEN = 'hidden',
  EGG = 'egg',
}

export enum CardSeries {
  GARDEN = 'garden',
  FUNNY = 'funny',
  ANCIENT = 'ancient',
  DREAM = 'dream',
  CANDY = 'candy',
}

export interface MysteryCard {
  id: string;
  rarity: MysteryBoxRarity;
  series: CardSeries;
  text: string;
  emoji: string;
  background: string;
  textColor: string;
  effect?: 'glow' | 'rainbow' | 'sparkle' | 'float';
  title?: string;
  sound?: string;
}

export interface PraiseTask {
  id: string;
  title: string;
  description: string;
  emoji: string;
  type: 'share' | 'praise' | 'voice' | 'screenshot';
  reward: 'normal_box' | 'rare_box';
}

export interface MysteryBoxState {
  lastOpenDate: string | null;
  dailyFreeUsed: boolean;
  normalBoxCount: number;
  rareBoxCount: number;
  currentTask: PraiseTask | null;
  taskCompleted: boolean;
  collectedCards: string[];
  openHistory: Array<{
    cardId: string;
    openedAt: number;
    isNew: boolean;
  }>;
  stats: {
    totalOpened: number;
    hiddenCount: number;
    taskCompleted: number;
    sharedCount: number;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  unlocked: boolean;
  progress: number;
  total: number;
}
