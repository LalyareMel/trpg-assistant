/**
 * P2P连接React Hook
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { P2PConnection, P2PMessage, RoomMember, MessageType } from '@/lib/p2p/peer-connection'
import { DiceRoll } from '@/types'

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

  // 初始化连接并恢复状态
  useEffect(() => {
    if (!connectionRef.current && userName) {
      connectionRef.current = new P2PConnection(userName)

      // 监听成员变化
      connectionRef.current.onMembersChange((newMembers) => {
        setMembers(newMembers)
      })

      // 尝试从 localStorage 恢复连接状态
      const savedState = localStorage.getItem('p2p_connection_state')
      if (savedState) {
        try {
          const state = JSON.parse(savedState)
          if (state.roomId && state.isConnected) {
            setRoomId(state.roomId)
            setIsGM(state.isGM)
            setIsConnected(state.isConnected)
          }
        } catch (err) {
          console.error('恢复P2P状态失败:', err)
        }
      }
    }
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
  }
}

/**
 * 使用P2P骰子同步
 */
export function useP2PDiceSync(
  connection: ReturnType<typeof useP2P>,
  onDiceRoll: (roll: DiceRoll, senderName: string) => void
) {
  useEffect(() => {
    if (!connection.isConnected) return

    connection.onMessage('dice_roll', (message) => {
      onDiceRoll(message.data, message.senderName)
    })
  }, [connection, onDiceRoll])

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
  useEffect(() => {
    if (!connection.isConnected) return

    connection.onMessage('combat_update', (message) => {
      onCombatUpdate(message.data)
    })

    connection.onMessage('combatant_update', (message) => {
      onCombatantUpdate(message.data)
    })
  }, [connection, onCombatUpdate, onCombatantUpdate])

  const sendCombatUpdate = useCallback((combat: any) => {
    connection.sendMessage('combat_update', combat)
  }, [connection])

  const sendCombatantUpdate = useCallback((combatant: any) => {
    connection.sendMessage('combatant_update', combatant)
  }, [connection])

  return { sendCombatUpdate, sendCombatantUpdate }
}

