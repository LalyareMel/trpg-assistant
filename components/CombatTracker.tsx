'use client'

import { useState, useEffect } from 'react'
import { Combatant, CombatState } from '@/types'
import { Swords, Plus, Play, Pause, SkipForward, Trash2, Heart, Shield } from 'lucide-react'

export default function CombatTracker() {
  const [combat, setCombat] = useState<CombatState | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('trpg_combat')
    if (saved) {
      setCombat(JSON.parse(saved))
    }
  }, [])

  const saveCombat = (newCombat: CombatState | null) => {
    setCombat(newCombat)
    if (newCombat) {
      localStorage.setItem('trpg_combat', JSON.stringify(newCombat))
    } else {
      localStorage.removeItem('trpg_combat')
    }
  }

  const startCombat = () => {
    const newCombat: CombatState = {
      id: crypto.randomUUID(),
      roomId: '',
      combatants: [],
      currentTurn: 0,
      round: 1,
      isActive: true,
    }
    saveCombat(newCombat)
  }

  const endCombat = () => {
    if (confirm('确定要结束战斗吗?')) {
      saveCombat(null)
    }
  }

  const addCombatant = (name: string, initiative: number, hp: number, ac?: number, isPlayer: boolean = false) => {
    if (!combat) return

    const newCombatant: Combatant = {
      id: crypto.randomUUID(),
      name,
      initiative,
      hp,
      maxHp: hp,
      ac,
      conditions: [],
      isPlayer,
    }

    const updatedCombatants = [...combat.combatants, newCombatant].sort(
      (a, b) => b.initiative - a.initiative
    )

    saveCombat({
      ...combat,
      combatants: updatedCombatants,
    })
    setShowAddModal(false)
  }

  const removeCombatant = (id: string) => {
    if (!combat) return
    saveCombat({
      ...combat,
      combatants: combat.combatants.filter((c) => c.id !== id),
    })
  }

  const updateCombatant = (id: string, updates: Partial<Combatant>) => {
    if (!combat) return
    saveCombat({
      ...combat,
      combatants: combat.combatants.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })
  }

  const nextTurn = () => {
    if (!combat || combat.combatants.length === 0) return

    let nextTurn = combat.currentTurn + 1
    let nextRound = combat.round

    if (nextTurn >= combat.combatants.length) {
      nextTurn = 0
      nextRound += 1
    }

    saveCombat({
      ...combat,
      currentTurn: nextTurn,
      round: nextRound,
    })
  }

  const addCondition = (combatantId: string) => {
    const condition = prompt('输入状态效果 (如: 中毒, 眩晕, 隐形等):')
    if (condition) {
      const combatant = combat?.combatants.find((c) => c.id === combatantId)
      if (combatant) {
        updateCombatant(combatantId, {
          conditions: [...combatant.conditions, condition],
        })
      }
    }
  }

  const removeCondition = (combatantId: string, condition: string) => {
    const combatant = combat?.combatants.find((c) => c.id === combatantId)
    if (combatant) {
      updateCombatant(combatantId, {
        conditions: combatant.conditions.filter((c) => c !== condition),
      })
    }
  }

  if (!combat) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Swords className="text-purple-400" />
          战斗追踪器
        </h2>
        <div className="text-center py-12">
          <p className="text-gray-300 mb-4">还没有进行中的战斗</p>
          <button
            onClick={startCombat}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2 mx-auto"
          >
            <Play size={20} />
            开始战斗
          </button>
        </div>
      </div>
    )
  }

  const currentCombatant = combat.combatants[combat.currentTurn]

  return (
    <div className="space-y-6">
      {/* 战斗控制 */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Swords className="text-purple-400" />
              战斗追踪器
            </h2>
            <p className="text-gray-300 mt-1">回合 {combat.round}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
            >
              <Plus size={16} />
              添加
            </button>
            <button
              onClick={nextTurn}
              disabled={combat.combatants.length === 0}
              className="flex items-center gap-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50"
            >
              <SkipForward size={16} />
              下一个
            </button>
            <button
              onClick={endCombat}
              className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
            >
              <Pause size={16} />
              结束战斗
            </button>
          </div>
        </div>

        {currentCombatant && (
          <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-4">
            <p className="text-purple-300 text-sm mb-1">当前回合</p>
            <p className="text-white text-xl font-bold">{currentCombatant.name}</p>
          </div>
        )}
      </div>

      {/* 战斗参与者列表 */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4">参与者</h3>
        
        {combat.combatants.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            还没有参与者，点击"添加"按钮开始
          </p>
        ) : (
          <div className="space-y-3">
            {combat.combatants.map((combatant, index) => {
              const isCurrent = index === combat.currentTurn
              const hpPercentage = (combatant.hp / combatant.maxHp) * 100

              return (
                <div
                  key={combatant.id}
                  className={`rounded-lg p-4 transition-all ${
                    isCurrent
                      ? 'bg-purple-900/50 border-2 border-purple-500'
                      : 'bg-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-bold text-lg">{combatant.name}</h4>
                        {combatant.isPlayer && (
                          <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded">
                            玩家
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-slate-600 text-white text-xs rounded">
                          先攻: {combatant.initiative}
                        </span>
                      </div>
                      
                      {/* HP条 */}
                      <div className="flex items-center gap-2 mb-2">
                        <Heart size={16} className="text-red-400" />
                        <div className="flex-1">
                          <div className="flex justify-between text-sm text-gray-300 mb-1">
                            <span>HP</span>
                            <span>{combatant.hp} / {combatant.maxHp}</span>
                          </div>
                          <div className="w-full bg-slate-600 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                hpPercentage > 50
                                  ? 'bg-green-500'
                                  : hpPercentage > 25
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.max(0, hpPercentage)}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateCombatant(combatant.id, { hp: Math.max(0, combatant.hp - 1) })}
                            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                          >
                            -
                          </button>
                          <button
                            onClick={() => updateCombatant(combatant.id, { hp: Math.min(combatant.maxHp, combatant.hp + 1) })}
                            className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* AC */}
                      {combatant.ac !== undefined && (
                        <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                          <Shield size={14} />
                          <span>AC: {combatant.ac}</span>
                        </div>
                      )}

                      {/* 状态效果 */}
                      {combatant.conditions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {combatant.conditions.map((condition, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-orange-600 text-white text-xs rounded flex items-center gap-1 cursor-pointer hover:bg-orange-700"
                              onClick={() => removeCondition(combatant.id, condition)}
                            >
                              {condition}
                              <span className="text-xs">×</span>
                            </span>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => addCondition(combatant.id)}
                        className="text-purple-400 hover:text-purple-300 text-sm"
                      >
                        + 添加状态
                      </button>
                    </div>

                    <button
                      onClick={() => removeCombatant(combatant.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 添加参与者模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">添加参与者</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const name = formData.get('name') as string
                const initiative = parseInt(formData.get('initiative') as string)
                const hp = parseInt(formData.get('hp') as string)
                const ac = formData.get('ac') ? parseInt(formData.get('ac') as string) : undefined
                const isPlayer = formData.get('isPlayer') === 'on'
                
                if (name && !isNaN(initiative) && !isNaN(hp)) {
                  addCombatant(name, initiative, hp, ac, isPlayer)
                }
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm block mb-2">名称</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg"
                    placeholder="角色或怪物名称"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-gray-300 text-sm block mb-2">先攻</label>
                    <input
                      type="number"
                      name="initiative"
                      required
                      className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm block mb-2">HP</label>
                    <input
                      type="number"
                      name="hp"
                      required
                      className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg"
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm block mb-2">AC</label>
                    <input
                      type="number"
                      name="ac"
                      className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg"
                      placeholder="10"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isPlayer"
                    id="isPlayer"
                    className="w-4 h-4"
                  />
                  <label htmlFor="isPlayer" className="text-gray-300 text-sm">
                    玩家角色
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                  >
                    添加
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
                  >
                    取消
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

