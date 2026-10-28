<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Modal from "@/components/modal/Modal.vue";
import WikiModal from "@/components/wiki-modal/WikiModal.vue";
import ExpEnemyRow from "@/components/exp-grind-modal/ExpEnemyRow.vue";
import ExpEnemyCard from "@/components/exp-grind-modal/ExpEnemyCard.vue";
import ExpCharacterRow from "@/components/exp-grind-modal/ExpCharacterRow.vue";
import ExpCharacterCard from "@/components/exp-grind-modal/ExpCharacterCard.vue";
import { useGameState } from "@/composables/use-game-state";
import { useVisitedMapsStore } from "@/stores/use-visited-maps-store";
import { ExpGrindPresenter } from "@/presenters/exp-grind/exp-grind.presenter";
import type {
  ExpCharacterBattleViewModel,
  ExpEnemyViewModel,
} from "@/viewmodels/exp-grind/exp-grind.viewmodel";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const gameState = useGameState();
const visitedMapsStore = useVisitedMapsStore();

// 1. Two Primary Categories on the Left: Digimons vs NPCs
type MainCategory = "monsters" | "npcs";
const activeCategory = ref<MainCategory>("monsters");

// Sub-navigation for Digimons: Mapa Atual, Mapas Visitados, Bosses Disponíveis, Próximos Bosses
type MonsterSubTab = "currentMap" | "visitedMaps" | "availableBosses" | "upcomingBosses";
const monsterSubTab = ref<MonsterSubTab>("currentMap");

// Sub-navigation for NPCs: Disponíveis vs Próximos
type NpcSubTab = "available" | "upcoming";
const npcSubTab = ref<NpcSubTab>("available");

// View Mode (Lista / Cards)
type ViewMode = "list" | "cards";
const viewMode = ref<ViewMode>("list");

// Sorting Options
type SortOption = "charismaAsc" | "exp" | "efficiency" | "dvexp" | "bits" | "bitsEfficiency";
const sortBy = ref<SortOption>("exp");

// Filters for NPCs Disponíveis
type AvailableStatusFilter = "all" | "ready" | "charismaExceeded";
const availableStatusFilter = ref<AvailableStatusFilter>("all");

// Filters for NPCs Próximos
type UpcomingStatusFilter = "all" | "missingCharisma" | "missingTrophy";
const upcomingStatusFilter = ref<UpcomingStatusFilter>("all");

// Common Battle Kind filter for NPCs (Todos / Digimon / Cartas)
type NpcKindFilter = "all" | "digimon" | "card";
const npcKindFilter = ref<NpcKindFilter>("all");

// Common Map filter for NPCs
type NpcMapFilter = "all" | "currentMap" | "visitedMaps";
const npcMapFilter = ref<NpcMapFilter>("all");

const mapViewModel = computed(() => {
  return ExpGrindPresenter.getViewModel(gameState.value, visitedMapsStore.visitedMapIds);
});

// If modal opens in safe zone, default to visited maps if available
watch(
  () => props.isOpen,
  (open) => {
    if (open && mapViewModel.value.isSafeZone && mapViewModel.value.visitedMapsEnemies.length > 0) {
      monsterSubTab.value = "visitedMaps";
    }
  },
);

// Automatic sort adjustment: when entering Upcoming NPCs, default to Menor Carisma (ascending)
watch(
  [activeCategory, npcSubTab],
  ([category, subTab]) => {
    if (category === "npcs" && subTab === "upcoming") {
      sortBy.value = "charismaAsc";
    } else if (sortBy.value === "charismaAsc") {
      sortBy.value = "exp";
    }
  },
);

function sortEnemyList(list: ExpEnemyViewModel[]): ExpEnemyViewModel[] {
  const copy = [...list];
  if (sortBy.value === "efficiency") {
    return copy.sort((a, b) => b.efficiency - a.efficiency);
  }
  if (sortBy.value === "dvexp") {
    return copy.sort((a, b) => b.dvexp - a.dvexp);
  }
  if (sortBy.value === "bits") {
    return copy.sort((a, b) => b.bits - a.bits);
  }
  if (sortBy.value === "bitsEfficiency") {
    return copy.sort((a, b) => b.bitsEfficiency - a.bitsEfficiency);
  }
  return copy.sort((a, b) => b.exp - a.exp);
}

function sortCharacterList(list: ExpCharacterBattleViewModel[]): ExpCharacterBattleViewModel[] {
  const copy = [...list];
  if (sortBy.value === "charismaAsc") {
    return copy.sort((a, b) => {
      if (a.charismaMin !== b.charismaMin) {
        return a.charismaMin - b.charismaMin;
      }
      return b.exp - a.exp;
    });
  }
  if (sortBy.value === "efficiency") {
    return copy.sort((a, b) => b.efficiency - a.efficiency);
  }
  if (sortBy.value === "dvexp") {
    return copy.sort((a, b) => b.dvexp - a.dvexp);
  }
  if (sortBy.value === "bits") {
    return copy.sort((a, b) => b.bits - a.bits);
  }
  if (sortBy.value === "bitsEfficiency") {
    return copy.sort((a, b) => b.bitsEfficiency - a.bitsEfficiency);
  }
  return copy.sort((a, b) => b.exp - a.exp);
}

// 1. Digimon lists
const sortedCurrentEnemies = computed(() => {
  return sortEnemyList(mapViewModel.value.currentMapEnemies);
});

const sortedVisitedEnemies = computed(() => {
  return sortEnemyList(mapViewModel.value.visitedMapsEnemies);
});

