<script setup lang="ts">
import type { EnemyResumedViewModel } from "@/presentation/viewmodels/enemy/enemy-resumed.viewmodel";

const { icon, enemies } = defineProps<{
  icon: string;
  enemies: EnemyResumedViewModel[];
}>();
</script>

<template>
  <div class="max-w-full flex items-center justify-center gap-1.5">
    <span class="w-5 shrink-0 flex justify-center text-[14px] leading-none font-emoji text-white">
      {{ icon }}
    </span>
    <div
      class="min-w-0 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-[10px] leading-none font-bold tracking-wide"
    >
      <template v-for="(enemy, index) in enemies" :key="enemy.id">
        <span v-if="index > 0" class="text-white/50 shadow-text">·</span>
        <span class="text-red-400 shadow-text">{{ enemy.name }}</span>
      </template>
    </div>
  </div>
</template>
