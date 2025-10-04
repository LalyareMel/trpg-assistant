'use client'

import { COCCharacter } from '@/types'
import { useState } from 'react'

interface Props {
  character: COCCharacter
  onUpdate: (character: COCCharacter) => void
}

export default function COCSheet({ character, onUpdate }: Props) {
  const [editing, setEditing] = useState(false)
  const [editedChar, setEditedChar] = useState(character)

  const handleSave = () => {
    onUpdate(editedChar)
    setEditing(false)
  }

  const updateAttribute = (key: keyof COCCharacter['attributes'], value: number) => {
    setEditedChar({
      ...editedChar,
      attributes: { ...editedChar.attributes, [key]: value },
    })
  }

  const updateDerived = (key: keyof COCCharacter['derived'], value: number | string) => {
    setEditedChar({
      ...editedChar,
      derived: { ...editedChar.derived, [key]: value },
    })
  }

  const addSkill = () => {
    const skillName = prompt('技能名称:')
    if (skillName) {
      const skillValue = parseInt(prompt('技能值(0-100):') || '0')
      setEditedChar({
        ...editedChar,
        skills: { ...editedChar.skills, [skillName]: skillValue },
      })
    }
  }

  const updateSkill = (skillName: string, value: number) => {
    setEditedChar({
      ...editedChar,
      skills: { ...editedChar.skills, [skillName]: value },
    })
  }

  const deleteSkill = (skillName: string) => {
    const { [skillName]: _, ...rest } = editedChar.skills
    setEditedChar({ ...editedChar, skills: rest })
  }

  const char = editing ? editedChar : character

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">COC 7版角色卡</h3>
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
          <label className="text-gray-300 text-sm">玩家</label>
          <input
            type="text"
            value={char.player}
            onChange={(e) => setEditedChar({ ...editedChar, player: e.target.value })}
            disabled={!editing}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50"
          />
        </div>
        <div>
          <label className="text-gray-300 text-sm">职业</label>
          <input
            type="text"
            value={char.occupation}
            onChange={(e) => setEditedChar({ ...editedChar, occupation: e.target.value })}
            disabled={!editing}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50"
          />
        </div>
        <div>
          <label className="text-gray-300 text-sm">年龄</label>
          <input
            type="number"
            value={char.age}
            onChange={(e) => setEditedChar({ ...editedChar, age: parseInt(e.target.value) })}
            disabled={!editing}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50"
          />
        </div>
      </div>

      {/* 属性 */}
      <div>
        <h4 className="text-lg font-bold text-white mb-3">属性</h4>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {Object.entries(char.attributes).map(([key, value]) => (
            <div key={key} className="bg-slate-700 rounded-lg p-3">
              <label className="text-gray-300 text-sm block mb-1">{key}</label>
              <input
                type="number"
                value={value}
                onChange={(e) => updateAttribute(key as keyof COCCharacter['attributes'], parseInt(e.target.value))}
                disabled={!editing}
                className="w-full px-2 py-1 bg-slate-600 text-white text-center rounded disabled:opacity-50"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 衍生属性 */}
      <div>
        <h4 className="text-lg font-bold text-white mb-3">衍生属性</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-700 rounded-lg p-3">
            <label className="text-gray-300 text-sm">HP</label>
            <div className="flex gap-1 items-center">
              <input
                type="number"
                value={char.derived.HP}
                onChange={(e) => updateDerived('HP', parseInt(e.target.value))}
                disabled={!editing}
                className="w-full px-2 py-1 bg-slate-600 text-white text-center rounded disabled:opacity-50"
              />
              <span className="text-gray-400">/</span>
              <input
                type="number"
                value={char.derived.maxHP}
                onChange={(e) => updateDerived('maxHP', parseInt(e.target.value))}
                disabled={!editing}
                className="w-full px-2 py-1 bg-slate-600 text-white text-center rounded disabled:opacity-50"
              />
            </div>
          </div>
          <div className="bg-slate-700 rounded-lg p-3">
            <label className="text-gray-300 text-sm">MP</label>
            <div className="flex gap-1 items-center">
              <input
                type="number"
                value={char.derived.MP}
                onChange={(e) => updateDerived('MP', parseInt(e.target.value))}
                disabled={!editing}
                className="w-full px-2 py-1 bg-slate-600 text-white text-center rounded disabled:opacity-50"
              />
              <span className="text-gray-400">/</span>
              <input
                type="number"
                value={char.derived.maxMP}
                onChange={(e) => updateDerived('maxMP', parseInt(e.target.value))}
                disabled={!editing}
                className="w-full px-2 py-1 bg-slate-600 text-white text-center rounded disabled:opacity-50"
              />
            </div>
          </div>
          <div className="bg-slate-700 rounded-lg p-3">
            <label className="text-gray-300 text-sm">SAN</label>
            <div className="flex gap-1 items-center">
              <input
                type="number"
                value={char.derived.SAN}
                onChange={(e) => updateDerived('SAN', parseInt(e.target.value))}
                disabled={!editing}
                className="w-full px-2 py-1 bg-slate-600 text-white text-center rounded disabled:opacity-50"
              />
              <span className="text-gray-400">/</span>
              <input
                type="number"
                value={char.derived.maxSAN}
                onChange={(e) => updateDerived('maxSAN', parseInt(e.target.value))}
                disabled={!editing}
                className="w-full px-2 py-1 bg-slate-600 text-white text-center rounded disabled:opacity-50"
              />
            </div>
          </div>
          <div className="bg-slate-700 rounded-lg p-3">
            <label className="text-gray-300 text-sm">MOV</label>
            <input
              type="number"
              value={char.derived.MOV}
              onChange={(e) => updateDerived('MOV', parseInt(e.target.value))}
              disabled={!editing}
              className="w-full px-2 py-1 bg-slate-600 text-white text-center rounded disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* 技能 */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-lg font-bold text-white">技能</h4>
          {editing && (
            <button
              onClick={addSkill}
              className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
            >
              添加技能
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(char.skills).map(([skillName, skillValue]) => (
            <div key={skillName} className="bg-slate-700 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <label className="text-gray-300 text-sm">{skillName}</label>
                {editing && (
                  <button
                    onClick={() => deleteSkill(skillName)}
                    className="text-red-400 hover:text-red-300 text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
              <input
                type="number"
                value={skillValue}
                onChange={(e) => updateSkill(skillName, parseInt(e.target.value))}
                disabled={!editing}
                className="w-full px-2 py-1 bg-slate-600 text-white text-center rounded disabled:opacity-50"
              />
            </div>
          ))}
        </div>
        {Object.keys(char.skills).length === 0 && (
          <p className="text-gray-400 text-center py-4">暂无技能</p>
        )}
      </div>
    </div>
  )
}

