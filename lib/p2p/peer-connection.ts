/**
 * P2P点对点连接管理
 * 使用PeerJS实现简单的P2P通信，无需后端服务器
 */

import Peer, { DataConnection } from 'peerjs'

export type MessageType = 
  | 'dice_roll'
  | 'combat_update'
  | 'combatant_update'
  | 'room_info'
  | 'user_join'
  | 'user_leave'
  | 'chat_message'

export interface P2PMessage {
  type: MessageType
  data: any
  timestamp: number
  senderId: string
  senderName: string
}

export interface RoomMember {
  id: string
  name: string
  isGM: boolean
  isOnline: boolean
}

export class P2PConnection {
  private peer: Peer | null = null
  private connections: Map<string, DataConnection> = new Map()
  private roomId: string | null = null
  private userId: string
  private userName: string
  private isGM: boolean = false
  private messageHandlers: Map<MessageType, ((message: P2PMessage) => void)[]> = new Map()
  private members: Map<string, RoomMember> = new Map()
  private onMembersChangeCallback: ((members: RoomMember[]) => void) | null = null

  constructor(userName: string) {
    this.userId = this.generateUserId()
    this.userName = userName
  }

  /**
   * 生成用户ID
   */
  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 生成房间ID
   */
  private generateRoomId(): string {
    // 生成6位数字房间码
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  /**
   * 创建房间（作为GM）
   */
  async createRoom(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.roomId = this.generateRoomId()
      this.isGM = true

      // 设置超时（30秒）
      const timeout = setTimeout(() => {
        reject(new Error('创建房间超时，请检查网络连接'))
      }, 30000)

      // 创建Peer连接，使用房间ID作为Peer ID
      this.peer = new Peer(`room_${this.roomId}`, {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ]
        }
      })

      this.peer.on('open', (id) => {
        clearTimeout(timeout)
        console.log('✅ 房间创建成功，房间码:', this.roomId)

        // 添加自己到成员列表
        this.members.set(this.userId, {
          id: this.userId,
          name: this.userName,
          isGM: true,
          isOnline: true,
        })

        this.notifyMembersChange()
        resolve(this.roomId!)
      })

      this.peer.on('connection', (conn) => {
        this.handleIncomingConnection(conn)
      })

