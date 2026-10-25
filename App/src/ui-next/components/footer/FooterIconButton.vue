<script setup lang="ts">
const {
  icon,
  label,
  isActive = false,
  isDisabled = false,
} = defineProps<{
  icon: string;
  label: string;
  isActive?: boolean;
  isDisabled?: boolean;
}>();

const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <button
    type="button"
    class="bg-transparent border-0 px-1 py-0.5 leading-none hover:scale-110 transition-transform cursor-pointer grayscale hover:grayscale-0 flex items-center justify-center rounded-sm disabled:opacity-50 disabled:cursor-wait"
    :class="{
      'grayscale-0 ring-2 ring-sky-50 ring-offset-1 ring-offset-surface': isActive,
    }"
    :disabled="isDisabled"
    :title="label"
    :aria-label="label"
    @click="emit('click')"
  >
    <span class="inline-flex leading-none text-[1.2rem] -translate-y-0.5">{{ icon }}</span>
  </button>
</template>
