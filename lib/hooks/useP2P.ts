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

  // 初始化连接
  useEffect(() => {
    if (!connectionRef.current) {
      connectionRef.current = new P2PConnection(userName)
      
      // 监听成员变化
      connectionRef.current.onMembersChange((newMembers) => {
        setMembers(newMembers)
      })
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

  // 清理
  useEffect(() => {
    return () => {
      const connection = connectionRef.current
      if (connection && connection.isConnected()) {
        connection.leaveRoom()
      }
    }
  }, [])

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

