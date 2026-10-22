/**
 * Centralized Application Configuration
 */

export const AppConfig = {
  backend: {
    defaultPort: 5000,
    hubPath: "/gamehub",
    // Helper to get the absolute fallback URL
    get fallbackUrl() {
      return `http://localhost:${this.defaultPort}${this.hubPath}`;
    },
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
