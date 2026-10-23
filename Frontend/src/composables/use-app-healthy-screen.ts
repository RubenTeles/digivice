import { computed } from "vue";
import { useGameStore } from "@/stores/use-game-store";
import type { AppHealthyScreenViewModel } from "@/viewmodels/app-healthy/app-healthy-screen.viewmodel";
import { EmulatorConnectionErrorHelper } from "@/presenters/helper/emulator-connection-error.helper";

export function useAppHealthyScreen() {
  const store = useGameStore();

  return computed((): AppHealthyScreenViewModel | null => {
    if (store.healthStatus === "Loading") {
      return {
        kind: "loading",
        titleKey: "errors.loading.title",
        hintKey: "errors.loading.hint",
      };
    }

    if (store.healthStatus === "Error") {
      const { titleKey, hintKey } = EmulatorConnectionErrorHelper.resolveErrorKeys(
        store.lastErrorCode,
      );

      return {
        kind: "operational-error",
        titleKey,
        hintKey,
        detail: store.lastErrorDetail ?? undefined,
      };
    }

    if (store.currentState === null) {
      return {
        kind: "loading",
        titleKey: "errors.loading.title",
        hintKey: "errors.loading.hint",
      };
    }

    return null;
  });
}
