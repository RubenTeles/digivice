<script setup lang="ts">
import { ref } from "vue";
import Modal from "@/ui/components/modal/Modal.vue";
import { useEmulatorCutSuspension } from "@/ui-next/composables/use-emulator-fit";

const isModalOpen = ref(false);
useEmulatorCutSuspension(isModalOpen);
</script>

<template>
  <aside class="h-full p-4 bg-[#000a2b] border-l-2 border-[#0033aa]">
    <button
      type="button"
      class="px-4 py-2 text-[0.6rem] text-white bg-[#000e3f] border-2 border-[#0077ff] cursor-pointer hover:bg-[#0033aa]"
      @click="isModalOpen = true"
    >
      Abrir modal
    </button>

    <Modal
      :is-open="isModalOpen"
      max-width="max-w-none"
      max-height="h-full"
      @close="isModalOpen = false"
    >
      <template #header>
        <span class="text-white">Modal de teste</span>
      </template>
    </Modal>
  </aside>
</template>
