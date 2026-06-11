import { PraiseTarget, PraiseStyle, PraiseContent } from '@/types'
import { VOCABULARY, TARGET_CONFIG, getRandomItem } from '@/data/vocabulary'
import { PRAISE_TEMPLATES, KEYWORD_TEMPLATES } from '@/data/templates'

function generateId(): string {
  return `praise_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

export function generatePraise(
  target: PraiseTarget,
  style: PraiseStyle
): PraiseContent {
  const targetTerms = VOCABULARY.targetNames[target] || ['你']
  const adjectives = VOCABULARY.adjectives[style] || ['很棒']
  const metaphors = VOCABULARY.metaphors[style] || ['像星星一样闪耀']
  const descriptions = VOCABULARY.descriptions[style] || ['太厉害了']
  const templates = PRAISE_TEMPLATES[style] || PRAISE_TEMPLATES.sweet

  const template = getRandomItem(templates)
  const targetTerm = getRandomItem(targetTerms)
  const adjective = getRandomItem(adjectives)
  const metaphor = getRandomItem(metaphors)
  const description = getRandomItem(descriptions)

  const text = template
    .replace(/\{对象\}/g, targetTerm)
    .replace(/\{形容词\}/g, adjective)
    .replace(/\{比喻\}/g, metaphor)
    .replace(/\{神级描述\}/g, description)

  return {
    id: generateId(),
    target,
    style,
    text,
    keywords: [adjective],
    createdAt: Date.now(),
  }
}

export function generatePraiseWithKeyword(
  keyword: string,
  target?: PraiseTarget,
  style?: PraiseStyle
): PraiseContent {
  const actualTarget = target || PraiseTarget.BESTIE
  const actualStyle = style || PraiseStyle.SWEET

  const targetTerms = VOCABULARY.targetNames[actualTarget] || ['你']
  const adjectives = VOCABULARY.adjectives[actualStyle] || ['很棒']
  const metaphors = VOCABULARY.metaphors[actualStyle] || ['像星星一样闪耀']
  const descriptions = VOCABULARY.descriptions[actualStyle] || ['太厉害了']

  const template = getRandomItem(KEYWORD_TEMPLATES)
  const targetTerm = getRandomItem(targetTerms)
  const adjective = getRandomItem(adjectives)
  const metaphor = getRandomItem(metaphors)
  const description = getRandomItem(descriptions)

  const text = template
    .replace(/\{对象\}/g, targetTerm)
    .replace(/\{关键词\}/g, keyword)
    .replace(/\{形容词\}/g, adjective)
    .replace(/\{比喻\}/g, metaphor)
    .replace(/\{神级描述\}/g, description)

  return {
    id: generateId(),
    target: actualTarget,
    style: actualStyle,
    text,
    keywords: [keyword, adjective],
    createdAt: Date.now(),
  }
}

export function generateDailyPraise(): PraiseContent {
  const targets = Object.values(PraiseTarget)
  const styles = Object.values(PraiseStyle)
  const randomTarget = getRandomItem(targets)
  const randomStyle = getRandomItem(styles)
  return generatePraise(randomTarget, randomStyle)
}

export function getTargetName(target: PraiseTarget): string {
  return TARGET_CONFIG[target]?.name || '朋友'
}

export function getTargetIcon(target: PraiseTarget): string {
  return TARGET_CONFIG[target]?.icon || '💝'
}
