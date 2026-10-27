<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import ProgressBar from "@/ui-next/components/party/progress-bar/ProgressBar.vue";
import { HpProgressBarPresenter } from "@/presentation/presenters/party/digimon/profile/progress-bar/hp-progress-bar.presenter";
import type { Vital } from "@/state/models";

const { hp } = defineProps<{
  hp: Vital;
}>();

const { t } = useI18n();

const progressPercentage = computed(() => {
  return HpProgressBarPresenter.getCalculatedProgressPercentage(hp.current, hp.max);
});

const barColorClass = computed(() => {
  return progressPercentage.value <= 30 ? "bg-red-500" : "bg-green-500";
});
</script>

<template>
  <ProgressBar
    :current-value="hp.current"
    :max-value="hp.max"
    :progress-percentage="progressPercentage"
    :bar-color-class="barColorClass"
    transition-duration-class="duration-300"
    :label="t('digimon.hp')"
  />
</template>
