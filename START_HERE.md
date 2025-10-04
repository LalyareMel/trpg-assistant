# 🎲 从这里开始 - TRPG助手

欢迎使用TRPG助手！这是你的起点指南。

## 📍 你现在在哪里？

你已经成功获取了TRPG助手项目的完整代码！这是一个功能完整的跑团辅助工具，支持：

- 🎲 **骰子系统** - 支持各种骰子和检定
- 👤 **角色卡管理** - COC、DND、通用角色卡
- 🏠 **房间系统** - 创建和管理游戏房间
- ⚔️ **战斗追踪器** - 管理战斗先攻和HP
- 🌐 **在线协作** - 配置后端即可多人实时跑团

## 🚦 快速导航

### 🆕 第一次使用？

**按照这个顺序阅读：**

1. **[INSTALL_NODEJS.md](./INSTALL_NODEJS.md)** ⬅️ 从这里开始！
   - 如果你还没有安装Node.js，先看这个
   - 包含Windows/macOS/Linux的详细安装步骤

2. **[QUICKSTART.md](./QUICKSTART.md)** ⬅️ 然后看这个！
   - 5分钟快速启动指南
   - 三步启动项目
   - 快速体验所有功能

3. **[README.md](./README.md)** ⬅️ 了解更多
   - 完整的功能介绍
   - 详细的使用指南
   - 技术栈说明

### 🌐 想要在线多人协作？

**方式1: P2P联机（推荐！零配置）**

- **[P2P_GUIDE.md](./P2P_GUIDE.md)** ⬅️ P2P联机指南（3分钟开始）

**方式2: Supabase后端（可选，需配置）**

- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** ⬅️ Supabase后端配置指南
- **[ONLINE_GUIDE.md](./ONLINE_GUIDE.md)** ⬅️ 在线功能使用指南
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** ⬅️ 部署到生产环境

### 👨‍💻 开发者？

**查看这些文档：**

- **[SETUP.md](./SETUP.md)** - 详细的开发环境设置
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - 项目架构和技术细节
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - 如何贡献代码
- **[DATABASE.md](./DATABASE.md)** - 数据库设计（Supabase集成）

## ⚡ 超快速启动（已安装Node.js）

如果你已经安装了Node.js，只需要3个命令：

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 打开浏览器访问 http://localhost:3000
```

就这么简单！🎉

## 🎯 我想要...

### 我想立即使用这个工具
👉 阅读 [QUICKSTART.md](./QUICKSTART.md)

### 我想了解所有功能
👉 阅读 [README.md](./README.md)

### 我想参与开发
👉 阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)

### 我想和朋友在线跑团
👉 阅读 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) 和 [ONLINE_GUIDE.md](./ONLINE_GUIDE.md)

### 我想部署到服务器
👉 阅读 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 我想添加后端功能
👉 阅读 [DATABASE.md](./DATABASE.md)

### 我遇到了问题
👉 查看各文档的"常见问题"章节

## 📊 项目状态

✅ **当前版本**: v1.1.0
✅ **状态**: 可用于生产环境
✅ **完成度**: 核心功能 100%
✅ **后端集成**: 已完成（Supabase）
✅ **在线协作**: 已支持

## 🎮 功能一览

### ✅ 已实现
- [x] 多种骰子类型（d4-d100）
- [x] 骰子表达式解析
- [x] COC检定系统
- [x] DND检定系统
- [x] COC 7版角色卡
- [x] DND 5E角色卡
- [x] 通用角色卡
- [x] 角色导入/导出
- [x] 房间创建和管理
- [x] 战斗追踪器
- [x] 先攻管理
- [x] HP追踪
- [x] 状态效果管理
- [x] 响应式设计
- [x] 本地数据持久化

### ✅ 在线功能（需配置）
- [x] Supabase后端集成
- [x] 实时多人协作
- [x] 实时骰子同步
- [x] 实时战斗追踪
- [x] 云端数据存储
- [x] 用户认证系统（基础）

### 🔜 计划中
- [ ] 更多游戏系统支持
- [ ] PWA支持（离线使用）
- [ ] 语音/视频集成
- [ ] 地图工具
- [ ] 更多角色卡模板

## 🛠️ 技术栈

- **前端**: Next.js 14 + React 18 + TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **存储**: localStorage（当前）/ Supabase（计划）

## 📁 项目结构速览

```
COC11/
├── app/              # Next.js应用
├── components/       # React组件
├── lib/             # 工具函数
├── types/           # TypeScript类型
├── examples/        # 示例数据
└── 文档/
    ├── README.md              # 项目说明
    ├── QUICKSTART.md          # 快速启动
    ├── SETUP.md               # 详细设置
    ├── INSTALL_NODEJS.md      # Node.js安装
    ├── CONTRIBUTING.md        # 贡献指南
    ├── DATABASE.md            # 数据库设计
    ├── PROJECT_SUMMARY.md     # 项目总结
    └── START_HERE.md          # 本文件
