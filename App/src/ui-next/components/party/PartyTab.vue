<script setup lang="ts">
import { computed } from "vue";
import { ImageCatalog } from "@/ui/catalogs/image.catalog";

const { name, level, isActive } = defineProps<{
  name: string;
  level: number;
  isActive: boolean;
}>();

const emit = defineEmits<{
  click: [];
}>();

const imageUrl = computed(() => {
  return ImageCatalog.getDigimonImageUrl(`${name}-healthy`);
});
</script>

<template>
  <button
    type="button"
    class="flex items-center gap-2 px-2 py-1 rounded-t border-2 border-b-0 border-frame first:border-l-0 first:rounded-tl-none last:border-r-0 last:rounded-tr-none text-[12px] text-white"
    :class="
      isActive
        ? 'flex-1 min-w-0 bg-surface -mb-0.5 pb-1.5 cursor-default'
        : 'shrink-0 bg-frame/20 cursor-pointer'
    "
    :title="name"
    :aria-label="name"
    :aria-pressed="isActive"
    @click="emit('click')"
  >
    <img v-if="imageUrl" :src="imageUrl" :alt="name" class="w-7.5 h-7.5 object-cover" />
    <span v-if="isActive">{{ name }}</span>
    <span :class="{ 'ml-auto': isActive }">{{ level }}</span>
  </button>
</template>
