<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import ProgressBar from "@/ui-next/components/party/progress-bar/ProgressBar.vue";
import { MpProgressBarPresenter } from "@/presentation/presenters/party/digimon/profile/progress-bar/mp-progress-bar.presenter";
import type { Vital } from "@/state/models";

const { mp } = defineProps<{
  mp: Vital;
}>();

const { t } = useI18n();

const progressPercentage = computed(() => {
  return MpProgressBarPresenter.getCalculatedProgressPercentage(mp.current, mp.max);
});

const barColorClass = computed(() => {
  return progressPercentage.value <= 30 ? "bg-yellow-400" : "bg-blue-600";
});
</script>

<template>
  <ProgressBar
    :current-value="mp.current"
    :max-value="mp.max"
    :progress-percentage="progressPercentage"
    :bar-color-class="barColorClass"
    transition-duration-class="duration-300"
    :label="t('digimon.mp')"
  />
</template>
