import type { AddressValueRaw } from "@/memory/addresses/address-value.raw";
import type {
  VitalAddresses,
  VitalAddressesRaw,
} from "@/memory/addresses/parties/digimons/vital.addresses";

export interface EnemyAddressesRaw {
  EnemySlotBase: AddressValueRaw;
  SlotStride: AddressValueRaw;
  SlotCount: AddressValueRaw;
  ActiveEnemySlotIndex: AddressValueRaw;
  GroupId: AddressValueRaw;
  Id: AddressValueRaw;
  Condition: AddressValueRaw;
  Strength: AddressValueRaw;
  Defense: AddressValueRaw;
  Speed: AddressValueRaw;
  HP: VitalAddressesRaw;
}

export interface EnemyAddresses {
  enemySlotBase: number;
  slotStride: number;
  slotCount: number;
  activeEnemySlotIndex: number;
  groupId: number;
  id: number;
  condition: number;
  strength: number;
  defense: number;
  speed: number;
  hp: VitalAddresses;
}
