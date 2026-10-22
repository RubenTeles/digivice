import type {
  InBattleAddresses,
  InBattleAddressesRaw,
} from "@/memory/addresses/parties/in-battle.addresses";
import { AddressValueConverter } from "@/memory/converters/address-value.converter";
import { VitalAddressesConverter } from "@/memory/converters/parties/digimons/vital-addresses.converter";

export class InBattleAddressesConverter {
  public static convert(raw: InBattleAddressesRaw): InBattleAddresses {
    return {
      allySlotBase: AddressValueConverter.convert(raw.AllySlotBase),
      slotStride: AddressValueConverter.convert(raw.SlotStride),
      condition: AddressValueConverter.convert(raw.Condition),
      strength: AddressValueConverter.convert(raw.Strength),
      defense: AddressValueConverter.convert(raw.Defense),
      speed: AddressValueConverter.convert(raw.Speed),
      hp: VitalAddressesConverter.convert(raw.HP),
      mp: VitalAddressesConverter.convert(raw.MP),
    };
  }
}
