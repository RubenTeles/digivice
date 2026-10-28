<script setup lang="ts">
import { computed } from "vue";
import type { ExpEnemyViewModel } from "@/viewmodels/exp-grind/exp-grind.viewmodel";

const props = defineProps<{
  enemy: ExpEnemyViewModel;
  activeSort: "exp" | "efficiency" | "dvexp" | "bits" | "bitsEfficiency";
}>();

const emit = defineEmits<{
  (e: "select", enemyId: string): void;
}>();

const borderClass = computed(() => {
  if (props.enemy.isBoss) {
    return "border-amber-500/40 bg-linear-to-r from-amber-950/20 via-[#000f28] to-[#000a18] hover:border-amber-400";
  }
  return "border-blue-900/45 bg-[#000c22]/70 hover:border-blue-700/80";
});
</script>

<template>
  <div
    class="w-full rounded-lg border px-3 py-2 flex items-center justify-between gap-3 transition-all duration-150 hover:bg-blue-900/20 cursor-pointer group select-none"
    :class="borderClass"
    @click="emit('select', enemy.enemyId)"
  >
    <!-- Left: Avatar + Name & Locations -->
    <div class="flex items-center gap-3 min-w-0 flex-1">
      <!-- Monster Avatar -->
      <div class="w-12 h-12 rounded-lg bg-[#000a1c] border border-blue-800/80 p-0.5 shrink-0 flex items-center justify-center overflow-hidden group-hover:scale-105 group-hover:border-cyan-400 transition-all shadow-inner">
        <img
          v-if="enemy.imageUrl"
          :src="enemy.imageUrl"
          :alt="enemy.name"
          class="w-full h-full object-contain digimon-artwork"
        />
        <span v-else class="text-lg">👾</span>
      </div>

      <!-- Monster Details -->
      <div class="flex flex-col min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors truncate">
            {{ enemy.name }}
          </span>

          <span
            v-if="enemy.isBoss"
            class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/80 shadow-[0_0_8px_rgba(251,191,36,0.3)] shrink-0 font-mono flex items-center gap-1"
          >
            <span>👑</span>
            <span>Boss</span>
          </span>

          <span
            v-if="enemy.mainQuestAvailabilityWindow?.starts"
            class="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/60 shrink-0"
          >
            História: Passo {{ enemy.mainQuestAvailabilityWindow.starts }}+
          </span>

          <span class="text-[10px] font-mono font-bold text-gray-400 shrink-0">
            Lv. {{ enemy.level }}
          </span>

          <!-- Origin Icons -->
          <div class="flex items-center gap-0.5 text-xs shrink-0 opacity-80">
            <span v-if="enemy.origin.walking" title="Caminhando">🚶</span>
            <span v-if="enemy.origin.fishing" title="Pesca">🎣</span>
            <span v-if="enemy.origin.kickingTree" title="Árvore">🌲</span>
            <span v-if="enemy.origin.seabed" title="Subaquático">🤿</span>
          </div>
        </div>

        <!-- Locations -->
        <div class="flex items-center gap-1.5 text-[10px] text-gray-400 mt-0.5">
          <span class="text-gray-500 uppercase font-bold text-[9px] shrink-0">📍</span>
          <template v-if="enemy.encounterSpots && enemy.encounterSpots.length > 0">
            <span
              v-for="(spot, sIdx) in enemy.encounterSpots.slice(0, 3)"
              :key="sIdx"
              class="text-blue-300 truncate max-w-40 font-mono"
            >
              {{ $t(`map.${spot.mapId}`) }}<span v-if="sIdx < Math.min(enemy.encounterSpots.length, 3) - 1" class="text-gray-600">,</span>
            </span>
            <span v-if="enemy.encounterSpots.length > 3" class="text-gray-500 font-mono shrink-0">
              +{{ enemy.encounterSpots.length - 3 }}
            </span>
          </template>
          <template v-else-if="enemy.locations">
            <span
              v-for="(locId, lIdx) in enemy.locations.slice(0, 2)"
              :key="locId"
              class="text-blue-300 truncate max-w-40 font-mono"
            >
              {{ $t(`map.${locId}`) }}<span v-if="lIdx < Math.min(enemy.locations.length, 2) - 1" class="text-gray-600">,</span>
            </span>
          </template>
        </div>
      </div>
    </div>

    <!-- Right: Stats Columns with Dynamic Highlight based on activeSort -->
    <div class="flex items-center gap-3 shrink-0 font-mono text-xs">
      <!-- EXP & EXP/HP Column -->
      <div
        class="flex flex-col items-end min-w-22 px-2.5 py-1 rounded transition-colors"
        :class="
          activeSort === 'exp' || activeSort === 'efficiency'
            ? 'bg-amber-950/60 border border-amber-400/60 shadow-[0_0_8px_rgba(251,191,36,0.15)]'
            : 'bg-[#000818]/60 border border-white/5'
        "
      >
        <span class="font-bold text-amber-300 flex items-center gap-1 text-sm">
          <span>⚡</span>
          <span>+{{ enemy.exp }}</span>
        </span>
        <span
          class="text-[10px] text-amber-200/80"
          :title="$t('expGrind.efficiencyTooltip')"
        >
          {{ enemy.efficiencyDisplay }} <span class="text-[9px] text-gray-400">EXP/HP</span>
        </span>
      </div>

      <!-- Bits & Bits/HP Column -->
      <div
        class="flex flex-col items-end min-w-22 px-2.5 py-1 rounded transition-colors"
        :class="
          activeSort === 'bits' || activeSort === 'bitsEfficiency'
            ? 'bg-yellow-950/60 border border-yellow-400/60 shadow-[0_0_8px_rgba(250,204,21,0.15)]'
            : 'bg-[#000818]/60 border border-white/5'
        "
      >
        <span class="font-bold text-yellow-300 flex items-center gap-1 text-sm">
          <span>🪙</span>
          <span>+{{ enemy.bits }}</span>
        </span>
        <span
          class="text-[10px] text-yellow-200/80"
          :title="$t('expGrind.bitsEfficiencyTooltip')"
        >
          {{ enemy.bitsEfficiencyDisplay }} <span class="text-[9px] text-gray-400">Bit/HP</span>
        </span>
      </div>

      <!-- DV EXP Column -->
      <div
        class="flex flex-col items-end min-w-14 px-2 py-1 rounded transition-colors hidden sm:flex"
        :class="
          activeSort === 'dvexp'
            ? 'bg-purple-950/60 border border-purple-400/60 shadow-[0_0_8px_rgba(192,132,252,0.15)]'
            : 'bg-[#000818]/60 border border-white/5'
        "
      >
        <span class="font-bold text-purple-300 text-xs">
          🔮 +{{ enemy.dvexp }}
        </span>
        <span class="text-[9px] text-purple-200/60 uppercase">DV EXP</span>
      </div>

      <!-- Total Monster HP Column -->
      <div class="flex flex-col items-end min-w-16 px-1.5 py-1 bg-[#000818]/40 border border-white/5 rounded hidden md:flex">
        <span class="text-xs font-bold text-emerald-400">
          {{ enemy.hp }}
        </span>
        <span class="text-[9px] text-emerald-200/60 uppercase">HP</span>
      </div>

      <!-- Chevron -->
      <span class="text-blue-500 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all w-4 text-center">
        ›
      </span>
    </div>
  </div>
</template>
