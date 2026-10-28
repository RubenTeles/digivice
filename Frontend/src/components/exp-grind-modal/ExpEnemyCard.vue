<script setup lang="ts">
import { computed } from "vue";
import type { ExpEnemyViewModel } from "@/viewmodels/exp-grind/exp-grind.viewmodel";

const props = defineProps<{
  enemy: ExpEnemyViewModel;
}>();

const emit = defineEmits<{
  (e: "select", enemyId: string): void;
}>();

const borderClass = computed(() => {
  if (props.enemy.isDefeated) {
    return "border-emerald-600/50 bg-[#00141a]/90 hover:border-emerald-400 opacity-85 hover:opacity-100";
  }
  if (props.enemy.isBoss) {
    return "border-amber-500/50 bg-[#000d24]/90 hover:border-amber-400";
  }
  if (props.enemy.isDna) {
    return "border-purple-600/50 bg-[#0a0822]/90 hover:border-purple-400";
  }
  return "border-blue-900/60 bg-[#000d24]/80 hover:border-blue-700";
});

const handleClick = () => {
  emit("select", props.enemy.enemyId);
};
</script>

<template>
  <div
    class="relative rounded-lg p-3 border transition-all duration-150 hover:scale-[1.02] cursor-pointer group flex flex-col justify-between select-none"
    :class="borderClass"
    @click="handleClick"
  >
    <!-- Header: Name + Level -->
    <div class="flex items-center justify-between w-full shrink-0 gap-1.5 mb-2">
      <div class="flex items-center gap-1.5 min-w-0">
        <h4 class="text-xs font-bold text-white group-hover:text-cyan-300 truncate transition-colors" :title="enemy.name">
          {{ enemy.name }}
        </h4>
      </div>

      <div class="flex items-center gap-1 shrink-0">
        <span
          v-if="enemy.isDefeated"
          class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/80 shrink-0 font-mono"
        >
          ✅ Derrotado
        </span>
        <span
          v-else-if="enemy.isBoss"
          class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-950 text-amber-300 border border-amber-500/80 shrink-0 font-mono"
        >
          👑 Boss
        </span>
        <span
          v-if="enemy.isDna"
          class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-950 text-purple-300 border border-purple-500/80 shrink-0 font-mono"
        >
          🧬 ADN
        </span>
        <span class="text-[10px] font-mono font-bold text-gray-400 shrink-0">
          Lv.{{ enemy.level }}
        </span>
      </div>
    </div>

    <!-- DNA Info Row -->
    <div
      v-if="enemy.dnaPartner"
      class="text-[10px] text-cyan-300 font-mono font-semibold flex items-center justify-between pb-1 -mt-1"
    >
      <span>DDNA de {{ enemy.dnaPartner }}</span>
      <span v-if="enemy.partyLevelRange" class="text-indigo-300 text-[9px]">Nv. {{ enemy.partyLevelRange.min }}-{{ enemy.partyLevelRange.max }}</span>
    </div>

    <!-- Center: Avatar + Stats -->
    <div class="flex items-center gap-2.5 my-1">
      <div class="w-14 h-14 shrink-0 rounded-lg bg-[#000a1c] border border-blue-900/80 flex items-center justify-center overflow-hidden p-0.5 group-hover:scale-105 group-hover:border-cyan-400 transition-all shadow-inner">
        <img
          v-if="enemy.imageUrl"
          :src="enemy.imageUrl"
          :alt="enemy.name"
          class="w-full h-full object-contain digimon-artwork"
        />
        <span v-else class="text-lg">👾</span>
      </div>

      <div class="flex-1 flex flex-col gap-1 min-w-0 font-mono text-[11px]">
        <!-- EXP -->
        <div class="flex items-center justify-between">
          <span class="text-gray-400 text-[10px] uppercase font-bold">EXP</span>
          <span class="font-black text-amber-300">+{{ enemy.exp }}</span>
        </div>

        <!-- Bits -->
        <div class="flex items-center justify-between">
          <span class="text-gray-400 text-[10px] uppercase font-bold">Bits</span>
          <span class="font-bold text-yellow-300">+{{ enemy.bits }}</span>
        </div>

        <!-- Efficiencies -->
        <div class="flex items-center justify-between text-[10px] pt-0.5 border-t border-white/5">
          <span class="text-cyan-300 font-bold" :title="$t('expGrind.efficiencyTooltip')">
            ⚡ {{ enemy.efficiencyDisplay }}
          </span>
          <span class="text-emerald-300 font-bold" :title="$t('expGrind.bitsEfficiencyTooltip')">
            💰 {{ enemy.bitsEfficiencyDisplay }}
          </span>
        </div>
      </div>
    </div>

    <!-- Card Bottom: Origin Icons & HP -->
    <div class="w-full flex items-center justify-between pt-1.5 border-t border-white/10 mt-1 text-[10px] font-mono">
      <div class="flex items-center gap-1 text-gray-400">
        <span v-if="enemy.origin.walking" title="Caminhando">🚶</span>
        <span v-if="enemy.origin.fishing" title="Pesca">🎣</span>
        <span v-if="enemy.origin.kickingTree" title="Árvore">🌲</span>
        <span v-if="enemy.origin.seabed" title="Subaquático">🤿</span>
        <span v-if="enemy.origin.dna" title="Digimon ADN">🧬</span>
      </div>

      <span class="text-gray-300">❤️ {{ enemy.hp }} HP</span>
    </div>

    <!-- Location tag -->
    <div
      v-if="enemy.encounterSpots && enemy.encounterSpots.length > 0"
      class="w-full flex flex-wrap gap-1 mt-1 pt-1 border-t border-blue-900/40 text-[9px]"
    >
      <span class="text-gray-500 uppercase font-bold">📍</span>
      <span
        v-for="(spot, idx) in enemy.encounterSpots.slice(0, 2)"
        :key="idx"
        class="px-1 py-0.2 rounded bg-blue-950/70 border border-blue-800 text-blue-200 truncate max-w-28 font-mono"
        :title="$t(`map.${spot.mapId}`)"
      >
        {{ $t(`map.${spot.mapId}`) }}
      </span>
      <span v-if="enemy.encounterSpots.length > 2" class="text-gray-500 font-mono">
        +{{ enemy.encounterSpots.length - 2 }}
      </span>
    </div>
  </div>
</template>
