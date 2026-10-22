import { EmulatorConnectionErrorCodes } from "@/events/emulator-connection-error-codes";
import type { ComposedState } from "@/memory/state.composer";
import { EmulatorConnectionError } from "@/memory/snapshot/emulator-connection.error";
import { MemoryReadError } from "@/memory/snapshot/memory-read.error";
import type { MemorySnapshot } from "@/memory/snapshot/memory.snapshot";
import type { SnapshotProvider } from "@/memory/snapshot/snapshot.provider";

export interface GameLoopOptions {
  snapshotProvider: SnapshotProvider;
  compose: (snapshot: MemorySnapshot) => ComposedState;
  intervalMs: number;
  onSuccess: (state: ComposedState) => void;
  onError: (code: string, detail: string | null) => void;
}

interface GameLoopError {
  code: string;
  detail: string | null;
}

export class GameLoop {
  private readonly options: GameLoopOptions;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  // Incremented on every start/stop so a tick still awaiting the snapshot never outlives its run.
  private runId = 0;
  private running = false;

  public constructor(options: GameLoopOptions) {
    this.options = options;
  }

  private static toGameLoopError(error: unknown): GameLoopError {
    if (error instanceof EmulatorConnectionError) {
      return { code: error.code, detail: error.detail };
    }

    if (error instanceof MemoryReadError) {
      return { code: EmulatorConnectionErrorCodes.MemoryReadFailed, detail: error.message };
    }

    return {
      code: EmulatorConnectionErrorCodes.StateComposeFailed,
      detail: error instanceof Error ? error.message : String(error),
    };
  }

  private async readState(): Promise<ComposedState> {
    const snapshot = await this.options.snapshotProvider.read();
    return this.options.compose(snapshot);
  }

  private async runTick(runId: number): Promise<void> {
    this.timeoutId = null;

    try {
      const state = await this.readState();
      if (runId === this.runId) {
        this.options.onSuccess(state);
      }
    } catch (error) {
      if (runId === this.runId) {
        const { code, detail } = GameLoop.toGameLoopError(error);
        this.options.onError(code, detail);
      }
    } finally {
      if (runId === this.runId) {
        this.timeoutId = setTimeout(() => void this.runTick(runId), this.options.intervalMs);
      }
    }
  }

  public get isRunning(): boolean {
    return this.running;
  }

  public start(): void {
    if (this.running) {
      return;
    }

    this.running = true;
    this.runId++;
    void this.runTick(this.runId);
  }

  public stop(): void {
    if (!this.running) {
      return;
    }

    this.running = false;
    this.runId++;

    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
