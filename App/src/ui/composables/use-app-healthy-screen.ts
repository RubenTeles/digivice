import { computed } from "vue";
import { useGameStore } from "@/state/stores/use-game-store";
import type { AppHealthyScreenViewModel } from "@/ui/viewmodels/app-healthy/app-healthy-screen.viewmodel";
import { isKnownEmulatorConnectionErrorCode } from "@/shared/constants/emulator-connection-error-code.constant";

function resolveEmulatorErrorKeys(errorCode: string | null): { titleKey: string; hintKey: string } {
  if (errorCode !== null && isKnownEmulatorConnectionErrorCode(errorCode)) {
    return {
      titleKey: `errors.emulator.codes.${errorCode}.title`,
      hintKey: `errors.emulator.codes.${errorCode}.hint`,
    };
  }

  return {
    titleKey: "errors.emulator.title",
    hintKey: "errors.emulator.hint",
  };
}

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
      const { titleKey, hintKey } = resolveEmulatorErrorKeys(store.lastErrorCode);

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
