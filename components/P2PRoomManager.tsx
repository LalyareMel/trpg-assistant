'use client'

import { useState, useEffect } from 'react'
import { useP2P } from '@/lib/hooks/useP2P'
import { Users, Copy, LogOut, Crown, User, Wifi, WifiOff } from 'lucide-react'

export default function P2PRoomManager() {
  const [userName, setUserName] = useState('')
  const [roomCodeInput, setRoomCodeInput] = useState('')
  const [showNameInput, setShowNameInput] = useState(true)
  const [copied, setCopied] = useState(false)

  const p2p = useP2P(userName)

  // 从localStorage加载用户名
  useEffect(() => {
    const savedName = localStorage.getItem('trpg_user_name')
    if (savedName) {
      setUserName(savedName)
      setShowNameInput(false)
    }
  }, [])

  // 保存用户名
  const handleSetName = () => {
    if (userName.trim()) {
      localStorage.setItem('trpg_user_name', userName.trim())
      setShowNameInput(false)
    }
  }

  // 创建房间
  const handleCreateRoom = async () => {
    try {
      const roomId = await p2p.createRoom()
      console.log('房间创建成功:', roomId)
    } catch (err) {
      console.error(err)
    }
  }

  // 加入房间
  const handleJoinRoom = async () => {
    if (!roomCodeInput.trim()) {
      alert('请输入房间码')
      return
    }

    try {
      await p2p.joinRoom(roomCodeInput.trim())
      setRoomCodeInput('')
    } catch (err) {
      console.error(err)
    }
  }

  // 复制房间码
  const handleCopyRoomCode = () => {
    if (p2p.roomId) {
      navigator.clipboard.writeText(p2p.roomId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // 如果需要输入用户名
  if (showNameInput) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">设置你的名字</h2>
        <p className="text-gray-600 mb-4">
          在开始联机之前，请先设置你的游戏名称
        </p>
        <div className="space-y-4">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSetName()}
            placeholder="输入你的名字"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            maxLength={20}
          />
          <button
            onClick={handleSetName}
            disabled={!userName.trim()}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            确定
          </button>
        </div>
      </div>
    )
  }

  // 未连接状态
  if (!p2p.isConnected) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users size={28} />
            P2P联机房间
          </h2>
          <div className="text-sm text-gray-600">
            玩家: <span className="font-semibold text-purple-600">{userName}</span>
            <button
              onClick={() => setShowNameInput(true)}
              className="ml-2 text-purple-600 hover:text-purple-700 underline"
            >
              修改
            </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">💡 什么是P2P联机？</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>无需配置</strong> - 不需要注册账号或配置服务器</li>
            <li>• <strong>即时连接</strong> - 创建房间后立即获得6位房间码</li>
            <li>• <strong>分享房间码</strong> - 朋友输入房间码即可加入</li>
            <li>• <strong>实时同步</strong> - 骰子、战斗状态自动同步</li>
            <li>• <strong>完全免费</strong> - 使用P2P技术，无需服务器费用</li>
          </ul>
        </div>

        {p2p.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700">❌ {p2p.error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 创建房间 */}
          <div className="border-2 border-purple-200 rounded-lg p-6 hover:border-purple-400 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="text-purple-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">创建房间</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              作为GM创建新房间，获得6位房间码分享给玩家
            </p>
            <button
              onClick={handleCreateRoom}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              创建房间
            </button>
          </div>

          {/* 加入房间 */}
          <div className="border-2 border-green-200 rounded-lg p-6 hover:border-green-400 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <User className="text-green-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">加入房间</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              输入GM分享的6位房间码加入游戏
            </p>
            <div className="space-y-2">
              <input
                type="text"
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                placeholder="输入6位房间码"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                maxLength={6}
              />
              <button
                onClick={handleJoinRoom}
                disabled={roomCodeInput.length !== 6}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                加入房间
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">📝 使用步骤：</h4>
          <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
            <li><strong>GM</strong>：点击"创建房间"，获得6位房间码</li>
            <li><strong>GM</strong>：将房间码分享给玩家（微信、QQ等）</li>
            <li><strong>玩家</strong>：输入房间码，点击"加入房间"</li>
            <li><strong>所有人</strong>：开始游戏，骰子和战斗自动同步！</li>
          </ol>
        </div>
      </div>
    )
  }

  // 已连接状态
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Wifi className="text-green-500" size={28} />
          已连接到房间
        </h2>
        <button
          onClick={p2p.leaveRoom}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          <LogOut size={18} />
          离开房间
        </button>
      </div>

      {/* 房间信息 */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">房间码</p>
            <p className="text-4xl font-bold text-purple-600 font-mono tracking-widest">
              {p2p.roomId}
            </p>
          </div>
          <button
            onClick={handleCopyRoomCode}
            className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors border-2 border-purple-200"
          >
            <Copy size={18} />
            {copied ? '已复制!' : '复制房间码'}
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          {p2p.isGM ? '📢 将此房间码分享给玩家' : '✅ 你已加入房间'}
        </p>
      </div>

      {/* 成员列表 */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Users size={20} />
          房间成员 ({p2p.members.length})
        </h3>
        <div className="space-y-2">
          {p2p.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
            >
              <div className="flex items-center gap-3">
                {member.isGM ? (
                  <Crown className="text-yellow-500" size={20} />
                ) : (
                  <User className="text-gray-400" size={20} />
                )}
                <span className="font-medium text-gray-800">{member.name}</span>
                {member.id === p2p.getCurrentUserId() && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    你
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {member.isGM && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                    GM
                  </span>
                )}
                {member.isOnline ? (
                  <div className="w-2 h-2 bg-green-500 rounded-full" title="在线" />
                ) : (
                  <div className="w-2 h-2 bg-gray-400 rounded-full" title="离线" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-700">
          ✅ 房间已连接！现在你可以：
        </p>
        <ul className="text-sm text-green-700 mt-2 space-y-1 list-disc list-inside">
          <li>在"骰子"标签页投掷骰子，所有人都能看到</li>
          <li>在"战斗"标签页管理战斗，实时同步给所有人</li>
          <li>所有操作都会自动同步，无需手动刷新</li>
        </ul>
      </div>
    </div>
  )
}