// Boss lists
const sortedAvailableBosses = computed(() => {
  return sortEnemyList(mapViewModel.value.availableBosses);
});

const sortedUpcomingBosses = computed(() => {
  return sortEnemyList(mapViewModel.value.upcomingBosses);
});

// 2. NPCs Disponíveis lists
const filteredAvailableNpcs = computed(() => {
  let list = mapViewModel.value.characterBattles;

  if (availableStatusFilter.value === "ready") {
    list = list.filter((c) => c.status === "available");
  } else if (availableStatusFilter.value === "charismaExceeded") {
    list = list.filter((c) => c.status === "charismaExceeded");
  }

  if (npcKindFilter.value === "digimon") {
    list = list.filter((c) => c.battleKind === "digimon");
  } else if (npcKindFilter.value === "card") {
    list = list.filter((c) => c.battleKind === "card");
  }

  if (npcMapFilter.value === "currentMap") {
    list = list.filter((c) => c.isInCurrentMap);
  } else if (npcMapFilter.value === "visitedMaps") {
    list = list.filter((c) => c.isVisitedMap);
  }

  return list;
});

const sortedAvailableNpcs = computed(() => {
  return sortCharacterList(filteredAvailableNpcs.value);
});

const readyAvailableCount = computed(() => {
  return mapViewModel.value.characterBattles.filter((c) => c.status === "available").length;
});

const exceededAvailableCount = computed(() => {
  return mapViewModel.value.characterBattles.filter((c) => c.status === "charismaExceeded").length;
});

// 3. NPCs Próximos lists
const filteredUpcomingNpcs = computed(() => {
  let list = mapViewModel.value.upcomingCharacterBattles;

  if (upcomingStatusFilter.value === "missingCharisma") {
    list = list.filter((c) => c.status === "missingCharisma");
  } else if (upcomingStatusFilter.value === "missingTrophy") {
    list = list.filter((c) => c.status === "missingTrophy");
  }

  if (npcKindFilter.value === "digimon") {
    list = list.filter((c) => c.battleKind === "digimon");
  } else if (npcKindFilter.value === "card") {
    list = list.filter((c) => c.battleKind === "card");
  }

  if (npcMapFilter.value === "currentMap") {
    list = list.filter((c) => c.isInCurrentMap);
  } else if (npcMapFilter.value === "visitedMaps") {
    list = list.filter((c) => c.isVisitedMap);
  }

  return list;
});

const sortedUpcomingNpcs = computed(() => {
  return sortCharacterList(filteredUpcomingNpcs.value);
});

const missingCharismaCount = computed(() => {
  return mapViewModel.value.upcomingCharacterBattles.filter((c) => c.status === "missingCharisma").length;
});

const missingTrophyCount = computed(() => {
  return mapViewModel.value.upcomingCharacterBattles.filter((c) => c.status === "missingTrophy").length;
});

// Category Total Counters
const totalMonstersCount = computed(() => {
  const mapCount = mapViewModel.value.currentMapEnemies.length > 0
    ? mapViewModel.value.currentMapEnemies.length
    : mapViewModel.value.visitedMapsEnemies.length;
  return mapCount + mapViewModel.value.availableBosses.length + mapViewModel.value.upcomingBosses.length;
});

const totalNpcsCount = computed(() => {
  return mapViewModel.value.characterBattles.length + mapViewModel.value.upcomingCharacterBattles.length;
});

// Wiki Modal
const selectedEnemyId = ref<string | null>(null);
const selectedNpcId = ref<string | null>(null);
const isWikiModalOpen = computed(
  () => selectedEnemyId.value !== null || selectedNpcId.value !== null,
);

const handleSelectEnemy = (enemyId: string) => {
  selectedNpcId.value = null;
  selectedEnemyId.value = enemyId;
};

const handleSelectCharacter = (characterId: string) => {
  selectedEnemyId.value = null;
  selectedNpcId.value = characterId;
};

const closeWikiModal = () => {
  selectedEnemyId.value = null;
  selectedNpcId.value = null;
};

const handleClearVisited = () => {
  visitedMapsStore.resetVisitedMaps();
  if (mapViewModel.value.effectiveLocationId) {
    visitedMapsStore.recordMapVisit(mapViewModel.value.effectiveLocationId);
  }
};
</script>

