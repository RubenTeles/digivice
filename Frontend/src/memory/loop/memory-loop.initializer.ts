import { AppConfig } from "@/config";
import { compareLogger, memoryLogger } from "@/events/logger";
import { DivergenceTracker } from "@/memory/comparison/divergence.tracker";
import { StateComparator, type Divergence } from "@/memory/comparison/state.comparator";
import { GameLoop } from "@/memory/loop/game.loop";
import { SnapshotProviderFactory } from "@/memory/loop/snapshot-provider.factory";
import { StateComposer } from "@/memory/state.composer";
import { useGameStore } from "@/stores/use-game-store";
import { useMemoryShadowStore } from "@/stores/use-memory-shadow-store";

const MemoryModes = ["csharp", "compare"] as const;

type MemoryMode = (typeof MemoryModes)[number];

function isMemoryMode(value: string): value is MemoryMode {
  return (MemoryModes as readonly string[]).includes(value);
}

function resolveMemoryMode(value: string | undefined): MemoryMode {
  if (!value) {
    return "csharp";
  }

  if (isMemoryMode(value)) {
    return value;
  }

  memoryLogger.warn(`Unknown VITE_MEMORY_MODE '${value}'. Falling back to 'csharp'.`);
  return "csharp";
}

function formatValue(value: unknown): string {
  return value === undefined ? "undefined" : JSON.stringify(value);
}

function formatDivergence(divergence: Divergence): string {
  return `${divergence.path}: C#=${formatValue(divergence.expected)}, TS=${formatValue(divergence.actual)}`;
}

export function initializeMemoryLoop(): void {
  if (resolveMemoryMode(AppConfig.memory.mode) !== "compare") {
    return;
  }

  const snapshotProvider = SnapshotProviderFactory.create(
    AppConfig.memory.snapshotUrl,
    AppConfig.isTauri,
  );
  if (!snapshotProvider) {
    memoryLogger.warn(
      "Compare mode needs the Tauri window or VITE_MEMORY_SNAPSHOT_URL. Memory loop not started.",
    );
    return;
  }

  const gameStore = useGameStore();
  const shadowStore = useMemoryShadowStore();
  const divergenceTracker = new DivergenceTracker(AppConfig.memory.divergenceThreshold);

  function compareWithCSharp(): void {
    const csharpState = gameStore.currentState ? StateComposer.pick(gameStore.currentState) : null;
    const divergences = [
      ...StateComparator.compare(
        { status: gameStore.healthStatus, errorCode: gameStore.lastErrorCode },
        { status: shadowStore.healthStatus, errorCode: shadowStore.lastErrorCode },
        "health",
      ),
      ...StateComparator.compare(csharpState, shadowStore.state, "state"),
    ];

    const { reported, resolved } = divergenceTracker.update(divergences);
    for (const divergence of reported) {
      compareLogger.warn(formatDivergence(divergence));
    }
    for (const path of resolved) {
      compareLogger.info(`${path}: resolved.`);
    }
  }

  function logHealthChange(previousStatus: string, previousErrorCode: string | null): void {
    if (
      previousStatus === shadowStore.healthStatus &&
      previousErrorCode === shadowStore.lastErrorCode
    ) {
      return;
    }

    if (shadowStore.healthStatus === "Error") {
      memoryLogger.info(
        `Health: Error (${shadowStore.lastErrorCode})`,
        shadowStore.lastErrorDetail ?? "",
      );
      return;
    }

    memoryLogger.info(`Health: ${shadowStore.healthStatus}`);
  }

  const gameLoop = new GameLoop({
    snapshotProvider,
    compose: (snapshot) => StateComposer.compose(snapshot),
    intervalMs: AppConfig.memory.pollingIntervalMs,
    onSuccess: (state) => {
      const previousStatus = shadowStore.healthStatus;
      const previousErrorCode = shadowStore.lastErrorCode;
      shadowStore.setSuccess(state);
      logHealthChange(previousStatus, previousErrorCode);
      compareWithCSharp();
    },
    onError: (code, detail) => {
      const previousStatus = shadowStore.healthStatus;
      const previousErrorCode = shadowStore.lastErrorCode;
      shadowStore.setError(code, detail);
      logHealthChange(previousStatus, previousErrorCode);
      compareWithCSharp();
    },
  });

  memoryLogger.info(
    `Compare mode: memory loop started (${AppConfig.memory.snapshotUrl || "read_ram"}).`,
  );
  gameLoop.start();

  if (import.meta.hot) {
    import.meta.hot.dispose(() => gameLoop.stop());
  }
}
