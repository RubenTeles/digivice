<script setup lang="ts">
import EmulatorSlot from "@/ui-next/components/emulator-slot/EmulatorSlot.vue";
import SidePanel from "@/ui-next/components/side-panel/SidePanel.vue";
import Footer from "@/ui-next/components/footer/Footer.vue";
</script>

<template>
  <main class="h-screen overflow-hidden flex flex-col text-white">
    <div class="flex-1 min-h-0 flex">
      <EmulatorSlot class="h-full aspect-4/3 shrink-0" />
      <SidePanel class="flex-1 min-w-0" />
    </div>

    <Footer class="shrink-0" />
  </main>
</template>
