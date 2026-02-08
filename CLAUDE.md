# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Ionic + Vue 3 + TypeScript + Vite 的工具箱应用（ToolBox）。

## 常用命令

### 开发
```bash
pnpm dev              # 启动开发服务器 (http://localhost:5173)
```

### 构建
```bash
pnpm build            # 构建（包含 TypeScript 类型检查）
```

### 测试
```bash
pnpm test:unit        # 运行单元测试 (Vitest)
pnpm test:e2e         # 运行端到端测试 (Cypress)
```

### 代码质量
```bash
pnpm lint             # 运行 ESLint
```

### 预览
```bash
pnpm preview          # 预览生产构建
```

## 架构概述

### 技术栈
- **框架**: Vue 3 (Composition API)
- **UI 库**: Ionic Framework 8
- **路由**: Vue Router 4 (集成 @ionic/vue-router)
- **构建工具**: Vite 5
- **语言**: TypeScript 5.9
- **测试**: Vitest (单元测试) + Cypress (E2E 测试)
- **代码规范**: ESLint

### 项目结构
```
src/
├── main.ts           # 应用入口，集成 Ionic 插件和主题
├── App.vue           # 根组件，包含 IonRouterOutlet
├── router/
│   └── index.ts      # 路由配置，使用 tabs 布局
├── views/            # 页面组件
│   ├── TabsPage.vue  # 标签页容器
│   └── Tab[1-3]Page.vue  # 各个标签页内容
├── components/       # 可复用组件
└── theme/            # Ionic 主题变量

tests/
├── unit/             # Vitest 单元测试
└── e2e/              # Cypress E2E 测试
    ├── specs/        # 测试规范文件
    └── support/      # Cypress 配置和辅助文件
```

### 路由结构
应用使用基于 Tabs 的导航模式：
- `/` → 重定向到 `/tabs/tab1`
- `/tabs/` → TabsPage 容器
  - `/tabs/tab1` → Tab1Page
  - `/tabs/tab2` → Tab2Page
  - `/tabs/tab3` → Tab3Page

### Ionic 集成要点
- 使用 `IonicVue` 插件集成 Ionic 组件
- 导入 Ionic 核心 CSS 和主题样式
- 暗色模式配置为跟随系统 (`@ionic/vue/css/palettes/dark.system.css`)
- 使用 `@/` 别名指向 `src` 目录

### 开发注意事项
- 路径别名 `@/*` 已在 `tsconfig.json` 和 `vite.config.ts` 中配置
- 构建前会自动运行 `vue-tsc` 进行类型检查
- 使用 `@vue/test-utils` 进行单元测试
- Cypress E2E 测试运行在 `http://localhost:5173`
