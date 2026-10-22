import type { PartyMemoryAddresses } from "@/memory/addresses/party-memory.addresses";
import type { SlotAddresses } from "@/memory/addresses/parties/slot.addresses";
import { DigimonReader } from "@/memory/readers/digimon.reader";
import type { PartyResource } from "@/memory/resources/party.resource";
import type { DigimonSlotResource } from "@/memory/resources/parties/digimon-slot.resource";
import type { MemorySnapshot } from "@/memory/snapshot/memory.snapshot";

export class PartyReader {
  private static readSlot(
    snapshot: MemorySnapshot,
    addresses: PartyMemoryAddresses,
    slot: SlotAddresses,
  ): DigimonSlotResource {
    const digimonId = snapshot.readByte(slot.address);
    const digimonAddress =
      digimonId === addresses.party.emptySlotId ? undefined : addresses.digimons.get(digimonId);

    return {
      index: slot.index,
      digimonId,
      digimon:
        digimonAddress === undefined
          ? null
          : DigimonReader.read(
              snapshot,
              digimonAddress,
              addresses.digimonStatus,
              addresses.inBattle,
              slot.index,
            ),
    };
  }

  public static read(snapshot: MemorySnapshot, addresses: PartyMemoryAddresses): PartyResource {
    return {
      slots: addresses.party.slots.map((slot) => PartyReader.readSlot(snapshot, addresses, slot)),
    };
  }
}
