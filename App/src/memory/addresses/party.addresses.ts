import type { AddressValueRaw } from "@/memory/addresses/address-value.raw";
import type { SlotAddresses, SlotAddressesRaw } from "@/memory/addresses/parties/slot.addresses";

export interface PartyAddressesRaw {
  Slots: SlotAddressesRaw[];
  EmptySlotId: AddressValueRaw;
}

export interface PartyAddresses {
  slots: SlotAddresses[];
  emptySlotId: number;
}
