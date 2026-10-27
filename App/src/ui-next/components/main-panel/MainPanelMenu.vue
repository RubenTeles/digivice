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
  <nav class="h-12 flex items-center justify-between px-4">
    <button
      type="button"
      class="bg-transparent border-0 px-1 py-0.5 leading-none hover:scale-110 transition-transform cursor-pointer"
      :title="$t('mainPanel.previousSection')"
      :aria-label="$t('mainPanel.previousSection')"
      @click="emit('previous')"
    >
      <span class="inline-flex leading-none text-[25px] -translate-y-0.5 font-emoji text-white">&#x2B05;</span>
    </button>

    <span class="text-[16px] leading-none whitespace-nowrap uppercase tracking-widest">{{ label }}</span>

    <button
      type="button"
      class="bg-transparent border-0 px-1 py-0.5 leading-none hover:scale-110 transition-transform cursor-pointer"
      :title="$t('mainPanel.nextSection')"
      :aria-label="$t('mainPanel.nextSection')"
      @click="emit('next')"
    >
      <span class="inline-flex leading-none text-[25px] -translate-y-0.5 font-emoji text-white">&#x27A1;</span>
    </button>
  </nav>
</template>
