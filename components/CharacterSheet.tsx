'use client'

import { useState, useEffect } from 'react'
import { Character, GameSystem } from '@/types'
import { User, Plus, Edit, Trash2, Download, Upload } from 'lucide-react'
import COCSheet from './character/COCSheet'
import DNDSheet from './character/DNDSheet'
import GenericSheet from './character/GenericSheet'

export default function CharacterSheet() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [gameSystem, setGameSystem] = useState<GameSystem>('COC')

  // 从localStorage加载角色
  useEffect(() => {
    const saved = localStorage.getItem('trpg_characters')
    if (saved) {
      setCharacters(JSON.parse(saved))
    }
  }, [])

  // 保存角色到localStorage
  const saveCharacters = (chars: Character[]) => {
    setCharacters(chars)
    localStorage.setItem('trpg_characters', JSON.stringify(chars))
  }

  const createCharacter = (system: GameSystem) => {
    let newCharacter: Character

    if (system === 'COC') {
      newCharacter = {
        id: crypto.randomUUID(),
        name: '新角色',
        player: '',
        occupation: '',
        age: 25,
        sex: '',
        attributes: {
          STR: 50,
          CON: 50,
          SIZ: 50,
          DEX: 50,
          APP: 50,
          INT: 50,
          POW: 50,
          EDU: 50,
          LUCK: 50,
        },
        derived: {
          HP: 10,
          maxHP: 10,
          MP: 10,
          maxMP: 10,
          SAN: 50,
          maxSAN: 99,
          MOV: 8,
          DB: '0',
          BUILD: 0,
        },
        skills: {},
        equipment: [],
        gameSystem: 'COC',
      }
    } else if (system === 'DND') {
      newCharacter = {
        id: crypto.randomUUID(),
        name: '新角色',
        player: '',
        class: '',
        level: 1,
        race: '',
        background: '',
        alignment: '',
        attributes: {
          STR: 10,
          DEX: 10,
          CON: 10,
          INT: 10,
          WIS: 10,
          CHA: 10,
        },
        modifiers: {
          STR: 0,
          DEX: 0,
          CON: 0,
          INT: 0,
          WIS: 0,
          CHA: 0,
        },
        combat: {
          HP: 10,
          maxHP: 10,
          AC: 10,
          initiative: 0,
          speed: 30,
        },
        savingThrows: {
          STR: 0,
          DEX: 0,
          CON: 0,
          INT: 0,
          WIS: 0,
          CHA: 0,
        },
        skills: {},
        features: [],
        equipment: [],
        gameSystem: 'DND',
      }
    } else {
      newCharacter = {
        id: crypto.randomUUID(),
        name: '新角色',
        player: '',
        gameSystem: 'GENERIC',
        attributes: {},
        skills: {},
        resources: {},
        notes: '',
      }
    }

    const updated = [...characters, newCharacter]
    saveCharacters(updated)
    setSelectedCharacter(newCharacter)
    setShowCreateModal(false)
  }

  const updateCharacter = (updated: Character) => {
    const newChars = characters.map((c) => (c.id === updated.id ? updated : c))
    saveCharacters(newChars)
    setSelectedCharacter(updated)
  }

  const deleteCharacter = (id: string) => {
    if (confirm('确定要删除这个角色吗?')) {
      const updated = characters.filter((c) => c.id !== id)
      saveCharacters(updated)
      if (selectedCharacter?.id === id) {
        setSelectedCharacter(null)
      }
    }
  }

  const exportCharacter = (character: Character) => {
    const dataStr = JSON.stringify(character, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${character.name}_${character.gameSystem}.json`
    link.click()
  }

  const importCharacter = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const character = JSON.parse(e.target?.result as string) as Character
            character.id = crypto.randomUUID() // 生成新ID
            const updated = [...characters, character]
            saveCharacters(updated)
          } catch (error) {
            alert('导入失败: 文件格式错误')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <div className="space-y-6">
      {/* 角色列表 */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <User className="text-purple-400" />
            角色卡管理
          </h2>
          <div className="flex gap-2">
            <button
              onClick={importCharacter}
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              <Upload size={16} />
              导入
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
            >
              <Plus size={16} />
              创建角色
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((char) => (
            <div
              key={char.id}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedCharacter?.id === char.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
              onClick={() => setSelectedCharacter(char)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{char.name}</h3>
                  <p className="text-sm opacity-80">{char.player || '未命名玩家'}</p>
                </div>
                <span className="px-2 py-1 bg-black/20 rounded text-xs">
                  {char.gameSystem}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    exportCharacter(char)
                  }}
                  className="flex-1 px-2 py-1 bg-black/20 hover:bg-black/30 rounded text-sm flex items-center justify-center gap-1"
                >
                  <Download size={14} />
                  导出
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteCharacter(char.id)
                  }}
                  className="flex-1 px-2 py-1 bg-red-600/50 hover:bg-red-600 rounded text-sm flex items-center justify-center gap-1"
                >
                  <Trash2 size={14} />
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>

        {characters.length === 0 && (
          <p className="text-gray-400 text-center py-8">
            还没有角色，点击"创建角色"开始吧！
          </p>
        )}
      </div>

      {/* 角色详情 */}
      {selectedCharacter && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
          {selectedCharacter.gameSystem === 'COC' && (
            <COCSheet character={selectedCharacter} onUpdate={updateCharacter} />
          )}
          {selectedCharacter.gameSystem === 'DND' && (
            <DNDSheet character={selectedCharacter} onUpdate={updateCharacter} />
          )}
          {selectedCharacter.gameSystem === 'GENERIC' && (
            <GenericSheet character={selectedCharacter} onUpdate={updateCharacter} />
          )}
        </div>
      )}

      {/* 创建角色模态框 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">选择游戏系统</h3>
            <div className="space-y-2">
              <button
                onClick={() => createCharacter('COC')}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              >
                克苏鲁的呼唤 (COC)
              </button>
              <button
                onClick={() => createCharacter('DND')}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                龙与地下城 (DND)
              </button>
              <button
                onClick={() => createCharacter('GENERIC')}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
              >
                通用角色卡
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

