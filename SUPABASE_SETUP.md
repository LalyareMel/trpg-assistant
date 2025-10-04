# 🚀 Supabase后端配置指南

本指南将帮助你配置Supabase后端，实现**线上多人实时协作**功能。

## 📋 为什么需要Supabase？

当前版本使用localStorage，数据只保存在本地浏览器中，**无法实现多人在线协作**。

配置Supabase后，你将获得：
- ✅ **多人实时协作** - 朋友可以在线加入你的房间
- ✅ **实时骰子同步** - 所有人立即看到投掷结果
- ✅ **云端数据存储** - 数据不会丢失，多设备同步
- ✅ **用户认证系统** - 安全的用户登录
- ✅ **战斗实时同步** - GM和玩家同步查看战斗状态

## 🎯 配置步骤

### 步骤1: 创建Supabase账号

1. 访问 https://supabase.com
2. 点击 **"Start your project"**
3. 使用GitHub账号登录（推荐）或邮箱注册

### 步骤2: 创建新项目

1. 点击 **"New Project"**
2. 填写项目信息：
   - **Name**: `trpg-assistant`（或你喜欢的名字）
   - **Database Password**: 设置一个强密码（保存好！）
   - **Region**: 选择离你最近的区域
     - 中国用户推荐: `Southeast Asia (Singapore)`
     - 其他地区: 选择最近的
3. 点击 **"Create new project"**
4. 等待1-2分钟，项目创建完成

### 步骤3: 获取API密钥

1. 在项目仪表板，点击左侧的 **"Settings"** (齿轮图标)
2. 点击 **"API"**
3. 找到以下信息：
   - **Project URL**: 类似 `https://xxxxx.supabase.co`
   - **anon public**: 一串很长的密钥

**重要**: 复制这两个值，稍后会用到！

### 步骤4: 初始化数据库

1. 在项目仪表板，点击左侧的 **"SQL Editor"**
2. 点击 **"New query"**
3. 打开项目中的 `supabase/schema.sql` 文件
4. 复制**全部内容**
5. 粘贴到Supabase的SQL编辑器中
6. 点击右下角的 **"Run"** 按钮
7. 等待执行完成（应该显示 "Success"）

### 步骤5: 配置环境变量

1. 在项目根目录创建 `.env.local` 文件：
   ```bash
   # Windows
   copy .env.example .env.local
   
   # macOS/Linux
   cp .env.example .env.local
   ```

2. 编辑 `.env.local` 文件，填入你的Supabase信息：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon_public密钥
   ```

3. 保存文件

### 步骤6: 重启开发服务器

```bash
# 停止当前服务器（Ctrl+C）

