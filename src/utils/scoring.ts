export interface ScoringResult {
  score: number
  maxScore: number
  stars: number
  comment: string
  details: {
    length: number
    keywords: string[]
    creativity: number
  }
}

const HIGH_VALUE_WORDS = [
  '宇宙', '无敌', '封神', '天花板', '绝绝子', 'YYDS', '神仙', '史诗',
  '传奇', '秒杀', '核爆', '前无古人', '世界第一', '地表最强',
  'amazing', 'incredible', 'brilliant', 'stunning', 'magnificent',
  '温柔', '善良', '真诚', '可爱', '治愈', '暖心', '闪耀', '优秀',
]

const FUNNY_COMMENTS = [
  '夸夸小能手就是你！🎉',
  '这波彩虹屁，我给满分！💯',
  '夸得对方心花怒放！🌸',
  '你就是夸夸界的MVP！🏆',
  '这夸奖水平，祖师爷级别！👑',
  '听得我都心动了！💕',
  '不愧是夸夸之王！✨',
  '这嘴，开过光吧！🌟',
  '甜到掉牙了！🍬',
  '文学大师附体！📚',
]

const AVERAGE_COMMENTS = [
  '不错不错，继续加油！👍',
  '有点东西，但还可以更骚～',
  '及格线以上，优秀未满',
  '中规中矩的夸夸选手',
  '还有进步空间哦！💪',
]

const LOW_COMMENTS = [
  '再加点油吧老铁...😂',
  '这夸得也太敷衍了吧！',
  '诚意不足，差评！😤',
  '建议回炉重造一下～',
  '是不是没走心？🤔',
]

export function scorePraise(text: string): ScoringResult {
  const maxScore = 100
  let score = 0
  const matchedKeywords: string[] = []

  for (const word of HIGH_VALUE_WORDS) {
    if (text.includes(word)) {
      score += 5
      matchedKeywords.push(word)
    }
  }

  const length = text.length
  let lengthScore = 0
  if (length >= 5 && length < 15) lengthScore = 10
  else if (length >= 15 && length < 30) lengthScore = 20
  else if (length >= 30 && length < 60) lengthScore = 30
  else if (length >= 60 && length < 100) lengthScore = 35
  else if (length >= 100) lengthScore = 40
  score += lengthScore

  const emojiCount = (text.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length
  score += Math.min(emojiCount * 2, 10)

  const exclamationCount = (text.match(/[！!]/g) || []).length
  score += Math.min(exclamationCount * 1, 5)

  const uniqueWords = new Set(text.split(/[\s,，。.！!？?、；;:：]+/)).size
  const creativityScore = Math.min(Math.floor(uniqueWords / 5) * 3, 15)
  score += creativityScore

  score = Math.min(score, maxScore)

  const stars = score >= 90 ? 5 : score >= 75 ? 4 : score >= 60 ? 3 : score >= 40 ? 2 : 1

  let comment: string
  if (score >= 80) {
    comment = FUNNY_COMMENTS[Math.floor(Math.random() * FUNNY_COMMENTS.length)]
  } else if (score >= 50) {
    comment = AVERAGE_COMMENTS[Math.floor(Math.random() * AVERAGE_COMMENTS.length)]
  } else {
    comment = LOW_COMMENTS[Math.floor(Math.random() * LOW_COMMENTS.length)]
  }

  return {
    score,
    maxScore,
    stars,
    comment,
    details: {
      length,
      keywords: matchedKeywords,
      creativity: creativityScore,
    },
  }
}
