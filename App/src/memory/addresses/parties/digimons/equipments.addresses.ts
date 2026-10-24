import type { AddressValueRaw } from "@/memory/addresses/address-value.raw";

export interface EquipmentsAddressesRaw {
  Head: AddressValueRaw;
  Body: AddressValueRaw;
  Right: AddressValueRaw;
  Left: AddressValueRaw;
  Accessory1: AddressValueRaw;
  Accessory2: AddressValueRaw;
}

export interface EquipmentsAddresses {
  head: number;
  body: number;
  right: number;
  left: number;
  accessory1: number;
  accessory2: number;
}
