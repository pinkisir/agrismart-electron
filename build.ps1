# AgriSmart Electron - Windows 打包脚本
# 用法：在 PowerShell 中运行此脚本

$ErrorActionPreference = "Stop"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "AgriSmart Electron 打包工具 (Windows)" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# 检查 Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ 未找到 Node.js，请先安装 Node.js" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Node.js 版本: $(node -v)" -ForegroundColor Green
Write-Host "✓ npm 版本: $(npm -v)" -ForegroundColor Green

# 安装依赖
Write-Host ""
Write-Host "📦 安装项目依赖..." -ForegroundColor Yellow
npm install

# 清理旧的构建
Write-Host ""
Write-Host "🧹 清理旧的构建文件..." -ForegroundColor Yellow
if (Test-Path "release") {
    Remove-Item -Recurse -Force "release"
}

# 显示打包选项
Write-Host ""
Write-Host "请选择打包格式：" -ForegroundColor Cyan
Write-Host "1. AppImage (Linux 通用格式)" -ForegroundColor White
Write-Host "2. 目录格式 (用于测试)" -ForegroundColor White
Write-Host "3. 查看打包指南" -ForegroundColor White

$choice = Read-Host "请输入选项 (1-3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🔨 开始打包 AppImage..." -ForegroundColor Yellow
        npm run build:appimage
        
        if (Test-Path "release/*.AppImage") {
            Write-Host ""
            Write-Host "======================================" -ForegroundColor Green
            Write-Host "✅ AppImage 打包完成！" -ForegroundColor Green
            Write-Host "======================================" -ForegroundColor Green
            Write-Host "📦 生成的文件：" -ForegroundColor White
            Get-ChildItem "release/*.AppImage" | Select-Object Name, Length
        } else {
            Write-Host "❌ 打包失败，请检查错误信息" -ForegroundColor Red
        }
    }
    "2" {
        Write-Host ""
        Write-Host "🔨 开始打包目录格式..." -ForegroundColor Yellow
        npm run build:dir
        
        if (Test-Path "release/linux-arm64-unpacked") {
            Write-Host ""
            Write-Host "======================================" -ForegroundColor Green
            Write-Host "✅ 目录打包完成！" -ForegroundColor Green
            Write-Host "======================================" -ForegroundColor Green
            Write-Host "📦 输出目录：release/linux-arm64-unpacked" -ForegroundColor White
            Write-Host "💡 可在 Linux ARM64 系统上测试运行" -ForegroundColor White
        } else {
            Write-Host "❌ 打包失败，请检查错误信息" -ForegroundColor Red
        }
    }
    "3" {
        Write-Host ""
        Write-Host "📖 打包指南：" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "在 Windows 上无法直接生成 .deb 包（需要 fpm 工具）" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "推荐方案：" -ForegroundColor White
        Write-Host "1. 在 Linux ARM64 系统上运行 build-deb.sh 脚本" -ForegroundColor White
        Write-Host "2. 使用 GitHub Actions 自动打包" -ForegroundColor White
        Write-Host "3. 使用 Docker 交叉编译" -ForegroundColor White
        Write-Host ""
        Write-Host "详细文档请查看：BUILD_GUIDE.md" -ForegroundColor Green
        
        if (Test-Path "BUILD_GUIDE.md") {
            Invoke-Item "BUILD_GUIDE.md"
        }
    }
    default {
        Write-Host "❌ 无效选项" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
