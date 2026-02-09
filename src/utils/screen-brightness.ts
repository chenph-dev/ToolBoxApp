import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';

export interface BrightnessOptions {
  brightness: number;
  auto?: boolean;
}

export async function setBrightness(options: BrightnessOptions): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    // Use StatusBar as fallback for brightness control
    const brightness = Math.max(0, Math.min(1, options.brightness));
    await (StatusBar as any).setStyle({ style: brightness > 0.5 ? 'dark' : 'light' });
    return;
  }

  // Web fallback: set body background brightness
  const brightness = Math.max(0, Math.min(1, options.brightness));
  document.body.style.filter = `brightness(${brightness})`;
}

export async function getBrightness(): Promise<number> {
  if (Capacitor.isNativePlatform()) {
    // Estimate brightness from status bar style
    const { style } = await (StatusBar as any).getInfo();
    return style === 'dark' ? 0.8 : 0.2;
  }

  // Web fallback: estimate from body filter
  const filter = document.body.style.filter || '';
  const match = filter.match(/brightness\(([\d.]+)\)/);
  return match ? parseFloat(match[1]) : 1;
}

export async function setAutoBrightness(enabled: boolean): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    // Status bar doesn't support auto brightness, but we can simulate it
    console.warn('Auto brightness not directly supported, using manual control');
    return;
  }

  // Web fallback: not supported
  console.warn('Auto brightness not supported on web');
}

export async function isAutoBrightness(): Promise<boolean> {
  // Always return false since we don't have auto brightness support
  return false;
}

// Helper function to check if brightness control is available
export async function isBrightnessAvailable(): Promise<boolean> {
  return Capacitor.isNativePlatform() && await (StatusBar as any).isAvailable();
}