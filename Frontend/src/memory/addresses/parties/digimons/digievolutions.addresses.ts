import type { AddressValueRaw } from "@/memory/addresses/address-value.raw";
import type { SlotAddresses, SlotAddressesRaw } from "@/memory/addresses/parties/slot.addresses";

export interface DigievolutionsAddressesRaw {
  ActiveDigievolution: AddressValueRaw;
  Slots: SlotAddressesRaw[];
  UnlockedDigievolutionsStart: AddressValueRaw;
  UnlockedDigievolutionEntryStride: AddressValueRaw;
  MaxUnlockedDigievolutions: AddressValueRaw;
  Id: AddressValueRaw;
  Level: AddressValueRaw;
  Dvexp: AddressValueRaw;
}

export interface DigievolutionsAddresses {
  activeDigievolution: number;
  slots: SlotAddresses[];
  unlockedDigievolutionsStart: number;
  unlockedDigievolutionEntryStride: number;
  maxUnlockedDigievolutions: number;
  id: number;
  level: number;
  dvexp: number;
}
