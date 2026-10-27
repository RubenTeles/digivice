<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import Modal from "@/components/modal/Modal.vue";
import CardAlbumCard from "@/components/card-album-modal/CardAlbumCard.vue";
import WikiCardPanel from "@/components/wiki-modal/wiki-card-panel/WikiCardPanel.vue";
import { CardAlbumPresenter } from "@/presenters/card-album/card-album.presenter";
import { useGameState } from "@/composables/use-game-state";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const gameState = useGameState();
const { t } = useI18n();
const currentPage = ref(1);
const selectedCardId = ref<string | null>(null);

const pageViewModel = computed(() => {
  return CardAlbumPresenter.getPageViewModel(
    currentPage.value,
    gameState.value.cardInventory,
  );
});

const collectionPercentage = computed(() => {
  if (pageViewModel.value.totalCards === 0) {
    return "0.0";
  }
  return (
    (pageViewModel.value.totalUniqueOwned / pageViewModel.value.totalCards) *
    100
  ).toFixed(1);
});

const selectedCardName = computed(() => {
  if (!selectedCardId.value) {
    return "";
  }
  return t(`card.${selectedCardId.value}.name`);
});

const nextPage = () => {
  if (currentPage.value < CardAlbumPresenter.TOTAL_PAGES) {
    currentPage.value++;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const firstPage = () => {
  currentPage.value = 1;
};

const lastPage = () => {
  currentPage.value = CardAlbumPresenter.TOTAL_PAGES;
};

const handleSelectCard = (cardId: string) => {
  selectedCardId.value = cardId;
};

const closeCardDetails = () => {
  selectedCardId.value = null;
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!props.isOpen) {
    return;
  }

  if (selectedCardId.value !== null) {
    if (event.key === "Escape") {
      closeCardDetails();
    }
    return;
  }

  if (event.key === "ArrowLeft") {
    previousPage();
  } else if (event.key === "ArrowRight") {
    nextPage();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});

const handleClose = () => {
  if (selectedCardId.value !== null) {
    closeCardDetails();
    return;
  }
  emit("close");
};
</script>

<template>
  <Modal
    :is-open="isOpen"
    max-width="max-w-[1280px]"
    max-height="h-[710px] max-h-[710px]"
    panel-class="w-[1280px]"
    @close="handleClose"
  >
    <template #header>
      <div class="flex items-center justify-between w-full pr-4 gap-4">
        <!-- Title & Icon -->
        <div class="flex items-center gap-3 shrink-0">
          <span class="text-2xl leading-none">🎴</span>
          <h2 class="text-white font-bold tracking-widest drop-shadow whitespace-nowrap text-lg">
            {{ $t("cardAlbum.title") }}
          </h2>
        </div>

        <!-- Collection Progress & Stats -->
        <div class="flex items-center gap-4 sm:gap-6 text-xs">
          <!-- Total copies badge -->
          <div class="hidden sm:flex items-center gap-2 bg-[#001433]/70 border border-blue-800/50 px-3 py-1 rounded-md text-blue-200 shadow-inner">
            <span class="text-gray-400 font-medium">{{ $t("cardAlbum.totalCopies") }}:</span>
            <span class="font-bold text-amber-400 font-mono">{{ pageViewModel.totalCopies }}</span>
          </div>

          <!-- Unique Collection Progress -->
          <div class="flex items-center gap-3 bg-[#001433]/70 border border-blue-800/50 px-3 py-1 rounded-md shadow-inner">
            <span class="text-gray-400 font-medium">{{ $t("cardAlbum.collection") }}:</span>
            <span class="font-bold text-emerald-400 font-mono">
              {{ pageViewModel.totalUniqueOwned }} / {{ pageViewModel.totalCards }}
            </span>
            <span class="text-[10px] text-cyan-300 font-mono">({{ collectionPercentage }}%)</span>

            <!-- Progress Bar -->
            <div class="w-24 sm:w-32 h-2.5 bg-blue-950 border border-blue-800 rounded-full overflow-hidden shrink-0 shadow-inner">
              <div
                class="h-full bg-linear-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-300 rounded-full"
                :style="{ width: `${collectionPercentage}%` }"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Album 12-Card Direct Grid Body -->
    <div class="relative flex flex-1 flex-col min-h-0 h-full p-4 overflow-hidden select-none">
      <!-- 6x2 Cards Grid (12 Cards Per Page) -->
      <div class="flex-1 min-h-0 bg-[#000a18]/60 border border-blue-900/40 rounded-lg p-3 shadow-inner overflow-hidden">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 h-full">
          <CardAlbumCard
            v-for="(card, index) in pageViewModel.cards"
            :key="card ? card.cardId : `empty-slot-${index}`"
            :card="card"
            :slot-index="(currentPage - 1) * 12 + index + 1"
            @select="handleSelectCard"
          />
        </div>
      </div>

      <!-- Pagination Navigation Bar -->
      <div class="flex items-center justify-between mt-3 pt-2 border-t border-blue-900/50 shrink-0">
        <!-- Quick Jump Buttons (Previous / First) -->
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            class="px-2.5 py-1 text-xs font-bold rounded bg-blue-950/80 border border-blue-800 text-blue-300 hover:bg-blue-900 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            :disabled="currentPage === 1"
            :title="$t('cardAlbum.firstPage')"
            @click="firstPage"
          >
            «
          </button>
          <button
            type="button"
            class="px-3 py-1 text-xs font-bold rounded bg-blue-950/80 border border-blue-800 text-blue-300 hover:bg-blue-900 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            :disabled="currentPage === 1"
            :title="$t('cardAlbum.previousPage')"
            @click="previousPage"
          >
            ‹ {{ $t("cardAlbum.previousPage") }}
          </button>
        </div>

        <!-- Current Page Indicator & Quick Page Select Dropdown -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-300 font-medium">
            {{ $t("cardAlbum.page") }}
          </span>

          <select
            v-model.number="currentPage"
            class="bg-[#000f2b] border border-blue-700 text-cyan-300 font-bold font-mono text-xs rounded px-2.5 py-1 outline-none cursor-pointer hover:border-cyan-400 focus:border-cyan-400 transition-colors"
          >
            <option
              v-for="p in CardAlbumPresenter.TOTAL_PAGES"
              :key="p"
              :value="p"
            >
              {{ p }} (Cards #{{ String((p - 1) * 12 + 1).padStart(3, "0") }} - #{{ String(Math.min(p * 12, 314)).padStart(3, "0") }})
            </option>
          </select>

          <span class="text-xs text-gray-300 font-medium">
            {{ $t("cardAlbum.of") }} {{ CardAlbumPresenter.TOTAL_PAGES }}
          </span>
        </div>

        <!-- Next & Last Page Buttons -->
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            class="px-3 py-1 text-xs font-bold rounded bg-blue-950/80 border border-blue-800 text-blue-300 hover:bg-blue-900 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            :disabled="currentPage === CardAlbumPresenter.TOTAL_PAGES"
            :title="$t('cardAlbum.nextPage')"
            @click="nextPage"
          >
            {{ $t("cardAlbum.nextPage") }} ›
          </button>
          <button
            type="button"
            class="px-2.5 py-1 text-xs font-bold rounded bg-blue-950/80 border border-blue-800 text-blue-300 hover:bg-blue-900 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            :disabled="currentPage === CardAlbumPresenter.TOTAL_PAGES"
            :title="$t('cardAlbum.lastPage')"
            @click="lastPage"
          >
            »
          </button>
        </div>
      </div>
    </div>

    <!-- Card Detail Modal Overlay (WikiCardPanel layout matching the Wiki) -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="selectedCardId !== null"
          class="fixed inset-0 z-150 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
          @click.self="closeCardDetails"
        >
          <div
            class="relative w-full max-w-[1300px] h-[650px] max-h-[650px] bg-[#001122] border-2 border-[#0055ff] shadow-[0_0_20px_rgba(0,119,255,0.4)] rounded-lg flex flex-col overflow-hidden animate-modal-slide-up"
          >
            <!-- Hex Pattern Overlay -->
            <div class="absolute inset-0 opacity-[0.03] pointer-events-none" />

            <!-- Header matching Wiki Modal -->
            <div class="relative z-10 flex items-center justify-between p-4 border-b border-blue-900/60 bg-[#001433]/80 shrink-0">
              <div class="flex items-center gap-6 flex-1 min-w-0 pr-4">
                <div class="flex items-center gap-2 shrink-0 min-w-0">
                  <h2 class="text-white font-bold tracking-widest drop-shadow whitespace-nowrap">
                    {{ t("enemy.wiki") }}
                  </h2>
                </div>

                <div
                  class="flex-1 max-w-md bg-[#000a1a] border border-blue-900/60 rounded px-3 py-1.5 text-cyan-300 font-bold text-xs flex items-center shadow-inner"
                >
                  <span>{{ selectedCardName }}</span>
                </div>
              </div>

              <!-- Close button -->
              <button
                type="button"
                class="w-7 h-7 flex items-center justify-center rounded border border-blue-800/80 bg-blue-950/80 text-gray-400 hover:text-white hover:border-cyan-400 hover:bg-blue-900 transition-colors cursor-pointer text-xs font-bold shrink-0"
                @click="closeCardDetails"
              >
                ✕
              </button>
            </div>

            <!-- Body with WikiCardPanel -->
            <div class="relative z-10 flex-1 min-h-0 overflow-hidden">
              <WikiCardPanel :card-id="selectedCardId" />
            </div>

            <!-- Footer bar accent -->
            <div class="h-1 bg-linear-to-r from-blue-900 via-cyan-500 to-blue-900 shrink-0" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </Modal>
</template>
