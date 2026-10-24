/**
 * Centralized Application Configuration
 */

export const AppConfig = {
  memory: {
    snapshotUrl: import.meta.env.VITE_MEMORY_SNAPSHOT_URL,
    pollingIntervalMs: 500,
  },
  // Simple check to see if we are running inside Tauri
  isTauri: !!(window as any).__TAURI_INTERNALS__,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};
