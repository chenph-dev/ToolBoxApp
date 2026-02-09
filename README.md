# ToolBox - 移动端多功能工具箱

一个基于 Ionic + Vue 3 + TypeScript + Vite 构建的跨平台移动端工具箱应用，提供丰富的实用工具功能。

## 🚀 项目特色

- **跨平台支持**: 同时支持 Web 和原生 Android 应用
- **丰富工具**: 内置 15+ 种实用工具，涵盖日常和开发需求
- **原生功能**: 充分利用 Capacitor 原生插件，访问设备传感器和功能
- **响应式设计**: 适配各种屏幕尺寸，提供优秀的用户体验
- **现代化技术栈**: 采用最新的 Vue 3、TypeScript 和 Ionic 8

## 📱 核心功能

### 日常工具
- **计算器**: 基础四则运算计算器
- **单位转换**: 长度、重量、温度换算
- **二维码生成/扫描**: 文本转二维码，扫码识别
- **密码生成器**: 生成安全随机密码
- **颜色选择器**: HEX/RGB/HSL 颜色互转
- **Base64 编解码**: 字符串编码解码
- **URL 编解码**: URL 编码解码
- **时间戳转换**: Unix 时间戳与日期互转
- **手电筒**: 支持常亮、SOS、频闪模式
- **指南针**: 数字罗盘方向指示
- **水平仪**: 气泡水平仪检测倾斜
- **噪音计**: 测量环境噪音分贝
- **屏幕尺子**: 屏幕上测量实际长度
- **设备信息**: 查看设备与网络详情
- **屏幕亮度**: 调节屏幕亮度和自动亮度

### 开发工具
- **JSON 格式化**: 格式化与校验 JSON
- **二维码生成**: 从文本生成二维码

## 🛠 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | Vue 3 (Composition API) |
| **UI 库** | Ionic Framework 8 |
| **路由** | Vue Router 4 |
| **构建工具** | Vite 5 |
| **语言** | TypeScript 5.9 |
| **原生打包** | Capacitor 8 |
| **包管理器** | pnpm |

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm 8+

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看应用。

## 📦 构建

### Web 构建

```bash
pnpm build
```

构建产物位于 `dist/` 目录，可直接部署到 Web 服务器。

### Android APK 构建

```bash
# 完整构建（构建 web + 同步到 Android）
pnpm android:build

# 打开 Android Studio
pnpm android:open
```

在 Android Studio 中：
1. 等待 Gradle 同步完成
2. 点击 `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`

**前置要求：**
- 安装 [Android Studio](https://developer.android.com/studio)
- 配置 Android SDK 和构建工具

### 代码更新后

```bash
pnpm android:build    # 重新构建并同步
```

## 🧪 测试

```bash
# 单元测试
pnpm test:unit

# E2E 测试
pnpm test:e2e
```

## 💻 代码规范

```bash
pnpm lint
```

## 📂 项目结构

```
src/
├── main.ts           # 应用入口
├── App.vue           # 根组件
├── router/           # 路由配置
├── views/            # 页面组件
├── components/       # 可复用组件
├── utils/            # 工具函数
└── theme/            # Ionic 主题
```

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 License

MIT License

## 🙏 致谢

- [Ionic Framework](https://ionicframework.com/)
- [Vue.js](https://vuejs.org/)
- [Capacitor](https://capacitorjs.com/)
