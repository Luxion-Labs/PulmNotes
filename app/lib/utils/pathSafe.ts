import { appDataDir, join } from '@tauri-apps/api/path';

export async function safeJoinAppData(...segments: string[]): Promise<string> {
  const appData = await appDataDir();
  return await join(appData, ...segments);
}

export async function safeJoin(...segments: string[]): Promise<string> {
  return await join(...segments);
}
