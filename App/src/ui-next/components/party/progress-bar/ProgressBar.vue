<script setup lang="ts">
const {
  currentValue,
  maxValue,
  progressPercentage,
  barColorClass,
  transitionDurationClass,
  label,
  borderColorClass = "border-frame-dark",
  fillExtraClass = "",
  trackExtraClass = "",
} = defineProps<{
  currentValue: number;
  maxValue: number;
  progressPercentage: number;
  barColorClass: string;
  transitionDurationClass: string;
  label: string;
  borderColorClass?: string;
  fillExtraClass?: string;
  trackExtraClass?: string;
}>();
</script>

<template>
  <div
    class="relative w-full h-6 bg-track rounded overflow-hidden shadow-inner flex items-center justify-center border-2 font-chakra-petch cursor-help"
    :class="[borderColorClass, trackExtraClass]"
    :title="label"
  >
    <div
      class="absolute left-0 top-0 h-full transition-all"
      :class="[barColorClass, transitionDurationClass, fillExtraClass]"
      :style="{ width: `${progressPercentage}%` }"
    ></div>

    <span
      class="relative z-10 text-[12px] font-bold text-white text-outline-black px-1 tracking-wider"
    >
      {{ `${currentValue} / ${maxValue}` }}
    </span>
  </div>
</template>
