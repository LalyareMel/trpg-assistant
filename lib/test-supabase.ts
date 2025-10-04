/**
 * Supabase连接测试工具
 * 
 * 使用方法：
 * 1. 配置好.env.local文件
 * 2. 在浏览器控制台运行此文件中的函数
 * 3. 检查连接状态和数据库访问
 */

import { supabase, isSupabaseConfigured } from './supabase'

/**
 * 测试Supabase配置
 */
export async function testSupabaseConfig() {
  console.log('🔍 检查Supabase配置...')
  
  const configured = isSupabaseConfigured()
  
  if (!configured) {
    console.error('❌ Supabase未配置')
    console.log('请检查.env.local文件是否存在并包含正确的配置')
    return false
  }
  
  console.log('✅ Supabase配置已加载')
  return true
}

/**
 * 测试数据库连接
 */
export async function testDatabaseConnection() {
  console.log('🔍 测试数据库连接...')
  
  if (!isSupabaseConfigured()) {
    console.error('❌ Supabase未配置')
    return false
  }
  
  try {
    // 尝试查询一个简单的表
    const { data, error } = await supabase
      .from('rooms')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ 数据库连接失败:', error.message)
      console.log('提示: 请确保已运行schema.sql初始化数据库')
      return false
    }
    
    console.log('✅ 数据库连接成功')
    return true
  } catch (error) {
    console.error('❌ 连接错误:', error)
    return false
  }
}

/**
 * 测试表是否存在
 */
export async function testTablesExist() {
  console.log('🔍 检查数据库表...')
  
  if (!isSupabaseConfigured()) {
    console.error('❌ Supabase未配置')
    return false
  }
  
  const tables = [
    'users',
    'characters',
    'rooms',
    'room_members',
    'dice_rolls',
    'combats',
    'combatants'
  ]
  
  const results: Record<string, boolean> = {}
  
  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('count')
        .limit(1)
      
      if (error) {
        console.error(`❌ 表 ${table} 不存在或无法访问`)
        results[table] = false
      } else {
        console.log(`✅ 表 ${table} 存在`)
        results[table] = true
      }
    } catch (error) {
      console.error(`❌ 检查表 ${table} 时出错:`, error)
      results[table] = false
    }
  }
  
  const allExist = Object.values(results).every(v => v)
  
  if (allExist) {
    console.log('✅ 所有表都存在')
  } else {
    console.error('❌ 部分表缺失，请运行schema.sql初始化数据库')
  }
  
  return allExist
}

/**
 * 测试实时订阅
 */
export async function testRealtimeSubscription() {
  console.log('🔍 测试实时订阅...')
  
  if (!isSupabaseConfigured()) {
    console.error('❌ Supabase未配置')
    return false
  }
  
  try {
    const channel = supabase
      .channel('test_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
        },
        (payload) => {
          console.log('📡 收到实时更新:', payload)
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ 实时订阅成功')
          // 10秒后取消订阅
          setTimeout(() => {
            channel.unsubscribe()
            console.log('🔌 已取消订阅')
          }, 10000)
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ 实时订阅失败')
        }
      })
    
    return true
  } catch (error) {
    console.error('❌ 实时订阅错误:', error)
    return false
  }
}

/**
 * 运行所有测试
 */
export async function runAllTests() {
  console.log('🚀 开始Supabase测试...\n')
  
  const results = {
    config: false,
    connection: false,
    tables: false,
    realtime: false,
  }
  
  // 测试配置
  results.config = await testSupabaseConfig()
  if (!results.config) {
    console.log('\n❌ 测试失败：Supabase未配置')
    return results
  }
  
  console.log('')
  
  // 测试连接
  results.connection = await testDatabaseConnection()
  if (!results.connection) {
    console.log('\n❌ 测试失败：无法连接数据库')
    return results
  }
  
  console.log('')
  
  // 测试表
  results.tables = await testTablesExist()
  if (!results.tables) {
    console.log('\n❌ 测试失败：数据库表缺失')
    return results
  }
  
  console.log('')
  
  // 测试实时订阅
  results.realtime = await testRealtimeSubscription()
  
  console.log('\n' + '='.repeat(50))
  console.log('📊 测试结果总结:')
  console.log('='.repeat(50))
  console.log(`配置检查: ${results.config ? '✅' : '❌'}`)
  console.log(`数据库连接: ${results.connection ? '✅' : '❌'}`)
  console.log(`数据表检查: ${results.tables ? '✅' : '❌'}`)
  console.log(`实时订阅: ${results.realtime ? '✅' : '❌'}`)
  console.log('='.repeat(50))
  
  const allPassed = Object.values(results).every(v => v)
  
  if (allPassed) {
    console.log('\n🎉 所有测试通过！Supabase配置正确！')
    console.log('你现在可以使用在线协作功能了！')
  } else {
    console.log('\n⚠️ 部分测试失败，请检查配置')
    console.log('查看 SUPABASE_SETUP.md 获取帮助')
  }
  
  return results
}

/**
 * 快速测试（仅测试配置和连接）
 */
export async function quickTest() {
  console.log('⚡ 快速测试...\n')
  
  const config = await testSupabaseConfig()
  if (!config) return false
  
  console.log('')
  
  const connection = await testDatabaseConnection()
  
  console.log('\n' + '='.repeat(50))
  if (config && connection) {
    console.log('✅ Supabase配置正确，可以使用！')
  } else {
    console.log('❌ Supabase配置有问题，请检查')
  }
  console.log('='.repeat(50))
  
  return config && connection
}

// 在浏览器控制台中可以直接调用
if (typeof window !== 'undefined') {
  (window as any).testSupabase = {
    runAllTests,
    quickTest,
    testConfig: testSupabaseConfig,
    testConnection: testDatabaseConnection,
    testTables: testTablesExist,
    testRealtime: testRealtimeSubscription,
  }
  
  console.log('💡 Supabase测试工具已加载')
  console.log('在控制台运行以下命令进行测试:')
  console.log('  testSupabase.quickTest()      - 快速测试')
  console.log('  testSupabase.runAllTests()    - 完整测试')
  console.log('  testSupabase.testConfig()     - 测试配置')
  console.log('  testSupabase.testConnection() - 测试连接')
  console.log('  testSupabase.testTables()     - 测试表')
  console.log('  testSupabase.testRealtime()   - 测试实时订阅')
}

