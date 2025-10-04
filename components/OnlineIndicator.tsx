'use client'

import { useEffect, useState } from 'react'
import { isSupabaseConfigured } from '@/lib/supabase'
import { Wifi, WifiOff, Cloud, HardDrive } from 'lucide-react'

export default function OnlineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [isSupabaseEnabled, setIsSupabaseEnabled] = useState(false)

  useEffect(() => {
    setIsSupabaseEnabled(isSupabaseConfigured())

    // 监听网络状态
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isSupabaseEnabled) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
          <HardDrive size={16} className="text-gray-400" />
          <span>本地模式</span>
          <div className="group relative">
            <span className="text-yellow-400 cursor-help">ℹ️</span>
            <div className="hidden group-hover:block absolute bottom-full right-0 mb-2 w-64 bg-slate-900 text-white text-xs rounded-lg p-3 shadow-xl">
              <p className="mb-2">当前使用本地存储模式</p>
              <p className="text-gray-400">
                配置Supabase后端可启用在线多人协作功能
              </p>
              <div className="mt-2 text-purple-400">
                查看 SUPABASE_SETUP.md
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm ${
          isOnline
            ? 'bg-green-600 text-white'
            : 'bg-red-600 text-white'
        }`}
      >
        {isOnline ? (
          <>
            <Cloud size={16} />
            <span>在线模式</span>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </>
        ) : (
          <>
            <WifiOff size={16} />
            <span>离线</span>
          </>
        )}
      </div>
    </div>
  )
}

