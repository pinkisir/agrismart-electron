# AgriSmart Electron - Ubuntu ARM64 打包指南

## 在 Windows 上打包

Windows 系统无法直接生成 .deb 包（需要 fpm 工具），但可以打包为 AppImage 格式：

```bash
# 打包为 AppImage（Linux 通用格式）
npm run build:appimage

# 打包为目录（用于测试）
npm run build:dir
```

## 在 Linux ARM64 上打包 .deb 包

### 方法 1：直接在 ARM64 Linux 系统上打包（推荐）

1. 将项目复制到 ARM64 Linux 系统（Ubuntu/Debian）

2. 安装依赖：
```bash
sudo apt update
sudo apt install -y nodejs npm
npm install
```

3. 打包：
```bash
npm run build:linux
```

4. 生成的 .deb 包位于：`release/agrismart_0.1.0_arm64.deb`

### 方法 2：使用 Docker 交叉编译

在 x86_64 Linux 系统上使用 Docker 模拟 ARM64 环境：

```bash
# 使用 multiarch/qemu-user-static 支持 ARM64
docker run --rm --privileged multiarch/qemu-user-static --reset -p yes

# 在 ARM64 容器中打包
docker run --rm -v $(pwd):/app -w /app arm64v8/node:18 bash -c "
  apt update && apt install -y build-essential
  npm install
  npm run build:linux
"
```

### 方法 3：使用 GitHub Actions 自动打包（Ubuntu 18.04 ARM64）

项目已包含 `.github/workflows/build.yml`，会在 GitHub Actions 中通过 QEMU 进入 Ubuntu 18.04 ARM64 环境打包：

```yaml
jobs:
  build:
    name: Build Ubuntu 18.04 ARM64
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-qemu-action@v3
        with:
          platforms: arm64
      - uses: uraimo/run-on-arch-action@v2
        with:
          arch: aarch64
          distro: ubuntu18.04
          install: |
            apt-get update
            apt-get install -y curl ca-certificates build-essential fakeroot dpkg rpm libarchive-tools
            curl -fsSL https://nodejs.org/dist/v16.20.2/node-v16.20.2-linux-arm64.tar.xz -o /tmp/node.tar.xz
            tar -xJf /tmp/node.tar.xz -C /usr/local --strip-components=1
          run: |
            npm config set electron_mirror https://npmmirror.com/mirrors/electron/
            export npm_config_cache="$PWD/.npm-cache"
            export npm_config_electron_cache="$PWD/.electron-cache"
            export ELECTRON_CACHE="$PWD/.electron-cache"
            export XDG_CACHE_HOME="$PWD/.cache"
            mkdir -p "$npm_config_cache" "$ELECTRON_CACHE" "$XDG_CACHE_HOME"
            chmod -R 777 "$npm_config_cache" "$ELECTRON_CACHE" "$XDG_CACHE_HOME"
            npm ci
            npm run build:linux
```

首次推送到 GitHub：

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/pinkisir/agrismart-electron.git
git push -u origin main
```

如果仓库已经添加过 `origin`，不要重复执行 `git remote add origin`，改用：

```bash
git remote set-url origin https://github.com/pinkisir/agrismart-electron.git
git push -u origin main
```

## 安装 .deb 包

在 Ubuntu ARM64 系统上安装：

```bash
sudo dpkg -i agrismart_0.1.0_arm64.deb
sudo apt install -f  # 修复依赖
```

## 运行应用

安装后可通过应用程序菜单启动，或命令行运行：
```bash
agrismart
```

## 注意事项

1. **图标资源**：确保 `assets/icons/` 目录包含所需的图标文件
2. **依赖项**：.deb 包会自动依赖 libgtk-3-0 等库
3. **架构匹配**：必须在 ARM64 系统上运行 arm64 架构的包
4. **测试建议**：先在目标硬件上测试 AppImage 或目录版本
