<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import ProgressBar from "@/ui-next/components/party/progress-bar/ProgressBar.vue";
import { DigievolutionPresenter } from "@/presentation/presenters/digievolution/digievolution.presenter";
import type { DigievolutionTier } from "@/shared/types/digievolution-tier.type";
import type { PartyDigievolutionSlotMock } from "@/ui-next/mocks/party.mock";

const { digievolution, isActive } = defineProps<{
  digievolution: PartyDigievolutionSlotMock;
  isActive: boolean;
}>();

const { t } = useI18n();

const TierBackgroundClasses = {
  1: "bg-gray-700",
  2: "bg-green-800",
  3: "bg-blue-800",
  4: "bg-purple-800",
  5: "bg-amber-700",
} as const satisfies Record<DigievolutionTier, string>;

const name = computed(() => {
  if (digievolution === null) {
    return "";
  }

  return DigievolutionPresenter.getNameById(digievolution.digievolutionId);
});

const backgroundClass = computed(() => {
  if (digievolution === null) {
    return "bg-track";
  }

  return TierBackgroundClasses[DigievolutionPresenter.getTierById(digievolution.digievolutionId)];
});
</script>

<template>
  <div class="relative h-14 text-white dw3-beveled">
    <div class="absolute inset-0 bg-frame-dark dw3-beveled pointer-events-none"></div>
    <div
      class="absolute inset-[1.5px] dw3-beveled pointer-events-none"
      :class="backgroundClass"
    ></div>

    <div class="relative z-10 h-full px-2 py-0.5 flex flex-col justify-center gap-[5px]">
      <template v-if="digievolution">
        <div
          class="flex items-center gap-1.5 text-[12px] leading-none"
          :class="isActive ? 'text-dw3-gold shadow-text-dark' : 'shadow-text'"
        >
          <span class="min-w-0 truncate">{{ name }}</span>
          <span
            v-if="digievolution.isDnaActive"
            class="shrink-0 text-[14px] font-emoji text-red-400"
          >
            &#x1F534;
          </span>
          <span class="ml-auto shrink-0">{{ digievolution.level }}</span>
        </div>

        <ProgressBar
          :current-value="digievolution.dvexpInLevel"
          :max-value="digievolution.dvexpPerLevel"
          :progress-percentage="(digievolution.dvexpInLevel / digievolution.dvexpPerLevel) * 100"
          bar-color-class="bg-blue-400"
          transition-duration-class="duration-500"
          height-class="h-5"
          text-size-class="text-[10px]"
          :label="t('digimon.dvexp')"
        />
      </template>

      <span v-else class="text-center text-[12px] leading-none text-white/60">
        {{ t("digimon.states.empty") }}
      </span>
    </div>
  </div>
</template>
