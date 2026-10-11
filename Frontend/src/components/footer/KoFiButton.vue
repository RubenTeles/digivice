<script setup lang="ts">
import { open } from "@tauri-apps/plugin-shell";
import { AppConfig } from "@/config";
import koFiIcon from "@/assets/others/ko-fi.png";

const KoFiUrl = "https://ko-fi.com/R5R028MD8Y";

const emit = defineEmits<{
  (e: "show-tooltip", event: MouseEvent): void;
  (e: "move-tooltip", event: MouseEvent): void;
  (e: "hide-tooltip"): void;
}>();

async function onClick(): Promise<void> {
  if (AppConfig.isTauri) {
    await open(KoFiUrl);
    return;
  }
  window.open(KoFiUrl, "_blank", "noopener,noreferrer");
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
    class="bg-transparent border-0 px-1 py-0.5 leading-none hover:scale-110 transition-transform cursor-pointer flex items-center justify-center"
    @click="onClick"
    @mouseenter="onMouseEnter"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <img :src="koFiIcon" alt="Ko-fi" class="h-5 w-auto block" />
  </button>
</template>
