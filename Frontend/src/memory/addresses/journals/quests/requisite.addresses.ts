import type { AddressValueRaw } from "@/memory/addresses/address-value.raw";

export interface RequisiteAddressesRaw {
  Id: string;
  Address: AddressValueRaw;
  BitMasks?: AddressValueRaw[];
}

export interface RequisiteAddresses {
  id: string;
  address: number;
  bitMasks: number[];
}
