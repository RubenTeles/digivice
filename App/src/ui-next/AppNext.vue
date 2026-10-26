<script setup lang="ts">
import EmulatorSlot from "@/ui-next/components/emulator-slot/EmulatorSlot.vue";
import MainPanel from "@/ui-next/components/main-panel/MainPanel.vue";
import Footer from "@/ui-next/components/footer/Footer.vue";
import { useServerThemeRoot } from "@/ui-next/composables/use-server-theme";

useServerThemeRoot();
</script>

<template>
  <main class="h-screen overflow-hidden flex flex-col text-white">
    <div class="flex-1 min-h-0 flex">
      <EmulatorSlot class="h-full aspect-4/3 shrink-0" />
      <MainPanel class="flex-1 min-w-0" />
    </div>

    <Footer class="shrink-0" />
  </main>
</template>