      this.peer.on('error', (err) => {
        clearTimeout(timeout)
        console.error('❌ Peer错误:', err)
        reject(err)
      })
    })
  }

  /**
   * 加入房间（作为玩家）
   */
  async joinRoom(roomId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.roomId = roomId
      this.isGM = false

      // 设置超时（30秒）
      const timeout = setTimeout(() => {
        reject(new Error('加入房间超时，请检查房间码是否正确或网络连接'))
      }, 30000)

      // 创建自己的Peer连接
      this.peer = new Peer(this.userId, {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ]
        }
      })

      this.peer.on('open', () => {
        console.log('✅ Peer连接已建立')

        // 连接到GM（房间主机）
        const gmPeerId = `room_${roomId}`
        const conn = this.peer!.connect(gmPeerId)

        conn.on('open', () => {
          clearTimeout(timeout)
          console.log('✅ 已连接到房间')
          this.connections.set(gmPeerId, conn)

          // 发送加入消息
          this.sendMessage('user_join', {
            userId: this.userId,
            userName: this.userName,
          })

          this.setupConnectionHandlers(conn)
          resolve()
        })

        conn.on('error', (err) => {
          clearTimeout(timeout)
          console.error('❌ 连接房间失败:', err)
          reject(err)
        })
      })

      // 监听来自其他玩家的连接
      this.peer.on('connection', (conn) => {
        this.handleIncomingConnection(conn)
      })

      this.peer.on('error', (err) => {
        clearTimeout(timeout)
        console.error('❌ Peer错误:', err)
        reject(err)
      })
    })
  }

  /**
   * 处理传入的连接
   */
  private handleIncomingConnection(conn: DataConnection) {
    console.log('📥 收到新连接:', conn.peer)
    
    conn.on('open', () => {
      this.connections.set(conn.peer, conn)
      this.setupConnectionHandlers(conn)
      
      // 如果是GM，向新玩家发送当前成员列表
      if (this.isGM) {
        conn.send({
          type: 'room_info',
          data: {
            members: Array.from(this.members.values()),
          },
          timestamp: Date.now(),
          senderId: this.userId,
          senderName: this.userName,
        })
      }
    })
  }

  /**
   * 设置连接处理器
   */
  private setupConnectionHandlers(conn: DataConnection) {
    conn.on('data', (data: any) => {
      this.handleMessage(data as P2PMessage)
    })

    conn.on('close', () => {
      console.log('🔌 连接关闭:', conn.peer)
      this.connections.delete(conn.peer)
      
      // 如果是GM，通知其他人有人离开
      if (this.isGM) {
        this.members.delete(conn.peer)
        this.notifyMembersChange()
        this.broadcast('user_leave', { userId: conn.peer })
      }
    })

    conn.on('error', (err) => {
      console.error('❌ 连接错误:', err)
    })
  }

  /**
   * 处理收到的消息
   */
  private handleMessage(message: P2PMessage) {
    console.log('📨 收到消息:', message.type, message.data)

    // 特殊处理用户加入
    if (message.type === 'user_join') {
      const { userId, userName } = message.data
      this.members.set(userId, {
        id: userId,
        name: userName,
        isGM: false,
        isOnline: true,
      })
      this.notifyMembersChange()
      
      // 如果是GM，转发给其他玩家
      if (this.isGM) {
        this.broadcast('user_join', message.data, userId)
      }
    }

    // 特殊处理房间信息
    if (message.type === 'room_info') {
      const { members } = message.data
      this.members.clear()
      members.forEach((member: RoomMember) => {
        this.members.set(member.id, member)
      })
      this.notifyMembersChange()
    }

    // 调用注册的处理器
    const handlers = this.messageHandlers.get(message.type) || []
    handlers.forEach(handler => handler(message))

    // 如果是GM，转发消息给其他玩家
    if (this.isGM && message.senderId !== this.userId) {
      this.broadcast(message.type, message.data, message.senderId)
    }
  }

  /**
   * 发送消息
   */
  sendMessage(type: MessageType, data: any) {
    const message: P2PMessage = {
      type,
      data,
      timestamp: Date.now(),
      senderId: this.userId,
      senderName: this.userName,
    }

    // 发送给所有连接
    this.connections.forEach((conn) => {
      if (conn.open) {
        conn.send(message)
      }
    })
  }

  /**
   * 广播消息（GM专用）
   */
  private broadcast(type: MessageType, data: any, excludeUserId?: string) {
    const message: P2PMessage = {
      type,
      data,
      timestamp: Date.now(),
      senderId: this.userId,
      senderName: this.userName,
    }

    this.connections.forEach((conn, peerId) => {
      if (conn.open && peerId !== excludeUserId) {
        conn.send(message)
      }
    })
  }

  /**
   * 注册消息处理器
   */
  onMessage(type: MessageType, handler: (message: P2PMessage) => void) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, [])
    }
    this.messageHandlers.get(type)!.push(handler)
  }

  /**
   * 清除指定类型的所有消息处理器
   */
  clearMessageHandlers(type?: MessageType) {
    if (type) {
      this.messageHandlers.delete(type)
    } else {
      this.messageHandlers.clear()
    }
  }

  /**
   * 监听成员变化
   */
  onMembersChange(callback: (members: RoomMember[]) => void) {
    this.onMembersChangeCallback = callback
  }

  /**
   * 通知成员变化
   */
  private notifyMembersChange() {
    if (this.onMembersChangeCallback) {
      this.onMembersChangeCallback(Array.from(this.members.values()))
    }
  }

  /**
   * 获取当前成员列表
   */
  getMembers(): RoomMember[] {
    return Array.from(this.members.values())
  }

  /**
   * 获取房间ID
   */
  getRoomId(): string | null {
    return this.roomId
  }

  /**
   * 获取用户ID
   */
  getUserId(): string {
    return this.userId
  }

  /**
   * 是否为GM
   */
  getIsGM(): boolean {
    return this.isGM
  }

  /**
   * 离开房间
   */
  leaveRoom() {
    // 发送离开消息
    this.sendMessage('user_leave', { userId: this.userId })

    // 关闭所有连接
    this.connections.forEach((conn) => {
      conn.close()
    })
    this.connections.clear()

    // 销毁Peer
    if (this.peer) {
      this.peer.destroy()
      this.peer = null
    }

    // 清除所有状态
    this.roomId = null
    this.isGM = false
    this.members.clear()
    this.messageHandlers.clear()
    this.onMembersChangeCallback = null
    this.notifyMembersChange()
  }

  /**
   * 检查是否已连接
   */
  isConnected(): boolean {
    return this.peer !== null && !this.peer.destroyed
  }
}

