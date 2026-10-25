import { computed, onMounted, onUnmounted, ref } from "vue";
import { useGameStore } from "@/state/stores/use-game-store";

const ActiveStorageKey = "ui-next-active";
const ToggleKey = "F3";

export function useUiSwitcher() {
  const store = useGameStore();
  const isNextActive = ref(localStorage.getItem(ActiveStorageKey) === "true");

  const isHealthy = computed(() => store.healthStatus === "Healthy");

  function toggle(): void {
    isNextActive.value = !isNextActive.value;
    localStorage.setItem(ActiveStorageKey, String(isNextActive.value));
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (event.key !== ToggleKey) {
      return;
    }

    event.preventDefault();
    toggle();
  }

  onMounted(() => window.addEventListener("keydown", onKeyDown));
  onUnmounted(() => window.removeEventListener("keydown", onKeyDown));

  return {
    isNextActive,
    isHealthy,
  };
}
