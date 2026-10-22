import type { AddressValueRaw } from "@/memory/addresses/address-value.raw";

export interface VitalAddressesRaw {
  Current: AddressValueRaw;
  Max: AddressValueRaw;
}

export interface VitalAddresses {
  current: number;
  max: number;
}
