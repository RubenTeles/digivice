import type { PlayerAddresses, PlayerAddressesRaw } from "@/memory/addresses/player.addresses";
import { AddressValueConverter } from "@/memory/converters/address-value.converter";

export class PlayerAddressesConverter {
  public static convert(raw: PlayerAddressesRaw): PlayerAddresses {
    return {
      bits: AddressValueConverter.convert(raw.Bits),
      mapId: AddressValueConverter.convert(raw.MapId),
      previousMapId: AddressValueConverter.convert(raw.PreviousMapId),
      seabedRoute: AddressValueConverter.convert(raw.SeabedRoute),
      mapVariant: AddressValueConverter.convert(raw.MapVariant),
    };
  }
}
