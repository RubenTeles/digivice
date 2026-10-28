<script setup lang="ts">
import { computed } from "vue";
import type { ExpCharacterBattleViewModel } from "@/viewmodels/exp-grind/exp-grind.viewmodel";

const props = defineProps<{
  character: ExpCharacterBattleViewModel;
  partyCharisma?: number;
}>();

const emit = defineEmits<{
  (e: "select-character", characterId: string): void;
  (e: "select-enemy", enemyId: string): void;
}>();

const borderClass = computed(() => {
  if (props.character.status === "charismaExceeded") {
    return "border-amber-500/60 bg-linear-to-b from-amber-950/25 to-[#000a1a] shadow-[0_0_12px_rgba(251,191,36,0.12)]";
  }
  if (props.character.status === "missingCharisma") {
    return "border-rose-900/50 bg-linear-to-b from-rose-950/20 to-[#000a1a]";
  }
  if (props.character.status === "missingTrophy") {
    return "border-purple-900/50 bg-linear-to-b from-purple-950/20 to-[#000a1a]";
  }
  return "border-blue-900/60 bg-[#000d24]/80 hover:border-blue-700";
});

const typeBadge = computed(() => {
  if (props.character.type === "leader") {
    return {
      label: "👑 Líder",
      class: "bg-purple-950 text-purple-300 border-purple-500/60",
    };
  }
  if (props.character.source === "tamer") {
    return {
      label: "🏆 Domador",
      class: "bg-cyan-950 text-cyan-300 border-cyan-500/60",
    };
  }
  return {
    label: "⚔️ História",
    class: "bg-rose-950 text-rose-300 border-rose-500/60",
  };
});
</script>

