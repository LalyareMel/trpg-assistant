// @ts-nocheck
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Room, GameSystem } from '@/types'

/**
 * 创建房间
 */
export async function createRoom(
  name: string,
  gameSystem: GameSystem,
  gmId: string
): Promise<Room | null> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, using local storage')
    return null
  }

  try {
    // 创建房间
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .insert({
        name,
        game_system: gameSystem,
        gm_id: gmId,
        is_active: true,
      })
      .select()
      .single()

    if (roomError) throw roomError

    // 添加GM为房间成员
    const { error: memberError } = await supabase
      .from('room_members')
      .insert({
        room_id: room.id,
        user_id: gmId,
        role: 'gm',
      })

    if (memberError) throw memberError

    return {
      id: room.id,
      name: room.name,
      gameSystem: room.game_system as GameSystem,
      gmId: room.gm_id,
      players: [gmId],
      createdAt: new Date(room.created_at),
      isActive: room.is_active,
    }
  } catch (error) {
    console.error('Error creating room:', error)
    return null
  }
}

/**
 * 获取所有活跃房间
 */
export async function getActiveRooms(): Promise<Room[]> {
  if (!isSupabaseConfigured()) {
    return []
  }

  try {
    const { data: rooms, error } = await supabase
      .from('rooms')
      .select(`
        *,
        room_members (
          user_id
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    return rooms.map((room) => ({
      id: room.id,
      name: room.name,
      gameSystem: room.game_system as GameSystem,
      gmId: room.gm_id,
      players: room.room_members.map((m: any) => m.user_id),
      createdAt: new Date(room.created_at),
      isActive: room.is_active,
    }))
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return []
  }
}

/**
 * 加入房间
 */
export async function joinRoom(
  roomId: string,
  userId: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false
  }

  try {
    const { error } = await supabase
      .from('room_members')
      .insert({
        room_id: roomId,
        user_id: userId,
        role: 'player',
      })

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error joining room:', error)
    return false
  }
}

/**
 * 离开房间
 */
export async function leaveRoom(
  roomId: string,
  userId: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false
  }

  try {
    const { error } = await supabase
      .from('room_members')
      .delete()
      .eq('room_id', roomId)
      .eq('user_id', userId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error leaving room:', error)
    return false
  }
}

/**
 * 删除房间（仅GM）
 */
export async function deleteRoom(
  roomId: string,
  userId: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false
  }

  try {
    // 验证是否为GM
    const { data: room } = await supabase
      .from('rooms')
      .select('gm_id')
      .eq('id', roomId)
      .single()

    if (room?.gm_id !== userId) {
      throw new Error('Only GM can delete room')
    }

    // 删除房间（会级联删除成员和相关数据）
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', roomId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting room:', error)
    return false
  }
}

/**
 * 获取房间详情
 */
export async function getRoomDetails(roomId: string): Promise<Room | null> {
  if (!isSupabaseConfigured()) {
    return null
  }

  try {
    const { data: room, error } = await supabase
      .from('rooms')
      .select(`
        *,
        room_members (
          user_id,
          role
        )
      `)
      .eq('id', roomId)
      .single()

    if (error) throw error

    return {
      id: room.id,
      name: room.name,
      gameSystem: room.game_system as GameSystem,
      gmId: room.gm_id,
      players: room.room_members.map((m: any) => m.user_id),
      createdAt: new Date(room.created_at),
      isActive: room.is_active,
    }
  } catch (error) {
    console.error('Error fetching room details:', error)
    return null
  }
}

/**
 * 检查用户是否在房间中
 */
export async function isUserInRoom(
  roomId: string,
  userId: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false
  }

  try {
    const { data, error } = await supabase
      .from('room_members')
      .select('id')
      .eq('room_id', roomId)
      .eq('user_id', userId)
      .single()

    if (error) return false
    return Boolean(data)
  } catch (error) {
    return false
  }
}

/**
 * 获取用户的房间列表
 */
export async function getUserRooms(userId: string): Promise<Room[]> {
  if (!isSupabaseConfigured()) {
    return []
  }

  try {
    const { data: memberships, error } = await supabase
      .from('room_members')
      .select(`
        room_id,
        rooms (
          *,
          room_members (
            user_id
          )
        )
      `)
      .eq('user_id', userId)

    if (error) throw error

    return memberships
      .filter((m: any) => m.rooms)
      .map((m: any) => ({
        id: m.rooms.id,
        name: m.rooms.name,
        gameSystem: m.rooms.game_system as GameSystem,
        gmId: m.rooms.gm_id,
        players: m.rooms.room_members.map((rm: any) => rm.user_id),
        createdAt: new Date(m.rooms.created_at),
        isActive: m.rooms.is_active,
      }))
  } catch (error) {
    console.error('Error fetching user rooms:', error)
    return []
  }
}

