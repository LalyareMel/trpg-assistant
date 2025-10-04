import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TRPG助手 - 跑团辅助工具',
  description: '支持COC、DND等多种跑团游戏的辅助工具，包含骰子、角色卡、检定、战斗追踪等功能',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}

