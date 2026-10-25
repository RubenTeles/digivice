<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import App from "@/App.vue";
import AppNext from "@/ui-next/AppNext.vue";
import { useBootLoader } from "@/ui/composables/use-boot-loader";
import { useUiSwitcher } from "@/ui-next/composables/use-ui-switcher";

const { isNextActive, isHealthy } = useUiSwitcher();
useBootLoader();

// App.vue mounts its own monitor; this one only covers the new screen.
const DebugMonitor = defineAsyncComponent(
  () => import("@/ui/components/debug-monitor/DebugMonitor.vue"),
);
</script>

<template>
  <template v-if="isNextActive">
    <AppNext v-if="isHealthy" />
    <DebugMonitor />
  </template>

  <App v-else />
</template>
