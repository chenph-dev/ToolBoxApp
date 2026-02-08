# ToolBox

基于 Ionic + Vue 3 + TypeScript + Vite 构建的移动端工具箱应用。

## 技术栈

- **框架**: Vue 3 (Composition API)
- **UI 库**: Ionic Framework 8
- **路由**: Vue Router 4
- **构建工具**: Vite 5
- **语言**: TypeScript 5.9
- **原生打包**: Capacitor 8

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发

```bash
pnpm dev
```

访问 http://localhost:5173 查看应用。

## 构建

### Web 构建

```bash
pnpm build
```

构建产物位于 `dist/` 目录。

### Android APK 构建

```bash
# 完整构建（构建 web + 同步到 Android）
pnpm android:build

# 打开 Android Studio
pnpm android:open
```

在 Android Studio 中：
- 等待 Gradle 同步完成
- 点击 `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`

**前置要求：**
- 安装 [Android Studio](https://developer.android.com/studio)
- 配置 Android SDK 和构建工具

### 代码更新后

```bash
pnpm android:build    # 重新构建并同步
```

## 测试

```bash
# 单元测试
pnpm test:unit

# E2E 测试
pnpm test:e2e
```

## 代码规范

```bash
pnpm lint
```

## 项目结构

```
src/
├── main.ts           # 应用入口
├── App.vue           # 根组件
├── router/           # 路由配置
├── views/            # 页面组件
├── components/       # 可复用组件
└── theme/            # Ionic 主题

tests/
├── unit/             # 单元测试
└── e2e/              # E2E 测试
```

## License

MIT
