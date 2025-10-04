/**
 * 应用常量配置
 */

// COC技能列表
export const COC_SKILLS = [
  '会计', '人类学', '估价', '考古学', '魅惑', '攀爬', '计算机使用',
  '信用评级', '克苏鲁神话', '乔装', '闪避', '驾驶', '电气维修',
  '电子学', '话术', '格斗', '射击', '急救', '历史', '恐吓',
  '跳跃', '母语', '法律', '图书馆使用', '聆听', '开锁', '机械维修',
  '医学', '博物学', '领航', '神秘学', '操作重型机械', '说服', '精神分析',
  '心理学', '骑术', '妙手', '侦察', '潜行', '生存', '游泳',
  '投掷', '追踪', '驯兽', '潜水', '爆破', '读唇', '催眠',
  '炮术',
]

// DND技能列表
export const DND_SKILLS = [
  '体操', '动物驯养', '奥秘', '运动', '欺诈', '历史',
  '洞悉', '威吓', '调查', '医药', '自然', '察觉',
  '表演', '说服', '宗教', '巧手', '隐匿', '生存',
]

// DND职业列表
export const DND_CLASSES = [
  '野蛮人', '吟游诗人', '牧师', '德鲁伊', '战士', '武僧',
  '圣武士', '游侠', '游荡者', '术士', '邪术师', '法师',
]

// DND种族列表
export const DND_RACES = [
  '人类', '矮人', '精灵', '半身人', '龙裔', '侏儒',
  '半精灵', '半兽人', '提夫林',
]

// DND阵营列表
export const DND_ALIGNMENTS = [
  '守序善良', '中立善良', '混乱善良',
  '守序中立', '绝对中立', '混乱中立',
  '守序邪恶', '中立邪恶', '混乱邪恶',
]

// 骰子类型
export const DICE_TYPES = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'] as const

// 游戏系统
export const GAME_SYSTEMS = {
  COC: {
    name: '克苏鲁的呼唤',
    shortName: 'COC',
    version: '7版',
    color: '#16a34a',
  },
  DND: {
    name: '龙与地下城',
    shortName: 'DND',
    version: '5E',
    color: '#2563eb',
  },
  GENERIC: {
    name: '通用系统',
    shortName: 'GENERIC',
    version: '',
    color: '#9333ea',
  },
}

// 检定难度
export const CHECK_DIFFICULTIES = {
  COC: ['easy', 'normal', 'hard'] as const,
  DND: ['advantage', 'normal', 'disadvantage'] as const,
}

// 检定难度显示名称
export const CHECK_DIFFICULTY_NAMES = {
  easy: '简单',
  normal: '常规',
  hard: '困难',
  advantage: '优势',
  disadvantage: '劣势',
}

// 状态效果列表
export const COMBAT_CONDITIONS = [
  '目盲', '魅惑', '耳聋', '恐慌', '擒抱', '失能',
  '隐形', '麻痹', '石化', '中毒', '倒地', '束缚',
  '昏迷', '眩晕', '疲劳', '力竭', '减速', '加速',
  '护盾', '祝福', '诅咒', '灼烧', '冰冻', '流血',
]

// 本地存储键名
export const STORAGE_KEYS = {
  CHARACTERS: 'trpg_characters',
  ROOMS: 'trpg_rooms',
  COMBAT: 'trpg_combat',
  USER_ID: 'trpg_user_id',
  DICE_HISTORY: 'trpg_dice_history',
  SETTINGS: 'trpg_settings',
}

// 应用配置
export const APP_CONFIG = {
  name: 'TRPG助手',
  version: '1.0.0',
  description: '支持COC、DND等多种跑团游戏的辅助工具',
  maxDiceHistory: 100,
  maxCombatants: 20,
  maxRooms: 10,
  maxCharacters: 50,
}

// 颜色主题
export const COLORS = {
  primary: '#9333ea',
  secondary: '#6366f1',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
}

// 动画持续时间
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  dice: 500,
}

