'use client'

import { GenericCharacter } from '@/types'
import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

interface Props {
  character: GenericCharacter
  onUpdate: (character: GenericCharacter) => void
}

export default function GenericSheet({ character, onUpdate }: Props) {
  const [editing, setEditing] = useState(false)
  const [editedChar, setEditedChar] = useState(character)

  const handleSave = () => {
    onUpdate(editedChar)
    setEditing(false)
  }

  const addAttribute = () => {
    const name = prompt('属性名称:')
    if (name) {
      const value = parseInt(prompt('属性值:') || '0')
      setEditedChar({
        ...editedChar,
        attributes: { ...editedChar.attributes, [name]: value },
      })
    }
  }

  const addSkill = () => {
    const name = prompt('技能名称:')
    if (name) {
      const value = parseInt(prompt('技能值:') || '0')
      setEditedChar({
        ...editedChar,
        skills: { ...editedChar.skills, [name]: value },
      })
    }
  }

  const addResource = () => {
    const name = prompt('资源名称 (如: HP, MP等):')
    if (name) {
      const max = parseInt(prompt('最大值:') || '10')
      setEditedChar({
        ...editedChar,
        resources: { ...editedChar.resources, [name]: { current: max, max } },
      })
    }
  }

  const deleteAttribute = (name: string) => {
    const { [name]: _, ...rest } = editedChar.attributes
    setEditedChar({ ...editedChar, attributes: rest })
  }

  const deleteSkill = (name: string) => {
    const { [name]: _, ...rest } = editedChar.skills
    setEditedChar({ ...editedChar, skills: rest })
  }

  const deleteResource = (name: string) => {
    const { [name]: _, ...rest } = editedChar.resources
    setEditedChar({ ...editedChar, resources: rest })
  }

  const char = editing ? editedChar : character

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">通用角色卡</h3>
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
      <div className="grid grid-cols-2 gap-4">
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
      </div>

      {/* 属性 */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-lg font-bold text-white">属性</h4>
          {editing && (
            <button
              onClick={addAttribute}
              className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
            >
              <Plus size={16} />
              添加
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(char.attributes).map(([name, value]) => (
            <div key={name} className="bg-slate-700 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <label className="text-gray-300 text-sm">{name}</label>
                {editing && (
                  <button
                    onClick={() => deleteAttribute(name)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <input
                type="number"
                value={value}
                onChange={(e) => setEditedChar({
                  ...editedChar,
                  attributes: { ...editedChar.attributes, [name]: parseInt(e.target.value) }
                })}
                disabled={!editing}
                className="w-full px-2 py-1 bg-slate-600 text-white text-center rounded disabled:opacity-50"
              />
            </div>
          ))}
        </div>
        {Object.keys(char.attributes).length === 0 && (
          <p className="text-gray-400 text-center py-4">暂无属性</p>
        )}
      </div>

      {/* 资源 */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-lg font-bold text-white">资源 (HP/MP等)</h4>
          {editing && (
            <button
              onClick={addResource}
              className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
            >
              <Plus size={16} />
              添加
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(char.resources).map(([name, resource]) => (
            <div key={name} className="bg-slate-700 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <label className="text-gray-300 text-sm">{name}</label>
                {editing && (
                  <button
                    onClick={() => deleteResource(name)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="flex gap-1 items-center">
                <input
                  type="number"
                  value={resource.current}
                  onChange={(e) => setEditedChar({
                    ...editedChar,
                    resources: {
                      ...editedChar.resources,
                      [name]: { ...resource, current: parseInt(e.target.value) }
                    }
                  })}
                  disabled={!editing}
                  className="w-full px-2 py-1 bg-slate-600 text-white text-center rounded disabled:opacity-50"
                />
                <span className="text-gray-400">/</span>
                <input
                  type="number"
                  value={resource.max}
                  onChange={(e) => setEditedChar({
                    ...editedChar,
                    resources: {
                      ...editedChar.resources,
                      [name]: { ...resource, max: parseInt(e.target.value) }
                    }
                  })}
                  disabled={!editing}
                  className="w-full px-2 py-1 bg-slate-600 text-white text-center rounded disabled:opacity-50"
                />
              </div>
            </div>
          ))}
        </div>
        {Object.keys(char.resources).length === 0 && (
          <p className="text-gray-400 text-center py-4">暂无资源</p>
        )}
      </div>

      {/* 技能 */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-lg font-bold text-white">技能</h4>
          {editing && (
            <button
              onClick={addSkill}
              className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
            >
              <Plus size={16} />
              添加
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(char.skills).map(([name, value]) => (
            <div key={name} className="bg-slate-700 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1">
                <label className="text-gray-300 text-sm">{name}</label>
                {editing && (
                  <button
                    onClick={() => deleteSkill(name)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <input
                type="number"
                value={value}
                onChange={(e) => setEditedChar({
                  ...editedChar,
                  skills: { ...editedChar.skills, [name]: parseInt(e.target.value) }
                })}
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

      {/* 笔记 */}
      <div>
        <h4 className="text-lg font-bold text-white mb-3">笔记</h4>
        <textarea
          value={char.notes}
          onChange={(e) => setEditedChar({ ...editedChar, notes: e.target.value })}
          disabled={!editing}
          rows={6}
          className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50"
          placeholder="在这里记录角色背景、装备、特殊能力等..."
        />
      </div>
    </div>
  )
}

