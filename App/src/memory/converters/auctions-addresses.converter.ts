import type {
  AuctionAddresses,
  AuctionAddressesRaw,
  AuctionsAddresses,
  AuctionsAddressesRaw,
} from "@/memory/addresses/auctions.addresses";
import { AddressValueConverter } from "@/memory/converters/address-value.converter";

export class AuctionsAddressesConverter {
  private static convertAuction(raw: AuctionAddressesRaw): AuctionAddresses {
    return {
      address: AddressValueConverter.convert(raw.Address),
      bitMask: AddressValueConverter.convert(raw.BitMask),
    };
  }

  public static convert(raw: AuctionsAddressesRaw): AuctionsAddresses {
    return {
      divineBarrier: AuctionsAddressesConverter.convertAuction(raw.DivineBarrier),
      hazardShield: AuctionsAddressesConverter.convertAuction(raw.HazardShield),
      sniperShield: AuctionsAddressesConverter.convertAuction(raw.SniperShield),
      dramonShield: AuctionsAddressesConverter.convertAuction(raw.DramonShield),
      yinYangWand: AuctionsAddressesConverter.convertAuction(raw.YinYangWand),
      hazardFang: AuctionsAddressesConverter.convertAuction(raw.HazardFang),
    };
  }
}
