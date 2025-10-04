// 游戏系统类型
export type GameSystem = 'COC' | 'DND' | 'GENERIC'

// 骰子类型
export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100'

// 骰子结果
export interface DiceRoll {
  id: string
  expression: string
  results: number[]
  total: number
  timestamp: Date
  gameSystem?: GameSystem
  checkType?: string
  success?: boolean
  criticalSuccess?: boolean
  criticalFailure?: boolean
}

// COC角色卡
export interface COCCharacter {
  id: string
  name: string
  player: string
  occupation: string
  age: number
  sex: string
  
  // 属性
  attributes: {
    STR: number // 力量
    CON: number // 体质
    SIZ: number // 体型
    DEX: number // 敏捷
    APP: number // 外貌
    INT: number // 智力
    POW: number // 意志
    EDU: number // 教育
    LUCK: number // 幸运
  }
  
  // 衍生属性
  derived: {
    HP: number
    maxHP: number
    MP: number
    maxMP: number
    SAN: number
    maxSAN: number
    MOV: number
    DB: string // 伤害加值
    BUILD: number // 体格
  }
  
  // 技能
  skills: Record<string, number>
  
  // 装备和物品
  equipment: string[]
  
  gameSystem: 'COC'
}

// DND角色卡
export interface DNDCharacter {
  id: string
  name: string
  player: string
  class: string
  level: number
  race: string
  background: string
  alignment: string
  
  // 属性
  attributes: {
    STR: number
    DEX: number
    CON: number
    INT: number
    WIS: number
    CHA: number
  }
  
  // 属性调整值
  modifiers: {
    STR: number
    DEX: number
    CON: number
    INT: number
    WIS: number
    CHA: number
  }
  
  // 战斗属性
  combat: {
    HP: number
    maxHP: number
    AC: number
    initiative: number
    speed: number
  }
  
  // 豁免
  savingThrows: {
    STR: number
    DEX: number
    CON: number
    INT: number
    WIS: number
    CHA: number
  }
  
  // 技能
  skills: Record<string, number>
  
  // 特性和专长
  features: string[]
  
  // 装备
  equipment: string[]
  
  gameSystem: 'DND'
}

// 通用角色卡
export interface GenericCharacter {
  id: string
  name: string
  player: string
  gameSystem: 'GENERIC'
  
  // 自定义属性
  attributes: Record<string, number>
  
  // 自定义技能
  skills: Record<string, number>
  
  // 自定义资源(HP, MP等)
  resources: Record<string, { current: number; max: number }>
  
  // 笔记
  notes: string
}

export type Character = COCCharacter | DNDCharacter | GenericCharacter

// 房间
export interface Room {
  id: string
  name: string
  gameSystem: GameSystem
  gmId: string
  players: string[]
  createdAt: Date
  isActive: boolean
}

// 战斗参与者
export interface Combatant {
  id: string
  name: string
  initiative: number
  hp: number
  maxHp: number
  ac?: number
  conditions: string[]
  isPlayer: boolean
}

// 战斗追踪器状态
export interface CombatState {
  id: string
  roomId: string
  combatants: Combatant[]
  currentTurn: number
  round: number
  isActive: boolean
}

// 检定类型
export interface CheckRequest {
  characterId: string
  gameSystem: GameSystem
  attribute?: string
  skill?: string
  difficulty?: 'easy' | 'normal' | 'hard' // COC
  advantage?: 'advantage' | 'normal' | 'disadvantage' // DND
  modifier?: number
}

// 检定结果
export interface CheckResult {
  success: boolean
  roll: number
  target: number
  criticalSuccess: boolean
  criticalFailure: boolean
  degree?: 'critical' | 'extreme' | 'hard' | 'normal' | 'fail' // COC
}

