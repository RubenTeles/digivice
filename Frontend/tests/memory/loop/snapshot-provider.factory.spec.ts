import { describe, expect, it } from "vitest";
import { SnapshotProviderFactory } from "@/memory/loop/snapshot-provider.factory";
import { FileSnapshotProvider } from "@/memory/snapshot/file-snapshot.provider";
import { TauriSnapshotProvider } from "@/memory/snapshot/tauri-snapshot.provider";

describe("SnapshotProviderFactory", () => {
  describe("create", () => {
    it("should create a file provider when a snapshot url is set", () => {
      const provider = SnapshotProviderFactory.create("/snapshot.bin", false);

      expect(provider).toBeInstanceOf(FileSnapshotProvider);
    });

    it("should prefer the file provider when a snapshot url is set inside Tauri", () => {
      const provider = SnapshotProviderFactory.create("/snapshot.bin", true);

      expect(provider).toBeInstanceOf(FileSnapshotProvider);
    });

    it("should create a Tauri provider when there is no snapshot url inside Tauri", () => {
      const provider = SnapshotProviderFactory.create(undefined, true);

      expect(provider).toBeInstanceOf(TauriSnapshotProvider);
    });

    it("should treat an empty snapshot url as not set", () => {
      const provider = SnapshotProviderFactory.create("", true);

      expect(provider).toBeInstanceOf(TauriSnapshotProvider);
    });

    it("should return null when there is no snapshot url outside Tauri", () => {
      const provider = SnapshotProviderFactory.create(undefined, false);

      expect(provider).toBeNull();
    });
  });
});
