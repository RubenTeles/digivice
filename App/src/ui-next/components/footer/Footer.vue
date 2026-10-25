<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useEmulatorToggle } from "@/ui-next/composables/use-emulator-fit";

const { t } = useI18n();
const { isFitted, isFitting, toggle } = useEmulatorToggle();

const toggleLabel = computed(() => {
  return isFitted.value ? t("emulatorSlot.releaseButton") : t("emulatorSlot.fitButton");
});
</script>

<template>
  <footer class="w-full h-16 px-4 flex items-center bg-[#000a2b] border-t-2 border-[#0033aa]">
    <button
      type="button"
      class="bg-transparent border-0 px-1 py-0.5 leading-none hover:scale-110 transition-transform cursor-pointer grayscale hover:grayscale-0 flex items-center justify-center rounded-sm disabled:opacity-50 disabled:cursor-wait"
      :class="{
        'grayscale-0 ring-2 ring-orange-500 ring-offset-1 ring-offset-[#000a2b]': isFitted,
      }"
      :disabled="isFitting"
      :title="toggleLabel"
      :aria-label="toggleLabel"
      @click="toggle"
    >
      ⛶
    </button>
  </footer>
</template>