<template>
  <Modal
    :is-open="isOpen"
    max-width="max-w-[1140px]"
    max-height="h-[740px] max-h-[740px]"
    panel-class="w-[1140px]"
    @close="emit('close')"
  >
    <!-- Modal Header: Title + Location & Charisma Banner -->
    <template #header>
      <div class="flex items-center justify-between w-full pr-4 gap-4 flex-wrap">
        <!-- Title & Icon with subtle cyber neon glow -->
        <div class="flex items-center gap-2.5 shrink-0">
          <div class="w-8 h-8 rounded-lg bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black text-lg shadow-[0_0_12px_rgba(245,158,11,0.4)]">
            ⚡
          </div>
          <h2 class="text-white font-bold tracking-widest text-lg drop-shadow font-mono">
            {{ $t("expGrind.title") }}
          </h2>
        </div>

        <!-- Status Badges: Current Location + Charisma Pill -->
        <div class="flex items-center gap-2.5 text-xs flex-wrap">
          <!-- Current Location -->
          <div class="flex items-center gap-2 bg-[#001026] border border-blue-800/60 px-3 py-1 rounded-lg shadow-inner">
            <span class="text-gray-400">📍 {{ $t("expGrind.currentMap") }}:</span>
            <span class="font-bold text-cyan-300 font-mono uppercase tracking-wide">
              {{ $t(`map.${mapViewModel.effectiveLocationId}`) }}
            </span>
            <span
              class="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
              :class="
                mapViewModel.isSafeZone
                  ? 'bg-sky-950/90 text-sky-300 border border-sky-500/60'
                  : 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/60'
              "
            >
              {{ mapViewModel.isSafeZone ? $t("expGrind.safeZoneTitle") : 'Monstros Ativos' }}
            </span>
          </div>

          <!-- Charisma Pill -->
          <div class="flex items-center gap-1.5 bg-[#181100] border border-amber-500/70 px-3 py-1 rounded-lg text-amber-300 font-mono shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            <span class="text-xs">✨</span>
            <span class="text-gray-400 text-[11px]">{{ $t("expGrind.yourCharisma") }}:</span>
            <span class="font-black text-amber-200 text-xs">{{ mapViewModel.partyCharisma }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal Body -->
    <div class="flex flex-col flex-1 min-h-0 h-full p-4 overflow-hidden gap-3 select-none">
      <!-- LEVEL 1: Top Navigation - 2 Main Categories on the Left (Digimons & NPCs) -->
      <div class="flex items-center justify-between border-b border-blue-900/60 pb-3 shrink-0 gap-3 flex-wrap">
        <!-- 2 Main Category Tabs on the Left -->
        <div class="flex items-center gap-2">
          <!-- Main Category 1: Digimons (Monsters & Bosses) -->
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer border flex items-center gap-2 tracking-wide"
            :class="
              activeCategory === 'monsters'
                ? 'bg-linear-to-r from-cyan-950 to-blue-950 border-cyan-400 text-cyan-300 shadow-[0_0_14px_rgba(6,182,212,0.35)] scale-[1.02]'
                : 'bg-blue-950/50 border-blue-800/60 text-gray-400 hover:text-white hover:bg-blue-900/40'
            "
            @click="activeCategory = 'monsters'"
          >
            <span class="text-base leading-none">👾</span>
            <span>{{ $t("expGrind.categoryMonsters") }}</span>
            <span
              v-if="totalMonstersCount > 0"
              class="px-2 py-0.2 rounded-full text-[11px] font-mono font-bold"
              :class="activeCategory === 'monsters' ? 'bg-cyan-900/90 text-cyan-100' : 'bg-blue-900/50 text-gray-400'"
            >
              {{ totalMonstersCount }}
            </span>
          </button>

          <!-- Main Category 2: NPCs (Treinadores, Líderes) -->
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer border flex items-center gap-2 tracking-wide"
            :class="
              activeCategory === 'npcs'
                ? 'bg-linear-to-r from-amber-950 to-purple-950 border-amber-400 text-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.35)] scale-[1.02]'
                : 'bg-blue-950/50 border-blue-800/60 text-gray-400 hover:text-white hover:bg-blue-900/40'
            "
            @click="activeCategory = 'npcs'"
          >
            <span class="text-base leading-none">👤</span>
            <span>{{ $t("expGrind.categoryNpcs") }}</span>
            <span
              v-if="totalNpcsCount > 0"
              class="px-2 py-0.2 rounded-full text-[11px] font-mono font-bold"
              :class="activeCategory === 'npcs' ? 'bg-amber-900/90 text-amber-100' : 'bg-blue-900/50 text-gray-400'"
            >
              {{ totalNpcsCount }}
            </span>
          </button>
        </div>

        <!-- Global View Mode Toggle (Lista / Cards) -->
        <div class="flex items-center bg-[#000818] border border-blue-900/80 rounded-lg p-0.5">
          <button
            type="button"
            class="px-3 py-1 rounded text-xs transition-colors cursor-pointer flex items-center gap-1.5"
            :class="
              viewMode === 'list'
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/60 shadow-xs'
                : 'text-gray-400 hover:text-white'
            "
            title="Visualização em Lista"
            @click="viewMode = 'list'"
          >
            <span>☰</span>
            <span>Lista</span>
          </button>
          <button
            type="button"
            class="px-3 py-1 rounded text-xs transition-colors cursor-pointer flex items-center gap-1.5"
            :class="
              viewMode === 'cards'
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/60 shadow-xs'
                : 'text-gray-400 hover:text-white'
            "
            title="Visualização em Cards"
            @click="viewMode = 'cards'"
          >
            <span>▦</span>
            <span>Cards</span>
          </button>
        </div>
      </div>

      <!-- LEVEL 2: Contextual Control Bar (Sub-tabs, Filters & Sorting) -->
      <div class="bg-[#000d26]/85 border border-blue-900/60 rounded-xl px-3 py-2 flex items-center justify-between gap-3 shrink-0 flex-wrap shadow-inner">
        <!-- LEFT: Contextual Sub-Tabs -->
        <div class="flex items-center gap-2 flex-wrap">
          <!-- SUB-TABS: When in Digimons (Mapa Atual, Mapas Visitados, Bosses Disponíveis, Próximos Bosses) -->
          <template v-if="activeCategory === 'monsters'">
            <div class="flex items-center bg-[#000818] border border-blue-900/80 rounded-lg p-0.5 flex-wrap gap-0.5">
              <!-- Sub-tab 1: Mapa Atual -->
              <button
                type="button"
                class="px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                :class="
                  monsterSubTab === 'currentMap'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/60 shadow-xs'
                    : 'text-gray-400 hover:text-white'
                "
                @click="monsterSubTab = 'currentMap'"
              >
                <span>📍</span>
                <span>{{ $t("expGrind.currentMap") }}</span>
                <span
                  v-if="sortedCurrentEnemies.length > 0"
                  class="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-900/80 text-cyan-200 font-mono"
                >
                  {{ sortedCurrentEnemies.length }}
                </span>
              </button>

              <!-- Sub-tab 2: Mapas Visitados -->
              <button
                type="button"
                class="px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                :class="
                  monsterSubTab === 'visitedMaps'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/60 shadow-xs'
                    : 'text-gray-400 hover:text-white'
                "
                @click="monsterSubTab = 'visitedMaps'"
              >
                <span>👣</span>
                <span>{{ $t("expGrind.visitedMaps") }}</span>
                <span
                  v-if="sortedVisitedEnemies.length > 0"
                  class="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-900/80 text-emerald-200 font-mono"
                >
                  {{ sortedVisitedEnemies.length }}
                </span>
              </button>

              <!-- Sub-tab 3: Bosses Disponíveis -->
              <button
                type="button"
                class="px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                :class="
                  monsterSubTab === 'availableBosses'
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/60 shadow-xs'
                    : 'text-gray-400 hover:text-white'
                "
                @click="monsterSubTab = 'availableBosses'"
              >
                <span>👑</span>
                <span>{{ $t("expGrind.availableBosses") }}</span>
                <span
                  v-if="sortedAvailableBosses.length > 0"
                  class="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-900/80 text-amber-200 font-mono font-bold"
                >
                  {{ sortedAvailableBosses.length }}
                </span>
              </button>

              <!-- Sub-tab 4: Próximos Bosses -->
              <button
                type="button"
                class="px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                :class="
                  monsterSubTab === 'upcomingBosses'
                    ? 'bg-rose-950 text-rose-300 border border-rose-500/60 shadow-xs'
                    : 'text-gray-400 hover:text-white'
                "
                @click="monsterSubTab = 'upcomingBosses'"
              >
                <span>⏳</span>
                <span>{{ $t("expGrind.upcomingBosses") }}</span>
                <span
                  v-if="sortedUpcomingBosses.length > 0"
                  class="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-900/80 text-rose-200 font-mono font-bold"
                >
                  {{ sortedUpcomingBosses.length }}
                </span>
              </button>
            </div>

            <!-- Clear Visited history button if in Visited Maps -->
            <button
              v-if="monsterSubTab === 'visitedMaps' && sortedVisitedEnemies.length > 0"
              type="button"
              class="px-2.5 py-1 rounded text-[11px] bg-red-950/60 border border-red-800/70 text-red-300 hover:bg-red-900/80 transition-colors cursor-pointer font-mono flex items-center gap-1"
              :title="$t('expGrind.clearVisited')"
              @click="handleClearVisited"
            >
              <span>🗑️</span>
              <span>Limpar</span>
            </button>
          </template>

          <!-- SUB-TABS: When in NPCs -->
          <template v-else-if="activeCategory === 'npcs'">
            <!-- Sub-tab switcher: Disponíveis vs Próximos -->
            <div class="flex items-center bg-[#000818] border border-blue-900/80 rounded-lg p-0.5">
              <button
                type="button"
                class="px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                :class="
                  npcSubTab === 'available'
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/60 shadow-xs'
                    : 'text-gray-400 hover:text-white'
                "
                @click="npcSubTab = 'available'"
              >
                <span>⚔️</span>
                <span>{{ $t("expGrind.availableNpcs") }}</span>
                <span
                  v-if="sortedAvailableNpcs.length > 0"
                  class="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-900/80 text-amber-200 font-mono font-bold"
                >
                  {{ sortedAvailableNpcs.length }}
                </span>
              </button>

              <button
                type="button"
                class="px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                :class="
                  npcSubTab === 'upcoming'
                    ? 'bg-rose-950 text-rose-300 border border-rose-500/60 shadow-xs'
                    : 'text-gray-400 hover:text-white'
                "
                @click="npcSubTab = 'upcoming'"
              >
                <span>⏳</span>
                <span>{{ $t("expGrind.upcomingNpcs") }}</span>
                <span
                  v-if="sortedUpcomingNpcs.length > 0"
                  class="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-900/80 text-rose-200 font-mono font-bold"
                >
                  {{ sortedUpcomingNpcs.length }}
                </span>
              </button>
            </div>

            <!-- Status Filter Pill for Disponíveis -->
            <div
              v-if="npcSubTab === 'available'"
              class="flex items-center bg-[#000818] border border-blue-900/80 rounded-lg p-0.5 text-[11px] font-bold"
            >
              <button
                type="button"
                class="px-2 py-0.5 rounded transition-colors cursor-pointer"
                :class="
                  availableStatusFilter === 'all'
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/60 shadow-xs'
                    : 'text-gray-400 hover:text-white'
                "
                @click="availableStatusFilter = 'all'"
              >
                Todos
              </button>
              <button
                type="button"
                class="px-2 py-0.5 rounded transition-colors cursor-pointer"
                :class="
                  availableStatusFilter === 'ready'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/60 shadow-xs'
                    : 'text-gray-400 hover:text-white'
                "
                @click="availableStatusFilter = 'ready'"
              >
                ✅ Prontos ({{ readyAvailableCount }})
              </button>
              <button
                type="button"
                class="px-2 py-0.5 rounded transition-colors cursor-pointer"
                :class="
                  availableStatusFilter === 'charismaExceeded'
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/60 shadow-xs'
                    : 'text-gray-400 hover:text-white'
                "
                @click="availableStatusFilter = 'charismaExceeded'"
              >
                ⚠️ Carisma Ultrapassou ({{ exceededAvailableCount }})
              </button>
            </div>

            <!-- Status Filter Pill for Próximos -->
            <div
              v-else-if="npcSubTab === 'upcoming'"
              class="flex items-center bg-[#000818] border border-blue-900/80 rounded-lg p-0.5 text-[11px] font-bold"
            >
              <button
                type="button"
                class="px-2 py-0.5 rounded transition-colors cursor-pointer"
                :class="
                  upcomingStatusFilter === 'all'
                    ? 'bg-rose-950 text-rose-300 border border-rose-500/60 shadow-xs'
                    : 'text-gray-400 hover:text-white'
                "
                @click="upcomingStatusFilter = 'all'"
              >
                Todos
              </button>
              <button
                type="button"
                class="px-2 py-0.5 rounded transition-colors cursor-pointer"
                :class="
                  upcomingStatusFilter === 'missingCharisma'
                    ? 'bg-rose-950 text-rose-300 border border-rose-500/60 shadow-xs'
                    : 'text-gray-400 hover:text-white'
                "
                @click="upcomingStatusFilter = 'missingCharisma'"
              >
                🔒 Falta Carisma ({{ missingCharismaCount }})
              </button>
              <button
                type="button"
                class="px-2 py-0.5 rounded transition-colors cursor-pointer"
                :class="
                  upcomingStatusFilter === 'missingTrophy'
                    ? 'bg-purple-950 text-purple-300 border border-purple-500/60 shadow-xs'
                    : 'text-gray-400 hover:text-white'
                "
                @click="upcomingStatusFilter = 'missingTrophy'"
              >
                🏆 Falta Troféu ({{ missingTrophyCount }})
              </button>
            </div>

            <!-- Battle Kind Filter (Digimon vs Cartas) -->
            <div class="flex items-center bg-[#000818] border border-blue-900/80 rounded-lg p-0.5 text-[11px] font-bold">
              <button
                type="button"
                class="px-2 py-0.5 rounded transition-colors cursor-pointer"
                :class="
                  npcKindFilter === 'all'
                    ? 'bg-blue-900/70 text-blue-200 border border-blue-600/60 shadow-xs'
                    : 'text-gray-400 hover:text-white'
                "
                @click="npcKindFilter = 'all'"
              >
                Todos
              </button>
              <button
                type="button"
                class="px-2 py-0.5 rounded transition-colors cursor-pointer"
                :class="
                  npcKindFilter === 'digimon'
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/60 shadow-xs'
                    : 'text-gray-400 hover:text-white'
                "
                @click="npcKindFilter = 'digimon'"
              >
                ⚡ Digimon
              </button>
              <button
                type="button"
                class="px-2 py-0.5 rounded transition-colors cursor-pointer"
                :class="
                  npcKindFilter === 'card'
                    ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/60 shadow-xs'
                    : 'text-gray-400 hover:text-white'
                "
                @click="npcKindFilter = 'card'"
              >
                🎴 Cartas
              </button>
            </div>
          </template>
        </div>

        <!-- RIGHT: Sorting Options -->
        <div class="flex items-center gap-1 text-xs flex-wrap font-mono">
          <span class="text-gray-400 text-[11px] mr-1 hidden lg:inline">{{ $t("expGrind.sortBy") }}</span>

          <!-- Menor Carisma (Default for Upcoming NPCs) -->
          <button
            v-if="activeCategory === 'npcs'"
            type="button"
            class="px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer border"
            :class="
              sortBy === 'charismaAsc'
                ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-xs'
                : 'bg-blue-950/60 border-blue-800/80 text-gray-400 hover:text-white'
            "
            @click="sortBy = 'charismaAsc'"
          >
            ✨ Carisma
          </button>

          <button
            type="button"
            class="px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer border"
            :class="
              sortBy === 'exp'
                ? 'bg-amber-950 border-amber-400 text-amber-300 shadow-xs'
                : 'bg-blue-950/60 border-blue-800/80 text-gray-400 hover:text-white'
            "
            @click="sortBy = 'exp'"
          >
            ⚡ EXP
          </button>

          <button
            type="button"
            class="px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer border"
            :class="
              sortBy === 'efficiency'
                ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-xs'
                : 'bg-blue-950/60 border-blue-800/80 text-gray-400 hover:text-white'
            "
            @click="sortBy = 'efficiency'"
          >
            🎯 EXP/HP
          </button>

          <button
            v-if="activeCategory === 'monsters'"
            type="button"
            class="px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer border"
            :class="
              sortBy === 'dvexp'
                ? 'bg-purple-950 border-purple-400 text-purple-300 shadow-xs'
                : 'bg-blue-950/60 border-blue-800/80 text-gray-400 hover:text-white'
            "
            @click="sortBy = 'dvexp'"
          >
            🔮 DV EXP
          </button>

          <button
            type="button"
            class="px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer border"
            :class="
              sortBy === 'bits'
                ? 'bg-yellow-950 border-yellow-400 text-yellow-300 shadow-xs'
                : 'bg-blue-950/60 border-blue-800/80 text-gray-400 hover:text-white'
            "
            @click="sortBy = 'bits'"
          >
            🪙 Bits
          </button>
        </div>
      </div>

      <!-- VIEW 1: DIGIMONS - CURRENT MAP -->
      <div
        v-if="activeCategory === 'monsters' && monsterSubTab === 'currentMap'"
        class="flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto custom-scroll pr-1"
      >
        <!-- Safe Zone State (No monsters) -->
        <div
          v-if="mapViewModel.isSafeZone"
          class="flex flex-col items-center justify-center p-8 rounded-xl bg-[#001026]/70 border border-blue-900/60 text-center gap-3 my-auto shadow-inner"
        >
          <span class="text-4xl">🛡️</span>
          <h3 class="text-base font-bold text-white uppercase tracking-wider">
            {{ $t("expGrind.safeZoneTitle") }}
          </h3>
          <p class="text-xs text-blue-200 max-w-md leading-relaxed">
            {{ $t("expGrind.safeZoneDescription") }}
          </p>
          <button
            type="button"
            class="mt-2 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-950 border border-emerald-400 text-emerald-300 hover:bg-emerald-900 transition-colors cursor-pointer shadow-md flex items-center gap-2"
            @click="monsterSubTab = 'visitedMaps'"
          >
            <span>👣</span>
            <span>Ver Monstros nos Mapas Visitados ›</span>
          </button>
        </div>

        <!-- Current Map Enemies Found -->
        <template v-else>
          <!-- List View Header -->
          <div
            v-if="viewMode === 'list'"
            class="hidden sm:flex items-center justify-between px-3 py-1.5 text-[10px] uppercase font-bold text-blue-400/80 border-b border-blue-900/40 shrink-0 font-mono"
          >
            <div class="flex items-center gap-3">
              <span>Monstro</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="min-w-22 text-right">EXP (EXP/HP)</span>
              <span class="min-w-22 text-right">Bits (Bits/HP)</span>
              <span class="min-w-14 text-right hidden sm:inline">DV EXP</span>
              <span class="min-w-16 text-right hidden md:inline">HP</span>
              <span class="w-4"></span>
            </div>
          </div>

          <!-- Leaderboard List View -->
          <div v-if="viewMode === 'list'" class="flex flex-col gap-1.5">
            <ExpEnemyRow
              v-for="enemy in sortedCurrentEnemies"
              :key="enemy.enemyId"
              :enemy="enemy"
              :active-sort="sortBy === 'charismaAsc' ? 'exp' : sortBy"
              @select="handleSelectEnemy"
            />
          </div>

          <!-- Card Grid View -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <ExpEnemyCard
              v-for="enemy in sortedCurrentEnemies"
              :key="enemy.enemyId"
              :enemy="enemy"
              @select="handleSelectEnemy"
            />
          </div>
        </template>
      </div>

      <!-- VIEW 2: DIGIMONS - VISITED MAPS -->
      <div
        v-else-if="activeCategory === 'monsters' && monsterSubTab === 'visitedMaps'"
        class="flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto custom-scroll pr-1"
      >
        <!-- Empty state -->
        <div
          v-if="sortedVisitedEnemies.length === 0"
          class="flex flex-col items-center justify-center p-8 rounded-xl bg-[#001026]/70 border border-blue-900/60 text-center gap-3 my-auto shadow-inner"
        >
          <span class="text-4xl">👣</span>
          <h3 class="text-base font-bold text-white uppercase tracking-wider">
            {{ $t("expGrind.visitedEmptyTitle") }}
          </h3>
          <p class="text-xs text-emerald-200 max-w-md leading-relaxed">
            {{ $t("expGrind.visitedEmptyDescription") }}
          </p>
        </div>

        <template v-else>
          <!-- List View Header -->
          <div
            v-if="viewMode === 'list'"
            class="hidden sm:flex items-center justify-between px-3 py-1.5 text-[10px] uppercase font-bold text-blue-400/80 border-b border-blue-900/40 shrink-0 font-mono"
          >
            <div class="flex items-center gap-3">
              <span>Monstro & Localização</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="min-w-22 text-right">EXP (EXP/HP)</span>
              <span class="min-w-22 text-right">Bits (Bits/HP)</span>
              <span class="min-w-14 text-right hidden sm:inline">DV EXP</span>
              <span class="min-w-16 text-right hidden md:inline">HP</span>
              <span class="w-4"></span>
            </div>
          </div>

          <!-- Leaderboard List View -->
          <div v-if="viewMode === 'list'" class="flex flex-col gap-1.5">
            <ExpEnemyRow
              v-for="enemy in sortedVisitedEnemies"
              :key="enemy.enemyId"
              :enemy="enemy"
              :active-sort="sortBy === 'charismaAsc' ? 'exp' : sortBy"
              @select="handleSelectEnemy"
            />
          </div>

          <!-- Card Grid View -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <ExpEnemyCard
              v-for="enemy in sortedVisitedEnemies"
              :key="enemy.enemyId"
              :enemy="enemy"
              @select="handleSelectEnemy"
            />
          </div>
        </template>
      </div>

      <!-- VIEW 3: DIGIMONS - BOSSES DISPONÍVEIS -->
      <div
        v-else-if="activeCategory === 'monsters' && monsterSubTab === 'availableBosses'"
        class="flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto custom-scroll pr-1"
      >
        <!-- Subtitle Info -->
        <div class="flex items-center justify-between text-xs text-gray-300 shrink-0 bg-amber-950/20 px-3 py-1.5 rounded-lg border border-amber-900/40">
          <span class="font-bold text-amber-300 uppercase tracking-wider text-[11px] font-mono">
            👑 {{ $t("expGrind.availableBossesSubtitle", { count: sortedAvailableBosses.length }) }}
          </span>
        </div>

        <!-- Empty state -->
        <div
          v-if="sortedAvailableBosses.length === 0"
          class="flex flex-col items-center justify-center p-8 rounded-xl bg-[#001026]/70 border border-blue-900/60 text-center gap-3 my-auto shadow-inner"
        >
          <span class="text-4xl">👑</span>
          <h3 class="text-base font-bold text-white uppercase tracking-wider">
            {{ $t("expGrind.bossEmptyTitle") }}
          </h3>
          <p class="text-xs text-amber-200 max-w-md leading-relaxed">
            {{ $t("expGrind.bossEmptyDescription") }}
          </p>
        </div>

        <template v-else>
          <!-- List View Header -->
          <div
            v-if="viewMode === 'list'"
            class="hidden sm:flex items-center justify-between px-3 py-1.5 text-[10px] uppercase font-bold text-blue-400/80 border-b border-blue-900/40 shrink-0 font-mono"
          >
            <div class="flex items-center gap-3">
              <span>Boss & Localização</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="min-w-22 text-right">EXP (EXP/HP)</span>
              <span class="min-w-22 text-right">Bits (Bits/HP)</span>
              <span class="min-w-14 text-right hidden sm:inline">DV EXP</span>
              <span class="min-w-16 text-right hidden md:inline">HP</span>
              <span class="w-4"></span>
            </div>
          </div>

          <!-- Leaderboard List View -->
          <div v-if="viewMode === 'list'" class="flex flex-col gap-1.5">
            <ExpEnemyRow
              v-for="enemy in sortedAvailableBosses"
              :key="enemy.enemyId"
              :enemy="enemy"
              :active-sort="sortBy === 'charismaAsc' ? 'exp' : sortBy"
              @select="handleSelectEnemy"
            />
          </div>

          <!-- Card Grid View -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <ExpEnemyCard
              v-for="enemy in sortedAvailableBosses"
              :key="enemy.enemyId"
              :enemy="enemy"
              @select="handleSelectEnemy"
            />
          </div>
        </template>
      </div>

      <!-- VIEW 4: DIGIMONS - PRÓXIMOS BOSSES -->
      <div
        v-else-if="activeCategory === 'monsters' && monsterSubTab === 'upcomingBosses'"
        class="flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto custom-scroll pr-1"
      >
        <!-- Subtitle Info -->
        <div class="flex items-center justify-between text-xs text-gray-300 shrink-0 bg-rose-950/20 px-3 py-1.5 rounded-lg border border-rose-900/40">
          <span class="font-bold text-rose-300 uppercase tracking-wider text-[11px] font-mono">
            ⏳ {{ $t("expGrind.upcomingBossesSubtitle", { count: sortedUpcomingBosses.length }) }}
          </span>
        </div>

        <!-- Empty state -->
        <div
          v-if="sortedUpcomingBosses.length === 0"
          class="flex flex-col items-center justify-center p-8 rounded-xl bg-[#001026]/70 border border-blue-900/60 text-center gap-3 my-auto shadow-inner"
        >
          <span class="text-4xl">⏳</span>
          <h3 class="text-base font-bold text-white uppercase tracking-wider">
            {{ $t("expGrind.upcomingBossEmptyTitle") }}
          </h3>
          <p class="text-xs text-rose-200 max-w-md leading-relaxed">
            {{ $t("expGrind.upcomingBossEmptyDescription") }}
          </p>
        </div>

        <template v-else>
          <!-- List View Header -->
          <div
            v-if="viewMode === 'list'"
            class="hidden sm:flex items-center justify-between px-3 py-1.5 text-[10px] uppercase font-bold text-blue-400/80 border-b border-blue-900/40 shrink-0 font-mono"
          >
            <div class="flex items-center gap-3">
              <span>Boss & Localização</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="min-w-22 text-right">EXP (EXP/HP)</span>
              <span class="min-w-22 text-right">Bits (Bits/HP)</span>
              <span class="min-w-14 text-right hidden sm:inline">DV EXP</span>
              <span class="min-w-16 text-right hidden md:inline">HP</span>
              <span class="w-4"></span>
            </div>
          </div>

          <!-- Leaderboard List View -->
          <div v-if="viewMode === 'list'" class="flex flex-col gap-1.5">
            <ExpEnemyRow
              v-for="enemy in sortedUpcomingBosses"
              :key="enemy.enemyId"
              :enemy="enemy"
              :active-sort="sortBy === 'charismaAsc' ? 'exp' : sortBy"
              @select="handleSelectEnemy"
            />
          </div>

          <!-- Card Grid View -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <ExpEnemyCard
              v-for="enemy in sortedUpcomingBosses"
              :key="enemy.enemyId"
              :enemy="enemy"
              @select="handleSelectEnemy"
            />
          </div>
        </template>
      </div>

      <!-- VIEW 5: NPCS - DISPONÍVEIS (READY & CARISMA ULTRAPASSOU) -->
      <div
        v-else-if="activeCategory === 'npcs' && npcSubTab === 'available'"
        class="flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto custom-scroll pr-1"
      >
        <!-- Empty state -->
        <div
          v-if="sortedAvailableNpcs.length === 0"
          class="flex flex-col items-center justify-center p-8 rounded-xl bg-[#001026]/70 border border-blue-900/60 text-center gap-3 my-auto shadow-inner"
        >
          <span class="text-4xl">⚔️</span>
          <h3 class="text-base font-bold text-white uppercase tracking-wider">
            {{ $t("expGrind.charactersEmptyTitle") }}
          </h3>
          <p class="text-xs text-amber-200/90 max-w-md leading-relaxed">
            {{ $t("expGrind.charactersEmptyDescription") }}
          </p>
          <button
            v-if="availableStatusFilter !== 'all' || npcKindFilter !== 'all' || npcMapFilter !== 'all'"
            type="button"
            class="mt-2 px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-950 border border-amber-400 text-amber-300 hover:bg-amber-900 transition-colors cursor-pointer shadow-md"
            @click="availableStatusFilter = 'all'; npcKindFilter = 'all'; npcMapFilter = 'all'"
          >
            Limpar Filtros
          </button>
        </div>

        <template v-else>
          <!-- List View Header -->
          <div
            v-if="viewMode === 'list'"
            class="hidden sm:flex items-center justify-between px-3 py-1.5 text-[10px] uppercase font-bold text-blue-400/80 border-b border-blue-900/40 shrink-0 font-mono"
          >
            <div class="flex items-center gap-3">
              <span>Personagem & Localização</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="min-w-22 text-right">EXP (EXP/HP)</span>
              <span class="min-w-22 text-right">Bits (Bits/HP)</span>
              <span class="min-w-14 text-right hidden sm:inline">DV EXP</span>
              <span class="min-w-16 text-right hidden md:inline">HP Total</span>
              <span class="w-4"></span>
            </div>
          </div>

          <!-- Leaderboard List View -->
          <div v-if="viewMode === 'list'" class="flex flex-col gap-1.5">
            <ExpCharacterRow
              v-for="character in sortedAvailableNpcs"
              :key="`${character.characterId}-${character.battleId}-${character.battleKind}`"
              :character="character"
              :active-sort="sortBy"
              :party-charisma="mapViewModel.partyCharisma"
              @select-character="handleSelectCharacter"
              @select-enemy="handleSelectEnemy"
            />
          </div>

          <!-- Card Grid View -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <ExpCharacterCard
              v-for="character in sortedAvailableNpcs"
              :key="`${character.characterId}-${character.battleId}-${character.battleKind}`"
              :character="character"
              :party-charisma="mapViewModel.partyCharisma"
              @select-character="handleSelectCharacter"
              @select-enemy="handleSelectEnemy"
            />
          </div>
        </template>
      </div>

      <!-- VIEW 6: NPCS - PRÓXIMOS (FALTA CARISMA / TROFÉUS - SORTED BY CARISMA) -->
      <div
        v-else-if="activeCategory === 'npcs' && npcSubTab === 'upcoming'"
        class="flex-1 min-h-0 flex flex-col gap-2 overflow-y-auto custom-scroll pr-1"
      >
        <!-- Empty state -->
        <div
          v-if="sortedUpcomingNpcs.length === 0"
          class="flex flex-col items-center justify-center p-8 rounded-xl bg-[#001026]/70 border border-blue-900/60 text-center gap-3 my-auto shadow-inner"
        >
          <span class="text-4xl">⏳</span>
          <h3 class="text-base font-bold text-white uppercase tracking-wider">
            {{ $t("expGrind.upcomingEmptyTitle") }}
          </h3>
          <p class="text-xs text-rose-200/90 max-w-md leading-relaxed">
            {{ $t("expGrind.upcomingEmptyDescription") }}
          </p>
          <button
            v-if="upcomingStatusFilter !== 'all' || npcKindFilter !== 'all' || npcMapFilter !== 'all'"
            type="button"
            class="mt-2 px-4 py-1.5 rounded-lg text-xs font-bold bg-rose-950 border border-rose-400 text-rose-300 hover:bg-rose-900 transition-colors cursor-pointer shadow-md"
            @click="upcomingStatusFilter = 'all'; npcKindFilter = 'all'; npcMapFilter = 'all'"
          >
            Limpar Filtros
          </button>
        </div>

        <template v-else>
          <!-- List View Header -->
          <div
            v-if="viewMode === 'list'"
            class="hidden sm:flex items-center justify-between px-3 py-1.5 text-[10px] uppercase font-bold text-blue-400/80 border-b border-blue-900/40 shrink-0 font-mono"
          >
            <div class="flex items-center gap-3">
              <span>Personagem & Localização</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="min-w-22 text-right">EXP (EXP/HP)</span>
              <span class="min-w-22 text-right">Bits (Bits/HP)</span>
              <span class="min-w-14 text-right hidden sm:inline">DV EXP</span>
              <span class="min-w-16 text-right hidden md:inline">HP Total</span>
              <span class="w-4"></span>
            </div>
          </div>

          <!-- Leaderboard List View -->
          <div v-if="viewMode === 'list'" class="flex flex-col gap-1.5">
            <ExpCharacterRow
              v-for="character in sortedUpcomingNpcs"
              :key="`${character.characterId}-${character.battleId}-${character.battleKind}`"
              :character="character"
              :active-sort="sortBy"
              :party-charisma="mapViewModel.partyCharisma"
              @select-character="handleSelectCharacter"
              @select-enemy="handleSelectEnemy"
            />
          </div>

          <!-- Card Grid View -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <ExpCharacterCard
              v-for="character in sortedUpcomingNpcs"
              :key="`${character.characterId}-${character.battleId}-${character.battleKind}`"
              :character="character"
              :party-charisma="mapViewModel.partyCharisma"
              @select-character="handleSelectCharacter"
              @select-enemy="handleSelectEnemy"
            />
          </div>
        </template>
      </div>
    </div>
  </Modal>

  <!-- Wiki Modal (Seamlessly opens when clicking on monster or NPC) -->
  <WikiModal
    :is-open="isWikiModalOpen"
    :enemy-id="selectedEnemyId"
    :npc-id="selectedNpcId"
    @close="closeWikiModal"
  />
</template>
