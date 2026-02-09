import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

export interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
}

export async function shareContent(options: ShareOptions): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    await Share.share({
      title: options.title,
      text: options.text,
      url: options.url,
      dialogTitle: options.title,
    });
    return;
  }

  // Web fallback using Web Share API
  if (navigator.share) {
    await navigator.share({
      title: options.title,
      text: options.text,
      url: options.url,
    });
    return;
  }

  // Final fallback: copy to clipboard
  const text = options.text || options.url || '';
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  }
}

export async function canShare(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) return true;
  return !!navigator.share;
}
