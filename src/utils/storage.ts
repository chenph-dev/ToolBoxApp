import { Preferences } from '@capacitor/preferences';

export async function setItem(key: string, value: unknown): Promise<void> {
  await Preferences.set({ key, value: JSON.stringify(value) });
}

export async function getItem<T>(key: string): Promise<T | null> {
  const { value } = await Preferences.get({ key });
  if (value === null) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function removeItem(key: string): Promise<void> {
  await Preferences.remove({ key });
}
