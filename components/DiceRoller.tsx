'use client'

import { useState, useEffect } from 'react'
import { DiceRoll, DiceType } from '@/types'
import { executeDiceRoll, quickRoll, cocCheck, dndCheck } from '@/lib/dice'
import { Dices, Trash2, Copy } from 'lucide-react'

export default function DiceRoller() {
  const [expression, setExpression] = useState('')
  const [history, setHistory] = useState<DiceRoll[]>([])
  const [isRolling, setIsRolling] = useState(false)

  // 从localStorage加载历史记录
  useEffect(() => {
    const saved = localStorage.getItem('trpg_dice_history')
    if (saved) {
      const rolls = JSON.parse(saved)
      // 转换Date字段
      const rollsWithDates = rolls.map((roll: DiceRoll) => ({
        ...roll,
        timestamp: new Date(roll.timestamp)
      }))
      setHistory(rollsWithDates)
    }
  }, [])

  // 保存历史记录到localStorage
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('trpg_dice_history', JSON.stringify(history))
    }
  }, [history])

  const diceTypes: DiceType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100']

  const handleRoll = () => {
    if (!expression.trim()) return

    setIsRolling(true)
    setTimeout(() => {
      const result = executeDiceRoll(expression)
      if (result) {
        setHistory([result, ...history])
      }
      setIsRolling(false)
    }, 500)
  }

  const handleQuickRoll = (diceType: DiceType) => {
    setIsRolling(true)
    setTimeout(() => {
      const result = quickRoll(diceType)
      setHistory([result, ...history])
      setIsRolling(false)
    }, 500)
  }

  const handleCOCCheck = () => {
    const skillValue = parseInt(prompt('请输入技能值(0-100):') || '0')
    if (isNaN(skillValue) || skillValue < 0 || skillValue > 100) return

    const difficulty = prompt('请选择难度 (easy/normal/hard):', 'normal') as 'easy' | 'normal' | 'hard'
    
    setIsRolling(true)
    setTimeout(() => {
      const result = cocCheck(skillValue, difficulty)
      const diceRoll: DiceRoll = {
        id: crypto.randomUUID(),
        expression: `COC检定 (${difficulty}) - 目标值: ${skillValue}`,
        results: [result.roll],
        total: result.roll,
        timestamp: new Date(),
        gameSystem: 'COC',
        checkType: difficulty,
        success: result.success,
        criticalSuccess: result.criticalSuccess,
        criticalFailure: result.criticalFailure,
      }
      setHistory([diceRoll, ...history])
      setIsRolling(false)
    }, 500)
  }

  const handleDNDCheck = () => {
    const modifier = parseInt(prompt('请输入调整值:') || '0')
    const dc = parseInt(prompt('请输入DC:') || '10')
    const advantage = prompt('优势/劣势? (advantage/normal/disadvantage):', 'normal') as 'advantage' | 'normal' | 'disadvantage'
    
    setIsRolling(true)
    setTimeout(() => {
      const result = dndCheck(modifier, dc, advantage)
      const diceRoll: DiceRoll = {
        id: crypto.randomUUID(),
        expression: `DND检定 (${advantage}) - DC: ${dc}, 调整值: ${modifier > 0 ? '+' : ''}${modifier}`,
        results: [result.roll],
        total: result.total,
        timestamp: new Date(),
        gameSystem: 'DND',
        checkType: advantage,
        success: result.success,
        criticalSuccess: result.criticalSuccess,
        criticalFailure: result.criticalFailure,
      }
      setHistory([diceRoll, ...history])
      setIsRolling(false)
    }, 500)
  }

  const clearHistory = () => {
    setHistory([])
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      {/* 骰子输入区 */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Dices className="text-purple-400" />
          骰子投掷
        </h2>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleRoll()}
            placeholder="输入骰子表达式 (例如: 2d6+3)"
            className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleRoll}
            disabled={isRolling}
            className={`px-6 py-3 bg-purple-600 text-white rounded-lg font-medium transition-all ${
              isRolling ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
            }`}
          >
            {isRolling ? '投掷中...' : '投掷'}
          </button>
        </div>

        {/* 快速骰子按钮 */}
        <div className="mb-4">
          <p className="text-gray-300 text-sm mb-2">快速投掷:</p>
          <div className="flex flex-wrap gap-2">
            {diceTypes.map((dice) => (
              <button
                key={dice}
                onClick={() => handleQuickRoll(dice)}
                disabled={isRolling}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all disabled:opacity-50"
              >
                {dice.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* 游戏系统检定 */}
        <div>
          <p className="text-gray-300 text-sm mb-2">游戏系统检定:</p>
          <div className="flex gap-2">
            <button
              onClick={handleCOCCheck}
              disabled={isRolling}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
            >
              COC检定
            </button>
            <button
              onClick={handleDNDCheck}
              disabled={isRolling}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              DND检定
            </button>
          </div>
        </div>
      </div>

      {/* 历史记录 */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">投掷历史</h3>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm"
            >
              <Trash2 size={16} />
              清空
            </button>
          )}
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-gray-400 text-center py-8">暂无投掷记录</p>
          ) : (
            history.map((roll) => (
              <div
                key={roll.id}
                className={`p-4 rounded-lg ${
                  roll.success === true
                    ? 'bg-green-900/30 border border-green-500/30'
                    : roll.success === false
                    ? 'bg-red-900/30 border border-red-500/30'
                    : 'bg-slate-700/50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">{roll.expression}</span>
                      {roll.gameSystem && (
                        <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded">
                          {roll.gameSystem}
                        </span>
                      )}
                      {roll.criticalSuccess && (
                        <span className="px-2 py-0.5 bg-yellow-600 text-white text-xs rounded">
                          大成功!
                        </span>
                      )}
                      {roll.criticalFailure && (
                        <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded">
                          大失败!
                        </span>
                      )}
                    </div>
                    <div className="text-gray-300 text-sm">
                      结果: [{roll.results.join(', ')}] = <span className="text-2xl font-bold text-purple-400">{roll.total}</span>
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      {roll.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(`${roll.expression} = ${roll.total}`)}
                    className="p-2 hover:bg-slate-600 rounded transition-all"
                    title="复制结果"
                  >
                    <Copy size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

