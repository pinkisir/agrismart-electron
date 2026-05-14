#!/bin/bash
# AgriSmart Electron - ARM64 .deb 打包脚本
# 用法：在 Linux ARM64 系统上运行此脚本

set -e

echo "======================================"
echo "AgriSmart Electron ARM64 打包工具"
echo "======================================"

# 检查是否在 ARM64 系统上
ARCH=$(uname -m)
if [ "$ARCH" != "aarch64" ]; then
    echo "⚠️  警告：当前架构为 $ARCH，不是 ARM64 (aarch64)"
    echo "   此脚本应在 ARM64 系统上运行以生成正确的 .deb 包"
    read -p "是否继续？(y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js，正在安装..."
    sudo apt update
    sudo apt install -y nodejs npm
fi

echo "✓ Node.js 版本: $(node -v)"
echo "✓ npm 版本: $(npm -v)"

# 安装依赖
echo ""
echo "📦 安装项目依赖..."
npm install

# 清理旧的构建
echo ""
echo "🧹 清理旧的构建文件..."
rm -rf release/

# 执行打包
echo ""
echo "🔨 开始打包 ARM64 .deb 包..."
npm run build:linux

# 检查输出
echo ""
echo "======================================"
echo "✅ 打包完成！"
echo "======================================"

if ls release/*.deb 1> /dev/null 2>&1; then
    echo "📦 生成的 .deb 包："
    ls -lh release/*.deb
    echo ""
    echo "📝 安装命令："
    echo "   sudo dpkg -i release/agrismart_*.deb"
    echo "   sudo apt install -f"
else
    echo "❌ 未找到 .deb 包，请检查错误信息"
    exit 1
fi
