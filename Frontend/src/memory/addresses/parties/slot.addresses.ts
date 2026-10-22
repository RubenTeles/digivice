import type { AddressValueRaw } from "@/memory/addresses/address-value.raw";

export interface SlotAddressesRaw {
  Index: AddressValueRaw;
  Address: AddressValueRaw;
}

export interface SlotAddresses {
  index: number;
  address: number;
}
