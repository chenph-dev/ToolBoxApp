import {
  calculatorOutline,
  swapHorizontalOutline,
  qrCodeOutline,
  codeSlashOutline,
  lockClosedOutline,
  colorPaletteOutline,
  documentTextOutline,
  linkOutline,
  timeOutline,
  scanOutline,
  flashlightOutline,
  compassOutline,
  speedometerOutline,
  micOutline,
  phonePortraitOutline,
  resizeOutline,
  fitnessOutline,
} from 'ionicons/icons';

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  category: 'daily' | 'dev';
}

export const tools: ToolItem[] = [
  // Daily Tools
  {
    id: 'calculator',
    name: '计算器',
    description: '基础四则运算计算器',
    icon: calculatorOutline,
    route: '/tools/calculator',
    category: 'daily',
  },
  {
    id: 'unit-converter',
    name: '单位转换',
    description: '长度、重量、温度换算',
    icon: swapHorizontalOutline,
    route: '/tools/unit-converter',
    category: 'daily',
  },
  {
    id: 'qrcode-generator',
    name: '二维码生成',
    description: '从文本生成二维码',
    icon: qrCodeOutline,
    route: '/tools/qrcode-generator',
    category: 'daily',
  },
  {
    id: 'password-generator',
    name: '密码生成器',
    description: '生成安全随机密码',
    icon: lockClosedOutline,
    route: '/tools/password-generator',
    category: 'daily',
  },
  {
    id: 'color-picker',
    name: '颜色选择器',
    description: 'HEX / RGB / HSL 互转',
    icon: colorPaletteOutline,
    route: '/tools/color-picker',
    category: 'daily',
  },
  {
    id: 'qr-scanner',
    name: '扫码识别',
    description: '扫描二维码 / 条形码',
    icon: scanOutline,
    route: '/tools/qr-scanner',
    category: 'daily',
  },
  {
    id: 'flashlight',
    name: '手电筒',
    description: '手电筒 / SOS 模式',
    icon: flashlightOutline,
    route: '/tools/flashlight',
    category: 'daily',
  },
  {
    id: 'compass',
    name: '指南针',
    description: '数字罗盘方向指示',
    icon: compassOutline,
    route: '/tools/compass',
    category: 'daily',
  },
  {
    id: 'level',
    name: '水平仪',
    description: '气泡水平仪检测倾斜',
    icon: speedometerOutline,
    route: '/tools/level',
    category: 'daily',
  },
  {
    id: 'noise-meter',
    name: '噪音计',
    description: '测量环境噪音分贝',
    icon: micOutline,
    route: '/tools/noise-meter',
    category: 'daily',
  },
  {
    id: 'screen-ruler',
    name: '屏幕尺子',
    description: '屏幕上测量实际长度',
    icon: resizeOutline,
    route: '/tools/screen-ruler',
    category: 'daily',
  },
  {
    id: 'screen-brightness',
    name: '屏幕亮度',
    description: '调节屏幕亮度和自动亮度',
    icon: fitnessOutline,
    route: '/tools/screen-brightness',
    category: 'daily',
  },
  // Dev Tools
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    description: '格式化与校验 JSON',
    icon: codeSlashOutline,
    route: '/tools/json-formatter',
    category: 'dev',
  },
  {
    id: 'base64-codec',
    name: 'Base64 编解码',
    description: 'Base64 编码与解码',
    icon: documentTextOutline,
    route: '/tools/base64-codec',
    category: 'dev',
  },
  {
    id: 'url-codec',
    name: 'URL 编解码',
    description: 'URL 编码与解码',
    icon: linkOutline,
    route: '/tools/url-codec',
    category: 'dev',
  },
  {
    id: 'timestamp-converter',
    name: '时间戳转换',
    description: 'Unix 时间戳与日期互转',
    icon: timeOutline,
    route: '/tools/timestamp-converter',
    category: 'dev',
  },
  {
    id: 'device-info',
    name: '设备信息',
    description: '查看设备与网络详情',
    icon: phonePortraitOutline,
    route: '/tools/device-info',
    category: 'dev',
  },
];

export function getToolsByCategory(category: 'daily' | 'dev'): ToolItem[] {
  return tools.filter((t) => t.category === category);
}
