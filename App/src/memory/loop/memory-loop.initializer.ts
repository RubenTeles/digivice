import { AppConfig } from "@/core/config";
import { memoryLogger } from "@/core/logger/logger";
import { GameLoop } from "@/memory/loop/game.loop";
import { SnapshotProviderFactory } from "@/memory/loop/snapshot-provider.factory";
import { StateComposer } from "@/memory/state.composer";
import { useGameStore } from "@/state/stores/use-game-store";

export function initializeMemoryLoop(): void {
  const snapshotProvider = SnapshotProviderFactory.create(
    AppConfig.memory.snapshotUrl,
    AppConfig.isTauri,
  );
  if (!snapshotProvider) {
    memoryLogger.warn(
      "The memory loop needs the Tauri window or VITE_MEMORY_SNAPSHOT_URL. Memory loop not started.",
    );
    return;
  }

  const gameStore = useGameStore();

  function logHealthChange(previousStatus: string, previousErrorCode: string | null): void {
    if (
      previousStatus === gameStore.healthStatus &&
      previousErrorCode === gameStore.lastErrorCode
    ) {
      return;
    }

    if (gameStore.healthStatus === "Error") {
      memoryLogger.info(
        `Health: Error (${gameStore.lastErrorCode})`,
        gameStore.lastErrorDetail ?? "",
      );
      return;
    }

    memoryLogger.info(`Health: ${gameStore.healthStatus}`);
  }

  const gameLoop = new GameLoop({
    snapshotProvider,
    compose: (snapshot) => StateComposer.compose(snapshot),
    intervalMs: AppConfig.memory.pollingIntervalMs,
    onSuccess: (state) => {
      const previousStatus = gameStore.healthStatus;
      const previousErrorCode = gameStore.lastErrorCode;
      gameStore.applyState(state);
      logHealthChange(previousStatus, previousErrorCode);
    },
    onError: (code, detail) => {
      const previousStatus = gameStore.healthStatus;
      const previousErrorCode = gameStore.lastErrorCode;
      gameStore.applyError(code, detail);
      logHealthChange(previousStatus, previousErrorCode);
    },
  });

  memoryLogger.info(`Memory loop started (${AppConfig.memory.snapshotUrl || "read_ram"}).`);
  gameLoop.start();

  if (import.meta.hot) {
    import.meta.hot.dispose(() => gameLoop.stop());
  }
}
