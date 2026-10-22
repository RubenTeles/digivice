import type { AddressValueRaw } from "@/memory/addresses/address-value.raw";

export interface ElementsAddressesRaw {
  Fire: AddressValueRaw;
  Water: AddressValueRaw;
  Ice: AddressValueRaw;
  Wind: AddressValueRaw;
  Thunder: AddressValueRaw;
  Machine: AddressValueRaw;
  Dark: AddressValueRaw;
}

export interface ElementsAddresses {
  fire: number;
  water: number;
  ice: number;
  wind: number;
  thunder: number;
  machine: number;
  dark: number;
}
