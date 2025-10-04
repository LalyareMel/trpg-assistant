import { createClient } from '@supabase/supabase-js'

// Supabase配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 检查Supabase是否已配置
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

// 创建Supabase客户端（仅在配置时创建）
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

// 数据库类型定义
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      characters: {
        Row: {
          id: string
          user_id: string
          name: string
          game_system: string
          data: any
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          game_system: string
          data: any
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          game_system?: string
          data?: any
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      rooms: {
        Row: {
          id: string
          name: string
          game_system: string
          gm_id: string
          is_active: boolean
          settings: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          game_system: string
          gm_id: string
          is_active?: boolean
          settings?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          game_system?: string
          gm_id?: string
          is_active?: boolean
          settings?: any
          created_at?: string
          updated_at?: string
        }
      }
      room_members: {
        Row: {
          id: string
          room_id: string
          user_id: string
          role: string
          joined_at: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          role?: string
          joined_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          role?: string
          joined_at?: string
        }
      }
      dice_rolls: {
        Row: {
          id: string
          room_id: string
          user_id: string
          expression: string
          results: number[]
          total: number
          game_system: string | null
          check_type: string | null
          success: boolean | null
          critical_success: boolean | null
          critical_failure: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          expression: string
          results: number[]
          total: number
          game_system?: string | null
          check_type?: string | null
          success?: boolean | null
          critical_success?: boolean | null
          critical_failure?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          expression?: string
          results?: number[]
          total?: number
          game_system?: string | null
          check_type?: string | null
          success?: boolean | null
          critical_success?: boolean | null
          critical_failure?: boolean | null
          created_at?: string
        }
      }
      combats: {
        Row: {
          id: string
          room_id: string
          current_turn: number
          round: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room_id: string
          current_turn?: number
          round?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          current_turn?: number
          round?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      combatants: {
        Row: {
          id: string
          combat_id: string
          name: string
          initiative: number
          hp: number
          max_hp: number
          ac: number | null
          conditions: string[]
          is_player: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          combat_id: string
          name: string
          initiative: number
          hp: number
          max_hp: number
          ac?: number | null
          conditions?: string[]
          is_player?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          combat_id?: string
          name?: string
          initiative?: number
          hp?: number
          max_hp?: number
          ac?: number | null
          conditions?: string[]
          is_player?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

