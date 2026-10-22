import type { AddressValueRaw } from "@/memory/addresses/address-value.raw";

export interface AuctionAddressesRaw {
  Address: AddressValueRaw;
  BitMask: AddressValueRaw;
}

export interface AuctionsAddressesRaw {
  DivineBarrier: AuctionAddressesRaw;
  HazardShield: AuctionAddressesRaw;
  SniperShield: AuctionAddressesRaw;
  DramonShield: AuctionAddressesRaw;
  YinYangWand: AuctionAddressesRaw;
  HazardFang: AuctionAddressesRaw;
}

export interface AuctionAddresses {
  address: number;
  bitMask: number;
}

export interface AuctionsAddresses {
  divineBarrier: AuctionAddresses;
  hazardShield: AuctionAddresses;
  sniperShield: AuctionAddresses;
  dramonShield: AuctionAddresses;
  yinYangWand: AuctionAddresses;
  hazardFang: AuctionAddresses;
}