```

## 🎓 学习路径

### 初学者路径
1. 安装Node.js
2. 启动项目
3. 体验所有功能
4. 创建自己的角色
5. 开始跑团！

### 开发者路径
1. 了解项目架构
2. 阅读代码
3. 尝试修改
4. 提交贡献
5. 参与开发！

## 💡 使用场景

### 🎭 作为玩家
- 创建和管理你的角色卡
- 投掷骰子进行检定
- 在战斗中追踪你的HP和状态

### 🎪 作为GM（游戏主持人）
- 创建游戏房间
- 管理多个NPC角色
- 使用战斗追踪器管理战斗
- 为玩家投掷隐藏骰子

### 👥 作为团队
- 在同一个房间中协作
- 共享骰子投掷结果
- 一起追踪战斗状态

## 🌟 特色功能

### 🎲 智能骰子系统
- 支持复杂表达式（如"2d6+3"）
- 自动判定大成功/大失败
- 完整的历史记录

### 👤 灵活的角色卡
- 支持多种游戏系统
- 完全自定义的通用角色卡
- 导入/导出功能

### ⚔️ 强大的战斗追踪
- 自动先攻排序
- 可视化HP条
- 状态效果管理

## 🎯 下一步行动

### 现在就开始！

1. **检查Node.js**
   ```bash
   node --version
   ```
   如果显示版本号，跳到步骤3
   如果显示错误，继续步骤2

2. **安装Node.js**
   👉 查看 [INSTALL_NODEJS.md](./INSTALL_NODEJS.md)

3. **启动项目**
   👉 查看 [QUICKSTART.md](./QUICKSTART.md)

4. **开始游戏**
   👉 创建角色，投掷骰子，享受跑团！

## 📞 获取帮助

### 遇到问题？

1. **查看文档** - 大多数问题都有答案
2. **检查Issues** - 看看是否有人遇到相同问题
3. **提交Issue** - 描述你的问题
4. **联系开发者** - 通过项目仓库

### 常见问题快速链接

- Node.js安装问题 → [INSTALL_NODEJS.md](./INSTALL_NODEJS.md)
- 项目启动问题 → [SETUP.md](./SETUP.md)
- 功能使用问题 → [README.md](./README.md)
- 开发相关问题 → [CONTRIBUTING.md](./CONTRIBUTING.md)

## 🎉 准备好了吗？

选择你的路径：

- 🚀 **我要立即开始** → [QUICKSTART.md](./QUICKSTART.md)
- 📚 **我要详细了解** → [README.md](./README.md)
- 💻 **我要参与开发** → [CONTRIBUTING.md](./CONTRIBUTING.md)
- 🔧 **我需要安装Node.js** → [INSTALL_NODEJS.md](./INSTALL_NODEJS.md)

---

## 📜 文档索引

| 文档 | 用途 | 适合人群 |
|------|------|----------|
| **START_HERE.md** | 总导航（本文件） | 所有人 |
| **INSTALL_NODEJS.md** | Node.js安装指南 | 新手 |
| **QUICKSTART.md** | 5分钟快速启动 | 想快速体验的人 |
| **README.md** | 完整项目说明 | 所有人 |
| **SUPABASE_SETUP.md** | Supabase配置指南 | 想要在线协作的人 |
| **ONLINE_GUIDE.md** | 在线功能使用指南 | 在线跑团用户 |
| **DEPLOYMENT.md** | 部署指南 | 想要部署的人 |
| **SETUP.md** | 详细设置指南 | 开发者 |
| **CONTRIBUTING.md** | 贡献指南 | 贡献者 |
| **DATABASE.md** | 数据库设计 | 后端开发者 |
| **PROJECT_SUMMARY.md** | 项目总结 | 开发者/学习者 |

---

**祝你游戏愉快！🎲✨**

*有任何问题或建议，欢迎提Issue！*

