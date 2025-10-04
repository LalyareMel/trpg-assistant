// @ts-nocheck
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { DiceRoll } from '@/types'

/**
 * 保存骰子投掷记录到数据库
 */
export async function saveDiceRoll(
  roomId: string,
  userId: string,
  diceRoll: DiceRoll
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, dice roll not saved to server')
    return false
  }

  try {
    const { error } = await supabase.from('dice_rolls').insert({
      room_id: roomId,
      user_id: userId,
      expression: diceRoll.expression,
      results: diceRoll.results,
      total: diceRoll.total,
      game_system: diceRoll.gameSystem || null,
      check_type: diceRoll.checkType || null,
      success: diceRoll.success ?? null,
      critical_success: diceRoll.criticalSuccess ?? null,
      critical_failure: diceRoll.criticalFailure ?? null,
    })

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error saving dice roll:', error)
    return false
  }
}

/**
 * 获取房间的骰子历史
 */
export async function getRoomDiceHistory(
  roomId: string,
  limit: number = 50
): Promise<DiceRoll[]> {
  if (!isSupabaseConfigured()) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from('dice_rolls')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return data.map((roll) => ({
      id: roll.id,
      expression: roll.expression,
      results: roll.results,
      total: roll.total,
      timestamp: new Date(roll.created_at),
      gameSystem: roll.game_system || undefined,
      checkType: roll.check_type || undefined,
      success: roll.success ?? undefined,
      criticalSuccess: roll.critical_success ?? undefined,
      criticalFailure: roll.critical_failure ?? undefined,
    }))
  } catch (error) {
    console.error('Error fetching dice history:', error)
    return []
  }
}

/**
 * 清除房间的骰子历史
 */
export async function clearRoomDiceHistory(
  roomId: string,
  userId: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false
  }

  try {
    // 验证用户是否为GM
    const { data: room } = await supabase
      .from('rooms')
      .select('gm_id')
      .eq('id', roomId)
      .single()

    if (room?.gm_id !== userId) {
      throw new Error('Only GM can clear dice history')
    }

    const { error } = await supabase
      .from('dice_rolls')
      .delete()
      .eq('room_id', roomId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error clearing dice history:', error)
    return false
  }
}

/**
 * 获取用户的骰子统计
 */
export async function getUserDiceStats(userId: string) {
  if (!isSupabaseConfigured()) {
    return null
  }

  try {
    const { data, error } = await supabase
      .from('dice_rolls')
      .select('total, critical_success, critical_failure')
      .eq('user_id', userId)

    if (error) throw error

    const totalRolls = data.length
    const criticalSuccesses = data.filter((r) => r.critical_success).length
    const criticalFailures = data.filter((r) => r.critical_failure).length
    const averageRoll =
      data.reduce((sum, r) => sum + r.total, 0) / totalRolls || 0

    return {
      totalRolls,
      criticalSuccesses,
      criticalFailures,
      averageRoll: Math.round(averageRoll * 100) / 100,
    }
  } catch (error) {
    console.error('Error fetching dice stats:', error)
    return null
  }
}

