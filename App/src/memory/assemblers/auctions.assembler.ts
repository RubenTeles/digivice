import type { Auctions } from "@/state/models";
import type { AuctionsResource } from "@/memory/resources/auctions.resource";

export class AuctionsAssembler {
  public static assemble(resource: AuctionsResource): Auctions {
    return {
      divineBarrier: resource.divineBarrier !== 0,
      hazardShield: resource.hazardShield !== 0,
      sniperShield: resource.sniperShield !== 0,
      dramonShield: resource.dramonShield !== 0,
      yinYangWand: resource.yinYangWand !== 0,
      hazardFang: resource.hazardFang !== 0,
    };
  }
}
