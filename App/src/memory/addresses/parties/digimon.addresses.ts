import type { AddressValueRaw } from "@/memory/addresses/address-value.raw";

export interface DigimonAddressRaw {
  Name: string;
  MemoryBlockAddress: AddressValueRaw;
  BlastAddress: AddressValueRaw;
}

export type DigimonsAddressesRaw = Record<string, DigimonAddressRaw>;

export interface DigimonAddress {
  name: string;
  memoryBlockAddress: number;
  blastAddress: number;
}

export type DigimonsAddresses = Map<number, DigimonAddress>;
