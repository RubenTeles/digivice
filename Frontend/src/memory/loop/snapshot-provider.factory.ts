import { FileSnapshotProvider } from "@/memory/snapshot/file-snapshot.provider";
import type { SnapshotProvider } from "@/memory/snapshot/snapshot.provider";
import { TauriSnapshotProvider } from "@/memory/snapshot/tauri-snapshot.provider";

export class SnapshotProviderFactory {
  public static create(snapshotUrl: string | undefined, isTauri: boolean): SnapshotProvider | null {
    if (snapshotUrl) {
      return new FileSnapshotProvider(snapshotUrl);
    }

    if (isTauri) {
      return new TauriSnapshotProvider();
    }

    return null;
  }
}
