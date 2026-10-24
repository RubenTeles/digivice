/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MEMORY_SNAPSHOT_URL?: string;
}

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
