/**
 * Centralized Application Configuration
 */

export const AppConfig = {
  backend: {
    hubPath: "/gamehub",
  },
  memory: {
    mode: import.meta.env.VITE_MEMORY_MODE,
    snapshotUrl: import.meta.env.VITE_MEMORY_SNAPSHOT_URL,
    pollingIntervalMs: 500,
    divergenceThreshold: 3,
  },
  // Simple check to see if we are running inside Tauri
  isTauri: !!(window as any).__TAURI_INTERNALS__,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};
