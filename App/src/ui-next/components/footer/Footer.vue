<script setup lang="ts">
import { useEmulatorRelease } from "@/ui-next/composables/use-emulator-fit";

const { isFitted, release } = useEmulatorRelease();
</script>

<template>
  <footer class="w-full h-16 px-4 flex items-center bg-[#000a2b] border-t-2 border-[#0033aa]">
    <button
      v-if="isFitted"
      type="button"
      class="px-4 py-2 text-[0.6rem] text-white bg-[#000e3f] border-2 border-[#0077ff] cursor-pointer hover:bg-[#0033aa]"
      @click="release"
    >
      {{ $t("emulatorSlot.releaseButton") }}
    </button>
  </footer>
</template>
