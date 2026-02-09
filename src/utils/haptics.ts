import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export async function hapticsImpactLight(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  await Haptics.impact({ style: ImpactStyle.Light });
}

export async function hapticsImpactMedium(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  await Haptics.impact({ style: ImpactStyle.Medium });
}

export async function hapticsNotification(type: NotificationType = NotificationType.Success): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  await Haptics.notification({ type });
}

export async function hapticsSelectionChanged(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  await Haptics.selectionChanged();
}
