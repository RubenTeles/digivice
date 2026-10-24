import type {
  DigimonStatusAddresses,
  DigimonStatusAddressesRaw,
} from "@/memory/addresses/parties/digimon-status.addresses";
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
import { AddressValueConverter } from "@/memory/converters/address-value.converter";
import { VitalAddressesConverter } from "@/memory/converters/parties/digimons/vital-addresses.converter";
import { SlotAddressesConverter } from "@/memory/converters/parties/slot-addresses.converter";

export class DigimonStatusAddressesConverter {
  private static convertAttributes(raw: AttributesAddressesRaw): AttributesAddresses {
    return {
      strength: AddressValueConverter.convert(raw.Strength),
      defense: AddressValueConverter.convert(raw.Defense),
      spirit: AddressValueConverter.convert(raw.Spirit),
      wisdom: AddressValueConverter.convert(raw.Wisdom),
      speed: AddressValueConverter.convert(raw.Speed),
      charisma: AddressValueConverter.convert(raw.Charisma),
    };
  }

  private static convertElements(raw: ElementsAddressesRaw): ElementsAddresses {
    return {
      fire: AddressValueConverter.convert(raw.Fire),
      water: AddressValueConverter.convert(raw.Water),
      ice: AddressValueConverter.convert(raw.Ice),
      wind: AddressValueConverter.convert(raw.Wind),
      thunder: AddressValueConverter.convert(raw.Thunder),
      machine: AddressValueConverter.convert(raw.Machine),
      dark: AddressValueConverter.convert(raw.Dark),
    };
  }

  private static convertEquipments(raw: EquipmentsAddressesRaw): EquipmentsAddresses {
    return {
      head: AddressValueConverter.convert(raw.Head),
      body: AddressValueConverter.convert(raw.Body),
      right: AddressValueConverter.convert(raw.Right),
      left: AddressValueConverter.convert(raw.Left),
      accessory1: AddressValueConverter.convert(raw.Accessory1),
      accessory2: AddressValueConverter.convert(raw.Accessory2),
    };
  }

  private static convertDigievolutions(raw: DigievolutionsAddressesRaw): DigievolutionsAddresses {
    return {
      activeDigievolution: AddressValueConverter.convert(raw.ActiveDigievolution),
      slots: (raw.Slots ?? []).map((slot) => SlotAddressesConverter.convert(slot)),
      unlockedDigievolutionsStart: AddressValueConverter.convert(raw.UnlockedDigievolutionsStart),
      unlockedDigievolutionEntryStride: AddressValueConverter.convert(
        raw.UnlockedDigievolutionEntryStride,
      ),
      maxUnlockedDigievolutions: AddressValueConverter.convert(raw.MaxUnlockedDigievolutions),
      id: AddressValueConverter.convert(raw.Id),
      level: AddressValueConverter.convert(raw.Level),
      dvexp: AddressValueConverter.convert(raw.Dvexp),
    };
  }

  public static convert(raw: DigimonStatusAddressesRaw): DigimonStatusAddresses {
    return {
      experience: AddressValueConverter.convert(raw.Experience),
      level: AddressValueConverter.convert(raw.Level),
      tp: AddressValueConverter.convert(raw.TP),
      hp: VitalAddressesConverter.convert(raw.HP),
      mp: VitalAddressesConverter.convert(raw.MP),
      attributes: DigimonStatusAddressesConverter.convertAttributes(raw.Attributes),
      elements: DigimonStatusAddressesConverter.convertElements(raw.Elements),
      equipments: DigimonStatusAddressesConverter.convertEquipments(raw.Equipments),
      digievolutions: DigimonStatusAddressesConverter.convertDigievolutions(raw.Digievolutions),
    };
  }
}
