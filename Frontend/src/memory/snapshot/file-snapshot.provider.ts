import { EmulatorConnectionErrorCodes } from "@/events/emulator-connection-error-codes";
import { EmulatorConnectionError } from "@/memory/snapshot/emulator-connection.error";
import { MemorySnapshot } from "@/memory/snapshot/memory.snapshot";
import { PlayStationRamSize } from "@/memory/snapshot/snapshot.constant";
import type { SnapshotProvider } from "@/memory/snapshot/snapshot.provider";

export class FileSnapshotProvider implements SnapshotProvider {
  private readonly url: string;

  public constructor(url: string) {
    this.url = url;
  }

  public async read(): Promise<MemorySnapshot> {
    let ram: ArrayBuffer;
    try {
      const response = await fetch(this.url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      ram = await response.arrayBuffer();
    } catch (error) {
      throw new EmulatorConnectionError(
        EmulatorConnectionErrorCodes.MemoryReadFailed,
        `Failed to load snapshot '${this.url}': ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    if (ram.byteLength !== PlayStationRamSize) {
      throw new EmulatorConnectionError(
        EmulatorConnectionErrorCodes.MemoryReadFailed,
        `Snapshot '${this.url}' has ${ram.byteLength} bytes; expected ${PlayStationRamSize}.`,
      );
    }

    return new MemorySnapshot(ram);
  }
}
