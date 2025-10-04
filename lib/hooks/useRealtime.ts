import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

/**
 * 实时订阅骰子投掷
 */
export function useDiceRollsRealtime(roomId: string | null) {
  const [diceRolls, setDiceRolls] = useState<any[]>([])
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!roomId || !isSupabaseConfigured()) return

    // 订阅骰子投掷
    const diceChannel = supabase
      .channel(`dice_rolls:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'dice_rolls',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          console.log('New dice roll:', payload.new)
          setDiceRolls((prev) => [payload.new, ...prev])
        }
      )
      .subscribe()

    setChannel(diceChannel)

    // 清理订阅
    return () => {
      diceChannel.unsubscribe()
    }
  }, [roomId])

  return { diceRolls, channel }
}

/**
 * 实时订阅战斗状态
 */
export function useCombatRealtime(roomId: string | null) {
  const [combat, setCombat] = useState<any>(null)
  const [combatants, setCombatants] = useState<any[]>([])
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!roomId || !isSupabaseConfigured()) return

    // 订阅战斗状态
    const combatChannel = supabase
      .channel(`combat:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'combats',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          console.log('Combat updated:', payload)
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setCombat(payload.new)
          } else if (payload.eventType === 'DELETE') {
            setCombat(null)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'combatants',
        },
        (payload) => {
          console.log('Combatant updated:', payload)
          if (payload.eventType === 'INSERT') {
            setCombatants((prev) => [...prev, payload.new])
          } else if (payload.eventType === 'UPDATE') {
            setCombatants((prev) =>
              prev.map((c) => (c.id === payload.new.id ? payload.new : c))
            )
          } else if (payload.eventType === 'DELETE') {
            setCombatants((prev) => prev.filter((c) => c.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    setChannel(combatChannel)

    // 清理订阅
    return () => {
      combatChannel.unsubscribe()
    }
  }, [roomId])

  return { combat, combatants, channel }
}

/**
 * 实时订阅房间成员
 */
export function useRoomMembersRealtime(roomId: string | null) {
  const [members, setMembers] = useState<any[]>([])
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!roomId || !isSupabaseConfigured()) return

    // 订阅房间成员变化
    const membersChannel = supabase
      .channel(`room_members:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_members',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          console.log('Room member updated:', payload)
          if (payload.eventType === 'INSERT') {
            setMembers((prev) => [...prev, payload.new])
          } else if (payload.eventType === 'DELETE') {
            setMembers((prev) => prev.filter((m) => m.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    setChannel(membersChannel)

    // 清理订阅
    return () => {
      membersChannel.unsubscribe()
    }
  }, [roomId])

  return { members, channel }
}

/**
 * 在线状态追踪
 */
export function usePresence(roomId: string | null, userId: string) {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!roomId || !isSupabaseConfigured()) return

    // 创建presence channel
    const presenceChannel = supabase.channel(`presence:${roomId}`, {
      config: {
        presence: {
          key: userId,
        },
      },
    })

    // 监听presence变化
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState()
        const users = Object.keys(state)
        setOnlineUsers(users)
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        console.log('User joined:', key)
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        console.log('User left:', key)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // 发送当前用户的在线状态
          await presenceChannel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
          })
        }
      })

    setChannel(presenceChannel)

    // 清理
    return () => {
      presenceChannel.unsubscribe()
    }
  }, [roomId, userId])

  return { onlineUsers, channel }
}

/**
 * 通用实时订阅Hook
 */
export function useRealtimeSubscription<T>(
  table: string,
  filter?: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*'
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false)
      return
    }

    // 初始加载数据
    const loadInitialData = async () => {
      try {
        let query = supabase.from(table).select('*')
        
        if (filter) {
          // 简单的filter解析，格式: "column=eq.value"
          const [column, operator, value] = filter.split(/[=.]/)
          if (operator === 'eq') {
            query = query.eq(column, value)
          }
        }

        const { data: initialData, error: initialError } = await query

        if (initialError) throw initialError
        setData(initialData as T[])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()

    // 订阅实时更新
    const channel = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event,
          schema: 'public',
          table,
          filter,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData((prev) => [...prev, payload.new as T])
          } else if (payload.eventType === 'UPDATE') {
            setData((prev) =>
              prev.map((item: any) =>
                item.id === (payload.new as any).id ? (payload.new as T) : item
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setData((prev) =>
              prev.filter((item: any) => item.id !== (payload.old as any).id)
            )
          }
        }
      )
      .subscribe()

    // 清理
    return () => {
      channel.unsubscribe()
    }
  }, [table, filter, event])

  return { data, loading, error }
}

