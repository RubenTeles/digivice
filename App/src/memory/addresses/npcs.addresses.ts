import type { Npcs } from "@/models";
import type { AddressValueRaw } from "@/memory/addresses/address-value.raw";

export interface NpcBattleAddressesRaw {
  Address: AddressValueRaw;
  BitMask: AddressValueRaw;
}

export interface NpcAddressesRaw {
  Battles: Record<string, NpcBattleAddressesRaw>;
}

export type NpcsAddressesRaw = Record<Capitalize<keyof Npcs>, NpcAddressesRaw>;

export interface NpcBattleAddresses {
  address: number;
  bitMask: number;
}

export interface NpcAddresses {
  battles: Record<string, NpcBattleAddresses>;
}

export type NpcsAddresses = Record<keyof Npcs, NpcAddresses>;
