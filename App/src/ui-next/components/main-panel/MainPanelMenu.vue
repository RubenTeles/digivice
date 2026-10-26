<script setup lang="ts">
const { label } = defineProps<{
  label: string;
}>();

const emit = defineEmits<{
  previous: [];
  next: [];
}>();
</script>

<template>
  <nav class="flex items-center justify-between px-4 py-3 border-b-2 border-frame">
    <button
      type="button"
      class="bg-transparent border-0 px-1 py-0.5 leading-none hover:scale-110 transition-transform cursor-pointer"
      :title="$t('mainPanel.previousSection')"
      :aria-label="$t('mainPanel.previousSection')"
      @click="emit('previous')"
    >
      <span class="inline-flex leading-none text-[1.2rem] -translate-y-0.5">⬅️</span>
    </button>

    <span class="text-[0.7rem] uppercase tracking-widest">{{ label }}</span>

    <button
      type="button"
      class="bg-transparent border-0 px-1 py-0.5 leading-none hover:scale-110 transition-transform cursor-pointer"
      :title="$t('mainPanel.nextSection')"
      :aria-label="$t('mainPanel.nextSection')"
      @click="emit('next')"
    >
      <span class="inline-flex leading-none text-[1.2rem] -translate-y-0.5">➡️</span>
    </button>
  </nav>
</template>
