import type { AddressValueRaw } from "@/memory/addresses/address-value.raw";
import type {
  RequisiteAddresses,
  RequisiteAddressesRaw,
} from "@/memory/addresses/journals/quests/requisite.addresses";

export interface StepAddressesRaw {
  Number: AddressValueRaw;
  Address: AddressValueRaw;
  BitMasks?: AddressValueRaw[];
  Requisites?: RequisiteAddressesRaw[];
}

export interface StepAddresses {
  number: number;
  address: number;
  bitMasks: number[];
  requisites: RequisiteAddresses[];
}
