import { AppConfig } from "@/config";
import { compareLogger, memoryLogger } from "@/events/logger";
import { initializeSignalRHandlers } from "@/events/signalr.handlers";
import { signalRService } from "@/events/signalr.service";
import { DivergenceTracker } from "@/memory/comparison/divergence.tracker";
import { StateComparator, type Divergence } from "@/memory/comparison/state.comparator";
import { GameLoop } from "@/memory/loop/game.loop";
import { SnapshotProviderFactory } from "@/memory/loop/snapshot-provider.factory";
import { StateComposer } from "@/memory/state.composer";
import { useCSharpShadowStore } from "@/stores/use-csharp-shadow-store";
import { useGameStore } from "@/stores/use-game-store";

const MemoryModes = ["typescript", "compare"] as const;

type MemoryMode = (typeof MemoryModes)[number];

type GameStore = ReturnType<typeof useGameStore>;

function isMemoryMode(value: string): value is MemoryMode {
  return (MemoryModes as readonly string[]).includes(value);
}

function resolveMemoryMode(value: string | undefined): MemoryMode {
  if (!value) {
    return "typescript";
  }

  if (isMemoryMode(value)) {
    return value;
  }

  memoryLogger.warn(`Unknown VITE_MEMORY_MODE '${value}'. Falling back to 'typescript'.`);
  return "typescript";
}

function formatValue(value: unknown): string {
  return value === undefined ? "undefined" : JSON.stringify(value);
}

function formatDivergence(divergence: Divergence): string {
  return `${divergence.path}: C#=${formatValue(divergence.expected)}, TS=${formatValue(divergence.actual)}`;
}

function startCSharpComparison(gameStore: GameStore): () => void {
  const csharpShadowStore = useCSharpShadowStore();
  const divergenceTracker = new DivergenceTracker(AppConfig.memory.divergenceThreshold);

  initializeSignalRHandlers();
  void signalRService.startConnection();

  return () => {
    const divergences = [
      ...StateComparator.compare(
        { status: csharpShadowStore.healthStatus, errorCode: csharpShadowStore.lastErrorCode },
        { status: gameStore.healthStatus, errorCode: gameStore.lastErrorCode },
        "health",
      ),
      ...StateComparator.compare(csharpShadowStore.currentState, gameStore.currentState, "state"),
    ];

    const { reported, resolved } = divergenceTracker.update(divergences);
    for (const divergence of reported) {
      compareLogger.warn(formatDivergence(divergence));
    }
    for (const path of resolved) {
      compareLogger.info(`${path}: resolved.`);
    }
  };
}

export function initializeMemoryLoop(): void {
  const memoryMode = resolveMemoryMode(AppConfig.memory.mode);
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
  const compareWithCSharp = memoryMode === "compare" ? startCSharpComparison(gameStore) : null;

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
      compareWithCSharp?.();
    },
    onError: (code, detail) => {
      const previousStatus = gameStore.healthStatus;
      const previousErrorCode = gameStore.lastErrorCode;
      gameStore.applyError(code, detail);
      logHealthChange(previousStatus, previousErrorCode);
      compareWithCSharp?.();
    },
  });

  memoryLogger.info(
    `Memory loop started in ${memoryMode} mode (${AppConfig.memory.snapshotUrl || "read_ram"}).`,
  );
  gameLoop.start();

  if (import.meta.hot) {
    import.meta.hot.dispose(() => gameLoop.stop());
  }
}
