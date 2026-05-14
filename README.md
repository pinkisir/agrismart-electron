# AgriSmart Electron - 智慧农业物联网控制终端

## 项目结构

```
agrismart-electron/
├── main.js          # Electron 主进程
├── preload.js       # 预加载脚本
├── package.json     # 项目配置
├── ui/              # 前端页面（直接复制自 agrismart-native）
└── assets/icons/    # 应用图标（待添加）
```

## 开发模式（本地预览）

```bash
npm install
npm start
```

## 打包 ARM64 安装包

### Windows 系统

Windows 上无法直接生成 .deb 包，但可以使用以下命令：

```bash
# 使用交互式打包脚本（推荐）
.\build.ps1

# 或手动打包为 AppImage
npm run build:appimage

# 或打包为目录格式（用于测试）
npm run build:dir
```

### Linux ARM64 系统（推荐）

在 Ubuntu/Debian ARM64 系统上执行：

```bash
# 使用自动打包脚本（推荐）
chmod +x build-deb.sh
./build-deb.sh

# 或手动打包
npm install
npm run build:linux
```

### 生成的文件

产物在 `release/` 目录下：

- `agrismart_0.1.0_arm64.deb` - Ubuntu/Debian 安装包
- `agrismart-0.1.0-arm64.AppImage` - Linux 通用可执行文件
- `linux-arm64-unpacked/` - 解包后的目录（用于测试）

### 安装 .deb 包

```bash
sudo dpkg -i release/agrismart_0.1.0_arm64.deb
sudo apt install -f  # 修复依赖
```

### 其他打包方式

详细文档请查看 [BUILD_GUIDE.md](BUILD_GUIDE.md)，包括：

- Docker 交叉编译方案
- GitHub Actions 自动化打包
- 多架构打包配置

## 配置说明

- 窗口大小：固定 1024x600
- 无边框：frame: false
- 不可缩放：resizable: false
