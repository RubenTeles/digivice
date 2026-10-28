<script setup lang="ts">
import { computed } from "vue";
import type { ExpCharacterBattleViewModel } from "@/viewmodels/exp-grind/exp-grind.viewmodel";

const props = defineProps<{
  character: ExpCharacterBattleViewModel;
  activeSort: "charismaAsc" | "exp" | "efficiency" | "dvexp" | "bits" | "bitsEfficiency";
  partyCharisma?: number;
}>();

const emit = defineEmits<{
  (e: "select-character", characterId: string): void;
  (e: "select-enemy", enemyId: string): void;
}>();

const borderClass = computed(() => {
  if (props.character.status === "charismaExceeded") {
    return "border-amber-500/50 bg-linear-to-r from-amber-950/25 via-[#091024] to-[#000a18] hover:border-amber-400";
  }
  if (props.character.status === "missingCharisma") {
    return "border-rose-900/50 bg-linear-to-r from-rose-950/20 via-[#0c081e] to-[#000a18] hover:border-rose-700";
  }
  if (props.character.status === "missingTrophy") {
    return "border-purple-900/50 bg-linear-to-r from-purple-950/20 via-[#0c081e] to-[#000a18] hover:border-purple-700";
  }
  return "border-blue-900/45 bg-[#000c22]/70 hover:border-blue-700/80";
});

const typeBadge = computed(() => {
  if (props.character.type === "leader") {
    return {
      label: "👑 Líder",
      class: "bg-purple-950/90 text-purple-300 border-purple-500/60",
    };
  }
  if (props.character.source === "tamer") {
    return {
      label: "🏆 Domador",
      class: "bg-cyan-950/90 text-cyan-300 border-cyan-500/60",
    };
  }
  return {
    label: "⚔️ História",
    class: "bg-rose-950/90 text-rose-300 border-rose-500/60",
  };
});
</script>

