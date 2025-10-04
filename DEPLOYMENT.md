# 🚀 部署指南

本指南将帮助你将TRPG助手部署到生产环境，让你和朋友可以通过互联网访问。

## 📋 部署选项

### 推荐方案：Vercel（免费）

**优势：**
- ✅ 完全免费
- ✅ 自动部署
- ✅ 全球CDN加速
- ✅ 自动HTTPS
- ✅ 与Next.js完美集成
- ✅ 零配置

### 其他方案

- **Netlify** - 类似Vercel，也很好用
- **Railway** - 支持数据库和后端
- **自托管** - 使用Docker或VPS

---

## 🎯 Vercel部署（推荐）

### 步骤1: 准备代码仓库

1. **创建GitHub仓库**
   ```bash
   # 初始化Git（如果还没有）
   git init
   
   # 添加所有文件
   git add .
   
   # 提交
   git commit -m "Initial commit"
   
   # 创建GitHub仓库后，推送代码
   git remote add origin https://github.com/你的用户名/trpg-assistant.git
   git branch -M main
   git push -u origin main
   ```

2. **确保.gitignore正确**
   ```
   node_modules/
   .next/
   .env.local
   .DS_Store
   ```

### 步骤2: 部署到Vercel

1. **访问Vercel**
   - 打开 https://vercel.com
   - 使用GitHub账号登录

2. **导入项目**
   - 点击 **"New Project"**
   - 选择你的GitHub仓库
   - 点击 **"Import"**

3. **配置环境变量**
   - 在 **"Environment Variables"** 部分添加：
   ```
   NEXT_PUBLIC_SUPABASE_URL = 你的Supabase URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY = 你的Supabase密钥
   ```
   - 如果不配置，应用将使用本地模式

4. **部署**
   - 点击 **"Deploy"**
   - 等待2-3分钟
   - 部署完成！

5. **获取URL**
   - 部署成功后，你会得到一个URL
   - 类似：`https://trpg-assistant.vercel.app`
   - 分享这个URL给朋友即可访问

### 步骤3: 配置自定义域名（可选）

1. 在Vercel项目设置中点击 **"Domains"**
2. 添加你的域名
3. 按照提示配置DNS
4. 等待DNS生效（通常几分钟）

---

## 🔧 Netlify部署

### 步骤1: 准备

1. 确保代码已推送到GitHub
2. 访问 https://netlify.com
3. 使用GitHub登录

### 步骤2: 部署

1. 点击 **"New site from Git"**
2. 选择GitHub仓库
3. 配置构建设置：
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
4. 添加环境变量（同Vercel）
5. 点击 **"Deploy site"**

---

## 🐳 Docker部署

### Dockerfile

创建 `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# 安装依赖
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 构建应用
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 生产镜像
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
    restart: unless-stopped
```

### 运行

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

---

## 🖥️ VPS自托管

### 使用PM2

1. **安装Node.js和PM2**
   ```bash
   # 安装Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # 安装PM2
   sudo npm install -g pm2
   ```

2. **部署代码**
   ```bash
   # 克隆代码
   git clone https://github.com/你的用户名/trpg-assistant.git
   cd trpg-assistant
   
   # 安装依赖
   npm install
   
   # 构建
   npm run build
   ```

3. **配置环境变量**
   ```bash
   # 创建.env.local
   nano .env.local
   
   # 添加配置
   NEXT_PUBLIC_SUPABASE_URL=你的URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的密钥
   ```

4. **启动应用**
   ```bash
   # 使用PM2启动
   pm2 start npm --name "trpg-assistant" -- start
   
   # 设置开机自启
   pm2 startup
   pm2 save
   ```

5. **配置Nginx反向代理**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## 🔒 生产环境配置

### 环境变量

**必需的环境变量：**
```env
NEXT_PUBLIC_SUPABASE_URL=你的Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase密钥
```

### 安全建议

1. **使用HTTPS**
   - Vercel/Netlify自动提供
   - 自托管需要配置SSL证书（Let's Encrypt）

2. **保护环境变量**
   - 不要将.env.local提交到Git
   - 使用平台的环境变量管理

3. **Supabase安全**
   - 启用RLS（行级安全）
   - 定期轮换密钥
   - 监控API使用量

### 性能优化

1. **启用缓存**
   - Vercel自动处理
   - 自托管需要配置CDN

2. **图片优化**
   - 使用Next.js Image组件
   - 配置图片CDN

3. **代码分割**
   - Next.js自动处理
   - 确保使用动态导入

---

## 📊 监控和维护

### Vercel Analytics

1. 在Vercel项目设置中启用Analytics
2. 查看访问量、性能指标
3. 免费版有基础功能

### Supabase监控

1. 在Supabase仪表板查看：
   - API请求量
   - 数据库大小
   - 实时连接数

2. 设置告警：
   - 接近配额限制时通知
   - 异常流量检测

### 日志管理

**Vercel日志：**
- 在项目页面查看实时日志
- 保留最近7天的日志

**自托管日志：**
```bash
# PM2日志
pm2 logs trpg-assistant

# Nginx日志
tail -f /var/log/nginx/access.log
```

---

## 🔄 更新部署

### Vercel自动部署

1. 推送代码到GitHub
   ```bash
   git add .
   git commit -m "Update features"
   git push
   ```

2. Vercel自动检测并部署
3. 通常1-2分钟完成

### 手动更新

```bash
# 拉取最新代码
git pull

# 安装依赖
npm install

# 重新构建
npm run build

# 重启服务
pm2 restart trpg-assistant
```

---

## 🐛 常见问题

### 问题1: 部署失败

**检查：**
- Node.js版本是否正确（18+）
- 依赖是否完整安装
- 构建命令是否正确

### 问题2: 环境变量不生效

**解决：**
- 确认变量名正确（NEXT_PUBLIC_前缀）
- 重新部署
- 清除缓存

### 问题3: Supabase连接失败

**检查：**
- URL和密钥是否正确
- Supabase项目是否激活
- 网络连接是否正常

### 问题4: 性能问题

**优化：**
- 启用CDN
- 优化图片
- 减少API调用
- 使用缓存

---

## 📱 移动端访问

部署后，用户可以：
- 直接在手机浏览器访问
- 添加到主屏幕（PWA）
- 横屏使用体验更好

---

## 💰 成本估算

### 免费方案（推荐）

**Vercel免费版：**
- ✅ 无限项目
- ✅ 100GB带宽/月
- ✅ 自动HTTPS
- ✅ 全球CDN

**Supabase免费版：**
- ✅ 500MB数据库
- ✅ 1GB文件存储
- ✅ 50,000次API请求/月
- ✅ 无限Realtime连接

**总成本：$0/月** 🎉

### 升级方案

**如果需要更多资源：**
- Vercel Pro: $20/月
- Supabase Pro: $25/月

**对于个人跑团，免费版完全够用！**

---

## 🎉 部署完成！

现在你的TRPG助手已经在线了！

**下一步：**
1. ✅ 分享URL给朋友
2. ✅ 创建在线房间
3. ✅ 开始远程跑团！

**祝你游戏愉快！🎲✨**

---

## 📚 相关文档

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Supabase配置
- [ONLINE_GUIDE.md](./ONLINE_GUIDE.md) - 在线功能使用
- [README.md](./README.md) - 项目说明

