<script setup lang="ts">
import ExperienceProgressBar from "@/ui-next/components/party/progress-bar/ExperienceProgressBar.vue";
import HpProgressBar from "@/ui-next/components/party/progress-bar/HpProgressBar.vue";
import MpProgressBar from "@/ui-next/components/party/progress-bar/MpProgressBar.vue";
import BlastProgressBar from "@/ui-next/components/party/progress-bar/BlastProgressBar.vue";
import DigievolutionsButton from "@/ui-next/components/party/DigievolutionsButton.vue";
import TrainingPoints from "@/ui-next/components/party/TrainingPoints.vue";
import type { PartyDigimonMock } from "@/ui-next/mocks/party.mock";

const { digimon } = defineProps<{
  digimon: PartyDigimonMock;
}>();
</script>

<template>
  <div class="px-2 py-4 flex flex-col gap-1">
    <ExperienceProgressBar
      :digimon-id="digimon.digimonId"
      :level="digimon.level"
      :experience="digimon.experience"
    />
    <HpProgressBar :hp="digimon.hp" />
    <MpProgressBar :mp="digimon.mp" />
    <div class="grid grid-cols-4 gap-2">
      <DigievolutionsButton />
      <TrainingPoints :tp="digimon.tp" />
      <BlastProgressBar class="col-span-2" :blast="digimon.blast" />
    </div>
  </div>
</template>