<template>
  <div
    class="w-full rounded-lg border px-3 py-2 flex items-center justify-between gap-3 transition-all duration-150 hover:bg-blue-900/20 cursor-pointer group select-none"
    :class="borderClass"
    @click="emit('select-character', character.characterId)"
  >
    <!-- Left: Character Avatar + Details -->
    <div class="flex items-center gap-3 min-w-0 flex-1">

      <!-- Character Portrait -->
      <div
        class="w-11 h-11 rounded-lg bg-[#000814] border border-blue-800/80 p-0.5 shrink-0 flex items-center justify-center overflow-hidden group-hover:scale-105 group-hover:border-cyan-400 transition-all shadow-inner"
      >
        <img
          v-if="character.imageUrl"
          :src="character.imageUrl"
          :alt="$t(character.nameKey)"
          class="w-full h-full object-contain rendering-pixelated"
        />
        <span v-else class="text-lg">👤</span>
      </div>

      <!-- Details -->
      <div class="flex flex-col min-w-0 gap-0.5">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors truncate">
            {{ $t(character.nameKey) }}
          </span>

          <!-- Type Badge -->
          <span
            class="px-1.5 py-0.2 rounded text-[10px] font-bold border shrink-0"
            :class="typeBadge.class"
          >
            {{ typeBadge.label }}
          </span>

          <!-- Battle Kind Badge -->
          <span
            v-if="character.battleKind === 'digimon'"
            class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-600/60 shrink-0"
          >
            ⚡ Digimon
          </span>
          <span
            v-else-if="character.battleKind === 'card'"
            class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-500/60 shrink-0"
          >
            🎴 Cartas
          </span>

          <!-- Battle Tier if 2nd battle -->
          <span
            v-if="character.tierNumber > 1"
            class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/60 shrink-0 font-mono"
          >
            2ª Batalha
          </span>

          <!-- STATUS BADGE -->
          <!-- 1. Carisma Ultrapassou -->
          <span
            v-if="character.status === 'charismaExceeded'"
            class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/80 shrink-0 font-mono shadow-[0_0_8px_rgba(251,191,36,0.25)] flex items-center gap-1"
            :title="`O carisma da tua equipa (${partyCharisma ?? character.charismaMin}) ultrapassou o limite deste treinador (${character.charismaRangeText}). Guarda Digimons no Digi-Lab para baixar o Carisma e lutar!`"
          >
            <span>⚠️</span>
            <span>Carisma Ultrapassou (Req: {{ character.charismaRangeText }})</span>
          </span>

          <!-- 2. Falta Carisma -->
          <span
            v-else-if="character.status === 'missingCharisma'"
            class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-500/80 shrink-0 font-mono shadow-[0_0_8px_rgba(244,63,94,0.25)] flex items-center gap-1"
          >
            <span>🔒</span>
            <span>Falta {{ character.missingCharisma }} Carisma (Req: {{ character.charismaMin }}+)</span>
          </span>

          <!-- 3. Falta Troféu -->
          <span
            v-else-if="character.status === 'missingTrophy'"
            class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-500/80 shrink-0 font-mono flex items-center gap-1"
          >
            <span>🔒</span>
            <span v-if="character.trophyRequired === 'asukaTrophy'">Requer Troféu Asuka</span>
            <span v-else-if="character.trophyRequired === 'sunTrophy'">Requer Troféu Sun</span>
            <span v-else>Bloqueado por História</span>
          </span>

          <!-- 4. Disponível -->
          <span
            v-else
            class="text-[10px] text-cyan-300 font-mono bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-800/70 shrink-0"
          >
            ✨ Req: {{ character.charismaRangeText }}
          </span>
        </div>

        <!-- Location + Party Digimons or Card Booster preview -->
        <div class="flex items-center gap-2.5 flex-wrap text-xs text-gray-400">
          <!-- Location Name -->
          <div class="flex items-center gap-1 text-[11px]">
            <span class="text-gray-400">📍</span>
            <span class="text-cyan-200/90 font-medium">
              {{ $t(`map.${character.locationId}`) }}
            </span>
            <span
              v-if="character.isInCurrentMap"
              class="ml-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/70 shrink-0 animate-pulse"
            >
              Aqui no Mapa
            </span>
          </div>

          <!-- Divider -->
          <span class="text-blue-900/80 hidden sm:inline">•</span>

          <!-- Team Digimons (for Digimon battles) -->
          <div
            v-if="character.battleKind === 'digimon' && character.party.length > 0"
            class="flex items-center gap-1.5 shrink-0"
            title="Digimons na equipa"
          >
            <span class="text-[10px] text-gray-400 uppercase font-mono font-bold hidden sm:inline">Equipa:</span>
            <div class="flex items-center gap-1">
              <div
                v-for="member in character.party"
                :key="member.enemyId"
                class="flex items-center gap-1 bg-[#001026] border border-blue-800/70 rounded px-1.5 py-0.5 hover:border-cyan-400 transition-colors"
                :title="`${member.name} (Lv.${member.level} • ${member.hp} HP) - Clica para ver na Wiki`"
                @click.stop="emit('select-enemy', String(member.enemyId))"
              >
                <img
                  v-if="member.imageUrl"
                  :src="member.imageUrl"
                  :alt="member.name"
                  class="w-5 h-5 object-contain digimon-artwork shrink-0"
                />
                <span class="text-[10px] text-gray-200 font-bold truncate max-w-[70px] hidden md:inline">
                  {{ member.name }}
                </span>
                <span class="text-[9px] text-amber-300 font-mono font-bold shrink-0">
                  Lv.{{ member.level }}
                </span>
              </div>
            </div>
          </div>

          <!-- Booster Pack Reward (for Card battles) - Uses Card icon and proper pack name -->
          <div
            v-else-if="character.battleKind === 'card'"
            class="flex items-center gap-1.5 shrink-0"
          >
            <span class="text-[10px] text-indigo-300 uppercase font-mono font-bold">Recompensa:</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950/90 text-indigo-200 border border-indigo-500/60 font-mono flex items-center gap-1.5 shadow-xs">
              <span class="text-xs">🎴</span>
              <span>{{ character.boosterId ? $t(`boosters.${character.boosterId}.name`) : 'Pacote de Cartas' }}</span>
            </span>
            <span
              v-if="character.folderId"
              class="text-[10px] text-gray-400 font-mono hidden md:inline"
            >
              ({{ character.folderId }})
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Stats & Grinding Metrics -->
    <div class="flex items-center gap-3 shrink-0 font-mono text-xs">
      <!-- For Digimon Battles: EXP, Bits, DV EXP, HP -->
      <template v-if="character.battleKind === 'digimon'">
        <!-- EXP + EXP/HP -->
        <div
          class="flex flex-col items-end min-w-22 px-2 py-0.5 rounded transition-colors"
          :class="
            activeSort === 'exp' || activeSort === 'efficiency'
              ? 'bg-amber-950/40 border border-amber-600/50 shadow-xs'
              : ''
          "
        >
          <span class="font-bold text-amber-400 flex items-center gap-1 text-sm">
            <span>⚡</span>
            <span>{{ character.exp }}</span>
          </span>
          <span class="text-[10px] text-amber-200/80" title="EXP por ponto de HP">
            {{ character.efficiencyDisplay }} <span class="text-[9px] text-gray-400">EXP/HP</span>
          </span>
        </div>

        <!-- Bits + Bits/HP -->
        <div
          class="flex flex-col items-end min-w-22 px-2 py-0.5 rounded transition-colors"
          :class="
            activeSort === 'bits' || activeSort === 'bitsEfficiency'
              ? 'bg-yellow-950/40 border border-yellow-600/50 shadow-xs'
              : ''
          "
        >
          <span class="font-bold text-yellow-300 flex items-center gap-1 text-sm">
            <span>🪙</span>
            <span>{{ character.bits }}</span>
          </span>
          <span class="text-[10px] text-yellow-200/80" title="Bits por ponto de HP">
            {{ character.bitsEfficiencyDisplay }} <span class="text-[9px] text-gray-400">Bit/HP</span>
          </span>
        </div>

        <!-- DV EXP -->
        <div
          class="flex flex-col items-end min-w-14 px-1.5 py-0.5 rounded transition-colors hidden sm:flex"
          :class="activeSort === 'dvexp' ? 'bg-purple-950/40 border border-purple-600/50 shadow-xs' : ''"
        >
          <span class="font-bold text-purple-300 text-xs">
            🔮 {{ character.dvexp }}
          </span>
          <span class="text-[9px] text-purple-200/60 uppercase">DV EXP</span>
        </div>

        <!-- Total Team HP -->
        <div class="flex flex-col items-end min-w-16 hidden md:flex">
          <span class="text-xs font-bold text-emerald-400">
            {{ character.totalHp }}
          </span>
          <span class="text-[9px] text-emerald-200/60 uppercase">HP Total</span>
        </div>
      </template>

      <!-- For Card Battles: Card Pack & Duel tag -->
      <template v-else-if="character.battleKind === 'card'">
        <div class="flex flex-col items-end min-w-32 px-2.5 py-1 rounded bg-indigo-950/50 border border-indigo-700/60 shadow-xs">
          <span class="font-bold text-indigo-200 text-xs flex items-center gap-1.5">
            <span class="text-sm">🎴</span>
            <span>{{ character.boosterId ? $t(`boosters.${character.boosterId}.name`) : 'Pacote de Cartas' }}</span>
          </span>
          <span class="text-[9px] text-indigo-300/70 uppercase tracking-wider font-semibold">Duelo de Cartas</span>
        </div>
      </template>

      <!-- Chevron -->
      <span class="text-blue-500 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all w-4 text-center">
        ›
      </span>
    </div>
  </div>
</template>
