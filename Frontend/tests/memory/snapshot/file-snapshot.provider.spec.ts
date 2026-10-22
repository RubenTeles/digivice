import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EmulatorConnectionErrorCodes } from "@/events/emulator-connection-error-codes";
import { EmulatorConnectionError } from "@/memory/snapshot/emulator-connection.error";
import { FileSnapshotProvider } from "@/memory/snapshot/file-snapshot.provider";
import { FakeSnapshotBuilder } from "../../helpers/fake-snapshot.builder";

const SnapshotUrl = "/tests/fixtures/snapshots/example.bin";

describe("FileSnapshotProvider", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("read", () => {
    it("should return a snapshot over the fetched file", async () => {
      fetchMock.mockResolvedValue(
        new Response(new FakeSnapshotBuilder().writeByte(0x48da0, 0x12).build()),
      );

      const snapshot = await new FileSnapshotProvider(SnapshotUrl).read();

      expect(fetchMock).toHaveBeenCalledWith(SnapshotUrl);
      expect(snapshot.readByte(0x48da0)).toBe(0x12);
    });

    it("should report memory_read_failed when the response is not ok", async () => {
      fetchMock.mockResolvedValue(new Response(null, { status: 404 }));

      const error = await new FileSnapshotProvider(SnapshotUrl)
        .read()
        .catch((reason: unknown) => reason);

      expect(error).toBeInstanceOf(EmulatorConnectionError);
      expect(error).toMatchObject({ code: EmulatorConnectionErrorCodes.MemoryReadFailed });
      expect((error as EmulatorConnectionError).detail).toContain("HTTP 404");
    });

    it("should report memory_read_failed when fetch rejects", async () => {
      fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

      const error = await new FileSnapshotProvider(SnapshotUrl)
        .read()
        .catch((reason: unknown) => reason);

      expect(error).toBeInstanceOf(EmulatorConnectionError);
      expect(error).toMatchObject({ code: EmulatorConnectionErrorCodes.MemoryReadFailed });
    });

    it("should report memory_read_failed when the file is not 2 MiB", async () => {
      fetchMock.mockResolvedValue(new Response(new FakeSnapshotBuilder(16).build()));

      const error = await new FileSnapshotProvider(SnapshotUrl)
        .read()
        .catch((reason: unknown) => reason);

      expect(error).toBeInstanceOf(EmulatorConnectionError);
      expect(error).toMatchObject({ code: EmulatorConnectionErrorCodes.MemoryReadFailed });
    });
  });
});
