<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import MainPanelMenu from "@/ui-next/components/main-panel/MainPanelMenu.vue";
import { useMainPanelSection } from "@/ui-next/composables/use-main-panel-section";

const { t } = useI18n();
const { activeSection, showPrevious, showNext } = useMainPanelSection();

const sectionLabel = computed(() => {
  return t(`mainPanel.sections.${activeSection.value}`);
});
</script>

<template>
  <aside class="h-full flex flex-col bg-surface border-l-2 border-frame">
    <MainPanelMenu :label="sectionLabel" @previous="showPrevious" @next="showNext" />
    <section class="flex-1 min-h-0 overflow-y-auto"></section>
  </aside>
</template>
