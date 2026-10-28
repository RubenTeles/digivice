<script setup lang="ts">
import { watch } from "vue";
import Journal from "@/components/journal/Journal.vue";
import Map from "@/components/map/Map.vue";
import Footer from "@/components/footer/Footer.vue";
import Party from "@/components/party/Party.vue";
import AppHealthyScreen from "@/components/app-healthy/AppHealthyScreen.vue";
import { useAppHealthyScreen } from "@/composables/use-app-healthy-screen";
import { useGameStore } from "@/stores/use-game-store";
import { useVisitedMapsStore } from "@/stores/use-visited-maps-store";

const healthyScreen = useAppHealthyScreen();
const gameStore = useGameStore();
const visitedMapsStore = useVisitedMapsStore();

watch(
  () => gameStore.currentState?.player.mapId,
  (newMapId) => {
    if (newMapId) {
      visitedMapsStore.recordMapVisit(newMapId);
    }
  },
  { immediate: true },
);

watch(
  () => gameStore.currentState?.player.previousMapId,
  (prevMapId) => {
    if (prevMapId) {
      visitedMapsStore.recordMapVisit(prevMapId);
    }
  },
  { immediate: true },
);
</script>

<template>
  <AppHealthyScreen v-if="healthyScreen" :view-model="healthyScreen" />

  <main
    v-else
    class="h-screen min-h-0 overflow-hidden bg-transparent p-4 flex flex-col gap-4 max-w-450 mx-auto text-white"
  >
    <div class="flex-1 min-h-0 flex gap-4 overflow-hidden">
      <div class="flex-3 min-h-0 h-full overflow-hidden">
        <Party />
      </div>

      <div class="flex-1 min-w-75 min-h-0 overflow-hidden flex flex-col gap-4">
        <div class="flex-3 min-h-0 overflow-hidden flex flex-col">
          <Journal />
        </div>

        <div class="flex-2 min-h-0 overflow-hidden flex flex-col">
          <Map />
        </div>
      </div>
    </div>

    <Footer class="shrink-0" />
  </main>
</template>
