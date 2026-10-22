import type {
  ImportantItemsAddresses,
  ImportantItemsAddressesRaw,
} from "@/memory/addresses/important-items.addresses";
import { AddressValueConverter } from "@/memory/converters/address-value.converter";

export class ImportantItemsAddressesConverter {
  public static convert(raw: ImportantItemsAddressesRaw): ImportantItemsAddresses {
    return {
      treeBoots: AddressValueConverter.convert(raw.TreeBoots),
      fishingPole: AddressValueConverter.convert(raw.FishingPole),
      asukaTrophy: AddressValueConverter.convert(raw.AsukaTrophy),
      sunTrophy: AddressValueConverter.convert(raw.SunTrophy),
    };
  }
}
