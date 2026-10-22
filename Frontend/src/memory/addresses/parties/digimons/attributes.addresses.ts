import type { AddressValueRaw } from "@/memory/addresses/address-value.raw";

export interface AttributesAddressesRaw {
  Strength: AddressValueRaw;
  Defense: AddressValueRaw;
  Spirit: AddressValueRaw;
  Wisdom: AddressValueRaw;
  Speed: AddressValueRaw;
  Charisma: AddressValueRaw;
}

export interface AttributesAddresses {
  strength: number;
  defense: number;
  spirit: number;
  wisdom: number;
  speed: number;
  charisma: number;
}
