import { describe, expect, it } from "vitest";
import type { AuctionsAddresses } from "@/memory/addresses/auctions.addresses";
import { AuctionsReader } from "@/memory/readers/auctions.reader";
import { AddressesRepository } from "@/memory/repositories/addresses.repository";
import { MemoryReadError } from "@/memory/snapshot/memory-read.error";
import { MemorySnapshot } from "@/memory/snapshot/memory.snapshot";
import { PlayStationRamSize } from "@/memory/snapshot/snapshot.constant";
import { FakeSnapshotBuilder } from "../../helpers/fake-snapshot.builder";

const SharedByteAddress = 0x0004b38a;

const SyntheticAddresses: AuctionsAddresses = {
  divineBarrier: { address: SharedByteAddress, bitMask: 0x01 },
  hazardShield: { address: SharedByteAddress, bitMask: 0x02 },
  sniperShield: { address: SharedByteAddress, bitMask: 0x04 },
  dramonShield: { address: SharedByteAddress, bitMask: 0x08 },
  yinYangWand: { address: SharedByteAddress, bitMask: 0x10 },
  hazardFang: { address: SharedByteAddress, bitMask: 0x20 },
};

function createSnapshot(rawValue: number): MemorySnapshot {
  return new MemorySnapshot(
    new FakeSnapshotBuilder().writeByte(SharedByteAddress, rawValue).build(),
  );
}

describe("AuctionsReader", () => {
  describe("read", () => {
    it("should map all auction flags from the shared byte", () => {
      const resource = AuctionsReader.read(createSnapshot(0x25), SyntheticAddresses);

      expect(resource).toEqual({
        divineBarrier: 0x01,
        hazardShield: 0x00,
        sniperShield: 0x04,
        dramonShield: 0x00,
        yinYangWand: 0x00,
        hazardFang: 0x20,
      });
    });

    it("should return zero flags when the shared byte is zero", () => {
      const resource = AuctionsReader.read(createSnapshot(0x00), SyntheticAddresses);

      expect(resource).toEqual({
        divineBarrier: 0,
        hazardShield: 0,
        sniperShield: 0,
        dramonShield: 0,
        yinYangWand: 0,
        hazardFang: 0,
      });
    });

    it("should ignore bits outside the auction masks", () => {
      const resource = AuctionsReader.read(createSnapshot(0xc0), SyntheticAddresses);

      expect(Object.values(resource).every((value) => value === 0)).toBe(true);
    });

    it("should map the auctions resource when the addresses come from the real definitions", () => {
      const resource = AuctionsReader.read(
        createSnapshot(0x03),
        AddressesRepository.getAuctionsAddresses(),
      );

      expect(resource).toEqual({
        divineBarrier: 0x01,
        hazardShield: 0x02,
        sniperShield: 0x00,
        dramonShield: 0x00,
        yinYangWand: 0x00,
        hazardFang: 0x00,
      });
    });

    it("should throw MemoryReadError when an address is outside the snapshot", () => {
      const addresses: AuctionsAddresses = {
        ...SyntheticAddresses,
        hazardFang: { address: PlayStationRamSize, bitMask: 0x20 },
      };

      expect(() => AuctionsReader.read(createSnapshot(0x00), addresses)).toThrow(MemoryReadError);
    });
  });
});
