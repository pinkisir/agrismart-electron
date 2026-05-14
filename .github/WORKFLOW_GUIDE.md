# GitHub Actions 使用指南

## 什么是 GitHub Actions？

GitHub Actions 是 GitHub 提供的 CI/CD 工具，可以自动执行构建、测试、打包、部署等任务。

## 已配置的工作流

项目已配置了自动化打包工作流：[.github/workflows/build.yml](.github/workflows/build.yml)

### 触发条件

工作流会在以下情况自动执行：

1. **推送代码到 main/master 分支**
2. **创建版本标签**（如 `v0.1.0`）
3. **创建 Pull Request**
4. **手动触发**（在 GitHub 页面点击按钮）

### 工作流程

```
代码推送/打标签
    ↓
检出代码
    ↓
启用 QEMU ARM64
    ↓
进入 Ubuntu 18.04 ARM64 环境
    ↓
安装 Node.js 18 和依赖 (npm ci)
    ↓
打包 ARM64 .deb (npm run build:linux)
    ↓
上传构建产物
    ↓
如果是版本标签 → 自动创建 GitHub Release
```

## 使用方法

### 方法 1：推送到主分支（自动构建）

```bash
# 1. 首次推送
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/pinkisir/agrismart-electron.git
git push -u origin main

# 如果已经添加过 origin，使用下面两行替代 remote add origin
git remote set-url origin https://github.com/pinkisir/agrismart-electron.git
git push -u origin main

# 2. 在 GitHub Actions 页面查看构建进度
# https://github.com/pinkisir/agrismart-electron/actions
```

### 方法 2：创建版本标签（自动构建 + 发布）

```bash
# 1. 创建并推送版本标签
git tag v0.1.0
git push origin v0.1.0

# 2. 构建完成后会自动创建 GitHub Release
# 可以在 Releases 页面下载 .deb 包
# https://github.com/pinkisir/agrismart-electron/releases
```

### 方法 3：手动触发构建

1. 打开 GitHub 仓库页面
2. 点击 **Actions** 标签
3. 选择 **Build ARM64 Deb Package** 工作流
4. 点击 **Run workflow** 按钮
5. 选择分支，点击绿色按钮
6. 等待构建完成

## 查看构建结果

### 1. 查看构建日志

- 访问：`https://github.com/pinkisir/agrismart-electron/actions`
- 点击具体的工作流运行记录
- 查看每个步骤的详细日志

### 2. 下载构建产物

**普通提交（Artifact）：**

1. 打开工作流运行记录
2. 滚动到页面底部
3. 点击 **Artifacts** 区域的 `agrismart-arm64-deb`
4. 下载 zip 文件，解压后得到 .deb 包
5. ⚠️ Artifact 保留 30 天

**版本标签（Release）：**

1. 访问：`https://github.com/pinkisir/agrismart-electron/releases`
2. 找到对应的版本
3. 直接下载 .deb 包
4. ✅ Release 永久保存

## 构建产物

成功构建后会生成：

- `agrismart_0.1.0_arm64.deb` - Ubuntu/Debian ARM64 安装包

## 常见问题

### Q: 构建失败怎么办？

1. 查看 Actions 日志，找到错误信息
2. 常见错误：
   - **依赖安装失败**：检查网络连接或镜像源
   - **打包失败**：检查 package.json 配置
   - **权限错误**：确保仓库设置允许 Actions

### Q: 如何配置国内镜像源？

修改工作流文件，在安装依赖前添加：

```yaml
- name: Configure npm mirror
  run: |
    npm config set registry https://registry.npmmirror.com
    export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
```

### Q: 如何同时构建多个架构？

修改 `build.yml`，使用矩阵策略：

```yaml
jobs:
  build:
    strategy:
      matrix:
        arch: [arm64, amd64]
    runs-on: ubuntu-latest

    steps:
      - name: Build
        run: npm run build:linux -- --${{ matrix.arch }}
```

### Q: 如何添加代码签名？

1. 在仓库 Settings → Secrets 中添加：
   - `CSC_LINK` - 证书文件（base64 编码）
   - `CSC_KEY_PASSWORD` - 证书密码

2. 取消 `build.yml` 中注释的配置

## 自定义工作流

### 添加测试步骤

```yaml
- name: Run Tests
  run: npm test
```

### 添加通知

```yaml
- name: Notify on Failure
  if: failure()
  uses: actions/github-script@v6
  with:
    script: |
      github.rest.issues.create({
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: '构建失败',
        body: `构建失败，请查看日志：${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`
      })
```

### 定时构建

```yaml
on:
  schedule:
    - cron: "0 0 * * 1" # 每周一凌晨构建
```

## 费用说明

- **公开仓库**：完全免费，每月 2000 分钟
- **私有仓库**：免费额度 500 MB 存储，2000 分钟/月
- **超出额度**：按量计费（通常个人项目足够使用）

## 下一步

1. ✅ 将代码推送到 GitHub
2. ✅ 打开 Actions 标签查看构建
3. ✅ 创建版本标签自动发布
4. ✅ 下载 .deb 包安装使用

## 相关资源

- [GitHub Actions 官方文档](https://docs.github.com/cn/actions)
- [electron-builder 文档](https://www.electron.build/)
- [工作流语法参考](https://docs.github.com/cn/actions/using-workflows/workflow-syntax-for-github-actions)
