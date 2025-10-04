'use client'

import { useState } from 'react'
import DiceRoller from '@/components/DiceRoller'
import CharacterSheet from '@/components/CharacterSheet'
import RoomManager from '@/components/RoomManager'
import P2PRoomManager from '@/components/P2PRoomManager'
import CombatTracker from '@/components/CombatTracker'
import OnlineIndicator from '@/components/OnlineIndicator'
import { Dices, User, Users, Swords, Wifi } from 'lucide-react'

type Tab = 'dice' | 'character' | 'room' | 'p2p' | 'combat'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('dice')

  const tabs = [
    { id: 'dice' as Tab, name: '骰子', icon: Dices },
    { id: 'character' as Tab, name: '角色卡', icon: User },
    { id: 'p2p' as Tab, name: 'P2P联机', icon: Wifi },
    { id: 'room' as Tab, name: '房间(旧)', icon: Users },
    { id: 'combat' as Tab, name: '战斗', icon: Swords },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* 头部 */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            🎲 TRPG助手
          </h1>
          <p className="text-gray-300">支持COC、DND等多种跑团游戏</p>
        </header>

        {/* 标签导航 */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-2 flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-slate-700/50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dice' && <DiceRoller />}
          {activeTab === 'character' && <CharacterSheet />}
          {activeTab === 'p2p' && <P2PRoomManager />}
          {activeTab === 'room' && <RoomManager />}
          {activeTab === 'combat' && <CombatTracker />}
        </div>
      </div>

      {/* 在线状态指示器 */}
      <OnlineIndicator />
    </main>
  )
}

