<script setup lang="ts">
import { useTemplateRef } from "vue";
import { useEmulatorSlot } from "@/ui-next/composables/use-emulator-fit";

const slotElement = useTemplateRef<HTMLElement>("slotElement");
const { errorCode } = useEmulatorSlot(slotElement);
</script>

<template>
  <section
    ref="slotElement"
    class="flex flex-col items-center justify-center p-8 bg-[#000a2b] border-2 border-dashed border-[#00aaff] text-center"
  >
    <p v-if="errorCode" class="max-w-md text-[0.6rem] leading-relaxed text-red-400">
      {{ $t(`emulatorSlot.errors.${errorCode}`) }}
    </p>
  </section>
</template>
