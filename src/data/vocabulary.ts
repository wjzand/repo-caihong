import { PraiseTarget, PraiseStyle, VocabularyData } from '@/types'

export const TARGET_CONFIG: Record<PraiseTarget, { name: string; icon: string; terms: string[] }> = {
  [PraiseTarget.BESTIE]: {
    name: '闺蜜',
    icon: '👭',
    terms: ['亲爱的闺蜜', '我的好姐妹', '闺蜜大人', '集美', '我最爱的闺蜜', '铁子', '死党', '姐妹淘'],
  },
  [PraiseTarget.LOVER]: {
    name: '恋人',
    icon: '💑',
    terms: ['宝贝', '亲爱的', '宝宝', '老婆/老公', '我的心上人', '小可爱', '小笨蛋', '我家那位'],
  },
  [PraiseTarget.FAMILY]: {
    name: '家人',
    icon: '👨‍👩‍👧',
    terms: ['老爸老妈', '我亲爱的家人', '我的家人们', '爸爸妈妈', '全家最棒的', '我最爱的家人'],
  },
  [PraiseTarget.COLLEAGUE]: {
    name: '老板/同事',
    icon: '👔',
    terms: ['老板', '领导', 'X总', '亲爱的同事', '我最靠谱的同事', '工作伙伴', '大神同事'],
  },
  [PraiseTarget.TEACHER]: {
    name: '老师',
    icon: '👩‍🏫',
    terms: ['老师', 'X老师', '我最尊敬的老师', '恩师', '亲爱的老师', '班主任'],
  },
  [PraiseTarget.IDOL]: {
    name: '爱豆',
    icon: '🤩',
    terms: ['老公/老婆', '哥哥/姐姐', '我家爱豆', '偶像大人', '神仙哥哥/姐姐', '本命', '墙头'],
  },
  [PraiseTarget.SELF]: {
    name: '自己',
    icon: '😎',
    terms: ['我自己', '本宝宝', '本仙女/本帅哥', '我本人', '宇宙无敌的我', '优秀的我'],
  },
  [PraiseTarget.PET]: {
    name: '宠物',
    icon: '🐱',
    terms: ['我的小宝贝', '毛孩子', '主子', '小可爱', '小乖乖', '小奶猫/小奶狗', '我家的崽'],
  },
}

export const STYLE_CONFIG: Record<PraiseStyle, { name: string; emoji: string; color: string }> = {
  [PraiseStyle.SWEET]: { name: '土味情话', emoji: '💕', color: 'from-pink-400 to-rose-400' },
  [PraiseStyle.LITERARY]: { name: '文艺清新', emoji: '🌸', color: 'from-green-300 to-teal-400' },
  [PraiseStyle.FUNNY]: { name: '沙雕搞笑', emoji: '🤪', color: 'from-yellow-400 to-orange-400' },
  [PraiseStyle.SINCERE]: { name: '真诚走心', emoji: '💝', color: 'from-red-300 to-pink-400' },
  [PraiseStyle.ANCIENT]: { name: '古风诗词', emoji: '🏮', color: 'from-amber-400 to-red-400' },
  [PraiseStyle.WORKPLACE]: { name: '职场专用', emoji: '💼', color: 'from-blue-400 to-indigo-400' },
  [PraiseStyle.ENGLISH]: { name: '英语彩虹屁', emoji: '🌟', color: 'from-purple-400 to-violet-500' },
  [PraiseStyle.ULTIMATE]: { name: '夸夸界天花板', emoji: '👑', color: 'from-amber-300 to-yellow-500' },
  [PraiseStyle.EARTHLY]: { name: '土到极致', emoji: '🌶️', color: 'from-red-500 to-pink-500' },
  [PraiseStyle.CREATIVE]: { name: '创意鬼才', emoji: '🎨', color: 'from-cyan-400 to-blue-500' },
}

const ADJECTIVES: Record<PraiseStyle, string[]> = {
  [PraiseStyle.SWEET]: ['温柔', '可爱', '甜美', '治愈', '软萌', '软糯', '甜蜜', '贴心', '暖心', '萌化了', '仙女下凡', '人比花娇', '甜过初恋'],
  [PraiseStyle.LITERARY]: ['清雅', '温润', '淡然', '出尘', '脱俗', '隽永', '灵秀', '淡雅', '明净', '如玉', '如诗如画', '风华绝代', '清韵悠长'],
  [PraiseStyle.FUNNY]: ['离谱', '绝了', '牛批', '炸裂', 'YYDS', '神仙', '无敌', '太强了', '超神', '封神', '666', '绝绝子', '离谱他妈给离谱开门'],
  [PraiseStyle.SINCERE]: ['真诚', '善良', '温暖', '可靠', '踏实', '努力', '认真', '坚韧', '执着', '优秀', '让人安心', '值得信赖', '闪闪发光'],
  [PraiseStyle.ANCIENT]: ['倾城', '倾国', '绝世', '惊鸿', '无双', '绝色', '绝代', '风华', '惊才绝艳', '冠绝当世', '风华正茂', '玉树临风', '闭月羞花'],
  [PraiseStyle.WORKPLACE]: ['专业', '高效', '靠谱', '干练', '精英', '出色', '卓越', '顶尖', '资深', '核心', '定海神针', '中流砥柱', '灵魂人物'],
  [PraiseStyle.ENGLISH]: ['amazing', 'awesome', 'incredible', 'brilliant', 'stunning', 'gorgeous', 'fantastic', 'wonderful', 'fabulous', 'superb', 'outstanding', 'magnificent', 'extraordinary'],
  [PraiseStyle.ULTIMATE]: ['宇宙第一', '世界顶级', '人间极品', '天降神兵', '地表最强', '天花板级别', '王者风范', '神级存在', '史诗级', '传说中的', '前无古人后无来者'],
  [PraiseStyle.EARTHLY]: ['接地气', '朴实无华', '实力派', '真性情', '老铁', '实在人', '不玩虚的', '够意思', '敞亮', '局气', '讲究', '厚道'],
  [PraiseStyle.CREATIVE]: ['脑洞大开', '奇思妙想', '天马行空', '别出心裁', '独具匠心', '别具一格', '鬼斧神工', '巧夺天工', '神来之笔', '妙笔生花', '创意爆棚', '灵感无限'],
}

