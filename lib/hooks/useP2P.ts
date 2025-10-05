/**
 * P2P连接React Hook
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { P2PConnection, P2PMessage, RoomMember, MessageType } from '@/lib/p2p/peer-connection'
import { DiceRoll } from '@/types'

// 全局单例 P2P 连接，确保在整个应用生命周期中只有一个实例
let globalP2PConnection: P2PConnection | null = null

/**
 * 获取或创建全局 P2P 连接实例
 */
function getGlobalP2PConnection(userName: string): P2PConnection {
  if (!globalP2PConnection) {
    globalP2PConnection = new P2PConnection(userName)
  }
  return globalP2PConnection
}

/**
 * 清除全局 P2P 连接实例
 */
function clearGlobalP2PConnection() {
  globalP2PConnection = null
}

/**
 * 使用P2P连接
 */
export function useP2P(userName: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [roomId, setRoomId] = useState<string | null>(null)
  const [isGM, setIsGM] = useState(false)
  const [members, setMembers] = useState<RoomMember[]>([])
  const [error, setError] = useState<string | null>(null)
  const connectionRef = useRef<P2PConnection | null>(null)

  // 初始化连接
  useEffect(() => {
    if (!userName) return

    // 使用全局单例连接
    connectionRef.current = getGlobalP2PConnection(userName)

    // 监听成员变化（使用 useCallback 稳定回调引用）
    const membersChangeHandler = (newMembers: RoomMember[]) => {
      setMembers(newMembers)
    }

    // 清除旧的回调并设置新的
    connectionRef.current.onMembersChange(membersChangeHandler)

    // 不再从 localStorage 恢复P2P连接状态
    // P2P连接需要重新建立，不能仅恢复UI状态
    // 用户需要重新创建或加入房间
  }, [userName])

  /**
   * 创建房间
   */
  const createRoom = useCallback(async () => {
    try {
      setError(null)
      const connection = connectionRef.current!
      const newRoomId = await connection.createRoom()

      setRoomId(newRoomId)
      setIsGM(true)
      setIsConnected(true)

      // 保存连接状态到 localStorage
      localStorage.setItem('p2p_connection_state', JSON.stringify({
        roomId: newRoomId,
        isGM: true,
        isConnected: true
      }))

      return newRoomId
    } catch (err) {
      const errorMsg = '创建房间失败，请重试'
      setError(errorMsg)
      console.error(err)
      throw new Error(errorMsg)
    }
  }, [])

  /**
   * 加入房间
   */
  const joinRoom = useCallback(async (targetRoomId: string) => {
    try {
      setError(null)
      const connection = connectionRef.current!
      await connection.joinRoom(targetRoomId)

      setRoomId(targetRoomId)
      setIsGM(false)
      setIsConnected(true)

      // 保存连接状态到 localStorage
      localStorage.setItem('p2p_connection_state', JSON.stringify({
        roomId: targetRoomId,
        isGM: false,
        isConnected: true
      }))
    } catch (err) {
      const errorMsg = '加入房间失败，请检查房间码是否正确'
      setError(errorMsg)
      console.error(err)
      throw new Error(errorMsg)
    }
  }, [])

  /**
   * 离开房间
   */
  const leaveRoom = useCallback(() => {
    const connection = connectionRef.current
    if (connection) {
      connection.leaveRoom()
      setRoomId(null)
      setIsGM(false)
      setIsConnected(false)
      setMembers([])

      // 清除保存的连接状态
      localStorage.removeItem('p2p_connection_state')

      // 清除全局单例，下次可以重新创建
      clearGlobalP2PConnection()
      connectionRef.current = null
    }
  }, [])

  /**
   * 发送消息
   */
  const sendMessage = useCallback((type: MessageType, data: any) => {
    const connection = connectionRef.current
    if (connection && connection.isConnected()) {
      connection.sendMessage(type, data)
    }
  }, [])

  /**
   * 监听消息
   */
  const onMessage = useCallback((type: MessageType, handler: (message: P2PMessage) => void) => {
    const connection = connectionRef.current
    if (connection) {
      connection.onMessage(type, handler)
    }
  }, [])

  /**
   * 获取当前用户ID
   */
  const getCurrentUserId = useCallback(() => {
    const connection = connectionRef.current
    return connection ? connection.getUserId() : null
  }, [])

  /**
   * 获取当前用户名
   */
  const getCurrentUserName = useCallback(() => {
    const connection = connectionRef.current
    return connection ? connection.getUserName() : null
  }, [])

  // 注意：不在这里自动清理连接，因为切换标签页会导致组件卸载
  // 用户需要主动点击"离开房间"按钮来断开连接
  // 或者在浏览器关闭时自动断开（由 PeerJS 处理）

  return {
    isConnected,
    roomId,
    isGM,
    members,
    error,
    createRoom,
    joinRoom,
    leaveRoom,
    sendMessage,
    onMessage,
    getCurrentUserId,
    getCurrentUserName,
  }
}

/**
 * 使用P2P骰子同步
 */
export function useP2PDiceSync(
  connection: ReturnType<typeof useP2P>,
  onDiceRoll: (roll: DiceRoll, senderName: string) => void
) {
  // 使用useCallback稳定回调引用
  const stableOnDiceRoll = useCallback(onDiceRoll, [])

  useEffect(() => {
    if (!connection.isConnected) return

    const handler = (message: P2PMessage) => {
      stableOnDiceRoll(message.data, message.senderName)
    }

    connection.onMessage('dice_roll', handler)

    // 清理函数 - 注意：由于P2PConnection没有提供移除单个handler的方法
    // 我们在组件卸载时清除所有该类型的handlers
    return () => {
      // 这里暂时不清理，因为会影响其他组件
      // 需要在P2PConnection中实现更精细的handler管理
    }
  }, [connection.isConnected, stableOnDiceRoll])

  const sendDiceRoll = useCallback((roll: DiceRoll) => {
    connection.sendMessage('dice_roll', roll)
  }, [connection])

  return { sendDiceRoll }
}

/**
 * 使用P2P战斗同步
 */
export function useP2PCombatSync(
  connection: ReturnType<typeof useP2P>,
  onCombatUpdate: (combat: any) => void,
  onCombatantUpdate: (combatant: any) => void
) {
  // 使用useCallback稳定回调引用
  const stableOnCombatUpdate = useCallback(onCombatUpdate, [])
  const stableOnCombatantUpdate = useCallback(onCombatantUpdate, [])

  useEffect(() => {
    if (!connection.isConnected) return

    const combatHandler = (message: P2PMessage) => {
      stableOnCombatUpdate(message.data)
    }

    const combatantHandler = (message: P2PMessage) => {
      stableOnCombatantUpdate(message.data)
    }

    connection.onMessage('combat_update', combatHandler)
    connection.onMessage('combatant_update', combatantHandler)

    // 清理函数
    return () => {
      // 这里暂时不清理，因为会影响其他组件
      // 需要在P2PConnection中实现更精细的handler管理
    }
  }, [connection.isConnected, stableOnCombatUpdate, stableOnCombatantUpdate])

  const sendCombatUpdate = useCallback((combat: any) => {
    connection.sendMessage('combat_update', combat)
  }, [connection])

  const sendCombatantUpdate = useCallback((combatant: any) => {
    connection.sendMessage('combatant_update', combatant)
  }, [connection])

  return { sendCombatUpdate, sendCombatantUpdate }
}

