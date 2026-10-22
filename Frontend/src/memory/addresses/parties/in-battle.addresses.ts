import type { AddressValueRaw } from "@/memory/addresses/address-value.raw";
import type {
  VitalAddresses,
  VitalAddressesRaw,
} from "@/memory/addresses/parties/digimons/vital.addresses";

export interface InBattleAddressesRaw {
  AllySlotBase: AddressValueRaw;
  SlotStride: AddressValueRaw;
  Condition: AddressValueRaw;
  Strength: AddressValueRaw;
  Defense: AddressValueRaw;
  Speed: AddressValueRaw;
  HP: VitalAddressesRaw;
  MP: VitalAddressesRaw;
}

export interface InBattleAddresses {
  allySlotBase: number;
  slotStride: number;
  condition: number;
  strength: number;
  defense: number;
  speed: number;
  hp: VitalAddresses;
  mp: VitalAddresses;
}
