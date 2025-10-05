'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

/**
 * 错误边界组件
 * 捕获子组件中的JavaScript错误，显示备用UI，并记录错误信息
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // 更新state，下次渲染时显示备用UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 记录错误信息
    console.error('错误边界捕获到错误:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 max-w-2xl w-full shadow-xl border border-red-500/30">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="text-red-500" size={32} />
              <h1 className="text-2xl font-bold text-white">哎呀，出错了！</h1>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
              <p className="text-gray-300 mb-2">应用遇到了一个错误，但不用担心，你的数据是安全的。</p>
              <p className="text-gray-400 text-sm">你可以尝试以下操作：</p>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium"
              >
                <RefreshCw size={20} />
                重试
              </button>
              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all font-medium"
              >
                刷新页面
              </button>
            </div>

            {/* 开发环境下显示错误详情 */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="bg-slate-900/50 rounded-lg p-4">
                <summary className="text-gray-300 cursor-pointer mb-2 font-medium">
                  错误详情（开发模式）
                </summary>
                <div className="text-red-400 text-sm font-mono overflow-auto">
                  <p className="mb-2">{this.state.error.toString()}</p>
                  {this.state.errorInfo && (
                    <pre className="text-xs text-gray-500 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div className="mt-6 text-center text-gray-500 text-sm">
              <p>如果问题持续存在，请尝试清除浏览器缓存或联系技术支持</p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

