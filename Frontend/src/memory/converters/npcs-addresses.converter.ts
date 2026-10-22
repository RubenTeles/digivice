import type {
  NpcAddresses,
  NpcAddressesRaw,
  NpcBattleAddresses,
  NpcBattleAddressesRaw,
  NpcsAddresses,
  NpcsAddressesRaw,
} from "@/memory/addresses/npcs.addresses";
import { AddressValueConverter } from "@/memory/converters/address-value.converter";

export class NpcsAddressesConverter {
  private static uncapitalize(name: string): string {
    return name.charAt(0).toLowerCase() + name.slice(1);
  }

  private static convertBattle(raw: NpcBattleAddressesRaw): NpcBattleAddresses {
    return {
      address: AddressValueConverter.convert(raw.Address),
      bitMask: AddressValueConverter.convert(raw.BitMask),
    };
  }

  private static convertNpc(raw: NpcAddressesRaw): NpcAddresses {
    const battles = Object.entries(raw.Battles ?? {}).map(([battleId, battle]) => [
      battleId,
      NpcsAddressesConverter.convertBattle(battle),
    ]);

    return { battles: Object.fromEntries(battles) };
  }

  public static convert(raw: NpcsAddressesRaw): NpcsAddresses {
    const npcs = Object.entries(raw).map(([name, npc]) => [
      NpcsAddressesConverter.uncapitalize(name),
      NpcsAddressesConverter.convertNpc(npc),
    ]);

    return Object.fromEntries(npcs) as NpcsAddresses;
  }
}
