import type { AddressValueRaw } from "@/memory/addresses/address-value.raw";

export interface PlayerAddressesRaw {
  Bits: AddressValueRaw;
  MapId: AddressValueRaw;
  PreviousMapId: AddressValueRaw;
  SeabedRoute: AddressValueRaw;
  MapVariant: AddressValueRaw;
}

export interface PlayerAddresses {
  bits: number;
  mapId: number;
  previousMapId: number;
  seabedRoute: number;
  mapVariant: number;
}
