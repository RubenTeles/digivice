import type { EnemyAddresses, EnemyAddressesRaw } from "@/memory/addresses/enemy.addresses";
import { AddressValueConverter } from "@/memory/converters/address-value.converter";
import { VitalAddressesConverter } from "@/memory/converters/parties/digimons/vital-addresses.converter";

export class EnemyAddressesConverter {
  public static convert(raw: EnemyAddressesRaw): EnemyAddresses {
    return {
      enemySlotBase: AddressValueConverter.convert(raw.EnemySlotBase),
      slotStride: AddressValueConverter.convert(raw.SlotStride),
      slotCount: AddressValueConverter.convert(raw.SlotCount),
      activeEnemySlotIndex: AddressValueConverter.convert(raw.ActiveEnemySlotIndex),
      groupId: AddressValueConverter.convert(raw.GroupId),
      id: AddressValueConverter.convert(raw.Id),
      condition: AddressValueConverter.convert(raw.Condition),
      strength: AddressValueConverter.convert(raw.Strength),
      defense: AddressValueConverter.convert(raw.Defense),
      speed: AddressValueConverter.convert(raw.Speed),
      hp: VitalAddressesConverter.convert(raw.HP),
    };
  }
}
