<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import ProgressBar from "@/ui-next/components/party/progress-bar/ProgressBar.vue";
import { ExperienceProgressBarPresenter } from "@/presentation/presenters/party/digimon/profile/progress-bar/experience-progress-bar.presenter";

const { digimonId, level, experience } = defineProps<{
  digimonId: number;
  level: number;
  experience: number;
}>();

const { t } = useI18n();

const progressBarViewModel = computed(() => {
  return ExperienceProgressBarPresenter.getCalculatedExperienceValues(digimonId, level, experience);
});
</script>

<template>
  <ProgressBar
    :current-value="experience"
    :max-value="progressBarViewModel.maxValue"
    :progress-percentage="progressBarViewModel.percentage"
    bar-color-class="bg-linear-to-r from-orange-600 to-yellow-500"
    transition-duration-class="duration-500"
    :label="t('digimon.experience')"
  />
</template>
