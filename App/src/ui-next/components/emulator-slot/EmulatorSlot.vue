<script setup lang="ts">
import { useTemplateRef } from "vue";
import { useEmulatorFit } from "@/ui-next/composables/use-emulator-fit";

const slotElement = useTemplateRef<HTMLElement>("slotElement");
const { fit, errorCode, isFitting } = useEmulatorFit(slotElement);
</script>

<template>
  <section
    ref="slotElement"
    class="flex flex-col items-center justify-center gap-4 p-8 bg-[#000a2b] border-2 border-dashed border-[#00aaff] text-center"
  >
    <h2 class="text-sm text-[#00aaff] shadow-text">{{ $t("emulatorSlot.title") }}</h2>
    <p class="max-w-md text-[0.6rem] leading-relaxed text-blue-300">
      {{ $t("emulatorSlot.hint") }}
    </p>

    <button
      type="button"
      class="mt-2 px-4 py-3 text-[0.6rem] text-white bg-[#000e3f] border-2 border-[#0077ff] cursor-pointer hover:bg-[#0033aa] disabled:opacity-50 disabled:cursor-wait"
      :disabled="isFitting"
      @click="fit"
    >
      {{ $t("emulatorSlot.fitButton") }}
    </button>

    <p v-if="errorCode" class="max-w-md text-[0.6rem] leading-relaxed text-red-400">
      {{ $t(`emulatorSlot.errors.${errorCode}`) }}
    </p>
  </section>
</template>
