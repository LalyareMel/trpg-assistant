# 🚀 项目启动指南

## 📋 前置要求

在开始之前，请确保你的系统已安装：

1. **Node.js** (版本 18 或更高)
   - 下载地址: https://nodejs.org/
   - 验证安装: `node --version`

2. **npm** (通常随Node.js一起安装)
   - 验证安装: `npm --version`

## 🔧 安装步骤

### 1. 安装依赖

在项目根目录下运行：

```bash
npm install
```

这将安装所有必需的依赖包，包括：
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (图标库)
- Supabase客户端 (可选)

### 2. 启动开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:3000 启动

### 3. 打开浏览器

访问 http://localhost:3000 即可开始使用！

## 🎯 快速测试

启动后，你可以：

1. **测试骰子系统**
   - 点击"骰子"标签
   - 输入 `2d6+3` 并点击"投掷"
   - 或点击快速骰子按钮（d20, d100等）
   - 尝试"COC检定"和"DND检定"

2. **创建角色卡**
   - 点击"角色卡"标签
   - 点击"创建角色"
   - 选择游戏系统（COC/DND/通用）
   - 填写角色信息

3. **创建房间**
   - 点击"房间"标签
   - 点击"创建房间"
   - 输入房间名称

4. **测试战斗追踪器**
   - 点击"战斗"标签
   - 点击"开始战斗"
   - 添加几个参与者
   - 测试回合切换和HP管理

## 🏗️ 构建生产版本

```bash
# 构建
npm run build

# 启动生产服务器
npm start
```

## 🐛 常见问题

### 问题1: npm install 失败

**解决方案:**
```bash
# 清除npm缓存
npm cache clean --force

# 删除node_modules和package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 问题2: 端口3000已被占用

**解决方案:**
```bash
# 使用其他端口
npm run dev -- -p 3001
```

### 问题3: TypeScript错误

**解决方案:**
```bash
# 重新生成TypeScript配置
npx tsc --init
```

## 📦 项目结构

```
COC11/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/            # React组件
│   ├── DiceRoller.tsx    # 骰子系统
│   ├── CharacterSheet.tsx # 角色卡管理
│   ├── RoomManager.tsx   # 房间管理
│   ├── CombatTracker.tsx # 战斗追踪器
│   └── character/        # 角色卡子组件
│       ├── COCSheet.tsx
│       ├── DNDSheet.tsx
│       └── GenericSheet.tsx
├── lib/                   # 工具函数
│   └── dice.ts           # 骰子逻辑
├── types/                 # TypeScript类型定义
│   └── index.ts
├── public/               # 静态资源
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript配置
├── tailwind.config.ts    # Tailwind配置
└── next.config.js        # Next.js配置
```

## 🔐 环境变量配置（可选）

如果要使用Supabase后端：

1. 复制环境变量模板：
```bash
cp .env.example .env.local
```

2. 编辑 `.env.local` 文件，填入你的Supabase配置：
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. 重启开发服务器

## 📱 浏览器兼容性

推荐使用以下浏览器的最新版本：
- Chrome / Edge (推荐)
- Firefox
- Safari

## 💡 开发提示

1. **热重载**: 修改代码后，浏览器会自动刷新
2. **数据存储**: 当前使用localStorage，数据保存在浏览器中
3. **清除数据**: 打开浏览器开发者工具 → Application → Local Storage → 删除相关项
4. **调试**: 使用浏览器开发者工具的Console查看日志

## 🎨 自定义主题

编辑 `app/globals.css` 中的CSS变量来自定义颜色：

```css
:root {
  --background: #0a0a0a;
  --foreground: #ededed;
}
```

## 📚 学习资源

- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [TypeScript 文档](https://www.typescriptlang.org/docs)

## 🆘 获取帮助

如果遇到问题：
1. 查看浏览器控制台的错误信息
2. 查看终端的错误输出
3. 参考README.md中的使用指南
4. 提交Issue到项目仓库

---

**准备好了吗？开始你的TRPG冒险吧！🎲✨**

