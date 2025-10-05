# 🐛 Bug报告和修复建议

## 检查日期
2025-10-04

## 最后修复日期
2025-10-05

## 发现的Bug列表

**修复状态说明**:
- ✅ 已修复
- ⏳ 部分修复
- ❌ 未修复

### 1. ✅ **高优先级** - localStorage中Date对象序列化问题 [已修复]

**影响范围**:
- `components/RoomManager.tsx`
- `components/CharacterSheet.tsx`
- `components/DiceRoller.tsx`

**问题描述**:
当从localStorage读取数据时，`Date`对象会被反序列化为字符串，导致后续使用Date方法时出错。

**受影响的字段**:
- `Room.createdAt`
- `DiceRoll.timestamp`

**修复内容**:
- ✅ RoomManager.tsx: 添加Date字段转换逻辑
- ✅ DiceRoller.tsx: 添加Date字段转换逻辑和历史记录持久化
- ✅ CharacterSheet.tsx: 确认无Date字段，无需修复

---

### 2. ✅ **高优先级** - P2P消息处理器累积导致重复处理 [已修复]

**影响范围**:
- `lib/hooks/useP2P.ts`
- `lib/p2p/peer-connection.ts`

**问题描述**:
`onMessage`方法会不断添加处理器到数组中，但从不清理。这导致：
1. 同一个消息被处理多次
2. 内存泄漏
3. 性能下降

**修复内容**:
- ✅ P2PConnection.onMessage: 添加重复检查，避免注册相同的处理器
- ✅ P2PConnection.offMessage: 新增方法，支持移除特定处理器
- ✅ useP2PDiceSync: 使用useCallback稳定回调引用
- ✅ useP2PCombatSync: 使用useCallback稳定回调引用

---

### 3. ✅ **中优先级** - P2P成员变化回调累积 [已修复]

**影响范围**:
- `lib/hooks/useP2P.ts`

**问题描述**:
每次组件重新渲染时都会调用`onMembersChange`，但P2PConnection类只保存一个回调引用，新的会覆盖旧的。虽然不会导致多次调用，但可能导致闭包陷阱。

**修复内容**:
- ✅ useP2P: 在useEffect中设置成员变化回调，避免重复注册
- ✅ 回调函数在useEffect内部定义，确保正确的依赖关系

---

### 4. ✅ **中优先级** - 战斗追踪器边界条件bug [已修复]

**影响范围**:
- `components/CombatTracker.tsx`

**问题描述**:
当战斗参与者列表为空时，`nextTurn`函数仍然会执行，可能导致索引越界。虽然UI上按钮被禁用了，但函数本身没有保护。

**修复内容**:
- ✅ nextTurn函数: 添加空数组检查 `if (!combat || combat.combatants.length === 0) return`

---

### 5. ✅ **中优先级** - P2P连接状态恢复问题 [已修复]

**影响范围**:
- `lib/hooks/useP2P.ts`

**问题描述**:
从localStorage恢复P2P连接状态，但实际的Peer连接并没有重新建立。这导致：
1. UI显示"已连接"
2. 但实际无法发送/接收消息
3. 用户困惑

**修复内容**:
- ✅ 移除localStorage恢复P2P连接状态的逻辑
- ✅ 用户需要重新创建或加入房间来建立真实的P2P连接
- ✅ 避免显示虚假的连接状态

---

### 6. ✅ **低优先级** - P2PRoomManager成员识别逻辑 [已修复]

**影响范围**:
- `components/P2PRoomManager.tsx`
- `lib/hooks/useP2P.ts`
- `lib/p2p/peer-connection.ts`

**问题描述**:
用于识别"你"的逻辑依赖于`userName`匹配而不是`userId`，如果有重名用户会出错。

**修复内容**:
- ✅ P2PConnection: 添加getUserName()方法
- ✅ useP2P: 添加getCurrentUserId()和getCurrentUserName()方法
- ✅ P2PRoomManager: 使用p2p.getCurrentUserId()进行成员识别

---

### 7. ✅ **低优先级** - 缺少React Error Boundary [已修复]

**影响范围**:
- 整个应用

**问题描述**:
没有错误边界来捕获组件错误，一个组件崩溃可能导致整个应用白屏。

**修复内容**:
- ✅ 创建ErrorBoundary组件 (components/ErrorBoundary.tsx)
- ✅ 在app/layout.tsx中使用ErrorBoundary包裹应用
- ✅ 提供友好的错误UI和重试/刷新功能
- ✅ 开发环境下显示详细错误信息

---

## 其他建议

### 1. 添加输入验证
在骰子表达式解析中添加更严格的验证，防止恶意输入。

### 2. 添加加载状态
P2P连接创建/加入时添加加载指示器。

### 3. 改进错误提示
将console.error改为用户友好的错误提示。

### 4. 添加单元测试
特别是骰子逻辑和P2P连接逻辑。

---

## 修复优先级

1. ✅ **立即修复** (高优先级) - 已完成:
   - Bug #1: Date序列化问题
   - Bug #2: P2P消息处理器累积

2. ✅ **尽快修复** (中优先级) - 已完成:
   - Bug #3: 成员变化回调
   - Bug #4: 战斗追踪器边界条件
   - Bug #5: P2P连接状态恢复

3. ✅ **计划修复** (低优先级) - 已完成:
   - Bug #6: 成员识别逻辑
   - Bug #7: Error Boundary

## 修复总结

**修复日期**: 2025-10-05

**修复内容**:
- ✅ 所有7个已知bug已全部修复
- ✅ 添加了ErrorBoundary组件提升应用稳定性
- ✅ 改进了P2P连接的状态管理
- ✅ 修复了localStorage数据序列化问题
- ✅ 增强了边界条件检查

**建议后续改进**:
1. 为P2PConnection实现更精细的消息处理器管理（支持移除单个handler）
2. 添加单元测试覆盖关键逻辑
3. 添加输入验证防止恶意输入
4. 改进错误提示的用户体验

---

## 测试建议

修复后需要测试的场景：
1. 创建房间后刷新页面
2. 多次切换标签页
3. 多个用户同时加入房间
4. 网络断开重连
5. 战斗追踪器空列表操作
6. 长时间运行后的内存使用

