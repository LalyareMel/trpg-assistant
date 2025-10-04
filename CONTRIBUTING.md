# 贡献指南

感谢你对TRPG助手项目的关注！我们欢迎各种形式的贡献。

## 🤝 如何贡献

### 报告Bug

如果你发现了Bug，请：

1. 检查[Issues](https://github.com/your-repo/issues)确认问题是否已被报告
2. 如果没有，创建一个新Issue，包含：
   - 清晰的标题和描述
   - 重现步骤
   - 预期行为和实际行为
   - 截图（如果适用）
   - 浏览器和操作系统信息

### 提出新功能

如果你有新功能的想法：

1. 先在Issues中讨论你的想法
2. 等待维护者的反馈
3. 获得批准后再开始开发

### 提交代码

1. **Fork项目**
   ```bash
   # 点击GitHub上的Fork按钮
   ```

2. **克隆你的Fork**
   ```bash
   git clone https://github.com/your-username/trpg-assistant.git
   cd trpg-assistant
   ```

3. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

4. **安装依赖**
   ```bash
   npm install
   ```

5. **进行修改**
   - 遵循代码风格指南
   - 添加必要的测试
   - 更新文档

6. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   # 或
   git commit -m "fix: resolve bug"
   ```

7. **推送到你的Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **创建Pull Request**
   - 在GitHub上创建PR
   - 填写PR模板
   - 等待代码审查

## 📝 代码风格

### TypeScript/React

- 使用TypeScript进行类型检查
- 使用函数组件和Hooks
- 遵循React最佳实践

```typescript
// ✅ 好的示例
interface Props {
  name: string
  age: number
}

export default function UserCard({ name, age }: Props) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{age}岁</p>
    </div>
  )
}

// ❌ 不好的示例
export default function UserCard(props: any) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>{props.age}岁</p>
    </div>
  )
}
```

### 命名规范

- **组件**: PascalCase (例如: `DiceRoller.tsx`)
- **函数**: camelCase (例如: `rollDice()`)
- **常量**: UPPER_SNAKE_CASE (例如: `MAX_DICE_COUNT`)
- **类型/接口**: PascalCase (例如: `Character`, `DiceRoll`)

### 文件组织

```
components/
  ├── DiceRoller.tsx        # 主组件
  ├── CharacterSheet.tsx
  └── character/            # 子组件目录
      ├── COCSheet.tsx
      ├── DNDSheet.tsx
      └── GenericSheet.tsx

lib/
  ├── dice.ts              # 工具函数
  ├── utils.ts
  └── constants.ts

types/
  └── index.ts             # 类型定义
```

## 🧪 测试

在提交PR之前，请确保：

1. **代码可以正常构建**
   ```bash
   npm run build
   ```

2. **没有TypeScript错误**
   ```bash
   npx tsc --noEmit
   ```

3. **代码格式正确**
   ```bash
   npm run lint
   ```

4. **功能正常工作**
   - 在浏览器中测试你的更改
   - 测试不同的场景和边界情况

## 📋 Commit消息规范

使用[Conventional Commits](https://www.conventionalcommits.org/)规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type类型

- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 示例

```bash
feat(dice): add d100 dice support

Add support for d100 dice rolls in the dice roller component.
This includes UI updates and dice calculation logic.

Closes #123
```

```bash
fix(character): resolve COC skill calculation bug

Fixed an issue where COC character skills were not
calculating correctly when attributes changed.

Fixes #456
```

## 🎨 UI/UX指南

### 设计原则

1. **一致性**: 保持UI元素的一致性
2. **可访问性**: 确保所有用户都能使用
3. **响应式**: 支持移动端和桌面端
4. **性能**: 优化加载时间和动画

### 颜色使用

使用Tailwind CSS的颜色系统：

```tsx
// 主色调
className="bg-purple-600 text-white"

// 成功状态
className="bg-green-600 text-white"

// 错误状态
className="bg-red-600 text-white"

// 警告状态
className="bg-yellow-600 text-white"
```

### 动画

使用Tailwind的transition类：

```tsx
className="transition-all hover:bg-purple-700"
```

## 🌍 国际化

目前项目使用简体中文，未来计划支持多语言：

- 简体中文 (zh-CN)
- 繁体中文 (zh-TW)
- 英语 (en)
- 日语 (ja)

如果你想帮助翻译，请联系维护者。

## 📚 文档

更新文档和代码一样重要：

- 更新README.md（如果添加了新功能）
- 添加代码注释（复杂逻辑）
- 更新类型定义
- 添加使用示例

## 🐛 调试技巧

### 使用浏览器开发者工具

```typescript
// 添加调试日志
console.log('Dice roll result:', result)

// 使用断点
debugger
```

### 检查localStorage

```javascript
// 在浏览器控制台
localStorage.getItem('trpg_characters')
```

### React DevTools

安装React DevTools浏览器扩展来检查组件状态。

## 🎯 优先级

当前优先级（按重要性排序）：

1. **Bug修复** - 修复现有问题
2. **性能优化** - 提升应用性能
3. **Supabase集成** - 实现后端功能
4. **新游戏系统** - 添加更多游戏系统支持
5. **UI改进** - 优化用户界面
6. **新功能** - 添加新功能

## 💬 交流

- **Issues**: 用于Bug报告和功能请求
- **Discussions**: 用于一般讨论和问题
- **Pull Requests**: 用于代码审查

## 📜 行为准则

- 尊重所有贡献者
- 保持友好和专业
- 接受建设性批评
- 关注项目目标

## 🙏 致谢

感谢所有贡献者的付出！你的贡献让这个项目变得更好。

---

再次感谢你的贡献！🎲✨