const METAPHORS: Record<PraiseStyle, string[]> = {
  [PraiseStyle.SWEET]: ['像春天的第一朵樱花', '像夏日的冰镇奶茶', '像秋夜的温柔月光', '像冬日的暖心热可可', '像棉花糖一样软萌', '像糖果一样甜'],
  [PraiseStyle.LITERARY]: ['如清风拂过湖面', '如明月照亮夜空', '如山间清泉潺潺', '如墨香四溢的古卷', '如诗中走出的人儿', '如画中仙子'],
  [PraiseStyle.FUNNY]: ['比奥特曼还能打', '比猪八戒还能吃', '比孙悟空还神通广大', '比哆啦A梦还万能', '比柯南还会推理', '比皮卡丘还会放电'],
  [PraiseStyle.SINCERE]: ['像冬日暖阳', '像黑夜中的灯塔', '像雨中的一把伞', '像沙漠中的一泓清泉', '像心灵的港湾', '像生命中的光'],
  [PraiseStyle.ANCIENT]: ['胜似西施貂蝉', '堪比潘安宋玉', '如洛神出水', '似嫦娥奔月', '若董贤之姿', '如卫玠之容'],
  [PraiseStyle.WORKPLACE]: ['是团队的定海神针', '是项目的压舱石', '是公司的金字招牌', '是行业的标杆', '是部门的顶梁柱', '是业务的领头羊'],
  [PraiseStyle.ENGLISH]: ['a shining star', 'a ray of sunshine', 'a breath of fresh air', 'a true gem', 'one in a million', 'the cream of the crop'],
  [PraiseStyle.ULTIMATE]: ['秒杀一切的存在', '打破次元壁的神', '改写历史的人物', '开天辟地级别的', '核爆级别的震撼', '封神榜第一名'],
  [PraiseStyle.EARTHLY]: ['比村口王婆卖的瓜还甜', '比隔壁老李的手艺还绝', '比俺们屯儿最靓的仔还靓', '比二舅家的大馒头还实在', '比老陈醋还够味'],
  [PraiseStyle.CREATIVE]: ['像是从外星球来的创意', '像是梦里才会有的点子', '像是上帝亲手画的蓝图', '像是被灵感吻过的大脑', '像是艺术女神的宠儿'],
}

const DESCRIPTIONS: Record<PraiseStyle, string[]> = {
  [PraiseStyle.SWEET]: ['让人心都化了', '甜到心坎里', '被治愈了', '萌到出血', 'awsl', '心空了', '血槽已空', '疯狂心动'],
  [PraiseStyle.LITERARY]: ['此生有幸得见', '不虚此行', '三生有幸', '一见倾心', '难以忘怀', '常存心间', '如饮甘霖', '回味无穷'],
  [PraiseStyle.FUNNY]: ['我直接好家伙', '给我整不会了', '笑死我了', '绝了这操作', '这波我服', '是在下输了', '瑞思拜', '给跪了'],
  [PraiseStyle.SINCERE]: ['真的很感谢你', '遇见你真好', '你真的很棒', '辛苦了', '有你真好', '你值得被爱', '你值得最好的'],
  [PraiseStyle.ANCIENT]: ['此女只应天上有', '貌比潘安才比子建', '一顾倾人城再顾倾人国', '此乃神人也', '惊为天人', '当世无二'],
  [PraiseStyle.WORKPLACE]: ['前途无量', '未来可期', '必成大器', '栋梁之才', '中流砥柱', '劳苦功高', '厥功至伟'],
  [PraiseStyle.ENGLISH]: ['keep shining', 'never change', 'you are the best', 'proud of you', 'well done', 'simply the best'],
  [PraiseStyle.ULTIMATE]: ['前无古人后无来者', '念天地之悠悠独怆然而涕下', '敢问苍天饶过谁', '天下谁人不识君', '武林至尊宝刀屠龙'],
  [PraiseStyle.EARTHLY]: ['老铁没毛病', '必须双击666', '给你点赞', '安排上了', '这波稳了', '没毛病老铁', '奥利给'],
  [PraiseStyle.CREATIVE]: ['这个创意我给满分', '脑洞突破天际', '天才就是你', '被上帝吻过的创意', '鬼才啊鬼才'],
}

export const VOCABULARY: VocabularyData = {
  targetNames: Object.fromEntries(
    Object.entries(TARGET_CONFIG).map(([k, v]) => [k, v.terms])
  ) as Record<PraiseTarget, string[]>,
  adjectives: ADJECTIVES,
  metaphors: METAPHORS,
  descriptions: DESCRIPTIONS,
}

export function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