<template>
  <div
    class="relative rounded-lg p-3 border transition-all duration-150 hover:scale-[1.02] cursor-pointer group flex flex-col justify-between select-none"
    :class="borderClass"
    @click="emit('select-character', character.characterId)"
  >
    <!-- Header: Character Name + Type -->
    <div class="flex items-center justify-between w-full shrink-0 gap-1.5 mb-2">
      <div class="flex items-center gap-1.5 min-w-0">
        <h4
          class="text-xs font-bold text-white group-hover:text-cyan-300 truncate transition-colors"
          :title="$t(character.nameKey)"
        >
          {{ $t(character.nameKey) }}
        </h4>
      </div>

      <div class="flex items-center gap-1 shrink-0">
        <span
          class="px-1.5 py-0.2 rounded text-[9px] font-bold border shrink-0"
          :class="typeBadge.class"
        >
          {{ typeBadge.label }}
        </span>
        <span
          v-if="character.battleKind === 'digimon'"
          class="px-1 py-0.2 rounded text-[9px] font-bold bg-amber-950 text-amber-300 border border-amber-600/60 shrink-0"
        >
          ⚡
        </span>
        <span
          v-else-if="character.battleKind === 'card'"
          class="px-1 py-0.2 rounded text-[9px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/60 shrink-0"
        >
          🎴
        </span>
        <span
          v-if="character.tierNumber > 1"
          class="px-1 py-0.2 rounded text-[9px] font-bold bg-amber-950 text-amber-300 border border-amber-500/60 shrink-0 font-mono"
        >
          2ª
        </span>
      </div>
    </div>

    <!-- Center: Avatar & Quick Stats -->
    <div class="flex items-center gap-2.5 my-1">
      <!-- Portrait -->
      <div
        class="w-14 h-14 shrink-0 rounded-lg bg-[#000814] border border-blue-900/80 flex items-center justify-center overflow-hidden p-0.5 group-hover:scale-105 group-hover:border-cyan-400 transition-all shadow-inner"
      >
        <img
          v-if="character.imageUrl"
          :src="character.imageUrl"
          :alt="$t(character.nameKey)"
          class="w-full h-full object-contain rendering-pixelated"
        />
        <span v-else class="text-xl">👤</span>
      </div>

      <!-- Stats Grid for Digimon battles -->
      <div v-if="character.battleKind === 'digimon'" class="flex-1 flex flex-col gap-1 min-w-0 font-mono text-[11px]">
        <!-- EXP -->
        <div class="flex items-center justify-between">
          <span class="text-gray-400 text-[10px] flex items-center gap-1">
            <span>⚡</span> EXP:
          </span>
          <span class="font-bold text-amber-400 text-xs">
            {{ character.exp }}
          </span>
        </div>

        <!-- Bits -->
        <div class="flex items-center justify-between">
          <span class="text-gray-400 text-[10px] flex items-center gap-1">
            <span>🪙</span> Bits:
          </span>
          <span class="font-bold text-yellow-300 text-xs">
            {{ character.bits }}
          </span>
        </div>

        <!-- Efficiency -->
        <div class="flex items-center justify-between">
          <span class="text-gray-400 text-[10px] flex items-center gap-1">
            <span>🎯</span> EXP/HP:
          </span>
          <span class="font-bold text-cyan-300 text-[10px]">
            {{ character.efficiencyDisplay }}
          </span>
        </div>

        <!-- DV EXP & HP Total -->
        <div class="flex items-center justify-between text-[10px]">
          <span class="text-purple-300 font-bold">
            🔮 {{ character.dvexp }}
          </span>
          <span class="text-emerald-300/80 font-bold">
            {{ character.totalHp }} HP
          </span>
        </div>
      </div>

      <!-- Stats for Card Battles -->
      <div v-else class="flex-1 flex flex-col justify-center gap-1.5 min-w-0 font-mono">
        <div class="bg-indigo-950/60 border border-indigo-700/60 rounded p-2 flex flex-col items-center justify-center text-center shadow-inner">
          <span class="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
            <span class="text-sm">🎴</span>
            <span>{{ character.boosterId ? $t(`boosters.${character.boosterId}.name`) : 'Pacote de Cartas' }}</span>
          </span>
          <span class="text-[9px] text-indigo-300/70 uppercase tracking-wider font-semibold mt-0.5">Duelo de Cartas</span>
        </div>
      </div>
    </div>

    <!-- Status Badge Banner -->
    <div class="my-1">
      <span
        v-if="character.status === 'charismaExceeded'"
        class="w-full px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/80 font-mono shadow-[0_0_8px_rgba(251,191,36,0.25)] flex items-center justify-center gap-1"
        :title="`O carisma da tua equipa (${partyCharisma ?? character.charismaMin}) ultrapassou o limite (${character.charismaRangeText}). Guarda Digimons no Digi-Lab para baixar o Carisma e lutar!`"
      >
        <span>⚠️</span>
        <span class="truncate">Carisma Ultrapassou (Req: {{ character.charismaRangeText }})</span>
      </span>

      <span
        v-else-if="character.status === 'missingCharisma'"
        class="w-full px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-500/80 font-mono shadow-[0_0_8px_rgba(244,63,94,0.25)] flex items-center justify-center gap-1"
      >
        <span>🔒</span>
        <span class="truncate">Falta {{ character.missingCharisma }} Carisma (Req: {{ character.charismaMin }}+)</span>
      </span>

      <span
        v-else-if="character.status === 'missingTrophy'"
        class="w-full px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-500/80 font-mono flex items-center justify-center gap-1"
      >
        <span>🔒</span>
        <span v-if="character.trophyRequired === 'asukaTrophy'">Requer Troféu Asuka</span>
        <span v-else-if="character.trophyRequired === 'sunTrophy'">Requer Troféu Sun</span>
        <span v-else>Bloqueado por História</span>
      </span>
    </div>

    <!-- Team Digimons preview (for Digimon battles) -->
    <div
      v-if="character.battleKind === 'digimon' && character.party.length > 0"
      class="my-1 flex flex-col gap-1 bg-[#000c1e] p-1.5 rounded border border-blue-950"
    >
      <div class="flex items-center justify-between text-[9px] text-gray-400 font-mono">
        <span class="uppercase font-bold">Equipa ({{ character.party.length }}):</span>
        <span class="text-cyan-300 font-bold">✨ Req: {{ character.charismaRangeText }}</span>
      </div>
      <div class="flex items-center gap-1 overflow-x-auto custom-scroll pb-0.5">
        <div
          v-for="member in character.party"
          :key="member.enemyId"
          class="flex items-center gap-1 bg-[#00142f] border border-blue-800/60 rounded px-1.5 py-0.5 shrink-0 hover:border-cyan-400 transition-colors"
          :title="`${member.name} (Lv.${member.level} • ${member.hp} HP) - Ver na Wiki`"
          @click.stop="emit('select-enemy', String(member.enemyId))"
        >
          <img
            v-if="member.imageUrl"
            :src="member.imageUrl"
            :alt="member.name"
            class="w-4.5 h-4.5 object-contain digimon-artwork"
          />
          <span class="text-[9px] text-gray-300 font-bold truncate max-w-[50px]">
            {{ member.name }}
          </span>
          <span class="text-[8px] text-amber-300 font-mono font-bold">
            Lv.{{ member.level }}
          </span>
        </div>
      </div>
    </div>

    <!-- Card Battle Reward (for Card Battles in Card View) -->
    <div
      v-else-if="character.battleKind === 'card'"
      class="my-1 flex items-center justify-between bg-[#000c1e] px-2 py-1 rounded border border-blue-950"
    >
      <span class="text-[9px] text-gray-400 font-mono uppercase font-bold">Recompensa:</span>
      <span class="text-[10px] text-indigo-300 font-bold flex items-center gap-1 font-mono">
        <span>🎴</span>
        <span>{{ character.boosterId ? $t(`boosters.${character.boosterId}.name`) : 'Pacote de Cartas' }}</span>
      </span>
    </div>

    <!-- Footer: Location -->
    <div class="flex items-center justify-between pt-1 border-t border-blue-900/40 text-[10px] text-gray-400 shrink-0">
      <div class="flex items-center gap-1 truncate mr-1">
        <span>📍</span>
        <span class="text-cyan-200/90 font-medium truncate">
          {{ $t(`map.${character.locationId}`) }}
        </span>
      </div>

      <span
        v-if="character.isInCurrentMap"
        class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/70 shrink-0 animate-pulse"
      >
        Aqui no Mapa
      </span>
      <span
        v-else-if="character.isVisitedMap"
        class="text-[9px] text-gray-400 font-mono shrink-0"
      >
        👣 Visitado
      </span>
    </div>
  </div>
</template>
