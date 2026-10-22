import type { PartyAddresses } from "@/memory/addresses/party.addresses";
import type { DigimonsAddresses } from "@/memory/addresses/parties/digimon.addresses";
import type { DigimonStatusAddresses } from "@/memory/addresses/parties/digimon-status.addresses";
import type { InBattleAddresses } from "@/memory/addresses/parties/in-battle.addresses";

export interface PartyMemoryAddresses {
  party: PartyAddresses;
  digimons: DigimonsAddresses;
  digimonStatus: DigimonStatusAddresses;
  inBattle: InBattleAddresses;
}
