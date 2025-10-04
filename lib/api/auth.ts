import { supabase, isSupabaseConfigured } from '@/lib/supabase'

/**
 * 用户注册
 */
export async function signUp(email: string, password: string, username: string) {
  if (!isSupabaseConfigured()) {
    return { user: null, error: new Error('Supabase not configured') }
  }

  try {
    // 注册用户
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    // 创建用户资料
    if (authData.user) {
      const { error: profileError } = await supabase.from('users').insert({
        id: authData.user.id,
        email,
        username,
      })

      if (profileError) throw profileError
    }

    return { user: authData.user, error: null }
  } catch (error) {
    console.error('Error signing up:', error)
    return { user: null, error: error as Error }
  }
}

/**
 * 用户登录
 */
export async function signIn(email: string, password: string) {
  if (!isSupabaseConfigured()) {
    return { user: null, error: new Error('Supabase not configured') }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return { user: data.user, error: null }
  } catch (error) {
    console.error('Error signing in:', error)
    return { user: null, error: error as Error }
  }
}

/**
 * 用户登出
 */
export async function signOut() {
  if (!isSupabaseConfigured()) {
    return { error: new Error('Supabase not configured') }
  }

  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error signing out:', error)
    return { error: error as Error }
  }
}

/**
 * 获取当前用户
 */
export async function getCurrentUser() {
  if (!isSupabaseConfigured()) {
    return null
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * 获取用户资料
 */
export async function getUserProfile(userId: string) {
  if (!isSupabaseConfigured()) {
    return null
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

/**
 * 更新用户资料
 */
export async function updateUserProfile(
  userId: string,
  updates: { username?: string; avatar_url?: string }
) {
  if (!isSupabaseConfigured()) {
    return { error: new Error('Supabase not configured') }
  }

  try {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error updating user profile:', error)
    return { error: error as Error }
  }
}

/**
 * 重置密码
 */
export async function resetPassword(email: string) {
  if (!isSupabaseConfigured()) {
    return { error: new Error('Supabase not configured') }
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error resetting password:', error)
    return { error: error as Error }
  }
}

/**
 * 监听认证状态变化
 */
export function onAuthStateChange(callback: (user: any) => void) {
  if (!isSupabaseConfigured()) {
    return { unsubscribe: () => {} }
  }

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null)
  })

  return {
    unsubscribe: () => subscription.unsubscribe(),
  }
}

/**
 * 使用临时用户ID（未配置Supabase时）
 */
export function getOrCreateGuestUserId(): string {
  const GUEST_ID_KEY = 'trpg_guest_user_id'
  
  let guestId = localStorage.getItem(GUEST_ID_KEY)
  
  if (!guestId) {
    guestId = `guest_${crypto.randomUUID()}`
    localStorage.setItem(GUEST_ID_KEY, guestId)
  }
  
  return guestId
}

/**
 * 获取当前用户ID（支持游客模式）
 */
export async function getCurrentUserId(): Promise<string> {
  if (isSupabaseConfigured()) {
    const user = await getCurrentUser()
    if (user) return user.id
  }
  
  // 如果没有配置Supabase或未登录，使用游客ID
  return getOrCreateGuestUserId()
}

