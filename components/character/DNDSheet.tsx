'use client'

import { DNDCharacter } from '@/types'
import { useState } from 'react'

interface Props {
  character: DNDCharacter
  onUpdate: (character: DNDCharacter) => void
}

export default function DNDSheet({ character, onUpdate }: Props) {
  const [editing, setEditing] = useState(false)
  const [editedChar, setEditedChar] = useState(character)

  const calculateModifier = (score: number): number => {
    return Math.floor((score - 10) / 2)
  }

  const handleSave = () => {
    // 自动计算调整值
    const modifiers = {
      STR: calculateModifier(editedChar.attributes.STR),
      DEX: calculateModifier(editedChar.attributes.DEX),
      CON: calculateModifier(editedChar.attributes.CON),
      INT: calculateModifier(editedChar.attributes.INT),
      WIS: calculateModifier(editedChar.attributes.WIS),
      CHA: calculateModifier(editedChar.attributes.CHA),
    }
    onUpdate({ ...editedChar, modifiers })
    setEditing(false)
  }

  const updateAttribute = (key: keyof DNDCharacter['attributes'], value: number) => {
    setEditedChar({
      ...editedChar,
      attributes: { ...editedChar.attributes, [key]: value },
    })
  }

  const char = editing ? editedChar : character

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">DND 5E角色卡</h3>
        {editing ? (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              保存
            </button>
            <button
              onClick={() => {
                setEditedChar(character)
                setEditing(false)
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              取消
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            编辑
          </button>
        )}
      </div>

      {/* 基本信息 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="text-gray-300 text-sm">角色名</label>
          <input
            type="text"
            value={char.name}
            onChange={(e) => setEditedChar({ ...editedChar, name: e.target.value })}
            disabled={!editing}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50"
          />
        </div>
        <div>
          <label className="text-gray-300 text-sm">职业</label>
          <input
            type="text"
            value={char.class}
            onChange={(e) => setEditedChar({ ...editedChar, class: e.target.value })}
            disabled={!editing}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50"
          />
        </div>
        <div>
          <label className="text-gray-300 text-sm">等级</label>
          <input
            type="number"
            value={char.level}
            onChange={(e) => setEditedChar({ ...editedChar, level: parseInt(e.target.value) })}
            disabled={!editing}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50"
          />
        </div>
        <div>
          <label className="text-gray-300 text-sm">种族</label>
          <input
            type="text"
            value={char.race}
            onChange={(e) => setEditedChar({ ...editedChar, race: e.target.value })}
            disabled={!editing}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50"
          />
        </div>
      </div>

      {/* 属性 */}
      <div>
        <h4 className="text-lg font-bold text-white mb-3">属性</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(char.attributes).map(([key, value]) => {
            const modifier = calculateModifier(value)
            return (
              <div key={key} className="bg-slate-700 rounded-lg p-4 text-center">
                <label className="text-gray-300 text-sm block mb-2">{key}</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => updateAttribute(key as keyof DNDCharacter['attributes'], parseInt(e.target.value))}
                  disabled={!editing}
                  className="w-full px-2 py-1 bg-slate-600 text-white text-center rounded disabled:opacity-50 mb-2"
                />
                <div className="text-purple-400 font-bold">
                  {modifier >= 0 ? '+' : ''}{modifier}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 战斗属性 */}
      <div>
        <h4 className="text-lg font-bold text-white mb-3">战斗属性</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-slate-700 rounded-lg p-3">
            <label className="text-gray-300 text-sm">HP</label>
            <div className="flex gap-1 items-center">
              <input
                type="number"
                value={char.combat.HP}
                onChange={(e) => setEditedChar({
                  ...editedChar,
                  combat: { ...editedChar.combat, HP: parseInt(e.target.value) }
                })}
                disabled={!editing}
                className="w-full px-2 py-1 bg-slate-600 text-white text-center rounded disabled:opacity-50"
              />
              <span className="text-gray-400">/</span>
              <input
                type="number"
                value={char.combat.maxHP}
                onChange={(e) => setEditedChar({
                  ...editedChar,
                  combat: { ...editedChar.combat, maxHP: parseInt(e.target.value) }
                })}
                disabled={!editing}
                className="w-full px-2 py-1 bg-slate-600 text-white text-center rounded disabled:opacity-50"
              />
            </div>
          </div>
          <div className="bg-slate-700 rounded-lg p-3">
            <label className="text-gray-300 text-sm">AC</label>
            <input
              type="number"
              value={char.combat.AC}
              onChange={(e) => setEditedChar({
                ...editedChar,
                combat: { ...editedChar.combat, AC: parseInt(e.target.value) }
              })}
              disabled={!editing}
              className="w-full px-2 py-1 bg-slate-600 text-white text-center rounded disabled:opacity-50"
            />
          </div>
          <div className="bg-slate-700 rounded-lg p-3">
            <label className="text-gray-300 text-sm">先攻</label>
            <input
              type="number"
              value={char.combat.initiative}
              onChange={(e) => setEditedChar({
                ...editedChar,
                combat: { ...editedChar.combat, initiative: parseInt(e.target.value) }
              })}
              disabled={!editing}
              className="w-full px-2 py-1 bg-slate-600 text-white text-center rounded disabled:opacity-50"
            />
          </div>
          <div className="bg-slate-700 rounded-lg p-3">
            <label className="text-gray-300 text-sm">速度</label>
            <input
              type="number"
              value={char.combat.speed}
              onChange={(e) => setEditedChar({
                ...editedChar,
                combat: { ...editedChar.combat, speed: parseInt(e.target.value) }
              })}
              disabled={!editing}
              className="w-full px-2 py-1 bg-slate-600 text-white text-center rounded disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* 豁免 */}
      <div>
        <h4 className="text-lg font-bold text-white mb-3">豁免</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(char.savingThrows).map(([key, value]) => (
            <div key={key} className="bg-slate-700 rounded-lg p-3">
              <label className="text-gray-300 text-sm block mb-1">{key}</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setEditedChar({
                  ...editedChar,
                  savingThrows: { ...editedChar.savingThrows, [key]: parseInt(e.target.value) }
                })}
                disabled={!editing}
                className="w-full px-2 py-1 bg-slate-600 text-white text-center rounded disabled:opacity-50"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

