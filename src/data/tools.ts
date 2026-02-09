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
