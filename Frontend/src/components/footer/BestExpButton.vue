<script setup lang="ts">
import { ref } from "vue";
import ExpGrindModal from "@/components/exp-grind-modal/ExpGrindModal.vue";

const emit = defineEmits<{
  (e: "show-tooltip", event: MouseEvent): void;
  (e: "move-tooltip", event: MouseEvent): void;
  (e: "hide-tooltip"): void;
}>();

const isExpModalOpen = ref(false);

function onClick(): void {
  isExpModalOpen.value = true;
}

function closeExpModal(): void {
  isExpModalOpen.value = false;
}

function onMouseEnter(event: MouseEvent): void {
  emit("show-tooltip", event);
}

function onMouseMove(event: MouseEvent): void {
  emit("move-tooltip", event);
}

function onMouseLeave(): void {
  emit("hide-tooltip");
}
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center justify-center leading-none text-[1.2rem] -translate-y-px cursor-pointer hover:opacity-100 opacity-90 transition-opacity text-amber-400 hover:scale-110 active:scale-95 duration-150"
    title=""
    @click="onClick"
    @mouseenter="onMouseEnter"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    ⚡
  </button>

  <ExpGrindModal :is-open="isExpModalOpen" @close="closeExpModal" />
</template>
