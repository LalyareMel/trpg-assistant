import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { CombatState, Combatant } from '@/types'

/**
 * 创建战斗
 */
export async function createCombat(roomId: string): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    return null
  }

  try {
    const { data, error } = await supabase
      .from('combats')
      .insert({
        room_id: roomId,
        current_turn: 0,
        round: 1,
        is_active: true,
      })
      .select()
      .single()

    if (error) throw error
    return data.id
  } catch (error) {
    console.error('Error creating combat:', error)
    return null
  }
}

/**
 * 获取房间的活跃战斗
 */
export async function getActiveCombat(
  roomId: string
): Promise<CombatState | null> {
  if (!isSupabaseConfigured()) {
    return null
  }

  try {
    const { data: combat, error: combatError } = await supabase
      .from('combats')
      .select('*')
      .eq('room_id', roomId)
      .eq('is_active', true)
      .single()

    if (combatError) {
      if (combatError.code === 'PGRST116') return null // No rows found
      throw combatError
    }

    const { data: combatants, error: combatantsError } = await supabase
      .from('combatants')
      .select('*')
      .eq('combat_id', combat.id)
      .order('initiative', { ascending: false })

    if (combatantsError) throw combatantsError

    return {
      id: combat.id,
      roomId: combat.room_id,
      currentTurn: combat.current_turn,
      round: combat.round,
      isActive: combat.is_active,
      combatants: combatants.map((c) => ({
        id: c.id,
        name: c.name,
        initiative: c.initiative,
        hp: c.hp,
        maxHp: c.max_hp,
        ac: c.ac || undefined,
        conditions: c.conditions || [],
        isPlayer: c.is_player,
      })),
    }
  } catch (error) {
    console.error('Error fetching active combat:', error)
    return null
  }
}

/**
 * 添加战斗参与者
 */
export async function addCombatant(
  combatId: string,
  combatant: Omit<Combatant, 'id'>
): Promise<Combatant | null> {
  if (!isSupabaseConfigured()) {
    return null
  }

  try {
    const { data, error } = await supabase
      .from('combatants')
      .insert({
        combat_id: combatId,
        name: combatant.name,
        initiative: combatant.initiative,
        hp: combatant.hp,
        max_hp: combatant.maxHp,
        ac: combatant.ac || null,
        conditions: combatant.conditions || [],
        is_player: combatant.isPlayer,
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      initiative: data.initiative,
      hp: data.hp,
      maxHp: data.max_hp,
      ac: data.ac || undefined,
      conditions: data.conditions || [],
      isPlayer: data.is_player,
    }
  } catch (error) {
    console.error('Error adding combatant:', error)
    return null
  }
}

/**
 * 更新战斗参与者
 */
export async function updateCombatant(
  combatantId: string,
  updates: Partial<Combatant>
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false
  }

  try {
    const updateData: any = {}
    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.initiative !== undefined)
      updateData.initiative = updates.initiative
    if (updates.hp !== undefined) updateData.hp = updates.hp
    if (updates.maxHp !== undefined) updateData.max_hp = updates.maxHp
    if (updates.ac !== undefined) updateData.ac = updates.ac
    if (updates.conditions !== undefined)
      updateData.conditions = updates.conditions
    if (updates.isPlayer !== undefined) updateData.is_player = updates.isPlayer

    const { error } = await supabase
      .from('combatants')
      .update(updateData)
      .eq('id', combatantId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error updating combatant:', error)
    return false
  }
}

/**
 * 删除战斗参与者
 */
export async function removeCombatant(combatantId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false
  }

  try {
    const { error } = await supabase
      .from('combatants')
      .delete()
      .eq('id', combatantId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error removing combatant:', error)
    return false
  }
}

/**
 * 更新战斗状态（回合/轮次）
 */
export async function updateCombatState(
  combatId: string,
  currentTurn: number,
  round: number
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false
  }

  try {
    const { error } = await supabase
      .from('combats')
      .update({
        current_turn: currentTurn,
        round: round,
      })
      .eq('id', combatId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error updating combat state:', error)
    return false
  }
}

/**
 * 结束战斗
 */
export async function endCombat(combatId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false
  }

  try {
    const { error } = await supabase
      .from('combats')
      .update({ is_active: false })
      .eq('id', combatId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error ending combat:', error)
    return false
  }
}

/**
 * 删除战斗（包括所有参与者）
 */
export async function deleteCombat(combatId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false
  }

  try {
    const { error } = await supabase.from('combats').delete().eq('id', combatId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting combat:', error)
    return false
  }
}

