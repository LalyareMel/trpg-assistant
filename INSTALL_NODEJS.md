# 📦 Node.js 安装指南

本项目需要Node.js运行环境。如果你还没有安装Node.js，请按照以下步骤操作。

## 🖥️ Windows系统安装

### 方法1: 官方安装包（推荐）

1. **下载Node.js**
   - 访问官网: https://nodejs.org/
   - 选择 **LTS版本**（长期支持版，更稳定）
   - 当前推荐版本: Node.js 18.x 或 20.x

2. **运行安装程序**
   - 双击下载的 `.msi` 文件
   - 点击 **"Next"** 继续
   - 接受许可协议
   - 选择安装路径（默认即可）
   - **重要**: 确保勾选 **"Add to PATH"** 选项
   - 点击 **"Install"** 开始安装

3. **验证安装**
   - 打开 **命令提示符** 或 **PowerShell**
   - 输入以下命令：
   ```bash
   node --version
   ```
   - 应该显示类似: `v18.17.0`
   
   - 验证npm（Node包管理器）：
   ```bash
   npm --version
   ```
   - 应该显示类似: `9.6.7`

### 方法2: 使用Chocolatey（高级用户）

如果你已经安装了Chocolatey包管理器：

```bash
choco install nodejs-lts
```

### 方法3: 使用Scoop（高级用户）

如果你已经安装了Scoop包管理器：

```bash
scoop install nodejs-lts
```

## 🍎 macOS系统安装

### 方法1: 官方安装包

1. 访问 https://nodejs.org/
2. 下载macOS安装包（.pkg文件）
3. 双击安装包并按照提示操作

### 方法2: 使用Homebrew（推荐）

```bash
# 安装Homebrew（如果还没有）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装Node.js
brew install node
```

### 验证安装

```bash
node --version
npm --version
```

## 🐧 Linux系统安装

### Ubuntu/Debian

```bash
# 更新包列表
sudo apt update

# 安装Node.js和npm
sudo apt install nodejs npm

# 或者安装最新LTS版本
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### CentOS/RHEL/Fedora

```bash
# 使用NodeSource仓库
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
sudo yum install -y nodejs
```

### Arch Linux

```bash
sudo pacman -S nodejs npm
```

### 验证安装

```bash
node --version
npm --version
```

## 🔧 安装后配置

### 配置npm镜像（可选，加速下载）

如果你在中国大陆，可以使用淘宝镜像加速npm包下载：

```bash
# 设置淘宝镜像
npm config set registry https://registry.npmmirror.com

# 验证配置
npm config get registry
```

### 全局包安装路径（可选）

Windows用户可能需要配置全局包安装路径：

```bash
# 查看当前配置
npm config get prefix

# 设置新路径（可选）
npm config set prefix "C:\Users\YourUsername\AppData\Roaming\npm"
```

## ✅ 验证安装成功

运行以下命令确认安装成功：

```bash
# 检查Node.js版本
node --version
# 应该显示: v18.x.x 或更高

# 检查npm版本
npm --version
# 应该显示: 9.x.x 或更高

# 测试Node.js
node -e "console.log('Node.js is working!')"
# 应该显示: Node.js is working!

# 测试npm
npm --help
# 应该显示npm帮助信息
```

## 🚀 安装完成后的下一步

1. **重启终端/命令提示符**
   - 关闭并重新打开终端，确保PATH环境变量生效

2. **进入项目目录**
   ```bash
   cd C:\Users\Administrator\Documents\augment-projects\COC11
   ```

3. **安装项目依赖**
   ```bash
   npm install
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **打开浏览器**
   - 访问 http://localhost:3000

## 🐛 常见问题

### 问题1: 'node' 不是内部或外部命令

**原因**: Node.js没有添加到PATH环境变量

**解决方案**:
1. 重新安装Node.js，确保勾选"Add to PATH"
2. 或手动添加到PATH：
   - Windows: 系统属性 → 环境变量 → Path → 添加Node.js安装路径
   - 默认路径: `C:\Program Files\nodejs\`

### 问题2: npm install 很慢

**解决方案**:
```bash
# 使用淘宝镜像
npm config set registry https://registry.npmmirror.com

# 或使用cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm install
```

### 问题3: 权限错误（Linux/macOS）

**解决方案**:
```bash
# 不要使用sudo安装全局包
# 配置npm使用用户目录
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### 问题4: 版本太旧

**解决方案**:
```bash
# 更新npm到最新版本
npm install -g npm@latest

# 更新Node.js需要重新下载安装包
# 或使用nvm（Node Version Manager）
```

## 🔄 使用nvm管理多个Node.js版本（高级）

### Windows

1. 下载nvm-windows: https://github.com/coreybutler/nvm-windows/releases
2. 安装后使用：
```bash
nvm install 18
nvm use 18
```

### macOS/Linux

```bash
# 安装nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安装Node.js
nvm install 18
nvm use 18
nvm alias default 18
```

## 📚 推荐学习资源

- [Node.js官方文档](https://nodejs.org/docs/)
- [npm官方文档](https://docs.npmjs.com/)
- [Node.js中文网](http://nodejs.cn/)

## 🆘 需要帮助？

如果遇到安装问题：

1. 查看Node.js官方文档
2. 搜索错误信息
3. 在项目Issues中提问
4. 访问Node.js中文社区

## ✨ 安装成功！

恭喜！你已经成功安装了Node.js。

现在可以继续查看：
- 📘 [QUICKSTART.md](./QUICKSTART.md) - 快速启动指南
- 🔧 [SETUP.md](./SETUP.md) - 详细设置指南
- 📖 [README.md](./README.md) - 项目说明

---

**准备好开始开发了吗？🚀**

