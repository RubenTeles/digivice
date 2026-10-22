import type { AddressValueRaw } from "@/memory/addresses/address-value.raw";
import type {
  AttributesAddresses,
  AttributesAddressesRaw,
} from "@/memory/addresses/parties/digimons/attributes.addresses";
import type {
  DigievolutionsAddresses,
  DigievolutionsAddressesRaw,
} from "@/memory/addresses/parties/digimons/digievolutions.addresses";
import type {
  ElementsAddresses,
  ElementsAddressesRaw,
} from "@/memory/addresses/parties/digimons/elements.addresses";
import type {
  EquipmentsAddresses,
  EquipmentsAddressesRaw,
} from "@/memory/addresses/parties/digimons/equipments.addresses";
import type {
  VitalAddresses,
  VitalAddressesRaw,
} from "@/memory/addresses/parties/digimons/vital.addresses";

export interface DigimonStatusAddressesRaw {
  Experience: AddressValueRaw;
  Level: AddressValueRaw;
  TP: AddressValueRaw;
  HP: VitalAddressesRaw;
  MP: VitalAddressesRaw;
  Attributes: AttributesAddressesRaw;
  Elements: ElementsAddressesRaw;
  Equipments: EquipmentsAddressesRaw;
  Digievolutions: DigievolutionsAddressesRaw;
}

export interface DigimonStatusAddresses {
  experience: number;
  level: number;
  tp: number;
  hp: VitalAddresses;
  mp: VitalAddresses;
  attributes: AttributesAddresses;
  elements: ElementsAddresses;
  equipments: EquipmentsAddresses;
  digievolutions: DigievolutionsAddresses;
}