# 重新启动
npm run dev
```

### 步骤7: 验证配置

1. 打开浏览器访问 http://localhost:3000
2. 打开浏览器控制台（F12）
3. 如果配置成功，应该不会看到Supabase相关的错误

## 🎮 使用在线功能

### 创建在线房间

1. 点击 **"房间"** 标签
2. 点击 **"创建房间"**
3. 输入房间名称
4. 选择游戏系统
5. 点击 **"创建"**

### 邀请朋友加入

1. 创建房间后，复制房间ID
2. 将房间ID发送给朋友
3. 朋友在"房间"页面输入房间ID加入

### 实时协作功能

- 🎲 **骰子同步**: 任何人投掷骰子，所有人立即看到
- ⚔️ **战斗同步**: GM管理战斗，玩家实时查看
- 👥 **成员列表**: 查看房间内的所有玩家

## 🔐 启用用户认证（可选）

### 配置邮箱认证

1. 在Supabase仪表板，点击 **"Authentication"**
2. 点击 **"Providers"**
3. 启用 **"Email"**
4. 配置邮件模板（可选）

### 配置第三方登录（可选）

支持的登录方式：
- GitHub
- Google
- Discord
- 等等...

配置方法：
1. 在 **"Authentication" → "Providers"** 中启用
2. 按照提示配置OAuth应用
3. 填入Client ID和Secret

## 📊 监控和管理

### 查看数据

1. 点击左侧的 **"Table Editor"**
2. 选择要查看的表：
   - `users` - 用户列表
   - `rooms` - 房间列表
   - `characters` - 角色卡
   - `dice_rolls` - 骰子记录
   - `combats` - 战斗记录

### 查看实时连接

1. 点击左侧的 **"Database"**
2. 点击 **"Replication"**
3. 查看实时订阅状态

### 查看日志

1. 点击左侧的 **"Logs"**
2. 选择日志类型：
   - API Logs
   - Database Logs
   - Realtime Logs

## 🐛 常见问题

### 问题1: 连接失败

**症状**: 控制台显示 "Failed to connect to Supabase"

**解决方案**:
1. 检查 `.env.local` 文件是否正确
2. 确认URL和密钥没有多余的空格
3. 重启开发服务器
4. 检查网络连接

### 问题2: 权限错误

**症状**: "permission denied for table xxx"

**解决方案**:
1. 确认已运行 `schema.sql` 脚本
2. 检查RLS策略是否正确配置
3. 在Supabase仪表板检查表的RLS设置

### 问题3: 实时更新不工作

**症状**: 骰子投掷后其他人看不到

**解决方案**:
1. 确认已启用Realtime（在schema.sql中）
2. 检查浏览器控制台是否有WebSocket错误
3. 尝试刷新页面

### 问题4: 数据库初始化失败

**症状**: SQL脚本执行出错

**解决方案**:
1. 确保复制了完整的SQL脚本
2. 分段执行（每次执行一个表的创建）
3. 检查错误信息，可能是语法问题

## 💰 费用说明

Supabase提供**免费套餐**，对于个人使用完全足够：

### 免费套餐包含：
- ✅ 500MB数据库存储
- ✅ 1GB文件存储
- ✅ 2GB带宽/月
- ✅ 50,000次API请求/月
- ✅ 无限制的Realtime连接
- ✅ 社区支持

### 何时需要升级？
- 超过500MB数据（约10000+个角色卡）
- 超过50000次API请求/月（约1600次/天）
- 需要自动备份
- 需要优先支持

**对于跑团使用，免费套餐完全够用！**

## 🔒 安全建议

1. **不要泄露密钥**
   - 不要将 `.env.local` 提交到Git
   - 不要在公开场合分享密钥

2. **使用环境变量**
   - 生产环境使用不同的密钥
   - 定期轮换密钥

3. **启用RLS**
   - 确保所有表都启用了行级安全
   - 定期审查安全策略

4. **监控使用情况**
   - 定期检查API使用量
   - 注意异常访问

## 🚀 性能优化

### 1. 使用索引
数据库已经为常用查询添加了索引，无需额外配置。

### 2. 限制查询结果
```typescript
// 限制返回数量
const { data } = await supabase
  .from('dice_rolls')
  .select('*')
  .limit(50)
```

### 3. 使用缓存
```typescript
// 使用React Query缓存数据
import { useQuery } from '@tanstack/react-query'
```

### 4. 批量操作
```typescript
// 批量插入
const { data } = await supabase
  .from('combatants')
  .insert([combatant1, combatant2, combatant3])
```

## 📚 下一步

配置完成后：

1. ✅ 测试创建房间
2. ✅ 邀请朋友加入
3. ✅ 测试骰子同步
4. ✅ 测试战斗追踪
5. ✅ 开始在线跑团！

## 🆘 需要帮助？

- 📖 [Supabase官方文档](https://supabase.com/docs)
- 💬 [Supabase Discord社区](https://discord.supabase.com)
- 🐛 [项目Issues](https://github.com/your-repo/issues)

## ✨ 配置完成！

恭喜！你已经成功配置了Supabase后端。

现在你可以：
- 🌐 **在线跑团** - 和朋友远程游戏
- 💾 **云端存储** - 数据永不丢失
- 🔄 **实时同步** - 所有操作即时更新

**准备好开始在线冒险了吗？🎲✨**

