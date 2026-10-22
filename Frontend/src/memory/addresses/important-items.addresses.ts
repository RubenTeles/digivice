import type { AddressValueRaw } from "@/memory/addresses/address-value.raw";

export interface ImportantItemsAddressesRaw {
  TreeBoots: AddressValueRaw;
  FishingPole: AddressValueRaw;
  AsukaTrophy: AddressValueRaw;
  SunTrophy: AddressValueRaw;
}

export interface ImportantItemsAddresses {
  treeBoots: number;
  fishingPole: number;
  asukaTrophy: number;
  sunTrophy: number;
}
