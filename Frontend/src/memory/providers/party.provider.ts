import type { Party } from "@/models";
import type { PartyMemoryAddresses } from "@/memory/addresses/party-memory.addresses";
import { PartyAssembler } from "@/memory/assemblers/party.assembler";
import { PartyReader } from "@/memory/readers/party.reader";
import { AddressesRepository } from "@/memory/repositories/addresses.repository";
import type { MemorySnapshot } from "@/memory/snapshot/memory.snapshot";

export class PartyProvider {
  private static getAddresses(): PartyMemoryAddresses {
    return {
      party: AddressesRepository.getPartyAddresses(),
      digimons: AddressesRepository.getDigimonsAddresses(),
      digimonStatus: AddressesRepository.getDigimonStatusAddresses(),
      inBattle: AddressesRepository.getInBattleAddresses(),
    };
  }

  public static get(snapshot: MemorySnapshot): Party {
    const resource = PartyReader.read(snapshot, PartyProvider.getAddresses());
    return PartyAssembler.assemble(resource);
  }
}
