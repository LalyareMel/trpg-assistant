'use client'

import { useState, useEffect } from 'react'
import { Room, GameSystem } from '@/types'
import { Users, Plus, LogIn, LogOut, Crown, Trash2 } from 'lucide-react'

export default function RoomManager() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [userId] = useState(() => {
    // 简单的用户ID生成（实际应用中应该使用真实的认证系统）
    const saved = localStorage.getItem('trpg_user_id')
    if (saved) return saved
    const newId = crypto.randomUUID()
    localStorage.setItem('trpg_user_id', newId)
    return newId
  })

  useEffect(() => {
    const saved = localStorage.getItem('trpg_rooms')
    if (saved) {
      setRooms(JSON.parse(saved))
    }
  }, [])

  const saveRooms = (newRooms: Room[]) => {
    setRooms(newRooms)
    localStorage.setItem('trpg_rooms', JSON.stringify(newRooms))
  }

  const createRoom = (name: string, gameSystem: GameSystem) => {
    const newRoom: Room = {
      id: crypto.randomUUID(),
      name,
      gameSystem,
      gmId: userId,
      players: [userId],
      createdAt: new Date(),
      isActive: true,
    }
    saveRooms([...rooms, newRoom])
    setCurrentRoom(newRoom)
    setShowCreateModal(false)
  }

  const joinRoom = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId)
    if (room && !room.players.includes(userId)) {
      const updatedRoom = {
        ...room,
        players: [...room.players, userId],
      }
      saveRooms(rooms.map((r) => (r.id === roomId ? updatedRoom : r)))
      setCurrentRoom(updatedRoom)
    } else if (room) {
      setCurrentRoom(room)
    }
  }

  const leaveRoom = () => {
    if (!currentRoom) return
    
    const updatedRoom = {
      ...currentRoom,
      players: currentRoom.players.filter((p) => p !== userId),
    }
    
    // 如果是GM离开，删除房间
    if (currentRoom.gmId === userId) {
      saveRooms(rooms.filter((r) => r.id !== currentRoom.id))
    } else {
      saveRooms(rooms.map((r) => (r.id === currentRoom.id ? updatedRoom : r)))
    }
    
    setCurrentRoom(null)
  }

  const deleteRoom = (roomId: string) => {
    if (confirm('确定要删除这个房间吗?')) {
      saveRooms(rooms.filter((r) => r.id !== roomId))
      if (currentRoom?.id === roomId) {
        setCurrentRoom(null)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* 当前房间 */}
      {currentRoom ? (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Users className="text-purple-400" />
                {currentRoom.name}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-1 bg-purple-600 text-white text-sm rounded">
                  {currentRoom.gameSystem}
                </span>
                {currentRoom.gmId === userId && (
                  <span className="px-2 py-1 bg-yellow-600 text-white text-sm rounded flex items-center gap-1">
                    <Crown size={14} />
                    GM
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={leaveRoom}
              className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
            >
              <LogOut size={16} />
              离开房间
            </button>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-bold mb-2">房间信息</h3>
            <div className="space-y-2 text-gray-300">
              <p>房间ID: <code className="bg-slate-600 px-2 py-1 rounded text-sm">{currentRoom.id}</code></p>
              <p>玩家数量: {currentRoom.players.length}</p>
              <p>创建时间: {new Date(currentRoom.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-4 bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-bold mb-2">功能说明</h3>
            <div className="text-gray-300 text-sm space-y-1">
              <p>• 在"骰子"标签页投掷的结果会同步到房间内所有玩家</p>
              <p>• 在"战斗"标签页可以管理战斗追踪器</p>
              <p>• GM可以查看所有玩家的角色卡</p>
              <p>• 分享房间ID给其他玩家，他们可以加入房间</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
            <p className="text-blue-200 text-sm">
              💡 提示: 当前版本使用本地存储。要实现真正的多人实时协作，需要配置Supabase后端服务。
            </p>
          </div>
        </div>
      ) : (
        /* 房间列表 */
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="text-purple-400" />
              房间列表
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
            >
              <Plus size={16} />
              创建房间
            </button>
          </div>

          <div className="space-y-3">
            {rooms.filter(r => r.isActive).map((room) => (
              <div
                key={room.id}
                className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-white font-bold">{room.name}</h3>
                      <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded">
                        {room.gameSystem}
                      </span>
                      {room.gmId === userId && (
                        <span className="px-2 py-0.5 bg-yellow-600 text-white text-xs rounded flex items-center gap-1">
                          <Crown size={12} />
                          你的房间
                        </span>
                      )}
                    </div>
                    <div className="text-gray-300 text-sm">
                      <p>玩家: {room.players.length}</p>
                      <p>创建于: {new Date(room.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => joinRoom(room.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-1"
                    >
                      <LogIn size={16} />
                      {room.players.includes(userId) ? '进入' : '加入'}
                    </button>
                    {room.gmId === userId && (
                      <button
                        onClick={() => deleteRoom(room.id)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {rooms.filter(r => r.isActive).length === 0 && (
            <p className="text-gray-400 text-center py-8">
              还没有房间，创建一个开始游戏吧！
            </p>
          )}
        </div>
      )}

      {/* 创建房间模态框 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">创建房间</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const name = formData.get('name') as string
                const gameSystem = formData.get('gameSystem') as GameSystem
                if (name) {
                  createRoom(name, gameSystem)
                }
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm block mb-2">房间名称</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg"
                    placeholder="输入房间名称"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm block mb-2">游戏系统</label>
                  <select
                    name="gameSystem"
                    className="w-full px-3 py-2 bg-slate-700 text-white rounded-lg"
                  >
                    <option value="COC">克苏鲁的呼唤 (COC)</option>
                    <option value="DND">龙与地下城 (DND)</option>
                    <option value="GENERIC">通用系统</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                  >
                    创建
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
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

