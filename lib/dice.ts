import { DiceRoll, DiceType } from '@/types'

/**
 * 投掷单个骰子
 */
export function rollDice(sides: number): number {
  return Math.floor(Math.random() * sides) + 1
}

/**
 * 投掷多个骰子
 */
export function rollMultipleDice(count: number, sides: number): number[] {
  return Array.from({ length: count }, () => rollDice(sides))
}

/**
 * 解析骰子表达式 (例如: "2d6+3", "1d20", "3d8-2")
 */
export function parseDiceExpression(expression: string): {
  count: number
  sides: number
  modifier: number
} | null {
  const regex = /^(\d+)?d(\d+)([+-]\d+)?$/i
  const match = expression.trim().match(regex)
  
  if (!match) return null
  
  const count = parseInt(match[1] || '1')
  const sides = parseInt(match[2])
  const modifier = parseInt(match[3] || '0')
  
  return { count, sides, modifier }
}

/**
 * 执行骰子表达式
 */
export function executeDiceRoll(expression: string): DiceRoll | null {
  const parsed = parseDiceExpression(expression)
  
  if (!parsed) return null
  
  const { count, sides, modifier } = parsed
  const results = rollMultipleDice(count, sides)
  const total = results.reduce((sum, val) => sum + val, 0) + modifier
  
  return {
    id: crypto.randomUUID(),
    expression,
    results,
    total,
    timestamp: new Date(),
  }
}

/**
 * COC检定
 */
export function cocCheck(
  skillValue: number,
  difficulty: 'easy' | 'normal' | 'hard' = 'normal'
): {
  roll: number
  success: boolean
  degree: 'critical' | 'extreme' | 'hard' | 'normal' | 'fail'
  criticalSuccess: boolean
  criticalFailure: boolean
} {
  const roll = rollDice(100)
  
  // 计算不同难度的目标值
  const targets = {
    easy: Math.floor(skillValue * 1.5),
    normal: skillValue,
    hard: Math.floor(skillValue / 2),
  }
  
  const target = targets[difficulty]
  
  // 判断成功等级
  const criticalSuccess = roll <= 5
  const criticalFailure = roll >= 96
  const extremeSuccess = roll <= Math.floor(skillValue / 5)
  const hardSuccess = roll <= Math.floor(skillValue / 2)
  const normalSuccess = roll <= skillValue
  
  let degree: 'critical' | 'extreme' | 'hard' | 'normal' | 'fail'
  let success = false
  
  if (criticalSuccess) {
    degree = 'critical'
    success = true
  } else if (extremeSuccess && roll <= target) {
    degree = 'extreme'
    success = true
  } else if (hardSuccess && roll <= target) {
    degree = 'hard'
    success = true
  } else if (normalSuccess && roll <= target) {
    degree = 'normal'
    success = true
  } else {
    degree = 'fail'
    success = false
  }
  
  return {
    roll,
    success,
    degree,
    criticalSuccess,
    criticalFailure,
  }
}

/**
 * DND检定
 */
export function dndCheck(
  modifier: number,
  dc: number,
  advantage: 'advantage' | 'normal' | 'disadvantage' = 'normal'
): {
  roll: number
  total: number
  success: boolean
  criticalSuccess: boolean
  criticalFailure: boolean
} {
  let roll: number
  
  if (advantage === 'advantage') {
    const roll1 = rollDice(20)
    const roll2 = rollDice(20)
    roll = Math.max(roll1, roll2)
  } else if (advantage === 'disadvantage') {
    const roll1 = rollDice(20)
    const roll2 = rollDice(20)
    roll = Math.min(roll1, roll2)
  } else {
    roll = rollDice(20)
  }
  
  const total = roll + modifier
  const success = total >= dc
  const criticalSuccess = roll === 20
  const criticalFailure = roll === 1
  
  return {
    roll,
    total,
    success,
    criticalSuccess,
    criticalFailure,
  }
}

/**
 * 快速投掷常用骰子
 */
export function quickRoll(diceType: DiceType, count: number = 1): DiceRoll {
  const sides = parseInt(diceType.substring(1))
  const results = rollMultipleDice(count, sides)
  const total = results.reduce((sum, val) => sum + val, 0)
  
  return {
    id: crypto.randomUUID(),
    expression: `${count}${diceType}`,
    results,
    total,
    timestamp: new Date(),
  }
}

